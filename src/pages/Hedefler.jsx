import React, { useState, useMemo } from 'react';
import { 
  Target, Plus, CheckCircle, XCircle, Circle, Trash2, Trophy, 
  Sparkles, Heart, Star, ChevronRight, ArrowLeft,
  Calendar, Camera, User, Users, Award,
  TrendingUp, Compass, Flag, Shield, Briefcase, Zap,
  Edit3, MoreVertical, Clock, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import InputModal from '../components/InputModal';
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

const calculateRanges = (durationVal, isLongTerm) => {
  const duration = parseInt(durationVal, 10);
  if (isNaN(duration) || duration <= 0) {
    return isLongTerm ? ['1. Yıl', '2. Yıl', '3. Yıl'] : ['1. Aşama', '2. Aşama', '3. Aşama'];
  }

  const d = duration;
  const s1 = Math.ceil(d / 3);
  const s2 = Math.ceil((d - s1) / 2);
  const s3 = d - s1 - s2;

  const ranges = [];
  
  if (s1 === 1) ranges.push('1. Ay');
  else if (s1 > 1) ranges.push(`1 - ${s1}. Ay`);

  const start2 = s1 + 1;
  const end2 = s1 + s2;
  if (start2 === end2) ranges.push(`${start2}. Ay`);
  else ranges.push(`${start2} - ${end2}. Ay`);

  const start3 = s1 + s2 + 1;
  const end3 = d;
  if (start3 === end3) ranges.push(`${start3}. Ay`);
  else if (start3 < end3) ranges.push(`${start3} - ${end3}. Ay`);

  if (d === 2) {
    return ['1. Ay', '2. Ay', '3. Ay (Plan Dışı)'];
  }
  if (d === 1) {
    return ['1. - 10. Gün', '11. - 20. Gün', '21. - 30. Gün'];
  }

  return ranges;
};

const normalizeYearlyPlan = (yearlyPlan, duration, isLongTerm) => {
  const defaultRanges = calculateRanges(duration, isLongTerm);
  const steps = [
    { id: 1, range: defaultRanges[0], title: '', note: '' },
    { id: 2, range: defaultRanges[1], title: '', note: '' },
    { id: 3, range: defaultRanges[2], title: '', note: '' },
  ];

  if (!yearlyPlan) {
    return steps;
  }

  if (yearlyPlan.step1_title !== undefined || yearlyPlan.step1_note !== undefined) {
    steps[0].title = yearlyPlan.step1_title || '';
    steps[0].note = yearlyPlan.step1_note || '';
    steps[1].title = yearlyPlan.step2_title || '';
    steps[1].note = yearlyPlan.step2_note || '';
    steps[2].title = yearlyPlan.step3_title || '';
    steps[2].note = yearlyPlan.step3_note || '';
    return steps;
  }

  const getLegacyTitle = (text, defaultVal) => {
    if (!text) return defaultVal;
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  };

  if (yearlyPlan.month1 !== undefined || yearlyPlan.month2 !== undefined || yearlyPlan.month3 !== undefined) {
    steps[0].title = getLegacyTitle(yearlyPlan.month1, isLongTerm ? '1. Yıl' : '1. Ay');
    steps[0].note = yearlyPlan.month1 || '';
    steps[1].title = getLegacyTitle(yearlyPlan.month2, isLongTerm ? '2. Yıl' : '2. Ay');
    steps[1].note = yearlyPlan.month2 || '';
    steps[2].title = getLegacyTitle(yearlyPlan.month3, isLongTerm ? '3. Yıl' : '3. Ay');
    steps[2].note = yearlyPlan.month3 || '';
    return steps;
  }

  if (yearlyPlan.year1 !== undefined || yearlyPlan.year2 !== undefined || yearlyPlan.year3 !== undefined) {
    steps[0].title = getLegacyTitle(yearlyPlan.year1, '1. Yıl');
    steps[0].note = yearlyPlan.year1 || '';
    steps[1].title = getLegacyTitle(yearlyPlan.year2, '2. Yıl');
    steps[1].note = yearlyPlan.year2 || '';
    steps[2].title = getLegacyTitle(yearlyPlan.year3, '3. Yıl');
    steps[2].note = yearlyPlan.year3 || '';
    return steps;
  }

  return steps;
};

const serializeYearlyPlan = (steps, isLongTerm) => {
  return {
    step1_title: steps[0]?.title || '',
    step1_note: steps[0]?.note || '',
    step1_range: steps[0]?.range || '',
    step2_title: steps[1]?.title || '',
    step2_note: steps[1]?.note || '',
    step2_range: steps[1]?.range || '',
    step3_title: steps[2]?.title || '',
    step3_note: steps[2]?.note || '',
    step3_range: steps[2]?.range || '',
    
    // Legacy support
    ...(isLongTerm ? {
      year1: steps[0]?.note || steps[0]?.title || '',
      year2: steps[1]?.note || steps[1]?.title || '',
      year3: steps[2]?.note || steps[2]?.title || '',
    } : {
      month1: steps[0]?.note || steps[0]?.title || '',
      month2: steps[1]?.note || steps[1]?.title || '',
      month3: steps[2]?.note || steps[2]?.title || '',
    })
  };
};

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const addMonthsToDate = (dateStr, monthsVal) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const months = parseInt(monthsVal, 10);
  if (isNaN(months) || months <= 0) return dateStr;

  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + months);
  
  // Format as YYYY-MM-DD
  const yyyy = result.getFullYear();
  const mm = String(result.getMonth() + 1).padStart(2, '0');
  const dd = String(result.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getStartMonth = (g) => {
  if (g.yearlyPlan?.startDate) {
    const start = new Date(g.yearlyPlan.startDate);
    if (!isNaN(start.getTime())) {
      const monthName = TURKISH_MONTHS[start.getMonth()];
      const year = start.getFullYear();
      return `${monthName} ${year}`;
    }
  }

  if (!g.targetDate) return null;
  const target = new Date(g.targetDate);
  if (isNaN(target.getTime())) return null;

  const dur = parseInt(g.duration, 10);
  if (isNaN(dur) || dur <= 0) return null;

  const start = new Date(target.getTime());
  start.setMonth(start.getMonth() - dur);

  const monthName = TURKISH_MONTHS[start.getMonth()];
  const year = start.getFullYear();
  return `${monthName} ${year}`;
};

const getRemainingMonths = (g) => {
  if (!g.targetDate) return null;
  const target = new Date(g.targetDate);
  if (isNaN(target.getTime())) return null;

  const now = new Date();
  
  // Determine start date
  let start = null;
  if (g.yearlyPlan?.startDate) {
    start = new Date(g.yearlyPlan.startDate);
  } else if (g.duration) {
    const dur = parseInt(g.duration, 10);
    if (!isNaN(dur) && dur > 0) {
      start = new Date(target.getTime());
      start.setMonth(start.getMonth() - dur);
    }
  }

  const diffTime = target.getTime() - now.getTime();
  if (diffTime <= 0) {
    return {
      text: 'Süresi Doldu! 🚨',
      class: 'urgent'
    };
  }

  // Cap countdown if today is before the start date
  let calculationDate = now;
  if (start && now < start) {
    calculationDate = start;
  }

  const diffYears = target.getFullYear() - calculationDate.getFullYear();
  const diffMonths = target.getMonth() - calculationDate.getMonth();
  const totalMonths = diffYears * 12 + diffMonths;

  if (totalMonths <= 0) {
    const activeDiffTime = target.getTime() - calculationDate.getTime();
    const diffDays = Math.ceil(activeDiffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return { text: 'Süresi Doldu! 🚨', class: 'urgent' };
    }
    return {
      text: `${diffDays} Gün Kaldı ⏳`,
      class: 'urgent'
    };
  }

  if (totalMonths === 1) {
    const activeDiffTime = target.getTime() - calculationDate.getTime();
    const diffDays = Math.ceil(activeDiffTime / (1000 * 60 * 60 * 24));
    return {
      text: `${diffDays} Gün Kaldı ⏳`,
      class: 'urgent'
    };
  }

  let colorClass = 'safe';
  if (totalMonths <= 2) {
    colorClass = 'urgent';
  } else if (totalMonths <= 5) {
    colorClass = 'warning';
  }

  return {
    text: `${totalMonths} Ay Kaldı ⏳`,
    class: colorClass
  };
};

const getTimeProgressInfo = (g) => {
  if (!g.targetDate) return null;
  const target = new Date(g.targetDate);
  if (isNaN(target.getTime())) return null;

  let start = null;
  if (g.yearlyPlan?.startDate) {
    start = new Date(g.yearlyPlan.startDate);
  } else {
    const dur = parseInt(g.duration, 10);
    if (isNaN(dur) || dur <= 0) return null;
    start = new Date(target.getTime());
    start.setMonth(start.getMonth() - dur);
  }

  if (isNaN(start.getTime())) return null;

  const now = new Date();
  const totalMs = target.getTime() - start.getTime();
  const elapsedMs = now.getTime() - start.getTime();

  if (elapsedMs <= 0) {
    return { percent: 0, elapsedText: 'Yeni Başladı 🌱' };
  }
  if (elapsedMs >= totalMs) {
    return { percent: 100, elapsedText: 'Süre Doldu 🚨' };
  }

  const percent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
  return {
    percent,
    elapsedText: `%${percent} Geçti ⏳`
  };
};

const isGoalVisible = (g, currentUser) => {
  const owner = (g.owner || 'ortak').toLowerCase().trim();
  if (owner === 'ortak' || owner === 'aile' || owner === 'hepsi') {
    return true;
  }
  const currentUserName = (currentUser?.name || '').toLowerCase().trim();
  const creator = (g.createdBy || '').toLowerCase().trim();
  
  const matchUser = (nameStr, userStr) => {
    const normalize = (s) => s.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
    return normalize(nameStr) === normalize(userStr);
  };
  
  if (matchUser(owner, currentUserName)) {
    return true;
  }
  if (matchUser(creator, currentUserName)) {
    return true;
  }
  return false;
};



export default function Hedefler() {
  const [activeTab, setActiveTab] = useState('kisa');
  const [selectedGoal, setSelectedGoal] = useState(null); // For details/edit
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialEditStep, setInitialEditStep] = useState(null);
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
        if (!isGoalVisible(g, currentUser)) return false;
        if (!g.targetDate) return true;
        return new Date(g.targetDate) <= oneYearFromNow;
    });

    const lt = unifiedGoals.filter(g => {
        if (!isGoalVisible(g, currentUser)) return false;
        if (!g.targetDate) return false;
        return new Date(g.targetDate) > oneYearFromNow;
    });

    return { shortTermGoals: st, longTermGoals: lt };
  }, [unifiedGoals, currentUser]);

  const filteredCompletedHistory = useMemo(() => {
    return completedHistory.filter(h => isGoalVisible(h, currentUser));
  }, [completedHistory, currentUser]);

  const filteredFailedHistory = useMemo(() => {
    return failedHistory.filter(h => isGoalVisible(h, currentUser));
  }, [failedHistory, currentUser]);

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
    { id: 'kazanimlar', label: 'Kazanç', emoji: '✅' },
    { id: 'kayiplar', label: 'Kayıp', emoji: '❌' },
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
      setInitialEditStep(null);
      setShowGoalModal(true);
    } else {
      setSelectedGoal(g);
      setIsEditing(false);
      setInitialEditStep(null);
      setShowGoalModal(true);
    }
  };

  const renderGoalCard = (g) => {
    const isMoney = g.type === 'money';
    const perc = (g.current / g.target) * 100;
    const owner = (g.owner || 'ortak').toLowerCase();

    // Date calculations
    const startMonth = getStartMonth(g);
    const countdown = getRemainingMonths(g);

    // Roadmap normalization
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    const isLongTerm = g.targetDate ? new Date(g.targetDate) > oneYearFromNow : false;
    const steps = normalizeYearlyPlan(g.yearlyPlan, g.duration || '', isLongTerm);

    return (
      <div key={g.id} className={`goal-card-premium glass ${perc > 80 ? 'focus-glow' : ''} owner-${owner}`} onClick={() => handleGoalAction(g, 'view')}>
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

            {/* Dynamic Dates & Countdown */}
            <div className="gcp-date-meta">
              {startMonth ? (
                <div className="gcp-date-item">
                  <span className="gcp-date-label">Başlangıç:</span>
                  <span className="gcp-date-val">{startMonth}</span>
                </div>
              ) : (
                <div className="gcp-date-item">
                  <span className="gcp-date-label">Başlangıç:</span>
                  <span className="gcp-date-val">Belirtilmedi</span>
                </div>
              )}
              {countdown && (
                <span className={`gcp-countdown-badge ${countdown.class}`}>
                  {countdown.text}
                </span>
              )}
            </div>

            {/* Visual Time Progress Bar */}
            {(() => {
              const timeInfo = getTimeProgressInfo(g);
              if (!timeInfo) return null;
              return (
                <div className="gcp-time-visual-progress">
                  <div className="gcp-tvp-header">
                    <span className="gcp-tvp-label">Zaman Akışı</span>
                    <span className="gcp-tvp-val">{timeInfo.elapsedText}</span>
                  </div>
                  <div className="gcp-tvp-track">
                    <div 
                      className={`gcp-tvp-bar ${countdown?.class || 'safe'}`} 
                      style={{ width: `${timeInfo.percent}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Premium 3-Step Horizontal Timeline */}
            <div className="gcp-steps-timeline">
              {steps.map((step, index) => {
                let status = 'pending';
                if (perc >= 100) {
                  status = 'completed';
                } else if (perc > 0) {
                  if (index === 0) status = perc > 33.3 ? 'completed' : 'active';
                  else if (index === 1) status = perc > 66.6 ? 'completed' : (perc > 33.3 ? 'active' : 'pending');
                  else if (index === 2) status = perc > 66.6 ? 'active' : 'pending';
                }
                const colors = ['coral', 'teal', 'pink'];
                return (
                  <div key={step.id} className={`gcp-timeline-step ${status} ${colors[index]}`}>
                    <div className="gcp-step-dot" title={`${step.range}: ${step.title || 'Planlanıyor'}`}>
                      {status === 'completed' ? '✓' : step.id}
                    </div>
                    <div className="gcp-step-info">
                      <span className="gcp-step-range">{step.range}</span>
                      <span className="gcp-step-text" title={step.title || 'Planlanıyor'}>{step.title || 'Planlanıyor'}</span>
                    </div>
                  </div>
                );
              })}
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
              <p>{moodboard?.quote || "Büyük işler, küçük başlangıçlarla olur."}</p>
            </div>
          </div>
          <div className="header-actions">
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

      <div className="hedefler-scroll-content">
         <div className="filter-actions-row">
            <div className="owner-filter-chips-v3">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'gorkem', label: 'Görkem' },
                { id: 'esra', label: 'Esra' },
                { id: 'ortak', label: 'Aile' }
              ].map(o => (
                <button 
                  key={o.id} 
                  className={`chip-v3 ${filterOwner === o.id ? 'active' : ''}`}
                  onClick={() => setFilterOwner(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            
            <button className="add-goal-btn-v3" onClick={() => { setSelectedGoal(null); setIsEditing(true); setInitialEditStep(null); setShowGoalModal(true); }}>
               <Plus size={14} /> HEDEF EKLE
            </button>
         </div>

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
                <h3>⏱️ Yakın Dönem Odakları</h3>
                <span className="count-badge">{shortTermGoals.length}</span>
              </div>
              <div className="goals-grid-v2">
                {shortTermGoals
                  .filter(g => {
                    const owner = (g.owner || 'ortak').toLowerCase();
                    return filterOwner === 'all' || owner.includes(filterOwner) || owner === 'aile' || owner === 'ortak';
                  })
                  .map(renderGoalCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uzun' && (
          <div className="aktif-view animate-fadeIn">
            <div className="goals-section">
              <div className="section-header-v2">
                <h3>🔭 Gelecek Ufukları</h3>
                <span className="count-badge">{longTermGoals.length}</span>
              </div>
              <div className="goals-grid-v2">
                {longTermGoals
                  .filter(g => {
                    const owner = (g.owner || 'ortak').toLowerCase();
                    return filterOwner === 'all' || owner.includes(filterOwner) || owner === 'aile' || owner === 'ortak';
                  })
                  .map(renderGoalCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kazanimlar' && (
            <div className="kazanimlar-tab-content animate-fadeIn">
                <div className="section-header-v2">
                    <h3>✅ Kazanımlar Geçmişi</h3>
                    <span className="count-badge">{filteredCompletedHistory.length}</span>
                </div>
                
                <div className="kazanimlar-list">
                    {filteredCompletedHistory
                        .filter(h => {
                            const owner = (h.owner || 'ortak').toLowerCase();
                            return filterOwner === 'all' || owner.includes(filterOwner) || owner === 'aile' || owner === 'ortak';
                        })
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
                    <span className="count-badge">{filteredFailedHistory.length}</span>
                </div>
                
                <div className="kazanimlar-list">
                    {filteredFailedHistory
                        .filter(h => {
                            const owner = (h.owner || 'ortak').toLowerCase();
                            return filterOwner === 'all' || owner.includes(filterOwner) || owner === 'aile' || owner === 'ortak';
                        })
                        .map(h => (
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
                            .filter(p => {
                                const owner = (p.owner || 'ortak').toLowerCase();
                                return filterOwner === 'all' || owner.includes(filterOwner) || owner === 'aile' || owner === 'ortak';
                            })
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
            initialEditStep={initialEditStep}
            onEdit={(stepId) => {
                setIsEditing(true);
                if (stepId !== undefined) {
                    setInitialEditStep(stepId);
                }
            }}
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
                    addVisionGoal({
                        ...data,
                        createdBy: currentUser?.name || 'Görkem'
                    });
                    toast.success('Yeni hedef eklendi! 🎯');
                }
                setShowGoalModal(false);
            }}
            onQuickUpdate={(updatedFields) => {
                if (selectedGoal) {
                    let newData = { ...selectedGoal, ...updatedFields };
                    if (updatedFields.duration !== undefined) {
                        const now = new Date();
                        const oneYearFromNow = new Date();
                        oneYearFromNow.setFullYear(now.getFullYear() + 1);
                        const isLongTerm = selectedGoal.targetDate ? new Date(selectedGoal.targetDate) > oneYearFromNow : false;
                        
                        const newSteps = normalizeYearlyPlan(selectedGoal.yearlyPlan, updatedFields.duration, isLongTerm);
                        const serializedPlan = serializeYearlyPlan(newSteps, isLongTerm);
                        newData.yearlyPlan = {
                            ...serializedPlan,
                            startDate: selectedGoal.yearlyPlan?.startDate || ''
                        };
                    }
                    if (selectedGoal.type === 'money') {
                        updateGoal(selectedGoal.id, newData);
                    } else {
                        updateVisionGoal(selectedGoal.id, newData);
                    }
                    setSelectedGoal(newData);
                    toast.success('Hedef başarıyla güncellendi! ✨');
                }
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

const getOwnerBadge = (owner) => {
    const o = (owner || '').toLowerCase().trim();
    if (o === 'gorkem' || o === 'görkem') {
        return {
            emoji: '👑',
            text: 'Görkem',
            className: 'owner-badge-gorkem'
        };
    }
    if (o === 'esra') {
        return {
            emoji: '🌸',
            text: 'Esra',
            className: 'owner-badge-esra'
        };
    }
    return {
        emoji: '🏡',
        text: 'Aile',
        className: 'owner-badge-ortak'
    };
};

const getRegistrantBadge = (createdBy, owner) => {
    let creator = createdBy || '';
    if (!creator) {
        const o = (owner || '').toLowerCase().trim();
        if (o === 'gorkem' || o === 'görkem') creator = 'Görkem';
        else if (o === 'esra') creator = 'Esra';
        else creator = 'Görkem';
    }
    
    const c = creator.toLowerCase().trim();
    if (c === 'gorkem' || c === 'görkem') {
        return {
            emoji: '✍️',
            text: 'Kayıt: Görkem',
            className: 'creator-badge-gorkem'
        };
    }
    if (c === 'esra') {
        return {
            emoji: '✍️',
            text: 'Kayıt: Esra',
            className: 'creator-badge-esra'
        };
    }
    return {
        emoji: '✍️',
        text: `Kayıt: ${creator}`,
        className: 'creator-badge-other'
    };
};

function GoalForm({ goal, isEditing, initialEditStep, onEdit, activeTab, currentUser, handleFail, handleComplete, onClose, onSave, onQuickUpdate }) {
    const isLongTerm = activeTab === 'uzun' || (goal && new Date(goal.targetDate) > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
    
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    
    const [form, setForm] = useState({
        title: goal?.title || goal?.name || '',
        target: goal?.target || 100,
        current: goal?.current || 0,
        targetDate: goal?.targetDate || goal?.deadline || '',
        startDate: goal?.yearlyPlan?.startDate || '',
        duration: goal?.duration || '',
        priority: goal?.priority || 'Orta',
        owner: goal?.owner?.toLowerCase() || (currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem'),
        notes: goal?.notes || '',
        createdBy: goal?.createdBy || '',
        yearlyPlan: goal?.yearlyPlan || (isLongTerm ? { year1: '', year2: '', year3: '' } : { month1: '', month2: '', month3: '' })
    });

    const initialSteps = useMemo(() => {
        return normalizeYearlyPlan(goal?.yearlyPlan, goal?.duration || '', isLongTerm);
    }, [goal, isLongTerm]);

    const [steps, setSteps] = useState(initialSteps);
    const [expandedStep, setExpandedStep] = useState(initialEditStep);
    const notesRef = React.useRef(null);

    const handleOwnerCycle = () => {
        if (!goal || !onQuickUpdate) return;
        const currentOwner = (goal.owner || 'gorkem').toLowerCase().trim();
        let nextOwner = 'gorkem';
        if (currentOwner === 'gorkem') nextOwner = 'esra';
        else if (currentOwner === 'esra') nextOwner = 'ortak';
        
        setForm(prev => ({
            ...prev,
            owner: nextOwner
        }));
        
        onQuickUpdate({
            owner: nextOwner
        });
    };

    const handleDurationClick = () => {
        setIsDurationModalOpen(true);
    };

    const handleDurationConfirm = (newDuration) => {
        if (!goal || !onQuickUpdate) return;
        const parsed = parseInt(newDuration, 10);
        if (isNaN(parsed) || parsed <= 0) {
            toast.error('Lütfen geçerli bir ay süresi girin!');
            return;
        }
        
        const calculatedTargetDate = addMonthsToDate(form.startDate, parsed);
        
        setForm(prev => ({
            ...prev,
            duration: parsed,
            targetDate: calculatedTargetDate
        }));
        
        onQuickUpdate({
            duration: parsed,
            targetDate: calculatedTargetDate
        });
        setIsDurationModalOpen(false);
    };

    // Keep steps state synced when goal.yearlyPlan or goal.duration changes externally
    React.useEffect(() => {
        setSteps(normalizeYearlyPlan(goal?.yearlyPlan, goal?.duration || '', isLongTerm));
    }, [goal?.yearlyPlan, goal?.duration, isLongTerm]);

    // Keep form state synced when goal changes externally
    React.useEffect(() => {
        if (goal) {
            setForm(prev => ({
                ...prev,
                title: goal.title || goal.name || '',
                target: goal.target || 100,
                current: goal.current || 0,
                targetDate: goal.targetDate || goal.deadline || '',
                startDate: goal.yearlyPlan?.startDate || '',
                duration: goal.duration || '',
                priority: goal.priority || 'Orta',
                owner: goal.owner?.toLowerCase() || 'gorkem',
                notes: goal.notes || '',
                createdBy: goal.createdBy || '',
                yearlyPlan: goal.yearlyPlan || prev.yearlyPlan
            }));
        }
    }, [goal]);

    // Dynamically update ranges when duration changes
    React.useEffect(() => {
        const newRanges = calculateRanges(form.duration, isLongTerm);
        setSteps(prev => prev.map((step, idx) => ({
            ...step,
            range: newRanges[idx] || step.range
        })));
    }, [form.duration, isLongTerm]);

    React.useEffect(() => {
        if (initialEditStep !== undefined) {
            setExpandedStep(initialEditStep);
        }
    }, [initialEditStep]);

    React.useEffect(() => {
        if (isEditing && initialEditStep === 'notes' && notesRef.current) {
            setTimeout(() => {
                notesRef.current?.focus();
                notesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isEditing, initialEditStep]);

    const handleStartDateChange = (val) => {
        const calculatedTargetDate = addMonthsToDate(val, form.duration);
        setForm(prev => ({
            ...prev,
            startDate: val,
            targetDate: calculatedTargetDate
        }));
    };

    const handleDurationChange = (val) => {
        const calculatedTargetDate = addMonthsToDate(form.startDate, val);
        setForm(prev => ({
            ...prev,
            duration: val,
            targetDate: calculatedTargetDate
        }));
    };

    if (!isEditing) {
        const ownerObj = getOwnerBadge(goal?.owner);
        const creatorObj = getRegistrantBadge(goal?.createdBy, goal?.owner);
        return (
            <div className="goal-detail-view" style={{ padding: '20px' }}>
                <div className="gd-meta-chips-container">
                    <div className={`gd-meta-chip ${creatorObj.className}`} title="Bu hedefi kayıt eden kişi">
                        <span className="gd-meta-emoji">{creatorObj.emoji}</span>
                        <span className="gd-meta-text">{creatorObj.text}</span>
                    </div>
                    <div 
                        className={`gd-meta-chip clickable ${ownerObj.className}`}
                        onClick={handleOwnerCycle}
                        title="Hedef sahibini değiştirmek için tıklayın"
                    >
                        <span className="gd-meta-emoji">{ownerObj.emoji}</span>
                        <span className="gd-meta-text">{ownerObj.text}</span>
                        <span className="gd-meta-cycle-indicator">🔄</span>
                    </div>
                    <div 
                        className="gd-meta-chip clickable gd-meta-duration"
                        onClick={handleDurationClick}
                        title="Hedef süresini değiştirmek için tıklayın"
                    >
                        <span className="gd-meta-emoji">⏳</span>
                        <span className="gd-meta-text">
                            {goal?.duration ? `${goal.duration} Ay` : 'Süresiz'}
                        </span>
                        <span className="gd-meta-cycle-indicator">🔄</span>
                    </div>
                </div>

                <div className="premium-accordion-section mt-20">
                    <h4 className="pas-title">
                        <Compass size={16} className="pas-icon" />
                        <span>Adım Adım Yol Haritası</span>
                    </h4>
                    <div className="premium-accordion">
                        {steps.map(step => {
                            const isExpanded = expandedStep === step.id;
                            return (
                                <div key={step.id} className={`accordion-item glass ${isExpanded ? 'active' : ''} step-${step.id}`}>
                                    <div className="accordion-header" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                                        <div className="header-left">
                                            <span className="step-badge">{step.range}</span>
                                            <strong className="step-title">{step.title || `${step.id}. Aşama`}</strong>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button 
                                                type="button"
                                                className="step-edit-inline-btn" 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    onEdit(step.id); 
                                                }}
                                                title="Aşamayı Düzenle"
                                            >
                                                <Edit3 size={13} />
                                            </button>
                                            <ChevronRight size={18} className={`chevron-icon ${isExpanded ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>
                                    <div className={`accordion-content ${isExpanded ? 'expanded' : ''}`}>
                                        <div className="content-inner">
                                            {step.note ? (
                                                <ul className="step-details-list">
                                                    {step.note.split('\n').map((line, lIdx) => {
                                                        const trimmed = line.trim();
                                                        if (!trimmed) return null;
                                                        const isHeader = trimmed.endsWith(':') || trimmed.startsWith('★') || trimmed.startsWith('●') || trimmed.startsWith('■');
                                                        return (
                                                            <li key={lIdx} className={`step-detail-line ${isHeader ? 'line-header' : 'line-item'}`}>
                                                                {!isHeader && <span className="line-bullet">✦</span>}
                                                                <span>{trimmed.replace(/^[-*•✦]\s*/, '')}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p className="no-details">Bu aşama için detaylı açıklama girilmemiş.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="gd-notes mt-20">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: '600' }}>
                            <Info size={16} /> <span>Hedef Notları</span>
                        </div>
                        <button 
                            type="button"
                            className="notes-edit-inline-btn" 
                            onClick={() => onEdit('notes')}
                            title="Notları Düzenle"
                        >
                            <Edit3 size={13} /> Notu Düzenle
                        </button>
                    </div>
                    <div className="glass" style={{ padding: '15px', borderRadius: '12px', minHeight: '100px', fontSize: '14px', lineHeight: '1.6', color: '#475569', fontWeight: '600' }}>
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

                <InputModal
                    isOpen={isDurationModalOpen}
                    title="Hedef Süresi Güncelle"
                    message={`"${goal?.title || goal?.name}" hedefinin yeni süresini ay olarak girin:`}
                    defaultValue={goal?.duration || "8"}
                    placeholder="Örn: 12"
                    type="number"
                    confirmText="SÜREYİ GÜNCELLE ✨"
                    cancelText="İPTAL"
                    icon="⏳"
                    onConfirm={handleDurationConfirm}
                    onCancel={() => setIsDurationModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="modal-form" style={{ padding: '20px' }}>
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
                    <input 
                        type="number" 
                        value={form.duration} 
                        onChange={e => handleDurationChange(e.target.value)} 
                        placeholder="Örn: 8" 
                    />
                </div>
            </div>
            
            <div className="form-group">
                <label className="form-label-premium">
                    <Compass size={14} style={{ color: '#7c3aed' }} />
                    <span>Aşama ve Yol Haritası Detayları</span>
                </label>
                <div className="edit-accordion-container">
                    {steps.map((step, idx) => {
                        const isExpanded = expandedStep === step.id;
                        return (
                            <div key={step.id} className={`edit-accordion-item ${isExpanded ? 'active' : ''} step-${step.id}`}>
                                <div className="edit-accordion-header" onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                                    <div className="header-left">
                                        <span className="step-badge">{step.range}</span>
                                        <span className="step-title-preview">
                                            {step.title || `${step.id}. Aşama`}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className={`chevron-icon ${isExpanded ? 'rotate-90' : ''}`} />
                                </div>
                                <div className={`edit-accordion-content ${isExpanded ? 'expanded' : ''}`}>
                                    <div className="edit-content-inner">
                                        <div className="sub-form-group">
                                            <label>Aşama Başlığı</label>
                                            <input 
                                                type="text" 
                                                value={step.title} 
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, title: val } : s));
                                                }}
                                                placeholder={`Örn: ${step.range} - Başlangıç Aşaması`} 
                                            />
                                        </div>
                                        <div className="sub-form-group">
                                            <label>Detaylar & Yapılacaklar</label>
                                            <textarea 
                                                value={step.note} 
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, note: val } : s));
                                                }}
                                                placeholder="Bu aşamada neler hedefleniyor, hangi adımlar atılacak?" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Hedef Sahibi</label>
                    <div className="premium-select-buttons">
                        {[
                            { id: 'gorkem', label: 'Görkem', emoji: '👑' },
                            { id: 'esra', label: 'Esra', emoji: '🌸' },
                            { id: 'ortak', label: 'Aile/Ortak', emoji: '🏡' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                type="button"
                                className={`select-btn ${form.owner === opt.id ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, owner: opt.id })}
                            >
                                <span className="emoji">{opt.emoji}</span> {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label>Kayıt Eden</label>
                    <div className="premium-select-buttons">
                        {[
                            { id: 'Görkem', label: 'Görkem', emoji: '✍️' },
                            { id: 'Esra', label: 'Esra', emoji: '✍️' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                type="button"
                                className={`select-btn ${form.createdBy === opt.id ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, createdBy: opt.id })}
                            >
                                <span className="emoji">{opt.emoji}</span> {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="form-grid" style={{ marginTop: '16px' }}>
                <div className="form-group">
                    <label>Başlangıç Tarihi</label>
                    <input 
                        type="date" 
                        value={form.startDate} 
                        onChange={e => handleStartDateChange(e.target.value)} 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                </div>
                <div className="form-group">
                    <label>Hesaplanan Bitiş Tarihi</label>
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        background: '#f8fafc', 
                        border: '1px dashed #cbd5e1',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#475569',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {form.targetDate ? new Date(form.targetDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Başlangıç tarihi ve süre girin'}
                    </div>
                </div>
            </div>
            
            <div className="form-group">
                <label>Açıklama & Detaylar</label>
                <textarea 
                    ref={notesRef}
                    value={form.notes} 
                    onChange={e => setForm({...form, notes: e.target.value})} 
                    placeholder="Hedefe nasıl ulaşacaksın?"
                    style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
            </div>
            <button className="premium-submit-btn" onClick={() => {
                const serializedPlan = serializeYearlyPlan(steps, isLongTerm);
                onSave({
                    ...form,
                    yearlyPlan: {
                        ...serializedPlan,
                        startDate: form.startDate
                    }
                });
            }}>KAYDET</button>
        </div>
    );
}
