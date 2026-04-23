import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  PawPrint, Calendar, ShieldCheck, 
  Info, Plus, Trash2, Heart, 
  Activity, Clock, ChevronRight, Scale, TrendingUp, ArrowLeft, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import './Pet.css';

export default function Pet() {
  const { pet, setModuleData, deletePetWeight, deletePetLog, deletePetVaccine } = useStore();
  const [activePet, setActivePet] = useState('waffle');
  const [showAddLog, setShowAddLog] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const { meta, vaccines, history, weights } = pet || { meta: {}, vaccines: {}, history: [], weights: {} };
  const currentPet = meta[activePet];
  const petVaccines = vaccines[activePet] || [];
  const petWeights = weights[activePet] || [];

  const getVaccineStatus = (v) => {
    const lastDate = new Date(v.last.split('.').reverse().join('-'));
    const nextDate = new Date(lastDate.getTime() + (v.ev * 864e5));
    const diff = Math.round((nextDate - new Date()) / 864e5);
    
    if (diff <= 0) return { label: 'GECİKMİŞ', color: 'var(--danger)', days: Math.abs(diff) };
    if (diff < 15) return { label: 'YAKINDA', color: 'var(--warn)', days: diff };
    return { label: 'İYİ', color: 'var(--success)', days: diff };
  };

  const updateVaccineDate = (vaccineName) => {
    const today = new Date().toLocaleDateString('tr-TR');
    const targetVaccine = petVaccines.find(v => v.n === vaccineName);
    const oldDate = targetVaccine?.last || '';

    const updatedVaccines = petVaccines.map(v => 
      v.n === vaccineName ? { ...v, last: today, h: [today, ...(v.h || [])] } : v
    );
    
    setModuleData('pet', {
      ...pet,
      vaccines: { ...vaccines, [activePet]: updatedVaccines },
      history: [
        { 
          id: Date.now(), 
          pet: activePet, 
          action: `${vaccineName} aşısı güncellendi.`, 
          dt: today, 
          type: 'vaccine',
          vaccineName,
          prevDate: oldDate
        },
        ...(history || [])
      ].slice(0, 50)
    });
    toast.success(`${vaccineName} aşısı güncellendi! 💉`);
  };

  const navigate = useNavigate();

  return (
    <AnimatedPage className="pet-container">
      <header className="module-header glass" style={{ background: 'var(--pet-header-grad, linear-gradient(135deg, #f59e0b, #d97706))' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🐾</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Pet</h1>
              <p>Waffle & Mayıs Bakım Günlüğü</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {Object.entries(meta).map(([id, p]) => (
            <button 
              key={id} 
              className={`tab-btn ${activePet === id ? 'active' : ''}`}
              onClick={() => setActivePet(id)}
            >
              <span style={{ fontSize: '16px', marginBottom: '2px' }}>{p.emoji}</span>
              <span>{p.name}</span>
              {activePet === id && <div className="tab-dot" />}
            </button>
          ))}
        </nav>
      </header>

      {currentPet && (
        <div className="pet-content animate-fadeIn">
          <div className="profile-hero glass" style={{ background: currentPet.grad }}>
            <div className="hero-emoji animate-pop">{currentPet.emoji}</div>
            <div className="hero-info">
              <h2>{currentPet.name}</h2>
              <p>{currentPet.breed} · {currentPet.gender}</p>
            </div>
            <div className="hero-badge">
              <Heart size={20} fill="white" />
            </div>
          </div>

          <div className="pet-grid mt-20">
            {/* Kimlik Bilgileri */}
            <div className="pet-card glass info-card">
              <div className="pc-header"><span style={{ fontSize: '14px' }}>📝</span> <span>KİMLİK BİLGİLERİ</span></div>
              <div className="pc-body">
                <div className="info-row"><span>Doğum:</span> <strong>{currentPet.birth}</strong></div>
                <div className="info-row"><span>Çip No:</span> <strong>{currentPet.chip}</strong></div>
                <div className="info-row"><span>Pasaport:</span> <strong>{currentPet.passport}</strong></div>
                <div className="info-row"><span>Renk:</span> <strong>{currentPet.color}</strong></div>
              </div>
            </div>

            {/* Aşı Takibi */}
            <div className="pet-card glass vaccine-card">
              <div className="pc-header">
                <span style={{ fontSize: '14px' }}>💉</span> <span>AŞI TAKİBİ</span>
                <button className="add-btn-mini" onClick={() => setShowAddVaccine(true)} title="Yeni Aşı Ekle"><Plus size={14} /></button>
              </div>
              <div className="pc-body">
                {petVaccines.map((v, i) => {
                  const st = getVaccineStatus(v);
                  return (
                    <div key={i} className="v-item-wrapper">
                      <div className="v-item" onClick={() => updateVaccineDate(v.n)} title="Aşıyı Bugün Yapıldı Olarak İşaretle">
                        <div className="v-main">
                          <strong>{v.n}</strong>
                          <small>Son: {v.last}</small>
                        </div>
                        <div className="v-status">
                          <span className="v-days" style={{ color: st.color }}>
                            {st.label === 'GECİKMİŞ' ? `${st.days} g. geçti` : `${st.days} gün kaldı`}
                          </span>
                          <div className="v-dot" style={{ backgroundColor: st.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kilo İstatistikleri */}
            <div className="pet-card glass weight-card">
              <div className="pc-header">
                <span style={{ fontSize: '14px' }}>⚖️</span> <span>KİLO TAKİBİ</span>
                <button className="add-btn-mini" onClick={() => setShowAddWeight(true)} title="Kilo Kaydet"><Plus size={14} /></button>
              </div>
              <div className="pc-body">
                <div className="current-weight">
                  <span className="w-val">{petWeights[0]?.w || '--'}</span>
                  <span className="w-unit">KG</span>
                  <div className="w-trend">
                    {petWeights.length > 1 && (
                      petWeights[0].w > petWeights[1].w ? 
                      <span className="up">📈 +{(petWeights[0].w - petWeights[1].w).toFixed(1)}</span> : 
                      <span className="down">📉 -{(petWeights[1].w - petWeights[0].w).toFixed(1)}</span>
                    )}
                  </div>
                </div>
                <div className="weight-history">
                  {petWeights.slice(0, 3).map((w, idx) => (
                    <div key={w.id} className="w-history-item">
                      <div className="wh-info">
                        <span className="wh-dt">{w.dt}</span>
                        <span className="wh-val">{w.w} kg</span>
                      </div>
                      {idx === 0 && (
                        <button className="del-btn-mini" onClick={() => { 
                          deletePetWeight(activePet, w.id);
                          toast.success('Kilo kaydı silindi');
                        }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="history-section mt-20">
            <div className="section-header">
              <h3>⌛ Sağlık & Bakım Günlüğü</h3>
              <div className="header-actions">
                <button className="add-btn-small money" onClick={() => setShowAddExpense(true)} title="Harcama Ekle"><Plus size={16} /> Harcama</button>
                <button className="add-btn-small" onClick={() => setShowAddLog(true)}><Plus size={16} /> Not</button>
              </div>
            </div>
            <div className="history-timeline">
              {(history || []).filter(h => h.pet === activePet).map((h, idx) => (
                <div key={h.id} className="history-item glass">
                  <div className={`h-icon-box ${h.type || 'info'}`}>
                    {h.type === 'vaccine' ? '💉' : 
                     h.type === 'weight' ? '⚖️' : '📝'}
                  </div>
                  <div className="h-content">
                    <p>{h.action}</p>
                    <span>{h.dt}</span>
                  </div>
                  {idx === 0 && (
                    <button className="del-btn-mini" onClick={() => { 
                      deletePetLog(h.id);
                      toast.success('Günlük kaydı silindi');
                    }}>
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
              {(history || []).filter(h => h.pet === activePet).length === 0 && (
                <div className="empty-state glass">
                  <Clock size={32} opacity={0.3} />
                  <p>Henüz işlem kaydı bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddLog && <AddPetLogModal petId={activePet} onClose={() => setShowAddLog(false)} />}
      {showAddVaccine && <AddVaccineModal petId={activePet} onClose={() => setShowAddVaccine(false)} />}
      {showAddWeight && <AddWeightModal petId={activePet} onClose={() => setShowAddWeight(false)} />}
      {showAddExpense && <AddPetExpenseModal petId={activePet} onClose={() => setShowAddExpense(false)} />}
    </AnimatedPage>
  );
}

function AddPetExpenseModal({ petId, onClose }) {
  const { addExpense, pet, meta } = useStore();
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>💸 {petName} Harcaması</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Harcama Başlığı</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="ör: Mama, Kum, Oyuncak..." required autoFocus />
          </div>
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0" required />
          </div>
          <div className="form-group">
            <label>Kim Ödedi?</label>
            <div className="payer-select">
              <button type="button" className={formData.payer === 'gorkem' ? 'active' : ''} onClick={() => setFormData({...formData, payer: 'gorkem'})}>Görkem</button>
              <button type="button" className={formData.payer === 'esra' ? 'active' : ''} onClick={() => setFormData({...formData, payer: 'esra'})}>Esra</button>
              <button type="button" className={formData.payer === 'ortak' ? 'active' : ''} onClick={() => setFormData({...formData, payer: 'ortak'})}>Ortak</button>
            </div>
          </div>
          <button type="submit" className="submit-btn pet-header-grad">Harcamayı Kaydet</button>
        </form>
      </div>
    </div>
  );
}

function AddWeightModal({ petId, onClose }) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>⚖️ Kilo Ölçümü</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ağırlık (kg)</label>
            <input type="number" step="0.1" value={formData.w} onChange={e => setFormData({...formData, w: e.target.value})} placeholder="ör: 10.5" required autoFocus />
          </div>
          <div className="form-group">
            <label>Tarih</label>
            <input type="text" value={formData.dt} onChange={e => setFormData({...formData, dt: e.target.value})} placeholder="DD.MM.YYYY" required />
          </div>
          <button type="submit" className="submit-btn pet-header-grad">Kaydet</button>
        </form>
      </div>
    </div>
  );
}

function ManageVaccineModal({ petId, onClose }) {
  const { pet, addPetVaccine, deletePetVaccine } = useStore();
  const [formData, setFormData] = useState({ n: '', last: new Date().toLocaleDateString('tr-TR'), ev: 60 });
  const petVaccines = pet.vaccines[petId] || [];

  const [deletingVaccine, setDeletingVaccine] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.n) return;
    addPetVaccine(petId, formData);
    setFormData({ n: '', last: new Date().toLocaleDateString('tr-TR'), ev: 60 });
    toast.success('Aşı takvime eklendi! 💉');
  };

  const handleDelete = (name) => {
    setDeletingVaccine(name);
  };

  const confirmDelete = () => {
    if (deletingVaccine) {
      deletePetVaccine(petId, deletingVaccine);
      toast.success(`${deletingVaccine} aşısı silindi.`);
      setDeletingVaccine(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <header className="modal-header">
          <h3>💉 Aşı Yönetim Merkezi</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
          
          {/* Mevcut Aşılar Listesi */}
          <div className="current-vaccines-list" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, marginBottom: '10px', display: 'block' }}>MEVCUT AŞI TAKVİMİ</label>
            {petVaccines.length === 0 ? (
              <p style={{ fontSize: '12px', opacity: 0.5, textAlign: 'center', padding: '20px' }}>Henüz kayıtlı aşı yok.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {petVaccines.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid var(--brd)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>{v.n}</span>
                      <small style={{ fontSize: '10px', opacity: 0.6 }}>Son: {v.last}</small>
                    </div>
                    <button 
                      onClick={() => handleDelete(v.n)}
                      style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: '1px', background: 'var(--brd)', opacity: 0.5 }} />

          {/* Yeni Aşı Ekleme Formu */}
          <form onSubmit={handleSubmit} className="modal-form">
            <label style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, marginBottom: '10px', display: 'block' }}>YENİ AŞI EKLE</label>
            <div className="form-group">
              <label>Aşı Adı</label>
              <input type="text" value={formData.n} onChange={e => setFormData({...formData, n: e.target.value})} placeholder="ör: Karma, Kuduz..." required />
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Son Tarih</label>
                <input type="text" value={formData.last} onChange={e => setFormData({...formData, last: e.target.value})} placeholder="DD.MM.YYYY" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Periyot (Gün)</label>
                <input type="number" value={formData.ev} onChange={e => setFormData({...formData, ev: Number(e.target.value)})} required />
              </div>
            </div>
            <button type="submit" className="submit-btn pet-header-grad" style={{ width: '100%', marginTop: '10px' }}>Takvime Ekle</button>
          </form>
        </div>

        {deletingVaccine && (
          <ConfirmModal 
            title="Aşıyı Sil"
            message={`${deletingVaccine} aşısını takvimden kaldırmak istediğine emin misin?`}
            onConfirm={confirmDelete}
            onCancel={() => setDeletingVaccine(null)}
          />
        )}
      </div>
    </div>
  );
}

function AddPetLogModal({ petId, onClose }) {
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

    setModuleData('pet', {
      ...pet,
      history: [newLog, ...(pet.history || [])]
    });
    
    onClose();
    toast.success('Günlük kaydedildi! 📝');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h3>📝 Günlüğe Ekle</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Neler Oldu?</label>
            <textarea 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="ör: Veteriner kontrolü yapıldı, vitamin verildi..."
              rows={3}
              autoFocus
            />
          </div>
          <button type="submit" className="submit-btn pet-header-grad">Kaydet</button>
        </form>
      </div>
    </div>
  );
}
