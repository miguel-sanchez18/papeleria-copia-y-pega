import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile); // specific initial state
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setSidebarOpen(true); // Auto-open on desktop if closed
      } else if (mobile && isSidebarOpen) {
        setSidebarOpen(false); // Auto-close on switch to mobile
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#eef2f6', overflow: 'hidden', color: '#1f2937' }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
      
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40,
            animation: 'fadeIn 0.3s'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* TopBar */}
        <TopBar isOpen={isSidebarOpen} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
