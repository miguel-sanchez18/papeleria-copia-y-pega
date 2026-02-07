import { useState, useRef } from "react";
import PaperArt from "../../assets/PaperArt";
import { products, ProductCard, ProductDetailModal, Product } from "./catalog";
import { GalleryModal } from "./components/GalleryModal";
import { galleryData } from "../../data/galleryData";
import CTA from "../../components/CTA";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    // ... same scroll logic ...
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0, 1fr)", animation: "fadeIn 0.6s ease-out" }}>
      <div 
        className="card hero" 
        style={{ 
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <span className="pill">🛒 Papelería • Copias • Impresiones</span>

          <h1 className="h1">Todo para la escuela y la oficina, con atención rápida.</h1>

          <p className="p">
            En <b>Papelería Copia & Pega</b> hacemos copias e impresiones (B/N y color), engargolados, escaneos,
            y contamos con útiles escolares y material de oficina.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <a className="btn primary" href="/contacto" style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
              💬 Enviar mensaje
            </a>
            <a className="btn" href="/aviso-de-privacidad" style={{ background: "transparent", border: "none", color: "var(--muted)", textDecoration: "underline", fontSize: "0.9rem" }}>
              🔒 Aviso de privacidad
            </a>
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

      <div className="card soft" style={{ padding: 18, animation: "fadeIn 0.8s ease-out" }}>
        <h2 className="h2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>⭐</span> Lo más buscado
        </h2>
        <p className="p" style={{ marginTop: 6 }}>
          Encuentra aquí los artículos y servicios más solicitados por nuestros clientes.
        </p>

        <div style={{ position: "relative", marginTop: 14 }}>
          {/* Botón Izquierdo */}
          <button 
            onClick={() => scroll('left')} 
            aria-label="Anterior"
            className="btn"
            style={{
              position: "absolute",
              left: 4,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              borderRadius: "50%",
              width: 44,
              height: 44,
              padding: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              color: "white"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Botón Derecho */}
          <button 
            onClick={() => scroll('right')} 
            aria-label="Siguiente"
            className="btn"
            style={{
              position: "absolute",
              right: 4,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              borderRadius: "50%",
              width: 44,
              height: 44,
              padding: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              color: "white"
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div 
            ref={carouselRef}
            className="carousel-container"
            style={{ 
              display: "flex", 
              gap: 16, 
              overflowX: "auto", 
              paddingBottom: 16,
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none", /* Firefox */
              paddingLeft: 40, /* Espacio para la flecha */
              paddingRight: 40, /* Espacio para la flecha */
            }}
          >
            {products.map((product) => (
              <div key={product.id} style={{ minWidth: "280px", scrollSnapAlign: "center" }}>
                <ProductCard 
                  product={product} 
                  onViewDetail={(p) => setSelectedProduct(p)} 
                />
              </div>
            ))}
          </div>
        </div>
        {/* Hide scrollbar for Chrome/Safari/Opera */ }
        <style>{`
          .carousel-container::-webkit-scrollbar {
            display: none;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <div className="card soft" style={{ padding: 18, animation: "fadeIn 1s ease-out" }}>
        <h2 className="h2">Galería</h2>
        <p className="p" style={{ marginTop: 6 }}>
           Explora nuestras categorías principales para encontrar justo lo que necesitas.
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <GalleryCard title="Copias e impresiones" desc="B/N y color" emoji="🖨️" onClick={() => setSelectedCategory("Copias e impresiones")} />
          <GalleryCard title="Útiles escolares" desc="Todo para tareas" emoji="📚" onClick={() => setSelectedCategory("Útiles escolares")} />
          <GalleryCard title="Material de oficina" desc="Carpetas y más" emoji="📁" onClick={() => setSelectedCategory("Material de oficina")} />
        </div>
      </div>

      <GalleryModal 
        title={selectedCategory}
        items={selectedCategory ? (galleryData[selectedCategory] || []) : []}
        onClose={() => setSelectedCategory(null)}
      />

      <CTA />
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

function GalleryCard({ title, desc, emoji, onClick }: { title: string; desc: string; emoji: string; onClick?: () => void }) {
  // Using a local state for hover is overkill for inline styles, 
  // but since we are using inline styles, we can't easily add :hover pseudo-class 
  // without a styled component or a class.
  // Let's add a specific class for this in the style block above and just use className here.
  // Actually, I can add a dedicated class in the global style block or just append a <style> block for this component.
  
  return (
    <div 
      className="card gallery-card" 
      onClick={onClick}
    >
      <div
        className="icon-container"
      >
        <span style={{ fontSize: 44 }}>{emoji}</span>
      </div>

      <div style={{ fontWeight: 900, marginTop: 12 }}>{title}</div>
      <div className="small">{desc}</div>
      
      <style>{`
        .gallery-card {
          padding: 14px;
          border-radius: 18px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
          border-color: var(--primary);
        }
        .gallery-card .icon-container {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 35%, transparent), color-mix(in srgb, var(--primary-2) 30%, transparent));
          padding: 16px;
          min-height: 120px;
          display: grid;
          place-items: center;
          transition: transform 0.2s;
        }
        .gallery-card:hover .icon-container {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
