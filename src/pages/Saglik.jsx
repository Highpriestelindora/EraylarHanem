import React, { useState } from 'react';
import { Calendar, Pill, Activity, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Saglik.css';

import AppointmentTab from './saglik/AppointmentTab';
import MedicineTab from './saglik/MedicineTab';
import MeasurementTab from './saglik/MeasurementTab';
import MoodTab from './saglik/MoodTab';

export default function Saglik() {
  const [activeTab, setActiveTab] = useState('randevu');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { saglik, addExpense, setModalOpen } = useStore();

  React.useEffect(() => {
    setModalOpen(showAddExpense);
    return () => setModalOpen(false);
  }, [showAddExpense, setModalOpen]);

  const navigate = useNavigate();

  const tabs = [
    { id: 'randevu', label: 'Randevu', emoji: '📅' },
    { id: 'ilac', label: 'İlaç', emoji: '💊' },
    { id: 'olcum', label: 'Ölçüm', emoji: '🌡️' },
    { id: 'mood', label: 'Ruh Hali', emoji: '🎭' }
  ];

  return (
    <AnimatedPage className="saglik-container">
      <header className="module-header glass" style={{ background: 'var(--saglik-header-grad, linear-gradient(135deg, #ef4444, #f87171))' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🏥</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Sağlık</h1>
              <p>Randevu · İlaç · Ruh Hali</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn white" onClick={() => setShowAddExpense(true)} title="Sağlık Harcaması Ekle">
              <Plus size={20} />
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.emoji}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      <div className="saglik-content">
        {activeTab === 'randevu' && <AppointmentTab />}
        {activeTab === 'ilac' && <MedicineTab />}
        {activeTab === 'olcum' && <MeasurementTab />}
        {activeTab === 'mood' && <MoodTab />}
      </div>

      {showAddExpense && (
        <AddHealthExpenseModal onClose={() => setShowAddExpense(false)} addExpense={addExpense} />
      )}
    </AnimatedPage>
  );
}

function AddHealthExpenseModal({ onClose, addExpense }) {
  const [form, setForm] = useState({ title: '', amount: '', payer: 'ortak' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({
      ...form,
      category: 'saglik',
      title: `🏥 Sağlık: ${form.title}`
    });
    toast.success('Harcama kaydedildi! 💸');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🏥 Sağlık Harcaması</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-group">
            <label>Açıklama</label>
            <input type="text" placeholder="Örn: Eczane, Muayene..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required autoFocus />
          </div>
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Ödeyen</label>
            <div className="payer-select">
              <button type="button" className={form.payer === 'gorkem' ? 'active' : ''} onClick={() => setForm({...form, payer: 'gorkem'})}>Görkem</button>
              <button type="button" className={form.payer === 'esra' ? 'active' : ''} onClick={() => setForm({...form, payer: 'esra'})}>Esra</button>
              <button type="button" className={form.payer === 'ortak' ? 'active' : ''} onClick={() => setForm({...form, payer: 'ortak'})}>Ortak</button>
            </div>
          </div>
          <button type="submit" className="submit-btn saglik-header-grad">Harcamayı Kaydet</button>
        </form>
      </div>
    </div>
  );
}
