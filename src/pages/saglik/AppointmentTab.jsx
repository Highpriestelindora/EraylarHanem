import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User as UserIcon, Stethoscope, Trash2, Plus, X } from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import ActionSheet from '../../components/ActionSheet';

const AppointmentTab = () => {
  const { saglik, setModuleData } = useStore();
  const [modalOpen, setModalOpenLocal] = useState(false);
  const [editingRandevu, setEditingRandevu] = useState(null);
  const [form, setForm] = useState({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });

  const appointments = saglik.randevular || [];

  const handleSave = () => {
    if (!form.doktor || !form.tarih) {
      toast.error('Doktor ve tarih alanları zorunludur!');
      return;
    }

    let updatedRandevular;
    if (editingRandevu) {
      updatedRandevular = appointments.map(r => r.id === editingRandevu.id ? { ...form } : r);
      toast.success('Randevu güncellendi! ✨');
    } else {
      const newRandevu = { id: Date.now(), ...form };
      updatedRandevular = [newRandevu, ...appointments];
      toast.success('Randevu eklendi! 🩺');
    }

    setModuleData('saglik', { ...saglik, randevular: updatedRandevular });
    setModalOpenLocal(false);
    setEditingRandevu(null);
    setForm({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });
  };

  const handleDelete = (id) => {
    const updated = appointments.filter(r => r.id !== id);
    setModuleData('saglik', { ...saglik, randevular: updated });
    toast.success('Randevu silindi.');
  };

  return (
    <div className="tab-view">
      <button 
        className="btn-action" 
        onPointerDown={() => setModalOpenLocal(true)}
        onClick={() => setModalOpenLocal(true)}
      >
        <Plus size={18} /> Yeni Randevu Ekle
      </button>

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon size={48} className="empty-icon" />
            <p>Yaklaşan randevu yok</p>
          </div>
        ) : (
          appointments.map(r => (
            <div 
              key={r.id} 
              className="health-card" 
              role="button"
              tabIndex="0"
              onPointerDown={() => {
                setEditingRandevu(r);
                setForm(r);
                setModalOpenLocal(true);
              }}
              onClick={() => {
                setEditingRandevu(r);
                setForm(r);
                setModalOpenLocal(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setEditingRandevu(r);
                  setForm(r);
                  setModalOpenLocal(true);
                }
              }}
            >
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
              <button className="btn-del" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>

      <ActionSheet
        isOpen={modalOpen}
        onClose={() => {
          setModalOpenLocal(false);
          setEditingRandevu(null);
          setForm({ kisi: 'Görkem', doktor: '', tarih: '', saat: '', not: '', rekurans: 'yok' });
        }}
        title={editingRandevu ? "🩺 Randevuyu Düzenle" : "🩺 Yeni Randevu"}
        footer={
          <button className="submit-btn primary" onClick={handleSave}>
            {editingRandevu ? "Güncellemeleri Kaydet" : "Randevuyu Ekle"}
          </button>
        }
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Kişi</label>
            <div className="person-selector-premium">
              <button 
                className={`ps-btn ${form.kisi === 'Görkem' ? 'active gorkem' : ''}`} 
                onClick={() => setForm({...form, kisi: 'Görkem'})}
              >Görkem</button>
              <button 
                className={`ps-btn ${form.kisi === 'Esra' ? 'active esra' : ''}`} 
                onClick={() => setForm({...form, kisi: 'Esra'})}
              >Esra</button>
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
            <textarea 
              value={form.not} 
              onChange={e => setForm({...form, not: e.target.value})} 
              placeholder="Randevu notları, aç karnına gidilecek vb."
              className="premium-textarea"
            />
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default AppointmentTab;
