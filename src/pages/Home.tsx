import PaperArt from "../assets/PaperArt";

export default function Home() {
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div className="card hero">
        <div style={{ display: "grid", gap: 14 }}>
          <span className="pill">🛒 Papelería • Copias • Impresiones</span>

          <h1 className="h1">Todo para la escuela y la oficina, con atención rápida.</h1>

          <p className="p">
            En <b>Papelería Copia & Pega</b> hacemos copias e impresiones (B/N y color), engargolados, escaneos,
            y contamos con útiles escolares y material de oficina.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn primary" href="/contacto">💬 Enviar mensaje</a>
            <a className="btn" href="/aviso-de-privacidad">🔒 Aviso de privacidad</a>
          </div>

          <div className="hr" />

          <div className="grid-3">
            <Kpi title="Copias e impresiones" text="Rápido y con buena calidad. Consulta precios por Messenger." icon="🖨️" />
            <Kpi title="Útiles escolares" text="Cuadernos, hojas, plumas, lápices, carpetas y más." icon="✏️" />
            <Kpi title="Servicios extra" text="Engargolado, escaneo y apoyo básico de oficina." icon="📎" />
          </div>
        </div>

        <div className="hero-visual">
          <div className="blob" />
          <div className="img">
            <PaperArt />
          </div>
        </div>
      </div>

      <div className="card soft" style={{ padding: 18 }}>
        <h2 className="h2">Productos más comunes</h2>
        <p className="p" style={{ marginTop: 6 }}>
          Aquí puedes mostrar lo que más te piden. (Después lo convertimos en catálogo.)
        </p>

        <div style={{ marginTop: 14 }} className="grid-3">
          <MiniCard title="Hojas y libretas" tag="Escolar" />
          <MiniCard title="Impresiones" tag="Servicio" />
          <MiniCard title="Plumas y lápices" tag="Oficina" />
        </div>
      </div>

      <div className="card soft" style={{ padding: 18 }}>
        <h2 className="h2">Galería</h2>
        <p className="p" style={{ marginTop: 6 }}>
          Imágenes ilustrativas para que el sitio no se vea “vacío”. Luego puedes reemplazarlas por fotos reales.
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <GalleryCard title="Copias e impresiones" desc="B/N y color" emoji="🖨️" />
          <GalleryCard title="Útiles escolares" desc="Todo para tareas" emoji="📚" />
          <GalleryCard title="Material de oficina" desc="Carpetas y más" emoji="📁" />
        </div>
      </div>
    </section>
  );
}

function Kpi({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <div className="kpi">
      <div className="icon" aria-hidden="true">
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 900 }}>{title}</div>
        <div className="small">{text}</div>
      </div>
    </div>
  );
}

function MiniCard({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="card" style={{ padding: 14, borderRadius: 18 }}>
      <div className="pill" style={{ width: "fit-content" }}>🏷️ {tag}</div>
      <div style={{ fontWeight: 900, fontSize: 16, marginTop: 10 }}>{title}</div>
      <div className="small" style={{ marginTop: 6 }}>
        (Aquí podemos poner precios, promos, o top ventas.)
      </div>
    </div>
  );
}

function GalleryCard({ title, desc, emoji }: { title: string; desc: string; emoji: string }) {
  return (
    <div className="card" style={{ padding: 14, borderRadius: 18 }}>
      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 35%, transparent), color-mix(in srgb, var(--primary-2) 30%, transparent))",
          padding: 16,
          minHeight: 120,
          display: "grid",
          placeItems: "center",
        }}
      >
        <span style={{ fontSize: 44 }}>{emoji}</span>
      </div>

      <div style={{ fontWeight: 900, marginTop: 12 }}>{title}</div>
      <div className="small">{desc}</div>
    </div>
  );
}
