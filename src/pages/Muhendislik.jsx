import React, { useState, useMemo, useEffect } from 'react';
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
import { 
  ENGINEERING_UNITS, 
  ENGINEERING_CONVERSIONS 
} from '../constants/data';
import './Muhendislik.css';

// --- Types & Constants ---
const TABS = [
  { id: 'muhendislik', label: 'Mühendislik', icon: Cpu },
  { id: 'karar', label: 'Karar', icon: GitBranch },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'arsiv', label: 'Arşiv', icon: Library },
  { id: 'hayat', label: 'Hayat', icon: CalendarCheck }
];

const CRITICALITY_LEVELS = {
  low: { label: 'Operasyonel', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
  medium: { label: 'Stratejik', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  high: { label: 'Kritik', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

// --- Sub-Components

const QuickCalc = ({ pinnedIds = [], onTogglePin }) => {
  const [inputs, setInputs] = useState({});
  const [showAll, setShowAll] = useState(false);

  // Fallback for pinnedIds if they are not provided or invalid
  const activePinnedIds = useMemo(() => {
    const valid = Array.isArray(pinnedIds) ? pinnedIds : [];
    if (valid.length === 0) return ['p_bar_psi', 'f_kg_lb', 'q_lmin_gpm'];
    return valid;
  }, [pinnedIds]);

  const handleConvert = (convId, val) => {
    const conv = ENGINEERING_CONVERSIONS.find(c => c.id === convId);
    if (!conv) return 0;
    const numVal = parseFloat(val) || 0;
    const fromUnit = ENGINEERING_UNITS[conv.type]?.find(u => u.id === conv.from);
    const toUnit = ENGINEERING_UNITS[conv.type]?.find(u => u.id === conv.to);
    if (!fromUnit || !toUnit) return 0;
    return (numVal * (toUnit.factor / fromUnit.factor)).toFixed(3);
  };

  const pinnedConvs = ENGINEERING_CONVERSIONS.filter(c => activePinnedIds.includes(c.id));

  return (
    <div className="eng-section glass mb-20">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={18} color="#6366f1" />
          <h3>Hızlı Hesap & Çevrim</h3>
        </div>
        <button className="manage-btn-tech" onClick={() => setShowAll(true)}>
          <Settings size={14} /> Birim Yönetimi
        </button>
      </div>

      <div className="conversion-grid mt-16">
        {pinnedConvs.map(conv => (
          <div key={conv.id} className="conv-card glass highlight">
            <div className="conv-labels">
              <span>{conv.from.toUpperCase()}</span>
              <ArrowRightLeft size={12} opacity={0.5} />
              <span>{conv.to.toUpperCase()}</span>
            </div>
            <div className="conv-inputs">
              <input 
                type="number" 
                placeholder={conv.from}
                value={inputs[conv.id] || ''}
                onChange={(e) => setInputs({...inputs, [conv.id]: e.target.value})}
              />
              <div className="conv-result">
                {handleConvert(conv.id, inputs[conv.id])} <small>{conv.to}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ActionSheet 
        isOpen={showAll} 
        title="Mühendislik Çevrim Kütüphanesi" 
        onClose={() => setShowAll(false)}
      >
        <div className="unit-selector-grid">
          {ENGINEERING_CONVERSIONS.map(conv => {
            const isPinned = activePinnedIds.includes(conv.id);
            return (
              <div 
                key={conv.id} 
                className={`unit-item-card ${isPinned ? 'pinned' : ''}`}
                onClick={() => onTogglePin(conv.id)}
              >
                <div className="uic-info">
                  <strong>{conv.label}</strong>
                  <span>{conv.type.toUpperCase()}</span>
                </div>
                <div className="uic-check">
                  {isPinned ? <Star size={18} fill="#f59e0b" color="#f59e0b" /> : <Star size={18} opacity={0.2} />}
                </div>
              </div>
            );
          })}
        </div>
        <p className="hint-text mt-16">* Favori 3 çevriminizi seçebilirsiniz.</p>
      </ActionSheet>
    </div>
  );
};

const HydraulicProModal = ({ isOpen, onClose }) => {
  const [unitSystem, setUnitSystem] = useState('SI'); // SI or US
  const [isTelescopic, setIsTelescopic] = useState(false);
  const [stages, setStages] = useState(2);
  const [diameters, setDiameters] = useState([100, 80, 70, 60, 50]);
  const [params, setParams] = useState({
    cylinders: 1,
    transmission: 2,
    speed: 0.6, // m/s or ft/min
    pumpFlow: 150, // l/min or gpm
    emptyCabin: 400, // kg or lb
    addLoad: 500, // kg or lb
    stroke: 12900, // mm or inch
    lossFactor: 1.3
  });

  const conv = {
    mm2in: 1/25.4,
    in2mm: 25.4,
    kg2lb: 2.20462,
    lb2kg: 1/2.20462,
    l2gal: 0.264172,
    gal2l: 1/0.264172,
    ms2fpm: 196.85,
    fpm2ms: 1/196.85,
    bar2psi: 14.5038,
    kw2hp: 1.34102
  };

  const results = useMemo(() => {
    const g = 9.80665;
    
    // Convert all to SI for calculation
    let d_mm = isTelescopic 
      ? diameters.map(d => unitSystem === 'US' ? d * conv.in2mm : d)
      : [unitSystem === 'US' ? diameters[0] * conv.in2mm : diameters[0]];
    
    let n = parseFloat(params.cylinders);
    let i_ratio = parseFloat(params.transmission);
    let v_ms = unitSystem === 'US' ? params.speed * conv.fpm2ms : parseFloat(params.speed);
    let q_lmin = unitSystem === 'US' ? params.pumpFlow * conv.gal2l : parseFloat(params.pumpFlow);
    let m_empty = unitSystem === 'US' ? params.emptyCabin * conv.lb2kg : parseFloat(params.emptyCabin);
    let m_load = unitSystem === 'US' ? params.addLoad * conv.lb2kg : parseFloat(params.addLoad);
    let z_mm = unitSystem === 'US' ? params.stroke * conv.in2mm : parseFloat(params.stroke);

    let sumAreas = 0;
    const stagesToUse = isTelescopic ? stages : 1;
    for (let j = 0; j < stagesToUse; j++) {
      sumAreas += Math.PI * Math.pow(d_mm[j] / 2, 2);
    }
    const areaTotal_mm2 = (sumAreas / stagesToUse) * n;
    const areaEff_mm2 = areaTotal_mm2 / i_ratio;
    
    const p_min_bar = (m_empty * g) / (areaEff_mm2) * 10;
    const p_max_bar = ((m_empty + m_load) * g) / (areaEff_mm2) * 10;
    const calcFlow_lmin = (areaEff_mm2 * v_ms * 60) / 1000;
    const calcSpeed_ms = (q_lmin * 1000) / (areaEff_mm2 * 60);
    const power_kw = (p_max_bar * q_lmin * params.lossFactor) / 600;
    const volume_l = (areaTotal_mm2 * z_mm) / 1000000;

    if (unitSystem === 'US') {
      return {
        p_min: (p_min_bar * conv.bar2psi).toFixed(1),
        p_max: (p_max_bar * conv.bar2psi).toFixed(1),
        area: (areaTotal_mm2 * Math.pow(conv.mm2in, 2) / 100).toFixed(2), // sq inch
        speed: (calcSpeed_ms * conv.ms2fpm).toFixed(1),
        flow: (calcFlow_lmin * conv.l2gal).toFixed(1),
        power: (power_kw * conv.kw2hp).toFixed(2),
        volume: (volume_l * conv.l2gal).toFixed(1),
        unitP: 'psi', unitQ: 'gpm', unitV: 'fpm', unitPow: 'hp', unitVol: 'gal', unitArea: 'in²'
      };
    }

    return {
      p_min: p_min_bar.toFixed(2),
      p_max: p_max_bar.toFixed(2),
      area: (areaTotal_mm2 / 100).toFixed(2), // cm2
      speed: calcSpeed_ms.toFixed(2),
      flow: calcFlow_lmin.toFixed(1),
      power: power_kw.toFixed(2),
      volume: volume_l.toFixed(1),
      unitP: 'bar', unitQ: 'l/min', unitV: 'm/s', unitPow: 'kW', unitVol: 'lt', unitArea: 'cm²'
    };
  }, [isTelescopic, stages, diameters, params, unitSystem]);

  return (
    <ActionSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Hidrolik Asansör Teknik Hesaplama (Full Spec)"
      fullHeight={true}
    >
      <div className="pro-calc-container">
        <div className="pro-calc-tabs mb-24">
          <button className={`tab-btn ${unitSystem === 'SI' ? 'active' : ''}`} onClick={() => setUnitSystem('SI')}>Metric (SI)</button>
          <button className={`tab-btn ${unitSystem === 'US' ? 'active' : ''}`} onClick={() => setUnitSystem('US')}>US Units (Imperial)</button>
        </div>

        <div className="pro-calc-grid">
          <div className="pro-inputs">
            <div className="pro-field-group mb-20">
              <label className="pro-check">
                <input type="checkbox" checked={isTelescopic} onChange={e => setIsTelescopic(e.target.checked)} />
                <span>Teleskopik Silindir Sistemi</span>
              </label>
            </div>

            {isTelescopic ? (
              <div className="telescopic-config glass mb-20">
                <div className="pro-field">
                  <label>Kademe Sayısı (2-5)</label>
                  <input type="number" min="2" max="5" value={stages} onChange={e => setStages(Math.min(5, Math.max(2, e.target.value)))} />
                </div>
                <div className="diameters-grid mt-12">
                  {Array.from({ length: stages }).map((_, i) => (
                    <div key={i} className="pro-field">
                      <label>{i+1}. Çap ({unitSystem === 'SI' ? 'Ø mm' : 'Ø in'})</label>
                      <input type="number" value={diameters[i]} onChange={e => {
                        const newD = [...diameters];
                        newD[i] = parseFloat(e.target.value) || 0;
                        setDiameters(newD);
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pro-field mb-20">
                <label>Piston Çapı ({unitSystem === 'SI' ? 'Ø mm' : 'Ø in'})</label>
                <input type="number" value={diameters[0]} onChange={e => setDiameters([parseFloat(e.target.value) || 0, ...diameters.slice(1)])} />
              </div>
            )}

            <div className="pro-field-row mb-20">
              <div className="pro-field">
                <label>Silindir Adedi</label>
                <input type="number" value={params.cylinders} onChange={e => setParams({...params, cylinders: e.target.value})} />
              </div>
              <div className="pro-field">
                <label>Askı Oranı (i)</label>
                <select value={params.transmission} onChange={e => setParams({...params, transmission: parseFloat(e.target.value)})}>
                  <option value="1">1:1 Direkt</option>
                  <option value="2">2:1 Endirekt</option>
                  <option value="4">4:1 Endirekt</option>
                </select>
              </div>
            </div>

            <div className="pro-field-row mb-20">
              <div className="pro-field">
                <label>Seyir Hızı ({unitSystem === 'SI' ? 'm/s' : 'ft/min'})</label>
                <input type="number" step="0.05" value={params.speed} onChange={e => setParams({...params, speed: e.target.value})} />
              </div>
              <div className="pro-field">
                <label>Pompa Debisi ({unitSystem === 'SI' ? 'l/min' : 'gpm'})</label>
                <input type="number" value={params.pumpFlow} onChange={e => setParams({...params, pumpFlow: e.target.value})} />
              </div>
            </div>

            <div className="pro-field-row mb-20">
              <div className="pro-field">
                <label>Boş Kabin ({unitSystem === 'SI' ? 'kg' : 'lb'})</label>
                <input type="number" value={params.emptyCabin} onChange={e => setParams({...params, emptyCabin: e.target.value})} />
              </div>
              <div className="pro-field">
                <label>Beyan Yükü ({unitSystem === 'SI' ? 'kg' : 'lb'})</label>
                <input type="number" value={params.addLoad} onChange={e => setParams({...params, addLoad: e.target.value})} />
              </div>
            </div>

            <div className="pro-field-row mb-20">
              <div className="pro-field">
                <label>Piston Kursu ({unitSystem === 'SI' ? 'mm' : 'in'})</label>
                <input type="number" value={params.stroke} onChange={e => setParams({...params, stroke: e.target.value})} />
              </div>
              <div className="pro-field">
                <label>Kayıp Faktörü (η)</label>
                <input type="number" step="0.1" value={params.lossFactor} onChange={e => setParams({...params, lossFactor: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pro-results">
            <div className="res-section mb-20 highlight-blue">
              <h4 className="res-title">BASINÇ VERİLERİ</h4>
              <div className="res-item">
                <span>Statik Basınç (Pst-min)</span>
                <strong>{results.p_min} <small>{results.unitP}</small></strong>
              </div>
              <div className="res-item highlight">
                <span>Statik Basınç (Pst-max)</span>
                <strong>{results.p_max} <small>{results.unitP}</small></strong>
              </div>
            </div>

            <div className="res-section mb-20">
              <h4 className="res-title">HİDROLİK & GÜÇ</h4>
              <div className="res-item">
                <span>Gerekli Debi (Q)</span>
                <strong>{results.flow} <small>{results.unitQ}</small></strong>
              </div>
              <div className="res-item highlight">
                <span>Motor Gücü (P)</span>
                <strong>{results.power} <small>{results.unitPow}</small></strong>
              </div>
              <div className="res-item">
                <span>Yağ Hacmi (V)</span>
                <strong>{results.volume} <small>{results.unitVol}</small></strong>
              </div>
            </div>

            <div className="res-section mb-24">
              <h4 className="res-title">SİSTEM ÖZETİ</h4>
              <div className="res-item">
                <span>Toplam Efektif Alan</span>
                <strong>{results.area} <small>{results.unitArea}</small></strong>
              </div>
              <div className="res-item">
                <span>Hesaplanan Hız (v)</span>
                <strong>{results.speed} <small>{results.unitV}</small></strong>
              </div>
              <div className="res-item">
                <span>Tahmini Kapasite</span>
                <strong>{results.persons} <small>Kişi</small></strong>
              </div>
            </div>
            
            <div className="pro-disclaimer">
              * Bu araç yerel asansör yönetmeliklerinin (EN 81-20 vb.) yerini almaz. Tüm teknik veriler saha uygulaması öncesi doğrulanmalıdır.
            </div>
          </div>
        </div>
      </div>
    </ActionSheet>
  );
};

const BlainCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="eng-section glass mb-24 blain-launcher-v3">
      <div className="launcher-content">
        <div className="launcher-info">
          <div className="logo-row-tech">
            <h3>Hidrolik Asansör Hesap Makinası</h3>
          </div>
          <p>Mühendislik Standartları · Teleskopik · Güç & Basınç</p>
        </div>
        <button className="pro-launch-btn" onClick={() => setIsOpen(true)}>
          HESAPLAYICIYI AÇ <ArrowRightLeft size={16} />
        </button>
      </div>
      <HydraulicProModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const ProblemBank = ({ problems, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newProb, setNewProb] = useState({ title: '', definition: '', solution: '', alternatives: '' });

  const handleSave = async () => {
    if (!newProb.title.trim() || !newProb.definition.trim()) {
      return toast.error('Başlık ve Tanım gerekli');
    }
    
    try {
      const payload = {
        title: newProb.title.trim(),
        definition: newProb.definition.trim(),
        solution: newProb.solution.trim(),
        alternatives: newProb.alternatives.trim()
      };
      
      onAdd(payload);
      toast.success('Kayıt başarılı');
      setShowAdd(false);
      setNewProb({ title: '', definition: '', solution: '', alternatives: '' });
    } catch (error) {
      toast.error('Kayıt hatası');
    }
  };

  return (
    <div className="eng-section glass mb-20">
      <div className="section-header-v2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="#f59e0b" />
          <h3>Teknik Problem Bankası</h3>
        </div>
        <button className="add-tech-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
        </button>
      </div>

      <div className="problem-list mt-16">
        {problems.length === 0 ? (
          <div className="empty-mini-state-v2">
            <Info size={24} opacity={0.3} />
            <p>Henüz kayıtlı problem yok. Mühendislik tecrübelerini buraya aktarabilirsin.</p>
          </div>
        ) : (
          problems.map(p => (
            <div key={p.id} className="problem-card glass-v2 animate-slideIn">
              <div className="pc-header">
                <div className="pc-title-row">
                  <Terminal size={14} color="#6366f1" />
                  <strong>{p.title}</strong>
                </div>
                <button className="delete-btn-tiny" onClick={() => onDelete(p.id)}><Trash2 size={12} /></button>
              </div>
              <div className="pc-content">
                <div className="pc-item">
                  <div className="pc-label-v2">SORUN</div>
                  <p>{p.definition}</p>
                </div>
                <div className="pc-item solution-box">
                  <div className="pc-label-v2">ÇÖZÜM</div>
                  <p>{p.solution || '...'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ActionSheet 
        isOpen={showAdd} 
        title="Yeni Teknik Kayıt" 
        onClose={() => setShowAdd(false)}
      >
        <div className="tech-form-v2">
          <div className="form-group-v2">
            <label>BAŞLIK</label>
            <input placeholder="..." value={newProb.title} onChange={e => setNewProb({...newProb, title: e.target.value})} />
          </div>
          <div className="form-group-v2">
            <label>SORUN</label>
            <textarea placeholder="..." value={newProb.definition} onChange={e => setNewProb({...newProb, definition: e.target.value})} />
          </div>
          <div className="form-group-v2">
            <label>ÇÖZÜM</label>
            <textarea placeholder="..." value={newProb.solution} onChange={e => setNewProb({...newProb, solution: e.target.value})} />
          </div>
          <button className="submit-btn-tech-v2" onClick={handleSave}>KAYDET</button>
        </div>
      </ActionSheet>
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

      <ActionSheet 
        isOpen={showAdd} 
        title="Yeni Karar Kaydı" 
        onClose={() => setShowAdd(false)}
      >
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>KARAR BAŞLIĞI</label>
            <input 
              placeholder="Örn: X Projesinde Y Teknolojisi Seçimi" 
              value={newDec.title} 
              onChange={e => setNewDec({...newDec, title: e.target.value})} 
            />
          </div>
          
          <div className="tech-input-group">
            <label>KRİTİKLİK SEVİYESİ</label>
            <div className="crit-selector-v2">
              {Object.entries(CRITICALITY_LEVELS).map(([key, info]) => (
                <button 
                  key={key}
                  className={`crit-btn-v2 ${newDec.criticality === key ? 'active' : ''}`}
                  style={{ '--crit-color': info.color }}
                  onClick={() => setNewDec({...newDec, criticality: key})}
                >
                  <div className="crit-dot" />
                  {info.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>HİPOTEZ / RATIONALE</label>
              <textarea 
                placeholder="Neden bu kararı düşündün?" 
                value={newDec.rationale} 
                onChange={e => setNewDec({...newDec, rationale: e.target.value})} 
              />
            </div>
            <div className="tech-input-group">
              <label>VERİ / EVIDENCE</label>
              <textarea 
                placeholder="Hangi veriye dayandırdın?" 
                value={newDec.data} 
                onChange={e => setNewDec({...newDec, data: e.target.value})} 
              />
            </div>
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>SONUÇ / OUTCOME</label>
              <textarea 
                placeholder="Sonuç ne oldu?" 
                value={newDec.outcome} 
                onChange={e => setNewDec({...newDec, outcome: e.target.value})} 
              />
            </div>
            <div className="tech-input-group">
              <label>ÖĞRENİLEN DERS</label>
              <textarea 
                placeholder="Gelecek için notun nedir?" 
                value={newDec.lesson} 
                onChange={e => setNewDec({...newDec, lesson: e.target.value})} 
              />
            </div>
          </div>
          
          <button className="pro-submit-btn-tech" onClick={() => {
            if(!newDec.title) return toast.error('Başlık boş olamaz');
            onAdd(newDec);
            setShowAdd(false);
            setNewDec({ title: '', rationale: '', data: '', outcome: '', lesson: '', criticality: 'medium', tags: '' });
          }}>
            <Zap size={18} /> KARARI SİSTEME KAYDET
          </button>
        </div>
      </ActionSheet>
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
      <div className="crm-dashboard mb-24">
        <div className="crm-stats glass">
          <div className="stat-card">
            <span>Müşteriler</span>
            <strong>{customers.length}</strong>
          </div>
          <div className="stat-card highlight">
            <span>Aktif Teklifler</span>
            <strong>{deals.filter(d => d.status === 'proposal').length}</strong>
          </div>
          <div className="stat-card">
            <span>Kazanılan</span>
            <strong>{deals.filter(d => d.status === 'won').length}</strong>
          </div>
        </div>
      </div>

      <div className="section-header-v2">
        <h3>Müşteri Portföyü</h3>
        <button className="add-tech-btn" onClick={() => setShowAddCustomer(true)}>
          <Plus size={18} />
        </button>
      </div>

      <div className="customer-list mt-16 mb-32">
        {customers.length === 0 ? (
          <div className="empty-mini-state-v2">Müşteri kaydı bulunmuyor.</div>
        ) : (
          customers.map(c => (
            <div key={c.id} className="customer-card glass mb-12">
              <div className="c-info">
                <div className="c-name-row">
                  <strong>{c.name}</strong>
                  <span className={`status-badge ${c.status}`}>{c.status.toUpperCase()}</span>
                </div>
                <p>{c.company} · {c.phone}</p>
              </div>
              <button className="delete-btn-tiny" onClick={() => onDeleteCustomer(c.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="section-header-v2">
        <h3>Teklifler & Projeler</h3>
        <button className="add-tech-btn" onClick={() => setShowAddDeal(true)}>
          <Plus size={18} />
        </button>
      </div>

      <div className="deal-list mt-16">
        {deals.length === 0 ? (
          <div className="empty-mini-state-v2">Henüz teklif girilmedi.</div>
        ) : (
          deals.map(d => {
            const customer = customers.find(c => c.id === d.customerId);
            return (
              <div key={d.id} className="deal-card glass highlight mb-12">
                <div className="d-main">
                  <strong>{d.title}</strong>
                  <span>{customer?.name || 'Bilinmeyen Müşteri'}</span>
                </div>
                <div className="d-meta">
                  <div className="d-amount">{parseFloat(d.amount).toLocaleString('tr-TR')} ₺</div>
                  <span className={`deal-status ${d.status}`}>{d.status}</span>
                </div>
                <button className="delete-btn-tiny" onClick={() => onDeleteDeal(d.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <ActionSheet 
        isOpen={showAddCustomer} 
        title="Yeni Müşteri Kaydı" 
        onClose={() => setShowAddCustomer(false)}
      >
        <div className="tech-form-container">
          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>AD SOYAD</label>
              <input placeholder="Müşteri İsmi" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>FİRMA / KURUM</label>
              <input placeholder="Firma Adı" value={newCust.company} onChange={e => setNewCust({...newCust, company: e.target.value})} />
            </div>
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>TELEFON</label>
              <input placeholder="05xx..." value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>MÜŞTERİ DURUMU</label>
              <select value={newCust.status} onChange={e => setNewCust({...newCust, status: e.target.value})}>
                <option value="lead">Aday (Lead)</option>
                <option value="active">Aktif Müşteri</option>
                <option value="passive">Pasif</option>
              </select>
            </div>
          </div>

          <div className="tech-input-group">
            <label>NOTLAR</label>
            <textarea placeholder="Müşteri hakkında ek bilgiler..." value={newCust.notes} onChange={e => setNewCust({...newCust, notes: e.target.value})} />
          </div>

          <button className="pro-submit-btn-tech" onClick={() => {
            if(!newCust.name) return toast.error('İsim gerekli');
            onAddCustomer(newCust);
            setShowAddCustomer(false);
            setNewCust({ name: '', company: '', phone: '', status: 'lead', notes: '' });
          }}>MÜŞTERİYİ KAYDET</button>
        </div>
      </ActionSheet>

      <ActionSheet 
        isOpen={showAddDeal} 
        title="Yeni Teklif Girişi" 
        onClose={() => setShowAddDeal(false)}
      >
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>MÜŞTERİ SEÇİN</label>
            <select value={newDeal.customerId} onChange={e => setNewDeal({...newDeal, customerId: e.target.value})}>
              <option value="">İlgili Müşteriyi Seçin</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="tech-input-group">
            <label>TEKLİF / PROJE BAŞLIĞI</label>
            <input placeholder="Örn: X Rezidans Modernizasyon" value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} />
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>TUTAR (₺)</label>
              <input type="number" placeholder="0.00" value={newDeal.amount} onChange={e => setNewDeal({...newDeal, amount: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>GÜNCEL DURUM</label>
              <select value={newDeal.status} onChange={e => setNewDeal({...newDeal, status: e.target.value})}>
                <option value="proposal">Teklif Verildi</option>
                <option value="negotiation">Görüşme Aşamasında</option>
                <option value="won">Kazanıldı</option>
                <option value="lost">Kaybedildi</option>
              </select>
            </div>
          </div>

          <button className="pro-submit-btn-tech" onClick={() => {
            if(!newDeal.customerId || !newDeal.title) return toast.error('Müşteri ve Başlık gerekli');
            onAddDeal(newDeal);
            setShowAddDeal(false);
            setNewDeal({ customerId: '', title: '', amount: '', status: 'proposal' });
          }}>TEKLİFİ SİSTEME İŞLE</button>
        </div>
      </ActionSheet>
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

      <ActionSheet 
        isOpen={showAddRoutine} 
        title="Yeni Rutin Ekle" 
        onClose={() => setShowAddRoutine(false)}
      >
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>GÖREV / AKTİVİTE</label>
            <input placeholder="Örn: Sabah Egzersizi" value={newRoutine.task} onChange={e => setNewRoutine({...newRoutine, task: e.target.value})} />
          </div>
          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>SAAT</label>
              <input type="time" value={newRoutine.time} onChange={e => setNewRoutine({...newRoutine, time: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>GÜNLER</label>
              <input placeholder="Örn: Her gün, Pzt-Cum" value={newRoutine.days} onChange={e => setNewRoutine({...newRoutine, days: e.target.value})} />
            </div>
          </div>
          <button className="pro-submit-btn-tech" onClick={() => {
            if(!newRoutine.task) return toast.error('Görev adı gerekli');
            onAddRoutine(newRoutine);
            setShowAddRoutine(false);
            setNewRoutine({ task: '', time: '09:00', days: 'Her gün' });
          }}>RUTİNİ EKLE</button>
        </div>
      </ActionSheet>

      <ActionSheet 
        isOpen={showAddProgram} 
        title="Yeni Program Oluştur" 
        onClose={() => setShowAddProgram(false)}
      >
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>PROGRAM BAŞLIĞI</label>
            <input placeholder="Örn: 12 Haftalık Güç Programı" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} />
          </div>
          <div className="tech-input-group">
            <label>PROGRAM TÜRÜ</label>
            <select value={newProg.type} onChange={e => setNewProg({...newProg, type: e.target.value})}>
              <option value="diet">Beslenme / Diyet</option>
              <option value="work">Çalışma Planı</option>
              <option value="training">Antrenman</option>
            </select>
          </div>
          <div className="tech-input-group">
            <label>PROGRAM İÇERİĞİ / DETAYLAR</label>
            <textarea placeholder="Program detaylarını buraya yazabilirsin..." value={newProg.content} onChange={e => setNewProg({...newProg, content: e.target.value})} />
          </div>
          <button className="pro-submit-btn-tech" onClick={() => {
            if(!newProg.title) return toast.error('Başlık gerekli');
            onAddProgram(newProg);
            setShowAddProgram(false);
            setNewProg({ title: '', content: '', type: 'diet' });
          }}>PROGRAMI OLUŞTUR</button>
        </div>
      </ActionSheet>
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
    togglePinnedConversion,
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
            <BlainCalculator />
            <QuickCalc 
              pinnedIds={currentModule.pinnedConversions || []} 
              onTogglePin={togglePinnedConversion} 
            />
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
