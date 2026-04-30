import React, { useState } from 'react';
import { Moon, Sun, Star, Plus, Trash2, Clock, Zap } from 'lucide-react';
import useStore from '../../store/useStore';
import ActionSheet from '../../components/ActionSheet';
import toast from 'react-hot-toast';
import './SleepTab.css';

const SleepTab = () => {
  const { saglik, setModuleData } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [form, setForm] = useState({ 
    kisi: 'Görkem', 
    tarih: new Date().toISOString().split('T')[0], 
    yatis: '23:00',
    kalkis: '07:00',
    sure: 8, 
    kalite: 4, 
    not: '' 
  });

  const sleepData = saglik.sleep || [];
  const sleepGoals = saglik.sleepGoals || { gorkem: 6, esra: 9 };

  const calculateStats = (user) => {
    const userLogs = sleepData.filter(s => s.kisi === user).slice(0, 7);
    const goal = sleepGoals[user.toLowerCase()] || 8;

    if (userLogs.length === 0) {
       return { totalDebt: 0, consistency: 0, avgQuality: 0, isEmpty: true };
    }
    
    // 1. Sleep Debt (Last 7 entries)
    const totalDebt = userLogs.reduce((acc, log) => acc + (goal - log.sure), 0);
    
    // 2. Consistency (Simplified: variance of bedtime)
    // For now we use a placeholder logic until we have enough data points
    const consistency = Math.max(0, 100 - (Math.abs(totalDebt) * 5)); 

    return { totalDebt: totalDebt.toFixed(1), consistency: Math.round(consistency), avgQuality: (userLogs.reduce((a,b) => a+b.kalite, 0) / userLogs.length).toFixed(1) };
  };

  const getInsights = (stats) => {
    if (!stats || stats.isEmpty) return [{ type: 'info', text: 'Henüz uyku verisi girilmemiş. İlk verini eklediğinde akıllı analizler burada görünecek! ✨' }];
    const insightsList = [];
    
    if (stats.totalDebt > 0) {
      insightsList.push({ type: 'warn', text: `Haftalık uyku borcun ${stats.totalDebt} saat. Bu gece biraz erken yatmak seni dinlendirir. 🛌` });
    } else {
      insightsList.push({ type: 'success', text: `Harika! Uyku hedefine tam uyuyorsun. Enerjin yerinde olmalı! ⚡` });
    }
    
    if (stats.consistency < 85) {
      insightsList.push({ type: 'info', text: `Uyku düzenin biraz düzensiz (%${stats.consistency}). Her gün aynı saatte yatıp kalkmaya çalışmalısın. ⏰` });
    }
    
    if (parseFloat(stats.avgQuality) < 3.8) {
      insightsList.push({ type: 'tip', text: `Son uykularının kalitesi düşük görünüyor. Yatmadan önce ekran süresini azaltmayı deneyebilirsin. 📱` });
    }
    
    return insightsList;
  };

  const currentStats = calculateStats(form.kisi);
  const insights = getInsights(currentStats);

  const handleSave = () => {
    // Auto-calculate duration if times are provided
    let duration = form.sure;
    if (form.yatis && form.kalkis) {
      const [h1, m1] = form.yatis.split(':').map(Number);
      const [h2, m2] = form.kalkis.split(':').map(Number);
      let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
      if (diff < 0) diff += 24 * 60; // Crosses midnight
      duration = diff / 60;
    }

    const newEntry = { id: Date.now(), ...form, sure: duration };
    setModuleData('saglik', { ...saglik, sleep: [newEntry, ...sleepData] });
    setModalOpen(false);
    toast.success('Uyku verisi kaydedildi! 😴');
  };

  const handleUpdateGoal = (newGoal) => {
    setModuleData('saglik', { 
      ...saglik, 
      sleepGoals: { ...sleepGoals, [form.kisi.toLowerCase()]: parseFloat(newGoal) } 
    });
    setGoalModalOpen(false);
    toast.success(`${form.kisi} için hedef güncellendi: ${newGoal}s ✨`);
  };

  const handleDelete = (id) => {
    const updated = sleepData.filter(s => s.id !== id);
    setModuleData('saglik', { ...saglik, sleep: updated });
    toast.success('Kayıt silindi.');
  };

  const getQualityEmoji = (q) => {
    if (q >= 5) return '✨';
    if (q >= 4) return '😊';
    if (q >= 3) return '😐';
    if (q >= 2) return '😩';
    return '😫';
  };

  return (
    <div className="tab-view sleep-tab animate-fadeIn">
      <button className="btn-action sleep" onClick={() => setModalOpen(true)} style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white' }}>
        <Plus size={18} /> Uyku Verisi Ekle
      </button>

      {/* Smart Dashboard */}
      {currentStats && (
        <div className="sleep-dashboard mt-20 animate-fadeIn">
          <div className="sd-grid">
            <div className="sd-card glass">
              <span className="sd-label">Uyku Borcu</span>
              <strong className={currentStats.totalDebt > 0 ? 'text-red' : 'text-green'}>
                {currentStats.totalDebt > 0 ? `+${currentStats.totalDebt}` : currentStats.totalDebt}s
              </strong>
              <div className="sd-goal-box">
                <small>Hedef: {sleepGoals[form.kisi.toLowerCase()]}s</small>
                <button className="btn-edit-small" onClick={() => setGoalModalOpen(true)}>⚙️</button>
              </div>
            </div>
            <div className="sd-card glass">
              <span className="sd-label">Tutarlılık</span>
              <strong>%{currentStats.consistency}</strong>
              <div className="sd-progress-bar">
                <div className="sd-progress" style={{ width: `${currentStats.consistency}%` }}></div>
              </div>
            </div>
            <div className="sd-card glass">
              <span className="sd-label">Ort. Kalite</span>
              <strong>{currentStats.avgQuality} / 5</strong>
              <div className="sd-stars">✨✨✨</div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Insights Section */}
      {insights && insights.length > 0 && (
        <div className="sleep-insights mt-20 animate-fadeIn">
          <h4 className="section-title-mini">Akıllı Öneriler ✨</h4>
          <div className="insights-list">
            {insights.map((ins, idx) => (
              <div key={idx} className={`insight-card glass ${ins.type}`}>
                <div className="insight-content">
                  <Zap size={14} className="insight-icon" />
                  <p>{ins.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sleep-history mt-20">
        {sleepData.length === 0 ? (
          <div className="empty-state glass">
            <Moon size={48} className="empty-icon" style={{ color: '#818cf8', opacity: 0.5 }} />
            <p>Henüz uyku verisi girilmemiş.</p>
          </div>
        ) : (
          sleepData.map(s => (
            <div key={s.id} className="health-card glass sleep-card">
              <div className="card-left">
                <div className="sleep-icon-box" style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Moon size={20} color="#6366f1" />
                </div>
                <div className="details" style={{ marginLeft: '12px' }}>
                  <div className="top" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{s.sure} Saat Uyku</strong>
                    <span className="kisi-tag" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }}>{s.kisi}</span>
                  </div>
                  <div className="sub" style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                    <span>📅 {s.tarih}</span>
                    <span style={{ marginLeft: '8px' }}>{getQualityEmoji(s.kalite)} Kalite: {s.kalite}/5</span>
                  </div>
                  {s.not && <p className="sleep-note" style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '8px', opacity: 0.8 }}>"{s.not}"</p>}
                </div>
              </div>
              <button className="btn-del" onClick={() => handleDelete(s.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'none', color: '#94a3b8' }}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="😴 Uyku Takibi"
      >
        <div className="modal-form sleep-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Kim Uyudu?</label>
            <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
              {['Görkem', 'Esra'].map(name => (
                <button 
                  key={name}
                  className={form.kisi === name ? 'active' : ''} 
                  onClick={() => setForm({...form, kisi: name})}
                  style={{ 
                    flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid var(--brd)', 
                    background: form.kisi === name ? '#6366f1' : 'white', 
                    color: form.kisi === name ? 'white' : 'inherit', fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >{name}</button>
              ))}
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', opacity: 0.7 }}>Yatış Saati</label>
              <input type="time" value={form.yatis} onChange={e => setForm({...form, yatis: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)' }} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', opacity: 0.7 }}>Kalkış Saati</label>
              <input type="time" value={form.kalkis} onChange={e => setForm({...form, kalkis: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)' }} />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Veya Toplam Süre (Saat)</label>
            <div className="range-box" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <input 
                 type="range" min="1" max="15" step="0.5" 
                 value={form.sure} 
                 onChange={e => setForm({...form, sure: parseFloat(e.target.value)})} 
                 style={{ flex: 1, accentColor: '#6366f1' }}
               />
               <div className="range-val" style={{ fontWeight: '900', fontSize: '16px', minWidth: '70px', textAlign: 'right', color: '#6366f1' }}>{form.sure}s</div>
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Uyku Kalitesi (1-5)</label>
            <div className="quality-stars" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
               {[1,2,3,4,5].map(q => (
                 <button 
                   key={q} 
                   className={form.kalite >= q ? 'active' : ''} 
                   onClick={() => setForm({...form, kalite: q})}
                   style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                 >
                   <Star size={32} fill={form.kalite >= q ? '#fbbf24' : 'none'} stroke={form.kalite >= q ? '#fbbf24' : '#cbd5e1'} />
                 </button>
               ))}
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Not</label>
            <textarea 
              placeholder="Rüya gördün mü? Dinlenmiş mi uyandın?" 
              value={form.not}
              onChange={e => setForm({...form, not: e.target.value})}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', minHeight: '100px', resize: 'none', fontSize: '14px' }}
            />
          </div>

          <button className="submit-btn primary sleep-btn" onClick={handleSave} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', border: 'none', fontWeight: '900', fontSize: '16px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)', marginTop: '10px' }}>
            Kaydı Ekle ✨
          </button>
        </div>
      </ActionSheet>
      <ActionSheet
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title={`🎯 ${form.kisi} Uyku Hedefi`}
      >
        <div className="modal-form">
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
            Günlük uyku hedefini kendine göre ayarlayabilirsin.
          </p>
          <div className="form-group">
            <label>Hedef Süre (Saat)</label>
            <div className="range-box" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <input 
                 type="range" min="4" max="12" step="0.5" 
                 defaultValue={sleepGoals[form.kisi.toLowerCase()] || 8} 
                 onChange={e => {
                   const val = e.target.value;
                   e.target.nextSibling.innerText = val + 's';
                 }} 
                 style={{ flex: 1, accentColor: '#6366f1' }}
               />
               <div className="range-val" style={{ fontWeight: '900', fontSize: '16px', color: '#6366f1' }}>{sleepGoals[form.kisi.toLowerCase()]}s</div>
            </div>
          </div>
          <button 
            className="submit-btn primary" 
            onClick={(e) => {
              const val = e.target.previousSibling.querySelector('input').value;
              handleUpdateGoal(val);
            }}
            style={{ background: '#6366f1', color: 'white', marginTop: '15px' }}
          >
            Hedefi Güncelle ✨
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

export default SleepTab;
