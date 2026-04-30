import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Trash2, Plus, Bell, History as HistoryIcon, Clock, Package, AlertCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingCart, Activity, CheckCircle } from 'lucide-react';

const MedicineTab = () => {
  const { saglik, setModuleData, takeMedicine } = useStore();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', stok: 30, minStok: 5 });

  const medicines = saglik.ilaclar || [];
  const logs = saglik.logs || [];

  // Filter logs for TODAY only
  const todayStart = new Date().setHours(0,0,0,0);
  const todayLogs = logs.filter(l => l.id >= todayStart);

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

    const takenTodayIds = todayLogs.map(l => l.medId);
    const missedMeds = medicines.filter(m => !takenTodayIds.includes(m.id) && m.sıklık !== 'İhtiyaç Halinde');

    if (missedMeds.length > 0) {
      insights.push({
        type: 'info',
        icon: <Activity size={16} />,
        text: `Bugün henüz ${missedMeds.map(m => m.ad).join(', ')} içilmedi. İhmal etmeyelim.`
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
    const newIlac = { id: Date.now(), ...form, stok: Number(form.stok), minStok: Number(form.minStok) };
    setModuleData('saglik', { ...saglik, ilaclar: [newIlac, ...medicines] });
    setModalOpen(false);
    setForm({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', stok: 30, minStok: 5 });
    toast.success('İlaç eklendi! 💊');
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
                 <span>Alınan</span>
              </div>
              <div className="smd-stat-item">
                 <strong>{medicines.length}</strong>
                 <span>Aktif</span>
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
         <button className="add-pill-btn" onClick={() => setModalOpen(true)}>
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
                      <span className="hcv-sub">{i.dozaj} · {i.sıklık}</span>
                      <div className="hcv-stock-row">
                         <Package size={12} />
                         <span className={i.stok <= i.minStok ? 'critical' : ''}>Kalan: {i.stok} adet</span>
                         {i.stok <= i.minStok && <AlertCircle size={12} color="#ef4444" />}
                      </div>
                    </div>
                  </div>
                  <div className="hcv-actions">
                    <button 
                      className="btn-take-premium" 
                      onClick={() => takeMedicine(i.id)}
                    >
                      İÇİLDİ
                    </button>
                    <button className="btn-del-mini" onClick={() => handleDelete(i.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

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
                <span className="hi-text"><strong>{log.kisi}</strong>, {log.ad} içti.</span>
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
        title="💊 Yeni İlaç Takibi"
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
          <div className="form-row">
            <div className="form-group">
              <label>Dozaj</label>
              <input type="text" value={form.dozaj} onChange={e => setForm({...form, dozaj: e.target.value})} placeholder="500mg / 1 Ölçek" className="premium-input" />
            </div>
            <div className="form-group">
              <label>Sıklık</label>
              <select value={form.sıklık} onChange={e => setForm({...form, sıklık: e.target.value})} className="premium-input">
                <option>Günde 1</option>
                <option>Günde 2</option>
                <option>Günde 3</option>
                <option>Haftada 1</option>
                <option>İhtiyaç Halinde</option>
              </select>
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
            Takibi Başlat
          </button>
        </div>
      </ActionSheet>

    </div>
  );
};

export default MedicineTab;
