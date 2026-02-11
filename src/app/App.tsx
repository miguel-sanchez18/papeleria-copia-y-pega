
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../features/home/Home";
import Contact from "../features/contact/Contact";
import Privacy from "../features/privacy/Privacy";
import Login from "../features/admin/components/Login";
import Dashboard from "../features/admin/components/Dashboard";
import ProductList from "../features/admin/products/components/ProductList";
import LowStockReport from "../features/admin/products/components/LowStockReport";
import SalesHistory from "../features/admin/sales/components/SalesHistory";
import CategoryList from "../features/admin/categories/components/CategoryList";
import SalesPOS from "../features/admin/sales/components/SalesPOS";
import UserList from "../features/admin/users/components/UserList";
import UserProfile from "../features/admin/users/components/UserProfile";
import AdminLayout from "../features/admin/layout/AdminLayout";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ToastProvider } from '../context/ToastContext';

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="container">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/aviso-de-privacidad" element={<Privacy />} />
          </Route>

          {/* Admin Login (Standalone) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/products/low-stock" element={<LowStockReport />} />
            
            {/* Placeholder routes for future features */}
            <Route path="/admin/categories" element={<CategoryList />} />
            <Route path="/admin/sales" element={<SalesPOS />} />
            <Route path="/admin/sales/history" element={<SalesHistory />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/profile" element={<UserProfile />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}
