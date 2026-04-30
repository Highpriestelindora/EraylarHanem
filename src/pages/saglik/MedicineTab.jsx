import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Trash2, Plus, Bell, History as HistoryIcon, Clock, Package, AlertCircle, Edit2 } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, Activity, CheckCircle } from 'lucide-react';

const MedicineTab = () => {
  const { saglik, setModuleData, takeMedicine } = useStore();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ 
    kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', 
    stok: 30, minStok: 5,
    morning: 1, afternoon: 0, evening: 0
  });

  const medicines = saglik.ilaclar || [];
  const logs = saglik.logs || [];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === todayStr);

  const getSlotStatus = (medId, slot, count) => {
    if (!count || count <= 0) return 'none';
    const log = todayLogs.find(l => l.medId === medId && l.slot === slot);
    if (log) return 'taken';

    const hour = new Date().getHours();
    if (slot === 'morning' && hour >= 12) return 'missed';
    if (slot === 'afternoon' && hour >= 18) return 'missed';
    if (slot === 'evening' && hour >= 23) return 'missed';

    return 'pending';
  };

  const calculateSmartInsights = () => {
    const insights = [];
    const lowStockMeds = medicines.filter(m => m.stok <= m.minStok);
    
    if (lowStockMeds.length > 0) {
      insights.push({
        type: 'warning',
        icon: <ShoppingCart size={16} />,
        text: `${lowStockMeds.map(m => m.ad).join(', ')} stoğu azalıyor. Yeni sipariş vermeyi unutma!`
      });
    }

    // Check for missed doses
    const missedList = [];
    medicines.forEach(m => {
      if (m.schedule) {
        if (getSlotStatus(m.id, 'morning', m.schedule.morning) === 'missed') missedList.push(`${m.ad} (Sabah)`);
        if (getSlotStatus(m.id, 'afternoon', m.schedule.afternoon) === 'missed') missedList.push(`${m.ad} (Öğle)`);
        if (getSlotStatus(m.id, 'evening', m.schedule.evening) === 'missed') missedList.push(`${m.ad} (Akşam)`);
      }
    });

    if (missedList.length > 0) {
      insights.push({
        type: 'warning',
        icon: <AlertCircle size={16} />,
        text: `Dikkat! ${missedList.slice(0, 2).join(', ')}${missedList.length > 2 ? '...' : ''} dozu unutulmuş görünüyor!`
      });
    } else if (medicines.length > 0) {
      insights.push({
        type: 'success',
        icon: <CheckCircle size={16} />,
        text: "Harika! Bugün tüm ilaçlar zamanında alındı. Düzenin mükemmel."
      });
    }

    return insights;
  };

  const smartInsights = calculateSmartInsights();

  const handleAdd = () => {
    if (!form.ad) {
      toast.error('İlaç adı zorunludur!');
      return;
    }
    
    const schedule = {
      morning: Number(form.morning),
      afternoon: Number(form.afternoon),
      evening: Number(form.evening)
    };

    if (isEditing && form.id) {
      const updated = medicines.map(m => m.id === form.id ? { ...form, schedule } : m);
      setModuleData('saglik', { ...saglik, ilaclar: updated });
      toast.success('İlaç güncellendi! ✨');
    } else {
      const newIlac = { 
        id: Date.now(), 
        ...form, 
        stok: Number(form.stok), 
        minStok: Number(form.minStok),
        schedule
      };
      setModuleData('saglik', { ...saglik, ilaclar: [newIlac, ...medicines] });
      toast.success('İlaç eklendi! 💊');
    }

    setModalOpen(false);
    setIsEditing(false);
    setForm({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', stok: 30, minStok: 5, morning: 1, afternoon: 0, evening: 0 });
  };

  const handleEdit = (med) => {
    setForm({
      ...med,
      morning: med.schedule?.morning || 0,
      afternoon: med.schedule?.afternoon || 0,
      evening: med.schedule?.evening || 0
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleQuickTake = (med) => {
    const hour = new Date().getHours();
    let targetSlot = null;

    if ((med.schedule?.morning || 0) > 0 && getSlotStatus(med.id, 'morning', med.schedule?.morning) !== 'taken') {
      targetSlot = 'morning';
    } else if ((med.schedule?.afternoon || 0) > 0 && getSlotStatus(med.id, 'afternoon', med.schedule?.afternoon) !== 'taken') {
      targetSlot = 'afternoon';
    } else if ((med.schedule?.evening || 0) > 0 && getSlotStatus(med.id, 'evening', med.schedule?.evening) !== 'taken') {
      targetSlot = 'evening';
    }

    if (targetSlot) {
      takeMedicine(med.id, targetSlot);
      toast.success(`${targetSlot === 'morning' ? 'Sabah' : targetSlot === 'afternoon' ? 'Öğle' : 'Akşam'} dozu kaydedildi! ✅`);
    } else {
      toast.error('Bugünkü tüm dozlar zaten alınmış! ✨');
    }
  };

  const handleDelete = (id) => {
    const updated = medicines.filter(i => i.id !== id);
    setModuleData('saglik', { ...saglik, ilaclar: updated });
    toast.success('İlaç silindi.');
  };

  return (
    <div className="tab-view animate-fadeIn">
      {/* Smart Medicine Dashboard */}
      <div className="smart-med-dashboard glass mb-20 animate-fadeIn">
        <div className="smd-header">
           <div className="smd-title">
             <Sparkles size={20} color="#10B981" />
             <span>Akıllı İlaç Asistanı</span>
           </div>
           <div className="smd-stats">
              <div className="smd-stat-item">
                 <strong>{todayLogs.length}</strong>
                 <span>Alınan Doz</span>
              </div>
              <div className="smd-stat-item">
                 <strong>{medicines.length}</strong>
                 <span>Aktif İlaç</span>
              </div>
           </div>
        </div>
        
        <div className="smd-insights">
          {smartInsights.length > 0 ? (
            smartInsights.map((ins, idx) => (
              <motion.div 
                key={idx} 
                className={`smd-insight-card ${ins.type}`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                {ins.icon}
                <p>{ins.text}</p>
              </motion.div>
            ))
          ) : (
            <p className="smd-empty">Henüz bir analiz verisi yok. İlaçlarını ekleyerek başlayabilirsin.</p>
          )}
        </div>
      </div>

      <div className="section-header-premium" style={{ marginBottom: '20px' }}>
         <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>💊 Aktif İlaçlar</h3>
         <button className="add-pill-btn" onClick={() => { setIsEditing(false); setForm({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', stok: 30, minStok: 5, morning: 1, afternoon: 0, evening: 0 }); setModalOpen(true); }}>
            <Plus size={16} /> Ekle
         </button>
      </div>

      <div className="meds-list-premium">
        {medicines.length === 0 ? (
          <div className="empty-state-v2">
            <Pill size={60} opacity={0.2} />
            <p>Şu an takip edilen bir ilaç bulunmuyor.</p>
          </div>
        ) : (
          <AnimatePresence>
            {medicines.map((i, idx) => (
              <motion.div 
                key={i.id} 
                className={`health-card-v2 glass ${i.stok <= i.minStok ? 'warning' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="hcv-main">
                  <div className="hcv-left">
                    <div className="hcv-icon-box">💊</div>
                    <div className="hcv-info">
                      <div className="hcv-top">
                        <strong>{i.ad}</strong>
                        <span className="hcv-kisi">{i.kisi}</span>
                      </div>
                      <span className="hcv-sub">{i.dozaj}</span>
                      
                      {/* Dose Slots */}
                      <div className="dose-slots">
                        {[
                          { key: 'morning', label: 'S' },
                          { key: 'afternoon', label: 'Ö' },
                          { key: 'evening', label: 'A' }
                        ].map(slot => {
                          const count = i.schedule?.[slot.key] || 0;
                          if (count <= 0) return null;
                          const status = getSlotStatus(i.id, slot.key, count);
                          return (
                            <div 
                              key={slot.key} 
                              className={`dose-dot ${status}`}
                              onClick={() => {
                                if (status !== 'taken') {
                                  takeMedicine(i.id, slot.key);
                                  toast.success(`${slot.key === 'morning' ? 'Sabah' : slot.key === 'afternoon' ? 'Öğle' : 'Akşam'} dozu kaydedildi! ✅`);
                                }
                              }}
                            >
                              {slot.label}
                            </div>
                          );
                        })}
                      </div>

                      <div className="hcv-stock-row mt-8">
                         <Package size={12} />
                         <span className={i.stok <= i.minStok ? 'critical' : ''}>Stok: {i.stok}</span>
                         {i.stok <= i.minStok && <AlertCircle size={12} color="#ef4444" />}
                      </div>
                    </div>
                  </div>
                  <div className="hcv-actions">
                    <button className="btn-take-premium" onClick={() => handleQuickTake(i)}>İÇİLDİ</button>
                    <div className="hcv-action-row-mini">
                      <button className="btn-edit-mini" onClick={() => handleEdit(i)}><Edit2 size={16} /></button>
                      <button className="btn-del-mini" onClick={() => handleDelete(i.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style jsx>{`
        .dose-slots { display: flex; gap: 6px; margin-top: 8px; }
        .dose-dot { 
          width: 26px; 
          height: 26px; 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 10px; 
          font-weight: 800; 
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .dose-dot.taken { background: #10B981; color: white; border: none; }
        .dose-dot.missed { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; animation: pulse-red 2s infinite; }
        .dose-dot.pending { background: #f1f5f9; color: #64748b; }
        
        .hcv-actions { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
        .hcv-action-row-mini { display: flex; gap: 8px; }
        
        .btn-take-premium {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          transition: all 0.2s;
        }
        .btn-take-premium:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3); }
        .btn-take-premium:active { transform: translateY(0); }

        .btn-edit-mini { background: #f1f5f9; color: #6366f1; border: none; padding: 6px; border-radius: 8px; cursor: pointer; }
        .btn-del-mini { background: #f1f5f9; color: #ef4444; border: none; padding: 6px; border-radius: 8px; cursor: pointer; }
        
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>


      {todayLogs.length > 0 && (
        <div className="med-history-section-premium mt-30">
          <h4 className="section-title-premium">
            <Bell size={18} color="#10B981" />
            <span>Bugün Alınanlar</span>
          </h4>
          <div className="history-timeline-premium">
            {todayLogs.map((log, idx) => (
              <div key={log.id} className="history-item-v2 glass">
                <span className="hi-time">{log.dt}</span>
                <span className="hi-text"><strong>{log.kisi}</strong>, {log.ad} ({log.slot === 'morning' ? 'Sabah' : log.slot === 'afternoon' ? 'Öğle' : 'Akşam'}) içti.</span>
              </div>
            ))}
          </div>
          <button className="view-archive-btn mt-12" onClick={() => navigate('/kayitlar')}>
            <HistoryIcon size={14} /> Tüm Geçmişi ve Arşivi Gör
          </button>
        </div>
      )}

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "✏️ İlaç Düzenle" : "💊 Yeni İlaç Takibi"}
      >
        <div className="modal-form-premium">
          <div className="form-group">
            <label>Kullanacak Kişi</label>
            <div className="user-select-grid">
               <button className={form.kisi === 'Görkem' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Görkem'})}>🧔 Görkem</button>
               <button className={form.kisi === 'Esra' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Esra'})}>👩‍🦰 Esra</button>
            </div>
          </div>
          <div className="form-group">
            <label>İlaç / Vitamin Adı</label>
            <input type="text" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Örn: C Vitamini" className="premium-input" />
          </div>
          
          <div className="form-group">
            <label>Günlük Dozaj Planı (Adet)</label>
            <div className="dose-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label style={{ fontSize: '10px', opacity: 0.7 }}>SABAH</label>
                <input type="number" value={form.morning} onChange={e => setForm({...form, morning: e.target.value})} className="premium-input" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px', opacity: 0.7 }}>ÖĞLE</label>
                <input type="number" value={form.afternoon} onChange={e => setForm({...form, afternoon: e.target.value})} className="premium-input" />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '10px', opacity: 0.7 }}>AKŞAM</label>
                <input type="number" value={form.evening} onChange={e => setForm({...form, evening: e.target.value})} className="premium-input" />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mevcut Stok (Adet)</label>
              <input type="number" value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} className="premium-input" />
            </div>
            <div className="form-group">
              <label>Kritik Stok Uyarı</label>
              <input type="number" value={form.minStok} onChange={e => setForm({...form, minStok: e.target.value})} className="premium-input" />
            </div>
          </div>
          <button className="submit-btn-premium saglik" style={{ marginTop: '10px' }} onClick={handleAdd}>
            {isEditing ? 'Değişiklikleri Kaydet' : 'Takibi Başlat'}
          </button>
        </div>
      </ActionSheet>

    </div>
  );
};

export default MedicineTab;
