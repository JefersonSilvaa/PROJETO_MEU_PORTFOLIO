import axios from 'axios';
import { getToken, clearToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const DEMO_TOKEN = 'demo-offline-token';
const DEMO_DB_KEY = 'gestao_demo_db_v1';

function isDemoMode() {
  return getToken() === DEMO_TOKEN;
}

function seedDb() {
  return {
    nextIds: { client: 3, product: 4, sale: 1 },
    clients: [
      { id: 1, name: 'Maria Souza', email: 'maria@empresa.com', phone: '11999990001' },
      { id: 2, name: 'Joao Lima', email: 'joao@empresa.com', phone: '11999990002' }
    ],
    products: [
      { id: 1, name: 'Teclado Mecanico', description: 'Switch brown', price: 249.9, stock: 12 },
      { id: 2, name: 'Mouse Gamer', description: 'RGB 16000 DPI', price: 149.9, stock: 18 },
      { id: 3, name: 'Monitor 24', description: 'Full HD IPS', price: 899.9, stock: 6 }
    ],
    sales: []
  };
}

function readDb() {
  const raw = localStorage.getItem(DEMO_DB_KEY);
  if (!raw) {
    const db = seedDb();
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(db));
    return db;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const db = seedDb();
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(db));
    return db;
  }
}

function writeDb(db) {
  localStorage.setItem(DEMO_DB_KEY, JSON.stringify(db));
}

function buildSalesView(db) {
  return db.sales.map((sale) => {
    const client = db.clients.find((c) => c.id === sale.clientId);
    return {
      ...sale,
      Client: client ? { ...client } : null,
      SaleItems: sale.SaleItems.map((item) => {
        const product = db.products.find((p) => p.id === item.productId);
        return {
          ...item,
          Product: product ? { ...product } : null
        };
      })
    };
  });
}

function parseIdFromPath(path) {
  const parts = path.split('/').filter(Boolean);
  const id = Number(parts[parts.length - 1]);
  return Number.isFinite(id) ? id : null;
}

async function handleDemoRequest(method, path, payload) {
  const db = readDb();

  if (method === 'post' && path === '/auth/login') {
    const email = payload?.email;
    const password = payload?.password;
    if (email === 'admin@empresa.com' && password === '123456') {
      return { data: { token: DEMO_TOKEN } };
    }
    throw { response: { data: { message: 'Credenciais invalidas.' }, status: 401 } };
  }

  if (method === 'get' && path === '/clientes') {
    return { data: db.clients };
  }

  if (method === 'post' && path === '/clientes') {
    const client = {
      id: db.nextIds.client++,
      name: payload.name,
      email: payload.email,
      phone: payload.phone || ''
    };
    db.clients.push(client);
    writeDb(db);
    return { data: client };
  }

  if (method === 'put' && path.startsWith('/clientes/')) {
    const id = parseIdFromPath(path);
    const index = db.clients.findIndex((c) => c.id === id);
    if (index === -1) throw { response: { data: { message: 'Cliente nao encontrado.' }, status: 404 } };
    db.clients[index] = { ...db.clients[index], ...payload, id };
    writeDb(db);
    return { data: db.clients[index] };
  }

  if (method === 'delete' && path.startsWith('/clientes/')) {
    const id = parseIdFromPath(path);
    db.clients = db.clients.filter((c) => c.id !== id);
    db.sales = db.sales.filter((s) => s.clientId !== id);
    writeDb(db);
    return { data: { ok: true } };
  }

  if (method === 'get' && path === '/produtos') {
    return { data: db.products };
  }

  if (method === 'post' && path === '/produtos') {
    const product = {
      id: db.nextIds.product++,
      name: payload.name,
      description: payload.description || '',
      price: Number(payload.price || 0),
      stock: Number(payload.stock || 0)
    };
    db.products.push(product);
    writeDb(db);
    return { data: product };
  }

  if (method === 'put' && path.startsWith('/produtos/')) {
    const id = parseIdFromPath(path);
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) throw { response: { data: { message: 'Produto nao encontrado.' }, status: 404 } };
    db.products[index] = {
      ...db.products[index],
      ...payload,
      id,
      price: Number(payload.price ?? db.products[index].price),
      stock: Number(payload.stock ?? db.products[index].stock)
    };
    writeDb(db);
    return { data: db.products[index] };
  }

  if (method === 'delete' && path.startsWith('/produtos/')) {
    const id = parseIdFromPath(path);
    db.products = db.products.filter((p) => p.id !== id);
    db.sales = db.sales.map((sale) => ({
      ...sale,
      SaleItems: sale.SaleItems.filter((i) => i.productId !== id)
    }));
    writeDb(db);
    return { data: { ok: true } };
  }

  if (method === 'get' && path === '/vendas') {
    return { data: buildSalesView(db) };
  }

  if (method === 'post' && path === '/vendas') {
    const clientId = Number(payload?.clientId);
    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (!clientId || items.length === 0) {
      throw { response: { data: { message: 'Dados de venda invalidos.' }, status: 400 } };
    }

    let total = 0;
    const saleItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const product = db.products.find((p) => p.id === productId);

      if (!product || quantity <= 0) {
        throw { response: { data: { message: 'Item de venda invalido.' }, status: 400 } };
      }

      if (product.stock < quantity) {
        throw { response: { data: { message: `Estoque insuficiente para ${product.name}.` }, status: 400 } };
      }

      product.stock -= quantity;
      total += Number(product.price) * quantity;
      saleItems.push({ productId, quantity });
    }

    const sale = {
      id: db.nextIds.sale++,
      clientId,
      total,
      SaleItems: saleItems
    };

    db.sales.unshift(sale);
    writeDb(db);
    return { data: sale };
  }

  if (method === 'delete' && path === '/vendas/limpar') {
    for (const sale of db.sales) {
      for (const item of sale.SaleItems) {
        const product = db.products.find((p) => p.id === item.productId);
        if (product) product.stock += Number(item.quantity || 0);
      }
    }
    db.sales = [];
    writeDb(db);
    return { data: { ok: true } };
  }

  if (method === 'delete' && path === '/vendas/limpar-tudo') {
    const reset = seedDb();
    writeDb(reset);
    return { data: { ok: true } };
  }

  throw { response: { data: { message: 'Rota nao suportada no modo demo.' }, status: 404 } };
}

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

const client = {
  async get(path) {
    if (isDemoMode()) return handleDemoRequest('get', path);

    try {
      return await api.get(path);
    } catch (error) {
      if (!error.response && isDemoMode()) return handleDemoRequest('get', path);
      throw error;
    }
  },

  async post(path, payload) {
    if (isDemoMode()) return handleDemoRequest('post', path, payload);

    try {
      return await api.post(path, payload);
    } catch (error) {
      if (!error.response && path === '/auth/login' && payload?.email === 'admin@empresa.com' && payload?.password === '123456') {
        return handleDemoRequest('post', path, payload);
      }
      if (!error.response && isDemoMode()) return handleDemoRequest('post', path, payload);
      throw error;
    }
  },

  async put(path, payload) {
    if (isDemoMode()) return handleDemoRequest('put', path, payload);

    try {
      return await api.put(path, payload);
    } catch (error) {
      if (!error.response && isDemoMode()) return handleDemoRequest('put', path, payload);
      throw error;
    }
  },

  async delete(path) {
    if (isDemoMode()) return handleDemoRequest('delete', path);

    try {
      return await api.delete(path);
    } catch (error) {
      if (!error.response && isDemoMode()) return handleDemoRequest('delete', path);
      throw error;
    }
  }
};

export default client;
