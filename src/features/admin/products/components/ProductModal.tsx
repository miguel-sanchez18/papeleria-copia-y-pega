
import { useState, useEffect } from 'react';
import { Product } from '../models/product.model';
import { Category } from '../../categories/models/category.model';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../../categories/services/category.service';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [trackStock, setTrackStock] = useState(true);
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        setName(product.name);
        setDescription(product.description || '');
        setPrice(product.price.toString());
        setStock(product.stock_quantity.toString());
        setTrackStock(product.track_stock ?? true);
        setCategory(product.category_id?.toString() || '');
        setImagePreview(product.image_url || null);
      } else {
        // Reset form for create mode
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setTrackStock(true);
        setCategory('');
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('token') || '';
        const data = await CategoryService.getAll(token);
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories", error);
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limit size to 500KB for now to be safe with serverless function limits
      if (file.size > 500 * 1024) {
        alert("La imagen es demasiado grande. Por favor usa una imagen menor a 500KB.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token') || '';
      
      let imageUrl = imagePreview || '';

      const payload = {
        name,
        description,
        price: parseFloat(price),
        stock_quantity: parseInt(stock) || 0,
        track_stock: trackStock,
        category_id: parseInt(category),
        image_url: imageUrl
      };

      if (product) {
          await ProductService.update(token, product.id, payload);
      } else {
          await ProductService.create(token, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '500px', maxWidth: '90%', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1f2937' }}>{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Image Upload */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <label style={{ 
              width: '100px', height: '100px', border: '2px dashed #9ca3af', borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
              backgroundColor: '#f3f4f6'
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', color: '#6b7280' }}>📷</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nombre del Producto</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Precio</label>
              <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <input 
                        type="checkbox" 
                        id="trackStock" 
                        checked={trackStock} 
                        onChange={e => setTrackStock(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="trackStock" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Controlar Stock</label>
                </div>
              </div>
              
              {trackStock ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Stock</label>
                        {stock !== '' && (
                        <span style={{ 
                            fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                            backgroundColor: parseInt(stock) < 1 ? '#fef2f2' : parseInt(stock) < 6 ? '#fffbeb' : '#ecfdf5',
                            color: parseInt(stock) < 1 ? '#ef4444' : parseInt(stock) < 6 ? '#f59e0b' : '#10b981',
                            border: `1px solid ${parseInt(stock) < 1 ? '#ef4444' : parseInt(stock) < 6 ? '#f59e0b' : '#10b981'}20`
                        }}>
                            {parseInt(stock) < 1 ? 'Sin Stock' : parseInt(stock) < 6 ? 'Bajo Stock' : 'En Stock'}
                        </span>
                        )}
                    </div>
                    <input required type="number" value={stock} onChange={e => setStock(e.target.value)} 
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
                  </>
               ) : (
                  <div style={{ 
                      padding: '12px', borderRadius: '8px', border: '1px dashed #6366f1', backgroundColor: '#eef2ff', 
                      color: '#4338ca', fontWeight: 500, fontSize: '0.875rem', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', gap: '4px'
                  }}>
                      <span style={{ fontSize: '1.25rem' }}>∞</span>
                      <span>Stock Ilimitado (Servicio)</span>
                  </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Categoría</label>
            <select required value={category} onChange={e => setCategory(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }}>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} 
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer', fontWeight: 600 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 600 }}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

