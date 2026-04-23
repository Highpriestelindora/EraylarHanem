import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Trash2, Plus, X } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const AppointmentTab = () => {
  const { saglik, setModuleData, setModalOpen } = useStore();
  const [modalOpen, setModalOpenLocal] = useState(false);
  const [form, setForm] = useState({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });

  React.useEffect(() => {
    setModalOpen(modalOpen);
    return () => setModalOpen(false);
  }, [modalOpen, setModalOpen]);

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

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpenLocal(false)}>
          <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🩺 Yeni Randevu</h3>
              <button onClick={() => setModalOpenLocal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Kişi</label>
                <div className="user-toggle-mini">
                  <button className={form.kisi === 'Görkem' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Görkem'})}>Görkem</button>
                  <button className={form.kisi === 'Esra' ? 'active' : ''} onClick={() => setForm({...form, kisi: 'Esra'})}>Esra</button>
                </div>
              </div>
              <div className="form-group">
                <label>Doktor / Bölüm</label>
                <input type="text" value={form.doktor} onChange={e => setForm({...form, doktor: e.target.value})} placeholder="Örn: Diş Hekimi" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tarih</label>
                  <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} lang="tr-TR" />
                </div>
                <div className="form-group">
                  <label>Saat</label>
                  <input type="time" value={form.saat} onChange={e => setForm({...form, saat: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Tekrar Periyodu</label>
                <select value={form.rekurans} onChange={e => setForm({...form, rekurans: e.target.value})}>
                  <option value="yok">Tek Seferlik</option>
                  <option value="Haftalık">Haftalık</option>
                  <option value="Aylık">Aylık</option>
                  <option value="6 Aylık">6 Aylık</option>
                  <option value="Yıllık">Yıllık</option>
                </select>
              </div>
              <div className="form-group">
                <label>Not</label>
                <input type="text" value={form.not} onChange={e => setForm({...form, not: e.target.value})} placeholder="Aç karnına vb." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-save saglik-header-grad" onClick={handleAdd}>Randevuyu Ekle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTab;
