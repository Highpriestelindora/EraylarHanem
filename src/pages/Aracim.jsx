import React, { useState, useMemo } from 'react';
import { 
  Car, Fuel, Wrench, History, Plus, Gauge, ArrowUpRight, 
  Shield, Landmark, AlertCircle, Sparkles, Home, Camera,
  MapPin, Phone, FileText, Settings, ArrowLeft, MoreVertical,
  ChevronRight, Droplets, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { INITIAL_VEHICLE } from '../constants/data';
import './Aracim.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Aracim() {
  const [activeTab, setActiveTab] = useState('panel');
  const navigate = useNavigate();
  const { aracim, updateKM, addFuelLog, addServiceRecord } = useStore();
  
  const [showAddFuel, setShowAddFuel] = useState(false);
  const [showUpdateKM, setShowUpdateKM] = useState(false);
  const [tempKM, setTempKM] = useState(aracim?.km || 0);

  const { 
    km, parts, fuelLogs, services, documents, 
    lastCleaned, parkLocation, tireStatus 
  } = aracim || { km: 0, parts: [], fuelLogs: [], services: [], documents: [] };

  // AI Insights
  const aiNote = useMemo(() => {
    const lastFuel = fuelLogs[0];
    if (lastFuel?.consumption > 8.5) return "Son yakıt alımında tüketim normalin biraz üzerinde. Şehir içi trafik mi? 🤔";
    return "Tiguan formunda! Yakıt verimliliği harika seviyelerde. 🌟";
  }, [fuelLogs]);

  const tabs = [
    { id: 'panel', label: 'Panel', emoji: '🏎️' },
    { id: 'servis', label: 'Servis', emoji: '🛠️' },
    { id: 'torpido', label: 'Torpido', emoji: '📂' },
    { id: 'analiz', label: 'Analiz', emoji: '📊' }
  ];

  return (
    <AnimatedPage className="aracim-container">
      <header className="module-header glass" style={{ background: 'var(--aracim)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">🚗</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="plaka-badge" style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', width: 'fit-content', marginBottom: '2px' }}>
                {INITIAL_VEHICLE.plaka}
              </div>
              <h1>{INITIAL_VEHICLE.model.replace('Volkswagen ', '')}</h1>
            </div>
          </div>
          <div className="header-actions">
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

      <div className="aracim-scroll-content">
        {/* AI Note */}
        <div className="ai-insight-card glass animate-fadeIn">
          <Sparkles size={18} className="sparkle-icon" />
          <p>{aiNote}</p>
        </div>

        {activeTab === 'panel' && (
          <div className="panel-view animate-fadeIn">
            {/* KM Widget */}
            <div className="km-widget-premium glass" onClick={() => setShowUpdateKM(true)}>
              <div className="kmw-main">
                <Gauge size={40} className="kmw-icon" />
                <div className="kmw-text">
                  <small>GÜNCEL KİLOMETRE</small>
                  <h2>{km?.toLocaleString('tr-TR')} <span>KM</span></h2>
                </div>
              </div>
              <ArrowUpRight size={20} className="kmw-arrow" />
            </div>

            {/* Analog-Style Gauges Grid */}
            <div className="gauges-grid mt-24">
              {parts.map(part => {
                const used = km - part.lastKM;
                const perc = Math.min(100, (used / part.intervalKM) * 100);
                const color = perc > 85 ? '#f87171' : perc > 60 ? '#f59e0b' : '#10b981';
                
                return (
                  <div key={part.id} className="gauge-card glass">
                    <div className="gauge-box">
                       <svg viewBox="0 0 36 36" className="circular-chart">
                         <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                         <path className="circle" stroke={color} strokeDasharray={`${perc}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                         <text x="18" y="20.35" className="percentage">%{Math.round(perc)}</text>
                       </svg>
                       <div className="gauge-icon-inner">{part.icon}</div>
                    </div>
                    <div className="gauge-info">
                      <strong>{part.name}</strong>
                      <small>{part.intervalKM - used} KM kaldı</small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="arac-quick-actions mt-24">
              <button className="aq-card glass" onClick={() => setShowAddFuel(true)}>
                <div className="aq-icon fuel"><Fuel size={24} /></div>
                <span>Yakıt Al</span>
              </button>
              <button className="aq-card glass">
                <div className="aq-icon clean"><Droplets size={24} /></div>
                <span>Yıkama</span>
              </button>
              <button className="aq-card glass">
                <div className="aq-icon park"><MapPin size={24} /></div>
                <span>Park Yeri</span>
              </button>
            </div>

            {/* Emergency Support */}
            <div className="emergency-support mt-24 glass">
               <div className="es-header">
                 <AlertCircle size={18} color="#f87171" />
                 <span>ACİL DESTEK</span>
               </div>
               <div className="es-buttons">
                 <button className="es-btn"><Phone size={14} /> Yol Yardım</button>
                 <button className="es-btn"><Shield size={14} /> Sigorta</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'servis' && (
          <div className="servis-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🛠️ Servis Defteri</h3>
              <button className="add-btn-mini"><Plus size={14} /></button>
            </div>
            <div className="service-timeline-premium">
              {services.map(s => (
                <div key={s.id} className="s-timeline-item glass">
                  <div className="sti-date">
                    <span>{new Date(s.date).getDate()}</span>
                    <small>{new Date(s.date).toLocaleString('tr-TR', { month: 'short' })}</small>
                  </div>
                  <div className="sti-content">
                    <div className="sti-main">
                      <strong>{s.title}</strong>
                      <small>{s.km.toLocaleString()} KM · {s.shop}</small>
                    </div>
                    <div className="sti-cost">{formatMoney(s.cost)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'torpido' && (
          <div className="glovebox-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>📂 Dijital Torpido</h3>
            </div>
            <div className="docs-list">
              {documents.map(doc => {
                const diff = Math.round((new Date(doc.dueDate) - new Date()) / 864e5);
                return (
                  <div key={doc.id} className="doc-card-premium glass">
                    <div className="dcp-left">
                      <div className="dcp-icon">{doc.icon}</div>
                      <div className="dcp-info">
                        <strong>{doc.name}</strong>
                        <small>Bitiş: {new Date(doc.dueDate).toLocaleDateString('tr-TR')}</small>
                      </div>
                    </div>
                    <div className={`dcp-status ${diff < 15 ? 'warn' : 'ok'}`}>
                      {diff} Gün
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analiz' && (
          <div className="analysis-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>📊 Yakıt Verimliliği</h3>
              <small>L/100km</small>
            </div>
            <div className="fuel-chart-box glass">
              <Line 
                data={{
                  labels: fuelLogs.map(l => new Date(l.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })),
                  datasets: [{
                    label: 'Tüketim',
                    data: fuelLogs.map(l => l.consumption),
                    borderColor: '#f87171',
                    tension: 0.4,
                    fill: false
                  }]
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: false } }
                }}
              />
            </div>

            <div className="fuel-history-list mt-24">
               <div className="section-header-v2">
                <h3>⛽ Yakıt Geçmişi</h3>
              </div>
              {fuelLogs.map(l => (
                <div key={l.id} className="fuel-item-premium glass">
                  <div className="fip-left">
                    <div className="fip-station">{l.station}</div>
                    <small>{l.date} · {l.km.toLocaleString()} KM</small>
                  </div>
                  <div className="fip-right">
                    <div className="fip-cons">{l.consumption} L</div>
                    <div className="fip-cost">{formatMoney(l.amount * l.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUpdateKM && (
        <KMUpdateModal 
          currentKM={km} 
          onClose={() => setShowUpdateKM(false)} 
          onSave={updateKM} 
        />
      )}

      {showAddFuel && (
        <FuelLogModal 
          onClose={() => setShowAddFuel(false)} 
          onSave={addFuelLog} 
          currentKM={km}
        />
      )}

    </AnimatedPage>
  );
}

function KMUpdateModal({ currentKM, onClose, onSave }) {
  const [val, setVal] = useState(currentKM);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Gauge size={24} color="#7c3aed" />
          <h3>KM Güncelle</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Güncel Kilometre</label>
            <input 
              type="number" 
              value={val} 
              onChange={e => setVal(Number(e.target.value))} 
              autoFocus 
              className="premium-input"
            />
          </div>
          <button className="submit-btn-premium" onClick={() => { onSave(val); onClose(); toast.success('Kilometre güncellendi 🏎️'); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function FuelLogModal({ onClose, onSave, currentKM }) {
  const [form, setForm] = useState({ km: currentKM, amount: '', price: '42.5', station: 'Shell', date: new Date().toISOString().split('T')[0] });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-pop" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Fuel size={24} color="#f87171" />
          <h3>Yakıt Girişi</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-grid-v2">
             <div className="form-group-v2">
               <label>KM</label>
               <input type="number" value={form.km} onChange={e => setForm({...form, km: Number(e.target.value)})} className="premium-input" />
             </div>
             <div className="form-group-v2">
               <label>Litre</label>
               <input type="number" value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="premium-input" />
             </div>
          </div>
          <div className="form-group-v2 mt-12">
            <label>İstasyon</label>
            <select value={form.station} onChange={e => setForm({...form, station: e.target.value})} className="premium-select">
              <option value="Shell">Shell</option>
              <option value="Opet">Opet</option>
              <option value="BP">BP</option>
              <option value="Petrol Ofisi">Petrol Ofisi</option>
            </select>
          </div>
          <button className="submit-btn-premium red mt-20" onClick={() => { onSave(form); onClose(); toast.success('Yakıt kaydı ve masraf eklendi ⛽'); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}
