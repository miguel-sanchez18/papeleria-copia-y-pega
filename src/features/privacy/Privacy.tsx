export default function Privacy() {
  return (
    <section style={{ maxWidth: 800, margin: "0 auto", display: "grid", gap: 24, animation: "fadeIn 0.5s ease-out" }}>
      <div className="card soft" style={{ padding: 24 }}>
        <h1 className="h2" style={{ fontSize: 32, marginBottom: 8 }}>🔒 Aviso de Privacidad</h1>
        
        <p className="p" style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          En <b>Papelería Copia y Pega</b>, nos tomamos muy en serio tu confianza. Este aviso detalla cómo cuidamos la información que nos compartes.
        </p>

        <div className="hr" style={{ margin: "24px 0" }} />

        <div style={{ display: "grid", gap: 16 }}>
          <PolicySection 
            icon="🎯"
            title="¿Para qué usamos tus datos?" 
            text="Principalmente para atender tus pedidos, realizar cotizaciones por WhatsApp/Messenger y avisarte cuando tu trabajo esté listo." 
          />
          <PolicySection 
            icon="📝"
            title="¿Qué información recabamos?" 
            text="Datos básicos de contacto como tu nombre, número de teléfono y los archivos que nos envías para imprimir." 
          />
          <PolicySection 
            icon="🛡️"
            title="¿Cómo te protegemos?" 
            text="Tus archivos se eliminan de nuestros equipos una vez entregado el trabajo, salvo que nos pidas guardarlos para futuras impresiones." 
          />
          <PolicySection 
            icon="🚫"
            title="No compartimos tu información" 
            text="Tus datos son exclusivamente para brindarte servicio. No los vendemos ni compartimos con terceros." 
          />
        </div>

        <div className="hr" style={{ margin: "24px 0" }} />

        <div style={{ background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>¿Tienes dudas?</h3>
          <p className="small">
            Puedes ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición) enviándonos un mensaje directo.
          </p>
        </div>

        <p className="small" style={{ marginTop: 24, textAlign: "center", opacity: 0.6 }}>
          Última actualización: {new Date().toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function PolicySection({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <div className="card" style={{ padding: 18, borderRadius: 16, display: "flex", gap: 16, alignItems: "start" }}>
      <div style={{ fontSize: 24, background: "rgba(255,255,255,0.1)", width: 48, height: 48, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{title}</div>
        <div className="p" style={{ fontSize: "0.95rem", opacity: 0.9 }}>{text}</div>
      </div>
    </div>
  );
}
