import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Plus, Bell, History, Flame, Search,
  Utensils, Wallet, Home as HomeIcon, 
  Stethoscope, Plane, PawPrint, Settings, Smile, BarChart2,
  Zap, Heart, Shield, TrendingUp, Car, Briefcase, 
  ChevronRight, Sparkles, MessageCircle, MoreVertical,
  PlusCircle, LayoutGrid, Award, Filter
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import logo from '../assets/eraylar-logo.png';
import Portal from '../components/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

const Home = () => {
  const { 
    system = { globalScore: 0, weeklyReports: [{ spending: 0, health: '...', goalsReached: 0 }], achievements: [] }, 
    currentUser, 
    logs = [], 
    calculateGlobalScore, 
    globalSearch 
  } = useStore();
  
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFAB, setShowFAB] = useState(false);

  useEffect(() => {
    calculateGlobalScore();
  }, [calculateGlobalScore]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 2) {
      setSearchResults(globalSearch(val));
    } else {
      setSearchResults([]);
    }
  };

  const welcomeMessage = useMemo(() => {
    const hour = new Date().getHours();
    let greet = "Merhaba";
    if (hour < 12) greet = "Günaydın";
    else if (hour < 18) greet = "Tünaydın";
    else greet = "İyi Akşamlar";
    
    return `${greet}, Görkem & Esra`;
  }, []);

  const modules = [
    { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍳', color: 'linear-gradient(135deg, #f97316, #ea580c)', path: '/mutfak', comingSoon: false },
    { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(135deg, #db2777, #c026d3)', path: '/sosyal', comingSoon: false },
    { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(135deg, #0ea5e9, #2563eb)', path: '/alisveris', comingSoon: false },
    { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', path: '/tatil', comingSoon: false },
    { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(135deg, #f59e0b, #d97706)', path: '/pet', comingSoon: false },
    { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(135deg, #ef4444, #dc2626)', path: '/saglik', comingSoon: false },
    { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(135deg, #1e1b4b, #312e81)', path: '/finans', comingSoon: false },
    { id: 'aracim', name: 'Eraylar Kokpit', sub: 'Tiguan R-Line', icon: '🏎️', color: 'linear-gradient(135deg, #334155, #0f172a)', path: '/aracim', comingSoon: false },
    { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(135deg, #10b981, #059669)', path: '/ev', comingSoon: false },
    { id: 'hedefler', name: 'Eraylar Vizyon', sub: 'Vision Hub', icon: '🏔️', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', path: '/hedefler', comingSoon: false },
    { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '💎', color: 'linear-gradient(135deg, #7c3aed, #6d28d9)', path: '/kasa', comingSoon: false }
  ];

  return (
    <AnimatedPage className="home-container-v2">
      {/* Search Header */}
      <div className="home-top-search glass">
        <div className="search-box-v2">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Mutfak, harcama veya hedef ara..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="top-actions">
           <button className="top-btn" onClick={() => setShowLogs(true)}><History size={20} /></button>
           <button className="top-btn" onClick={() => navigate('/ayarlar')}><Settings size={20} /></button>
        </div>
        
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="search-results-modal glass"
            >
              {searchResults.map((res, idx) => (
                <div key={idx} className="search-res-item" onClick={() => { navigate(res.path); setSearchResults([]); }}>
                   <small>{res.type}</small>
                   <span>{res.text}</span>
                   <ChevronRight size={14} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="home-scroll-area">
        {/* Welcome & Health Score */}
        <div className="welcome-section mt-12">
          <div className="ws-text">
            <small>{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</small>
            <h1>{welcomeMessage}</h1>
          </div>
          <div className="health-score-widget" onClick={() => navigate('/analiz')}>
            <svg viewBox="0 0 36 36" className="score-ring">
              <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="ring-fill" strokeDasharray={`${system.globalScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="score-val">
               <strong>{system.globalScore}</strong>
               <span>Puan</span>
            </div>
          </div>
        </div>

        {/* Weekly Insights Slider */}
        <div className="weekly-insight-card glass mt-24">
          <div className="wic-header">
            <Sparkles size={18} color="#f59e0b" />
            <span>HAFTALIK ÖZET</span>
          </div>
          <div className="wic-body">
            <div className="wic-stat">
              <small>Harcama</small>
              <strong>{system?.weeklyReports?.[0]?.spending || 0}₺</strong>
            </div>
            <div className="wic-stat">
              <small>Sağlık</small>
              <strong className="green">{system?.weeklyReports?.[0]?.health || '...'}</strong>
            </div>
            <div className="wic-stat">
              <small>Hedefler</small>
              <strong>{system?.weeklyReports?.[0]?.goalsReached || 0}</strong>
            </div>
          </div>
          <button className="wic-btn" onClick={() => navigate('/analiz')}>Detaylı Rapor <ChevronRight size={14} /></button>
        </div>

        {/* Module Grid - Premium Golden Master Style */}
        <div className="module-grid-v2 mt-24">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              className="module-card-premium"
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(module.path)}
              style={{ background: module.color }}
            >
              <div className="mc-icon-wrap">
                <span className="mc-emoji">{module.icon}</span>
              </div>
              <div className="mc-info">
                <h3>{module.name}</h3>
                <p>{module.sub}</p>
              </div>
              <div className="mc-action">
                <ChevronRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Banner */}
        <div className="achievements-preview mt-24 glass" onClick={() => navigate('/achievements')}>
           <div className="ap-header">
             <Award size={18} color="#7c3aed" />
             <span>BAŞARILARINIZ</span>
           </div>
           <div className="badge-stack">
              {system.achievements.filter(a => a.earned).map(a => (
                <div key={a.id} className="mini-badge" title={a.title}>{a.icon}</div>
              ))}
              <div className="badge-count">+{system.achievements.filter(a => !a.earned).length}</div>
           </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className={`fab-container ${showFAB ? 'active' : ''}`}>
        <AnimatePresence>
          {showFAB && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fab-menu glass"
            >
              <button className="fm-btn" onClick={() => navigate('/finans')}><PlusCircle size={18} /> Harcama</button>
              <button className="fm-btn" onClick={() => navigate('/sosyal')}><MessageCircle size={18} /> Not Al</button>
              <button className="fm-btn" onClick={() => navigate('/aracim')}><Zap size={18} /> KM Güncelle</button>
            </motion.div>
          )}
        </AnimatePresence>
        <button className="fab-main" onClick={() => setShowFAB(!showFAB)}>
          <Plus size={32} className={showFAB ? 'rotate' : ''} />
        </button>
      </div>

      {/* System Logs Portal */}
      {showLogs && (
        <Portal>
          <div className="modal-overlay" onClick={() => setShowLogs(false)}>
            <div className="logs-modal-v2 glass animate-slideUp" onClick={e => e.stopPropagation()}>
               <div className="modal-header">
                 <h3>Sistem Hareketleri</h3>
                 <button onClick={() => setShowLogs(false)}><X size={20} /></button>
               </div>
               <div className="logs-list">
                  {logs.slice(-20).reverse().map((log, i) => (
                    <div key={i} className="log-row">
                       <small>{new Date(log.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                       <span>{log.text}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </Portal>
      )}
    </AnimatedPage>
  );
};

export default Home;