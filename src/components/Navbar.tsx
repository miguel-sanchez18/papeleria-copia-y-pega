import { NavLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            width: 52, 
            height: 52, 
            borderRadius: "50%", 
            background: "white", /* White background to make logo pop */
            display: "grid", 
            placeItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", /* Soft shadow */
            border: "2px solid rgba(255,255,255,0.2)", /* Subtle border */
            overflow: "hidden"
          }}>
            <img 
              src={logo} 
              alt="Logo Papelería" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.01em" }}>
              Papelería Copia y Pega
            </span>
            <span className="small">Copias • Impresiones • Útiles escolares</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Inicio
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Contacto
          </NavLink>
          <NavLink to="/aviso-de-privacidad" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Privacidad
          </NavLink>

          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
