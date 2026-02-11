import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const width = isOpen ? '260px' : '80px';

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/products', label: 'Productos', icon: '📦' },
    { path: '/admin/categories', label: 'Categorías', icon: '📂' },
    { path: '/admin/sales', label: 'Punto de Venta', icon: '🛒' },
    { path: '/admin/sales/history', label: 'Historial', icon: '📜' },
    { path: '/admin/profile', label: 'Mi Perfil', icon: '👤' },
  ];

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user && user.role === 'master') {
      menuItems.push({ path: '/admin/users', label: 'Usuarios', icon: '👥' });
  }

  return (
    <aside 
      style={{ 
        width, 
        backgroundColor: '#ffffff', 
        height: '100%', 
        transition: 'width 0.3s ease', 
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        position: 'relative' // Needed for tooltip positioning
      }}
    >
      <div style={{ 
        padding: '0 24px', // Use consistent horizontal padding
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        borderBottom: '1px solid #f0f0f0', 
        justifyContent: 'flex-start', // Always align left
        width: '260px', // Fixed width
        height: '80px', // Fixed height to match TopBar
        position: 'absolute', // Take out of flow to ignore parent width constraint
        top: 0,
        left: 0,
        backgroundColor: '#ffffff',
        zIndex: 20,
        boxSizing: 'border-box' // Ensure padding is included in width
      }}>
         <img 
            src={logo} 
            alt="Papelería Copia y Pega" 
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'cover', 
              borderRadius: '50%', 
              border: '2px solid #e0e0e0',
              flexShrink: 0
            }} 
         />
         <div style={{
           display: 'flex',
           alignItems: 'center',
           overflow: 'hidden',
           whiteSpace: 'nowrap'
         }}>
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '0.85rem', 
              color: '#333',
              lineHeight: '1.2'
            }}>
              Papelería Copia & Pega
            </span>
         </div>
      </div>

      <nav style={{ 
        padding: isOpen ? '16px' : '16px 0', 
        marginTop: '80px', // Push down by header height
        flex: 1, 
        overflowY: 'auto', // Scrollable menu if needed
        overflowX: 'hidden',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}> 
        <p style={{ 
          fontSize: '0.75rem', 
          fontWeight: 'bold', 
          color: '#888', 
          marginBottom: '10px', 
          paddingLeft: '24px',
          width: '100%',
          textAlign: 'left',
          transition: 'all 0.3s',
          height: isOpen ? '20px' : '0px', // Collapse height completely
          opacity: isOpen ? 1 : 0,
          display: isOpen ? 'block' : 'none' // Remove from flow
        }}>
          MENU
        </p>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;
            
            return (
              <li 
                key={item.path} 
                style={{ marginBottom: '8px', width: '100%', position: 'relative' }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link 
                  to={item.path} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: isActive ? '#673ab7' : '#616161',
                    backgroundColor: isActive ? '#ede7f6' : 'transparent',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.2s',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    height: '48px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    opacity: isOpen ? 1 : 0, 
                    width: isOpen ? 'auto' : 0,
                    overflow: 'hidden',
                    transition: 'opacity 0.2s' 
                  }}>
                    {item.label}
                  </span>
                </Link>

                {/* Tooltip for collapsed state */}
                {!isOpen && isHovered && (
                  <div style={{
                    position: 'absolute',
                    left: '100%', // Position to the right correctly
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '10px', // Spacing from sidebar
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    zIndex: 9999, // High z-index
                    pointerEvents: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {item.label}
                    {/* Tiny arrow */}
                    <div style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '50%',
                      transform: 'translateY(-50%) rotate(45deg)',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#333'
                    }} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
