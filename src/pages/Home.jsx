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
    { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍳', color: 'linear-gradient(135deg, #f97316, #ea580c)', path: '/mutfak' },
    { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(135deg, #db2777, #c026d3)', path: '/sosyal' },
    { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(135deg, #0ea5e9, #2563eb)', path: '/alisveris' },
    { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', path: '/tatil' },
    { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(135deg, #f59e0b, #d97706)', path: '/pet' },
    { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(135deg, #ef4444, #dc2626)', path: '/saglik' },
    { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(135deg, #1e1b4b, #312e81)', path: '/finans' },
    { id: 'aracim', name: 'Eraylar Kokpit', sub: 'Tiguan R-Line', icon: '🏎️', color: 'linear-gradient(135deg, #334155, #0f172a)', path: '/aracim' },
    { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(135deg, #10b981, #059669)', path: '/ev' },
    { id: 'hedefler', name: 'Eraylar Vizyon', sub: 'Vision Hub', icon: '🏔️', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', path: '/hedefler' },
    { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '💎', color: 'linear-gradient(135deg, #7c3aed, #6d28d9)', path: '/kasa' }
  ];

  return (
    <AnimatedPage className="home-container-v2">
      {/* Top Premium Banner - Exactly like the screenshot */}
      <div className="home-banner-premium">
        <div className="banner-content">
          <div className="banner-user">
            <div className="avatar-main">{currentUser?.emoji || '👤'}</div>
            <div className="banner-text">
              <div className="brand-row">
                <img src={logo} alt="Logo" className="banner-logo" />
                <h2>Eraylar Hanem</h2>
              </div>
              <p>Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔 🐶 🐈</p>
            </div>
          </div>
          <div className="banner-actions">
            <button className="banner-btn" onClick={() => setShowLogs(true)}><BarChart2 size={20} /></button>
            <button className="banner-btn" onClick={() => navigate('/ayarlar')}><Settings size={20} /></button>
          </div>
        </div>
      </div>

      <div className="home-scroll-area">
        {/* AI Assistant Section */}
        <div className="section-header-v2">
          <h3>✨ AKILLI AİLE ASİSTANI</h3>
          <button className="history-btn-v2" onClick={() => setShowLogs(true)}><History size={18} /></button>
        </div>

        <motion.div 
          className="ai-status-card glass"
          whileHover={{ scale: 1.02 }}
        >
          <div className="ai-content">
            <span className="ai-emoji">💖</span>
            <p>Bugün her şey yolunda, keyfine bak!</p>
          </div>
        </motion.div>

        {/* Module Grid - Large Cards Style from Screenshot */}
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
        
        <div style={{ height: '120px' }} /> {/* Spacing for floating nav */}
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

      {/* Redundant FAB removed to match screenshot and FloatingHub logic */}

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