interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const confirmColors = {
    danger: '#ef4444',   // Red
    primary: '#3b82f6',  // Blue
    warning: '#f59e0b'   // Amber
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{ 
        backgroundColor: 'white', borderRadius: '16px', width: '400px', maxWidth: '90%', 
        padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        border: '1px solid #f3f4f6',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onCancel}
            style={{ 
              padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', 
              background: 'white', color: '#374151', cursor: 'pointer', fontWeight: 500,
              fontSize: '0.9rem', transition: 'all 0.2s'
            }}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              padding: '10px 16px', borderRadius: '8px', border: 'none', 
              background: confirmColors[variant], color: 'white', cursor: 'pointer', fontWeight: 500,
              fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>
        {`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `}
      </style>
    </div>
  );
}
