import React, { useState } from 'react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { 
  Lightbulb, Wrench, ShieldCheck, 
  CheckCircle2, Plus, Trash2, 
  AlertTriangle, DollarSign, Calendar
} from 'lucide-react';
import './Ev.css';

export default function Ev() {
  const { ev, setModuleData } = useStore();
  const [activeTab, setActiveTab] = useState(ev.tab || 'fatura');

  const updateTab = (tab) => {
    setActiveTab(tab);
    setModuleData('ev', { ...ev, tab });
  };

  const tabs = [
    { id: 'fatura', icon: <Lightbulb size={18} />, label: 'Fatura' },
    { id: 'bakim', icon: <Wrench size={18} />, label: 'Bakım' },
    { id: 'sigorta', icon: <ShieldCheck size={18} />, label: 'Sigorta' },
    { id: 'malVarligi', icon: <DollarSign size={18} />, label: 'Mal Varlığı' }
  ];

  return (
    <AnimatedPage className="ev-container">
      <div className="module-header ev-gradient">
        <div className="header-info">
          <h1>Eraylar Ev</h1>
          <p>Fatura · Bakım · Sigorta</p>
        </div>
        <div className="header-icon">🏠</div>
      </div>

      <div className="tab-nav glass">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => updateTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'fatura' && <FaturaTab ev={ev} />}
        {activeTab === 'bakim' && <BakimTab ev={ev} />}
        {activeTab === 'sigorta' && <SigortaTab ev={ev} />}
        {activeTab === 'malVarligi' && <MalVarligiTab ev={ev} />}
      </div>
    </AnimatedPage>
  );
}

function FaturaTab({ ev }) {
  const faturalar = ev.faturalar || [];
  const total = faturalar.reduce((sum, f) => sum + (f.tutar || 0), 0);
  const pending = faturalar.filter(f => !f.odendi).length;

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="summary-card glass ev-primary">
        <div className="s-header">
          <div className="s-label">Aylık Toplam</div>
          <div className="s-val">₺{total.toLocaleString('tr-TR')}</div>
        </div>
        <div className="s-stats">
          <span>✅ {faturalar.length - pending} Ödendi</span>
          <span className={pending > 0 ? 'alert' : ''}>⏳ {pending} Bekliyor</span>
        </div>
      </div>

      <button className="add-btn glass"><Plus size={18} /> Fatura Ekle</button>

      <div className="bill-list">
        {faturalar.length > 0 ? faturalar.map(f => (
          <div key={f.id} className="bill-item glass">
            <div className={`b-check ${f.odendi ? 'checked' : ''}`}>
              {f.odendi ? <CheckCircle2 size={20} /> : <div className="circle" />}
            </div>
            <div className="b-info">
              <strong>{f.ad}</strong>
              <span>{f.ay} · {f.kategori}</span>
            </div>
            <div className="b-amt">
              <strong>₺{f.tutar}</strong>
              <button className="del-btn-small"><Trash2 size={14} /></button>
            </div>
          </div>
        )) : (
          <div className="empty-state glass">
            <span className="big-emoji">💡</span>
            <p>Henüz fatura eklenmedi</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BakimTab({ ev }) {
  const bakim = ev.bakim || [];
  const active = bakim.filter(b => !b.tamamlandi);

  return (
    <div className="tab-pane animate-fadeIn">
      <button className="add-btn glass"><Plus size={18} /> Bakım/İş Ekle</button>
      
      <div className="maintenance-list">
        {active.length > 0 ? active.map(b => (
          <div key={b.id} className={`maintenance-card glass priority-${b.oncelik}`}>
            <div className="m-main">
              <div className="m-header">
                <strong>{b.ad}</strong>
                <span className="p-badge">{b.oncelik}</span>
              </div>
              {b.notlar && <p className="m-notes">{b.notlar}</p>}
              <div className="m-date">📅 {b.tarih}</div>
            </div>
            <div className="m-actions">
              <button className="done-btn">Bitti</button>
              <button className="del-btn-small"><Trash2 size={14} /></button>
            </div>
          </div>
        )) : (
          <div className="empty-state glass">
            <span className="big-emoji">🔧</span>
            <p>Bekleyen bakım yok 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SigortaTab({ ev }) {
  const sigorta = ev.sigortalar || [];
  return (
    <div className="tab-pane animate-fadeIn">
      <button className="add-btn glass"><Plus size={18} /> Sigorta Ekle</button>
      
      <div className="insurance-list">
        {sigorta.length > 0 ? sigorta.map(s => (
          <div key={s.id} className="insurance-card glass">
            <div className="i-main">
              <strong>🛡️ {s.ad}</strong>
              <span className="i-company">{s.sirket}</span>
              <div className="i-dates">
                <span>Baş: {s.bas}</span>
                <span className="alert">Bitiş: {s.bitis}</span>
              </div>
            </div>
            <button className="del-btn-small"><Trash2 size={14} /></button>
          </div>
        )) : (
          <div className="empty-state glass">
            <span className="big-emoji">🛡️</span>
            <p>Henüz sigorta eklenmedi</p>
          </div>
        )}
      </div>
    </div>
  );
}
function MalVarligiTab({ ev }) {
  const assets = ev.malVarligi || [];

  return (
    <div className="tab-pane animate-fadeIn">
      <div className="section-header">
        <h3>🏙️ Taşınmaz Listesi ({assets.length})</h3>
        <button className="add-btn-small"><Plus size={16} /></button>
      </div>

      <div className="assets-grid">
        {assets.map(a => (
          <div key={a.id} className="asset-card glass">
            <div className="a-header">
              <span className="a-emoji">{a.emoji}</span>
              <div className="a-title">
                <strong>{a.ad}</strong>
                <span>{a.il} / {a.ilce}</span>
              </div>
            </div>
            <div className="a-details">
              <div className="ad-row"><span>Mahalle:</span> <strong>{a.mahalle}</strong></div>
              <div className="ad-row"><span>Ada/Parsel:</span> <strong>{a.adaParsel}</strong></div>
              <div className="ad-row"><span>Tip:</span> <strong>{a.tip}</strong></div>
              <div className="ad-row"><span>Nitelik:</span> <strong>{a.nitelik}</strong></div>
              {a.bbNo && <div className="ad-row"><span>BB No:</span> <strong>{a.bbNo}</strong></div>}
            </div>
            <div className="a-footer">
              <div className="a-value">
                <small>Tahmini Değer</small>
                <strong>₺{a.deger.toLocaleString('tr-TR')}</strong>
              </div>
              <button className="edit-btn-mini"><Plus size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
