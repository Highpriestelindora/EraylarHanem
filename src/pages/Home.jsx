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
    system = { globalScore: 0, weeklyReports: [{ spending: 0, health: '...', goalsReached: 0 }], achievements: [] }, 
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
    { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍳', color: 'linear-gradient(135deg, #f97316, #ea580c)', path: '/mutfak' },
    { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: 'linear-gradient(135deg, #db2777, #c026d3)', path: '/sosyal' },
    { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: 'linear-gradient(135deg, #0ea5e9, #2563eb)', path: '/alisveris' },
    { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', path: '/tatil' },
    { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: 'linear-gradient(135deg, #f59e0b, #d97706)', path: '/pet' },
    { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: 'linear-gradient(135deg, #ef4444, #dc2626)', path: '/saglik' },
    { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: 'linear-gradient(135deg, #1e1b4b, #312e81)', path: '/finans' },
    { id: 'aracim', name: 'Eraylar Aracım', sub: 'Tiguan R-Line', icon: '🏎️', color: 'linear-gradient(135deg, #334155, #0f172a)', path: '/aracim' },
    { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: 'linear-gradient(135deg, #10b981, #059669)', path: '/ev' },
    { id: 'hedefler', name: 'Eraylar Hedefler', sub: 'Vision Hub', icon: '🏔️', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', path: '/hedefler' },
    { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '💎', color: 'linear-gradient(135deg, #7c3aed, #6d28d9)', path: '/kasa' }
  ];

  return (
    <AnimatedPage className="home-premium-container">
      {/* Top Rounded Banner - Exactly as 01:47 Screenshot */}
      <div className="premium-header-banner">
        <div className="phb-content">
          <div className="phb-user-area">
            <div className="phb-avatar">👨‍💻</div>
            <div className="phb-text">
              <div className="phb-brand">
                <img src={logo} alt="Logo" className="phb-logo-img" />
                <h2>Eraylar Hanem</h2>
              </div>
              <p>Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔 🐶 🐈</p>
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
              className="premium-module-card"
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