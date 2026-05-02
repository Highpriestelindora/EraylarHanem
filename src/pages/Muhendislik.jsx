import React, { useState, useMemo } from 'react';
import { 
  Cpu, ArrowLeft, Terminal, Code2, Database, Zap, 
  Settings, GitBranch, Library, StickyNote, Plus, 
  Trash2, Edit2, Search, Filter, AlertCircle, 
  CheckCircle2, ChevronRight, ChevronDown, Clock,
  ExternalLink, Info, Calculator, Ruler, ArrowRightLeft,
  Pill, FileText, Activity, Users, Briefcase, CalendarCheck, 
  ListTodo, Target, X, Heart, Star, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import ConfirmModal from '../components/ConfirmModal';
import ActionSheet from '../components/ActionSheet';
import toast from 'react-hot-toast';
import './Muhendislik.css';

// --- Types & Constants ---
const TABS = [
  { id: 'muhendislik', label: 'Mühendislik', icon: Cpu },
  { id: 'karar', label: 'Karar Günlüğü', icon: GitBranch },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'arsiv', label: 'Arşiv', icon: Library },
  { id: 'hayat', label: 'Hayat', icon: CalendarCheck }
];

const CRITICALITY_LEVELS = {
  low: { label: 'Operasyonel', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
  medium: { label: 'Stratejik', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  high: { label: 'Kritik', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

// --- Sub-Components ---

const QuickCalc = ({ conversions, updatePinned }) => {
  const [inputs, setInputs] = useState({});

  const handleConvert = (id, from, to, val) => {
    let result = 0;
    const numVal = parseFloat(val) || 0;

    if (from === 'lt/min' && to === 'gpm') result = numVal / 3.785;
    if (from === 'gpm' && to === 'lt/min') result = numVal * 3.785;
    if (from === 'bar' && to === 'psi') result = numVal * 14.5038;
    if (from === 'psi' && to === 'bar') result = numVal / 14.5038;
    if (from === 'kg' && to === 'lb') result = numVal * 2.20462;
    if (from === 'lb' && to === 'kg') result = numVal / 2.20462;

    return result.toFixed(3);
  };

  return (
    <div className="eng-section glass mb-24">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={18} color="#6366f1" />
          <h3>Hızlı Hesap & Çevrim</h3>
        </div>
      </div>
      <div className="conversion-grid mt-16">
        {conversions.map(conv => (
          <div key={conv.id} className="conv-card glass">
            <div className="conv-labels">
              <span>{conv.from}</span>
              <ArrowRightLeft size={12} opacity={0.5} />
              <span>{conv.to}</span>
            </div>
            <div className="conv-inputs">
              <input 
                type="number" 
                placeholder="Değer"
                onChange={(e) => setInputs({...inputs, [conv.id]: e.target.value})}
              />
              <div className="conv-result">
                {handleConvert(conv.id, conv.from, conv.to, inputs[conv.id])}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlainCalculator = () => {
  const [params, setParams] = useState({
    load: 1000, // kg
    cylinder: 100, // mm
    speed: 0.6, // m/s
    ratio: '2:1',
    pressure: 0,
    flow: 0
  });

  const results = useMemo(() => {
    const g = 9.81;
    const ratioVal = params.ratio === '2:1' ? 2 : 1;
    const area = Math.PI * Math.pow(params.cylinder / 20, 2); // cm2
    
    // Pressure (bar) = (Load * g * ratio) / (Area * 10)
    const pressure = (params.load * g * ratioVal) / (area * 10);
    
    // Flow (lt/min) = (Area * Speed * ratio * 6) / 100
    const flow = (area * params.speed * ratioVal * 60) / 10;

    return {
      pressure: pressure.toFixed(2),
      flow: flow.toFixed(2)
    };
  }, [params]);

  return (
    <div className="eng-section glass mb-24">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="#10b981" />
          <h3>Hidrolik Asansör Hesaplayıcı (SI)</h3>
        </div>
        <a href="https://blain.de/calculator" target="_blank" rel="noreferrer" className="tech-link">
          <ExternalLink size={14} /> Blain.de
        </a>
      </div>
      <div className="blain-grid mt-16">
        <div className="input-group-tech">
          <label>Toplam Yük (kg)</label>
          <input type="number" value={params.load} onChange={e => setParams({...params, load: e.target.value})} />
        </div>
        <div className="input-group-tech">
          <label>Piston Çapı (mm)</label>
          <input type="number" value={params.cylinder} onChange={e => setParams({...params, cylinder: e.target.value})} />
        </div>
        <div className="input-group-tech">
          <label>Nominal Hız (m/s)</label>
          <input type="number" step="0.1" value={params.speed} onChange={e => setParams({...params, speed: e.target.value})} />
        </div>
        <div className="input-group-tech">
          <label>Askı Oranı</label>
          <select value={params.ratio} onChange={e => setParams({...params, ratio: e.target.value})}>
            <option value="1:1">1:1 (Direkt)</option>
            <option value="2:1">2:1 (Endirekt)</option>
          </select>
        </div>
      </div>
      <div className="blain-results mt-20">
        <div className="result-item-tech">
          <span>STATİK BASINÇ</span>
          <strong>{results.pressure} bar</strong>
        </div>
        <div className="result-item-tech">
          <span>GEREKLİ DEBİ</span>
          <strong>{results.flow} lt/dk</strong>
        </div>
      </div>
    </div>
  );
};

const ProblemBank = ({ problems, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newProb, setNewProb] = useState({ title: '', definition: '', solution: '', alternatives: '' });

  return (
    <div className="eng-section glass">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="#f59e0b" />
          <h3>Teknik Problem Bankası</h3>
        </div>
        <button className="add-btn-mini" onClick={() => setShowAdd(true)}><Plus size={14} /></button>
      </div>

      <div className="problem-list mt-16">
        {problems.length === 0 ? (
          <div className="empty-mini-state">Henüz kayıtlı problem yok.</div>
        ) : (
          problems.map(p => (
            <div key={p.id} className="problem-card glass">
              <div className="pc-header">
                <strong>{p.title}</strong>
                <button className="delete-btn-tiny" onClick={() => onDelete(p.id)}><Trash2 size={12} /></button>
              </div>
              <div className="pc-content">
                <div className="pc-item"><span>SORUN:</span> {p.definition}</div>
                <div className="pc-item"><span>ÇÖZÜM:</span> {p.solution}</div>
                {p.alternatives && <div className="pc-item"><span>ALTERNATİF:</span> {p.alternatives}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <ActionSheet title="Yeni Problem Kaydı" onClose={() => setShowAdd(false)}>
          <div className="tech-form">
            <input placeholder="Başlık / Konu" value={newProb.title} onChange={e => setNewProb({...newProb, title: e.target.value})} />
            <textarea placeholder="Problem Tanımı" value={newProb.definition} onChange={e => setNewProb({...newProb, definition: e.target.value})} />
            <textarea placeholder="Uygulanan Çözüm" value={newProb.solution} onChange={e => setNewProb({...newProb, solution: e.target.value})} />
            <textarea placeholder="Alternatif Yöntemler" value={newProb.alternatives} onChange={e => setNewProb({...newProb, alternatives: e.target.value})} />
            <button className="submit-btn-tech" onClick={() => {
              if(!newProb.title) return toast.error('Başlık boş olamaz');
              onAdd(newProb);
              setShowAdd(false);
              setNewProb({ title: '', definition: '', solution: '', alternatives: '' });
            }}>KAYDET</button>
          </div>
        </ActionSheet>
      )}
    </div>
  );
};

const DecisionLog = ({ decisions, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDec, setNewDec] = useState({ 
    title: '', rationale: '', data: '', outcome: '', lesson: '', 
    criticality: 'medium', tags: '' 
  });

  return (
    <div className="decision-view animate-fadeIn">
      <div className="section-header-v2">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>🧠 Karar Günlüğü</h3>
          <p className="am-sub">Önemli kararlar, veriler ve kazanılan dersler</p>
        </div>
        <button className="add-btn-mini" onClick={() => setShowAdd(true)}><Plus size={14} /></button>
      </div>

      <div className="decision-timeline mt-20">
        {decisions.length === 0 ? (
          <div className="empty-state-v2">Henüz kayıtlı karar bulunmuyor.</div>
        ) : (
          decisions.map(d => (
            <div key={d.id} className="decision-card-v2 glass">
              <div className="dc-criticality" style={{ backgroundColor: CRITICALITY_LEVELS[d.criticality].color }}></div>
              <div className="dc-body">
                <div className="dc-header">
                  <div className="dc-meta">
                    <span className="dc-tag">{CRITICALITY_LEVELS[d.criticality].label}</span>
                    <span className="dc-date">{new Date(d.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <button className="delete-btn-tiny" onClick={() => onDelete(d.id)}><Trash2 size={12} /></button>
                </div>
                <h4>{d.title}</h4>
                
                <div className="dc-content-grid">
                  <div className="dc-item">
                    <div className="dc-label">DÜŞÜNCE / HİPOTEZ</div>
                    <p>{d.rationale}</p>
                  </div>
                  <div className="dc-item">
                    <div className="dc-label">VERİ DAYANAĞI</div>
                    <p>{d.data || 'Belirtilmedi'}</p>
                  </div>
                  <div className="dc-item">
                    <div className="dc-label">SONUÇ</div>
                    <p>{d.outcome}</p>
                  </div>
                  {d.lesson && (
                    <div className="dc-item lesson">
                      <div className="dc-label">ÖĞRENİLEN DERS</div>
                      <p>{d.lesson}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <ActionSheet title="Yeni Karar Kaydı" onClose={() => setShowAdd(false)}>
          <div className="tech-form">
            <input placeholder="Karar Başlığı" value={newDec.title} onChange={e => setNewDec({...newDec, title: e.target.value})} />
            
            <div className="select-group-tech">
              <label>Kritiklik Seviyesi</label>
              <div className="crit-selector">
                {Object.entries(CRITICALITY_LEVELS).map(([key, info]) => (
                  <button 
                    key={key}
                    className={`crit-btn ${newDec.criticality === key ? 'active' : ''}`}
                    style={{ '--c': info.color }}
                    onClick={() => setNewDec({...newDec, criticality: key})}
                  >
                    {info.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea placeholder="Ne düşündün? (Hipotez / Rationale)" value={newDec.rationale} onChange={e => setNewDec({...newDec, rationale: e.target.value})} />
            <textarea placeholder="Hangi veriyle karar verdin? (Evidence)" value={newDec.data} onChange={e => setNewDec({...newDec, data: e.target.value})} />
            <textarea placeholder="Sonuç ne oldu?" value={newDec.outcome} onChange={e => setNewDec({...newDec, outcome: e.target.value})} />
            <textarea placeholder="Öğrenilen Ders (Opsiyonel)" value={newDec.lesson} onChange={e => setNewDec({...newDec, lesson: e.target.value})} />
            
            <button className="submit-btn-tech" onClick={() => {
              if(!newDec.title) return toast.error('Başlık boş olamaz');
              onAdd(newDec);
              setShowAdd(false);
              setNewDec({ title: '', rationale: '', data: '', outcome: '', lesson: '', criticality: 'medium', tags: '' });
            }}>KARARI KAYDET</button>
          </div>
        </ActionSheet>
      )}
    </div>
  );
};

const CRMView = ({ crm, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onAddDeal, onUpdateDeal, onDeleteDeal }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', company: '', phone: '', status: 'lead', notes: '' });
  const [newDeal, setNewDeal] = useState({ customerId: '', title: '', amount: '', status: 'proposal' });

  const customers = crm?.customers || [];
  const deals = crm?.deals || [];

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Bilinmeyen Müşteri';

  return (
    <div className="crm-view animate-fadeIn">
      <div className="section-header-v2">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>💼 Mini CRM (Faz 3)</h3>
          <p className="am-sub">Eraylar Mühendislik Müşteri & Teklif Takibi</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="add-btn-mini" onClick={() => setShowAddCustomer(true)} title="Yeni Müşteri"><Users size={14} /></button>
          <button className="add-btn-mini" onClick={() => setShowAddDeal(true)} title="Yeni Teklif"><Briefcase size={14} /></button>
        </div>
      </div>

      <div className="crm-grid mt-20">
        <div className="crm-column">
          <div className="col-header"><Users size={16} /> Müşteriler</div>
          <div className="cust-list">
            {customers.length === 0 ? <div className="empty-mini-state">Müşteri kaydı yok.</div> : 
              customers.map(c => (
                <div key={c.id} className="cust-card glass">
                  <div className="cc-header">
                    <strong>{c.name}</strong>
                    <button className="delete-btn-tiny" onClick={() => onDeleteCustomer(c.id)}><Trash2 size={12} /></button>
                  </div>
                  <small>{c.company} · {c.phone}</small>
                  <div className={`status-badge ${c.status}`}>{c.status.toUpperCase()}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="crm-column">
          <div className="col-header"><Briefcase size={16} /> Teklifler & Projeler</div>
          <div className="deal-list">
            {deals.length === 0 ? <div className="empty-mini-state">Aktif teklif yok.</div> : 
              deals.map(d => (
                <div key={d.id} className="deal-card glass">
                  <div className="dc-header">
                    <strong>{d.title}</strong>
                    <button className="delete-btn-tiny" onClick={() => onDeleteDeal(d.id)}><Trash2 size={12} /></button>
                  </div>
                  <div className="dc-info">
                    <span>{getCustomerName(d.customerId)}</span>
                    <strong className="amount">{d.amount}₺</strong>
                  </div>
                  <div className={`status-badge deal ${d.status}`}>{d.status.toUpperCase()}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {showAddCustomer && (
        <ActionSheet title="Yeni Müşteri Kaydı" onClose={() => setShowAddCustomer(false)}>
          <div className="tech-form">
            <input placeholder="Müşteri Adı Soyadı" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
            <input placeholder="Firma / Kurum" value={newCust.company} onChange={e => setNewCust({...newCust, company: e.target.value})} />
            <input placeholder="Telefon" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
            <select value={newCust.status} onChange={e => setNewCust({...newCust, status: e.target.value})}>
              <option value="lead">Aday (Lead)</option>
              <option value="active">Aktif Müşteri</option>
              <option value="passive">Pasif</option>
            </select>
            <textarea placeholder="Notlar" value={newCust.notes} onChange={e => setNewCust({...newCust, notes: e.target.value})} />
            <button className="submit-btn-tech" onClick={() => {
              if(!newCust.name) return toast.error('İsim gerekli');
              onAddCustomer(newCust);
              setShowAddCustomer(false);
              setNewCust({ name: '', company: '', phone: '', status: 'lead', notes: '' });
            }}>KAYDET</button>
          </div>
        </ActionSheet>
      )}

      {showAddDeal && (
        <ActionSheet title="Yeni Teklif Girişi" onClose={() => setShowAddDeal(false)}>
          <div className="tech-form">
            <select value={newDeal.customerId} onChange={e => setNewDeal({...newDeal, customerId: e.target.value})}>
              <option value="">Müşteri Seçin</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Teklif/Proje Başlığı" value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} />
            <input type="number" placeholder="Tutar (₺)" value={newDeal.amount} onChange={e => setNewDeal({...newDeal, amount: e.target.value})} />
            <select value={newDeal.status} onChange={e => setNewDeal({...newDeal, status: e.target.value})}>
              <option value="proposal">Teklif Verildi</option>
              <option value="negotiation">Görüşme Aşamasında</option>
              <option value="won">Kazanıldı</option>
              <option value="lost">Kaybedildi</option>
            </select>
            <button className="submit-btn-tech" onClick={() => {
              if(!newDeal.customerId || !newDeal.title) return toast.error('Müşteri ve Başlık gerekli');
              onAddDeal(newDeal);
              setShowAddDeal(false);
              setNewDeal({ customerId: '', title: '', amount: '', status: 'proposal' });
            }}>TEKLİFİ KAYDET</button>
          </div>
        </ActionSheet>
      )}
    </div>
  );
};

const LifeView = ({ life, onAddRoutine, onToggleRoutine, onDeleteRoutine, onAddProgram, onDeleteProgram }) => {
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ task: '', time: '09:00', days: 'Her gün' });
  const [newProg, setNewProg] = useState({ title: '', content: '', type: 'diet' });

  const routines = life?.routines || [];
  const programs = life?.programs || [];

  return (
    <div className="life-view animate-fadeIn">
      <div className="section-header-v2">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>⏳ Hayat Yönetimi (Faz 3)</h3>
          <p className="am-sub">Günlük rutinler ve gelişim programları</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="add-btn-mini" onClick={() => setShowAddRoutine(true)} title="Yeni Rutin"><ListTodo size={14} /></button>
          <button className="add-btn-mini" onClick={() => setShowAddProgram(true)} title="Yeni Program"><Sparkles size={14} /></button>
        </div>
      </div>

      <div className="life-grid mt-20">
        <div className="life-column routines">
          <div className="col-header"><CalendarCheck size={16} /> Günlük Rutin Takibi</div>
          <div className="routine-list">
            {routines.length === 0 ? <div className="empty-mini-state">Rutin tanımlanmamış.</div> : 
              routines.map(r => (
                <div key={r.id} className={`routine-item glass ${r.completed ? 'done' : ''}`} onClick={() => onToggleRoutine(r.id)}>
                  <div className="ri-check">{r.completed ? <CheckCircle2 size={18} color="#10b981" /> : <div className="ri-circle"></div>}</div>
                  <div className="ri-info">
                    <strong>{r.task}</strong>
                    <small>{r.time} · {r.days}</small>
                  </div>
                  <button className="delete-btn-tiny" onClick={(e) => { e.stopPropagation(); onDeleteRoutine(r.id); }}><X size={12} /></button>
                </div>
              ))
            }
          </div>
        </div>

        <div className="life-column programs">
          <div className="col-header"><Target size={16} /> Programlar & Planlar</div>
          <div className="prog-list">
            {programs.length === 0 ? <div className="empty-mini-state">Aktif program yok.</div> : 
              programs.map(p => (
                <div key={p.id} className="prog-card glass">
                  <div className="pc-header">
                    <div className="pc-title">
                      {p.type === 'diet' ? <Pill size={14} /> : <Activity size={14} />}
                      <strong>{p.title}</strong>
                    </div>
                    <button className="delete-btn-tiny" onClick={() => onDeleteProgram(p.id)}><Trash2 size={12} /></button>
                  </div>
                  <p className="pc-body">{p.content}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {showAddRoutine && (
        <ActionSheet title="Yeni Rutin Ekle" onClose={() => setShowAddRoutine(false)}>
          <div className="tech-form">
            <input placeholder="Görev/Aktivite" value={newRoutine.task} onChange={e => setNewRoutine({...newRoutine, task: e.target.value})} />
            <input type="time" value={newRoutine.time} onChange={e => setNewRoutine({...newRoutine, time: e.target.value})} />
            <input placeholder="Günler (Örn: Pzt, Sal veya Her gün)" value={newRoutine.days} onChange={e => setNewRoutine({...newRoutine, days: e.target.value})} />
            <button className="submit-btn-tech" onClick={() => {
              if(!newRoutine.task) return toast.error('Görev adı gerekli');
              onAddRoutine(newRoutine);
              setShowAddRoutine(false);
              setNewRoutine({ task: '', time: '09:00', days: 'Her gün' });
            }}>EKLE</button>
          </div>
        </ActionSheet>
      )}

      {showAddProgram && (
        <ActionSheet title="Yeni Program Oluştur" onClose={() => setShowAddProgram(false)}>
          <div className="tech-form">
            <input placeholder="Program Başlığı" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} />
            <select value={newProg.type} onChange={e => setNewProg({...newProg, type: e.target.value})}>
              <option value="diet">Beslenme / Diyet</option>
              <option value="work">Çalışma Planı</option>
              <option value="training">Antrenman</option>
            </select>
            <textarea placeholder="Program İçeriği / Detaylar" value={newProg.content} onChange={e => setNewProg({...newProg, content: e.target.value})} />
            <button className="submit-btn-tech" onClick={() => {
              if(!newProg.title) return toast.error('Başlık gerekli');
              onAddProgram(newProg);
              setShowAddProgram(false);
              setNewProg({ title: '', content: '', type: 'diet' });
            }}>OLUŞTUR</button>
          </div>
        </ActionSheet>
      )}
    </div>
  );
};

// --- Main Component ---

const Muhendislik = () => {
  const navigate = useNavigate();
  const { 
    muhendislik, 
    addEngineeringProblem, deleteEngineeringProblem,
    addEngineeringDecision, deleteEngineeringDecision,
    updatePinnedConversion,
    addCrmCustomer, updateCrmCustomer, deleteCrmCustomer,
    addCrmDeal, updateCrmDeal, deleteCrmDeal,
    addLifeRoutine, toggleLifeRoutine, deleteLifeRoutine,
    addLifeProgram, deleteLifeProgram
  } = useStore();

  const [activeTab, setActiveTab] = useState('muhendislik');
  const [showConfirm, setShowConfirm] = useState({ open: false, message: '', onConfirm: null });

  const currentModule = muhendislik || { 
    pinnedConversions: [], problemBank: [], decisionLog: [] 
  };

  return (
    <AnimatedPage className="muhendislik-container">
      <header className="module-header glass" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">⚙️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Mühendislik</h1>
              <p>Görkem'in Teknik Atölyesi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} style={{ marginBottom: '2px' }} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="muhendislik-scroll-content">
        {activeTab === 'muhendislik' && (
          <div className="muhendislik-view animate-fadeIn">
            <QuickCalc 
              conversions={currentModule.pinnedConversions} 
              updatePinned={updatePinnedConversion} 
            />
            <BlainCalculator />
            <ProblemBank 
              problems={currentModule.problemBank} 
              onAdd={addEngineeringProblem}
              onDelete={(id) => setShowConfirm({
                open: true,
                message: 'Bu problemi silmek istediğinize emin misiniz?',
                onConfirm: () => deleteEngineeringProblem(id)
              })}
            />
          </div>
        )}

        {activeTab === 'karar' && (
          <DecisionLog 
            decisions={currentModule.decisionLog}
            onAdd={addEngineeringDecision}
            onDelete={(id) => setShowConfirm({
              open: true,
              message: 'Bu kararı silmek istediğinize emin misiniz?',
              onConfirm: () => deleteEngineeringDecision(id)
            })}
          />
        )}

        {activeTab === 'crm' && (
          <CRMView 
            crm={currentModule.crm}
            onAddCustomer={addCrmCustomer}
            onUpdateCustomer={updateCrmCustomer}
            onDeleteCustomer={(id) => setShowConfirm({
              open: true,
              message: 'Müşteri kaydını silmek istediğinize emin misiniz?',
              onConfirm: () => deleteCrmCustomer(id)
            })}
            onAddDeal={addCrmDeal}
            onUpdateDeal={updateCrmDeal}
            onDeleteDeal={(id) => setShowConfirm({
              open: true,
              message: 'Teklif kaydını silmek istediğinize emin misiniz?',
              onConfirm: () => deleteCrmDeal(id)
            })}
          />
        )}

        {activeTab === 'hayat' && (
          <LifeView 
            life={currentModule.life}
            onAddRoutine={addLifeRoutine}
            onToggleRoutine={toggleLifeRoutine}
            onDeleteRoutine={(id) => setShowConfirm({
              open: true,
              message: 'Rutin kaydını silmek istediğinize emin misiniz?',
              onConfirm: () => deleteLifeRoutine(id)
            })}
            onAddProgram={addLifeProgram}
            onDeleteProgram={(id) => setShowConfirm({
              open: true,
              message: 'Programı silmek istediğinize emin misiniz?',
              onConfirm: () => deleteLifeProgram(id)
            })}
          />
        )}

        {activeTab === 'arsiv' && (
          <div className="placeholder-view glass animate-fadeIn">
            <div className="empty-icon-circle-tech">
              <Library size={48} color="#64748b" />
            </div>
            <h2>Arşiv Sekmesi Boş</h2>
            <p>Bu sekme isteğiniz üzerine şimdilik boş bırakılmıştır. 📦</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={showConfirm.open}
        message={showConfirm.message}
        onConfirm={() => {
          showConfirm.onConfirm();
          setShowConfirm({ open: false, message: '', onConfirm: null });
        }}
        onCancel={() => setShowConfirm({ open: false, message: '', onConfirm: null })}
      />
    </AnimatedPage>
  );
};

export default Muhendislik;
