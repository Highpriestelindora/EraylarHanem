import React, { useState, useEffect, useRef } from 'react';
import Portal from './Portal';
import './InputModal.css';

const InputModal = ({ 
  isOpen, 
  title, 
  message, 
  defaultValue = "", 
  placeholder = "", 
  type = "text",
  onConfirm, 
  onCancel, 
  confirmText = "Kaydet", 
  cancelText = "İptal", 
  icon = "⏳" 
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  // Sync defaultValue when modal opens and auto-focus
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 150);
    }
  }, [isOpen, defaultValue]);

  // Handle escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(value);
  };

  return (
    <Portal>
      <div className="md-input-overlay" onClick={onCancel}>
        <form 
          className="md-input-modal animate-bounceIn" 
          onClick={e => e.stopPropagation()} 
          onSubmit={handleSubmit}
        >
          <div className="md-input-icon animate-float">{icon}</div>
          <h3>{title || "Giriş Yapın"}</h3>
          {message && <p className="md-input-message">{message}</p>}
          
          <div className="md-input-field-container">
            <input
              ref={inputRef}
              type={type}
              className="md-input-field"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              required
            />
          </div>
          
          <div className="md-input-actions">
            <button 
              type="button" 
              className="md-input-cancel" 
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              type="submit" 
              className="md-input-yes"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
};

export default InputModal;
