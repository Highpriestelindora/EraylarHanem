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
  const mutfak = useStore(state => state.mutfak);

  const tabs = [
    { id: 'menu', label: 'Menü', icon: Calendar, emoji: '📅' },
    { id: 'stok', label: 'Stok', icon: Refrigerator, emoji: '🧊' },
    { id: 'ekmek', label: 'Ekmek', icon: Wheat, emoji: '🥖' },
    { id: 'su', label: 'Su', icon: Droplets, emoji: '💧' },
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
              <p>
                {mutfak && (() => {
                  const shoppingListNames = (mutfak.alisveris || []).map(i => i.n?.toLowerCase() || '');
                  const criticalCount = ['buzdolabi', 'kiler', 'dondurucu'].reduce((acc, loc) => 
                    acc + (mutfak[loc] || []).filter(i => 
                      i.mn > 0 && i.cr <= i.mn && !shoppingListNames.includes(i.n?.toLowerCase() || '')
                    ).length, 0);
                  return criticalCount > 0 
                    ? `${criticalCount} kritik eksik ürün var!` 
                    : "Mutfak operasyon merkezi";
                })()}
              </p>
            </div>
          </div>
          <div className="header-actions">
              <button 
                className="icon-btn" 
                onClick={() => setActiveTab(prev => prev === 'tarifler' ? 'menu' : 'tarifler')}
                style={{ background: activeTab === 'tarifler' ? 'white' : 'rgba(255,255,255,0.25)', color: activeTab === 'tarifler' ? '#ea580c' : 'white' }}
                title="Tarifler"
              >
                <BookOpen size={20} />
              </button>
              <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
                <ArrowLeft size={20} />
              </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span style={{ fontSize: '18px', marginBottom: '2px' }}>{t.emoji}</span>
              <span style={{ fontSize: '10px' }}>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="mutfak-content">
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'stok' && <StokTab searchTerm={searchTerm} />}
        {activeTab === 'ekmek' && <EkmeklikTab />}
        {activeTab === 'su' && <SuTakipTab />}
        {activeTab === 'alisveris' && <AlisverisTab />}
        {activeTab === 'sohbet' && <SohbetTab />}
        {activeTab === 'tarifler' && <TariflerTab />}
      </main>
    </AnimatedPage>
  );
}