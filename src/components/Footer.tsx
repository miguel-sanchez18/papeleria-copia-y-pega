export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="container" style={{ paddingTop: 8, paddingBottom: 26 }}>
      <div className="card soft" style={{ padding: 16, borderRadius: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span className="small">© {year} Papelería Copia y Pega</span>
          <span className="small">Chunkanán, Camp. • Atención por Facebook Messenger</span>
        </div>
      </div>
    </footer>
  );
}
