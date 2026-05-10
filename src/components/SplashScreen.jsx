import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/eraylar-logo.png';

const SplashScreen = ({ finishLoading }) => {
  const [text, setText] = useState('Eraylar Hanesi Hazırlanıyor...');
  const [jokeIndex, setJokeIndex] = useState(0);

  const allJokes = [
    { t: 'Waffle terliklerinizle aşk yaşıyor... 🐶', m: '🐶' },
    { t: 'Mayıs klavyede yeni bir dil geliştiriyor... 🐱', m: '🐱' },
    { t: "Waffle'ın kuyruk sallama motoru ısıtılıyor... 🐾", m: '🐾' },
    { t: 'Mayıs güneş ışığı paketlerini topluyor... ☀️', m: '☀️' },
    { t: "Eraylar Hanem'de sevgi limitleri zorlanıyor... ❤️", m: '❤️' },
    { t: 'Waffle mama kabının boş olduğunu fark etti... 😱', m: '😱' },
    { t: 'Mayıs yüksek yerlerden dünyayı izliyor... 🏰', m: '🏰' },
    { t: 'Görkem & Esra için yeni anılar hazırlanıyor... ✨', m: '✨' },
    { t: 'Waffle kapı sesine 0.1 saniyede tepki veriyor... ⚡', m: '⚡' },
    { t: 'Mayıs "miyav" diyerek tüm sorunları çözdü... 🎵', m: '🎵' },
    { t: 'Ailemizin neşesi Waffle & Mayıs yükleniyor... 🧸', m: '🧸' },
    { t: 'Eraylar hanesi huzur moduna alınıyor... 🧘‍♂️', m: '🧘‍♂️' },
    { t: 'Waffle rüyasında dev bir kemik görüyor... 🦴', m: '🦴' },
    { t: 'Mayıs patisiyle ekranı temizliyor... 🐾', m: '🐾' },
    { t: 'Sonsuz mutluluk ve patili günler başlıyor... 🌈', m: '🌈' },
    { t: "Görkem & Esra'nın neşesi yükleniyor... 🌟", m: '🌟' },
    { t: 'Mayıs yine en sevdiğin koltuğu kaptı... 🛋️', m: '🛋️' },
    { t: 'Waffle "hav" diyerek tüm dikkatleri üzerine çekti... 📣', m: '📣' },
    { t: 'Huzur dolu bir günün kapıları aralanıyor... 🚪', m: '🚪' },
    { t: "Waffle & Mayıs yine iş birliği içinde... 🕵️‍♂️", m: "🕵️‍♂️" },
    { t: "Eraylar Hanem'de yeni bir vizyoner gün başlıyor... 🚀", m: "🚀" },
    { t: "Mayıs kutu bulma şampiyonu seçildi... 📦", m: "📦" },
    { t: "Waffle bugün 12 saat uyku hedefine ulaştı... 😴", m: "😴" },
    { t: "Görkem & Esra için her şeyin en güzeli yükleniyor... 💖", m: "💖" },
    { t: "Eraylar Malikanesi'nde patili sesler yükseliyor... 🏰", m: "🏰" },
    { t: "Mayıs yine Görkem'in sandalyesini kaptı... 🪑", m: "🪑" },
    { t: "Waffle kapıda kuyruk sallama antrenmanı yapıyor... 🐕", m: "🐕" },
    { t: "En güzel anılar bu kapının ardında... 🏠", m: "🏠" },
    { t: "Sevgiyle örülen bir yuva hazırlanıyor... ✨", m: "✨" },
    { t: "Eraylar Hanesi'nde her şey yolunda! 🛸", m: "🛸" }
  ];

  // Pick 4 random jokes on mount
  const [jokes] = useState(() => {
    return [...allJokes].sort(() => Math.random() - 0.5).slice(0, 4);
  });

  useEffect(() => {
    // Kalıcı çözüm: Splash ekran süresince body arka planını mor yap (!important ile CSS'i ez)
    const originalBg = document.body.style.backgroundColor;
    document.body.style.setProperty('background-color', '#A855F7', 'important');
    
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < jokes.length) {
        setJokeIndex(step);
      } else {
        clearInterval(interval);
        setTimeout(finishLoading, 500);
      }
    }, 3500); // 3.5s per quote - Balanced readability
    
    return () => {
      clearInterval(interval);
      document.body.style.setProperty('background-color', originalBg);
    };
  }, [finishLoading, jokes.length]);

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
          transition={{ duration: 14, ease: "linear" }}
          style={{ height: '100%', background: 'white', boxShadow: '0 0 10px white' }}
        />
      </div>

      <AnimatePresence>
        {jokeIndex === jokes.length - 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              bottom: '120px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '1px',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            HOŞ GELDİNİZ
          </motion.div>
        )}
      </AnimatePresence>

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
            v4.2.0 <span style={{ color: 'white', opacity: 0.7, fontWeight: 700 }}>"ARISTOTLE"</span>
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.8px',
          marginTop: '6px'
        }}>
          GÖRSEL UNIFICATION TAMAMLANDI · GÖRKEM & ESRA © 2026
        </span>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
