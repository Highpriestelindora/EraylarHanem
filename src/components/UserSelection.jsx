import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

export default function UserSelection() {
  const setCurrentUser = useStore(s => s.setCurrentUser);

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
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px', 
        width: '100%', 
        maxWidth: '500px' 
      }}>
        {users.map((u, idx) => (
          <motion.button
            key={u.name}
            initial={{ x: idx === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + (idx * 0.1) }}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentUser(u)}
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
    </motion.div>
  );
}
