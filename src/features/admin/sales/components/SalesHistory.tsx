
import { useState, useEffect } from 'react';
import { SalesService } from '../services/sales.service';
import { useSearchParams } from 'react-router-dom';

import Skeleton from '../../../../components/ui/Skeleton';

export default function SalesHistory() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  useEffect(() => {
    fetchSales();
  }, [startDate, endDate]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await SalesService.getAll(token, startDate, endDate);
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaleClick = async (sale: any) => {
    try {
      const token = localStorage.getItem('token') || '';
      const fullSale = await SalesService.getById(token, sale.id);
      setSelectedSale(fullSale);
    } catch (error) {
      console.error("Error fetching sale details", error);
      alert("Error al cargar detalles de la venta");
    }
  };

  const applyQuickFilter = (type: 'today' | 'week' | 'month') => {
    const today = new Date();
    let start = new Date();
    
    if (type === 'today') {
       // Start of today
    } else if (type === 'week') {
       start.setDate(today.getDate() - 7);
    } else if (type === 'month') {
       start.setMonth(today.getMonth() - 1);
    }
    
    // Format YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
    setSearchParams({ startDate: formatDate(start), endDate: formatDate(today) });
  };

  const clearFilters = () => {
      setStartDate('');
      setEndDate('');
      setSearchParams({});
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Historial de Ventas</h1>
      </header>
      
      {/* Filters */}
      <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
         <button onClick={() => applyQuickFilter('today')} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#000000', fontWeight: 500 }}>Hoy</button>
         <button onClick={() => applyQuickFilter('week')} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#000000', fontWeight: 500 }}>Última Semana</button>
         <button onClick={() => applyQuickFilter('month')} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#000000', fontWeight: 500 }}>Último Mes</button>
         <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 8px' }}></div>
         <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', color: '#000000', backgroundColor: 'white' }} />
         <span style={{ color: '#6b7280' }}>a</span>
         <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', color: '#000000', backgroundColor: 'white' }} />
         <button onClick={fetchSales} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>Filtrar</button>
         {(startDate || endDate) && (
             <button onClick={clearFilters} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>Limpiar</button>
         )}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: '#6b7280' }}>Folio</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: '#6b7280' }}>Fecha</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: '#6b7280' }}>Vendedor</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: '#6b7280' }}>Total</th>
              <th style={{ padding: '12px 24px', fontWeight: 600, color: '#6b7280' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : sales.length === 0 ? (
               <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>No se encontraron ventas en este periodo.</td></tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 24px', color: '#111827' }}>#{sale.id}</td>
                  <td style={{ padding: '12px 24px', color: '#6b7280' }}>{new Date(sale.created_at).toLocaleString()}</td>
                  <td style={{ padding: '12px 24px', color: '#6b7280' }}>{sale.username || 'Desconocido'}</td>
                  <td style={{ padding: '12px 24px', fontWeight: 600, color: '#111827' }}>${Number(sale.total).toFixed(2)}</td>
                  <td style={{ padding: '12px 24px' }}>
                    <button 
                      onClick={() => handleSaleClick(sale)}
                      style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: '0.875rem', color: '#000000' }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedSale && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
             <h2 style={{ marginTop: 0, fontSize: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>Detalle de Venta #{selectedSale.id}</h2>
             
             <div style={{ margin: '16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                   <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Fecha</p>
                   <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{new Date(selectedSale.created_at).toLocaleString()}</p>
                </div>
                <div>
                   <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Vendedor</p>
                   <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{selectedSale.username || 'Desconocido'}</p>
                </div>
                <div>
                   <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Método de Pago</p>
                   <p style={{ margin: '4px 0 0', fontWeight: 500, textTransform: 'capitalize' }}>{selectedSale.payment_method}</p>
                </div>
             </div>

             <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Productos</h3>
             <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
                <thead>
                   <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '0.875rem' }}>
                      <th style={{ textAlign: 'left', padding: '8px 0' }}>Producto</th>
                      <th style={{ textAlign: 'center', padding: '8px 0' }}>Cant.</th>
                      <th style={{ textAlign: 'right', padding: '8px 0' }}>P.Unit</th>
                      <th style={{ textAlign: 'right', padding: '8px 0' }}>Importe</th>
                   </tr>
                </thead>
                <tbody>
                   {selectedSale.items?.map((item: any) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                         <td style={{ padding: '8px 0' }}>{item.product_name || 'Producto eliminado'}</td>
                         <td style={{ textAlign: 'center', padding: '8px 0' }}>{item.quantity}</td>
                         <td style={{ textAlign: 'right', padding: '8px 0' }}>${Number(item.unit_price).toFixed(2)}</td>
                         <td style={{ textAlign: 'right', padding: '8px 0' }}>${Number(item.subtotal).toFixed(2)}</td>
                      </tr>
                   ))}
                </tbody>
                <tfoot>
                   <tr>
                      <td colSpan={3} style={{ textAlign: 'right', padding: '16px 0 0', fontWeight: 'bold' }}>Total:</td>
                      <td style={{ textAlign: 'right', padding: '16px 0 0', fontWeight: 'bold', fontSize: '1.25rem' }}>${Number(selectedSale.total).toFixed(2)}</td>
                   </tr>
                </tfoot>
             </table>

             <button 
               onClick={() => setSelectedSale(null)}
               style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 600, cursor: 'pointer' }}
             >
               Cerrar
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '12px 24px' }}><Skeleton width="40px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '12px 24px' }}><Skeleton width="140px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '12px 24px' }}><Skeleton width="100px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '12px 24px' }}><Skeleton width="60px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '12px 24px' }}><Skeleton width="80px" height="24px" borderRadius="4px" /></td>
    </tr>
  );
}
