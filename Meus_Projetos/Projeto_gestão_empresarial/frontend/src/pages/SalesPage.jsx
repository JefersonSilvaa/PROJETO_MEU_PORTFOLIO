import { useEffect, useState } from 'react';
import api from '../services/api';
import Feedback from '../components/Feedback';

export default function SalesPage() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [clientId, setClientId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    const [clientsRes, productsRes, salesRes] = await Promise.all([
      api.get('/clientes'),
      api.get('/produtos'),
      api.get('/vendas')
    ]);

    setClients(clientsRes.data);
    setProducts(productsRes.data);
    setSales(salesRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  function addItem() {
    if (!productId || quantity <= 0) return;
    setItems((prev) => [...prev, { productId: Number(productId), quantity: Number(quantity) }]);
    setProductId('');
    setQuantity(1);
  }

  const total = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;
    return acc + Number(product.price) * Number(item.quantity);
  }, 0);

  async function createSale(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/vendas', {
        clientId: Number(clientId),
        items
      });

      setClientId('');
      setItems([]);
      setSuccess('Venda registrada com sucesso.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar venda.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClearSales() {
    const confirmed = window.confirm(
      'Deseja limpar o historico de vendas? O estoque sera devolvido automaticamente.'
    );
    if (!confirmed) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete('/vendas/limpar');
      setItems([]);
      setSuccess('Historico de vendas limpo com sucesso.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao limpar vendas.');
    } finally {
      setLoading(false);
    }
  }

  async function handleClearAll() {
    const confirmed = window.confirm(
      'Deseja limpar TUDO? Isso apaga vendas, produtos e clientes para reset de teste.'
    );
    if (!confirmed) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete('/vendas/limpar-tudo');
      setClientId('');
      setProductId('');
      setQuantity(1);
      setItems([]);
      setSuccess('Todos os dados de teste foram limpos.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao limpar tudo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-grid">
      <form className="card" onSubmit={createSale}>
        <h2>Nova Venda</h2>

        <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
          <option value="">Selecione o cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        <div className="inline-row">
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Selecione o produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} | Estoque: {product.stock}
              </option>
            ))}
          </select>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <button type="button" onClick={addItem}>Adicionar</button>
        </div>

        <div>
          {items.map((item, index) => {
            const product = products.find((p) => p.id === item.productId);
            return (
              <p key={`${item.productId}-${index}`}>
                {product?.name || 'Produto'} - Qtd: {item.quantity}
              </p>
            );
          })}
        </div>

        <strong>Total calculado: R$ {total.toFixed(2)}</strong>

        <button type="submit" disabled={loading || items.length === 0}>Confirmar venda</button>
        <div className="clean-actions">
          <button type="button" onClick={handleClearSales} disabled={loading}>Limpar vendas</button>
          <button type="button" className="danger-button" onClick={handleClearAll} disabled={loading}>Limpar tudo</button>
        </div>
        <Feedback loading={loading} success={success} error={error} />
      </form>

      <div className="card">
        <h3>Vendas realizadas</h3>
        {sales.map((sale) => (
          <div key={sale.id} className="row-item sale-item">
            <span>Venda #{sale.id} | Cliente: {sale.Client?.name} | Total: R$ {Number(sale.total).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
