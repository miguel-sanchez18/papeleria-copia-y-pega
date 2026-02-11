
import { useState, useEffect } from 'react';
import { useToast } from '../../../../context/ToastContext';
import CategoryModal from './CategoryModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { Category } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import Skeleton from '../../../../components/ui/Skeleton';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { toast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, categoryId: number | null}>({ isOpen: false, categoryId: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await CategoryService.getAll(token);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
      setError(true);
      toast("Error al cargar categorías", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.categoryId) return;

    try {
      const token = localStorage.getItem('token') || '';
      await CategoryService.delete(token, deleteModal.categoryId);
      fetchCategories(); // Reload list
      toast("Categoría eliminada", "success");
    } catch (error) {
      console.error(error);
      toast("Error al eliminar categoría", "error");
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(undefined);
        }} 
        onSuccess={() => {
          fetchCategories();
        }}
        category={editingCategory}
      />
      
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Eliminar Categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría? Si tiene productos asociados, estos quedarán sin categoría."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, categoryId: null })}
      />

      {/* Header: Search & Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar Categoría" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              outline: 'none',
              backgroundColor: '#f9fafb',
              color: '#111827', 
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

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {loading ? (
           Array.from({ length: 4 }).map((_, i) => <SkeletonCategoryCard key={i} />)
        ) : (
          filteredCategories.length > 0 ? (
            filteredCategories.map((c) => (
              <div key={c.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                border: '1px solid #f3f4f6'
              }}>
                {/* Upper Area: Icon & Name */}
                <div style={{ padding: '24px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                    {c.icon || '📁'}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', textAlign: 'center' }}>
                    {c.name}
                  </h3>
                </div>

                {/* Content Area: Description */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center', flex: 1 }}>
                    {c.description || 'Sin descripción'}
                  </p>
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                      <button 
                        onClick={() => handleOpenEditModal(c)}
                        style={{ 
                          flex: 1, padding: '8px', borderRadius: '8px', border: 'none', 
                          background: '#eff6ff', color: '#2563eb', cursor: 'pointer', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, categoryId: c.id })}
                        style={{ 
                          flex: 1, padding: '8px', borderRadius: '8px', border: 'none', 
                          background: '#fef2f2', color: '#ef4444', cursor: 'pointer', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                  </div>
                </div>
              </div>
            ))
           ) : (
             !error ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#9ca3af', backgroundColor: 'white', borderRadius: '12px' }}>
                    No se encontraron categorías.
                </div>
            ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#9ca3af', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                   <span style={{ color: '#ef4444' }}>Error al cargar.</span>
                   <button onClick={fetchCategories} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', color: '#6b7280' }}>
                        Reintentar
                   </button>
                </div>
            )
           )
        )}
      </div>
    </div>
  );
}

function SkeletonCategoryCard() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #f3f4f6',
      height: '300px'
    }}>
      <div style={{ padding: '24px', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f3f4f6', height: '140px' }}>
        <Skeleton width="60px" height="60px" borderRadius="50%" style={{ marginBottom: '16px' }} />
        <Skeleton width="120px" height="24px" borderRadius="4px" />
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton width="90%" height="16px" borderRadius="4px" style={{ marginBottom: '8px', alignSelf: 'center' }} />
        <Skeleton width="70%" height="16px" borderRadius="4px" style={{ marginBottom: 'auto', alignSelf: 'center' }} />
        
        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
          <Skeleton width="100%" height="36px" borderRadius="8px" style={{ flex: 1 }} />
          <Skeleton width="100%" height="36px" borderRadius="8px" style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
}
