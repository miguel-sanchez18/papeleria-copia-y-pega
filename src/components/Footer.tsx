import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ marginTop: 60, borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
      <div className="container" style={{ padding: "40px 16px" }}>
        <div className="grid-responsive-footer" style={{ display: "grid", gap: 32, gridTemplateColumns: "1.5fr 1fr 1fr" }}>
          
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
               </div>
               <span style={{ fontWeight: 900, fontSize: 18 }}>Papelería Copia y Pega</span>
            </div>
            <p className="small" style={{ maxWidth: 300 }}>
              Tu aliado confiable para soluciones escolares y de oficina. Calidad, rapidez y el mejor servicio en Chunkanán.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 800, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--muted)" }}>Navegación</div>
            <Link to="/" className="footer-link">Inicio</Link>
            <Link to="/contacto" className="footer-link">Contacto y Ubicación</Link>
            <Link to="/aviso-de-privacidad" className="footer-link">Aviso de Privacidad</Link>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 800, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--muted)" }}>Contacto</div>
            <a href="https://wa.me/529961081375" target="_blank" rel="noreferrer" className="footer-link">📱 996 108 13 75</a>
            <a href="https://www.facebook.com/profile.php?id=61586313953877" target="_blank" rel="noreferrer" className="footer-link">💬 Facebook Messenger</a>
            <span className="small">📍 Chunkanán, Camp.</span>
          </div>

        </div>

        <div className="hr" style={{ margin: "32px 0 24px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
           <span className="small">© {year} Papelería Copia y Pega. Todos los derechos reservados.</span>
           <span className="small" style={{ opacity: 0.5 }}>Desarrollado con ❤️</span>
        </div>
      </div>
      <style>{`
        .footer-link {
          color: var(--text);
          opacity: 0.8;
          transition: opacity 0.2s, transform 0.2s;
          font-size: 0.95rem;
        }
        .footer-link:hover {
          opacity: 1;
          transform: translateX(4px);
          text-decoration: none;
        }
        .grid-responsive-footer {
          grid-template-columns: 1.5fr 1fr 1fr;
        }
        @media (max-width: 768px) {
          .grid-responsive-footer {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
