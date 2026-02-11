
import { useState, useEffect } from 'react';
import { Product } from '../models/product.model';

import Skeleton from '../../../../components/ui/Skeleton';

import { fetchWithAuth } from '../../../../utils/api';

export default function LowStockReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch all products and filter client-side for now, or add a specific endpoint if needed.
      // Since we already have /products, let's use that and filter.
      const res = await fetchWithAuth('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter for stock <= 2 AND tracking enabled
          const low = data.filter((p: Product) => (p.stock_quantity || 0) <= 2 && p.track_stock !== false);
          setProducts(low);
        }
      }
    } catch (error) {
      console.error("Error fetching low stock products", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (products.length === 0) return;

    const headers = ['ID', 'Producto', 'Categoría', 'Stock Actual', 'Precio'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
      p.category_name || '',
      p.stock_quantity,
      p.price
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_bajo_stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
           <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>⚠️ Reporte de Inventario Crítico</h1>
           <p style={{ color: '#6b7280', marginTop: '4px' }}>Productos con 2 unidades o menos. ¡Es hora de surtir!</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={products.length === 0}
          style={{ 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            cursor: products.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '8px',
            opacity: products.length === 0 ? 0.5 : 1
          }}
        >
          📥 Exportar a Excel (CSV)
        </button>
      </header>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#fef2f2', borderBottom: '2px solid #fee2e2' }}>
            <tr>
              <th style={{ padding: '16px', color: '#991b1b', fontWeight: 700 }}>Producto</th>
              <th style={{ padding: '16px', color: '#991b1b', fontWeight: 700 }}>Categoría</th>
              <th style={{ padding: '16px', color: '#991b1b', fontWeight: 700 }}>Precio</th>
              <th style={{ padding: '16px', color: '#991b1b', fontWeight: 700 }}>Stock Actual</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : products.length === 0 ? (
               <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#10b981', fontWeight: 500 }}>¡Excelente! No hay productos en estado crítico.</td></tr>
            ) : (
               products.map((p) => (
                 <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                   <td style={{ padding: '16px', fontWeight: 500 }}>{p.name}</td>
                   <td style={{ padding: '16px', color: '#6b7280' }}>{p.category_name}</td>
                   <td style={{ padding: '16px' }}>${Number(p.price).toFixed(2)}</td>
                   <td style={{ padding: '16px' }}>
                     <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '999px', fontWeight: 700 }}>
                       {p.stock_quantity}
                     </span>
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '16px' }}><Skeleton width="180px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="100px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="80px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="40px" height="24px" borderRadius="12px" /></td>
    </tr>
  );
}
