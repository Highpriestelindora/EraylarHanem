import React, { useState } from 'react';
import { Calendar, Pill, Activity, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ActionSheet from '../components/ActionSheet';
import toast from 'react-hot-toast';
import './Saglik.css';

import AppointmentTab from './saglik/AppointmentTab';
import MedicineTab from './saglik/MedicineTab';
import MeasurementTab from './saglik/MeasurementTab';
import MoodTab from './saglik/MoodTab';

export default function Saglik() {
  const [activeTab, setActiveTab] = useState('randevu');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { saglik, addExpense } = useStore();

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

      <ActionSheet
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        title="🏥 Sağlık Harcaması"
      >
        <AddHealthExpenseContent onClose={() => setShowAddExpense(false)} addExpense={addExpense} />
      </ActionSheet>
    </AnimatedPage>
  );
}

function AddHealthExpenseContent({ onClose, addExpense }) {
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="form-group">
        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Açıklama</label>
        <input type="text" placeholder="Örn: Eczane, Muayene..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required autoFocus style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} />
      </div>
      <div className="form-group">
        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Tutar (₺)</label>
        <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--brd)' }} inputMode="decimal" />
      </div>
      <div className="form-group">
        <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Ödeyen</label>
        <div className="payer-select" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {['gorkem', 'esra', 'ortak'].map(p => (
            <button key={p} type="button" className={form.payer === p ? 'active' : ''} onClick={() => setForm({...form, payer: p})} style={{ padding: '12px', borderRadius: '14px', border: '1px solid var(--brd)', background: form.payer === p ? 'var(--saglik-header-grad)' : 'white', color: form.payer === p ? 'white' : 'inherit', fontWeight: 'bold' }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="submit-btn" style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--saglik-header-grad)', color: 'white', border: 'none', fontWeight: '900', fontSize: '16px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>Harcamayı Kaydet</button>
    </form>
  );
}
