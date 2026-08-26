import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, ScanFace } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

export default function UserSelection() {
  const setCurrentUser = useStore(s => s.setCurrentUser);
  const verifyPassword = useStore(s => s.verifyPassword);

  const [selectedUser, setSelectedUser] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [faceIdScanning, setFaceIdScanning] = useState(false);
  const [faceIdSuccess, setFaceIdSuccess] = useState(false);

  const users = [
    { 
      name: 'Görkem', 
      emoji: '👨‍💻', 
      color: '#A855F7',
      desc: 'Sistem & Bütçe'
    },
    { 
      name: 'Esra', 
      emoji: '👩‍🍳', 
      color: '#FB7185',
      desc: 'Mutfak & Düzen'
    }
  ];

  const handleUserClick = (u) => {
    setSelectedUser(u);
    setPin('');
    setError('');
    setFaceIdScanning(false);
    setFaceIdSuccess(false);
  };

  const handleKeyPress = (val) => {
    setError('');
    if (pin.length < 6) {
      const nextPin = pin + val;
      setPin(nextPin);
      
      // Auto verify when 6 digits are entered
      if (nextPin.length === 6) {
        setTimeout(() => {
          const isValid = verifyPassword(selectedUser.name, nextPin);
          if (isValid) {
            toast.success(`Hoş geldin, ${selectedUser.name}! ✨`);
            setCurrentUser(selectedUser);
          } else {
            setError('Hatalı Şifre! ⚠️');
            setPin('');
            toast.error('Girdiğiniz şifre geçersiz.');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleFaceIdSim = () => {
    setFaceIdScanning(true);
    setError('');
    setPin('');

    setTimeout(() => {
      setFaceIdScanning(false);
      setFaceIdSuccess(true);
      
      setTimeout(() => {
        toast.success(`Face ID Başarılı! Hoş geldin, ${selectedUser.name}! 📸`);
        setCurrentUser(selectedUser);
      }, 800);
    }, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h2 style={{ 
          fontFamily: 'Fraunces, serif', 
          fontSize: '42px', 
          color: 'var(--txt)',
          marginBottom: '12px'
        }}>
          Hoş Geldiniz ✨
        </h2>
        <p style={{ color: 'var(--txt-light)', fontSize: '18px', fontWeight: 500 }}>
          Bugün kontrol kimde?
        </p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
        gap: '24px', 
        width: '100%', 
        maxWidth: '600px' 
      }}>
        {users.map((u, idx) => (
          <motion.button
            key={u.name}
            initial={{ x: idx === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleUserClick(u)}
            style={{
              background: 'white',
              border: '2px solid var(--brd)',
              borderRadius: '40px',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'border-color 0.3s'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: u.color + '15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px',
              marginBottom: '10px'
            }}>
              {u.emoji}
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '22px', color: 'var(--txt)', marginBottom: '4px' }}>
                {u.name}
              </strong>
              <small style={{ color: u.color, fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>
                {u.desc}
              </small>
            </div>
          </motion.button>
        ))}
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: '60px', 
        display: 'flex', 
        gap: '40px' 
      }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ fontSize: '32px' }}
        >
          🐶
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
          style={{ fontSize: '32px' }}
        >
          🐱
        </motion.div>
      </div>

      {/* Password and Face ID Dialog Overlay */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'white',
                border: '1px solid var(--brd)',
                borderRadius: '32px',
                padding: '30px',
                width: '100%',
                maxWidth: '380px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Profile area */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: selectedUser.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                marginBottom: '12px'
              }}>
                {selectedUser.emoji}
              </div>
              <h3 style={{ fontSize: '20px', color: 'var(--txt)', fontWeight: 700, marginBottom: '6px' }}>
                {selectedUser.name} Doğrulaması
              </h3>
              <p style={{ color: 'var(--txt-light)', fontSize: '13px', marginBottom: '24px' }}>
                Lütfen 6 haneli şifrenizi girin
              </p>

              {/* Face ID Animation screen */}
              {faceIdScanning || faceIdSuccess ? (
                <div style={{
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px'
                }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <motion.div
                      animate={faceIdSuccess ? { scale: [1, 1.2, 1], borderColor: '#10B981' } : { rotate: 360 }}
                      transition={faceIdSuccess ? { duration: 0.5 } : { repeat: Infinity, duration: 2, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '4px dashed ' + (faceIdSuccess ? '#10B981' : selectedUser.color),
                        borderRadius: '50%'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: '10px',
                      borderRadius: '50%',
                      background: selectedUser.color + '10',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ScanFace size={48} color={faceIdSuccess ? '#10B981' : selectedUser.color} />
                    </div>
                  </div>
                  <strong style={{ color: faceIdSuccess ? '#10B981' : 'var(--txt)', fontSize: '16px' }}>
                    {faceIdSuccess ? 'Face ID Başarılı!' : 'Face ID taranıyor...'}
                  </strong>
                </div>
              ) : (
                <>
                  {/* Pin display indicator */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '12px',
                    justifyContent: 'center',
                    height: '24px',
                    alignItems: 'center'
                  }}>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          border: `2px solid ${selectedUser.color}`,
                          background: pin.length > i ? selectedUser.color : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      />
                    ))}
                  </div>

                  {/* Error Indicator */}
                  <div style={{ height: '24px', color: '#EF4444', fontSize: '13px', fontWeight: 600 }}>
                    {error}
                  </div>

                  {/* Pin Pad Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    width: '100%',
                    maxWidth: '280px',
                    marginBottom: '20px'
                  }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleKeyPress(num.toString())}
                        style={{
                          height: '56px',
                          borderRadius: '16px',
                          border: '1px solid var(--brd)',
                          background: '#f8fafc',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: 'var(--txt)',
                          cursor: 'pointer'
                        }}
                      >
                        {num}
                      </motion.button>
                    ))}
                    
                    {/* Face ID Simulation Button */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleFaceIdSim}
                      style={{
                        height: '56px',
                        borderRadius: '16px',
                        border: '1px solid var(--brd)',
                        background: selectedUser.color + '10',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: selectedUser.color,
                        cursor: 'pointer'
                      }}
                      title="Face ID Biyometrik Giriş"
                    >
                      <ScanFace size={24} />
                    </motion.button>

                    {/* Number 0 */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleKeyPress('0')}
                      style={{
                        height: '56px',
                        borderRadius: '16px',
                        border: '1px solid var(--brd)',
                        background: '#f8fafc',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--txt)',
                        cursor: 'pointer'
                      }}
                    >
                      0
                    </motion.button>

                    {/* Backspace Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleDelete}
                      style={{
                        height: '56px',
                        borderRadius: '16px',
                        border: '1px solid var(--brd)',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--txt)',
                        cursor: 'pointer'
                      }}
                    >
                      <Delete size={20} />
                    </motion.button>
                  </div>
                </>
              )}

              {/* Cancel Button */}
              <button
                disabled={faceIdScanning}
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--txt-light)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#EF4444'}
                onMouseLeave={(e) => e.target.style.color = 'var(--txt-light)'}
              >
                Geri Dön
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
