import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Settings, BarChart2 } from 'lucide-react';
import useStore from '../store/useStore';
import FloatingHub from './FloatingHub';
import logo from '../assets/eraylar-logo.png';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, currentUser } = useStore();
  const isHome = location.pathname === '/';
  
  return (
    <div className="app-container">
      {/* Header - Hidden on Home for a cleaner look */}
      {!isHome && (
        <header className="app-header glass">
        <div>
          <div className="header-title-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="header-logo-mini" />
            <h1>Eraylar Hanem</h1>
            <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Online' : 'Offline'} />
          </div>
          <small>Hoş geldin, {currentUser?.name || 'Misafir'}</small>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="icon-btn" 
            style={{ background: 'var(--bg)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: 'var(--txt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate('/analiz')}
            title="İstatistikler ve Analiz"
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className="icon-btn" 
            style={{ background: 'var(--bg)', border: '1px solid var(--brd)', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: 'var(--txt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => navigate('/ayarlar')}
            title="Genel Ayarlar"
          >
            <Settings size={20} />
          </button>
          <div className="avatar clickable" onClick={() => navigate('/profil')} title="Profilim">
            {currentUser?.emoji || '👤'}
          </div>
        </div>
      </header>
      )}

      {/* Main Content Area */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Modern Floating Navigation Hub */}
      <FloatingHub />
    </div>
  );
}
