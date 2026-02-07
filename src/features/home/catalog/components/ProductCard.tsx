import { Product } from '../models/product.model';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <div className="pill" style={{ width: 'fit-content', marginBottom: 8, fontSize: '0.8rem' }}>
          {product.category}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{product.name}</h3>
        <p className="small" style={{ opacity: 0.8, marginBottom: 12 }}>
          {product.description}
        </p>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
          ${product.price.toFixed(2)}
        </span>
        <button 
          className="btn" 
          style={{ padding: '6px 12px', fontSize: '0.9rem' }}
          onClick={() => onViewDetail(product)}
        >
          Ver detalle
        </button>
      </div>
    </div>
  );
}
