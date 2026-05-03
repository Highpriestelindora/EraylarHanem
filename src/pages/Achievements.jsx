import React from 'react';
import { Award, Trophy, Star, ChevronRight, ArrowLeft, Zap, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import './Achievements.css';

export default function Achievements() {
  const navigate = useNavigate();
  const { system } = useStore();
  const achievements = system?.achievements || [];

  const earnedCount = (achievements || []).filter(a => a.earned).length;

  return (
    <AnimatedPage className="achievements-container">
      <header className="module-header glass achieve-premium-grad">
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏆</span>
            <div className="header-text-box">
              <h1>Başarılarım</h1>
              <p>{earnedCount} Rozet Kazanıldı</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn-v2" onClick={() => navigate('/')}><ArrowLeft size={20} /></button>
          </div>
        </div>
      </header>

      <div className="achievements-scroll-content">
        {/* Statistics Recap */}
        <div className="stats-recap-card glass animate-fadeIn">
           <div className="src-header">
             <Zap size={20} color="#f59e0b" />
             <span>Yıllık Özet (2025)</span>
           </div>
           <div className="src-body">
              <div className="src-item">
                <strong>42</strong>
                <small>Haftalık Rapor</small>
              </div>
              <div className="src-item">
                <strong>%92</strong>
                <small>Ort. Yaşam Skoru</small>
              </div>
              <div className="src-item">
                <strong>12</strong>
                <small>Hedef Ulaşıldı</small>
              </div>
           </div>
           <button className="src-btn">YouTube Music Tarzı Özet <ChevronRight size={14} /></button>
        </div>

        {/* Badges Grid */}
        <div className="badges-section mt-24">
           <div className="section-header-v2">
             <h3>🥇 Rozet Koleksiyonu</h3>
           </div>
           <div className="badges-grid-v2">
              {achievements.map(a => (
                <div key={a.id} className={`badge-card-premium glass ${a.earned ? 'earned' : 'locked'}`}>
                   <div className="bcp-icon">{a.earned ? a.icon : '🔒'}</div>
                   <div className="bcp-info">
                     <strong>{a.title}</strong>
                     <small>{a.earned ? 'Kazanıldı' : 'Henüz Kilitli'}</small>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Upcoming Challenges */}
        <div className="challenges-section mt-24">
           <div className="section-header-v2">
             <h3>🎯 Sıradaki Görevler</h3>
           </div>
           <div className="challenge-item glass">
             <div className="ci-icon"><TrendingUp size={18} /></div>
             <div className="ci-text">
                <strong>Tasarruf Ustası II</strong>
                <p>3 ay üst üste bütçe sınırında kal.</p>
             </div>
             <div className="ci-perc">%60</div>
           </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
