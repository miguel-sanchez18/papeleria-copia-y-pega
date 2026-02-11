import { useState, useEffect } from 'react';
import { useToast } from '../../../../context/ToastContext';
import ProductModal from './ProductModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { Product } from '../models/product.model';
import Skeleton from '../../../../components/ui/Skeleton';
import { fetchWithAuth } from '../../../../utils/api';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, productId: number | null}>({ isOpen: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchWithAuth('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned non-array:", data);
          setProducts([]);
          // Optionally set error if strictly required, but empty list is safe fallback
        }
      } else {
        throw new Error(res.statusText);
      }
    } catch (error) {
      console.error("Error fetching products", error);
      setError(true);
      toast("Error al cargar productos. Intenta recargar.", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/products/${deleteModal.productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts(); // Reload list
        toast("Producto eliminado", "success");
      } else {
        toast("Error al eliminar producto", "error");
      }
    } catch (error) {
      console.error(error);
      toast("Error de conexión", "error");
    } finally {
      setDeleteModal({ isOpen: false, productId: null });
    }
  };


  const getStockStatus = (qty: number) => {
    if (qty < 1) return { color: '#ef4444', text: 'Agotado', bg: '#fef2f2' }; // Red
    if (qty < 6) return { color: '#f59e0b', text: 'Stock Bajo', bg: '#fffbeb' }; // Orange
    return { color: '#10b981', text: 'En Stock', bg: '#ecfdf5' }; // Green
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        onSuccess={() => {
          fetchProducts();
        }}
        product={editingProduct}
      />
      
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null })}
      />

      {/* Header: Search & Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar Producto" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              outline: 'none',
              backgroundColor: '#f9fafb',
              color: '#111827', // Explicit dark text
              fontWeight: 500
            }}
          />
        </div>
        <button 
          onClick={handleOpenAddModal}
          style={{ 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            cursor: 'pointer',
            fontSize: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
          }}
        >
          +
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>#</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Producto</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, width: '150px' }}>Categoría</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Precio</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Stock</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Estado</th>
              <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
                filteredProducts.length > 0 ? (
                    filteredProducts.map((p, idx) => {
              const status = getStockStatus(p.stock_quantity || 0);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', color: '#374151' }}>{idx + 1}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{p.category_name || '-'}</td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#111827' }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#111827' }}>
                    {p.track_stock === false ? (
                      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>∞</span>
                    ) : (
                      p.stock_quantity || 0
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {p.track_stock === false ? (
                        <span style={{ 
                            backgroundColor: '#e0e7ff', 
                            color: '#4338ca', 
                            padding: '4px 12px', 
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: `1px solid #4338ca20` 
                        }}>
                            Servicio
                        </span>
                    ) : (
                        <span style={{ 
                        backgroundColor: status.bg, 
                        color: status.color, 
                        padding: '4px 12px', 
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: `1px solid ${status.color}20` // extra subtle border
                        }}>
                        {status.text}
                        </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenEditModal(p)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#2563eb' }} // Blue Edit
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, productId: p.id })}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#ef4444' }} // Red Delete
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                  </tr>
                );
              })
            ) : (
                 <tr>
                    <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                        {error ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#ef4444' }}>Error al cargar datos</span>
                                <button onClick={fetchProducts} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', color: '#6b7280' }}>
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            "No se encontraron productos."
                        )}
                    </td>
                 </tr>
            )
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
      <td style={{ padding: '16px' }}>
        <Skeleton width="20px" height="16px" borderRadius="4px" />
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skeleton width="40px" height="40px" borderRadius="8px" />
          <Skeleton width="150px" height="16px" borderRadius="4px" />
        </div>
      </td>
      <td style={{ padding: '16px' }}>
        <Skeleton width="100px" height="16px" borderRadius="4px" />
      </td>
      <td style={{ padding: '16px' }}>
        <Skeleton width="60px" height="16px" borderRadius="4px" />
      </td>
      <td style={{ padding: '16px' }}>
        <Skeleton width="40px" height="16px" borderRadius="4px" />
      </td>
      <td style={{ padding: '16px' }}>
        <Skeleton width="80px" height="24px" borderRadius="12px" />
      </td>
      <td style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Skeleton width="24px" height="24px" borderRadius="4px" />
          <Skeleton width="24px" height="24px" borderRadius="4px" />
        </div>
      </td>
    </tr>
  );
}
