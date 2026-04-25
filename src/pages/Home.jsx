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
    { id: 'mutfak', name: 'Eraylar Mutfak', sub: 'Yemek & Alışveriş', icon: '🍳', color: '#f97316', path: '/mutfak' },
    { id: 'sosyal', name: 'Eraylar Sosyal', sub: 'Aktivite & Rutin', icon: '🎯', color: '#db2777', path: '/sosyal' },
    { id: 'alisveris', name: 'Eraylar Alışveriş', sub: 'Market & Liste', icon: '🛍️', color: '#0ea5e9', path: '/alisveris' },
    { id: 'tatil', name: 'Eraylar Tatil', sub: 'Gezi Planlayıcı', icon: '✈️', color: '#06b6d4', path: '/tatil' },
    { id: 'pet', name: 'Eraylar Pet', sub: 'Waffle & Mayıs', icon: '🐾', color: '#f59e0b', path: '/pet' },
    { id: 'health', name: 'Eraylar Sağlık', sub: 'İlaç & Ölçüm', icon: '🏥', color: '#ef4444', path: '/saglik' },
    { id: 'finans', name: 'Eraylar Finans', sub: 'Wealth Hub', icon: '💰', color: '#1e1b4b', path: '/finans' },
    { id: 'aracim', name: 'Eraylar Kokpit', sub: 'Tiguan R-Line', icon: '🏎️', color: '#334155', path: '/aracim' },
    { id: 'ev', name: 'Eraylar Ev', sub: 'Home Hub', icon: '🏠', color: '#10b981', path: '/ev' },
    { id: 'hedefler', name: 'Eraylar Vizyon', sub: 'Vision Hub', icon: '🏔️', color: '#6366f1', path: '/hedefler' },
    { id: 'kasa', name: 'Eraylar Kasa', sub: 'Wealth Vault', icon: '💎', color: '#7c3aed', path: '/kasa' }
  ];

  return (
    <AnimatedPage className="home-original-container">
      {/* Huge Logo Header from Screenshot */}
      <div className="home-header-original">
        <img src={logo} alt="Logo" className="huge-logo-top" />
        <div className="header-text-original">
          <h1>Eraylar Hanem</h1>
          <p>Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔 🐶 🐈</p>
        </div>
        <div className="header-actions-original">
           <button onClick={() => setShowLogs(true)}><BarChart2 size={20} /></button>
           <button onClick={() => navigate('/ayarlar')}><Settings size={20} /></button>
        </div>
      </div>

      <div className="home-scroll-area">
        {/* Assistant Section */}
        <div className="assistant-header-original">
          <span>✨ AKILLI AİLE ASİSTANI</span>
          <button onClick={() => setShowLogs(true)}><History size={18} /></button>
        </div>

        <div className="ai-status-bar-original">
           <span className="ai-emoji">💖</span>
           <p>Bugün her şey yolunda, keyfine bak!</p>
        </div>

        {/* Full-Width Block Modules from Screenshot */}
        <div className="module-stack-original">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-block-item"
              onClick={() => navigate(module.path)}
              style={{ backgroundColor: module.color }}
            >
              <div className="mbi-content">
                <span className="mbi-icon">{module.icon}</span>
                <div className="mbi-text">
                  <h3>{module.name}</h3>
                  <p>{module.sub}</p>
                </div>
                <ChevronRight size={24} className="mbi-arrow" />
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ height: '120px' }} />
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