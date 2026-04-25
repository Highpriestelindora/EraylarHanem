import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Plus, Trash2, Heart, 
  Activity, Scale, ArrowLeft, Camera, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ActionSheet from '../components/ActionSheet';
import ConfirmModal from '../components/ConfirmModal';
import './Pet.css';

export default function Pet() {
  const { pet, setModuleData, deletePetLog, deletePetVaccine, addPetVaccine, addPetWeight } = useStore();
  const [activePet, setActivePet] = useState('waffle');
  const [showAddLog, setShowAddLog] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { meta, vaccines, history, weights } = pet || { meta: {}, vaccines: {}, history: [], weights: {} };
  const currentPet = meta[activePet];
  const petVaccines = vaccines[activePet] || [];
  const petWeights = weights[activePet] || [];
  const navigate = useNavigate();

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
    toast.success(`${type === 'mama' ? 'Mama' : 'Kum'} durumu güncellendi!`);
  };

  const addPetPhoto = (pId, url) => {
    const updatedGallery = { 
      ...pet.gallery, 
      [pId]: [url, ...(pet.gallery?.[pId] || [])].slice(0, 10) 
    };
    setModuleData('pet', { ...pet, gallery: updatedGallery });
    toast.success('Fotoğraf eklendi! 📸');
  };

  if (!currentPet) return <div className="p-20">Pet datası yüklenemedi...</div>;

  return (
    <AnimatedPage className="pet-container">
      <header className="module-header glass pet-honey-grad">
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">{currentPet.emoji}</span>
            <div className="header-text-box">
              <h1>{currentPet.name} Assistant</h1>
              <p>Pati & Sağlık Takip</p>
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

        {/* Pati Albümü */}
        <section className="pet-section">
          <div className="ps-header">
            <h3>📸 Pati Albümü</h3>
            <button className="add-btn-mini" onClick={() => addPetPhoto(activePet, 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400')}><Plus size={14} /></button>
          </div>
          <div className="photo-gallery-horizontal">
            {pet.gallery?.[activePet]?.length > 0 ? (
              pet.gallery[activePet].map((url, i) => (
                <div key={i} className="gallery-item glass animate-pop">
                  <img src={url} alt="Pet" />
                </div>
              ))
            ) : (
              <div className="gallery-empty glass">
                <span>📷</span>
                <p>Henüz fotoğraf eklenmedi.</p>
              </div>
            )}
          </div>
        </section>

        {/* Health Stats Grid */}
        <div className="health-stats-grid mt-20">
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
                    <div className="vr-badge" style={{ background: st.color + '20', color: st.color, fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '8px' }}>
                      {st.label === 'GECİKMİŞ' ? '!' : st.days + ' g.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
            </div>
          </div>
        </div>

        {/* Günlük & Geçmiş */}
        <section className="pet-section mt-24">
          <div className="ps-header">
            <h3>⌛ Sağlık & Bakım Günlüğü</h3>
            <div className="ps-actions">
              <button className="ps-btn finance" onClick={() => setShowAddExpense(true)}><Heart size={14} /> Harcama</button>
              <button className="ps-btn" onClick={() => setShowAddLog(true)}><Plus size={14} /> Not</button>
            </div>
          </div>
          <div className="history-timeline-premium">
            {(history || []).filter(h => h.pet === activePet).map((h) => (
              <div key={h.id} className="history-card-v2 glass">
                <div className="hc-icon">📝</div>
                <div className="hc-info">
                  <p>{h.action}</p>
                  <span className="hc-time">{h.dt}</span>
                </div>
                <button className="hc-del" onClick={() => deletePetLog(h.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ActionSheet isOpen={showAddLog} onClose={() => setShowAddLog(false)} title="📝 Günlüğe Ekle">
        <AddPetLogContent petId={activePet} onClose={() => setShowAddLog(false)} />
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

function AddPetLogContent({ petId, onClose }) {
  const { pet, setModuleData } = useStore();
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note) return;
    const newLog = {
      id: Date.now(),
      pet: petId,
      action: note,
      dt: new Date().toLocaleDateString('tr-TR'),
      type: 'manual'
    };
    setModuleData('pet', { ...pet, history: [newLog, ...(pet.history || [])] });
    onClose();
    toast.success('Günlük kaydedildi! 📝');
  };

  return (
    <form className="modal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Neler Oldu?</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Veteriner kontrolü..." rows={4} autoFocus />
      </div>
      <button type="submit" className="submit-btn" style={{ background: '#d97706', color: 'white' }}>Kaydet</button>
    </form>
  );
}
