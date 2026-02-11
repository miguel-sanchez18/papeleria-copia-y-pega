import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onToggleSidebar: () => void;
  isOpen: boolean;
  isMobile: boolean;
}

export default function TopBar({ onToggleSidebar, isOpen, isMobile }: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <header 
      className="admin-topbar-responsive"
      style={{ 
        height: '80px', 
      backgroundColor: '#ffffff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      paddingLeft: isMobile ? '24px' : (isOpen ? '24px' : '200px'), // Fixed padding on mobile
      borderBottom: '1px solid #eef2f6',
      transition: 'padding-left 0.3s ease',
      // borderRadius: '0 0 20px 20px' // Removed to look more standard 
    }}>
      <button 
        onClick={onToggleSidebar}
        style={{ 
          background: '#ede7f6', 
          border: 'none', 
          borderRadius: '8px', 
          width: '40px', 
          height: '40px', 
          cursor: 'pointer',
          color: '#673ab7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem'
        }}
      >
        ☰
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>


         <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                    width: '42px', height: '42px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e3f2fd', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: '#2196f3', fontWeight: 'bold', fontSize: '1.1rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    backgroundImage: user.profile_image ? `url(${user.profile_image})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {!user.profile_image && (user.username ? user.username[0].toUpperCase() : 'A')}
            </div>

            {isDropdownOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '300px',
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    padding: '8px',
                    zIndex: 1000,
                    border: '1px solid #f3f4f6',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                         <div style={{ 
                             width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#e3f2fd', 
                             color: '#2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0,
                             backgroundImage: user.profile_image ? `url(${user.profile_image})` : 'none',
                             backgroundSize: 'cover', backgroundPosition: 'center'
                         }}>
                             {!user.profile_image && (user.username ? user.username[0].toUpperCase() : 'A')}
                         </div>
                         <div style={{ overflow: 'hidden' }}>
                             <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.full_name || user.username || 'Admin'}
                             </h4>
                             <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Administrador</span>
                         </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ padding: '10px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#374151', fontSize: '0.9rem', transition: 'all 0.2s' }}
                             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#111827'; }}
                             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                             onClick={() => { navigate('/admin/profile'); setIsDropdownOpen(false); }}
                        >
                            <div style={{ width: '42px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '1.2rem', color: '#9ca3af' }}>⚙️</span>
                            </div>
                            <span>Configuración de Cuenta</span>
                        </div>

                        <div 
                            onClick={handleLogout}
                            style={{ padding: '10px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }}
                             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ width: '42px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '1.2rem' }}>↪️</span>
                            </div>
                            <span>Cerrar Sesión</span>
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>
    </header>
  );
}
