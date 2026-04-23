import React, { useState } from 'react';
import { Target, Plus, X, CheckCircle, Circle, Trash2, Trophy } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Hedefler.css';

export default function Hedefler() {
  const { hedefler, setModuleData } = useStore();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ad: '', cat: 'Yıllık', dt: '' });

  const list = hedefler || [];

  const handleSave = () => {
    if (!form.ad) return;
    const yeni = { id: Date.now(), ...form, done: false };
    setModuleData('hedefler', [yeni, ...list]);
    setModal(false);
    setForm({ ad: '', cat: 'Yıllık', dt: '' });
    toast.success('Hedef eklendi! 🎯');
  };

  const toggleDone = (id) => {
    const updated = list.map(h => h.id === id ? { ...h, done: !h.done } : h);
    setModuleData('hedefler', updated);
    if (updated.find(h => h.id === id).done) {
      toast.success('Tebrikler! Bir hedef daha tamamlandı! 🏆');
    }
  };

  const deleteItem = (id) => {
    setModuleData('hedefler', list.filter(h => h.id !== id));
  };

  const progress = list.length > 0 
    ? Math.round((list.filter(h => h.done).length / list.length) * 100)
    : 0;

  return (
    <AnimatedPage className="hedefler-container">
      {/* Progress Header */}
      <div className="goals-progress-card">
        <div className="p-header">
          <Trophy size={24} color="#8B5CF6" />
          <div className="p-info">
            <h3>Genel İlerleme</h3>
            <span>{list.filter(h => h.done).length} / {list.length} Hedef Tamamlandı</span>
          </div>
          <span className="p-percent">%{progress}</span>
        </div>
        <div className="p-bar-bg">
          <div className="p-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button className="btn-add-goal" onClick={() => setModal(true)}>
        <Plus size={20} /> Yeni Hedef Belirle
      </button>

      <div className="goals-list">
        {list.length === 0 ? (
          <div className="empty-goals">
            <Target size={48} opacity={0.2} />
            <p>Henüz bir hedef belirlemediniz.</p>
          </div>
        ) : (
          list.map(h => (
            <div key={h.id} className={`goal-card ${h.done ? 'done' : ''}`} onClick={() => toggleDone(h.id)}>
              <div className="g-left">
                {h.done ? <CheckCircle size={24} color="#8B5CF6" /> : <Circle size={24} color="var(--brd)" />}
                <div className="g-info">
                  <strong>{h.ad}</strong>
                  <span className="cat-tag">{h.cat}</span>
                </div>
              </div>
              <button className="btn-del" onClick={(e) => { e.stopPropagation(); deleteItem(h.id); }}><Trash2 size={16} /></button>
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Yeni Hedef</h3>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Hedef Nedir?</label>
                <input type="text" value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} placeholder="Örn: Yeni bir dil öğrenmek" autoFocus />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select value={form.cat} onChange={e => setForm({...form, cat: e.target.value})}>
                  <option>Yıllık</option>
                  <option>Aylık</option>
                  <option>Finansal</option>
                  <option>Sağlık</option>
                  <option>Gezi</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-save" onClick={handleSave}>Hedefi Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
