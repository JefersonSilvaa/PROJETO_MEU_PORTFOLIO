import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import LoginPage from './pages/LoginPage';
import { isAuthenticated } from './services/auth';

function PrivateLayout({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <NavBar />
      <main className="container app-main">{children}</main>
      <footer className="app-footer">
        <p>Sistema de Gestao Empresarial | Controle de produtos, clientes e vendas</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateLayout>
            <DashboardPage />
          </PrivateLayout>
        }
      />
      <Route
        path="/produtos"
        element={
          <PrivateLayout>
            <ProductsPage />
          </PrivateLayout>
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateLayout>
            <ClientsPage />
          </PrivateLayout>
        }
      />
      <Route
        path="/vendas"
        element={
          <PrivateLayout>
            <SalesPage />
          </PrivateLayout>
        }
      />
    </Routes>
  );
}
