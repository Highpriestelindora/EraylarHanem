import React, { useState, useMemo } from 'react';
import { Activity, Trash2, Plus, X, TrendingUp, Scale, Thermometer, Droplets } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';
import { motion, AnimatePresence } from 'framer-motion';

const MeasurementTab = () => {
  const { saglik, setModuleData, addMeasurement } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', tur: 'Kilo', deger: '', tarih: new Date().toISOString().split('T')[0] });

  const measurements = saglik.olcumler || [];

  const handleAdd = () => {
    if (!form.deger) {
      toast.error('Değer girilmelidir!');
      return;
    }
    addMeasurement(form);
    setModalOpen(false);
    setForm({ kisi: 'Görkem', tur: 'Kilo', deger: '', tarih: new Date().toISOString().split('T')[0] });
    toast.success('Ölçüm kaydedildi! 🌡️');
  };

  const handleDelete = (id) => {
    const updated = measurements.filter(m => m.id !== id);
    setModuleData('saglik', { ...saglik, olcumler: updated });
    toast.success('Ölçüm silindi.');
  };

  const getIcon = (tur) => {
    switch(tur) {
      case 'Kilo': return <Scale size={20} color="#3b82f6" />;
      case 'Tansiyon': return <Activity size={20} color="#ef4444" />;
      case 'Şeker': return <Droplets size={20} color="#8b5cf6" />;
      default: return <Thermometer size={20} color="#10b981" />;
    }
  };

  return (
    <div className="tab-view animate-fadeIn">
      <div className="section-header-premium" style={{ marginBottom: '20px' }}>
         <h3 style={{ fontSize: '18px', fontWeight: '900' }}>🌡️ Sağlık Ölçümleri</h3>
         <button className="add-measure-btn" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Yeni
         </button>
      </div>

      <div className="measurements-list-premium">
        {measurements.length === 0 ? (
          <div className="empty-state-v2">
            <Activity size={60} opacity={0.2} />
            <p>Henüz bir ölçüm kaydı bulunmuyor.</p>
          </div>
        ) : (
          <AnimatePresence>
            {measurements.map((m, idx) => (
              <motion.div 
                key={m.id} 
                className="health-card-v2 glass"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="hcv-main">
                   <div className="hcv-left">
                      <div className="hcv-icon-box" style={{ background: 'white' }}>
                        {getIcon(m.tur)}
                      </div>
                      <div className="hcv-info">
                        <div className="hcv-top">
                          <strong>{m.tur}</strong>
                          <span className="hcv-kisi">{m.kisi}</span>
                        </div>
                        <span className="hcv-val" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--txt)' }}>
                          {m.deger} {m.tur === 'Kilo' ? 'kg' : ''}
                        </span>
                        <span className="hcv-sub" style={{ fontSize: '11px', opacity: 0.6 }}>{new Date(m.tarih).toLocaleDateString('tr-TR')}</span>
                      </div>
                   </div>
                   <button className="btn-del-mini" onClick={() => handleDelete(m.id)}><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="🌡️ Yeni Ölçüm Kaydet"
      >
        <div className="modal-form-premium">
          <div className="form-group">
            <label>Kişi</label>
            <div className="user-select-grid">
               <button className={form.kisi === 'Görkem' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Görkem'})}>🧔 Görkem</button>
               <button className={form.kisi === 'Esra' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Esra'})}>👩‍🦰 Esra</button>
            </div>
          </div>
          <div className="form-group">
            <label>Ölçüm Türü</label>
            <div className="type-select-grid">
               {['Kilo', 'Tansiyon', 'Şeker', 'Ateş'].map(t => (
                 <button key={t} className={form.tur === t ? 'active' : ''} onClick={() => setForm({...form, tur: t})}>
                   {t}
                 </button>
               ))}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Değer</label>
              <input type="text" value={form.deger} onChange={e => setForm({...form, deger: e.target.value})} placeholder="Örn: 78.5" className="premium-input" />
            </div>
            <div className="form-group">
              <label>Tarih</label>
              <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} className="premium-input" />
            </div>
          </div>
          <button className="submit-btn-premium wellness" style={{ marginTop: '10px' }} onClick={handleAdd}>
            Ölçümü Kaydet
          </button>
        </div>
      </ActionSheet>

    </div>
  );
};

export default MeasurementTab;
