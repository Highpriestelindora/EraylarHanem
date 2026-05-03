import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Heart, Palette, Shirt, Camera, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import './Modaring.css';

// Tab Components
import KasaTab from './ModaringTabs/KasaTab';
import VardiyaTab from './ModaringTabs/VardiyaTab';
import TedarikTab from './ModaringTabs/TedarikTab';
import AjandaTab from './ModaringTabs/AjandaTab';
import TrendTab from './ModaringTabs/TrendTab';

const Modaring = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vardiya');

  const tabs = [
    { id: 'kasa', label: 'Kasa', icon: Palette, emoji: '💰' },
    { id: 'vardiya', label: 'Vardiya', icon: Shirt, emoji: '🕒' },
    { id: 'tedarik', label: 'Tedarik', icon: Heart, emoji: '📦' },
    { id: 'ajanda', label: 'Ajanda', icon: Calendar, emoji: '📅' },
    { id: 'trend', label: 'Trend', icon: TrendingUp, emoji: '🚀' }
  ];

  return (
    <AnimatedPage className="modaring-container">
      <header className="module-header glass" style={{ background: 'linear-gradient(135deg, #fb7185, #e11d48)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">✨</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Modaring</h1>
              <p>Esra'nın Tasarım Dünyası</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1 }}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span style={{ fontSize: '10px' }}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="modaring-content">
        {activeTab === 'kasa' && <KasaTab />}
        {activeTab === 'vardiya' && <VardiyaTab />}
        {activeTab === 'tedarik' && <TedarikTab />}
        {activeTab === 'ajanda' && <AjandaTab />}
        {activeTab === 'trend' && <TrendTab />}
      </div>
    </AnimatedPage>
  );
};

export default Modaring;
