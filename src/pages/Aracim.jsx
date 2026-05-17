import React, { useState, useMemo } from 'react';
import { 
  Car, Fuel, Wrench, History as HistoryIcon, Plus, Gauge, ArrowUpRight, 
  Shield, Landmark, AlertCircle, Sparkles, Home, Camera,
  MapPin, Phone, FileText, Settings, ArrowLeft, MoreVertical,
  ChevronRight, Droplets, Trash2, Check, Warehouse, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import ActionSheet from '../components/ActionSheet';
import PaymentSelector from '../components/PaymentSelector';
import './Aracim.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const formatMoney = (val) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);

export default function Aracim() {
  const [activeTab, setActiveTab] = useState('panel');
  const navigate = useNavigate();
  const { 
    garaj, selectedVehicleId, setModuleData, 
    updateKM, addFuelLog, addServiceRecord,
    addVehicle, updateVehicle, deleteVehicle,
    addWashRecord, startParking, finishParking,
    deleteServiceRecord, deleteDocument, addDocument, updateDocument,
    updatePartMaintenance, deleteFuelLog, updateSupportContacts, updateFuelLog
  } = useStore();
  
  const vehicle = useMemo(() => 
    garaj.find(v => v.id === selectedVehicleId) || garaj[0], 
    [garaj, selectedVehicleId]
  );

  const [showAddFuel, setShowAddFuel] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState(null);
  const [showUpdateKM, setShowUpdateKM] = useState(false);
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showWashModal, setShowWashModal] = useState(false);
  const [showParkModal, setShowParkModal] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPartModal, setShowPartForm] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [activeDocAction, setActiveDocAction] = useState(null); // The doc for ActionSheet
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });

  const requestConfirm = (message, onConfirm) => {
    setShowConfirm({ open: true, message, onConfirm });
  };

  const { 
    km, parts, fuelLogs, services, documents, 
    lastCleaned, parkLocation, tireStatus 
  } = vehicle || { km: 0, parts: [], fuelLogs: [], services: [], documents: [] };

  const logsWithConsumption = useMemo(() => {
    const sorted = [...fuelLogs].sort((a, b) => (a.km || 0) - (b.km || 0));
    return sorted.map((log, index) => {
      let consumption = 0;
      if (index > 0) {
        const prevLog = sorted[index - 1];
        const kmDiff = (log.km || 0) - (prevLog.km || 0);
        const amount = Number(log.amount || log.litre || 0);
        if (kmDiff > 0 && amount > 0) {
          consumption = Number(((amount / kmDiff) * 100).toFixed(2));
        }
      }
      return {
        ...log,
        consumption: consumption > 0 ? consumption : null
      };
    });
  }, [fuelLogs]);

  // AI Insights - Dolmuşçu Manileri Edition
  const aiNote = useMemo(() => {
    const maniler = [
      "Aşıksan vur saza, şoförsen bas gaza! {model} yollara hazır. 🏎️",
      "Rampaların ustasıyım, {model}'ın hastasıyım! 🌟",
      "Sollama beni, sollarım seni; {model} affetmez! 🔥",
      "Kuzu kurdun, yollar {model}'ın! Maşallah. 🧿",
      "Dualarımızla yaşıyor, mazotuyla koşuyor! ⛽",
      "Gaz, fren, şanzıman; {model} ile halimiz duman! 💨",
      "Miras değil, alın teri! {model} tıkır tıkır işliyor. 💪",
      "Dünya bir pencere, {model} ile her gün başka bir manzara. 🛣️",
      "Gönlünde yer yoksa güzelim, fark etmez ben ayakta da giderim! 🚌",
      "Yaklaşma toz olursun, geçme pişman olursun! 🌪️"
    ];
    
    // Basit bir hash fonksiyonu ile araca özel ama sabit olmayan bir mani seçelim
    const seed = fuelLogs.length + (km % 10);
    return maniler[seed % maniler.length].replace('{model}', vehicle.model);
  }, [fuelLogs, vehicle.model, km]);

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
          <div className="header-title" onClick={() => setShowGarageModal(true)} style={{ cursor: 'pointer' }}>
            <span className="header-emoji animate-float">
              <Warehouse size={28} color="white" />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="plaka-badge" style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', width: 'fit-content', marginBottom: '2px' }}>
                Eraylar Garajım
              </div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {vehicle.model}
                <Settings size={14} className="opacity-50" onClick={(e) => {
                  e.stopPropagation();
                  setEditingVehicle(vehicle);
                  setShowVehicleForm(true);
                }} />
              </h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowGarageModal(true)} title="Garaj">
              <HistoryIcon size={20} />
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

      <div className="aracim-scroll-content">
        {/* AI Note */}
        <div className="ai-insight-card glass animate-fadeIn">
          <Sparkles size={18} className="sparkle-icon" />
          <p>{aiNote}</p>
        </div>

        {activeTab === 'panel' && (
          <div className="panel-view animate-fadeIn">
            {/* KM Widget */}
            <div className="km-widget-premium glass" onClick={() => setShowUpdateKM(true)} style={{ marginTop: '0', padding: '16px 20px' }}>
              <div className="kmw-main">
                <Gauge size={32} className="kmw-icon" />
                <div className="kmw-text">
                  <small>GÜNCEL KİLOMETRE</small>
                  <h2 style={{ fontSize: '24px' }}>{km?.toLocaleString('tr-TR')} <span>KM</span></h2>
                </div>
              </div>
              <ArrowUpRight size={18} className="kmw-arrow" />
            </div>

            {/* Analog-Style Gauges Grid */}
            <div className="gauges-grid mt-24">
              {parts.map(part => {
                const used = km - part.lastKM;
                const perc = Math.min(100, (used / part.intervalKM) * 100);
                const color = perc > 85 ? '#f87171' : perc > 60 ? '#f59e0b' : '#10b981';
                
                return (
                  <div key={part.id} className="gauge-card glass animate-fadeIn" onClick={() => { setSelectedPart(part); setShowPartForm(true); }} style={{ cursor: 'pointer' }}>
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
              <button className="aq-card" onClick={() => setShowAddFuel(true)}>
                <div className="aq-icon fuel"><Fuel size={24} /></div>
                <span>Yakıt Al</span>
              </button>
              <button className="aq-card" onClick={() => setShowWashModal(true)}>
                <div className="aq-icon clean"><Droplets size={24} /></div>
                <span>Yıkama</span>
              </button>
              <button className="aq-card" onClick={() => setShowParkModal(true)}>
                <div className="aq-icon park">
                  <MapPin size={24} className={parkLocation?.active ? 'animate-park-pulse' : ''} />
                </div>
                <span>{parkLocation?.active ? 'Park Yeri (Aktif)' : 'Park Yeri'}</span>
              </button>
            </div>

            {/* Emergency Support */}
            <div className="emergency-support">
              <div className="es-header" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} color="#b91c1c" />
                  <span style={{ fontSize: '10px', fontWeight: '900' }}>ACİL DESTEK HATTI</span>
                </div>
                <button 
                  className="icon-btn-small" 
                  onClick={() => setShowSupportModal(true)}
                  style={{ 
                    padding: '12px', 
                    margin: '-8px -8px -8px 0',
                    background: 'transparent', 
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={18} color="#fca5a5" />
                </button>
              </div>
              <div className="es-buttons" style={{ gap: '8px' }}>
                <a href={`tel:${vehicle.supportContacts?.yolYardim?.phone || '08503999999'}`} className="es-btn" style={{ padding: '8px', fontSize: '11px' }}>
                  <Phone size={14} /> {vehicle.supportContacts?.yolYardim?.name || 'Yol Yardım'}
                </a>
                <a href={`tel:${vehicle.supportContacts?.sigorta?.phone || '02123346262'}`} className="es-btn" style={{ padding: '8px', fontSize: '11px' }}>
                  <Shield size={14} /> {vehicle.supportContacts?.sigorta?.name || 'Sigorta'}
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'servis' && (
          <div className="servis-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🛠️ Servis Defteri</h3>
              <button className="add-btn-mini" onClick={() => setShowServiceForm(true)}><Plus size={14} /></button>
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
                    <div className="sti-actions">
                      <div className="sti-cost">{formatMoney(s.cost)}</div>
                      <button className="delete-btn-mini" onClick={() => { 
                        requestConfirm('Bu servis kaydını silmek istediğinize emin misiniz?', () => {
                          useStore.getState().deleteServiceRecord(vehicle.id, s.id);
                        });
                      }}><Trash2 size={12} /></button>
                    </div>
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
              <button className="add-btn-mini" onClick={() => { setEditingDoc(null); setShowDocForm(true); }}><Plus size={14} /></button>
            </div>
            <div className="docs-list">
              {documents.map(doc => {
                const diff = doc.dueDate ? Math.round((new Date(doc.dueDate) - new Date()) / 864e5) : 0;
                return (
                  <div 
                    key={doc.id} 
                    className="doc-card-premium glass"
                    onClick={() => setActiveDocAction(doc)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="dcp-left">
                      <div className="dcp-icon">{doc.icon}</div>
                      <div className="dcp-info">
                        <strong>{doc.name}</strong>
                        {doc.brand && <small style={{ color: 'var(--aracim)', fontWeight: '800' }}>{doc.brand}</small>}
                        <small style={{ display: 'block' }}>Bitiş: {doc.dueDate ? new Date(doc.dueDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</small>
                      </div>
                    </div>
                    <div className="dcp-right-actions">
                      <div className={`dcp-status ${diff < 7 ? 'critical' : diff < 30 ? 'warn' : 'ok'}`}>
                        {diff} Gün
                      </div>
                      <ChevronRight size={18} opacity={0.3} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analiz' && (
          <div className="analysis-view animate-fadeIn">
            {/* Market Value Widget */}
            <div className="section-header-v2">
              <h3>💰 Finansal Değer</h3>
            </div>
            <div className="km-widget-premium glass mb-24" onClick={() => { setEditingVehicle(vehicle); setShowVehicleForm(true); }} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', cursor: 'pointer' }}>
              <div className="kmw-main">
                <Landmark size={32} className="kmw-icon" />
                <div className="kmw-text">
                  <small style={{ color: 'rgba(255,255,255,0.8)' }}>GÜNCEL PİYASA DEĞERİ</small>
                  <h2 style={{ fontSize: '24px', color: 'white' }}>{formatMoney(vehicle.marketValue)}</h2>
                </div>
              </div>
              <Edit3 size={18} className="kmw-arrow" />
            </div>

            <div className="section-header-v2">
              <h3>📊 Yakıt Verimliliği</h3>
              <small>L/100km</small>
            </div>
            <div className="fuel-chart-box glass">
              <Line 
                data={{
                  labels: logsWithConsumption.filter(l => l.consumption !== null).map(l => l.date ? new Date(l.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : ''),
                  datasets: [{
                    label: 'Tüketim (L/100km)',
                    data: logsWithConsumption.filter(l => l.consumption !== null).map(l => l.consumption),
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
              {[...fuelLogs].sort((a, b) => {
                const dateA = a.date || '';
                const dateB = b.date || '';
                if (dateA !== dateB) return dateB.localeCompare(dateA);
                return (b.km || 0) - (a.km || 0);
              }).map(l => (
                <div key={l.id} className="fuel-item-premium glass">
                  <div className="fip-left">
                    <div className="fip-station">{l.station || 'Diğer'}</div>
                    <small>{l.date ? new Date(l.date).toLocaleDateString('tr-TR') : ''} · {l.km?.toLocaleString()} KM</small>
                  </div>
                  <div className="fip-right-actions">
                    <div className="fip-stats">
                      <div className="fip-cons" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', textAlign: 'right' }}>
                        {l.amount || l.litre || 0} L {l.price ? `(₺${Number(l.price).toFixed(2)}/L)` : ''}
                      </div>
                      <div className="fip-cost" style={{ fontSize: '14px', fontWeight: '800', color: '#f87171' }}>
                        {formatMoney(l.tutar || l.totalPrice || ((l.amount || 0) * (l.price || 0)))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="delete-btn-mini" style={{ background: 'rgba(255,255,255,0.08)', color: '#60a5fa' }} onClick={() => { 
                        setEditingFuelLog(l);
                        setShowAddFuel(true);
                      }}><Edit3 size={12} /></button>
                      <button className="delete-btn-mini" onClick={() => { 
                        requestConfirm('Bu yakıt kaydını silmek istediğinize emin misiniz?', () => {
                          deleteFuelLog(vehicle.id, l.id);
                        });
                      }}><Trash2 size={12} /></button>
                    </div>
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
          onSave={(newKM) => updateVehicle(vehicle.id, { km: newKM })} 
        />
      )}

      {showAddFuel && (
        <FuelLogModal 
          onClose={() => { setShowAddFuel(false); setEditingFuelLog(null); }} 
          onSave={(logData, paymentMethod) => {
            if (editingFuelLog) {
              updateFuelLog(vehicle.id, editingFuelLog.id, logData);
            } else {
              addFuelLog(logData, paymentMethod);
            }
          }} 
          currentKM={km}
          log={editingFuelLog}
        />
      )}

      {showGarageModal && (
        <GarageModal 
          garaj={garaj} 
          selectedId={selectedVehicleId} 
          onSelect={(id) => setModuleData('selectedVehicleId', id)}
          onAdd={() => { setEditingVehicle(null); setShowVehicleForm(true); }}
          onClose={() => setShowGarageModal(false)} 
        />
      )}

      {showVehicleForm && (
        <VehicleFormModal 
          vehicle={editingVehicle}
          onSave={(data) => editingVehicle ? updateVehicle(editingVehicle.id, data) : addVehicle(data)}
          onDelete={deleteVehicle}
          onClose={() => setShowVehicleForm(false)}
        />
      )}

      {showWashModal && (
        <WashModal 
          onSave={(data) => addWashRecord(vehicle.id, data)}
          onClose={() => setShowWashModal(false)}
        />
      )}

      {showParkModal && (
        <ParkModal 
          parkLocation={parkLocation}
          onStart={(data) => startParking(vehicle.id, data)}
          onFinish={(cost) => finishParking(vehicle.id, cost)}
          onClose={() => setShowParkModal(false)}
        />
      )}

      {showServiceForm && (
        <ServiceFormModal 
          onSave={(data) => addServiceRecord(data)}
          onClose={() => setShowServiceForm(false)}
        />
      )}

      {showDocForm && (
        <DocFormModal 
          doc={editingDoc}
          onSave={(data) => editingDoc ? updateDocument(vehicle.id, editingDoc.id, data) : addDocument(vehicle.id, data)}
          onClose={() => setShowDocForm(false)}
        />
      )}

      <ActionSheet
        isOpen={!!activeDocAction}
        onClose={() => setActiveDocAction(null)}
        title="Belge İşlemleri"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="submit-btn-premium"
            onClick={() => {
              setEditingDoc(activeDocAction);
              setShowDocForm(true);
              setActiveDocAction(null);
            }}
          >
            <Edit3 size={18} /> Düzenle
          </button>
          <button 
            className="submit-btn-premium red"
            onClick={() => {
              requestConfirm('Bu belgeyi silmek istediğinize emin misiniz?', () => {
                deleteDocument(vehicle.id, activeDocAction.id);
                setActiveDocAction(null);
              });
            }}
          >
            <Trash2 size={18} /> Sil
          </button>
        </div>
      </ActionSheet>

      {showPartModal && (
        <PartMaintenanceModal 
          part={selectedPart}
          onSave={(data) => updatePartMaintenance(vehicle.id, selectedPart.id, data)}
          onClose={() => setShowPartForm(false)}
        />
      )}

      {showSupportModal && (
        <SupportFormModal 
          contacts={vehicle.supportContacts}
          onSave={(data) => updateSupportContacts(vehicle.id, data)}
          onClose={() => setShowSupportModal(false)}
        />
      )}

      <ConfirmModal 
        isOpen={showConfirm.open}
        title="Emin misiniz?"
        message={showConfirm.message}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ ...showConfirm, open: false });
        }}
        onCancel={() => setShowConfirm({ ...showConfirm, open: false })}
      />
    </AnimatedPage>
  );
}

function SupportFormModal({ contacts, onSave, onClose }) {
  const [form, setForm] = useState(contacts || {
    yolYardim: { name: 'Toyota Asistanım', phone: '0212 708 00 55' },
    sigorta: { name: 'Neova Sigorta (Nisa Hanım)', phone: '0533 303 42 35' }
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Phone size={24} color="#b91c1c" />
          <h3>Destek Hattı Düzenle</h3>
        </div>
        <div className="modal-body-v2">
          <div className="section-divider mt-12">YOL YARDIM</div>
          <div className="form-group-v2 mt-8">
            <label>İsim / Başlık</label>
            <input 
              value={form.yolYardim.name} 
              onChange={e => setForm({...form, yolYardim: {...form.yolYardim, name: e.target.value}})} 
              className="premium-input" 
            />
          </div>
          <div className="form-group-v2 mt-8">
            <label>Numara</label>
            <input 
              value={form.yolYardim.phone} 
              onChange={e => setForm({...form, yolYardim: {...form.yolYardim, phone: e.target.value}})} 
              className="premium-input" 
            />
          </div>

          <div className="section-divider mt-20">SİGORTA</div>
          <div className="form-group-v2 mt-8">
            <label>İsim / Başlık</label>
            <input 
              value={form.sigorta.name} 
              onChange={e => setForm({...form, sigorta: {...form.sigorta, name: e.target.value}})} 
              className="premium-input" 
            />
          </div>
          <div className="form-group-v2 mt-8">
            <label>Numara</label>
            <input 
              value={form.sigorta.phone} 
              onChange={e => setForm({...form, sigorta: {...form.sigorta, phone: e.target.value}})} 
              className="premium-input" 
            />
          </div>

          <button 
            className="submit-btn-premium mt-24" 
            onClick={() => { onSave(form); onClose(); toast.success('Destek hatları güncellendi ✨'); }}
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function KMUpdateModal({ currentKM, onClose, onSave }) {
  const [val, setVal] = useState(currentKM);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
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
          <button className="submit-btn-premium" onClick={() => { 
            const finalVal = Number(val);
            if(isNaN(finalVal)) return toast.error('Lütfen geçerli bir sayı girin');
            onSave(finalVal); 
            onClose(); 
            toast.success('Kilometre güncellendi 🏎️'); 
          }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function FuelLogModal({ onClose, onSave, currentKM, log = null }) {
  const [form, setForm] = useState(log ? {
    km: log.km,
    amount: log.amount || log.litre || '',
    tutar: log.tutar || log.totalPrice || '',
    price: log.price || '',
    station: log.station || 'Shell',
    date: log.date ? new Date(log.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  } : { 
    km: currentKM, 
    amount: '', 
    tutar: '', 
    price: '', 
    station: 'Shell', 
    date: new Date().toISOString().split('T')[0] 
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleAmountChange = (val) => {
    setForm(prev => {
      const updates = { amount: val };
      const amt = Number(val);
      if (amt > 0 && prev.tutar > 0) {
        updates.price = (Number(prev.tutar) / amt).toFixed(2);
      } else if (amt > 0 && prev.price > 0) {
        updates.tutar = (amt * Number(prev.price)).toFixed(2);
      }
      return { ...prev, ...updates };
    });
  };

  const handleTutarChange = (val) => {
    setForm(prev => {
      const updates = { tutar: val };
      const tut = Number(val);
      if (tut > 0 && prev.amount > 0) {
        updates.price = (tut / Number(prev.amount)).toFixed(2);
      } else if (tut > 0 && prev.price > 0) {
        updates.amount = (tut / Number(prev.price)).toFixed(2);
      }
      return { ...prev, ...updates };
    });
  };

  const handlePriceChange = (val) => {
    setForm(prev => {
      const updates = { price: val };
      const prc = Number(val);
      if (prc > 0 && prev.amount > 0) {
        updates.tutar = (Number(prev.amount) * prc).toFixed(2);
      } else if (prc > 0 && prev.tutar > 0) {
        updates.amount = (Number(prev.tutar) / prc).toFixed(2);
      }
      return { ...prev, ...updates };
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Fuel size={24} color="#f87171" />
          <h3>{log ? 'Yakıt Kaydını Düzenle' : 'Yakıt Girişi'}</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-grid-v2">
             <div className="form-group-v2">
               <label>KM</label>
               <input type="number" value={form.km} onChange={e => setForm({...form, km: e.target.value})} className="premium-input" />
             </div>
             <div className="form-group-v2">
               <label>Litre (L)</label>
               <input type="number" step="any" value={form.amount} onChange={e => handleAmountChange(e.target.value)} className="premium-input" placeholder="Örn: 50" />
             </div>
          </div>
          <div className="form-grid-v2 mt-12">
             <div className="form-group-v2">
               <label>Toplam Tutar (TL)</label>
               <input type="number" step="any" value={form.tutar} onChange={e => handleTutarChange(e.target.value)} className="premium-input" placeholder="Örn: 2000" />
             </div>
             <div className="form-group-v2">
               <label>Birim Fiyat (TL/L)</label>
               <input type="number" step="any" value={form.price} onChange={e => handlePriceChange(e.target.value)} className="premium-input" placeholder="Örn: 42.50" />
             </div>
          </div>
          <div className="form-group-v2 mt-16">
            <label>İstasyon</label>
            <select value={form.station} onChange={e => setForm({...form, station: e.target.value})} className="premium-select">
              <option value="Shell">🟠 Shell</option>
              <option value="Opet">🔵 Opet</option>
              <option value="BP">🟢 BP</option>
              <option value="Petrol Ofisi">🔴 Petrol Ofisi</option>
              <option value="Diğer">⚪ Diğer</option>
            </select>
          </div>
          {!log && (
            <div className="mt-16">
              <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
            </div>
          )}
          <button className="submit-btn-premium red mt-20" onClick={() => { 
            const amt = Number(form.amount || 0);
            const tut = Number(form.tutar || 0);
            let prc = Number(form.price || 0);
            
            if (tut > 0 && amt > 0) {
              prc = tut / amt;
            } else if (prc > 0 && amt > 0) {
              // correct
            } else if (tut > 0 && prc > 0) {
              // correct
            }

            const finalForm = {
              km: Number(form.km || 0),
              amount: amt,
              price: prc || 42.5,
              station: form.station,
              date: form.date,
              tutar: tut || (amt * prc)
            };

            onSave(finalForm, paymentMethod); 
            onClose(); 
            toast.success(log ? 'Yakıt kaydı güncellendi ✨' : 'Yakıt kaydı ve masraf eklendi ⛽'); 
          }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function GarageModal({ garaj, selectedId, onSelect, onAdd, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Warehouse size={24} color="var(--aracim)" />
          <h3>Eraylar Garaj</h3>
        </div>
        <div className="garage-list mt-12">
          {garaj.map(v => (
            <div 
              key={v.id} 
              className={`garage-item glass ${v.id === selectedId ? 'active' : ''}`} 
              onClick={() => { onSelect(v.id); onClose(); }}
            >
              <div className="gi-icon">{v.type === 'boat' ? '⛵' : '🚗'}</div>
              <div className="gi-info">
                <strong>{v.model}</strong>
                <small>{v.plaka}</small>
              </div>
              {v.id === selectedId && <Check size={16} className="text-green-500" />}
            </div>
          ))}
          <button className="add-vehicle-btn-premium mt-12" onClick={() => { onAdd(); onClose(); }}>
            <Plus size={18} /> Yeni Araç veya Tekne Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

function VehicleFormModal({ vehicle, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(vehicle || { type: 'car', brand: '', model: '', plaka: '', marketValue: 0 });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Settings size={24} />
          <h3>{vehicle ? 'Aracı Düzenle' : 'Yeni Araç'}</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Tür</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="premium-select">
              <option value="car">Otomobil</option>
              <option value="boat">Tekne / Deniz Aracı</option>
            </select>
          </div>
          <div className="form-group-v2 mt-12">
            <label>Marka / Model</label>
            <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="premium-input" placeholder="Örn: Tiguan R-Line" />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Plaka / Bağlama Kütüğü</label>
            <input value={form.plaka} onChange={e => setForm({...form, plaka: e.target.value})} className="premium-input" placeholder="34 HH 1144" />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Güncel Piyasa Değeri (TL)</label>
            <input 
              type="number" 
              value={form.marketValue} 
              onChange={e => setForm({...form, marketValue: Number(e.target.value)})} 
              className="premium-input" 
              placeholder="1.500.000" 
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="submit-btn-premium" style={{ flex: 2 }} onClick={() => { onSave(form); onClose(); }}>Kaydet</button>
            {vehicle && <button className="submit-btn-premium" style={{ flex: 1, background: '#ef4444' }} onClick={() => { 
              requestConfirm('Silmek istediğinize emin misiniz?', () => {
                onDelete(vehicle.id); 
                onClose(); 
              });
            }}><Trash2 size={18} /></button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function WashModal({ onSave, onClose }) {
  const [form, setForm] = useState({ price: '', date: new Date().toISOString().split('T')[0] });
  const [paymentMethod, setPaymentMethod] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Droplets size={24} color="#3b82f6" />
          <h3>Araç Yıkama</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Fiyat (TL)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="premium-input" placeholder="200" />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Tarih</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="premium-input" />
          </div>
          <div className="mt-20">
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <button className="submit-btn-premium mt-20" onClick={() => { onSave(form, paymentMethod); onClose(); }}>Kaydet & Finansa İşle</button>
        </div>
      </div>
    </div>
  );
}

function ParkModal({ parkLocation, onStart, onFinish, onClose }) {
  const [form, setForm] = useState({ note: '', isAVM: false, spot: '', floor: '' });
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleStart = () => {
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onStart({ lat: pos.coords.latitude, lng: pos.coords.longitude, ...form });
        setLoadingLoc(false);
        onClose();
        toast.success('Konum kaydedildi! 📍');
      },
      () => {
        onStart({ lat: null, lng: null, ...form });
        setLoadingLoc(false);
        onClose();
        toast.success('Not kaydedildi (Konum alınamadı).');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  if (parkLocation?.active) {
    const [parkCost, setParkCost] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <MapPin size={24} color="#ef4444" />
            <h3>Park Bilgisi</h3>
          </div>
          <div className="modal-body-v2">
            <div className="park-display-premium glass mb-20">
              {parkLocation.lat && (
                <div className="park-map-mini">
                  <a href={`https://www.google.com/maps?q=${parkLocation.lat},${parkLocation.lng}`} target="_blank" rel="noreferrer">
                    📍 Haritada Gör (Google Maps)
                  </a>
                </div>
              )}
              <div className="park-info-grid">
                {parkLocation.floor && <div><strong>Kat:</strong> {parkLocation.floor}</div>}
                {parkLocation.spot && <div><strong>No:</strong> {parkLocation.spot}</div>}
              </div>
            </div>

            <div className="form-group-v2">
              <label>Park Ücreti (₺)</label>
              <input type="number" value={parkCost} onChange={e => setParkCost(Number(e.target.value))} className="premium-input" placeholder="0" />
            </div>

            <div className="mt-12">
              <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <button className="submit-btn-premium mt-20" onClick={() => {
              onFinish(parkCost, paymentMethod);
              onClose();
              toast.success('Park kaydı kapatıldı.');
            }}>Parktan Çık (Tamamlandı)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <MapPin size={24} color="#10b981" />
          <h3>Konumu Kaydet</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Park Alanı Türü</label>
            <div className="pill-toggle">
              <button 
                type="button" 
                className={`pill-btn ${!form.isAVM ? 'active' : ''}`}
                onClick={() => setForm({ ...form, isAVM: false })}
              >
                🌳 Açık Alan / Sokak
              </button>
              <button 
                type="button" 
                className={`pill-btn ${form.isAVM ? 'active' : ''}`}
                onClick={() => setForm({ ...form, isAVM: true })}
              >
                🏢 AVM / Kapalı
              </button>
            </div>
          </div>
          {form.isAVM && (
            <div className="form-grid-v2 mt-12 animate-fadeIn">
              <div className="form-group-v2">
                <label>Kat / Sıra</label>
                <input value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} className="premium-input" placeholder="P2 - Mavi" />
              </div>
              <div className="form-group-v2">
                <label>Park No</label>
                <input value={form.spot} onChange={e => setForm({...form, spot: e.target.value})} className="premium-input" placeholder="A-42" />
              </div>
            </div>
          )}
          <button className="submit-btn-premium mt-20" disabled={loadingLoc} onClick={handleStart}>
            {loadingLoc ? '📍 Konum Alınıyor...' : 'Şu Anki Konumu Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceFormModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', km: '', shop: '', cost: '', date: new Date().toISOString().split('T')[0] });
  const [paymentMethod, setPaymentMethod] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Wrench size={24} color="#7c3aed" />
          <h3>Servis Kaydı Ekle</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>İşlem Başlığı</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="premium-input" placeholder="Periyodik Bakım" />
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>KM</label>
              <input type="number" value={form.km} onChange={e => setForm({...form, km: Number(e.target.value)})} className="premium-input" />
            </div>
            <div className="form-group-v2">
              <label>Maliyet (TL)</label>
              <input type="number" value={form.cost} onChange={e => setForm({...form, cost: Number(e.target.value)})} className="premium-input" />
            </div>
          </div>
          <div className="form-group-v2 mt-12">
            <label>Servis / Usta</label>
            <input value={form.shop} onChange={e => setForm({...form, shop: e.target.value})} className="premium-input" placeholder="VW Yetkili Servis" />
          </div>
          <div className="mt-20">
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <button className="submit-btn-premium mt-20" onClick={() => { onSave(form, paymentMethod); onClose(); toast.success('Servis kaydı eklendi 🛠️'); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function DocFormModal({ doc, onSave, onClose }) {
  const [form, setForm] = useState(doc || { name: '', brand: '', startDate: new Date().toISOString().split('T')[0], dueDate: '', icon: '📄', cost: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <FileText size={24} color="#3b82f6" />
          <h3>{doc ? 'Belgeyi Düzenle' : 'Yeni Belge'}</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Belge Adı / Türü</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="premium-input" placeholder="Kasko Sigortası" />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Sigorta Şirketi / Marka</label>
            <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="premium-input" placeholder="Anadolu Sigorta" />
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Başlangıç Tarihi</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="premium-input" />
            </div>
            <div className="form-group-v2">
              <label>Bitiş Tarihi</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="premium-input" />
            </div>
          </div>
          <div className="form-grid-v2 mt-12">
            <div className="form-group-v2">
              <label>Ödenen Tutar (TL)</label>
              <input type="number" value={form.cost} onChange={e => setForm({...form, cost: Number(e.target.value)})} className="premium-input" placeholder="0" />
            </div>
            <div className="form-group-v2">
              <label>İkon</label>
              <select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="premium-select">
                <option value="📄">📄 Belge</option>
                <option value="🛡️">🛡️ Sigorta</option>
                <option value="📋">📋 Liste</option>
                <option value="🔍">🔍 Muayene</option>
              </select>
            </div>
          </div>
          <div className="mt-20">
            <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <button className="submit-btn-premium mt-20" onClick={() => { onSave(form, paymentMethod); onClose(); toast.success('Belge kaydedildi! 📂'); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function PartMaintenanceModal({ part, onSave, onClose }) {
  const [form, setForm] = useState({ lastKM: part.lastKM, lastDate: part.lastDate || new Date().toISOString().split('T')[0] });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header-v2">
          <Settings size={24} color="#10b981" />
          <h3>{part.label} Bakımı</h3>
        </div>
        <div className="modal-body-v2">
          <div className="form-group-v2">
            <label>Son Değişim / Bakım KM</label>
            <input type="number" value={form.lastKM} onChange={e => setForm({...form, lastKM: Number(e.target.value)})} className="premium-input" placeholder="45000" />
          </div>
          <div className="form-group-v2 mt-12">
            <label>Son Değişim Tarihi</label>
            <input type="date" value={form.lastDate} onChange={e => setForm({...form, lastDate: e.target.value})} className="premium-input" />
          </div>
          <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '12px' }}>
            Bu bilgiye göre bir sonraki bakım zamanınız otomatik hesaplanacaktır.
          </p>
          <button className="submit-btn-premium mt-20" onClick={() => { onSave(form); onClose(); toast.success(`${part.label} bilgisi güncellendi ✨`); }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}
