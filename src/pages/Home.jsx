import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, RefreshCcw, Settings, 
  ChevronRight, History as HistoryIcon
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
  // Selective Selectors for Performance
  const currentUser = useStore(state => state.currentUser);
  const system = useStore(state => state.system) || { version: '2.31.0', globalScore: 0, weeklyReports: [], achievements: [] };
  const saglik = useStore(state => state.saglik);
  const garaj = useStore(state => state.garaj);
  const logs = useStore(state => state.logs) || [];
  const addMood = useStore(state => state.addMood);
  const selectedVehicleId = useStore(state => state.selectedVehicleId);
  const calculateGlobalScore = useStore(state => state.calculateGlobalScore);
  
  const isOnline = system?.isOnline ?? true;
  const navigate = useNavigate();

  const activeVehicle = useMemo(() => 
    garaj?.find(v => v.id === selectedVehicleId) || garaj?.[0], 
    [garaj, selectedVehicleId]
  );
  
  const [showLogs, setShowLogs] = useState(false);
  const [aiMessage, setAiMessage] = useState('Bugün her şey yolunda, keyfine bak! 💖');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

  const getSmartInsights = () => {
    const store = useStore.getState();
    const insights = [];
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Mutfak
    const lowStock = [
      ...(store.mutfak.buzdolabi || []),
      ...(store.mutfak.kiler || []),
      ...(store.mutfak.dondurucu || [])
    ].filter(i => i.cr <= i.mn && i.cr > 0);
    if (lowStock.length > 0) insights.push(`Mutfakta ${lowStock[0].n} azalmış, listeye ekleyelim mi? 🛒`);

    // Sağlık
    const todayApp = (store.saglik.randevular || []).find(r => r.tarih === today);
    if (todayApp) insights.push(`Bugün ${todayApp.kisi} için ${todayApp.doktor} randevusu var! 🏥`);

    // Garaj
    const vehicle = store.garaj?.find(v => v.id === store.selectedVehicleId) || store.garaj?.[0];
    if (vehicle) {
      const docs = vehicle.documents || [];
      const expiringDoc = docs.find(d => {
        const diff = (new Date(d.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30;
      });
      if (expiringDoc) insights.push(`${vehicle.model} aracının ${expiringDoc.name} süresi dolmak üzere! 🚗`);
    }

    const funFallbacks = [
      "Bugün her şey yolunda, keyfine bak! 💖",
      "Waffle bugün çok enerjik! 🐶",
      "Eraylar Hanem %100 sevgiyle yüklendi. 🌟",
      "Birlikte geçirdiğiniz her an çok değerli... ✨"
    ];
    return [...insights, ...funFallbacks];
  };

  // Initial AI analysis
  useEffect(() => {
    setAiMessage(getSmartInsights()[0]);
  }, []);

  const refreshAiMessage = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAiMessage(getSmartInsights()[0]);
      setIsRefreshing(false);
      toast.success('Asistan verileri analiz etti ✨', { 
        style: { borderRadius: '12px', background: '#2E1065', color: '#fff' },
        icon: '🧠'
      });
    }, 1000);
  };

  const handlePetClick = (pet) => {
    const quotes = PET_QUOTES[pet];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast(randomQuote, { icon: pet === 'waffle' ? '🐶' : '🐱' });
  };

  useEffect(() => {
    calculateGlobalScore();
  }, [calculateGlobalScore]);

  // Memoized Modules - Stabilizes the grid
  const modules = useMemo(() => {
    // 11th Personalized Module
    let personalizedModule = null;
    if (currentUser?.name === 'Esra') {
      personalizedModule = { 
        id: 'modaring', 
        name: 'Eraylar Modaring', 
        sub: 'Esra\'nın Dünyası', 
        icon: '✨', 
        color: 'linear-gradient(180deg, #FB7185 0%, #E11D48 100%)', 
        path: '/modaring' 
      };
    } else if (currentUser?.name === 'Görkem') {
      personalizedModule = { 
        id: 'muhendislik', 
        name: 'Eraylar Mühendislik', 
        sub: 'Görkem\'in Atölyesi', 
        icon: '⚙️', 
        color: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)', 
        path: '/muhendislik' 
      };
    }

    const baseModules = [
      { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍲', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/mutfak' },
      { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(180deg, #DB2777 0%, #C026D3 100%)', path: '/sosyal' },
      { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)', path: '/alisveris' },
      { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(180deg, #06B6D4 0%, #0891B2 100%)', path: '/tatil' },
      { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', path: '/pet' },
      { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)', path: '/saglik' },
      { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', path: '/ev' },
      { id: 'aracim', name: 'Eraylar Garajım', sub: activeVehicle?.model || 'Garaj Yönetimi', icon: '🏢', color: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)', path: '/aracim' },
      { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '🏦', color: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)', path: '/kasa' },
      { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)', path: '/finans' },
    ];

    if (personalizedModule) baseModules.push(personalizedModule);
    
    // 12. Modül: Hedefler (Her zaman sağda kalsın diye en sona ekliyoruz)
    baseModules.push({ id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏆', color: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', path: '/hedefler' });

    return baseModules;
  }, [activeVehicle, currentUser]);

  return (
    <AnimatedPage className="home-premium-container">
      {/* Premium Header Banner */}
      <div className="premium-header-banner">
        <div className="phb-content">
          <div className="phb-user-area">
            <div className="phb-avatar" onClick={() => navigate('/profil')}>
              <span className={`supabase-status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              {currentUser?.emoji || '👨‍💻'}
            </div>
            <div className="phb-text">
              <div className="phb-brand">
                <img src={logo} alt="Logo" className="phb-logo-img" />
                <h2>Eraylar Hanem</h2>
                <div className="phb-header-pets">
                  <span className="pet-link" onClick={() => handlePetClick('waffle')}>🐶</span> 
                  <span className="pet-link" onClick={() => handlePetClick('mayis')}>🐈</span>
                </div>
              </div>
            </div>
          </div>
          <div className="phb-actions">
             <button className="phb-icon-btn" onClick={() => setShowLogs(true)}><HistoryIcon size={20} /></button>
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

        {/* 2-Column Module Grid */}
        <div className="premium-module-grid">
          {modules.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
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
              <div className="pmc-arrow">
                <ChevronRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div style={{ height: '80px' }} />
      </div>

      {/* Modals & Portals (Logs, Mood Check etc.) */}
      <AnimatePresence>
        {showLogs && (
          <Portal>
            <div className="modal-overlay" onClick={() => setShowLogs(false)}>
              <div className="logs-modal-v2 glass animate-slideUp" onClick={e => e.stopPropagation()}>
                 <div className="modal-header logs-header">
                   <h3><HistoryIcon size={20} /> Sistem Hareketleri</h3>
                   <button className="modal-close-btn" onClick={() => setShowLogs(false)}><X size={20} /></button>
                 </div>
                 <div className="logs-list-premium">
                    {logs.slice().reverse().slice(0, 50).map((log, i) => (
                      <div key={log.id || i} className="log-row-premium">
                         <div className="log-icon-circle">📝</div>
                         <div className="log-info-main">
                            <strong>{log.action}</strong>
                            <p>{log.detail}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </Portal>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default Home;