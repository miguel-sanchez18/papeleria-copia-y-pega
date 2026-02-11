
import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#eef2f6', overflow: 'hidden', color: '#1f2937' }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* TopBar */}
        <TopBar isOpen={isSidebarOpen} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
