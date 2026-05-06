import React, { useState } from 'react';
import { 
  Award, Trophy, Star, ChevronRight, ArrowLeft, Zap, 
  Heart, TrendingUp, Sparkles, CheckCircle, Lock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { ALL_ACHIEVEMENTS } from '../constants/achievements';
import toast from 'react-hot-toast';
import './Achievements.css';

export default function Achievements() {
  const navigate = useNavigate();
  const { users, currentUser } = useStore();
  
  const [badgeUser, setBadgeUser] = useState(currentUser?.name?.toLowerCase().includes('görkem') ? 'gorkem' : 'esra');
  const [filter, setFilter] = useState('all');

  const userAchievements = users[badgeUser]?.achievements || [];
  const earnedCount = userAchievements.length;

  const categories = [
    { id: 'all', label: 'Tümü', icon: '💎' },
    { id: 'mutfak', label: 'Mutfak', icon: '🍳' },
    { id: 'tatil', label: 'Tatil', icon: '✈️' },
    { id: 'finans', label: 'Finans', icon: '💰' },
    { id: 'hedefler', label: 'Hedefler', icon: '🎯' },
    { id: 'saglik', label: 'Sağlık', icon: '💖' },
    { id: 'sosyal', label: 'Sosyal', icon: '🦋' },
    { id: 'ev', label: 'Ev/Pet', icon: '🏠' },
  ];

  return (
    <AnimatedPage className="achievements-container">
      <header className="module-header glass" style={{ background: 'var(--achievements)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏅</span>
            <div className="header-text-box">
              <h1>Rozet Koleksiyonu</h1>
              <p>{earnedCount} / {ALL_ACHIEVEMENTS.length} Başarı Tamamlandı</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn-v2" onClick={() => navigate('/profil')}><ArrowLeft size={20} /></button>
          </div>
        </div>

        <div className="achieve-user-tabs">
            <button className={badgeUser === 'gorkem' ? 'active' : ''} onClick={() => setBadgeUser('gorkem')}>
                <span>👨‍💻</span> Görkem
            </button>
            <button className={badgeUser === 'esra' ? 'active' : ''} onClick={() => setBadgeUser('esra')}>
                <span>👩‍🍳</span> Esra
            </button>
        </div>
      </header>

      <div className="achievements-scroll-content">
        {/* Category Filter */}
        <div className="achieve-filters">
            {categories.map(c => (
                <button 
                    key={c.id} 
                    className={`filter-chip ${filter === c.id ? 'active' : ''}`}
                    onClick={() => setFilter(c.id)}
                >
                    {c.icon} {c.label}
                </button>
            ))}
        </div>

        {/* Badges Grid */}
        <div className="badges-grid-v3">
            {ALL_ACHIEVEMENTS
                .filter(a => filter === 'all' || a.cat === filter || (filter === 'ev' && (a.cat === 'ev' || a.cat === 'pet')))
                .map((a, idx) => {
                    const isEarned = userAchievements.includes(a.id);
                    return (
                        <div 
                            key={a.id} 
                            className={`badge-card-v3 glass ${isEarned ? 'earned animate-pop' : 'locked'}`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                            onClick={() => {
                                if (isEarned) toast.success(`${a.title}: ${a.desc}`, { icon: a.icon });
                                else toast.error(`Bu rozet henüz kilitli!`, { icon: '🔒' });
                            }}
                        >
                            <div className="bcv3-icon">
                                <span className="emoji">{isEarned ? a.icon : <Lock size={20} opacity={0.3} />}</span>
                                {isEarned && <div className="earned-mark"><CheckCircle size={12} /></div>}
                            </div>
                            <div className="bcv3-info">
                                <strong>{a.title}</strong>
                                <p>{a.desc}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
      </div>
    </AnimatedPage>
  );
}
