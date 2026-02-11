
import { useState, useEffect } from 'react';
import { useToast } from '../../../../context/ToastContext';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import Skeleton from '../../../../components/ui/Skeleton';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin', full_name: '', email: '' });
  const [error, setError] = useState(false);
  
  // Modal State
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: number | null; isActive: boolean }>({
      isOpen: false,
      userId: null,
      isActive: false
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem('token') || '';
      const data = await UserService.getAll(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(true);
      toast("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      await UserService.create(token, newUser);
      
      toast("Usuario creado exitosamente", "success");
      setShowAddModal(false);
      setNewUser({ username: '', password: '', role: 'admin', full_name: '', email: '' });
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast(err.message || "Error al crear usuario", "error");
    }
  };

  const initiateToggleStatus = (id: number, currentStatus: boolean) => {
      setConfirmModal({
          isOpen: true,
          userId: id,
          isActive: currentStatus
      });
  };

  const confirmToggleStatus = async () => {
      if (confirmModal.userId === null) return;

      try {
          const token = localStorage.getItem('token') || '';
          await UserService.toggleStatus(token, confirmModal.userId, !confirmModal.isActive);

          const action = !confirmModal.isActive ? 'activado' : 'desactivado';
          toast(`Usuario ${action} correctamente`, "success");
          fetchUsers();
      } catch (error) {
          console.error(error);
          toast("Error al actualizar estado", "error");
      } finally {
          setConfirmModal({ isOpen: false, userId: null, isActive: false });
      }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>👥 Gestión de Usuarios</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            backgroundColor: '#2196f3', color: 'white', border: 'none', 
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)'
          }}
        >
          + Agregar Usuario
        </button>
      </div>

      {loading ? (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Usuario</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Nombre</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Rol</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Usuario</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Nombre</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Rol</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Estado</th>
                <th style={{ padding: '16px', fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                // ... users mapping ...
                users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {/* ... (keep user row content same) ... */}
                    <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{u.username}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#374151' }}>{u.full_name || '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        backgroundColor: u.role === 'master' ? '#ede9fe' : '#e0f2fe', 
                        color: u.role === 'master' ? '#7c3aed' : '#0284c7', 
                        padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                        <span style={{
                            color: u.is_active ? '#10b981' : '#9ca3af',
                            fontWeight: 600, fontSize: '0.875rem'
                        }}>
                            {u.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                        {u.role !== 'master' && (
                            <div 
                              onClick={() => initiateToggleStatus(u.id, u.is_active)}
                              style={{ 
                                position: 'relative', width: '44px', height: '24px', 
                                backgroundColor: u.is_active ? '#3b82f6' : '#e5e7eb', 
                                borderRadius: '9999px', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out',
                                display: 'inline-flex', alignItems: 'center', padding: '2px'
                              }}
                            >
                              <div style={{
                                width: '20px', height: '20px', 
                                backgroundColor: 'white', borderRadius: '50%', 
                                transform: u.is_active ? 'translateX(20px)' : 'translateX(0)',
                                transition: 'transform 0.2s ease-in-out',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }} />
                            </div>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                        {error ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#ef4444' }}>Error al cargar datos</span>
                                <button onClick={fetchUsers} style={{ background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', color: '#6b7280' }}>
                                    Reintentar
                                </button>
                            </div>
                        ) : (
                            "No se encontraron usuarios."
                        )}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Nuevo Usuario</h3>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Usuario</label>
                <input 
                  type="text" required
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Nombre Completo</label>
                <input 
                  type="text" required
                  value={newUser.full_name}
                  onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Email</label>
                <input 
                  type="email" required
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Contraseña</label>
                <input 
                  type="password" required
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Rol</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937' }}
                >
                  <option value="admin">Administrador</option>
                  <option value="master">Master</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancelar
                </button>

                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#2196f3', color: 'white', cursor: 'pointer', fontWeight: 600 }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.isActive ? "Desactivar Usuario" : "Activar Usuario"}
        message={`¿Estás seguro de que deseas ${confirmModal.isActive ? 'desactivar' : 'activar'} a este usuario? ${confirmModal.isActive ? 'No podrá acceder al sistema.' : 'Podrá volver a acceder al sistema.'}`}
        confirmText={confirmModal.isActive ? "Desactivar" : "Activar"}
        cancelText="Cancelar"
        variant={confirmModal.isActive ? 'danger' : 'primary'}
        onConfirm={confirmToggleStatus}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '16px' }}>
          <Skeleton width="100px" height="16px" borderRadius="4px" style={{ marginBottom: '4px' }} />
          <Skeleton width="140px" height="12px" borderRadius="4px" />
      </td>
      <td style={{ padding: '16px' }}><Skeleton width="120px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="80px" height="24px" borderRadius="12px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="60px" height="16px" borderRadius="4px" /></td>
      <td style={{ padding: '16px' }}><Skeleton width="44px" height="24px" borderRadius="12px" /></td>
    </tr>
  );
}
