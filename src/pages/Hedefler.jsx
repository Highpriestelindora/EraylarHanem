import React, { useState, useMemo } from 'react';
import { 
  Target, Plus, CheckCircle, Circle, Trash2, Trophy, 
  Sparkles, Heart, Star, ChevronRight, ArrowLeft,
  Calendar, Camera, User, Users, Flame, Award,
  TrendingUp, Compass, Flag, Shield, Briefcase, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import GoalAdvisor from '../components/GoalAdvisor';
import GoalSimulator from '../components/GoalSimulator';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import './Hedefler.css';

const formatPercent = (val) => `${Math.round(val)}%`;

export default function Hedefler() {
  const [activeTab, setActiveTab] = useState('aktif');
  const [showSimulator, setShowSimulator] = useState(false);
  const navigate = useNavigate();
  const { hedefler, kasa, updateGoalProgress, toggleHabit, completeGoal } = useStore();

  const { 
    goals = [], 
    habits = [], 
    hallOfFame = [], 
    moodboard = { quote: "Büyük işler, küçük başlangıçlarla olur." } 
  } = hedefler || {};

  const moneyGoals = kasa?.kumbaralar || [];

  // Combine both types of goals for the unified view with math engine
  const unifiedGoals = useMemo(() => {
    const now = new Date();
    
    const combined = [
      ...goals.map(g => ({ ...g, type: 'vision' })),
      ...moneyGoals.map(g => {
        // Math Engine: Forecasting
        let forecast = null;
        if (g.deadline && g.current < g.target) {
          const dl = new Date(g.deadline);
          const diffTime = dl - now;
          const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
          
          if (diffMonths > 0) {
            const remaining = g.target - g.current;
            const monthly = Math.round(remaining / diffMonths);
            forecast = { months: diffMonths, monthlyNeeded: monthly };
          } else {
            forecast = { overdue: true };
          }
        }

        return { 
          ...g, 
          type: 'money', 
          title: g.name, 
          targetDate: g.deadline,
          owner: g.owner || 'ortak',
          forecast
        };
      })
    ];
    return combined;
  }, [goals, moneyGoals]);

  const [filterOwner, setFilterOwner] = useState('all');

  const filteredGoals = useMemo(() => {
    if (filterOwner === 'all') return goals;
    return goals.filter(g => g.owner === filterOwner);
  }, [goals, filterOwner]);

  const handleComplete = (id) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#3b82f6', '#10b981']
    });
    completeGoal(id);
    toast.success('BAŞARDIN! Hedef başarı galerisine eklendi. 🏆');
  };

  const tabs = [
    { id: 'aktif', label: 'Aktif', emoji: '🎯' },
    { id: 'vizyon', label: 'Vizyon', emoji: '🔭' },
    { id: 'basarilar', label: 'Başarılar', emoji: '🏆' }
  ];

  return (
    <AnimatedPage className="hedefler-container">
      <header className="module-header glass" style={{ background: 'var(--hedefler)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🎯</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Hedefler</h1>
              <p>{moodboard?.quote || "Gelecek, ona hazırlananlarındır."}</p>
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

            </button>
          ))}
        </nav>
      </header>

      <div className="hedefler-scroll-content">
        {activeTab === 'aktif' && (
          <div className="aktif-view animate-fadeIn">
            {/* Eraylar Vizyoner HUD */}
            <GoalAdvisor 
              visionGoals={goals} 
              moneyGoals={moneyGoals} 
              onSimulate={() => setShowSimulator(true)}
            />

            {/* Filter */}
            <div className="owner-filter-chips">
              {['all', 'gorkem', 'esra', 'ortak'].map(o => (
                <button 
                  key={o} 
                  className={`chip ${filterOwner === o ? 'active' : ''}`}
                  onClick={() => setFilterOwner(o)}
                >
                  {o === 'all' && 'Tümü'}
                  {o === 'gorkem' && 'Görkem'}
                  {o === 'esra' && 'Esra'}
                  {o === 'ortak' && 'Aile'}
                </button>
              ))}
            </div>

            {/* Habit Tracker Section */}
            <div className="habit-section mt-24">
              <div className="section-header-v2">
                <h3>🔥 Alışkanlık Takibi</h3>
                <Sparkles size={16} color="#f59e0b" />
              </div>
              <div className="habit-grid">
                {habits.map(h => {
                   const isDone = h.lastDone === new Date().toISOString().split('T')[0];
                   return (
                     <div key={h.id} className={`habit-card glass ${isDone ? 'done' : ''}`} onClick={() => toggleHabit(h.id)}>
                        <div className="h-streak">
                          <Flame size={14} fill={isDone ? "#f87171" : "transparent"} color={isDone ? "#f87171" : "var(--txt-light)"} />
                          <span>{h.streak}</span>
                        </div>
                        <strong>{h.name}</strong>
                        <div className={`h-check ${isDone ? 'checked' : ''}`}>
                          {isDone ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </div>
                     </div>
                   );
                })}
              </div>
            </div>

            {/* Goals List */}
            <div className="goals-section mt-24">
              <div className="section-header-v2">
                <h3>🎯 Aktif Hedefler & Birikimler</h3>
                <button className="add-btn-mini" onClick={() => navigate('/kasa', { state: { activeTab: 'kumbara' } })} title="Kasa'da Hedef Yönet">
                   <Plus size={14} />
                </button>
              </div>
              <div className="goals-grid-v2">
                {unifiedGoals
                  .filter(g => filterOwner === 'all' || g.owner === filterOwner)
                  .map(g => {
                    const isMoney = g.type === 'money';
                    const perc = isMoney ? (g.current / g.target) * 100 : (g.current / g.target) * 100;
                   return (
                     <div key={g.id} className={`goal-card-premium glass ${perc > 80 ? 'focus-glow' : ''}`}>
                        <div className="gcp-ring-box">
                           <svg viewBox="0 0 36 36" className="circular-chart-v2">
                             <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                             <path className="circle" stroke={perc > 75 ? '#10b981' : '#7c3aed'} strokeDasharray={`${perc}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                           </svg>
                           <div className="gcp-icon">
                              {isMoney ? (
                                <TrendingUp size={16} color="#10b981" />
                              ) : (
                                <>
                                  {g.category === 'finans' && <TrendingUp size={16} />}
                                  {g.category === 'kariyer' && <Briefcase size={16} />}
                                  {g.category === 'sağlık' && <Zap size={16} />}
                                </>
                              )}
                           </div>
                        </div>
                        <div className="gcp-content">
                           <div className="gcp-header">
                             <strong>{g.title}</strong>
                             <span className={`priority-tag ${
                               g.priority === 'Yüksek' ? 'yuksek' : 
                               g.priority === 'Orta' ? 'orta' : 'dusuk'
                             }`}>{g.priority}</span>
                           </div>
                           <div className="gcp-milestones">
                              {isMoney ? (
                                <div className="money-milestone">
                                   <strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(g.current)}</strong>
                                   <span> / {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(g.target)}</span>
                                </div>
                              ) : (
                                g.milestones?.slice(0, 2).map(m => (
                                  <div key={m.id} className="m-item">
                                    {m.done ? <CheckCircle size={10} color="#10b981" /> : <Circle size={10} />}
                                    <span>{m.text}</span>
                                  </div>
                                ))
                              )}
                           </div>
                            <div className="gcp-footer">
                              <div className="gcp-progress-text">
                                {isMoney ? (
                                   <div className="forecast-badge">
                                      {g.forecast?.overdue ? (
                                        <span className="overdue">Süre Doldu! ⚠️</span>
                                      ) : g.forecast ? (
                                        <span className="on-track">Aylık: <strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(g.forecast.monthlyNeeded)}</strong></span>
                                      ) : perc >= 100 ? (
                                        <span className="completed">TAMAMLANDI 🏆</span>
                                      ) : (
                                        <span>%{Math.round(perc)} Tamamlandı</span>
                                      )}
                                   </div>
                                ) : (
                                  perc >= 100 ? (
                                    <button className="complete-btn" onClick={() => handleComplete(g.id)}>TAMAMLA</button>
                                  ) : (
                                    <span>%{Math.round(perc)} Tamamlandı</span>
                                  )
                                )}
                              </div>
                              <small>{isMoney ? (g.forecast?.months ? `${g.forecast.months} Ay Kaldı` : g.targetDate) : g.targetDate}</small>
                            </div>
                        </div>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vizyon' && (
          <div className="vizyon-view animate-fadeIn">
             <div className="vizyon-layer">
                <div className="layer-header"><Compass size={18} /> <span>3 YILLIK PLAN</span></div>
                <div className="layer-content glass">
                  <div className="vision-item">🚀 Yazılım mimarı olarak global bir projede yer al.</div>
                  <div className="vision-item">🏡 İlk yatırım evini teslim al.</div>
                </div>
             </div>
             <div className="vizyon-layer mt-24">
                <div className="layer-header"><Flag size={18} /> <span>HAYAT VİZYONU</span></div>
                <div className="layer-content glass">
                  <div className="vision-item">🌍 Dünyayı gezerek uzaktan çalış.</div>
                  <div className="vision-item">✨ Finansal özgürlüğe ulaş.</div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'basarilar' && (
          <div className="basarilar-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🏆 Başarı Galerisi (Hall of Fame)</h3>
            </div>
            <div className="hall-grid">
              {hallOfFame.length > 0 ? hallOfFame.map(h => (
                <div key={h.id} className="hall-card glass">
                   <div className="hall-icon"><Award size={32} color="#f59e0b" /></div>
                   <strong>{h.title}</strong>
                   <small>{h.completedDate}</small>
                   <p>Ödül: {h.reward}</p>
                </div>
              )) : (
                <div className="empty-hall glass">
                  <Trophy size={48} opacity={0.2} />
                  <p>Henüz tamamlanan bir hedef yok. İlk hedefini tamamla ve burada sergile!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showSimulator && (
        <GoalSimulator 
          goals={unifiedGoals} 
          onClose={() => setShowSimulator(false)} 
        />
      )}
    </AnimatedPage>
  );
}
