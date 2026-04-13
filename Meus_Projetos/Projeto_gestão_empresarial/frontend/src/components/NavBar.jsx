import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken } from '../services/auth';

export default function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <div className="brand-block">
        <span className="brand-icon">GE</span>
        <h1>Gestao Empresarial</h1>
      </div>

      <nav className="menu-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>Dashboard</NavLink>
        <NavLink to="/produtos" className={({ isActive }) => (isActive ? 'is-active' : '')}>Produtos</NavLink>
        <NavLink to="/vendas" className={({ isActive }) => (isActive ? 'is-active' : '')}>Vendas</NavLink>
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'is-active' : '')}>Clientes</NavLink>
      </nav>

      <div className="user-actions">
        <span>Notificacoes</span>
        <span>Admin</span>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
