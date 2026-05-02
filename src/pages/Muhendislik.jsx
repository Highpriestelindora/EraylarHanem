import React, { useState, useMemo } from 'react';
import { 
  Cpu, ArrowLeft, Terminal, Code2, Database, Zap, 
  Settings, GitBranch, Library, StickyNote, Plus, 
  Trash2, Edit2, Search, Filter, AlertCircle, 
  CheckCircle2, ChevronRight, ChevronDown, Clock,
  ExternalLink, Info, Calculator, Ruler, ArrowRightLeft,
  Pill, FileText, Activity
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
  { id: 'projeler', label: 'Projeler', icon: Code2 },
  { id: 'arsiv', label: 'Arşiv', icon: Library },
  { id: 'notlar', label: 'Notlar', icon: StickyNote }
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

// --- Main Component ---

const Muhendislik = () => {
  const navigate = useNavigate();
  const { 
    muhendislik, 
    addEngineeringProblem, deleteEngineeringProblem,
    addEngineeringDecision, deleteEngineeringDecision,
    updatePinnedConversion
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

        {['projeler', 'arsiv', 'notlar'].includes(activeTab) && (
          <div className="placeholder-view glass animate-fadeIn">
            <div className="empty-icon-circle-tech">
              <Terminal size={48} color="#6366f1" />
            </div>
            <h2>Bu Sekme Hazırlanıyor...</h2>
            <p>Seçtiğiniz modül şu an geliştirme aşamasındadır. Yakında aktif olacaktır. 🛠️</p>
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
