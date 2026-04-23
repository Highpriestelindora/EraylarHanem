import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Trash2, Plus, X } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

const AppointmentTab = () => {
  const { saglik, setModuleData } = useStore();
  const [modalOpen, setModalOpenLocal] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });

  const appointments = saglik.randevular || [];

  const handleAdd = () => {
    if (!form.doktor || !form.tarih) {
      toast.error('Doktor ve tarih alanları zorunludur!');
      return;
    }
    const newRandevu = { id: Date.now(), ...form };
    setModuleData('saglik', { ...saglik, randevular: [newRandevu, ...appointments] });
    setModalOpenLocal(false);
    setForm({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });
    toast.success('Randevu eklendi! 🩺');
  };

  const handleDelete = (id) => {
    const updated = appointments.filter(r => r.id !== id);
    setModuleData('saglik', { ...saglik, randevular: updated });
    toast.success('Randevu silindi.');
  };

  return (
    <div className="tab-view">
      <button className="btn-action" onClick={() => setModalOpenLocal(true)}>
        <Plus size={18} /> Yeni Randevu Ekle
      </button>

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} className="empty-icon" />
            <p>Yaklaşan randevu yok</p>
          </div>
        ) : (
          appointments.map(r => (
            <div key={r.id} className="health-card glass">
              <div className="card-left">
                <div className="date-box">
                  <span className="day">{r.tarih.split('-')[2]}</span>
                  <span className="month">{new Date(r.tarih).toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div className="details">
                  <div className="top">
                    <strong>{r.doktor}</strong>
                    <span className="kisi-tag">{r.kisi}</span>
                    {r.rekurans !== 'yok' && <span className="rec-badge">🔄 {r.rekurans}</span>}
                  </div>
                  <div className="sub">
                    <span><Clock size={12} /> {r.saat || '--:--'}</span>
                    {r.not && <span className="not-text"> · {r.not}</span>}
                  </div>
                </div>
              </div>
              <button className="btn-del" onClick={() => handleDelete(r.id)}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => setModalOpenLocal(false)}
        title="🩺 Yeni Randevu"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Kişi</label>
            <div className="user-toggle-mini" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className={form.kisi === 'Görkem' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Görkem'})} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', background: form.kisi === 'Görkem' ? 'var(--saglik-header-grad)' : 'white', color: form.kisi === 'Görkem' ? 'white' : 'inherit', fontWeight: 'bold' }}>Görkem</button>
              <button className={form.kisi === 'Esra' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Esra'})} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', background: form.kisi === 'Esra' ? 'var(--saglik-header-grad)' : 'white', color: form.kisi === 'Esra' ? 'white' : 'inherit', fontWeight: 'bold' }}>Esra</button>
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Doktor / Bölüm</label>
            <input type="text" value={form.doktor} onChange={e => setForm({...form, doktor: e.target.value})} placeholder="Örn: Diş Hekimi" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Tarih</label>
              <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} lang="tr-TR" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Saat</label>
              <input type="time" value={form.saat} onChange={e => setForm({...form, saat: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Tekrar Periyodu</label>
            <select value={form.rekurans} onChange={e => setForm({...form, rekurans: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)', background: 'white' }}>
              <option value="yok">Tek Seferlik</option>
              <option value="Haftalık">Haftalık</option>
              <option value="Aylık">Aylık</option>
              <option value="6 Aylık">6 Aylık</option>
              <option value="Yıllık">Yıllık</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Not</label>
            <input type="text" value={form.not} onChange={e => setForm({...form, not: e.target.value})} placeholder="Aç karnına vb." style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} />
          </div>
          <button className="confirm-btn" onClick={handleAdd} style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--saglik-header-grad)', color: 'white', border: 'none', fontWeight: '900', fontSize: '16px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
            Randevuyu Ekle
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

export default AppointmentTab;
