import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { saveToken } from '../services/auth';
import Feedback from '../components/Feedback';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@empresa.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccess = {
    email: 'admin@empresa.com',
    password: '123456'
  };

  function fillDemoAccess() {
    setEmail(demoAccess.email);
    setPassword(demoAccess.password);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      saveToken(response.data.token);
      navigate('/');
    } catch (err) {
      const isNetworkError = !err.response;
      const isDemoCredentials = email === demoAccess.email && password === demoAccess.password;

      if (isNetworkError && isDemoCredentials) {
        // Permite testar interface online mesmo sem backend publicado.
        saveToken('demo-offline-token');
        navigate('/');
        return;
      }

      setError(err.response?.data?.message || 'Falha no login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <article className="login-sidecard">
          <h1>Teste o Sistema Agora</h1>
          <p>Use o acesso de demonstracao para experimentar o painel de produtos, clientes e vendas.</p>
          <div className="demo-credentials" role="status" aria-live="polite">
            <h3>Acesso de Demonstracao</h3>
            <p><strong>Email:</strong> {demoAccess.email}</p>
            <p><strong>Senha:</strong> {demoAccess.password}</p>
            <button type="button" onClick={fillDemoAccess}>Preencher automaticamente</button>
          </div>
        </article>

        <form className="card login-card" onSubmit={handleSubmit}>
          <h2>Entrar</h2>
          <p className="login-subtitle">Acesse com Gmail e senha para validar o sistema completo.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Gmail"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
          <button type="submit" disabled={loading}>Acessar painel</button>
          <Feedback loading={loading} error={error} />
        </form>
      </section>
    </main>
  );
}
