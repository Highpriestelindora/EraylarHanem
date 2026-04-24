import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Portal from './Portal';

export default function ActionSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxHeight = '90vh',
  fullHeight = false 
}) {
  // Prevent scrolling on body when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 999999,
                touchAction: 'none'
              }}
            />

            {/* Sheet */}
            <motion.div
              className="ActionSheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) onClose();
              }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: fullHeight ? '100vh' : maxHeight,
                height: fullHeight ? '100vh' : 'auto',
                background: 'var(--card)',
                borderTopLeftRadius: fullHeight ? '0' : '32px',
                borderTopRightRadius: fullHeight ? '0' : '32px',
                zIndex: 1000000,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                overflowX: 'hidden'
              }}
            >
              {/* Drag Handle */}
              {!fullHeight && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px', cursor: 'grab' }}>
                  <div style={{ width: '40px', height: '5px', background: 'var(--brd)', borderRadius: '10px' }} />
                </div>
              )}

              {/* Header */}
              <div style={{ 
                padding: fullHeight 
                  ? 'calc(16px + env(safe-area-inset-top, 0px)) 24px 16px' 
                  : '16px 24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--brd)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--txt)' }}>{title}</h3>
                <button 
                  onClick={onClose}
                  style={{ 
                    background: 'var(--bg)', 
                    border: '1px solid var(--brd)', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--txt-light)'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                overflowX: 'hidden',
                padding: '20px 24px 40px',
                WebkitOverflowScrolling: 'touch'
              }}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div style={{ 
                  padding: '16px 24px calc(16px + env(safe-area-inset-bottom, 20px))', 
                  borderTop: '1px solid var(--brd)',
                  background: 'var(--card)'
                }}>
                  {footer}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
