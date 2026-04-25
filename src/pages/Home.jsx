import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, History, Search, Settings, BarChart2,
  ChevronRight, Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import logo from '../assets/eraylar-logo.png';
import Portal from '../components/Portal';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

const Home = () => {
  const { 
    system = { version: '2.5.0', globalScore: 0, weeklyReports: [{ spending: 0, health: '...', goalsReached: 0 }], achievements: [] }, 
    currentUser, 
    logs = [], 
    calculateGlobalScore 
  } = useStore();
  
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
    { id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏆', color: 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)', path: '/hedefler' }
  ];

  return (
    <AnimatedPage className="home-premium-container">
      {/* Top Rounded Banner - Exactly as 01:47 Screenshot */}
      <div className="premium-header-banner">
        <div className="phb-content">
          <div className="phb-user-area">
            <div className="phb-avatar">
              <span className="supabase-status-dot"></span>
              👨‍💻
            </div>
            <div className="phb-text">
              <div className="phb-brand">
                <img src={logo} alt="Logo" className="phb-logo-img" />
                <h2>Eraylar Hanem</h2>
              </div>
              <p>Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔 
                <span className="pet-link" onClick={() => navigate('/pet')}>🐶</span> 
                <span className="pet-link" onClick={() => navigate('/pet')}>🐈</span>
              </p>
            </div>
          </div>
          <div className="phb-actions">
            <button className="phb-icon-btn" onClick={() => setShowLogs(true)}><BarChart2 size={18} /></button>
            <button className="phb-icon-btn" onClick={() => navigate('/ayarlar')}><Settings size={18} /></button>
          </div>
        </div>
      </div>

      <div className="home-scroll-area">
        {/* AI Assistant Section */}
        <div className="ai-section-premium">
          <div className="ai-header-row">
            <span>✨ AKILLI AİLE ASİSTANI</span>
            <button className="ai-history-btn" onClick={() => setShowLogs(true)}><History size={18} /></button>
          </div>
          <div className="ai-status-card-premium">
            <div className="ai-card-inner">
              <span className="ai-heart">💖</span>
              <p>Bugün her şey yolunda, keyfine bak!</p>
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
        
        <div style={{ height: '140px' }} />
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
                       <small>{new Date(log.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                       <span><strong>{log.action}:</strong> {log.detail}</span>
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