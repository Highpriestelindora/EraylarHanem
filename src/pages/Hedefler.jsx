import React, { useState, useMemo } from 'react';
import { 
  Target, Plus, CheckCircle, XCircle, Circle, Trash2, Trophy, 
  Sparkles, Heart, Star, ChevronRight, ArrowLeft,
  Calendar, Camera, User, Users, Flame, Award,
  TrendingUp, Compass, Flag, Shield, Briefcase, Zap,
  Edit3, MoreVertical, Clock, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import './Hedefler.css';

const VISION_QUOTES = [
  "Aileni çok sevmelisin, onlar senin en büyük hazinen. ❤️",
  "Hayallerini takip etmelisin, çünkü onlar senin ruhunun pusulası. 🔭",
  "Waffle ve Mayıs'ın neşesini örnek al; her anın tadını çıkar. 🐶🐱",
  "Küçük adımlar, büyük zaferlerin anahtarıdır. ✨",
  "Eraylar Hanem'in geleceği senin ellerinde parlıyor. 🌟",
  "Bugün kurduğun hayal, yarın yaşayacağın gerçektir. 🌈",
  "Sevgiyle kurulan her vizyon, başarıya giden en kısa yoldur. 🥂",
  "Sabırlı ol; en güzel çiçekler en yavaş büyüyenlerdir. 🌺",
  "Hayal kurmaktan korkma, sınırlar sadece zihnindedir. 🚀",
  "Esra ve Görkem için en güzel günler hep ileride. 💍",
  "Evinin sıcaklığı, hayallerinin motorudur. 🏡",
  "Disiplin, hayaller ile başarı arasındaki köprüdür. 🏗️",
  "İçindeki ışığı asla söndürme; o senin vizyonun. 💡"
];

export default function Hedefler() {
  const [activeTab, setActiveTab] = useState('kisa');
  const [selectedGoal, setSelectedGoal] = useState(null); // For details/edit
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [reflectionGoal, setReflectionGoal] = useState(null); // { id, type, mode: 'success' | 'fail' }
  const [reflectionText, setReflectionText] = useState('');

  const navigate = useNavigate();
  const { hedefler, kasa, users, currentUser, completeGoal, failGoal, updateCompletedGoal, deleteCompletedGoal, updateFailedGoal, deleteFailedGoal, updateCompletedHistory, addVisionGoal, updateVisionGoal, deleteVisionGoal, updateGoal, deleteGoal, addVisionPlan, updateVisionPlan, deleteVisionPlan } = useStore();

  const { 
    goals = [], 
    hallOfFame = [], 
    moodboard = { quote: "Büyük işler, küçük başlangıçlarla olur." },
    longTermVision = [],
    completedHistory = [],
    failedHistory = []
  } = hedefler || {};

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const moneyGoals = kasa?.kumbaralar || [];

  const unifiedGoals = useMemo(() => {
    const combined = [
      ...goals.map(g => ({ ...g, type: 'vision' })),
      ...moneyGoals.map(g => ({ 
        ...g, 
        type: 'money', 
        title: g.name, 
        targetDate: g.deadline,
        owner: g.owner || 'ortak'
      }))
    ];
    return combined;
  }, [goals, moneyGoals]);

  const [filterOwner, setFilterOwner] = useState('all');

  const { shortTermGoals, longTermGoals } = useMemo(() => {
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    const st = unifiedGoals.filter(g => {
        if (!g.targetDate) return true;
        return new Date(g.targetDate) <= oneYearFromNow;
    });

    const lt = unifiedGoals.filter(g => {
        if (!g.targetDate) return false;
        return new Date(g.targetDate) > oneYearFromNow;
    });

    return { shortTermGoals: st, longTermGoals: lt };
  }, [unifiedGoals]);

  const handleComplete = (id, type) => {
    setReflectionGoal({ id, type, mode: 'success' });
    setReflectionText('');
  };

  const handleFail = (id, type) => {
    setReflectionGoal({ id, type, mode: 'fail' });
    setReflectionText('');
  };

  const submitReflection = () => {
    if (!reflectionGoal) return;
    
    if (reflectionGoal.isEditingHistory) {
        if (reflectionGoal.mode === 'success') {
            updateCompletedGoal(reflectionGoal.id, { notes: reflectionText });
            toast.success('Kazanım güncellendi! ✨');
        } else {
            updateFailedGoal(reflectionGoal.id, { notes: reflectionText });
            toast.success('Ders notu güncellendi! 💪');
        }
    } else {
        if (reflectionGoal.mode === 'success') {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#fbbf24', '#f59e0b', '#d97706']
            });
            completeGoal(reflectionGoal.id, reflectionGoal.type, reflectionText);
            toast.success('HARİKA! Kazanımlarına bir yenisi eklendi. 🎊');
        } else {
            failGoal(reflectionGoal.id, reflectionGoal.type, reflectionText);
            toast.error('Hedef kayıplara taşındı. Önemli olan ders almak! 💪');
        }
    }
    
    setReflectionGoal(null);
    setReflectionText('');
    setShowGoalModal(false);
  };

  const pendingCompletions = useMemo(() => {
    return unifiedGoals.filter(g => {
        const perc = (g.current / g.target) * 100;
        return perc >= 100;
    });
  }, [unifiedGoals]);

  const tabs = [
    { id: 'kisa', label: 'Kısa', emoji: '⏱️' },
    { id: 'uzun', label: 'Uzun', emoji: '🔭' },
    { id: 'kazanimlar', label: 'Kazanımlar', emoji: '✅' },
    { id: 'kayiplar', label: 'Kayıplar', emoji: '❌' },
    { id: 'vizyon', label: 'Vizyon', emoji: '🌟' }
  ];

  const randomQuote = useMemo(() => {
    return VISION_QUOTES[Math.floor(Math.random() * VISION_QUOTES.length)];
  }, [activeTab]);

  const showcaseVisions = useMemo(() => {
    return [...longTermVision].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [longTermVision]);

  const handleGoalAction = (g, action) => {
    if (action === 'delete') {
      setGoalToDelete(g);
    } else if (action === 'edit') {
      setSelectedGoal(g);
      setIsEditing(true);
      setShowGoalModal(true);
    } else {
      setSelectedGoal(g);
      setIsEditing(false);
      setShowGoalModal(true);
    }
  };

  const renderGoalCard = (g) => {
    const isMoney = g.type === 'money';
    const perc = (g.current / g.target) * 100;
    return (
      <div key={g.id} className={`goal-card-premium glass ${perc > 80 ? 'focus-glow' : ''}`} onClick={() => handleGoalAction(g, 'view')}>
         <div className="gcp-ring-box">
            <svg viewBox="0 0 36 36" className="circular-chart-v2">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" stroke={perc > 75 ? '#10b981' : '#7c3aed'} strokeDasharray={`${perc}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="gcp-icon">
               {isMoney ? (
                 <TrendingUp size={16} color="#10b981" />
               ) : (
                 <Target size={16} color="#7c3aed" />
               )}
            </div>
         </div>
         <div className="gcp-content">
            <div className="gcp-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>{g.title}</strong>
                <small style={{ fontSize: '10px', opacity: 0.6 }}>{g.owner?.toUpperCase()}</small>
              </div>
              <div className="gcp-actions-inline" onClick={e => e.stopPropagation()}>
                 <button className="gcp-mini-btn" onClick={() => handleGoalAction(g, 'edit')}><Edit3 size={14} /></button>
                 <button className="gcp-mini-btn del" onClick={() => handleGoalAction(g, 'delete')}><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="gcp-milestones">
               {isMoney ? (
                 <div className="money-milestone">
                    <strong>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(g.current)}</strong>
                    <span> / {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(g.target)}</span>
                 </div>
               ) : (
                 <div className="vision-milestone">
                    <span>%{Math.round(perc)} Tamamlandı</span>
                 </div>
               )}
            </div>
                <div className="gcp-footer">
                <div className="gcp-progress-text">
                  {perc >= 100 ? (
                     <button className="complete-btn" onClick={(e) => { e.stopPropagation(); handleComplete(g.id, g.type); }}>TAMAMLA ✅</button>
                  ) : (
                     <span className={`priority-tag ${g.priority === 'Yüksek' ? 'yuksek' : g.priority === 'Orta' ? 'orta' : 'dusuk'}`}>
                       {g.priority}
                     </span>
                  )}
                </div>
                <small style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} /> {g.targetDate || 'Tarihsiz'}
                  {g.duration && <span style={{ color: '#94a3b8' }}>· {g.duration} Ay</span>}
                </small>
              </div>
          </div>
       </div>
    );
  };

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
        
        {(activeTab === 'kisa' || activeTab === 'uzun') && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                <button className="pill-btn-premium" onClick={() => { setSelectedGoal(null); setIsEditing(true); setShowGoalModal(true); }}>
                    <Plus size={16} /> HEDEF EKLE
                </button>
            </div>
        )}

        {/* İşte Bu Kadar! Celebration Banner */}
        {pendingCompletions.length > 0 && (activeTab === 'kisa' || activeTab === 'uzun') && (
            <div className="celebration-banner-premium animate-bounceIn">
                <div className="cbp-content">
                    <span className="cbp-emoji">🚀</span>
                    <div className="cbp-text">
                        <strong>İŞTE BU KADAR!</strong>
                        <p>{pendingCompletions.length} hedefin zirvesine ulaştın!</p>
                    </div>
                </div>
                <button className="cbp-btn" onClick={() => {
                    const g = pendingCompletions[0];
                    handleComplete(g.id, g.type);
                }}>KAYDET VE KUTLA! 🎉</button>
            </div>
        )}

        {activeTab === 'kisa' && (
          <div className="aktif-view animate-fadeIn">
            <div className="goals-section">
              <div className="section-header-v2">
                <h3>🎯 Kısa Vadeli Stratejiler</h3>
                <span className="count-badge">{shortTermGoals.length}</span>
              </div>
              <div className="goals-grid-v2">
                {shortTermGoals
                  .filter(g => filterOwner === 'all' || g.owner === filterOwner || g.owner === 'aile' || g.owner === 'ortak')
                  .map(renderGoalCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uzun' && (
          <div className="aktif-view animate-fadeIn">
            <div className="goals-section">
              <div className="section-header-v2">
                <h3>🔭 Vizyoner Hedefler (+1 Yıl)</h3>
                <span className="count-badge">{longTermGoals.length}</span>
              </div>
              <div className="goals-grid-v2">
                {longTermGoals
                  .filter(g => filterOwner === 'all' || g.owner === filterOwner || g.owner === 'aile' || g.owner === 'ortak')
                  .map(renderGoalCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kazanimlar' && (
            <div className="kazanimlar-tab-content animate-fadeIn">
                <div className="section-header-v2">
                    <h3>✅ Kazanımlar Geçmişi</h3>
                    <span className="count-badge">{completedHistory.length}</span>
                </div>
                
                <div className="kazanimlar-list">
                    {completedHistory
                        .filter(h => filterOwner === 'all' || h.owner === filterOwner || h.owner === 'aile' || h.owner === 'ortak')
                        .map(h => (
                        <div key={h.id} className="kazanim-card success glass">
                            <div className="kc-header">
                                <div className="kc-title-box">
                                    <span className="kc-emoji">💎</span>
                                    <div>
                                        <strong>{h.title}</strong>
                                        <small>{new Date(h.completedAt).toLocaleDateString('tr-TR')} · {h.owner === 'gorkem' ? 'Görkem' : h.owner === 'esra' ? 'Esra' : 'Aile'}</small>
                                    </div>
                                </div>
                                <div className="kc-actions">
                                    <button className="gcp-mini-btn" onClick={() => {
                                        setReflectionGoal({ id: h.id, mode: 'success', isEditingHistory: true });
                                        setReflectionText(h.notes || '');
                                    }}><Edit3 size={14} /></button>
                                    <button className="gcp-mini-btn del" onClick={() => setGoalToDelete({ ...h, historyType: 'completed' })}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="kc-notes">
                                <strong>Kazanılanlar:</strong>
                                <p>{h.notes || 'Bu kazanım için henüz bir not alınmamış...'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'kayiplar' && (
            <div className="kazanimlar-tab-content animate-fadeIn">
                <div className="section-header-v2">
                    <h3>❌ Kayıplar ve Dersler</h3>
                    <span className="count-badge">{failedHistory.length}</span>
                </div>
                
                <div className="kazanimlar-list">
                    {failedHistory.map(h => (
                        <div key={h.id} className="kazanim-card failure glass">
                            <div className="kc-header">
                                <div className="kc-title-box">
                                    <span className="kc-emoji">⚠️</span>
                                    <div>
                                        <strong>{h.title}</strong>
                                        <small>{new Date(h.failedAt).toLocaleDateString('tr-TR')} · {h.owner === 'gorkem' ? 'Görkem' : h.owner === 'esra' ? 'Esra' : 'Aile'}</small>
                                    </div>
                                </div>
                                <div className="kc-actions">
                                    <button className="gcp-mini-btn" onClick={() => {
                                        setReflectionGoal({ id: h.id, mode: 'fail', isEditingHistory: true });
                                        setReflectionText(h.notes || '');
                                    }}><Edit3 size={14} /></button>
                                    <button className="gcp-mini-btn del" onClick={() => setGoalToDelete({ ...h, historyType: 'failed' })}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="kc-notes">
                                <strong>Neden Başarılamadı & Alınan Ders:</strong>
                                <p>{h.notes || 'Henüz bir açıklama eklenmemiş...'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'vizyon' && (
            <div className="vizyon-hub animate-fadeIn">
                <div className="vision-quote-card glass animate-float">
                    <Sparkles className="quote-sparkle-top" size={24} />
                    <p className="vision-quote-text">"{randomQuote}"</p>
                    <Sparkles className="quote-sparkle-bottom" size={24} />
                </div>

                <div className="section-header-v2" style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3>🌟 Hayal Merkezi</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>GELECEĞİ BURADA İNŞA EDİYORUZ</p>
                    </div>
                    <button className="pill-btn-premium" onClick={() => { setSelectedPlan(null); setShowPlanModal(true); }}>
                        <Plus size={16} /> HAYAL EKLE
                    </button>
                </div>

                <div className="showcase-container">
                    {showcaseVisions.length > 0 ? (
                        <div className="vision-showcase-grid">
                            {showcaseVisions.map((plan, idx) => (
                                <div key={plan.id} className={`vision-showcase-card glass delay-${idx}`}>
                                    <div className="vsc-badge">HAYAL #{idx + 1}</div>
                                    <div className="vsc-text">{plan.text}</div>
                                    <div className="vsc-footer">
                                        <button className="vsc-action" onClick={() => { setSelectedPlan(plan); setShowPlanModal(true); }}><Edit3 size={14} /></button>
                                        <button className="vsc-action del" onClick={() => setGoalToDelete({ ...plan, historyType: 'vision' })}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-v2 glass">
                            <Compass size={40} style={{ color: '#cbd5e1' }} />
                            <p>Henüz bir vizyon planı eklenmemiş. Hayal kurmaya başla!</p>
                        </div>
                    )}
                </div>

                <div className="vision-all-list mt-32">
                    <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#1e293b' }}>📚 Tüm Vizyon Arşivi</h4>
                    <div className="vizyon-grid-premium">
                        {longTermVision
                            .filter(p => filterOwner === 'all' || p.owner === filterOwner || p.owner === 'aile' || p.owner === 'ortak')
                            .map(plan => (
                            <div key={plan.id} className="vision-item-premium glass">
                                <div className="vip-content">
                                    <Zap size={14} style={{ color: '#f59e0b' }} />
                                    <span>{plan.text}</span>
                                </div>
                                <div className="vip-actions">
                                    <button onClick={() => { setSelectedPlan(plan); setShowPlanModal(true); }}><Edit3 size={14} /></button>
                                    <button onClick={() => setGoalToDelete({ ...plan, historyType: 'vision' })} className="del"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>

      <ActionSheet 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)}
        title={isEditing ? (selectedGoal ? 'Hedefi Düzenle' : 'Yeni Hedef') : 'Hedef Detayı'}
      >
         <GoalForm 
            goal={selectedGoal} 
            isEditing={isEditing} 
            activeTab={activeTab}
            currentUser={currentUser}
            handleFail={handleFail}
            handleComplete={handleComplete}
            onClose={() => setShowGoalModal(false)}
            onSave={(data) => {
                if (selectedGoal) {
                    if (selectedGoal.type === 'money') updateGoal(selectedGoal.id, data);
                    else updateVisionGoal(selectedGoal.id, data);
                    toast.success('Hedef güncellendi! ✨');
                } else {
                    addVisionGoal(data);
                    toast.success('Yeni hedef eklendi! 🎯');
                }
                setShowGoalModal(false);
            }}
         />
      </ActionSheet>

      {/* Plan Modal */}
      <ActionSheet 
        isOpen={showPlanModal} 
        onClose={() => setShowPlanModal(false)}
        title={selectedPlan ? "✏️ Planı Düzenle" : "✨ Yeni Vizyon Planı"}
      >
        <div className="modal-form" style={{ padding: '20px' }}>
          <div className="form-group">
            <label>Plan Açıklaması</label>
            <textarea 
              defaultValue={selectedPlan?.text} 
              id="planText"
              placeholder="Örn: Yazılım mimarı olarak global bir projede yer al."
              style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}
            />
          </div>
          <button className="premium-submit-btn" onClick={() => {
            const text = document.getElementById('planText').value;
            if (selectedPlan) updateVisionPlan(selectedPlan.id, { text });
            else addVisionPlan({ text });
            setShowPlanModal(false);
            toast.success(selectedPlan ? 'Plan güncellendi!' : 'Plan eklendi!');
          }}>KAYDET</button>
        </div>
      </ActionSheet>

      <ConfirmModal 
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
            if (goalToDelete.historyType === 'completed') {
                deleteCompletedGoal(goalToDelete.id);
            } else if (goalToDelete.historyType === 'failed') {
                deleteFailedGoal(goalToDelete.id);
            } else if (goalToDelete.historyType === 'vision') {
                deleteVisionPlan(goalToDelete.id);
            } else if (goalToDelete.type === 'money') {
                deleteGoal(goalToDelete.id);
            } else {
                deleteVisionGoal(goalToDelete.id);
            }
            toast.success('Kayıt silindi.');
            setGoalToDelete(null);
        }}
        message={`"${goalToDelete?.title || goalToDelete?.name}" kaydını silmek istediğinize emin misiniz?`}
      />

      <ActionSheet 
        isOpen={!!reflectionGoal} 
        onClose={() => setReflectionGoal(null)}
        title={reflectionGoal?.mode === 'success' ? "💎 BAŞARIYI ÖLÜMSÜZLEŞTİR" : "⚠️ DERS ÇIKARALIM"}
      >
         <div className="reflection-modal-premium" style={{ padding: '24px' }}>
            <div className={`reflection-hero ${reflectionGoal?.mode}`}>
                {reflectionGoal?.mode === 'success' ? '🥳 TEBRİKLER!' : '💪 PES ETMEK YOK!'}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                {reflectionGoal?.mode === 'success' 
                    ? "Bu başarı sana ne kazandırdı? Hayatında ne değişti?" 
                    : "Neden başaramadın ve bir dahaki sefere neyi farklı yapmalısın?"}
            </p>
            <textarea 
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Buraya notlarını yazabilirsin..."
                style={{ 
                    width: '100%', 
                    minHeight: '120px', 
                    padding: '16px', 
                    borderRadius: '20px', 
                    border: '2px solid #f1f5f9',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    background: '#f8fafc'
                }}
            />
            <button 
                className={`premium-submit-btn ${reflectionGoal?.mode === 'success' ? 'success' : 'danger'}`}
                onClick={submitReflection}
            >
                {reflectionGoal?.mode === 'success' ? 'KAZANIMI KAYDET ✨' : 'DERSİ KAYDET 💪'}
            </button>
         </div>
      </ActionSheet>

    </AnimatedPage>
  );
}

function GoalForm({ goal, isEditing, activeTab, currentUser, handleFail, handleComplete, onClose, onSave }) {
    const isLongTerm = activeTab === 'uzun' || (goal && new Date(goal.targetDate) > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    
    const [form, setForm] = useState({
        title: goal?.title || goal?.name || '',
        target: goal?.target || 100,
        current: goal?.current || 0,
        targetDate: goal?.targetDate || goal?.deadline || '',
        duration: goal?.duration || '',
        priority: goal?.priority || 'Orta',
        owner: goal?.owner || (currentUser?.name === 'Görkem' ? 'gorkem' : 'esra'),
        notes: goal?.notes || '',
        yearlyPlan: goal?.yearlyPlan || (isLongTerm ? { year1: '', year2: '', year3: '' } : { month1: '', month2: '', month3: '' })
    });

    if (!isEditing) {
        return (
            <div className="goal-detail-view" style={{ padding: '20px' }}>
                <div className="gd-meta" style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div className="gd-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                        <User size={14} />
                        <span>{goal?.owner || 'Bilinmiyor'}</span>
                    </div>
                    <div className="gd-meta-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                        <Clock size={14} />
                        <span>{goal?.duration ? `${goal.duration} Ay` : 'Süre Belirtilmemiş'}</span>
                    </div>
                </div>

                {goal?.yearlyPlan && (
                    <div className="gd-plan mt-16">
                        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>📅 {isLongTerm ? 'Yıllık Dağılım' : 'Aylık Plan'}</h4>
                        {Object.entries(goal.yearlyPlan).map(([k, t]) => t && (
                            <div key={k} style={{ padding: '8px', borderLeft: '3px solid #fbbf24', background: '#fffbeb', marginBottom: '4px', fontSize: '12px' }}>
                                <strong>{k.includes('year') ? k.replace('year', 'Yıl ') : k.replace('month', 'Ay ')}:</strong> {t}
                            </div>
                        ))}
                    </div>
                )}

                <div className="gd-notes mt-16">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#1e293b', fontWeight: '600' }}>
                        <Info size={16} /> <span>Hedef Notları</span>
                    </div>
                    <div className="glass" style={{ padding: '15px', borderRadius: '12px', minHeight: '100px', fontSize: '14px', lineHeight: '1.6' }}>
                        {goal?.notes || "Bu hedef için henüz bir not eklenmemiş."}
                    </div>
                </div>

                <div className="gd-actions mt-24" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    <button className="pill-btn-v2 success" onClick={() => { handleComplete(goal.id, goal.type); onClose(); }}>
                        <CheckCircle size={14} /> BAŞARDIM
                    </button>
                    <button className="pill-btn-v2 danger" onClick={() => { handleFail(goal.id, goal.type); onClose(); }}>
                        <XCircle size={14} /> BAŞARAMADIM
                    </button>
                    <button className="pill-btn-v2 neutral" onClick={onClose}>
                        KAPAT
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-form" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="form-group">
                <label>Hedef Başlığı</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Örn: Almanca B2" />
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label>Hedef Tutar/Yüzde</label>
                    <input type="number" value={form.target} onChange={e => setForm({...form, target: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                    <label>Süre (Ay)</label>
                    <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="Örn: 8" />
                </div>
            </div>
            
            <div className="form-group">
                <label>{isLongTerm ? 'Yıllık Plan / Kilometre Taşları' : 'Aylık Plan / Adımlar'}</label>
                <div className="yearly-plan-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {isLongTerm ? (
                        <>
                            <input value={form.yearlyPlan.year1} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, year1: e.target.value}})} placeholder="1. Yıl Planı" />
                            <input value={form.yearlyPlan.year2} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, year2: e.target.value}})} placeholder="2. Yıl Planı" />
                            <input value={form.yearlyPlan.year3} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, year3: e.target.value}})} placeholder="3. Yıl Planı" />
                        </>
                    ) : (
                        <>
                            <input value={form.yearlyPlan.month1} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, month1: e.target.value}})} placeholder="1. Ay Planı" />
                            <input value={form.yearlyPlan.month2} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, month2: e.target.value}})} placeholder="2. Ay Planı" />
                            <input value={form.yearlyPlan.month3} onChange={e => setForm({...form, yearlyPlan: {...form.yearlyPlan, month3: e.target.value}})} placeholder="3. Ay Planı" />
                        </>
                    )}
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Bitiş Tarihi</label>
                    <input type="date" value={form.targetDate} onChange={e => setForm({...form, targetDate: e.target.value})} />
                </div>
            </div>
            
            <div className="form-group">
                <label>Açıklama & Detaylar</label>
                <textarea 
                    value={form.notes} 
                    onChange={e => setForm({...form, notes: e.target.value})} 
                    placeholder="Hedefe nasıl ulaşacaksın?"
                    style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
            </div>
            <button className="premium-submit-btn" onClick={() => onSave(form)}>KAYDET</button>
        </div>
    );
}
