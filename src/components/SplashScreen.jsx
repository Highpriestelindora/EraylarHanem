import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ finishLoading }) => {
  const [text, setText] = useState('Eraylar Hanesi Hazırlanıyor...');
  const [jokeIndex, setJokeIndex] = useState(0);

  const jokes = [
    { t: 'Waffle terlikleri saklıyor... 🐶', m: '🐶' },
    { t: 'Mayıs klavyenin üstüne oturdu... 🐱', m: '🐱' },
    { t: 'Görkem gizlice mutfaktan atıştırıyor... 🥪', m: '🥪' },
    { t: 'Esra "Bugün ne pişirsem?" diye düşünüyor... 🥘', m: '🥘' },
    { t: 'Fatura canavarları evden kovuluyor... 💸', m: '💸' },
    { t: 'Eraylar Hanem %100 Sevgiyle Yükleniyor... ❤️', m: '❤️' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setJokeIndex(prev => {
        if (prev < jokes.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(finishLoading, 1000);
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="splash-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <div className="splash-characters" style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
        >
          🐶
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
          style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}
        >
          🐱
        </motion.div>
      </div>

      <motion.div
        key={jokeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{ height: '80px' }}
      >
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', marginBottom: '12px', fontWeight: 900 }}>
          Eraylar Hanem
        </h1>
        <p style={{ opacity: 0.9, fontSize: '16px', fontWeight: 600 }}>{jokes[jokeIndex].t}</p>
      </motion.div>
      
      <div style={{ 
        marginTop: '40px', 
        width: '160px', 
        height: '6px', 
        background: 'rgba(255,255,255,0.2)', 
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 9, ease: "linear" }}
          style={{ height: '100%', background: 'white', boxShadow: '0 0 10px white' }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
