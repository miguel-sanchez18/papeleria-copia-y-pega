import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="card" style={{ 
        padding: "30px 24px", 
        textAlign: "center", 
        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
            <h2 className="h2" style={{ marginBottom: 12, fontSize: 28 }}>¿Listo para imprimir o cotizar?</h2>
            <p className="p" style={{ maxWidth: 500, margin: "0 auto 24px auto" }}>
            Envíanos tus archivos ahora mismo y pasa a recogerlos cuando estén listos. Sin filas ni esperas.
            </p>
            <Link to="/contacto" className="btn primary" style={{ display: "inline-flex", padding: "14px 28px", fontSize: "1.1rem" }}>
            👉 Contáctanos ahora
            </Link>
        </div>
      
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -50, left: -50, width: 200, height: 200, background: "var(--primary)", filter: "blur(80px)", opacity: 0.2, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -50, right: -50, width: 200, height: 200, background: "var(--primary-2)", filter: "blur(80px)", opacity: 0.2, borderRadius: "50%" }} />
      </div>
    </div>
  );
}
