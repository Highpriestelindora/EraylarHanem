import React, { useState } from 'react';
import { Activity, Trash2, Plus, X, TrendingUp } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

const MeasurementTab = () => {
  const { saglik, setModuleData } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', tur: 'Tansiyon', deger: '', tarih: new Date().toISOString().split('T')[0] });

  const measurements = saglik.olcumler || [];

  const handleAdd = () => {
    if (!form.deger) {
      toast.error('Değer girilmelidir!');
      return;
    }
    const newOlcum = { id: Date.now(), ...form };
    setModuleData('saglik', { ...saglik, olcumler: [newOlcum, ...measurements] });
    setModalOpen(false);
    setForm({ kisi: 'Görkem', tur: 'Tansiyon', deger: '', tarih: new Date().toISOString().split('T')[0] });
    toast.success('Ölçüm kaydedildi!');
  };

  const handleDelete = (id) => {
    const updated = measurements.filter(m => m.id !== id);
    setModuleData('saglik', { ...saglik, olcumler: updated });
    toast.success('Ölçüm silindi.');
  };

  return (
    <div className="tab-view">
      <button className="btn-action" onClick={() => setModalOpen(true)}>
        <Plus size={18} /> Yeni Ölçüm Ekle
      </button>

      <div className="measurements-list">
        {measurements.length === 0 ? (
          <div className="empty-state">
            <Activity size={48} className="empty-icon" />
            <p>Henüz ölçüm eklenmedi</p>
          </div>
        ) : (
          measurements.map(m => (
            <div key={m.id} className="health-card glass">
              <div className="card-left">
                <div className="icon-box" style={{ background: '#ECFDF5' }}>
                  <TrendingUp size={20} color="#10B981" />
                </div>
                <div className="details">
                  <div className="top">
                    <strong>{m.tur}</strong>
                    <span className="kisi-tag">{m.kisi}</span>
                  </div>
                  <div className="sub">
                    <span className="val-text">{m.deger}</span>
                    <span className="dt"> · {m.tarih}</span>
                  </div>
                </div>
              </div>
              <button className="btn-del" onClick={() => handleDelete(m.id)}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="🌡️ Ölçüm Kaydet"
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Kişi</label>
            <select value={form.kisi} onChange={e => setForm({...form, kisi: e.target.value})}>
              <option>Görkem</option>
              <option>Esra</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tür</label>
            <select value={form.tur} onChange={e => setForm({...form, tur: e.target.value})}>
              <option>Tansiyon</option>
              <option>Şeker</option>
              <option>Ateş</option>
              <option>Kilo</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Değer</label>
              <input type="text" value={form.deger} onChange={e => setForm({...form, deger: e.target.value})} placeholder="Örn: 12/8" />
            </div>
            <div className="form-group">
              <label>Tarih</label>
              <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} />
            </div>
          </div>
          <button className="submit-btn primary" onClick={handleAdd}>
            Ölçümü Kaydet
          </button>
        </div>
      </ActionSheet>

    </div>
  );
};

export default MeasurementTab;
