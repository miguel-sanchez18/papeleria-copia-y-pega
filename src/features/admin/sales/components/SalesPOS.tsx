import { useState, useEffect } from 'react';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useToast } from '../../../../context/ToastContext';
import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/sale.model';
import { ProductService } from '../../products/services/product.service';
import { SalesService } from '../services/sales.service';

export default function SalesPOS() {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  
  // Payment State
  const [amountPaid, setAmountPaid] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const data = await ProductService.getAll(token);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    // Check stock only if tracked
    if (product.track_stock !== false && product.stock_quantity <= 0) {
      error("¡Producto agotado!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Check limit only if tracked
        if (product.track_stock !== false && existing.quantity >= product.stock_quantity) {
          error(`Solo hay ${product.stock_quantity} unidades disponibles.`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * Number(item.price) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, subtotal: Number(product.price) }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        if (!product) return item;

        const newQty = item.quantity + delta;
        
        // Prevent going below 1
        if (newQty < 1) return item;

        // Prevent exceeding stock (only if tracked)
        if (product.track_stock !== false && newQty > product.stock_quantity) {
           error(`Solo hay ${product.stock_quantity} unidades disponibles.`);
           return item;
        }

        return { ...item, quantity: newQty, subtotal: newQty * Number(item.price) };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const paidVal = parseFloat(amountPaid) || 0;
  const change = paidVal - total;
  const isPaymentSufficient = !amountPaid || paidVal >= total; // If empty, assume exact payment for now, or enforce? User said "leave empty assumes exact".

  const handleFinalizeSale = async () => {
    if (!isPaymentSufficient && amountPaid) {
      error("El monto pagado es insuficiente");
      return;
    }
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || '';
      const payload = {
        total,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.subtotal
        }))
      };

      await SalesService.create(token, payload);

      success(`¡Venta registrada! Cambio: $${(amountPaid ? change : 0).toFixed(2)}`);
      setCart([]);
      setAmountPaid('');
      fetchProducts(); // Refresh stock
    } catch (err) {
      console.error(err);
      error("Error al registrar la venta");
    } finally {
      setProcessing(false);
      setConfirmModal(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pos-container-responsive" style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '24px', padding: '20px' }}>
      
      {/* LEFT PANEL: CURRENT SALE (CART) */}
      <div className="pos-panel" style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
          <h2 style={{ margin: 0, color: '#111827' }}>🛒 Venta Actual</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
           {/* ... (Cart Table remains unchanged) ... */}
           {cart.length === 0 ? (
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
               <span style={{ fontSize: '3rem', marginBottom: '10px' }}>🧾</span>
               <p>El carrito está vacío</p>
               <p style={{ fontSize: '0.875rem' }}>Selecciona productos del panel derecho</p>
             </div>
           ) : (
             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280', fontSize: '0.875rem' }}>
                   <th style={{ textAlign: 'left', padding: '10px' }}>Producto</th>
                   <th style={{ textAlign: 'center', padding: '10px' }}>Precio</th>
                   <th style={{ textAlign: 'center', padding: '10px' }}>Cant.</th>
                   <th style={{ textAlign: 'right', padding: '10px' }}>Total</th>
                   <th style={{ width: '40px' }}></th>
                 </tr>
               </thead>
               <tbody>
                 {cart.map(item => (
                   <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                     <td style={{ padding: '12px 10px', fontWeight: 500, color: '#111827' }}>{item.name}</td>
                     <td style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280' }}>${Number(item.price).toFixed(2)}</td>
                     <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
                         <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', padding: '0 4px', color: '#374151' }}>-</button>
                         <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 600, color: '#111827' }}>{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', padding: '0 4px', color: '#374151' }}>+</button>
                       </div>
                     </td>
                     <td style={{ textAlign: 'right', padding: '12px 10px', fontWeight: 600, color: '#111827' }}>${item.subtotal.toFixed(2)}</td>
                     <td style={{ textAlign: 'center' }}>
                       <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
           {/* Payment Inputs */}
           <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ color: '#4b5563', fontWeight: 500 }}>Monto Pagado:</span>
                 <div style={{ position: 'relative', width: '120px' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>$</span>
                    <input 
                      type="number" 
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      placeholder={total.toFixed(2)}
                      style={{ 
                        width: '100%', padding: '8px 8px 8px 24px', borderRadius: '6px', 
                        border: '1px solid #d1d5db', outline: 'none', textAlign: 'right',
                        fontWeight: 600, fontSize: '1rem', color: '#111827',
                        backgroundColor: 'white'
                      }}
                    />
                 </div>
              </div>
              
              {amountPaid && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #e5e7eb' }}>
                     <span style={{ color: change >= 0 ? '#059669' : '#ef4444', fontWeight: 600 }}>Cambio:</span>
                     <span style={{ fontSize: '1.25rem', fontWeight: 800, color: change >= 0 ? '#059669' : '#ef4444' }}>
                        ${change.toFixed(2)}
                     </span>
                  </div>
              )}
           </div>

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <span style={{ fontSize: '1.125rem', color: '#6b7280' }}>Total a Pagar</span>
             <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>${total.toFixed(2)}</span>
           </div>
           
           <button 
             disabled={cart.length === 0 || processing || !isPaymentSufficient}
             onClick={() => setConfirmModal(true)}
             style={{ 
               width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
               background: (cart.length === 0 || !isPaymentSufficient) ? '#d1d5db' : '#10b981', 
               color: 'white', fontSize: '1rem', fontWeight: 700, 
               cursor: (cart.length === 0 || !isPaymentSufficient) ? 'not-allowed' : 'pointer',
               boxShadow: (cart.length === 0 || !isPaymentSufficient) ? 'none' : '0 4px 6px rgba(16, 185, 129, 0.4)',
               transition: 'background 0.2s'
             }}
           >
             {processing ? 'Procesando...' : (amountPaid && change < 0) ? 'Monto Insuficiente' : 'Finalizar Venta ✨'}
           </button>
        </div>
      </div>

      {/* RIGHT PANEL: PRODUCT CATALOG */}
      <div className="pos-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', backgroundColor: 'transparent', color: '#1f2937' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', alignContent: 'start' }}>
          {loading ? (
             Array.from({ length: 8 }).map((_, i) => <SkeletonProductCard key={i} />)
          ) : (
            filteredProducts.map(p => {
             const isOutOfStock = p.track_stock !== false && p.stock_quantity <= 0;
             return (
              <div 
                key={p.id} 
                onClick={() => !isOutOfStock && addToCart(p)}
                style={{ 
                  backgroundColor: 'white', borderRadius: '12px', padding: '12px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  opacity: isOutOfStock ? 0.6 : 1,
                  filter: isOutOfStock ? 'grayscale(1)' : 'none',
                  transition: 'transform 0.1s', border: '1px solid transparent',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  position: 'relative'
                }}
                onMouseEnter={e => !isOutOfStock && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => !isOutOfStock && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isOutOfStock && (
                  <div style={{
                    position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 10, borderRadius: '12px',
                    fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px',
                    fontSize: '0.8rem', textShadow: '0 0 2px white'
                  }}>
                    Agotado
                  </div>
                )}
                <div style={{ height: '100px', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.875rem', color: '#1f2937', lineHeight: 1.2 }}>{p.name}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: isOutOfStock ? '#ef4444' : '#6b7280', fontWeight: isOutOfStock ? 700 : 400 }}>
                      {p.track_stock === false ? 'Stock: ∞' : `Stock: ${p.stock_quantity}`}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#2563eb' }}>${Number(p.price).toFixed(2)}</p>
                </div>
              </div>
            );
          })
          )}
          {!loading && filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#9ca3af' }}>No se encontraron productos</div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal}
        title="Confirmar Venta"
        message={`¿Deseas finalizar la venta por un total de $${total.toFixed(2)}?`}
        confirmText="Finalizar Venta"
        cancelText="Cancelar"
        variant="primary"
        onConfirm={handleFinalizeSale}
        onCancel={() => setConfirmModal(false)}
      />
    </div>
  );
}

function SkeletonProductCard() {
  return (
    <div style={{ 
      backgroundColor: 'white', borderRadius: '12px', padding: '12px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
      display: 'flex', flexDirection: 'column', gap: '8px',
      border: '1px solid #eee'
    }}>
      <div className="skeleton" style={{ width: '100%', height: '100px', borderRadius: '8px' }}></div>
      <div>
        <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px', marginBottom: '4px' }}></div>
        <div className="skeleton" style={{ width: '50%', height: '12px', borderRadius: '4px', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ width: '40%', height: '16px', borderRadius: '4px' }}></div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
