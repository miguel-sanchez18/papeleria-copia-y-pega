export default function Contact() {
  const fbUrl = "https://www.facebook.com/profile.php?id=61586313953877";
  const whatsappUrl = "https://wa.me/529961081375";

  return (
    <section style={{ display: "grid", gap: 24, animation: "fadeIn 0.5s ease-out" }}>
      <div className="card soft" style={{ padding: 24 }}>
        <h1 className="h2" style={{ fontSize: 32, marginBottom: 8 }}>
          📍 Contacto y Ubicación
        </h1>

        <p className="p" style={{ fontSize: "1.05rem", color: "var(--text-secondary)" }}>
          Estamos listos para atenderte. Puedes contactarnos por redes sociales o visitarnos directamente en nuestro local.
        </p>

        <div className="hr" style={{ margin: "24px 0" }} />

        <div className="grid-3" style={{ alignItems: "stretch", gap: 16 }}>
          <InfoCard 
            title="Dirección" 
            value="Chunkanán, Camp. (México)" 
            icon="🗺️" 
            desc="Centro del poblado"
          />
          <InfoCard 
            title="Teléfono / WhatsApp" 
            value="996 108 1375" 
            icon="📱" 
            href={whatsappUrl} 
            action="Enviar mensaje"
          />
          <InfoCard 
            title="Messenger" 
            value="Papelería Copia & Pega" 
            icon="💬" 
            href={fbUrl} 
            action="Ir al chat"
          />
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a className="btn primary" href={fbUrl} target="_blank" rel="noreferrer" style={{ flex: 1, justifyContent: "center", padding: "16px" }}>
            💬 Abrir Messenger
            </a>
            <a className="btn" href={whatsappUrl} target="_blank" rel="noreferrer" style={{ flex: 1, justifyContent: "center", background: "#25D366", borderColor: "#25D366", color: "white", padding: "16px" }}>
            💚 Abrir WhatsApp
            </a>
        </div>
      </div>

      <div className="grid-responsive" style={{ display: "grid", gap: 24, gridTemplateColumns: "1.5fr 1fr" }}>
        {/* Mapa */}
        <div className="card soft" style={{ padding: 0, overflow: "hidden", minHeight: 300 }}>
            <div style={{ padding: 24, paddingBottom: 16 }}>
               <h2 className="h2" style={{ fontSize: 24 }}>🗺️ Ubicación</h2>
            </div>
            <div style={{ width: "100%", height: 350, borderTop: "1px solid var(--border)" }}>
                <iframe 
                    title="Mapa Chunkanán"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15024.787627447663!2d-90.4900!3d19.7000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85f8333333333333%3A0x3333333333333333!2sChunkan%C3%A1n%2C%20Camp.!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>

        {/* Horarios */}
        <div className="card soft" style={{ padding: 24 }}>
            <h2 className="h2" style={{ fontSize: 24, marginBottom: 24 }}>🕒 Horarios</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
                <li className="schedule-item">
                    <span>Lunes a Viernes</span>
                    <span className="time">8:00 AM - 8:00 PM</span>
                </li>
                <li className="schedule-item">
                    <span>Sábados</span>
                    <span className="time">9:00 AM - 2:00 PM</span>
                </li>
                <li className="schedule-item closed">
                    <span>Domingos</span>
                    <span className="status">Cerrado</span>
                </li>
            </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="card soft" style={{ padding: 24 }}>
        <h2 className="h2" style={{ fontSize: 24, marginBottom: 24 }}>🤔 Preguntas Frecuentes</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <FaqCard 
              question="¿Hacen impresiones a color?" 
              answer="Sí, contamos con impresión láser a color y B/N de alta calidad en diversos tipos de papel." 
            />
            <FaqCard 
              question="¿Puedo enviar mis archivos por WhatsApp?" 
              answer="¡Claro! Envíanos tus PDF o imágenes por WhatsApp o Messenger y pasa solo a recoger tus impresiones." 
            />
            <FaqCard 
              question="¿Facturan?" 
              answer="Por el momento entregamos notas de venta. Estamos trabajando para ofrecer facturación pronto." 
            />
        </div>
      </div>
      
      <style>{`
        .grid-responsive {
          grid-template-columns: 1.5fr 1fr;
        }
        @media (max-width: 900px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
        .schedule-item {
          display: flex; 
          justify-content: space-between; 
          padding-bottom: 12px; 
          border-bottom: 1px solid var(--border);
          font-size: 1.1rem;
        }
        .schedule-item:last-child {
          border-bottom: none;
        }
        .schedule-item .time {
          fontWeight: 700; 
          color: var(--text-primary);
        }
        .schedule-item.closed {
          color: var(--muted);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function InfoCard({ title, value, icon, href, action, desc }: { title: string; value: string; icon: string; href?: string; action?: string; desc?: string }) {
  const content = href ? (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontWeight: 800, textDecoration: "none", fontSize: "1.1rem" }}>
      {value}
    </a>
  ) : (
    <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{value}</span>
  );

  return (
    <div className="card" style={{ padding: 20, borderRadius: 16, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, opacity: 0.8 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>{title}</span>
        </div>
        <div>{content}</div>
        {desc && <div className="small" style={{ marginTop: 6 }}>{desc}</div>}
      </div>
      
      {action && href && (
        <a href={href} target="_blank" rel="noreferrer" className="small" style={{ marginTop: 16, display: "block", color: "var(--primary)", fontWeight: "bold" }}>
          {action} →
        </a>
      )}
    </div>
  );
}

function FaqCard({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="card" style={{ padding: 20, borderRadius: 16, background: "rgba(255,255,255,0.03)" }}>
      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, display: "flex", gap: 8 }}>
        <span style={{ color: "var(--primary)" }}>•</span> {question}
      </div>
      <div className="p" style={{ fontSize: "0.95rem", lineHeight: 1.5, opacity: 0.9 }}>
        {answer}
      </div>
    </div>
  );
}
