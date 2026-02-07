import { GalleryItem } from "../../../data/galleryData";

interface GalleryModalProps {
  title: string | null;
  items: GalleryItem[];
  onClose: () => void;
}

export function GalleryModal({ title, items, onClose }: GalleryModalProps) {
  if (!title) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: 24,
          position: "relative",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 className="h2">{title}</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--text)", 
              fontSize: 28, 
              cursor: "pointer",
              padding: 8 
            }}
          >
            &times;
          </button>
        </div>

        <div 
          style={{ 
            overflowY: "auto", 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: 16,
            paddingRight: 8 // Space for scrollbar
          }}
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="card soft"
              style={{ 
                padding: 16, 
                display: "flex", 
                flexDirection: "column", 
                gap: 12,
                transition: "transform 0.2s",
                cursor: "pointer"
              }}
            >
              <div 
                style={{ 
                  aspectRatio: "1/1", 
                  backgroundColor: "rgba(255,255,255,0.05)", 
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 40
                }}
              >
                🏷️
              </div>
              <div>
                 <div style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.3 }}>{item.name}</div>
                 <div style={{ marginTop: 6, color: "var(--primary)", fontWeight: 800 }}>
                   ${item.price.toFixed(2)}
                 </div>
              </div>
              <button 
                className="btn primary" 
                style={{ marginTop: "auto", width: "100%", justifyContent: "center", fontSize: "0.9rem", padding: "8px" }}
              >
                Ver más
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--muted)" }}>
              No hay elementos para mostrar en esta categoría.
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
