export default function Privacy() {
  return (
    <section style={{ display: "grid", gap: 14, maxWidth: 980 }}>
      <div className="card soft" style={{ padding: 18 }}>
        <h1 className="h2" style={{ fontSize: 30 }}>Aviso de Privacidad</h1>

        <p className="p" style={{ marginTop: 10 }}>
          <b>Papelería Copia y Pega</b> es responsable del uso y protección de los datos personales que nos proporciones
          por este sitio o por nuestros canales de contacto (por ejemplo, Facebook Messenger).
        </p>

        <div className="hr" />

        <div style={{ display: "grid", gap: 10 }}>
          <Item title="Finalidad" text="Atender solicitudes, cotizaciones, pedidos y seguimiento de servicios." />
          <Item title="Datos" text="Nombre, teléfono, mensajes y datos necesarios para brindarte atención." />
          <Item title="Conservación" text="Solo el tiempo necesario para brindar el servicio y cumplir obligaciones." />
          <Item title="Compartición" text="No compartimos datos con terceros, salvo obligación legal." />
        </div>

        <div className="hr" />

        <p className="small">
          Puedes solicitar acceso, corrección o eliminación de información escribiéndonos por nuestros medios de contacto.
        </p>
        <p className="small">Última actualización: {new Date().toLocaleDateString("es-MX")}</p>
      </div>
    </section>
  );
}

function Item({ title, text }: { title: string; text: string }) {
  return (
    <div className="card" style={{ padding: 14, borderRadius: 18 }}>
      <div style={{ fontWeight: 900 }}>{title}</div>
      <div className="small" style={{ marginTop: 6 }}>{text}</div>
    </div>
  );
}
