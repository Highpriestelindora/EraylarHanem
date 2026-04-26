import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/eraylar-logo.png';

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
    // Kalıcı çözüm: Splash ekran süresince body arka planını mor yap (!important ile CSS'i ez)
    const originalBg = document.body.style.backgroundColor;
    document.body.style.setProperty('background-color', '#A855F7', 'important');
    
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < jokes.length - 1) {
        setJokeIndex(step);
      } else {
        setJokeIndex(jokes.length - 1);
        clearInterval(interval);
        setTimeout(finishLoading, 1000);
      }
    }, 1500);
    
    return () => {
      clearInterval(interval);
      document.body.style.setProperty('background-color', originalBg);
    };
  }, [finishLoading]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 999999,
        backgroundColor: '#A855F7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        overflow: 'hidden'
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '12px' }}>
          <img src={logo} alt="Logo" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', margin: 0, fontWeight: 900 }}>
            Eraylar Hanem
          </h1>
        </div>
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

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '0',
        right: '0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        zIndex: 100
      }}>
        <div style={{
          padding: '8px 20px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '24px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '2px'
          }}>
            Release Signature
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: 900,
            color: '#fde68a',
            letterSpacing: '1.2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            v2.13.0 <span style={{ color: 'white', opacity: 0.7, fontWeight: 700 }}>MANAGEMENT UPDATE</span>
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.8px',
          marginTop: '6px'
        }}>
          SİSTEM STABİLİZE EDİLDİ · GÖRKEM & ESRA © 2025
        </span>
      </div>

      <div style={{
        marginTop: '20px',
        color: 'white',
        fontSize: '18px',
        fontWeight: 900,
        letterSpacing: '1px',
        opacity: 0.9,
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        HOŞ GELDİNİZ
      </div>
    </motion.div>
  );
};

export default SplashScreen;
