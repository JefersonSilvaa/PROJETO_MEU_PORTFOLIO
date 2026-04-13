import { useEffect, useState } from 'react';
import api from '../services/api';
import Feedback from '../components/Feedback';

const initialForm = { name: '', email: '', phone: '' };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function loadClients() {
    const response = await api.get('/clientes');
    setClients(response.data);
  }

  useEffect(() => {
    loadClients();
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
        await api.put(`/clientes/${editingId}`, form);
        setSuccess('Cliente atualizado com sucesso.');
      } else {
        await api.post('/clientes', form);
        setSuccess('Cliente criado com sucesso.');
      }

      setForm(initialForm);
      setEditingId(null);
      await loadClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar cliente.');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    await api.delete(`/clientes/${id}`);
    await loadClients();
  }

  function edit(client) {
    setEditingId(client.id);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone || ''
    });
  }

  return (
    <section className="page-grid">
      <form className="card" onSubmit={submit}>
        <h2>Clientes</h2>
        <input name="name" value={form.name} onChange={onChange} placeholder="Nome" required />
        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={onChange} placeholder="Telefone" />
        <button type="submit" disabled={loading}>{editingId ? 'Atualizar' : 'Criar'}</button>
        <Feedback loading={loading} success={success} error={error} />
      </form>

      <div className="card">
        <h3>Lista</h3>
        {clients.map((client) => (
          <div key={client.id} className="row-item">
            <span>{client.name} | {client.email}</span>
            <div>
              <button onClick={() => edit(client)}>Editar</button>
              <button onClick={() => remove(client.id)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
