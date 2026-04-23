import React, { useState } from 'react';
import { Pill, Trash2, Plus, X, Bell } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const MedicineTab = () => {
  const { saglik, setModuleData } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', not: '' });

  const medicines = saglik.ilaclar || [];

  const handleAdd = () => {
    if (!form.ad) {
      toast.error('İlaç adı zorunludur!');
      return;
    }
    const newIlac = { id: Date.now(), ...form };
    setModuleData('saglik', { ...saglik, ilaclar: [newIlac, ...medicines] });
    setModalOpen(false);
    setForm({ kisi: 'Görkem', ad: '', dozaj: '', sıklık: 'Günde 1', not: '' });
    toast.success('İlaç eklendi!');
  };

  const handleDelete = (id) => {
    const updated = medicines.filter(i => i.id !== id);
    setModuleData('saglik', { ...saglik, ilaclar: updated });
    toast.success('İlaç silindi.');
  };

  return (
    <div className="tab-view">
      <button className="btn-action" onClick={() => setModalOpen(true)}>
        <Plus size={18} /> Yeni İlaç Ekle
      </button>

      <div className="meds-list">
        {medicines.length === 0 ? (
          <div className="empty-state">
            <Pill size={48} className="empty-icon" />
            <p>Aktif ilaç kullanımı yok</p>
          </div>
        ) : (
          medicines.map(i => (
            <div key={i.id} className="health-card glass">
              <div className="card-left">
                <div className="icon-box" style={{ background: '#F0F9FF' }}>💊</div>
                <div className="details">
                  <div className="top">
                    <strong>{i.ad}</strong>
                    <span className="kisi-tag">{i.kisi}</span>
                  </div>
                  <div className="sub">
                    <span>{i.dozaj} · {i.sıklık}</span>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button 
                  className="btn-take" 
                  onClick={() => {
                    const log = { id: Date.now(), medId: i.id, ad: i.ad, kisi: i.kisi, dt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) };
                    setModuleData('saglik', { ...saglik, logs: [log, ...(saglik.logs || [])].slice(0, 50) });
                    toast.success(`${i.ad} içildi olarak kaydedildi! ✨`);
                  }}
                >
                  İÇİLDİ
                </button>
                <button className="btn-del" onClick={() => handleDelete(i.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {(saglik.logs || []).length > 0 && (
        <div className="med-history-section">
          <h4 className="section-title"><Bell size={16} /> Bugün Alınanlar</h4>
          <div className="history-scroll">
            {saglik.logs.map(log => (
              <div key={log.id} className="history-pill glass">
                <span className="h-time">{log.dt}</span>
                <span className="h-text"><strong>{log.kisi}</strong> {log.ad} içti.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>İlaç Ekle</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Kişi</label>
                <select value={form.kisi} onChange={e => setForm({...form, kisi: e.target.value})}>
                  <option>Görkem</option>
                  <option>Esra</option>
                </select>
              </div>
              <div className="form-group">
                <label>İlaç Adı</label>
                <input type="text" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Örn: Parol" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dozaj</label>
                  <input type="text" value={form.dozaj} onChange={e => setForm({...form, dozaj: e.target.value})} placeholder="500mg" />
                </div>
                <div className="form-group">
                  <label>Sıklık</label>
                  <select value={form.sıklık} onChange={e => setForm({...form, sıklık: e.target.value})}>
                    <option>Günde 1</option>
                    <option>Günde 2</option>
                    <option>Günde 3</option>
                    <option>Haftada 1</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={handleAdd}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicineTab;
