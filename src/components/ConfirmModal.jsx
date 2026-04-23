import React from 'react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Evet, Onayla', cancelText = 'Vazgeç', confirmColor = '#ef4444' }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content glass animate-pop" style={{ maxWidth: '320px', textAlign: 'center', padding: '30px' }}>
        <div className="confirm-icon" style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
        <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '10px', color: 'var(--txt)' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: 'var(--txt-light)', marginBottom: '25px', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', fontWeight: '700', cursor: 'pointer' }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: confirmColor, color: 'white', fontWeight: '800', cursor: 'pointer' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
