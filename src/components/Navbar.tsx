import { NavLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.01em" }}>
            Papelería Copia y Pega
          </span>
          <span className="small">Copias • Impresiones • Útiles escolares</span>
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
