import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutDashboard, ChefHat, Wallet, Home as HomeIcon, 
  Activity, Car, Heart, Sparkles 
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

// Tab Bileşenleri
import GenelStatsTab from './AnalizTabs/GenelStatsTab';
import MutfakStatsTab from './AnalizTabs/MutfakStatsTab';
import FinansStatsTab from './AnalizTabs/FinansStatsTab';
import EvStatsTab from './AnalizTabs/EvStatsTab';
import SosyalStatsTab from './AnalizTabs/SosyalStatsTab';
import GarajStatsTab from './AnalizTabs/GarajStatsTab';
import PetSaglikStatsTab from './AnalizTabs/PetSaglikStatsTab';

import './Analiz.css';

export default function Analiz() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('genel');

  const tabs = [
    { id: 'genel', label: 'Genel Bakış', icon: LayoutDashboard, emoji: '📊' },
    { id: 'mutfak', label: 'Mutfak', icon: ChefHat, emoji: '🍳' },
    { id: 'finans', label: 'Finans', icon: Wallet, emoji: '💰' },
    { id: 'ev', label: 'Ev', icon: HomeIcon, emoji: '🏠' },
    { id: 'sosyal', label: 'Sosyal', icon: Activity, emoji: '🎭' },
    { id: 'garaj', label: 'Garaj', icon: Car, emoji: '🚗' },
    { id: 'pet', label: 'Pet & Sağlık', icon: Heart, emoji: '🐾' }
  ];

  return (
    <AnimatedPage className="analiz-container">
      {/* Header */}
      <header className="analiz-header">
        <div className="analiz-header-left">
          <button 
            onClick={() => navigate('/')} 
            className="analiz-back-btn"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="analiz-title-group">
            <h2>
              📊 İstatistikler & Analiz
            </h2>
            <span>Eraylar Hanem'in tüm modül geçmişi ve verileri</span>
          </div>
        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <div className="analiz-tabs-scroll">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analiz-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      <div className="analiz-content-wrap">
        {activeTab === 'genel' && <GenelStatsTab onSelectTab={setActiveTab} />}
        {activeTab === 'mutfak' && <MutfakStatsTab />}
        {activeTab === 'finans' && <FinansStatsTab />}
        {activeTab === 'ev' && <EvStatsTab />}
        {activeTab === 'sosyal' && <SosyalStatsTab />}
        {activeTab === 'garaj' && <GarajStatsTab />}
        {activeTab === 'pet' && <PetSaglikStatsTab />}
      </div>
    </AnimatedPage>
  );
}
