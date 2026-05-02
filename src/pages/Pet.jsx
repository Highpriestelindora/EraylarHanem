import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Plus, Trash2, Heart, 
  Activity, Scale, ArrowLeft, Camera, ShieldCheck, Edit2, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import actionIcon from '../assets/eraylar-logo.png';
import { PET_QUOTES } from '../constants/petQuotes';
import { VACCINES, INITIAL_WEIGHTS } from '../constants/data';
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

export default function Pet() {
  const { pet, setModuleData, deletePetLog, updatePetLog, completePetVaccine, deletePetVaccine, addPetVaccine, addPetWeight } = useStore();
  const [activePet, setActivePet] = useState('waffle');
  const [showAddLog, setShowAddLog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [completingVaccine, setCompletingVaccine] = useState(null);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { meta, vaccines, history, weights } = pet || { meta: {}, vaccines: {}, history: [], weights: {} };

  const handleBatchSync = () => {
    const currentPetState = { ...pet };
    
    // 1. Aşıları sistem kayıtlarına (Takvim'e) işle
    const newVaccines = JSON.parse(JSON.stringify(currentPetState.vaccines || {}));
    
    Object.entries(VACCINES).forEach(([pId, vList]) => {
      if (!newVaccines[pId]) newVaccines[pId] = [];
      
      vList.forEach(sourceV => {
        let targetV = newVaccines[pId].find(v => v.n === sourceV.n);
        if (!targetV) {
          targetV = { ...sourceV, h: [] };
          newVaccines[pId].push(targetV);
        }
        
        // Geçmiş tarihleri birleştir (Duplicate engelle)
        const existingDates = new Set(targetV.h || []);
        (sourceV.h || []).forEach(d => existingDates.add(d));
        
        targetV.h = Array.from(existingDates).sort((a, b) => {
           const parse = (dt) => { 
             const p = dt.split('.'); 
             return new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime(); 
           };
           return parse(a) - parse(b);
        });
        
        // En son aşı tarihini güncelle (Takvim için kritik)
        if (targetV.h.length > 0) {
          targetV.last = targetV.h[targetV.h.length - 1];
        }
      });
    });

    // 2. Kiloları ve Notları Günlüğe (History) işle
    // Aşıları günlükten temizle (Kullanıcı isteği: Aşılar günlükte olmasın)
    const cleanHistory = (currentPetState.history || []).filter(h => h.type !== 'vaccine');
    let addedWeights = [];
    
    Object.entries(INITIAL_WEIGHTS).forEach(([pId, wList]) => {
      wList.forEach(w => {
        const actionText = `Kilo güncellendi: ${w.w} kg`;
        const exists = cleanHistory.some(h => h.pet === pId && h.action === actionText && h.dt === w.dt);
        if (!exists) {
          addedWeights.push({
            id: `w_${pId}_${w.id}_${w.dt.replace(/\./g, '')}_${Date.now()}`,
            pet: pId,
            action: actionText,
            dt: w.dt,
            type: 'weight'
          });
        }
      });
    });

    const finalHistory = [...addedWeights, ...cleanHistory].sort((a, b) => {
        const parse = (dt) => { 
          const p = dt.split('.'); 
          if(p.length !== 3) return 0;
          return new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime(); 
        };
        return parse(b.dt) - parse(a.dt);
    });

    setModuleData('pet', { 
      ...currentPetState, 
      vaccines: newVaccines, 
      history: finalHistory 
    });
    
    toast.success("Tüm aşı kayıtları takvime, kilolar ise günlüğe başarıyla işlendi! 🐾", {
      duration: 5000,
      style: { background: '#1e3a8a', color: '#fff', border: '1px solid #3b82f6' }
    });
  };
  const currentPet = meta[activePet];
  const petVaccines = vaccines[activePet] || [];
  const petWeights = weights[activePet] || [];
  const navigate = useNavigate();

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
            <button className="icon-btn-v2" onClick={handleBatchSync} title="Veri Sihirbazı" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <ShieldCheck size={20} />
            </button>
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
            <div className="pic-item"><span>Çip No</span> <strong>{currentPet.chip?.slice(-6)}...</strong></div>
            <div className="pic-item"><span>Pasaport</span> <strong>{currentPet.passport}</strong></div>
          </div>
        </div>

        {/* Health Stats Grid */}
        {/* Kilo Takibi Section */}
        <section className="pet-section mt-20">
          <div className="pet-card-v2 glass">
            <div className="pc-header-v2">
              <div className="pch-left"><Scale size={18} /> <strong>Kilo Takibi</strong></div>
              <button className="add-btn-mini" onClick={() => setShowAddWeight(true)}><Plus size={14} /></button>
            </div>
            <div className="pc-body-v2 weight-box">
               <div className="w-main-val">
                  <strong>{petWeights[0]?.w || '--'}</strong>
                  <small>KG</small>
               </div>
               {petWeights.length > 0 && (
                 <div className="w-sub-info">
                   <span className="w-date">{petWeights[0].dt}</span>
                   {petWeights[1] && (
                     <div className={`w-diff ${petWeights[0].w >= petWeights[1].w ? 'up' : 'down'}`}>
                       {petWeights[0].w >= petWeights[1].w ? '▲' : '▼'} {(petWeights[0].w - petWeights[1].w).toFixed(1)}
                     </div>
                   )}
                 </div>
               )}
               
               {petWeights.length > 1 && (
                 <div className="weight-chart-container mt-20">
                   <Bar 
                     data={{
                       labels: [...petWeights].reverse().map(w => w.dt.split('.').slice(0,2).join('.')),
                       datasets: [{
                         label: 'Kilo',
                         data: [...petWeights].reverse().map(w => w.w),
                         backgroundColor: activePet === 'waffle' ? '#F97316' : '#FB923C',
                         borderRadius: 6,
                         barThickness: 20
                       }]
                     }}
                     options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       plugins: { legend: { display: false } },
                       scales: {
                         x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' } } },
                         y: { display: false }
                       }
                     }}
                     height={100}
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
              <button className="add-btn-mini" onClick={() => setShowAddVaccine(true)}><Plus size={14} /></button>
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
                      <button className="done-btn-mini" onClick={() => setCompletingVaccine(v)} title="Yapıldı Olarak İşaretle">
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Günlük & Geçmiş */}
        <section className="pet-section mt-24">
          <div className="ps-header">
            <h3>⌛ Sağlık & Bakım Günlüğü</h3>
          </div>
            <div className="history-timeline-premium">
            {(history || []).filter(h => h.pet === activePet).map((h) => (
              <div key={h.id} className="history-card-v2 glass">
                <div className="hc-icon">{h.type === 'weight' ? '⚖️' : '📝'}</div>
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
          </div>
        </section>

        {/* Quick Actions Moved to Bottom */}
        <div className="pet-quick-actions mt-24 mb-40">
          <button className="ps-btn finance" onClick={() => setShowAddExpense(true)}><Heart size={14} /> Harcama</button>
          <button className="ps-btn" onClick={() => { setEditingLog(null); setShowAddLog(true); }}><Plus size={14} /> Not</button>
        </div>
      </div>

      <ActionSheet isOpen={showAddLog} onClose={() => { setShowAddLog(false); setEditingLog(null); }} title={editingLog ? "📝 Kaydı Düzenle" : "📝 Günlüğe Ekle"}>
        <AddPetLogContent petId={activePet} onClose={() => { setShowAddLog(false); setEditingLog(null); }} editingLog={editingLog} />
      </ActionSheet>

      <ActionSheet isOpen={!!completingVaccine} onClose={() => setCompletingVaccine(null)} title={`💉 ${completingVaccine?.n} Aşısı Uygulandı`}>
        <ApplyVaccineContent petId={activePet} vaccine={completingVaccine} onClose={() => setCompletingVaccine(null)} />
      </ActionSheet>

      <ActionSheet isOpen={showAddVaccine} onClose={() => setShowAddVaccine(false)} title="💉 Aşı Ekle">
        <ManageVaccineContent petId={activePet} onClose={() => setShowAddVaccine(false)} />
      </ActionSheet>

      <ActionSheet isOpen={showAddWeight} onClose={() => setShowAddWeight(false)} title="⚖️ Kilo Ölçümü">
        <AddWeightContent petId={activePet} onClose={() => setShowAddWeight(false)} />
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
  const petName = pet.meta[petId].name;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    addExpense({
      title: `🐾 ${petName}: ${formData.title}`,
      amount: Number(formData.amount),
      category: 'pet',
      payer: formData.payer
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
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>Harcamayı Kaydet</button>
    </form>
  );
}

function AddWeightContent({ petId, onClose }) {
  const { addPetWeight } = useStore();
  const [formData, setFormData] = useState({ w: '', dt: new Date().toLocaleDateString('tr-TR') });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.w) return;
    addPetWeight(petId, { ...formData, w: Number(formData.w) });
    onClose();
    toast.success('Kilo kaydedildi! ⚖️');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Ağırlık (kg)</label>
        <input type="number" step="0.1" value={formData.w} onChange={e => setFormData({...formData, w: e.target.value})} placeholder="10.5" required autoFocus />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>Kaydet</button>
    </form>
  );
}

function ManageVaccineContent({ petId, onClose }) {
  const { addPetVaccine } = useStore();
  const [formData, setFormData] = useState({ n: '', last: new Date().toLocaleDateString('tr-TR'), ev: 60 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.n) return;
    addPetVaccine(petId, formData);
    onClose();
    toast.success('Aşı takvime eklendi! 💉');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Aşı Adı</label>
        <input type="text" value={formData.n} onChange={e => setFormData({...formData, n: e.target.value})} placeholder="Karma, Kuduz..." required />
      </div>
      <div className="form-group">
        <label>Periyot (Gün)</label>
        <input type="number" value={formData.ev} onChange={e => setFormData({...formData, ev: Number(e.target.value)})} required />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>Takvime Ekle</button>
    </form>
  );
}

function AddPetLogContent({ petId, onClose, editingLog }) {
  const { pet, setModuleData, updatePetLog } = useStore();
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
      setModuleData('pet', { ...pet, history: [newLog, ...(pet.history || [])] });
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
  const [date, setDate] = useState(new Date().toLocaleDateString('tr-TR'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await completePetVaccine(petId, vaccine.n, { place, amount, date });
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
      <button type="submit" className="submit-btn" style={{ background: '#10b981', color: 'white' }}>
        Aşıyı Onayla
      </button>
    </form>
  );
}
