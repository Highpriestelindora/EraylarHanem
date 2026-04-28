import React from 'react';
import Portal from './Portal';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Evet, Sil", cancelText = "İptal", icon = "⚠️" }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="md-confirm-overlay">
        <div className="md-confirm-modal animate-bounceIn">
          <div className="md-confirm-icon">{icon}</div>
          <h3>{title || "Emin misiniz?"}</h3>
          <p>{message}</p>
          <div className="md-confirm-actions">
            <button className="md-confirm-cancel" onClick={onCancel}>{cancelText}</button>
            <button className="md-confirm-yes" onClick={() => {
              onConfirm();
            }}>{confirmText}</button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmModal;
