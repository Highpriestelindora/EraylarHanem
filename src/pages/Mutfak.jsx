import React, { useState } from 'react';
import {
  Droplets, Refrigerator, BookOpen,
  ShoppingCart, Calendar, MessageSquare, Wheat,
  ArrowLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';

// Tab Components
import MenuTab from './MutfakTabs/MenuTab';
import StokTab from './MutfakTabs/StokTab';
import SuTakipTab from './MutfakTabs/SuTakipTab';
import EkmeklikTab from './MutfakTabs/EkmeklikTab';
import AlisverisTab from './MutfakTabs/AlisverisTab';
import SohbetTab from './MutfakTabs/SohbetTab';
import TariflerTab from './MutfakTabs/TariflerTab';

import './Mutfak.css';

export default function Mutfak() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const { mutfak } = useStore();

  const tabs = [
    { id: 'menu', label: 'Menü', icon: Calendar, emoji: '📅' },
    { id: 'stok', label: 'Stok', icon: Refrigerator, emoji: '🧊' },
    { id: 'ekmek', label: 'Ekmek', icon: Wheat, emoji: '🥖' },
    { id: 'su', label: 'Su', icon: Droplets, emoji: '💧' },
    { id: 'tarifler', label: 'Tarifler', icon: BookOpen, emoji: '📖' },
    { id: 'alisveris', label: 'Alışveriş', icon: ShoppingCart, emoji: '🛒' }
  ];

  return (
    <AnimatedPage className="mutfak-page">
      <header className="module-header glass" style={{ background: 'var(--mutfak)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🍲</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Mutfak</h1>
              {mutfak && (() => {
                const shoppingListNames = (mutfak.alisveris || []).map(i => i.n?.toLowerCase() || '');
                const criticalCount = ['buzdolabi', 'kiler', 'dondurucu'].reduce((acc, loc) => 
                  acc + (mutfak[loc] || []).filter(i => 
                    i.mn > 0 && i.cr <= i.mn && !shoppingListNames.includes(i.n?.toLowerCase() || '')
                  ).length, 0);
                return criticalCount > 0 ? (
                  <div className="critical-container" onClick={() => setActiveTab('alisveris')}>
                    <div className="critical-box">
                      <span className="c-emoji">⚠️</span>
                      <strong>{criticalCount} Ürün Azaldı!</strong>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                ) : null;
              })()}
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
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      <main className="mutfak-content">
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'stok' && <StokTab />}
        {activeTab === 'ekmek' && <EkmeklikTab />}
        {activeTab === 'su' && <SuTakipTab />}
        {activeTab === 'tarifler' && <TariflerTab />}
        {activeTab === 'alisveris' && <AlisverisTab />}
      </main>
    </AnimatedPage>
  );
}