import React, { useState, useMemo } from 'react';
import { 
  Car, Fuel, Wrench, History as HistoryIcon, Plus, Gauge, ArrowUpRight, 
  Shield, Landmark, AlertCircle, Sparkles, Home, Camera,
  MapPin, Phone, FileText, Settings, ArrowLeft, MoreVertical,
  ChevronRight, Droplets, Trash2, Check, Warehouse, Edit3,
  RotateCcw, X, DollarSign, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ConfirmModal from '../components/ConfirmModal';
import Portal from '../components/Portal';
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
    garaj, eskiAraclar, selectedVehicleId, setModuleData, 
    updateKM, addFuelLog, addServiceRecord,
    addVehicle, updateVehicle, deleteVehicle,
    sellVehicle, restoreVehicle, updateSoldVehicle, deleteSoldVehicle,
    addWashRecord, startParking, finishParking,
    deleteServiceRecord, deleteDocument, addDocument, updateDocument,
    updatePartMaintenance, deleteFuelLog, updateSupportContacts, updateFuelLog,
    currentUser
  } = useStore();
  
  const isGuest = currentUser?.name === 'Misafir';
  
  const vehicle = useMemo(() => 
    garaj.find(v => v.id === selectedVehicleId) || garaj[0] || null, 
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

  // Sold & Archive states
  const [viewingArchive, setViewingArchive] = useState(null);
  const [editingSaleVehicle, setEditingSaleVehicle] = useState(null);
  const [sellingVehicle, setSellingVehicle] = useState(null);

  const requestConfirm = (message, onConfirm) => {
    setShowConfirm({ open: true, message, onConfirm });
  };

  const { 
    km, parts, fuelLogs, services, documents, 
    lastCleaned, parkLocation, tireStatus 
  } = vehicle || { km: 0, parts: [], fuelLogs: [], services: [], documents: [] };

  const logsWithConsumption = useMemo(() => {
    const sorted = [...(fuelLogs || [])].sort((a, b) => (a.km || 0) - (b.km || 0));
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
    if (!vehicle) {
      return "Garajınızda şu anda aktif bir araç bulunmuyor. Eski Araçlar sekmesinden satılan araçlarınızı görebilir veya yeni bir araç ekleyebilirsiniz. 🚗";
    }
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
    const seed = (fuelLogs?.length || 0) + ((km || 0) % 10);
    return maniler[seed % maniler.length].replace('{model}', vehicle.model || 'Eraylar Garajı');
  }, [fuelLogs, vehicle, km]);

  const tabs = [
    { id: 'panel', label: 'Panel', emoji: '🏎️' },
    { id: 'servis', label: 'Servis', emoji: '🛠️' },
    { id: 'torpido', label: 'Torpido', emoji: '📂' },
    { id: 'analiz', label: 'Analiz', emoji: '📊' },
    { id: 'eski', label: 'Eski Araçlar', emoji: '🕰️' }
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
                {vehicle?.model || (activeTab === 'eski' ? 'Eski Araçlar' : 'Garaj Boş')}
                {!isGuest && vehicle && (
                  <Settings size={14} className="opacity-50" onClick={(e) => {
                    e.stopPropagation();
                    setEditingVehicle(vehicle);
                    setShowVehicleForm(true);
                  }} />
                )}
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

        {activeTab !== 'eski' && !vehicle && (
          <EmptyGarageView 
            onAddVehicle={() => { setEditingVehicle(null); setShowVehicleForm(true); }}
            onGoToEski={() => setActiveTab('eski')}
          />
        )}

        {activeTab === 'panel' && vehicle && (
          <div className="panel-view animate-fadeIn">
            {/* KM Widget */}
            <div className="km-widget-premium glass" onClick={() => !isGuest && setShowUpdateKM(true)} style={{ marginTop: '0', padding: '16px 20px', cursor: isGuest ? 'default' : 'pointer' }}>
              <div className="kmw-main">
                <Gauge size={32} className="kmw-icon" />
                <div className="kmw-text">
                  <small>GÜNCEL KİLOMETRE</small>
                  <h2 style={{ fontSize: '24px' }}>{km?.toLocaleString('tr-TR')} <span>KM</span></h2>
                </div>
              </div>
              {!isGuest && <ArrowUpRight size={18} className="kmw-arrow" />}
            </div>

            {/* Analog-Style Gauges Grid */}
            <div className="gauges-grid mt-24">
              {parts.map(part => {
                const used = km - part.lastKM;
                const perc = Math.min(100, (used / part.intervalKM) * 100);
                const color = perc > 85 ? '#f87171' : perc > 60 ? '#f59e0b' : '#10b981';
                
                return (
                  <div key={part.id} className="gauge-card glass animate-fadeIn" onClick={() => { if (isGuest) return; setSelectedPart(part); setShowPartForm(true); }} style={{ cursor: isGuest ? 'default' : 'pointer' }}>
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
            {!isGuest && (
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
            )}

            {/* Emergency Support */}
            <div className="emergency-support">
              <div className="es-header" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} color="#b91c1c" />
                  <span style={{ fontSize: '10px', fontWeight: '900' }}>ACİL DESTEK HATTI</span>
                </div>
                {!isGuest && (
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
                )}
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

        {activeTab === 'servis' && vehicle && (
          <div className="servis-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>🛠️ Servis Defteri</h3>
              {!isGuest && <button className="add-btn-mini" onClick={() => setShowServiceForm(true)}><Plus size={14} /></button>}
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
                      {!isGuest && (
                        <button className="delete-btn-mini" onClick={() => { 
                          requestConfirm('Bu servis kaydını silmek istediğinize emin misiniz?', () => {
                            useStore.getState().deleteServiceRecord(vehicle.id, s.id);
                          });
                        }}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'torpido' && vehicle && (
          <div className="glovebox-view animate-fadeIn">
            <div className="section-header-v2">
              <h3>📂 Dijital Torpido</h3>
              {!isGuest && <button className="add-btn-mini" onClick={() => { setEditingDoc(null); setShowDocForm(true); }}><Plus size={14} /></button>}
            </div>
            <div className="docs-list">
              {documents.map(doc => {
                const diff = doc.dueDate ? Math.round((new Date(doc.dueDate) - new Date()) / 864e5) : 0;
                return (
                  <div 
                    key={doc.id} 
                    className="doc-card-premium glass"
                    onClick={() => { if (isGuest) return; setActiveDocAction(doc); }}
                    style={{ cursor: isGuest ? 'default' : 'pointer' }}
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
                      {!isGuest && <ChevronRight size={18} opacity={0.3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analiz' && vehicle && (
          <div className="analysis-view animate-fadeIn">
            {/* Market Value Widget */}
            <div className="section-header-v2">
              <h3>💰 Finansal Değer</h3>
            </div>
            <div className="km-widget-premium glass mb-24" onClick={() => { if (isGuest) return; setEditingVehicle(vehicle); setShowVehicleForm(true); }} style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', cursor: isGuest ? 'default' : 'pointer' }}>
              <div className="kmw-main">
                <Landmark size={32} className="kmw-icon" />
                <div className="kmw-text">
                  <small>GÜNCEL PİYASA DEĞERİ</small>
                  <h2 style={{ fontSize: '24px' }}>{formatMoney(vehicle.marketValue)}</h2>
                </div>
              </div>
              {!isGuest && <ArrowUpRight size={18} className="kmw-arrow" />}
            </div>

            {/* Quick Stats Grid */}
            <div className="analysis-stats-grid mb-24">
              <div className="as-card glass">
                <small>TOPLAM SERVİS</small>
                <strong>{formatMoney(services.reduce((acc, s) => acc + (s.cost || 0), 0))}</strong>
                <span>{services.length} işlem kaydı</span>
              </div>
              <div className="as-card glass">
                <small>TOPLAM YAKIT</small>
                <strong>{formatMoney(fuelLogs.reduce((acc, l) => acc + (l.tutar || (l.amount * l.price) || 0), 0))}</strong>
                <span>{fuelLogs.length} dolum</span>
              </div>
            </div>

            {/* Monthly Cost Breakdown */}
            <div className="section-header-v2">
              <h3>📈 Masraf Dağılımı</h3>
            </div>
            <div className="chart-card glass mb-24" style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut 
                data={{
                  labels: ['Servis & Bakım', 'Yakıt Harcaması'],
                  datasets: [{
                    data: [
                      services.reduce((acc, s) => acc + (s.cost || 0), 0),
                      fuelLogs.reduce((acc, l) => acc + (l.tutar || (l.amount * l.price) || 0), 0)
                    ],
                    backgroundColor: ['#f87171', '#60a5fa'],
                    borderWidth: 0
                  }]
                }} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { color: '#64748B', font: { weight: 'bold' } } } }
                }} 
              />
            </div>

            {/* Consumption History List */}
            <div className="section-header-v2">
              <h3>⛽ Yakıt & Tüketim Geçmişi</h3>
              {!isGuest && <button className="add-btn-mini" onClick={() => { setEditingFuelLog(null); setShowAddFuel(true); }}><Plus size={14} /></button>}
            </div>
            <div className="fuel-history-list">
              {logsWithConsumption.map(l => (
                <div key={l.id} className="fuel-history-item glass">
                  <div className="fhi-left">
                    <div className="fhi-icon"><Fuel size={18} /></div>
                    <div className="fhi-info">
                      <strong>{l.station}</strong>
                      <small>{l.date} · {l.km.toLocaleString()} KM</small>
                    </div>
                  </div>
                  <div className="fhi-right">
                    <div className="fhi-cost">{formatMoney(l.tutar || (l.amount * l.price))}</div>
                    <div className="fhi-meta">
                      <span>{l.amount} L</span>
                      {l.consumption && <span className="consumption-badge">{l.consumption} L/100km</span>}
                    </div>
                    {!isGuest && (
                      <div className="fhi-actions mt-4" style={{ display: 'flex', gap: '4px' }}>
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'eski' && (
          <EskiAraclarView 
            eskiAraclar={eskiAraclar || []}
            onViewArchive={(v) => setViewingArchive(v)}
            onEditSale={(v) => setEditingSaleVehicle(v)}
            onRestore={(v) => {
              requestConfirm(`${v.model} (${v.plaka}) aracını tekrar aktif garaja taşımak istediğinizden emin misiniz?`, () => {
                restoreVehicle(v.id);
                setActiveTab('panel');
              });
            }}
            onDelete={(v) => {
              requestConfirm(`${v.model} (${v.plaka}) aracına ait tüm arşiv kayıtlarını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`, () => {
                deleteSoldVehicle(v.id);
              });
            }}
            isGuest={isGuest}
          />
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
          onSell={(v) => { setShowGarageModal(false); setSellingVehicle(v); }}
          onClose={() => setShowGarageModal(false)} 
        />
      )}

      {showVehicleForm && (
        <VehicleFormModal 
          vehicle={editingVehicle}
          onSave={(data) => editingVehicle ? updateVehicle(editingVehicle.id, data) : addVehicle(data)}
          onDelete={deleteVehicle}
          onSell={(v) => { setShowVehicleForm(false); setSellingVehicle(v); }}
          requestConfirm={requestConfirm}
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

      {showSupportModal && vehicle && (
        <SupportFormModal 
          contacts={vehicle.supportContacts}
          onSave={(data) => updateSupportContacts(vehicle.id, data)}
          onClose={() => setShowSupportModal(false)}
        />
      )}

      {viewingArchive && (
        <ArchiveDetailModal 
          vehicle={viewingArchive}
          onClose={() => setViewingArchive(null)}
        />
      )}

      {editingSaleVehicle && (
        <EditSaleInfoModal 
          vehicle={editingSaleVehicle}
          onSave={(saleInfo) => {
            updateSoldVehicle(editingSaleVehicle.id, { saleInfo });
            setEditingSaleVehicle(null);
            toast.success('Satış bilgileri güncellendi ✨');
          }}
          onClose={() => setEditingSaleVehicle(null)}
        />
      )}

      {sellingVehicle && (
        <SellVehicleModal 
          vehicle={sellingVehicle}
          onSell={(saleData, addToFinans) => {
            sellVehicle(sellingVehicle.id, saleData, addToFinans);
            setSellingVehicle(null);
            setShowVehicleForm(false);
            setShowGarageModal(false);
            setActiveTab('eski');
            toast.success(`${sellingVehicle.model} satıldı ve Eski Araçlar'a arşivlendi 🏷️`);
          }}
          onClose={() => setSellingVehicle(null)}
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

function GarageModal({ garaj, selectedId, onSelect, onAdd, onSell, onClose }) {
  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <Warehouse size={24} color="var(--aracim)" />
            <h3>Eraylar Garaj</h3>
          </div>
          <div className="garage-list mt-12">
            {garaj.length === 0 ? (
              <div className="empty-garage-mini glass p-16 text-center" style={{ borderRadius: '12px', padding: '20px' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Aktif garajınızda araç bulunmuyor.</p>
                <small style={{ opacity: 0.75 }}>Satılan araçlarınızı "Eski Araçlar" sekmesinde bulabilirsiniz.</small>
              </div>
            ) : (
              garaj.map(v => (
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
                  <div className="gi-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {onSell && (
                      <button
                        type="button"
                        className="garage-sell-btn"
                        title="Bu Aracı Sat"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSell(v);
                        }}
                      >
                        🏷️ Sat
                      </button>
                    )}
                    {v.id === selectedId && <Check size={16} className="text-green-500" />}
                  </div>
                </div>
              ))
            )}
            <button className="add-vehicle-btn-premium mt-12" onClick={() => { onAdd(); onClose(); }}>
              <Plus size={18} /> Yeni Araç veya Tekne Ekle
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function VehicleFormModal({ vehicle, onSave, onDelete, onSell, requestConfirm, onClose }) {
  const [form, setForm] = useState(vehicle || { type: 'car', brand: '', model: '', plaka: '', marketValue: 0 });
  return (
    <Portal>
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

            {vehicle && onSell && (
              <div className="sell-trigger-box mt-16 p-12 glass" style={{ borderRadius: '12px', border: '1px dashed rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      🏷️ Aracı Sattınız mı?
                    </strong>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: '2px 0 0 0' }}>
                      Eski Araçlar arşivine taşır ve tüm geçmişi saklar.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="submit-btn-premium" 
                    style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', padding: '6px 14px', fontSize: '12px', width: 'auto' }}
                    onClick={() => {
                      onSell(vehicle);
                    }}
                  >
                    Aracı Sat
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="submit-btn-premium" style={{ flex: 2 }} onClick={() => { onSave(form); onClose(); }}>Kaydet</button>
              {vehicle && <button className="submit-btn-premium" style={{ flex: 1, background: '#ef4444' }} onClick={() => { 
                if (requestConfirm) {
                  requestConfirm(`${vehicle.model} (${vehicle.plaka}) aracını aktif garajdan silmek istediğinize emin misiniz?`, () => {
                    onDelete(vehicle.id); 
                    onClose(); 
                  });
                } else {
                  onDelete(vehicle.id); 
                  onClose(); 
                }
              }}><Trash2 size={18} /></button>}
            </div>
          </div>
        </div>
      </div>
    </Portal>
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

function EmptyGarageView({ onAddVehicle, onGoToEski }) {
  return (
    <div className="empty-garage-card glass animate-fadeIn">
      <div className="egc-icon-badge">
        <Warehouse size={36} color="var(--aracim)" />
      </div>
      <h3>Aktif Garajınızda Araç Bulunmuyor</h3>
      <p>
        Şu anda garajınızda kayıtlı aktif bir araç veya tekne bulunmuyor. Yeni bir araç ekleyebilir ya da satılan araçlarınızın tüm geçmişine <strong>Eski Araçlar</strong> sekmesinden ulaşabilirsiniz.
      </p>
      <div className="egc-actions">
        <button className="submit-btn-premium" onClick={onAddVehicle}>
          <Plus size={18} /> Yeni Araç Ekle
        </button>
        <button className="submit-btn-premium secondary" onClick={onGoToEski}>
          <HistoryIcon size={18} /> 🕰️ Eski Araçlar Arşivi
        </button>
      </div>
    </div>
  );
}

function EskiAraclarView({ eskiAraclar = [], onViewArchive, onEditSale, onRestore, onDelete, isGuest }) {
  return (
    <div className="eski-araclar-view animate-fadeIn">
      <div className="eski-banner glass">
        <div className="eb-icon">🕰️</div>
        <div className="eb-content">
          <h4>Eski Araçlar Arşivi</h4>
          <p>
            Satılmış veya devredilmiş araçlarınızın satış detayları (tarih, fiyat, km) ve geçmiş tüm servis/yakıt/torpido kayıtları burada muhafaza edilir.
          </p>
        </div>
      </div>

      {eskiAraclar.length === 0 ? (
        <div className="eski-empty glass text-center p-24">
          <Car size={36} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
          <h3>Henüz Arşivlenmiş Araç Yok</h3>
          <p style={{ fontSize: '13px', opacity: 0.7 }}>
            Aktif garajınızdaki araçları sattığınızda satış detayları ve geçmiş tüm kayıtlarıyla birlikte buradan inceleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="eski-list">
          {eskiAraclar.map((v) => {
            const sale = v.saleInfo || {};
            const serviceCount = v.services?.length || 0;
            const fuelCount = v.fuelLogs?.length || 0;
            const docCount = v.documents?.length || 0;

            return (
              <div key={v.id} className="eski-card glass">
                {/* Header */}
                <div className="ec-header">
                  <div className="ec-left">
                    <span className="sold-badge">SATILDI</span>
                    <h3 className="ec-title">{v.model}</h3>
                    <div className="ec-plate">{v.plaka}</div>
                  </div>
                  <div className="ec-right">
                    <span className="ec-price-label">Satış Fiyatı</span>
                    <div className="ec-price">{formatMoney(sale.price || v.marketValue || 0)}</div>
                  </div>
                </div>

                {/* Sale Details Grid */}
                <div className="ec-details-grid">
                  <div className="ec-detail-item">
                    <span className="label"><Calendar size={13} /> Satış Tarihi</span>
                    <span className="val">{sale.date || 'Belirtilmedi'}</span>
                  </div>
                  <div className="ec-detail-item">
                    <span className="label"><Gauge size={13} /> Satış KM</span>
                    <span className="val">{sale.km ? `${Number(sale.km).toLocaleString('tr-TR')} KM` : (v.km ? `${Number(v.km).toLocaleString('tr-TR')} KM` : '-')}</span>
                  </div>
                  <div className="ec-detail-item">
                    <span className="label">👤 Alıcı</span>
                    <span className="val">{sale.buyer || 'Belirtilmedi'}</span>
                  </div>
                  <div className="ec-detail-item">
                    <span className="label">📝 Not</span>
                    <span className="val note">{sale.notes || 'Not eklenmedi.'}</span>
                  </div>
                </div>

                {/* History Stats Summary */}
                <div className="ec-stats-row">
                  <span className="ec-stat-pill"><Wrench size={13} /> {serviceCount} Servis Kaydı</span>
                  <span className="ec-stat-pill"><Fuel size={13} /> {fuelCount} Yakıt Kaydı</span>
                  <span className="ec-stat-pill"><FileText size={13} /> {docCount} Belge</span>
                </div>

                {/* Action Buttons */}
                <div className="ec-actions">
                  <button 
                    className="ec-btn view-btn"
                    onClick={() => onViewArchive(v)}
                  >
                    <FileText size={15} /> 📂 Tüm Geçmişi Gör
                  </button>
                  {!isGuest && (
                    <>
                      <button 
                        className="ec-btn edit-btn" 
                        onClick={() => onEditSale(v)}
                        title="Satış Bilgilerini Düzenle"
                      >
                        <Edit3 size={15} /> Satış Bilgisi
                      </button>
                      <button 
                        className="ec-btn restore-btn" 
                        onClick={() => onRestore(v)}
                        title="Aktif Garaja Geri Yükle"
                      >
                        <RotateCcw size={15} /> Geri Yükle
                      </button>
                      <button 
                        className="ec-btn delete-btn" 
                        onClick={() => onDelete(v)}
                        title="Arşivi Kalıcı Olarak Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArchiveDetailModal({ vehicle, onClose }) {
  const [detailTab, setDetailTab] = useState('servis');
  const sale = vehicle.saleInfo || {};

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-pop arac-modal-content archive-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Warehouse size={26} color="#f59e0b" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="sold-badge">SATILDI</span>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{vehicle.model}</h3>
                </div>
                <small style={{ opacity: 0.75 }}>{vehicle.plaka} · Arşiv Kayıtları</small>
              </div>
            </div>
            <button className="close-btn-ghost" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="modal-body-v2">
            {/* Sale Summary Banner */}
            <div className="archive-sale-summary glass">
              <div className="ass-item">
                <span className="ass-label">Satış Fiyatı</span>
                <span className="ass-val price">{formatMoney(sale.price || vehicle.marketValue || 0)}</span>
              </div>
              <div className="ass-item">
                <span className="ass-label">Satış Tarihi</span>
                <span className="ass-val">{sale.date || '-'}</span>
              </div>
              <div className="ass-item">
                <span className="ass-label">Satış KM</span>
                <span className="ass-val">{sale.km ? `${Number(sale.km).toLocaleString('tr-TR')} KM` : (vehicle.km ? `${Number(vehicle.km).toLocaleString('tr-TR')} KM` : '-')}</span>
              </div>
              {sale.buyer && (
                <div className="ass-item">
                  <span className="ass-label">Alıcı</span>
                  <span className="ass-val">{sale.buyer}</span>
                </div>
              )}
              {sale.notes && (
                <div className="ass-item full-width">
                  <span className="ass-label">Satış Notu</span>
                  <span className="ass-val note">{sale.notes}</span>
                </div>
              )}
            </div>

            {/* Subtabs for History */}
            <div className="archive-subtabs">
              <button 
                type="button"
                className={`archive-tab-btn ${detailTab === 'servis' ? 'active' : ''}`} 
                onClick={() => setDetailTab('servis')}
              >
                🛠️ Servis ({vehicle.services?.length || 0})
              </button>
              <button 
                type="button"
                className={`archive-tab-btn ${detailTab === 'yakit' ? 'active' : ''}`} 
                onClick={() => setDetailTab('yakit')}
              >
                ⛽ Yakıt ({vehicle.fuelLogs?.length || 0})
              </button>
              <button 
                type="button"
                className={`archive-tab-btn ${detailTab === 'belge' ? 'active' : ''}`} 
                onClick={() => setDetailTab('belge')}
              >
                📂 Torpido ({vehicle.documents?.length || 0})
              </button>
              <button 
                type="button"
                className={`archive-tab-btn ${detailTab === 'parca' ? 'active' : ''}`} 
                onClick={() => setDetailTab('parca')}
              >
                ⚙️ Bakım Parçaları
              </button>
            </div>

            {/* Subtab Content */}
            <div className="archive-tab-content">
              {detailTab === 'servis' && (
                <div className="archive-list">
                  {!vehicle.services || vehicle.services.length === 0 ? (
                    <p className="empty-text">Kayıtlı servis geçmişi bulunmuyor.</p>
                  ) : (
                    vehicle.services.map(s => (
                      <div key={s.id} className="archive-item glass">
                        <div className="ai-left">
                          <strong>{s.title}</strong>
                          <small>{s.shop || 'Servis'} · {s.date} · {s.km?.toLocaleString()} KM</small>
                        </div>
                        <div className="ai-right">
                          <span className="ai-cost">{formatMoney(s.cost)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'yakit' && (
                <div className="archive-list">
                  {!vehicle.fuelLogs || vehicle.fuelLogs.length === 0 ? (
                    <p className="empty-text">Kayıtlı yakıt kaydı bulunmuyor.</p>
                  ) : (
                    vehicle.fuelLogs.map(f => (
                      <div key={f.id} className="archive-item glass">
                        <div className="ai-left">
                          <strong>{f.station || 'İstasyon'}</strong>
                          <small>{f.date} · {f.km?.toLocaleString()} KM · {f.amount} L ({f.price} TL/L)</small>
                        </div>
                        <div className="ai-right">
                          <span className="ai-cost">{formatMoney(f.tutar || (f.amount * f.price))}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'belge' && (
                <div className="archive-list">
                  {!vehicle.documents || vehicle.documents.length === 0 ? (
                    <p className="empty-text">Kayıtlı belge veya poliçe bulunmuyor.</p>
                  ) : (
                    vehicle.documents.map(d => (
                      <div key={d.id} className="archive-item glass">
                        <div className="ai-left">
                          <strong>{d.icon || '📄'} {d.name}</strong>
                          <small>{d.brand || 'Kurum'} · Bitiş: {d.dueDate || 'Süresiz'}</small>
                        </div>
                        <div className="ai-right">
                          {d.cost > 0 && <span className="ai-cost">{formatMoney(d.cost)}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'parca' && (
                <div className="archive-list">
                  {!vehicle.parts || vehicle.parts.length === 0 ? (
                    <p className="empty-text">Bakım parçası bilgisi bulunmuyor.</p>
                  ) : (
                    vehicle.parts.map(p => (
                      <div key={p.id} className="archive-item glass">
                        <div className="ai-left">
                          <strong>{p.label}</strong>
                          <small>Son Değişim: {p.lastKM?.toLocaleString()} KM ({p.lastDate || '-'})</small>
                        </div>
                        <div className="ai-right">
                          <span className="part-interval-pill">{p.intervalKM?.toLocaleString()} KM Bakım</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="submit-btn-premium mt-20" onClick={onClose}>
              Pencereyi Kapat
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function SellVehicleModal({ vehicle, onSell, onClose }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    price: vehicle.marketValue || '',
    km: vehicle.km || '',
    buyer: '',
    notes: ''
  });
  const [addToFinans, setAddToFinans] = useState(true);

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <Warehouse size={24} color="#f59e0b" />
            <div>
              <h3>Aracı Sat (Eski Araçlar'a Arşivle)</h3>
              <small style={{ opacity: 0.7 }}>{vehicle.model} ({vehicle.plaka})</small>
            </div>
          </div>

          <div className="modal-body-v2">
            <div className="sell-info-alert glass mb-16">
              <Sparkles size={18} color="#f59e0b" />
              <p>
                Bu işlem aracınızı aktif garajınızdan kaldırıp <strong>Eski Araçlar</strong> sekmesine taşır. Servis, yakıt ve torpido geçmişi eksiksiz korunur.
              </p>
            </div>

            <div className="form-grid-v2">
              <div className="form-group-v2">
                <label>Satış Tarihi</label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })} 
                  className="premium-input" 
                />
              </div>
              <div className="form-group-v2">
                <label>Satış Fiyatı (TL)</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })} 
                  className="premium-input" 
                  placeholder="1550000" 
                />
              </div>
            </div>

            <div className="form-grid-v2 mt-12">
              <div className="form-group-v2">
                <label>Satış Kilometresi</label>
                <input 
                  type="number" 
                  value={form.km} 
                  onChange={e => setForm({ ...form, km: e.target.value })} 
                  className="premium-input" 
                  placeholder="42969" 
                />
              </div>
              <div className="form-group-v2">
                <label>Alıcı Adı / Kurum</label>
                <input 
                  type="text" 
                  value={form.buyer} 
                  onChange={e => setForm({ ...form, buyer: e.target.value })} 
                  className="premium-input" 
                  placeholder="Yeni Sahibi / Galeri" 
                />
              </div>
            </div>

            <div className="form-group-v2 mt-12">
              <label>Satış Notu / Açıklama</label>
              <textarea 
                value={form.notes} 
                onChange={e => setForm({ ...form, notes: e.target.value })} 
                className="premium-input" 
                rows="2"
                placeholder="Sorunsuz devir teslim yapıldı. Yedek anahtar teslim edildi." 
              />
            </div>

            <label className="checkbox-container mt-16 glass p-12" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={addToFinans} 
                onChange={e => setAddToFinans(e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span style={{ fontSize: '13px' }}>
                💰 Satış bedelini (<strong>{form.price ? formatMoney(form.price) : '0 TL'}</strong>) Kasa & Finans modülüne Gelir olarak kaydet
              </span>
            </label>

            <button 
              className="submit-btn-premium mt-20" 
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              onClick={() => {
                const prc = Number(form.price);
                if (!prc || isNaN(prc) || prc <= 0) {
                  return toast.error('Lütfen geçerli bir satış fiyatı girin.');
                }
                onSell({
                  date: form.date,
                  price: prc,
                  km: Number(form.km) || vehicle.km || 0,
                  buyer: form.buyer || 'Alıcı',
                  notes: form.notes || ''
                }, addToFinans);
              }}
            >
              Satışı Onayla ve Arşivle 🏷️
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function EditSaleInfoModal({ vehicle, onSave, onClose }) {
  const currentSale = vehicle.saleInfo || {};
  const [form, setForm] = useState({
    date: currentSale.date || new Date().toISOString().split('T')[0],
    price: currentSale.price || vehicle.marketValue || '',
    km: currentSale.km || vehicle.km || '',
    buyer: currentSale.buyer || '',
    notes: currentSale.notes || ''
  });

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content animate-pop arac-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header-v2">
            <Edit3 size={24} color="#60a5fa" />
            <div>
              <h3>Satış Bilgilerini Güncelle</h3>
              <small style={{ opacity: 0.7 }}>{vehicle.model} ({vehicle.plaka})</small>
            </div>
          </div>

          <div className="modal-body-v2">
            <div className="form-grid-v2">
              <div className="form-group-v2">
                <label>Satış Tarihi</label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })} 
                  className="premium-input" 
                />
              </div>
              <div className="form-group-v2">
                <label>Satış Fiyatı (TL)</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })} 
                  className="premium-input" 
                />
              </div>
            </div>

            <div className="form-grid-v2 mt-12">
              <div className="form-group-v2">
                <label>Satış Kilometresi</label>
                <input 
                  type="number" 
                  value={form.km} 
                  onChange={e => setForm({ ...form, km: e.target.value })} 
                  className="premium-input" 
                />
              </div>
              <div className="form-group-v2">
                <label>Alıcı Adı / Kurum</label>
                <input 
                  type="text" 
                  value={form.buyer} 
                  onChange={e => setForm({ ...form, buyer: e.target.value })} 
                  className="premium-input" 
                />
              </div>
            </div>

            <div className="form-group-v2 mt-12">
              <label>Satış Notu / Açıklama</label>
              <textarea 
                value={form.notes} 
                onChange={e => setForm({ ...form, notes: e.target.value })} 
                className="premium-input" 
                rows="2" 
              />
            </div>

            <button 
              className="submit-btn-premium mt-20" 
              onClick={() => {
                const prc = Number(form.price);
                if (!prc || isNaN(prc) || prc <= 0) {
                  return toast.error('Lütfen geçerli bir satış fiyatı girin.');
                }
                onSave({
                  date: form.date,
                  price: prc,
                  km: Number(form.km) || 0,
                  buyer: form.buyer || '',
                  notes: form.notes || ''
                });
              }}
            >
              Bilgileri Kaydet ✨
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
