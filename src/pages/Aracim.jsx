import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Car, Fuel, Wrench, History, 
  Plus, Gauge, ArrowUpRight, 
  Settings, Info, TrendingDown, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Aracim.css';

export default function Aracim() {
  const { aracim, updateAracKm, addAracMaintenance, addAracLog, addExpense, setModuleData } = useStore();
  const [modal, setModal] = useState(null);
  const [tempKm, setTempKm] = useState(aracim?.km || 0);
  const [expenseModal, setExpenseModal] = useState(null);

  const { km, yakitlar, bakim, hs, ev, plaka, model } = aracim || { 
    km: 0, yakitlar: [], bakim: [], hs: [], ev: [], plaka: '', model: '' 
  };

  const getStatus = (item) => {
    if (item.tp === 'km') {
      const left = item.kmL || 0;
      if (left <= 0) return { label: 'GECİKMİŞ', color: 'var(--danger)', txt: `${Math.abs(left)} km geçti!` };
      if (left < 1000) return { label: 'YAKINDA', color: 'var(--warn)', txt: `${left} km kaldı` };
      return { label: 'İYİ', color: 'var(--success)', txt: `${left} km kaldı` };
    } else {
      const diff = Math.round((new Date(item.dt) - new Date()) / 864e5);
      if (diff < 0) return { label: 'GECİKMİŞ', color: 'var(--danger)', txt: `${Math.abs(diff)} gün geçti!` };
      if (diff < 30) return { label: 'YAKINDA', color: 'var(--warn)', txt: `${diff} gün kaldı` };
      return { label: 'İYİ', color: 'var(--success)', txt: `${diff} gün kaldı` };
    }
  };

  const navigate = useNavigate();

  return (
    <AnimatedPage className="aracim-container">
      <header className="module-header glass" style={{ background: 'var(--aracim-header-grad, linear-gradient(135deg, #3b82f6, #60a5fa))' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🚗</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="car-badge" style={{ padding: '2px 8px', fontSize: '10px' }}>{plaka || '34 GNK 437'}</div>
              <h1>{model || 'Toyota C-HR'}</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
           <button className="tab-btn active">
             <span style={{ fontSize: '16px', marginBottom: '2px' }}>🏎️</span>
             <span>Genel Bakış</span>
             <div className="tab-dot" />
           </button>
           <button className="tab-btn" onClick={() => setModal('history')}>
             <span style={{ fontSize: '16px', marginBottom: '2px' }}>📋</span>
             <span>Geçmiş</span>
           </button>
        </nav>
      </header>

      <div className="km-hero glass" onClick={() => { setTempKm(km); setModal('km'); }}>
        <div className="kh-label">GÜNCEL KİLOMETRE</div>
        <div className="kh-value">
          <Gauge size={32} />
          <span>{km?.toLocaleString('tr-TR')}</span>
          <small>KM</small>
        </div>
        <div className="kh-footer">Güncellemek için dokun <ArrowUpRight size={14} /></div>
      </div>

      <div className="maintenance-timeline">
        <div className="section-header">
          <h3>📅 Yaklaşan İşlemler</h3>
          <span className="badge">{ev.length} İşlem</span>
        </div>
        <div className="ev-list">
          {ev.map(item => {
            const st = getStatus(item);
            return (
              <div key={item.id} className="ev-card glass" style={{ borderLeft: `4px solid ${st.color}` }}>
                <div className="ev-icon">{item.ic || '🔧'}</div>
                <div className="ev-info">
                  <strong>{item.nm}</strong>
                  <span style={{ color: st.color }}>{st.txt}</span>
                </div>
                <div className="ev-status">
                  <span className="st-badge" style={{ backgroundColor: st.color }}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-grid mt-20">
        <button className="action-btn-large glass" onClick={() => setExpenseModal('Benzin')}>
          <div className="ab-icon"><Fuel size={24} /></div>
          <span>Benzin Al</span>
        </button>
        <button className="action-btn-large glass" onClick={() => setModal('bakim')}>
          <div className="ab-icon"><Wrench size={24} /></div>
          <span>Bakım Kaydı</span>
        </button>
      </div>

      <div className="quick-expenses mt-20">
        <div className="section-header">
          <h3>💸 Hızlı Harcama</h3>
        </div>
        <div className="quick-expense-grid">
          {['Otopark', 'Ceza', 'Yıkama', 'Sigorta', 'Diğer'].map(type => (
            <button key={type} className="qe-btn glass" onClick={() => setExpenseModal(type)}>
              {type === 'Otopark' && '🅿️'}
              {type === 'Ceza' && '📑'}
              {type === 'Yıkama' && '🧼'}
              {type === 'Sigorta' && '🛡️'}
              {type === 'Diğer' && '📋'}
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="muayene-card glass mt-20">
        <div className="pc-header">
          <Info size={16} /> <span>TESCİL & MUAYENE</span>
        </div>
        <div className="muayene-body">
          <div className="m-main">
            <div className="m-left">
              <strong>{new Date(aracim.muayene?.next || '2026-07-24').toLocaleDateString('tr-TR')}</strong>
              <span>Sonraki Muayene</span>
            </div>
            <div className="m-right">
              <span className="m-days-badge bp">
                {Math.round((new Date(aracim.muayene?.next || '2026-07-24') - new Date()) / 864e5)} Gün Kaldı
              </span>
            </div>
          </div>
          <div className="m-details">
            <div className="md-row"><span>Son Muayene:</span> <span>{new Date(aracim.muayene?.last || '2024-07-24').toLocaleDateString('tr-TR')}</span></div>
            <div className="md-row"><span>Sonuç:</span> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{aracim.muayene?.result}</span></div>
            <div className="md-row"><span>Rapor No:</span> <span>{aracim.muayene?.report}</span></div>
          </div>
        </div>
      </div>

      <div className="logs-section mt-20">
        <div className="section-header">
          <h3>📋 İşlem Geçmişi</h3>
          <button className="text-btn" onClick={() => setModal('history')}>Tümünü Gör</button>
        </div>
        <div className="log-list">
          {hs.slice(0, 3).map(h => (
            <div key={h.id} className="log-item glass">
              <div className="l-icon maintenance"><Wrench size={16} /></div>
              <div className="l-info">
                <strong>{h.tp}</strong>
                <span>{new Date(h.dt).toLocaleDateString('tr-TR')} · {h.km?.toLocaleString('tr-TR')} KM</span>
              </div>
              <div className="l-amt">₺{h.co || 0}</div>
            </div>
          ))}
          {yakitlar.slice(0, 3).map(y => (
            <div key={y.id} className="log-item glass">
              <div className="l-icon fuel"><Fuel size={16} /></div>
              <div className="l-info">
                <strong>Yakıt Alımı</strong>
                <span>{new Date(y.tarih || y.dt).toLocaleDateString('tr-TR')} · {y.litre}L</span>
              </div>
              <div className="l-amt">₺{y.tutar}</div>
            </div>
          ))}
          {hs.length === 0 && yakitlar.length === 0 && (
            <div className="empty-state glass">Henüz kayıt yok.</div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {modal === 'km' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
            <h3>🔢 KM Güncelle</h3>
            <div className="form-group mt-10">
              <label>Yeni Kilometre</label>
              <input 
                type="number" 
                value={tempKm} 
                onChange={e => setTempKm(Number(e.target.value))}
                autoFocus
              />
            </div>
            <div className="modal-actions mt-20">
              <button className="btn bg" onClick={() => setModal(null)}>İptal</button>
              <button className="btn bp" onClick={() => { updateAracKm(tempKm); setModal(null); toast.success('KM Güncellendi'); }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'yakit' && <AddYakitModal onClose={() => setModal(null)} />}
      {modal === 'bakim' && <AddBakimModal onClose={() => setModal(null)} />}
      {expenseModal && <AddQuickExpenseModal type={expenseModal} onClose={() => setExpenseModal(null)} />}
    </AnimatedPage>
  );
}

function AddQuickExpenseModal({ type, onClose }) {
  const { addExpense, aracim, addAracLog } = useStore();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({
      title: `${type} (${aracim.plaka})`,
      amount: Number(amount),
      category: 'Araç Gideri',
      payer: 'ortak',
      note: note
    });
    
    // Log it to car history too
    addAracLog({
      id: Date.now(),
      tp: type,
      ds: note || type,
      co: Number(amount),
      dt: new Date().toISOString().split('T')[0],
      km: aracim.km
    });

    onClose();
    toast.success(`${type} harcaması kaydedildi!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🚗 {type} Harcaması</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required autoFocus />
          </div>
          <div className="form-group">
            <label>Not (Opsiyonel)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Açıklama..." />
          </div>
          <div className="modal-actions mt-20">
            <button type="button" className="btn bg" onClick={onClose}>İptal</button>
            <button type="submit" className="btn bp">Harcamayı Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddYakitModal({ onClose }) {
  const { aracim, addAracLog, addExpense } = useStore();
  const [formData, setFormData] = useState({
    tp: 'yakit', litre: '', tutar: '', km: aracim.km, dt: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAracLog(formData);
    addExpense({
      title: `${formData.litre}L Yakıt (${aracim.plaka})`,
      amount: formData.tutar,
      category: 'arac',
      payer: 'ortak'
    });
    onClose();
    toast.success('Yakıt kaydı eklendi');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>⛽ Yakıt Alımı</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-row">
            <div className="form-group">
              <label>Litre</label>
              <input type="number" step="0.01" value={formData.litre} onChange={e => setFormData({...formData, litre: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Tutar (₺)</label>
              <input type="number" value={formData.tutar} onChange={e => setFormData({...formData, tutar: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Güncel KM</label>
            <input type="number" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} required />
          </div>
          <div className="modal-actions mt-20">
            <button type="button" className="btn bg" onClick={onClose}>İptal</button>
            <button type="submit" className="btn bp">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddBakimModal({ onClose }) {
  const { aracim, addAracMaintenance, addExpense } = useStore();
  const [formData, setFormData] = useState({
    tp: '', ds: '', co: '', km: aracim.km, dt: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addAracMaintenance(formData);
    addExpense({
      title: `${formData.tp} (${aracim.plaka})`,
      amount: formData.co,
      category: 'arac',
      payer: 'ortak'
    });
    onClose();
    toast.success('Bakım kaydı eklendi');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <h3>🔧 Bakım Kaydı</h3>
        <form onSubmit={handleSubmit} className="modal-form mt-10">
          <div className="form-group">
            <label>İşlem Türü</label>
            <input type="text" placeholder="Yağ Değişimi, Lastik vb." value={formData.tp} onChange={e => setFormData({...formData, tp: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Açıklama</label>
            <input type="text" value={formData.ds} onChange={e => setFormData({...formData, ds: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>KM</label>
              <input type="number" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Maliyet (₺)</label>
              <input type="number" value={formData.co} onChange={e => setFormData({...formData, co: e.target.value})} />
            </div>
          </div>
          <div className="modal-actions mt-20">
            <button type="button" className="btn bg" onClick={onClose}>İptal</button>
            <button type="submit" className="btn bp">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
