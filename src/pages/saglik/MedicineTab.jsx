import React, { useState } from 'react';
import { Pill, Trash2, Plus, X, Bell } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

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

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="💊 Yeni İlaç Ekle"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Kişi</label>
            <select value={form.kisi} onChange={e => setForm({...form, kisi: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }}>
              <option>Görkem</option>
              <option>Esra</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>İlaç Adı</label>
            <input type="text" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Örn: Parol" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Dozaj</label>
              <input type="text" value={form.dozaj} onChange={e => setForm({...form, dozaj: e.target.value})} placeholder="500mg" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Sıklık</label>
              <select value={form.sıklık} onChange={e => setForm({...form, sıklık: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }}>
                <option>Günde 1</option>
                <option>Günde 2</option>
                <option>Günde 3</option>
                <option>Haftada 1</option>
              </select>
            </div>
          </div>
          <button className="confirm-btn" onClick={handleAdd} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--saglik-header-grad)', color: 'white', border: 'none', fontWeight: '900', fontSize: '16px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
            İlacı Kaydet
          </button>
        </div>
      </ActionSheet>

    </div>
  );
};

export default MedicineTab;
