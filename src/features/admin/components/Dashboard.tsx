
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstallPWA from '../../../components/pwa/InstallPWA';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/admin/login');
        return;
    }

    fetch('/api/admin', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            navigate('/admin/login');
            return null;
        }
        return res.json();
    })
    .then(data => {
        if (data) {
            setStats(data);
            setLoading(false);
        }
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div style={{ padding: '2rem' }}>Cargando dashboard...</div>;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Panel Administrativo</h1>
        <InstallPWA />
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Total Productos</h3>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827' }}>{stats?.productsCount || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Ventas Hoy</h3>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2563eb' }}>${Number(stats?.salesToday?.total || 0).toFixed(2)}</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stats?.salesToday?.count || 0} ventas</p>
        </div>
         <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Ventas Mes</h3>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#7c3aed' }}>${Number(stats?.salesMonth?.total || 0).toFixed(2)}</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{stats?.salesMonth?.count || 0} ventas</p>
        </div>
        <div 
          onClick={() => navigate('/admin/products/low-stock')}
          style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
        >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Bajo Stock</h3>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#dc2626' }}>{stats?.lowStock?.length || 0}</p>
        </div>
        <div 
          onClick={() => navigate('/admin/sales/history')}
          style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
        >
            <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Ventas Recientes</h3>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#10b981' }}>{stats?.recentSales?.length || 0}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Productos con Bajo Stock</h3>
        {stats?.lowStock && stats.lowStock.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {stats.lowStock.map((prod: any) => (
                    <li key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span>{prod.name}</span>
                        <span style={{ color: '#dc2626', fontWeight: 500 }}>{prod.stock_quantity} unidades</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p style={{ color: '#6b7280' }}>Todo en orden.</p>
        )}
      </div>
    </div>
  );
}
