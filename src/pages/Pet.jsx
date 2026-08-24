import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Plus, Trash2, Heart, 
  Activity, Scale, ArrowLeft, Camera, Edit2, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import actionIcon from '../assets/eraylar-logo.png';
import { PET_QUOTES } from '../constants/petQuotes';
import { VACCINES, INITIAL_WEIGHTS } from '../constants/data';
import PaymentSelector from '../components/PaymentSelector';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Pet.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const parsePetDate = (str) => {
  if (!str) return 0;
  if (typeof str === 'number') return str;
  const s = String(str).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [y, m, d] = s.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  if (/^\d{1,2}\.\d{1,2}\.\d{4}/.test(s)) {
    const datePart = s.split(' ')[0];
    const [d, m, y] = datePart.split('.').map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  const t = new Date(s).getTime();
  return isNaN(t) ? 0 : t;
};

export default function Pet() {
  const { pet, setModuleData, deletePetLog, updatePetLog, completePetVaccine, deletePetVaccine, addPetVaccine, addPetWeight, deletePetWeight, updatePetWeight, currentUser } = useStore();
  const isGuest = currentUser?.name === 'Misafir';
  const [activePet, setActivePet] = useState('waffle');
  const [showAddLog, setShowAddLog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [completingVaccine, setCompletingVaccine] = useState(null);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [editingWeight, setEditingWeight] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { meta, vaccines, history, weights } = pet || { meta: {}, vaccines: {}, history: [], weights: {} };

  const currentPet = meta[activePet];
  const petVaccines = vaccines[activePet] || [];
  const petWeights = weights[activePet] || [];
  const navigate = useNavigate();

  const sortedWeights = [...petWeights].sort((a, b) => parsePetDate(b.dt) - parsePetDate(a.dt));
  const latestWeight = sortedWeights[0];
  const prevWeight = sortedWeights[1];
  const diff = (latestWeight && prevWeight) ? (Number(latestWeight.w) - Number(prevWeight.w)) : null;

  const chartWeights = [...sortedWeights].reverse();
  const chartLabels = chartWeights.map(w => {
    const d = new Date(parsePetDate(w.dt));
    if (isNaN(d.getTime())) return w.dt;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  });
  const chartValues = chartWeights.map(w => Number(w.w));
  const minVal = chartValues.length > 0 ? Math.min(...chartValues) : 0;
  const maxVal = chartValues.length > 0 ? Math.max(...chartValues) : 20;
  const yMin = Math.max(0, Math.floor(minVal - 1));
  const yMax = Math.ceil(maxVal + 1);

  const handlePetClick = (petId) => {
    const quotes = PET_QUOTES[petId === 'waffle' ? 'waffle' : 'mayis'];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    toast(randomQuote, {
      icon: petId === 'waffle' ? '🐶' : '🐱',
      style: {
        borderRadius: '15px',
        background: '#2E1065',
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  const getVaccineStatus = (v) => {
    if (!v.last) return { label: '?', color: '#94a3b8', days: 0 };
    const parts = v.last.split('.');
    const lastDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const nextDate = new Date(lastDate.getTime() + (v.ev * 864e5));
    const diff = Math.round((nextDate - new Date()) / 864e5);
    
    if (diff <= 0) return { label: 'GECİKMİŞ', color: '#ef4444', days: Math.abs(diff) };
    if (diff < 15) return { label: 'YAKINDA', color: '#f59e0b', days: diff };
    return { label: 'İYİ', color: '#10b981', days: diff };
  };

  const updatePetSupply = (pId, type, val) => {
    if (isGuest) {
      toast.error('Misafir kullanıcısı stok durumunu değiştiremez. 🕵️');
      return;
    }
    const updatedSupplies = { 
      ...pet.supplies, 
      [pId]: { ...(pet.supplies?.[pId] || { mama: 'var', kum: 'var' }), [type]: val } 
    };
    setModuleData('pet', { ...pet, supplies: updatedSupplies });
    
    if (val === 'azaldi') {
      const { mutfak } = useStore.getState();
      const itemName = `${currentPet.name} ${type === 'mama' ? 'Maması' : 'Kumu'}`;
      const existing = (mutfak.alisveris || []).find(i => i.nm === itemName);
      if (!existing) {
        const newItem = { id: Date.now(), nm: itemName, mk: 'Pet Shop', qt: '1 paket', loc: 'depo', pr: 0 };
        useStore.getState().setModuleData('mutfak', { ...mutfak, alisveris: [newItem, ...(mutfak.alisveris || [])] });
        toast.success(`${itemName} alışveriş listesine eklendi! 🛒`);
      } else {
        toast.success(`${itemName} zaten listede var. ⚠️`);
      }
    } else {
      toast.success(`${type === 'mama' ? 'Mama' : 'Kum'} durumu güncellendi!`);
    }
  };


  if (!currentPet) return <div className="p-20">Pet datası yüklenemedi...</div>;

  return (
    <AnimatedPage className="pet-container">
      <header className="module-header glass" style={{ background: 'var(--pet)' }}>
        <div className="header-top">
          <div className="header-title">
            <img src={actionIcon} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Pet</h1>
              <p>Waffle & Mayıs Pati Takibi 🐾</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn-v2" onClick={() => navigate('/')}><ArrowLeft size={20} /></button>
          </div>
        </div>

        <nav className="pet-tab-nav">
          {Object.entries(meta).map(([id, p]) => (
            <button 
              key={id} 
              className={`p-tab-btn ${activePet === id ? 'active' : ''}`}
              onClick={() => setActivePet(id)}
            >
              <span className="p-emoji">{p.emoji}</span>
              <span className="p-name">{p.name}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="pet-scroll-content animate-fadeIn">
        {/* Quick Status Bar */}
        <div className="quick-supply-bar">
          <div className="supply-item glass">
            <div className="si-left">
              <span className="si-icon">🍖</span>
              <div className="si-text">
                <strong>Mama</strong>
                <small>{pet.supplies?.[activePet]?.mama === 'var' ? 'Yeterli ✅' : 'Azalıyor ⚠️'}</small>
              </div>
            </div>
            <button 
              disabled={isGuest}
              className={`si-toggle ${pet.supplies?.[activePet]?.mama === 'var' ? 'ok' : 'low'}`}
              onClick={() => updatePetSupply(activePet, 'mama', pet.supplies?.[activePet]?.mama === 'var' ? 'azaldi' : 'var')}
            >
              {pet.supplies?.[activePet]?.mama === 'var' ? 'VAR' : 'AZALDI'}
            </button>
          </div>
          {activePet === 'mayis' && (
            <div className="supply-item glass">
              <div className="si-left">
                <span className="si-icon">📦</span>
                <div className="si-text">
                  <strong>Kum</strong>
                  <small>{pet.supplies?.[activePet]?.kum === 'var' ? 'Yeterli ✅' : 'Azalıyor ⚠️'}</small>
                </div>
              </div>
              <button 
                disabled={isGuest}
                className={`si-toggle ${pet.supplies?.[activePet]?.kum === 'var' ? 'ok' : 'low'}`}
                onClick={() => updatePetSupply(activePet, 'kum', pet.supplies?.[activePet]?.kum === 'var' ? 'azaldi' : 'var')}
              >
                {pet.supplies?.[activePet]?.kum === 'var' ? 'VAR' : 'AZALDI'}
              </button>
            </div>
          )}
        </div>

        {/* Kimlik Kartı */}
        <div className="pet-identity-card glass animate-fadeIn">
          <div className="pic-row">
            <div className="pic-item"><span>Cins</span> <strong>{currentPet.breed}</strong></div>
            <div className="pic-item"><span>Doğum</span> <strong>{currentPet.birth}</strong></div>
            <div className="pic-item"><span>Cinsiyet</span> <strong>{currentPet.gender}</strong></div>
          </div>
          <div className="pic-divider" />
          <div className="pic-row">
            <div className="pic-item"><span>Renk</span> <strong>{currentPet.color}</strong></div>
            <div className="pic-item"><span>Çip No</span> <strong style={{ fontSize: currentPet.chip?.length > 10 ? '9px' : '11px', letterSpacing: '-0.2px' }}>{currentPet.chip || '--'}</strong></div>
            <div className="pic-item"><span>Pasaport</span> <strong>{currentPet.passport}</strong></div>
          </div>
        </div>

        {/* Health Stats Grid */}
        {/* Kilo Takibi Section */}
        <section className="pet-section mt-20">
          <div className="pet-card-v2 glass">
            <div className="pc-header-v2">
              <div className="pch-left"><Scale size={18} /> <strong>Kilo Takibi</strong></div>
              {!isGuest && (
                <button className="add-btn-mini" onClick={() => { setEditingWeight(null); setShowAddWeight(true); }}>
                  <Plus size={14} />
                </button>
              )}
            </div>
            <div className="pc-body-v2 weight-box">
               <div className="w-main-val">
                  <strong>{latestWeight ? latestWeight.w : '--'}</strong>
                  <small>KG</small>
               </div>
               {latestWeight && (
                 <div className="w-sub-info">
                   <span className="w-date">{latestWeight.dt}</span>
                   {diff !== null && (
                     <div className={`w-diff ${diff > 0 ? 'up' : (diff < 0 ? 'down' : 'neutral')}`}>
                       <span>{diff > 0 ? '▲ +' : (diff < 0 ? '▼ -' : '— ')}{Math.abs(diff).toFixed(1)} kg</span>
                       <span className="w-diff-lbl">(Son ölçüme göre)</span>
                     </div>
                   )}
                 </div>
               )}
               
               {sortedWeights.length > 1 && (
                 <div className="weight-chart-container mt-20">
                   <Bar 
                     data={{
                       labels: chartLabels,
                       datasets: [{
                         label: 'Kilo (kg)',
                         data: chartValues,
                         backgroundColor: activePet === 'waffle' ? '#F97316' : '#FB923C',
                         borderRadius: 8,
                         barThickness: 24,
                         maxBarThickness: 32
                       }]
                     }}
                     options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       plugins: {
                         legend: { display: false },
                         tooltip: {
                           backgroundColor: '#1e293b',
                           titleFont: { size: 11, weight: 'bold' },
                           bodyFont: { size: 12, weight: 'bold' },
                           padding: 8,
                           cornerRadius: 10,
                           callbacks: {
                             title: (items) => {
                               const idx = items[0]?.dataIndex;
                               return chartWeights[idx]?.dt || items[0]?.label;
                             },
                             label: (item) => ` ⚖️ ${item.raw} kg`
                           }
                         }
                       },
                       scales: {
                         x: {
                           grid: { display: false },
                           ticks: {
                             font: { size: 10, weight: 'bold' },
                             color: '#64748b'
                           }
                         },
                         y: {
                           min: yMin,
                           max: yMax,
                           grid: { color: 'rgba(0,0,0,0.04)' },
                           ticks: {
                             font: { size: 9, weight: '600' },
                             color: '#94a3b8',
                             callback: (v) => `${v} kg`
                           }
                         }
                       }
                     }}
                     height={120}
                   />
                 </div>
               )}
            </div>
          </div>
        </section>

        {/* Aşı Takvimi Section */}
        <section className="pet-section mt-20">
          <div className="pet-card-v2 glass">
            <div className="pc-header-v2">
              <div className="pch-left"><Activity size={18} /> <strong>Aşı Takvimi</strong></div>
              {!isGuest && <button className="add-btn-mini" onClick={() => setShowAddVaccine(true)}><Plus size={14} /></button>}
            </div>
            <div className="pc-body-v2">
              {petVaccines.slice(0, 3).map((v, i) => {
                const st = getVaccineStatus(v);
                return (
                  <div key={i} className="v-row-premium">
                    <div className="vr-left">
                      <strong>{v.n}</strong>
                      <small>{v.last}</small>
                    </div>
                    <div className="vr-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="vr-badge" style={{ background: st.color + '20', color: st.color, fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '8px' }}>
                        {st.label === 'GECİKMİŞ' ? `-${st.days} g.` : `${st.days} g.`}
                      </div>
                      {!isGuest && (
                        <>
                          <button className="done-btn-mini" onClick={() => { setEditingVaccine(v); setShowAddVaccine(true); }} title="Düzenle">
                            <Edit2 size={14} />
                          </button>
                          <button className="done-btn-mini" onClick={() => setCompletingVaccine(v)} title="Yapıldı Olarak İşaretle">
                            <Check size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Günlük & Geçmiş (Notlar) */}
        <section className="pet-section mt-24">
          <div className="ps-header">
            <h3>📝 Sağlık & Bakım Günlüğü</h3>
          </div>
          <div className="history-timeline-premium">
            {(history || []).filter(h => h.pet === activePet && h.type !== 'weight' && h.type !== 'vaccine_done').map((h) => (
              <div key={h.id} className="history-card-v2 note-card glass">
                <div className="hc-icon">📝</div>
                <div className="hc-info">
                  <p>{h.action}</p>
                  <span className="hc-time">{h.dt}</span>
                </div>
                <div className="hc-actions">
                  <button className="hc-edit" onClick={() => { setEditingLog(h); setShowAddLog(true); }}><Edit2 size={14} /></button>
                  <button className="hc-del" onClick={() => deletePetLog(h.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {!(history || []).some(h => h.pet === activePet && h.type !== 'weight' && h.type !== 'vaccine_done') && (
              <div className="gallery-empty" style={{ padding: '20px', fontSize: '11px' }}>Henüz bir not alınmamış.</div>
            )}
          </div>
        </section>

        {/* Kilo Geçmişi */}
        <section className="pet-section mt-24">
          <div className="ps-header">
            <h3>⚖️ Kilo Geçmişi ({sortedWeights.length})</h3>
            {!isGuest && (
              <button className="ps-btn" onClick={() => { setEditingWeight(null); setShowAddWeight(true); }}>
                <Plus size={14} /> Yeni Ölçüm
              </button>
            )}
          </div>
          <div className="history-timeline-premium">
            {sortedWeights.map((w, idx) => {
              const prev = sortedWeights[idx + 1];
              const itemDiff = prev ? (Number(w.w) - Number(prev.w)) : null;
              return (
                <div key={w.id || idx} className="history-card-v2 glass">
                  <div className="hc-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>⚖️</div>
                  <div className="hc-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '15px', color: '#1e293b' }}>{w.w} kg</strong>
                      {itemDiff !== null && (
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 800, 
                          color: itemDiff > 0 ? '#ea580c' : (itemDiff < 0 ? '#059669' : '#64748b'),
                          background: itemDiff > 0 ? '#fff7ed' : (itemDiff < 0 ? '#ecfdf5' : '#f1f5f9'),
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {itemDiff > 0 ? '▲ +' : (itemDiff < 0 ? '▼ -' : '— ')}{Math.abs(itemDiff).toFixed(1)} kg
                        </span>
                      )}
                    </div>
                    <span className="hc-time">{w.dt}</span>
                    {w.notes && <small style={{ display: 'block', color: '#64748b', marginTop: '2px' }}>{w.notes}</small>}
                  </div>
                  {!isGuest && (
                    <div className="hc-actions">
                      <button className="hc-edit" onClick={() => { setEditingWeight(w); setShowAddWeight(true); }} title="Düzenle">
                        <Edit2 size={14} />
                      </button>
                      <button className="hc-del" onClick={() => {
                        if (window.confirm(`${w.dt} tarihli ${w.w} kg kilo kaydını silmek istediğinize emin misiniz?`)) {
                          deletePetWeight(activePet, w.id);
                          toast.success('Kilo kaydı silindi.');
                        }
                      }} title="Sil">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {sortedWeights.length === 0 && (
              <div className="gallery-empty" style={{ padding: '20px', fontSize: '11px' }}>Kayıtlı kilo verisi yok.</div>
            )}
          </div>
        </section>

        {/* Quick Actions Moved to Bottom */}
        {!isGuest && (
          <div className="pet-quick-actions mt-24 mb-40">
            <button className="ps-btn finance" onClick={() => setShowAddExpense(true)}><Heart size={14} /> Harcama</button>
            <button className="ps-btn" onClick={() => { setEditingLog(null); setShowAddLog(true); }}><Plus size={14} /> Not</button>
          </div>
        )}
      </div>

      <ActionSheet isOpen={showAddLog} onClose={() => { setShowAddLog(false); setEditingLog(null); }} title={editingLog ? "📝 Kaydı Düzenle" : "📝 Günlüğe Ekle"}>
        <AddPetLogContent petId={activePet} onClose={() => { setShowAddLog(false); setEditingLog(null); }} editingLog={editingLog} />
      </ActionSheet>

      <ActionSheet isOpen={!!completingVaccine} onClose={() => setCompletingVaccine(null)} title={`💉 ${completingVaccine?.n} Aşısı Uygulandı`}>
        <ApplyVaccineContent petId={activePet} vaccine={completingVaccine} onClose={() => setCompletingVaccine(null)} />
      </ActionSheet>

      <ActionSheet isOpen={showAddVaccine} onClose={() => { setShowAddVaccine(false); setEditingVaccine(null); }} title={editingVaccine ? "💉 Aşı Düzenle" : "💉 Aşı Ekle"}>
        <ManageVaccineContent petId={activePet} onClose={() => { setShowAddVaccine(false); setEditingVaccine(null); }} editingVaccine={editingVaccine} />
      </ActionSheet>

      <ActionSheet isOpen={showAddWeight} onClose={() => { setShowAddWeight(false); setEditingWeight(null); }} title={editingWeight ? "⚖️ Kilo Ölçümünü Düzenle" : "⚖️ Kilo Ölçümü Ekle"}>
        <AddWeightContent petId={activePet} onClose={() => { setShowAddWeight(false); setEditingWeight(null); }} editingWeight={editingWeight} />
      </ActionSheet>

      <ActionSheet isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="💸 Harcama Ekle">
        <AddPetExpenseContent petId={activePet} onClose={() => setShowAddExpense(false)} />
      </ActionSheet>
    </AnimatedPage>
  );
}

function AddPetExpenseContent({ petId, onClose }) {
  const { addExpense, pet } = useStore();
  const [formData, setFormData] = useState({ title: '', amount: '', payer: 'ortak' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const petName = pet.meta[petId].name;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    addExpense({
      title: `🐾 ${petName}: ${formData.title}`,
      amount: Number(formData.amount),
      category: 'pet',
      payer: formData.payer,
      defaultPay: paymentMethod
    });
    onClose();
    toast.success('Harcama Finans\'a eklendi! 💸');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Harcama Başlığı</label>
        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="ör: Mama, Kum..." required autoFocus />
      </div>
      <div className="form-group">
        <label>Tutar (₺)</label>
        <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0" required />
      </div>
      <div className="form-group">
        <label>Ödeme Yöntemi</label>
        <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>Harcamayı Kaydet</button>
    </form>
  );
}

function AddWeightContent({ petId, onClose, editingWeight }) {
  const { addPetWeight, updatePetWeight } = useStore();

  const getInitialDateInput = () => {
    if (!editingWeight?.dt) return new Date().toISOString().split('T')[0];
    const parsedTime = parsePetDate(editingWeight.dt);
    const d = new Date(parsedTime);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [formData, setFormData] = useState({ 
    w: editingWeight ? editingWeight.w : '', 
    dt: getInitialDateInput(),
    notes: editingWeight?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.w) return;
    
    const [y, m, d] = formData.dt.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const formattedDate = dateObj.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long'
    });

    if (editingWeight) {
      updatePetWeight(petId, editingWeight.id, { 
        w: Number(formData.w), 
        dt: formattedDate,
        notes: formData.notes 
      });
      toast.success('Kilo kaydı güncellendi! ✨');
    } else {
      addPetWeight(petId, { 
        w: Number(formData.w), 
        dt: formattedDate,
        notes: formData.notes 
      });
      toast.success('Kilo kaydedildi! ⚖️');
    }
    onClose();
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Ağırlık (kg)</label>
        <input 
          type="number" 
          step="0.1" 
          value={formData.w} 
          onChange={e => setFormData({...formData, w: e.target.value})} 
          placeholder="10.5" 
          required 
          autoFocus 
        />
      </div>
      <div className="form-group">
        <label>Ölçüm Tarihi</label>
        <input 
          type="date" 
          value={formData.dt} 
          onChange={e => setFormData({...formData, dt: e.target.value})} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Not (Opsiyonel)</label>
        <input 
          type="text" 
          value={formData.notes} 
          onChange={e => setFormData({...formData, notes: e.target.value})} 
          placeholder="ör: Veteriner tartısı, aşı kontrolü..." 
        />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>
        {editingWeight ? 'Güncellemeyi Kaydet' : 'Kaydet'}
      </button>
    </form>
  );
}

function ManageVaccineContent({ petId, onClose, editingVaccine }) {
  const { addPetVaccine, updatePetVaccine, deletePetVaccine } = useStore();
  const [formData, setFormData] = useState({ 
    n: editingVaccine ? editingVaccine.n : '', 
    last: editingVaccine ? editingVaccine.last : new Date().toLocaleDateString('tr-TR'), 
    ev: editingVaccine ? editingVaccine.ev : 60 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.n) return;
    
    if (editingVaccine) {
      updatePetVaccine(petId, editingVaccine.id || editingVaccine.n, formData);
      toast.success('Aşı güncellendi! ✨');
    } else {
      addPetVaccine(petId, formData);
      toast.success('Aşı takvime eklendi! 💉');
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Bu aşıyı takvimden silmek istediğinize emin misiniz?')) {
      deletePetVaccine(petId, editingVaccine.id || editingVaccine.n);
      toast.success('Aşı silindi.');
      onClose();
    }
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Aşı Adı</label>
        <input type="text" value={formData.n} onChange={e => setFormData({...formData, n: e.target.value})} placeholder="Karma, Kuduz..." required />
      </div>
      <div className="form-group">
        <label>Son Uygulama Tarihi</label>
        <input type="text" value={formData.last} onChange={e => setFormData({...formData, last: e.target.value})} placeholder="DD.MM.YYYY" required />
      </div>
      <div className="form-group">
        <label>Periyot (Gün)</label>
        <input type="number" value={formData.ev} onChange={e => setFormData({...formData, ev: Number(e.target.value)})} required />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {editingVaccine && (
          <button type="button" onClick={handleDelete} className="submit-btn" style={{ background: '#ef4444', color: 'white', flex: 1 }}>Sil</button>
        )}
        <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white', flex: 2 }}>
          {editingVaccine ? 'Güncelle' : 'Takvime Ekle'}
        </button>
      </div>
    </form>
  );
}

function AddPetLogContent({ petId, onClose, editingLog }) {
  const { pet, addPetLog, updatePetLog } = useStore();
  const [note, setNote] = useState(editingLog ? editingLog.action : '');
  const [date, setDate] = useState(editingLog ? editingLog.dt : new Date().toLocaleDateString('tr-TR'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note) return;

    if (editingLog) {
      updatePetLog(editingLog.id, { action: note, dt: date });
      toast.success('Kayıt güncellendi! ✨');
    } else {
      const newLog = {
        id: Date.now(),
        pet: petId,
        action: note,
        dt: date,
        type: 'manual'
      };
      addPetLog(newLog);
      toast.success('Günlük kaydedildi! 📝');
    }
    onClose();
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Tarih</label>
        <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="02.05.2026" />
      </div>
      <div className="form-group">
        <label>{editingLog?.type === 'weight' ? 'Kilo Bilgisi' : 'Neler Oldu?'}</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Veteriner kontrolü..." rows={4} autoFocus />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>
        {editingLog ? 'Güncelle' : 'Kaydet'}
      </button>
    </form>
  );
}
function ApplyVaccineContent({ petId, vaccine, onClose }) {
  const { completePetVaccine } = useStore();
  const [place, setPlace] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('tr-TR'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await completePetVaccine(petId, vaccine.n, { place, amount, date, paymentInfo: paymentMethod });
    toast.success(`${vaccine.n} aşısı başarıyla kaydedildi! 💉`);
    onClose();
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Uygulama Tarihi</label>
        <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="DD.MM.YYYY" />
      </div>
      <div className="form-group">
        <label>Nerede Yapıldı?</label>
        <input type="text" value={place} onChange={e => setPlace(e.target.value)} placeholder="Veteriner kliniği adı..." />
      </div>
      <div className="form-group">
        <label>Ücret (₺) <small>(Harcamalara eklemek için doldurun)</small></label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
      </div>
      {amount > 0 && (
        <div className="form-group">
          <label>Ödeme Yöntemi</label>
          <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
        </div>
      )}
      <button type="submit" className="submit-btn" style={{ background: '#10b981', color: 'white' }}>
        Aşıyı Onayla
      </button>
    </form>
  );
}
