export default function Contact() {
  const fbUrl = "https://www.facebook.com/profile.php?id=61586313953877";

  return (
    <section style={{ display: "grid", gap: 14, maxWidth: 860 }}>
      <div className="card soft" style={{ padding: 18 }}>
        <h1 className="h2" style={{ fontSize: 30 }}>
          Contacto
        </h1>

        <p className="p" style={{ marginTop: 8 }}>
          Para cotizaciones y pedidos, contáctanos por Messenger. (Luego agregamos WhatsApp si quieres.)
        </p>

        <div className="hr" />

        <div className="grid-3" style={{ alignItems: "stretch" }}>
          <InfoCard title="Dirección" value="Chunkanán, Camp. (México)" icon="📍" />
          <InfoCard title="Teléfono" value="996 108 1375" icon="📞" />
          <InfoCard title="Messenger" value="Enviar mensaje" icon="💬" href={fbUrl} />
        </div>

        <div className="hr" />

        <a className="btn primary" href={fbUrl} target="_blank" rel="noreferrer">
          💬 Abrir Messenger
        </a>

        <p className="small" style={{ marginTop: 12 }}>
          Nota: este sitio es informativo. Para atención inmediata, recomendamos enviar mensaje por Facebook Messenger.
        </p>
      </div>
    </section>
  );
}

function InfoCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: string;
  icon: string;
  href?: string;
}) {
  const content = href ? (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
      {value}
    </a>
  ) : (
    <span style={{ fontWeight: 900 }}>{value}</span>
  );

  return (
    <div className="card" style={{ padding: 14, borderRadius: 18 }}>
      <div className="pill" style={{ width: "fit-content" }}>
        <span aria-hidden="true">{icon}</span> {title}
      </div>

      <div style={{ marginTop: 10 }}>{content}</div>

      <div className="small" style={{ marginTop: 6 }}>
        (Puedes ajustar horarios y detalles cuando gustes.)
      </div>
    </div>
  );
}
