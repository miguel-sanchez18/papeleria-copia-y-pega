
import { useState, useEffect } from 'react';
import { useToast } from '../../../../context/ToastContext';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

export default function UserProfile() {
  const { success, error } = useToast();
  const [user, setUser] = useState<User | any>(null); // Keep any for safety with local storage defaults
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  // Password States
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.id) {
        fetchProfile(storedUser);
    }
  }, []);

  const fetchProfile = async (storedUser: any) => {
      // Use stored user for now as discussed
      setUser(storedUser);
      setFullName(storedUser.full_name || '');
      setEmail(storedUser.email || '');
      setProfileImage(storedUser.profile_image || '');
      setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePassword && newPassword !== confirmPassword) {
        error("Las contraseñas no coinciden");
        return;
    }

    setSaving(true);
    try {
        const token = localStorage.getItem('token') || '';
        const payload: any = {
            full_name: fullName,
            email: email,
            profile_image: profileImage
        };

        if (changePassword) {
            payload.current_password = currentPassword;
            payload.new_password = newPassword;
        }

        await UserService.update(token, user.id, payload);

        success("Perfil actualizado con éxito");
        // Update local storage
        const updatedUser = { ...user, ...payload };
        delete updatedUser.current_password;
        delete updatedUser.new_password;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setUser(updatedUser);
        setEditMode(false);
        setChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Force reload to update Sidebar/TopBar avatars
        window.location.reload(); 
    } catch (err: any) {
        console.error(err);
        error(err.message || "Error al actualizar perfil");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Mi Perfil</h1>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            {/* Header / Cover */}
            <div style={{ height: '120px', background: 'linear-gradient(to right, #673ab7, #512da8)' }}></div>
            
            <div style={{ padding: '24px', position: 'relative' }}>
                {/* Avatar */}
                <div style={{ 
                    width: '100px', height: '100px', borderRadius: '50%', 
                    backgroundColor: 'white', padding: '4px',
                    position: 'absolute', top: '-50px', left: '24px',
                }}>
                    <div style={{ 
                        width: '100%', height: '100%', borderRadius: '50%', 
                        backgroundColor: '#e3f2fd', color: '#2196f3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 'bold',
                        backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                        {!profileImage && user.username[0].toUpperCase()}
                    </div>
                </div>

                <div style={{ marginLeft: '120px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{user.full_name || user.username}</h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>{user.role === 'master' ? 'Administrador Maestro' : 'Administrador'}</p>
                </div>

                {!editMode ? (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Nombre de Usuario</label>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: 500 }}>{user.username}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Email</label>
                                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: 500 }}>{user.email || 'No configurado'}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Rol</label>
                                <span style={{ 
                                    backgroundColor: '#e0e7ff', color: '#4338ca', 
                                    padding: '4px 12px', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600 
                                }}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setEditMode(true)}
                            style={{ 
                                padding: '10px 20px', backgroundColor: '#673ab7', color: 'white', 
                                borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <span>✏️</span> Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nombre Completo</label>
                            <input 
                                type="text" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#111827' }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly
                                title="El email no se puede modificar"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Foto de Perfil</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <label 
                                    htmlFor="file-upload"
                                    style={{ 
                                        padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', 
                                        backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontWeight: 500,
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    <span>📷</span> Cargar Imagen
                                </label>
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 1024 * 1024 * 2) { // 2MB limit
                                                error("La imagen no debe pesar más de 2MB");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileImage(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    style={{ display: 'none' }}
                                />
                                {profileImage && user.profile_image !== profileImage && (
                                    <span style={{ fontSize: '0.875rem', color: '#10b981' }}>Imagen seleccionada</span>
                                )}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Sube una imagen (JPG, PNG). Máximo 2MB.</p>
                        </div>

                        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <input 
                                    type="checkbox" 
                                    id="changePassword"
                                    checked={changePassword}
                                    onChange={e => setChangePassword(e.target.checked)}
                                    style={{ accentColor: '#673ab7' }}
                                />
                                <label htmlFor="changePassword" style={{ fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Cambiar Contraseña</label>
                            </div>

                            {changePassword && (
                                <div style={{ display: 'grid', gap: '12px', animation: 'fadeIn 0.3s' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Contraseña Actual</label>
                                        <input 
                                            type="password" required
                                            value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#111827' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Nueva Contraseña</label>
                                        <input 
                                            type="password" required
                                            value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#111827' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Confirmar Nueva Contraseña</label>
                                        <input 
                                            type="password" required
                                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#111827' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                type="button"
                                onClick={() => { setEditMode(false); setChangePassword(false); }}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={saving}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#673ab7', color: 'white', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
                            >
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
}
