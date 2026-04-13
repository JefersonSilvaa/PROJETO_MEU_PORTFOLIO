import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    clients: 0,
    sales: 0,
    soldItems: 0,
    revenue: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      setError('');
      try {
        const [products, clients, sales] = await Promise.all([
          api.get('/produtos'),
          api.get('/clientes'),
          api.get('/vendas')
        ]);

        let soldItems = 0;
        let revenue = 0;
        const soldMap = new Map();

        sales.data.forEach((sale) => {
          revenue += Number(sale.total || 0);
          (sale.SaleItems || []).forEach((item) => {
            const qty = Number(item.quantity || 0);
            soldItems += qty;
            const name = item.Product?.name || `Produto ${item.productId}`;
            soldMap.set(name, (soldMap.get(name) || 0) + qty);
          });
        });

        const rankedProducts = Array.from(soldMap.entries())
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setTopProducts(rankedProducts);
        setRecentSales(sales.data.slice(0, 5));
        setStats({
          products: products.data.length,
          clients: clients.data.length,
          sales: sales.data.length,
          soldItems,
          revenue
        });
      } catch (err) {
        setError('Nao foi possivel carregar o painel agora.');
      }
    }

    loadStats();
  }, []);

  return (
    <section className="dashboard-layout">
      <article className="dashboard-hero">
        <div className="hero-content">
          <h2>Sistema de Gestao Empresarial</h2>
          <p>Gerencie vendas, estoque e clientes em um unico lugar.</p>
          <div className="hero-actions">
            <button type="button" onClick={() => navigate('/')}>Ver Dashboard</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/produtos')}>Cadastrar Produto</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/vendas')}>Registrar Venda</button>
          </div>
          <div className="hero-features">
            <span>Controle de Estoque</span>
            <span>Gestao de Vendas</span>
            <span>Cadastro de Clientes</span>
          </div>
        </div>
        <div className="hero-graphic" aria-hidden="true">
          <div className="chart-card">
            <div className="bars">
              <i style={{ height: '35%' }} />
              <i style={{ height: '55%' }} />
              <i style={{ height: '70%' }} />
              <i style={{ height: '60%' }} />
              <i style={{ height: '85%' }} />
            </div>
          </div>
        </div>
      </article>

      <section className="grid stats">
        <article className="card stat"><h3>Produtos</h3><strong>{stats.products}</strong></article>
        <article className="card stat"><h3>Clientes</h3><strong>{stats.clients}</strong></article>
        <article className="card stat"><h3>Vendas</h3><strong>{stats.sales}</strong></article>
        <article className="card stat"><h3>Itens vendidos</h3><strong>{stats.soldItems}</strong></article>
        <article className="card stat"><h3>Faturamento</h3><strong>R$ {stats.revenue.toFixed(2)}</strong></article>
      </section>

      {error ? <p className="feedback error">{error}</p> : null}

      <section className="dashboard-details">
        <article className="card">
          <h3>Produtos mais vendidos</h3>
          {topProducts.length === 0 ? (
            <p>Nenhum produto vendido ainda.</p>
          ) : (
            topProducts.map((product) => (
              <div key={product.name} className="row-item">
                <span>{product.name}</span>
                <strong>{product.quantity} un.</strong>
              </div>
            ))
          )}
        </article>

        <article className="card">
          <h3>Ultimas vendas</h3>
          {recentSales.length === 0 ? (
            <p>Nenhuma venda registrada.</p>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className="row-item">
                <span>Venda #{sale.id} - {sale.Client?.name || 'Cliente'}</span>
                <strong>R$ {Number(sale.total || 0).toFixed(2)}</strong>
              </div>
            ))
          )}
        </article>
      </section>
    </section>
  );
}
