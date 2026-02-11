
import React, { useEffect } from 'react';

export interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const bgColors = {
        success: '#10b981', // Emerald 500
        error: '#ef4444',   // Red 500
        info: '#3b82f6',    // Blue 500
        warning: '#f59e0b'  // Amber 500
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            backgroundColor: 'white', borderLeft: `4px solid ${bgColors[type]}`,
            padding: '16px 20px', borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minWidth: '300px', maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
            marginBottom: '10px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <span style={{ fontSize: '1.2rem' }}>{icons[type]}</span>
            <p style={{ margin: 0, color: '#1f2937', fontSize: '0.95rem', fontWeight: 500, flex: 1 }}>{message}</p>
            <button 
                onClick={() => onClose(id)}
                style={{
                    background: 'transparent', border: 'none', color: '#9ca3af', 
                    fontSize: '1.2rem', cursor: 'pointer', padding: '0', 
                    lineHeight: 1, display: 'flex', alignItems: 'center'
                }}
            >
                &times;
            </button>
            <style>
                {`
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};
