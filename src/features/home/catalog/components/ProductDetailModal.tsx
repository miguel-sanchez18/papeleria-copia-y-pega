import { Product } from '../models/product.model';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 500,
          padding: 24,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          &times;
        </button>

        <div className="pill" style={{ width: 'fit-content', marginBottom: 12 }}>
          {product.category}
        </div>

        <h2 className="h2" style={{ marginBottom: 12 }}>{product.name}</h2>
        
        <p className="p" style={{ marginBottom: 20 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
            ${product.price.toFixed(2)}
          </span>
          
          <button className="btn primary">
             Pedir por Messenger
          </button>
        </div>
      </div>
    </div>
  );
}
