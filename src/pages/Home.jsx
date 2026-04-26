import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, RefreshCcw, Search, Settings, 
  ChevronRight, Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import logo from '../assets/eraylar-logo.png';
import Portal from '../components/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import { PET_QUOTES } from '../constants/petQuotes';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const { 
    system = { version: '2.7.0', globalScore: 0, weeklyReports: [{ spending: 0, health: '...', goalsReached: 0 }], achievements: [] }, 
    currentUser, 
    saglik,
    addMood,
    logs = [], 
    calculateGlobalScore 
  } = useStore();
  
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [aiMessage, setAiMessage] = useState('Bugün her şey yolunda, keyfine bak! 💖');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const userKey = currentUser.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
    const hasLoggedToday = saglik?.moods?.some(m => m.user === userKey && m.date.startsWith(today));
    
    if (!hasLoggedToday) {
      const timer = setTimeout(() => setShowMoodCheck(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, saglik?.moods]);

  const refreshAiMessage = () => {
    setIsRefreshing(true);
    // Simulate AI "analysis" of store data
    setTimeout(() => {
      const insights = [
        "Bugün her şey yolunda, keyfine bak! 💖",
        "Waffle'ın maması azalıyor olabilir mi? 🐶",
        "Harika gidiyorsunuz, bu hafta tasarruf modundasınız! 💰",
        "Mutfakta yeni bir tarif denemeye ne dersin? 🍳",
        "Esra bugün 'bunu nereye koysak' demiyor, tadını çıkar! 😂",
        "Hava bugün dışarıda vakit geçirmek için çok güzel! ☀️",
        "Mayıs'ın kumunu kontrol ettin mi? 🐈",
        "Akşama lezzetli bir yemek planlayalım mı? 🍝"
      ];
      const random = insights[Math.floor(Math.random() * insights.length)];
      setAiMessage(random);
      setIsRefreshing(false);
      toast.success('Asistan güncellendi ✨', { style: { borderRadius: '12px', background: '#2E1065', color: '#fff' } });
    }, 800);
  };

  const handlePetClick = (pet) => {
    const quotes = PET_QUOTES[pet];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast(randomQuote, {
      icon: pet === 'waffle' ? '🐶' : '🐱',
      style: {
        borderRadius: '15px',
        background: '#2E1065',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  useEffect(() => {
    calculateGlobalScore();
  }, [calculateGlobalScore]);

  const modules = [
    { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍳', color: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)', path: '/mutfak' },
    { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(180deg, #DB2777 0%, #C026D3 100%)', path: '/sosyal' },
    { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', path: '/alisveris' },
    { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(180deg, #06B6D4 0%, #0891B2 100%)', path: '/tatil' },
    { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', path: '/pet' },
    { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/saglik' },
    { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', path: '/ev' },
    { id: 'aracim', name: 'Eraylar Aracım', sub: 'Tiguan R-Line', icon: '🏎️', color: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)', path: '/aracim' },
    { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '💎', color: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)', path: '/kasa' },
    { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)', path: '/finans' },
    { id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏆', color: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', path: '/hedefler', fullWidth: true }
  ];

  return (
    <AnimatedPage className="home-premium-container">
      {/* Top Rounded Banner - Exactly as 01:47 Screenshot */}
      <div className="premium-header-banner">
        <div className="phb-content">
          <div className="phb-user-area">
            <div className="phb-avatar" onClick={() => navigate('/profil')}>
              <span className="supabase-status-dot"></span>
              👨‍💻
            </div>
            <div className="phb-text">
              <div className="phb-brand">
                <img src={logo} alt="Logo" className="phb-logo-img" />
                <h2>Eraylar Hanem</h2>
              </div>
              <p>Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔 
                <span className="pet-link" onClick={() => handlePetClick('waffle')}>🐶</span> 
                <span className="pet-link" onClick={() => handlePetClick('mayis')}>🐈</span>
              </p>
            </div>
          </div>
          <div className="phb-actions">
            <button className="phb-icon-btn" onClick={() => navigate('/ayarlar')}><Settings size={20} /></button>
          </div>
        </div>
      </div>

      <div className="home-scroll-area">
        {/* AI Assistant Section */}
        <div className="ai-section-premium">
          <div className="ai-header-row">
            <span>✨ AKILLI AİLE ASİSTANI</span>
            <button 
              className={`ai-refresh-btn ${isRefreshing ? 'spinning' : ''}`} 
              onClick={refreshAiMessage}
              disabled={isRefreshing}
            >
              <RefreshCcw size={16} />
            </button>
          </div>
          <div className="ai-status-card-premium">
            <div className="ai-card-inner">
              <span className="ai-heart">{isRefreshing ? '✨' : '💖'}</span>
              <p>{aiMessage}</p>
            </div>
          </div>
        </div>

        {/* 2-Column Module Grid from 01:47 Screenshot */}
        <div className="premium-module-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`premium-module-card ${module.fullWidth ? 'full-width' : ''}`}
              onClick={() => navigate(module.path)}
              style={{ background: module.color }}
            >
              <div className="pmc-icon-wrap">
                <span className="pmc-emoji">{module.icon}</span>
              </div>
              <div className="pmc-info">
                <h3>{module.name}</h3>
                <p>{module.sub}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ height: '60px' }} />
      </div>

      <AnimatePresence>
        {showMoodCheck && (
          <Portal>
            <div className="modal-overlay" style={{ background: 'rgba(46, 16, 101, 0.6)', backdropFilter: 'blur(8px)' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mood-check-card-premium"
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '35px',
                  width: '90%',
                  maxWidth: '400px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <button 
                  onClick={() => setShowMoodCheck(false)}
                  style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>

                <div className="mood-welcome-header" style={{ marginBottom: '25px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>✨</div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#2E1065', marginBottom: '8px' }}>
                    Hoş geldin {currentUser?.name?.split(' ')[0]}!
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>
                    Güne nasıl başladın? Ruh halini kaydetmek, uzun vadeli wellness takibin için çok değerli. ✨
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'happy', emoji: '😊', label: 'Mutlu', color: '#fef3c7' },
                    { id: 'calm', emoji: '😌', label: 'Huzurlu', color: '#ecfdf5' },
                    { id: 'energetic', emoji: '🤩', label: 'Enerjik', color: '#fff7ed' },
                    { id: 'tired', emoji: '😫', label: 'Yorgun', color: '#f8fafc' },
                    { id: 'sad', emoji: '😔', label: 'Üzgün', color: '#eff6ff' },
                    { id: 'sick', emoji: '🤒', label: 'Hasta', color: '#fef2f2' }
                  ].map(m => (
                    <button 
                      key={m.id}
                      onClick={() => {
                        const userKey = currentUser.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra';
                        addMood(userKey, m, '', 'Genel');
                        setShowMoodCheck(false);
                        toast.success('Günün güzel geçsin! 🌟', { icon: m.emoji });
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        padding: '16px 8px', borderRadius: '20px', border: '1px solid #f1f5f9',
                        background: m.color, transition: 'transform 0.2s'
                      }}
                      className="mood-btn-hover"
                    >
                      <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowMoodCheck(false)}
                  style={{ 
                    marginTop: '25px', width: '100%', padding: '15px', borderRadius: '18px', 
                    background: '#f8fafc', border: 'none', color: '#64748b', fontWeight: '700', fontSize: '14px'
                  }}
                >
                  Sonra Hatırlat
                </button>
              </motion.div>
            </div>
          </Portal>
        )}
      </AnimatePresence>

      {/* System Logs Portal */}
      {showLogs && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowLogs(false)}>
            <div className="logs-modal-v2 glass animate-slideUp" onClick={e => e.stopPropagation()}>
               <div className="modal-header logs-header">
                 <h3><History size={20} /> Sistem Hareketleri</h3>
                 <button className="modal-close-btn" onClick={() => setShowLogs(false)}><X size={20} /></button>
               </div>
               <div className="logs-list-premium">
                  {logs.length > 0 ? logs.slice().reverse().map((log, i) => {
                    let logDate = new Date(log.date);
                    if (isNaN(logDate.getTime())) logDate = new Date(log.id);
                    const timeStr = isNaN(logDate.getTime()) ? '--:--' : logDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    
                    let icon = '📝';
                    if (log.action?.includes('Harcama')) icon = '💸';
                    if (log.action?.includes('Ayar')) icon = '⚙️';
                    if (log.action?.includes('Profil')) icon = '👤';
                    if (log.action?.includes('Alışveriş')) icon = '🛒';
                    if (log.action?.includes('Tatil')) icon = '✈️';

                    return (
                      <div key={log.id || i} className="log-row-premium animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                         <div className="log-time-badge">{timeStr}</div>
                         <div className="log-icon-circle">{icon}</div>
                         <div className="log-info-main">
                            <strong>{log.action}</strong>
                            <p>{log.detail}</p>
                         </div>
                      </div>
                    );
                  }) : (
                    <div className="empty-logs-msg">
                       <p>Henüz sistem hareketi bulunmuyor.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </Portal>
      )}
    </AnimatedPage>
  );
};

export default Home;