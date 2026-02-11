
import { useState, useEffect } from 'react';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | undefined;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setIcon(category.icon || '');
        setDescription(category.description || '');
      } else {
        setName('');
        setIcon('');
        setDescription('');
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token') || '';
      
      const payload = { name, icon, description };

      if (category) {
          await CategoryService.update(token, category.id, payload);
      } else {
          await CategoryService.create(token, payload);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la categoría");
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
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1f2937' }}>{category ? 'Editar Categoría' : 'Agregar Categoría'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Icono</label>
                <input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="emoji"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold', textAlign: 'center', fontSize: '1.5rem' }} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nombre</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
             </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #9ca3af', backgroundColor: 'white', color: '#111827', fontWeight: 'bold' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} 
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer', fontWeight: 600 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', opacity: loading ? 0.7 : 1, fontWeight: 600 }}>
              {loading ? 'Guardando...' : 'Guardar Categoría'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
