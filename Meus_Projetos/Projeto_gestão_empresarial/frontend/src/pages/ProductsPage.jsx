import { useEffect, useState } from 'react';
import api from '../services/api';
import Feedback from '../components/Feedback';

const initialForm = { name: '', description: '', price: '', stock: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function loadProducts() {
    const response = await api.get('/produtos');
    setProducts(response.data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await api.put(`/produtos/${editingId}`, form);
        setSuccess('Produto atualizado com sucesso.');
      } else {
        await api.post('/produtos', form);
        setSuccess('Produto criado com sucesso.');
      }

      setForm(initialForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    await api.delete(`/produtos/${id}`);
    await loadProducts();
  }

  function edit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock
    });
  }

  return (
    <section className="page-grid">
      <form className="card" onSubmit={submit}>
        <h2>Produtos</h2>
        <input name="name" value={form.name} onChange={onChange} placeholder="Nome" required />
        <input name="description" value={form.description} onChange={onChange} placeholder="Descricao" />
        <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} placeholder="Preco" required />
        <input name="stock" type="number" value={form.stock} onChange={onChange} placeholder="Estoque" required />
        <button type="submit" disabled={loading}>{editingId ? 'Atualizar' : 'Criar'}</button>
        <Feedback loading={loading} success={success} error={error} />
      </form>

      <div className="card">
        <h3>Lista</h3>
        {products.map((product) => (
          <div key={product.id} className="row-item">
            <span>{product.name} | R$ {Number(product.price).toFixed(2)} | Estoque: {product.stock}</span>
            <div>
              <button onClick={() => edit(product)}>Editar</button>
              <button onClick={() => remove(product.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
