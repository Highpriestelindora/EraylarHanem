import React, { useState, useMemo, useEffect } from 'react';
import { 
  Cpu, ArrowLeft, Terminal, Code2, Database, Zap, 
  Settings, GitBranch, Library, StickyNote, Plus, 
  Trash2, Edit2, Search, Filter, AlertCircle, 
  CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, Clock,
  ExternalLink, Info, Calculator, Ruler, ArrowRightLeft,
  Pill, FileText, Activity, Users, Briefcase, CalendarCheck, 
  ListTodo, Target, X, Heart, Star, Sparkles,
  Binary, Box, Compass, Workflow, ShieldAlert,
  Edit3, Calendar, RefreshCw, Lightbulb, Rocket, FlaskConical, MessageSquare
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
  { id: 'muhendislik', label: 'Teknik', emoji: '🛠️', color: '#6366f1' },
  { id: 'karar', label: 'Strateji', emoji: '🧠', color: '#10b981' },
  { id: 'crm', label: 'CRM', emoji: '👥', color: '#f59e0b' },
  { id: 'arsiv', label: 'Zihni', emoji: '💡', color: '#64748b' },
  { id: 'hayat', label: 'Focus', emoji: '🎯', color: '#8b5cf6' }
];

const CRITICALITY_LEVELS = {
  low: { label: 'Operasyonel', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
  medium: { label: 'Stratejik', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  high: { label: 'Kritik', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

const ZIHNI_CRITERIA = [
  { 
    id: 'type', 
    text: "Evladım bu işin doğası nedir?", 
    options: [
      { label: "Sadece Yazılım (Kod Mod)", weight: 90, type: 'software' },
      { label: "Mekanik / Fiziksel İcat", weight: 40, type: 'mech' },
      { label: "Havacılık / Uzay (Çok Çılgın)", weight: 15, type: 'aero' },
      { label: "Ev İçi Pratik Çözüm", weight: 95, type: 'home' }
    ]
  },
  { 
    id: 'budget', 
    text: "Kasadaki durum nedir? Malzeme parasını kim verecek?", 
    options: [
      { label: "Bütçe Sınırsız (Zenginiz!)", weight: 100 },
      { label: "Makul (1.000 - 10.000₺)", weight: 70 },
      { label: "Sıfır Bütçe (Kilerdeki atıklarla)", weight: 40 },
      { label: "Yatırımcı Lazım", weight: 20 }
    ]
  },
  { 
    id: 'time', 
    text: "Bu iş ne kadar zamanını alır?", 
    options: [
      { label: "Hafta Sonu Biter", weight: 100 },
      { label: "1-3 Ay Uğraşırım", weight: 75 },
      { label: "1 Yıl Sürer (Hobi Olur)", weight: 40 },
      { label: "Ömrümü Adarım", weight: 20 }
    ]
  },
  { 
    id: 'risk', 
    text: "Mekanizma tutukluk yaparsa risk nedir?", 
    options: [
      { label: "Hiçbir Şey Olmaz (Kod Hatası)", weight: 100 },
      { label: "Malzeme Boşa Gider", weight: 70 },
      { label: "Yaralanma / Patlama Riski!", weight: 30 },
      { label: "Eraylar Hanem Dağılır!", weight: 10 }
    ]
  }
];

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
        <button className="pro-launch-btn mini" onClick={() => setIsOpen(true)}>
          HESAPLA <ArrowRightLeft size={14} />
        </button>
      </div>
      <HydraulicProModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const ProblemBank = ({ problems, onAdd, onUpdate, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProb, setNewProb] = useState({ title: '', definition: '', solution: '', alternatives: '' });

  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return problems;
    const term = searchTerm.toLowerCase();
    return problems.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.definition.toLowerCase().includes(term) ||
      p.solution.toLowerCase().includes(term)
    );
  }, [problems, searchTerm]);

  const handleEdit = (p) => {
    setNewProb({
      title: p.title,
      definition: p.definition,
      solution: p.solution,
      alternatives: p.alternatives || ''
    });
    setEditingId(p.id);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!newProb.title.trim() || !newProb.definition.trim()) {
      return toast.error('Başlık ve Tanım gerekli');
    }
    
    try {
      if (editingId) {
        onUpdate(editingId, {
          ...newProb,
          updatedAt: new Date().toISOString()
        });
        toast.success('Güncelleme başarılı');
      } else {
        const payload = {
          ...newProb,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onAdd(payload);
        toast.success('Kayıt başarılı');
      }
      
      setShowAdd(false);
      setEditingId(null);
      setNewProb({ title: '', definition: '', solution: '', alternatives: '' });
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  return (
    <div className="eng-section glass mb-20">
      <div className="section-header-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <h3>Teknik Problem Bankası</h3>
          </div>
          <button className="add-tech-pill" onClick={() => { setEditingId(null); setNewProb({ title: '', definition: '', solution: '', alternatives: '' }); setShowAdd(true); }}>
            ➕ YENİ KAYIT
          </button>
        </div>
        
        <div className="tech-search-bar">
          <span style={{ fontSize: '14px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Problem veya çözüm ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              ✖️
            </button>
          )}
        </div>
      </div>

      <div className="problem-list mt-16">
        {filteredProblems.length === 0 ? (
          <div className="empty-mini-state-v2">
            <Info size={24} opacity={0.3} />
            <p>{searchTerm ? 'Eşleşen sonuç bulunamadı.' : 'Henüz kayıtlı problem yok.'}</p>
          </div>
        ) : (
          filteredProblems.map(p => (
            <div key={p.id} className="problem-card glass-v2 animate-slideIn">
              <div className="pc-header">
                <div className="pc-title-row">
                  <span style={{ fontSize: '14px' }}>📟</span>
                  <strong>{p.title}</strong>
                </div>
                <div className="pc-actions">
                  <button className="edit-btn-tiny" onClick={() => handleEdit(p)}>📝</button>
                  <button className="delete-btn-tiny" onClick={() => onDelete(p.id)}>🗑️</button>
                </div>
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
                
                <div className="pc-footer-meta">
                  <div className="pc-meta-item">
                    <span>📅 İlk Karar: {p.createdAt ? new Date(p.createdAt).toLocaleDateString('tr-TR') : '-'}</span>
                  </div>
                  {p.updatedAt && p.updatedAt !== p.createdAt && (
                    <div className="pc-meta-item revision">
                      <span>🔄 Revizyon: {new Date(p.updatedAt).toLocaleDateString('tr-TR')}</span>
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
        title={editingId ? "Kayıt Güncelle" : "Yeni Teknik Kayıt"} 
        onClose={() => { setShowAdd(false); setEditingId(null); }}
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
          <button className="submit-btn-tech-v2" onClick={handleSave}>
            {editingId ? "GÜNCELLE" : "KAYDET"}
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

const DecisionLog = ({ decisions, onAdd, onUpdate, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDec, setNewDec] = useState({ 
    title: '', rationale: '', data: '', outcome: '', lesson: '', 
    criticality: 'medium', tags: '' 
  });

  const filteredDecisions = useMemo(() => {
    if (!searchTerm.trim()) return decisions;
    const term = searchTerm.toLowerCase();
    return decisions.filter(d => 
      d.title.toLowerCase().includes(term) || 
      d.rationale.toLowerCase().includes(term) ||
      d.outcome.toLowerCase().includes(term)
    );
  }, [decisions, searchTerm]);

  const handleEdit = (d) => {
    setNewDec({ ...d });
    setEditingId(d.id);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!newDec.title.trim()) return toast.error('Başlık gerekli');
    
    if (editingId) {
      onUpdate(editingId, { ...newDec, updatedAt: new Date().toISOString() });
      toast.success('Karar güncellendi');
    } else {
      onAdd({ ...newDec, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      toast.success('Karar kaydedildi');
    }
    
    setShowAdd(false);
    setEditingId(null);
    setNewDec({ title: '', rationale: '', data: '', outcome: '', lesson: '', criticality: 'medium', tags: '' });
  };

  return (
    <div className="decision-view animate-fadeIn">
      <div className="section-header-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>🧠 Karar Günlüğü</h3>
            <p className="am-sub">Önemli kararlar, veriler ve kazanılan dersler</p>
          </div>
          <button className="add-tech-pill" onClick={() => { setEditingId(null); setNewDec({ title: '', rationale: '', data: '', outcome: '', lesson: '', criticality: 'medium', tags: '' }); setShowAdd(true); }}>
            ➕ YENİ KARAR
          </button>
        </div>

        <div className="tech-search-bar">
          <span style={{ fontSize: '14px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Kararlarda ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              ✖️
            </button>
          )}
        </div>
      </div>

      <div className="decision-timeline mt-20">
        {filteredDecisions.length === 0 ? (
          <div className="empty-state-v2">{searchTerm ? 'Eşleşen karar bulunamadı.' : 'Henüz kayıtlı karar bulunmuyor.'}</div>
        ) : (
          filteredDecisions.map(d => (
            <div key={d.id} className="decision-card-v2 glass">
              <div className="dc-criticality" style={{ backgroundColor: CRITICALITY_LEVELS[d.criticality].color }}></div>
              <div className="dc-body">
                <div className="dc-header">
                  <div className="dc-meta">
                    <span className="dc-tag">{CRITICALITY_LEVELS[d.criticality].label}</span>
                    <span className="dc-date">{new Date(d.createdAt || d.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="dc-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="edit-btn-tiny" onClick={() => handleEdit(d)}>📝</button>
                    <button className="delete-btn-tiny" onClick={() => onDelete(d.id)}>🗑️</button>
                  </div>
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

                <div className="pc-footer-meta" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '8px' }}>
                  <div className="pc-meta-item">
                    <span>📅 İlk Karar: {d.createdAt || d.date ? new Date(d.createdAt || d.date).toLocaleDateString('tr-TR') : '-'}</span>
                  </div>
                  {d.updatedAt && d.updatedAt !== (d.createdAt || d.date) && (
                    <div className="pc-meta-item revision" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                      <span>🔄 Revizyon: {new Date(d.updatedAt).toLocaleDateString('tr-TR')}</span>
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
        title={editingId ? "Karar Güncelle" : "Yeni Karar Kaydı"} 
        onClose={() => { setShowAdd(false); setEditingId(null); }}
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
          
          <button className="pro-submit-btn-tech" onClick={handleSave}>
            ⚡ {editingId ? "KARARI GÜNCELLE" : "KARARI SİSTEME KAYDET"}
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

const CRMView = ({ crm, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onAddDeal, onUpdateDeal, onDeleteDeal }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  
  const [custSearch, setCustSearch] = useState('');
  const [dealSearch, setDealSearch] = useState('');
  const [custFilter, setCustFilter] = useState('all');
  const [dealFilter, setDealFilter] = useState('all');
  const [dealSort, setDealSort] = useState('newest');

  const [newCust, setNewCust] = useState({ name: '', company: '', phone: '', status: 'lead', notes: '', priority: 'medium' });
  const [newDeal, setNewDeal] = useState({ customerId: '', title: '', amount: '', status: 'proposal', priority: 'medium' });

  const customers = crm?.customers || [];
  const deals = crm?.deals || [];

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(custSearch.toLowerCase()) || 
                          (c.company || '').toLowerCase().includes(custSearch.toLowerCase());
      const matchesStatus = custFilter === 'all' || c.status === custFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const pMap = { high: 0, medium: 1, low: 2 };
      return pMap[a.priority || 'medium'] - pMap[b.priority || 'medium'];
    });
  }, [customers, custSearch, custFilter]);

  const filteredDeals = useMemo(() => {
    let result = deals.filter(d => {
      const customer = customers.find(c => c.id === d.customerId);
      const matchesSearch = d.title.toLowerCase().includes(dealSearch.toLowerCase()) || 
                          (customer?.name || '').toLowerCase().includes(dealSearch.toLowerCase());
      const matchesStatus = dealFilter === 'all' || d.status === dealFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const pMap = { high: 0, medium: 1, low: 2 };
      const priorityDiff = pMap[a.priority || 'medium'] - pMap[b.priority || 'medium'];
      if (priorityDiff !== 0) return priorityDiff;
      
      const dateA = new Date(a.createdAt || a.id).getTime();
      const dateB = new Date(b.createdAt || b.id).getTime();
      return dealSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [deals, customers, dealSearch, dealFilter, dealSort]);

  const handleEditCustomer = (c) => {
    setNewCust({ ...c });
    setEditingCustomer(c.id);
    setShowAddCustomer(true);
  };

  const handleEditDeal = (d) => {
    setNewDeal({ ...d });
    setEditingDeal(d.id);
    setShowAddDeal(true);
  };

  const handleSaveCustomer = () => {
    if (!newCust.name) return toast.error('İsim gerekli');
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer, newCust);
      toast.success('Müşteri güncellendi');
    } else {
      onAddCustomer(newCust);
      toast.success('Müşteri kaydedildi');
    }
    setShowAddCustomer(false);
    setEditingCustomer(null);
    setNewCust({ name: '', company: '', phone: '', status: 'lead', notes: '', priority: 'medium' });
  };

  const handleSaveDeal = () => {
    if (!newDeal.customerId || !newDeal.title) return toast.error('Müşteri ve Başlık gerekli');
    if (editingDeal) {
      onUpdateDeal(editingDeal, newDeal);
      toast.success('Teklif güncellendi');
    } else {
      onAddDeal(newDeal);
      toast.success('Teklif kaydedildi');
    }
    setShowAddDeal(false);
    setEditingDeal(null);
    setNewDeal({ customerId: '', title: '', amount: '', status: 'proposal', priority: 'medium' });
  };

  return (
    <div className="crm-view animate-fadeIn">
      <div className="crm-dashboard mb-24">
        <div className="crm-stats glass">
          <div className="stat-card">
            <span>👥 Portföy</span>
            <strong>{customers.length}</strong>
          </div>
          <div className="stat-card highlight">
            <span>📄 Aktif Teklif</span>
            <strong>{deals.filter(d => d.status === 'proposal' || d.status === 'negotiation').length}</strong>
          </div>
          <div className="stat-card win">
            <span>🏆 Kazanılan</span>
            <strong>{deals.filter(d => d.status === 'won').length}</strong>
          </div>
        </div>
      </div>

      {/* Müşteriler Bölümü */}
      <div className="section-header-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3>👥 Müşteri Portföyü</h3>
          <button className="add-tech-pill" onClick={() => { setEditingCustomer(null); setNewCust({ name: '', company: '', phone: '', status: 'lead', notes: '', priority: 'medium' }); setShowAddCustomer(true); }}>
            ➕ YENİ MÜŞTERİ
          </button>
        </div>
        
        <div className="crm-filter-row">
          <div className="tech-search-bar" style={{ flex: 1 }}>
            <span>🔍</span>
            <input placeholder="Müşteri veya firma ara..." value={custSearch} onChange={e => setCustSearch(e.target.value)} />
          </div>
          <select className="crm-select-mini" value={custFilter} onChange={e => setCustFilter(e.target.value)}>
            <option value="all">Tüm Durumlar</option>
            <option value="lead">Aday (Lead)</option>
            <option value="active">Aktif</option>
            <option value="passive">Pasif</option>
          </select>
        </div>
      </div>

      <div className="customer-list mt-16 mb-32">
        {filteredCustomers.length === 0 ? (
          <div className="empty-mini-state-v2">Sonuç bulunamadı.</div>
        ) : (
          filteredCustomers.map(c => (
            <div key={c.id} className={`customer-card glass-v2 mb-12 priority-${c.priority || 'medium'}`}>
              <div className="c-info">
                <div className="c-name-row">
                  <strong>{c.name}</strong>
                  <span className={`status-badge ${c.status}`}>{c.status.toUpperCase()}</span>
                </div>
                <p>{c.company || 'Bireysel'} · {c.phone || '-'}</p>
              </div>
              <div className="pc-actions">
                <button className="edit-btn-tiny" onClick={() => handleEditCustomer(c)}>📝</button>
                <button className="delete-btn-tiny" onClick={() => onDeleteCustomer(c.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Teklifler Bölümü */}
      <div className="section-header-v2" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h3>📄 Teklifler & Projeler</h3>
          <button className="add-tech-pill" onClick={() => { setEditingDeal(null); setNewDeal({ customerId: '', title: '', amount: '', status: 'proposal', priority: 'medium' }); setShowAddDeal(true); }}>
            ➕ YENİ TEKLİF
          </button>
        </div>

        <div className="crm-filter-row">
          <div className="tech-search-bar" style={{ flex: 1 }}>
            <span>🔍</span>
            <input placeholder="Teklif veya müşteri ara..." value={dealSearch} onChange={e => setDealSearch(e.target.value)} />
          </div>
          <button className="sort-toggle-btn" onClick={() => setDealSort(dealSort === 'newest' ? 'oldest' : 'newest')} title="Tarihe Göre Sırala">
            {dealSort === 'newest' ? '🆕 En Yeni' : '⏳ En Eski'}
          </button>
          <select className="crm-select-mini" value={dealFilter} onChange={e => setDealFilter(e.target.value)}>
            <option value="all">Tüm Aşamalar</option>
            <option value="proposal">Teklif</option>
            <option value="negotiation">Görüşme</option>
            <option value="won">Kazanıldı</option>
            <option value="lost">Kaybedildi</option>
          </select>
        </div>
      </div>

      <div className="deal-list mt-16">
        {filteredDeals.length === 0 ? (
          <div className="empty-mini-state-v2">Sonuç bulunamadı.</div>
        ) : (
          filteredDeals.map(d => {
            const customer = customers.find(c => c.id === d.customerId);
            return (
              <div key={d.id} className={`deal-card glass-v2 highlight mb-12 priority-${d.priority || 'medium'}`}>
                <div className="d-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong>{d.title}</strong>
                    <span className="deal-date-tiny">📅 {new Date(d.createdAt || d.id).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <small>{customer?.name || 'Bilinmeyen Müşteri'}</small>
                </div>
                <div className="d-meta">
                  <div className="d-amount">{d.amount ? `${parseFloat(d.amount).toLocaleString('tr-TR')} ₺` : 'Fiyat Bekliyor'}</div>
                  <span className={`deal-status ${d.status}`}>{d.status.toUpperCase()}</span>
                </div>
                <div className="pc-actions">
                  <button className="edit-btn-tiny" onClick={() => handleEditDeal(d)}>📝</button>
                  <button className="delete-btn-tiny" onClick={() => onDeleteDeal(d.id)}>🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Müşteri Formu */}
      <ActionSheet 
        isOpen={showAddCustomer} 
        title={editingCustomer ? "Müşteri Güncelle" : "Yeni Müşteri Kaydı"} 
        onClose={() => { setShowAddCustomer(false); setEditingCustomer(null); }}
      >
        <div className="tech-form-container">
          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>AD SOYAD *</label>
              <input placeholder="..." value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>FİRMA / KURUM</label>
              <input placeholder="..." value={newCust.company} onChange={e => setNewCust({...newCust, company: e.target.value})} />
            </div>
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>TELEFON</label>
              <input placeholder="..." value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>ÖNEM DERECESİ</label>
              <select value={newCust.priority} onChange={e => setNewCust({...newCust, priority: e.target.value})}>
                <option value="high">🔴 Yüksek (Kritik)</option>
                <option value="medium">🟡 Orta (Normal)</option>
                <option value="low">🟢 Düşük (Takip)</option>
              </select>
            </div>
          </div>

          <div className="tech-input-group">
            <label>MÜŞTERİ DURUMU</label>
            <select value={newCust.status} onChange={e => setNewCust({...newCust, status: e.target.value})}>
              <option value="lead">Aday (Lead)</option>
              <option value="active">Aktif Müşteri</option>
              <option value="passive">Pasif</option>
            </select>
          </div>

          <div className="tech-input-group">
            <label>NOTLAR</label>
            <textarea placeholder="..." value={newCust.notes} onChange={e => setNewCust({...newCust, notes: e.target.value})} />
          </div>

          <button className="pro-submit-btn-tech" onClick={handleSaveCustomer}>
            ⚡ {editingCustomer ? "BİLGİLERİ GÜNCELLE" : "MÜŞTERİYİ KAYDET"}
          </button>
        </div>
      </ActionSheet>

      {/* Teklif Formu */}
      <ActionSheet 
        isOpen={showAddDeal} 
        title={editingDeal ? "Teklif Güncelle" : "Yeni Teklif Girişi"} 
        onClose={() => { setShowAddDeal(false); setEditingDeal(null); }}
      >
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>İLGİLİ MÜŞTERİ *</label>
            <select value={newDeal.customerId} onChange={e => setNewDeal({...newDeal, customerId: e.target.value})}>
              <option value="">Müşteri Seçin</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="tech-input-group">
            <label>PROJE BAŞLIĞI *</label>
            <input placeholder="..." value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} />
          </div>

          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>TUTAR (₺)</label>
              <input type="number" placeholder="0.00" value={newDeal.amount} onChange={e => setNewDeal({...newDeal, amount: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>ÖNCELİK</label>
              <select value={newDeal.priority} onChange={e => setNewDeal({...newDeal, priority: e.target.value})}>
                <option value="high">🔴 Acil / Yüksek</option>
                <option value="medium">🟡 Normal</option>
                <option value="low">🟢 Düşük / İleride</option>
              </select>
            </div>
          </div>

          <div className="tech-input-group">
            <label>SATIŞ AŞAMASI</label>
            <select value={newDeal.status} onChange={e => setNewDeal({...newDeal, status: e.target.value})}>
              <option value="proposal">Teklif Verildi</option>
              <option value="negotiation">Görüşme Aşamasında</option>
              <option value="won">Kazanıldı</option>
              <option value="lost">Kaybedildi</option>
            </select>
          </div>

          <button className="pro-submit-btn-tech" onClick={handleSaveDeal}>
            ⚡ {editingDeal ? "TEKLİFİ GÜNCELLE" : "TEKLİFİ SİSTEME İŞLE"}
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

const ZihniView = ({ proceler = [], onAddProce, onUpdateProce, onDeleteProce, onToggleStatus }) => {
  const [step, setStep] = useState('idle'); 
  const [currentProce, setCurrentProce] = useState({ title: '', desc: '', type: 'home' });
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, high-score, low-score, completed
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', desc: '' });

  const startEvaluation = () => {
    if (!currentProce.title) return toast.error('Önce procene bir isim ver evladım!');
    setResponses({});
    setActiveQuestion(0);
    setStep('questioning');
  };

  const handleSelectOption = (qId, weight, type) => {
    const newResponses = { ...responses, [qId]: weight };
    if (type) setCurrentProce(prev => ({ ...prev, type }));
    setResponses(newResponses);
    
    if (activeQuestion < ZIHNI_CRITERIA.length - 1) {
      setActiveQuestion(prev => prev + 1);
    } else {
      evaluateProce(newResponses);
    }
  };

  const evaluateProce = (finalResponses) => {
    setStep('evaluating');
    setTimeout(() => {
      const totalWeight = Object.values(finalResponses).reduce((a, b) => a + b, 0);
      const baseScore = Math.round(totalWeight / ZIHNI_CRITERIA.length);
      
      let verdict = '';
      let comment = '';

      if (baseScore > 85) {
        verdict = 'HEMEN BAŞLA! 🚀';
        comment = "Tekerleği yeniden icat etmene gerek yok, bu iş olur!";
      } else if (baseScore > 60) {
        verdict = 'DÜŞÜNÜLEBİLİR ⚖️';
        comment = "Kaynakları iyi yönetirsen bir ihtimal tezgahtan iner.";
      } else if (baseScore > 30) {
        verdict = 'ZOR DOSTUM ZOR 🧊';
        comment = "Evladım hayal kurma, mühendis ol! Bu kaynakla bu iş bitmez.";
      } else {
        verdict = 'PASLANMAYA BIRAK 🧊';
        comment = "Helikopter mi? Git önce kağıttan uçak yap evladım!";
      }

      const evaluation = {
        id: Date.now().toString(),
        title: currentProce.title,
        desc: currentProce.desc,
        score: baseScore,
        date: new Date().toISOString(),
        verdict,
        comment,
        responses: finalResponses
      };
      onAddProce(evaluation);
      setStep('result');
    }, 2000);
  };

  const filteredProceler = proceler
    .filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.desc.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'high-score') return b.score - a.score;
      if (sortBy === 'low-score') return a.score - b.score;
      if (sortBy === 'completed') return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
      return 0;
    });

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ title: p.title, desc: p.desc });
  };

  const saveEdit = () => {
    onUpdateProce(editingId, editForm);
    setEditingId(null);
  };

  return (
    <div className="zihni-view animate-fadeIn">
      {step === 'idle' && (
        <div className="zihni-intro drafting-board">
          <div className="zihni-portrait-frame animate-float">
            <img src="/zihni_portrait.png" alt="Zihni Sinir" className="zihni-main-img" />
            <div className="drafting-stamp">ONAYLI PROCE</div>
          </div>
          <h2 className="sketch-title">Porof. Zihni Sinir Çizim Masası</h2>
          <p className="sketch-subtitle">Hayalleri teknik resme, çılgınlığı mekaniğe döküyoruz evladım!</p>
          <div className="sketch-actions-v4">
            <button className="zihni-btn-premium main" onClick={() => setStep('input')}>
              <Zap size={22} /> <span>YENİ PAFTA AÇ</span>
            </button>
            <button className="zihni-btn-premium alt" onClick={() => setStep('list')}>
              <Library size={20} /> <span>PROCE ARŞİVİ ({proceler.length})</span>
            </button>
          </div>
        </div>
      )}

      {step === 'input' && (
        <div className="zihni-form glass animate-slideIn">
          <div className="section-header-v2">
            <h3>📝 Yeni Proce Taslağı</h3>
            <button className="delete-btn-tiny" onClick={() => setStep('idle')}><X size={14} /></button>
          </div>
          <div className="tech-input-group">
            <label>PROCE ADI</label>
            <input placeholder="Örn: Akıllı Terlik Mekanizması" value={currentProce.title} onChange={e => setCurrentProce({...currentProce, title: e.target.value})} />
          </div>
          <div className="tech-input-group">
            <label>PROCE ÖZETİ</label>
            <textarea placeholder="Bu icat neyi değiştirecek?" value={currentProce.desc} onChange={e => setCurrentProce({...currentProce, desc: e.target.value})} />
          </div>
          <button className="zihni-btn-premium main full" onClick={startEvaluation}>TEKNİK PAFTAYA GEÇ</button>
        </div>
      )}

      {step === 'questioning' && (
        <div className="zihni-chat glass animate-slideIn">
          <div className="z-chat-header">
            <div className="z-header-info">
              <span className="z-avatar-mini">👨‍🔬</span>
              <div>
                <strong>Sorgulama Paneli</strong>
                <div className="z-progress-bar">
                  <div className="z-progress-fill" style={{ width: `${((activeQuestion + 1) / ZIHNI_CRITERIA.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="z-bubble z-question premium">
            <div className="z-q-number">Soru {activeQuestion + 1}</div>
            {ZIHNI_CRITERIA[activeQuestion].text}
          </div>
          <div className="z-options-grid premium">
            {ZIHNI_CRITERIA[activeQuestion].options.map((opt, idx) => (
              <button 
                key={idx}
                className="zihni-btn-premium option" 
                onClick={() => handleSelectOption(ZIHNI_CRITERIA[activeQuestion].id, opt.weight, opt.type)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'evaluating' && (
        <div className="zihni-eval glass-v2" style={{ textAlign: 'center', padding: '80px' }}>
          <div className="tech-loader">
            <div className="loader-gear-1 animate-spin">⚙️</div>
            <div className="loader-gear-2 animate-spin-reverse">⚙️</div>
          </div>
          <h2 className="loading-text">MATEMATİKSEL ANALİZ...</h2>
          <p className="loading-sub">Aerodinamik kısıtlar ve bütçe dengesi hesaplanıyor.</p>
        </div>
      )}

      {step === 'result' && (
        <div className="zihni-result glass animate-bounceIn">
          <div className="z-result-card">
            <div className="z-score-display">
              <svg viewBox="0 0 100 100" className="z-score-svg">
                <circle cx="50" cy="50" r="45" className="z-bg-circle" />
                <circle cx="50" cy="50" r="45" className="z-score-fill" style={{ strokeDasharray: `${proceler[0]?.score * 2.82}, 282` }} />
                <text x="50" y="50" className="z-score-text">{proceler[0]?.score}</text>
              </svg>
            </div>
            <h2 className="z-verdict-title">{proceler[0]?.verdict}</h2>
            <div className="z-comment-box">
              <p>"{proceler[0]?.comment}"</p>
            </div>
            <button className="zihni-btn-premium main glow" onClick={() => setStep('list')}>ARŞİVE EKLE VE DEVAM ET</button>
          </div>
        </div>
      )}

      {step === 'list' && (
        <div className="zihni-list-dashboard">
          <div className="archive-control-bar-v2 glass">
            <div className="tech-search-v3">
              <Search size={16} />
              <input 
                placeholder="Proce ara..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="tech-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="high-score">Yüksek Puan</option>
              <option value="low-score">Düşük Puan</option>
              <option value="completed">Tamamlananlar</option>
            </select>
          </div>

          <div className="proce-grid-v2">
            {filteredProceler.length === 0 ? (
              <div className="empty-archive-v2 glass">
                <FlaskConical size={48} className="animate-pulse" />
                <p>Kayıtlı proce bulunamadı.</p>
              </div>
            ) : (
              filteredProceler.map(p => (
                <div key={p.id} className={`proce-card-v3 ${p.completed ? 'is-completed' : ''} ${editingId === p.id ? 'editing' : ''}`}>
                  <div className="p-card-header-v3">
                    <div className="p-meta-v3">
                      <span className="p-date-v3">{new Date(p.date).toLocaleDateString('tr-TR')}</span>
                      <div className="p-score-badge-v3" style={{ background: p.score > 80 ? '#10b981' : p.score > 50 ? '#f59e0b' : '#ef4444' }}>
                        {p.score} PT
                      </div>
                    </div>
                    {editingId === p.id ? (
                      <input className="p-edit-input-v3" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                    ) : (
                      <h4 className="p-title-v3">{p.title} {p.completed && '✅'}</h4>
                    )}
                  </div>
                  
                  <div className="p-card-body-v3">
                    {editingId === p.id ? (
                      <textarea className="p-edit-area-v3" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} />
                    ) : (
                      <p className="p-desc-v3">{p.desc}</p>
                    )}
                  </div>

                    <div className="p-card-footer-v3">
                      <button className={`zihni-status-btn ${p.completed ? 'completed' : 'pending'}`} onClick={() => onToggleStatus(p.id)}>
                        {p.completed ? '✅ TAMAMLANDI' : '⏳ TAMAMLA'}
                      </button>
                      {editingId === p.id ? (
                        <div className="p-edit-actions-v3">
                          <button className="zihni-btn-premium mini success" onClick={saveEdit}><Check size={14} /> KAYDET</button>
                          <button className="zihni-btn-premium mini cancel" onClick={() => setEditingId(null)}>İPTAL</button>
                        </div>
                      ) : (
                        <div className="p-actions-right-v3">
                          <button className="zihni-tool-btn" title="Düzenle" onClick={() => startEdit(p)}><Edit3 size={16} /></button>
                          <button className="zihni-tool-btn delete" title="Sil" onClick={() => onDeleteProce(p.id)}><Trash2 size={16} /></button>
                        </div>
                      )}
                    </div>
                </div>
              ))
            )}
          </div>
          <button className="zihni-btn-premium alt full" style={{ marginTop: '20px' }} onClick={() => setStep('idle')}>ANA MENÜYE DÖN</button>
        </div>
      )}
    </div>
  );
};

const FocusView = ({ life, onAddSession, onDeleteSession, onAddActivity, onDeleteActivity }) => {
  const [view, setView] = useState('analysis'); // 'analysis' or 'timer'
  const [period, setPeriod] = useState('gun'); // 'gun', 'hafta', 'ay', 'yil'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeCat, setActiveCat] = useState('teknik');
  const [note, setNote] = useState('');
  
  // Daily Activity Form
  const [newAct, setNewAct] = useState({ title: '', category: 'teknik', startTime: '', endTime: '', note: '' });
  const [showAddAct, setShowAddAct] = useState(false);

  const sessions = life?.focusSessions || [];
  const activities = life?.dailyActivities || [];
  
  const CATEGORIES = {
    teknik: { label: 'Teknik/Ar-Ge', color: '#6366f1', emoji: '🛠️' },
    strateji: { label: 'Strateji/Toplantı', color: '#10b981', emoji: '🧠' },
    crm: { label: 'CRM/Müşteri', color: '#f59e0b', emoji: '👥' },
    zihni: { label: 'Zihni/İcat', color: '#64748b', emoji: '💡' },
    hobi: { label: 'Hobi/Sanat', color: '#ec4899', emoji: '🎨' },
    dinlenme: { label: 'Dinlenme/Uyku', color: '#06b6d4', emoji: '🌊' },
    ev: { label: 'Ev/Aile', color: '#f43f5e', emoji: '🏠' }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${sec < 10 ? '0' + sec : sec}`;
  };

  const handleFinishSession = () => {
    if (seconds < 10) return toast.error('Çok kısa sürdü evladım!');
    const newSession = {
      id: Date.now().toString(),
      category: activeCat,
      duration: Math.round(seconds / 60),
      seconds: seconds,
      date: new Date().toISOString(),
      note: note || 'Kronometre seansı'
    };
    onAddSession(newSession);
    setIsActive(false);
    setSeconds(0);
    setNote('');
    toast.success('Seans kaydedildi!');
  };

  const handleAddActivity = () => {
    if (!newAct.title || !newAct.startTime || !newAct.endTime) {
      return toast.error('Lütfen tüm yıldızlı alanları doldurunuz.');
    }
    
    const startParts = newAct.startTime.split(':');
    const endParts = newAct.endTime.split(':');
    let diffMins = (parseInt(endParts[0]) * 60 + parseInt(endParts[1])) - (parseInt(startParts[0]) * 60 + parseInt(startParts[1]));
    if (diffMins < 0) diffMins += 1440;

    const activity = {
      id: Date.now().toString(),
      ...newAct,
      duration: diffMins,
      date: selectedDate + 'T' + newAct.startTime + ':00'
    };
    
    onAddActivity(activity);
    setNewAct({ title: '', category: 'teknik', startTime: '', endTime: '', note: '' });
    setShowAddAct(false);
    toast.success('Aktivite başarıyla eklendi!');
  };

  const navDate = (dir) => {
    const d = new Date(selectedDate);
    if (period === 'gun') d.setDate(d.getDate() + dir);
    if (period === 'hafta') d.setDate(d.getDate() + (dir * 7));
    if (period === 'ay') d.setMonth(d.getMonth() + dir);
    if (period === 'yil') d.setFullYear(d.getFullYear() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const filteredStats = useMemo(() => {
    const sel = new Date(selectedDate);
    const selYear = sel.getFullYear();
    const selMonth = sel.getMonth();
    
    const startOfWeek = new Date(sel);
    startOfWeek.setDate(sel.getDate() - sel.getDay() + (sel.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const allItems = [...activities, ...sessions].filter(item => {
      const d = new Date(item.date);
      if (period === 'gun') return d.toDateString() === sel.toDateString();
      if (period === 'hafta') return d >= startOfWeek && d <= endOfWeek;
      if (period === 'ay') return d.getFullYear() === selYear && d.getMonth() === selMonth;
      if (period === 'yil') return d.getFullYear() === selYear;
      return false;
    });

    const totals = {};
    Object.keys(CATEGORIES).forEach(k => totals[k] = 0);
    allItems.forEach(a => totals[a.category] += (a.duration || 0));
    
    const totalMins = Object.values(totals).reduce((a, b) => a + b, 0);
    
    // Grouping data for charts
    const chartData = {};
    if (period === 'hafta') {
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        chartData[d.toDateString()] = 0;
      }
      allItems.forEach(item => {
        const d = new Date(item.date).toDateString();
        if (chartData[d] !== undefined) chartData[d] += (item.duration || 0);
      });
    } else if (period === 'ay') {
      const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) chartData[i] = 0;
      allItems.forEach(item => {
        const d = new Date(item.date).getDate();
        chartData[d] += (item.duration || 0);
      });
    } else if (period === 'yil') {
      for (let i = 0; i < 12; i++) chartData[i] = 0;
      allItems.forEach(item => {
        const m = new Date(item.date).getMonth();
        chartData[m] += (item.duration || 0);
      });
    }

    let emptyHours = [];
    if (period === 'gun') {
      const dayGrid = new Array(1440).fill(false);
      allItems.forEach(item => {
        if (item.startTime && item.endTime) {
          const s = item.startTime.split(':');
          const e = item.endTime.split(':');
          let startMin = parseInt(s[0]) * 60 + parseInt(s[1]);
          let endMin = parseInt(e[0]) * 60 + parseInt(e[1]);
          if (endMin < startMin) {
            for (let i = startMin; i < 1440; i++) dayGrid[i] = true;
          } else {
            for (let i = startMin; i < endMin; i++) dayGrid[i] = true;
          }
        } else if (item.seconds) {
           const d = new Date(item.date);
           const startMin = d.getHours() * 60 + d.getMinutes();
           const duration = Math.round(item.seconds / 60);
           for (let i = startMin; i < Math.min(1440, startMin + duration); i++) dayGrid[i] = true;
        }
      });
      
      let currentEmptyStart = null;
      for (let i = 0; i < 1440; i++) {
        if (!dayGrid[i]) {
          if (currentEmptyStart === null) currentEmptyStart = i;
        } else {
          if (currentEmptyStart !== null) {
            if (i - currentEmptyStart >= 30) {
              emptyHours.push({ start: currentEmptyStart, end: i });
            }
            currentEmptyStart = null;
          }
        }
      }
      if (currentEmptyStart !== null) emptyHours.push({ start: currentEmptyStart, end: 1440 });
    }

    return { totals, totalMins, emptyHours, allItems, chartData, startOfWeek };
  }, [activities, sessions, period, selectedDate]);

  const minToTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
  };

  const getPeriodLabel = () => {
    const d = new Date(selectedDate);
    if (period === 'gun') return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (period === 'hafta') {
      const end = new Date(filteredStats.startOfWeek);
      end.setDate(end.getDate() + 6);
      return `${filteredStats.startOfWeek.getDate()} - ${end.getDate()} ${end.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`;
    }
    if (period === 'ay') return d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    if (period === 'yil') return d.getFullYear().toString();
  };

  return (
    <div className="focus-view animate-fadeIn">
      {/* View Selector */}
      <div className="focus-mode-selector glass mb-20">
        <button className={`mode-btn ${view === 'analysis' ? 'active' : ''}`} onClick={() => setView('analysis')}>
          <Activity size={18} /> <span>Yaşam Analizi</span>
        </button>
        <button className={`mode-btn ${view === 'timer' ? 'active' : ''}`} onClick={() => setView('timer')}>
          <Clock size={18} /> <span>Kronometre</span>
        </button>
      </div>

      {view === 'timer' ? (
        <div className="timer-section animate-slideIn">
          <div className={`timer-dashboard glass ${isActive ? 'active-pulse' : ''}`}>
            <div className="timer-cat-badge" style={{ backgroundColor: CATEGORIES[activeCat].color }}>
              {CATEGORIES[activeCat].emoji} {CATEGORIES[activeCat].label}
            </div>
            <div className="timer-display">{formatTime(seconds)}</div>
            
            {!isActive ? (
              <div className="timer-setup">
                <div className="cat-grid-v2">
                  {Object.entries(CATEGORIES).map(([key, info]) => (
                    <button key={key} className={`cat-btn-v2 ${activeCat === key ? 'selected' : ''}`} onClick={() => setActiveCat(key)} style={{ '--cat-color': info.color }}>
                      <span className="c-emoji">{info.emoji}</span>
                      <span className="c-label">{info.label}</span>
                    </button>
                  ))}
                </div>
                <button className="zihni-btn-premium main full glow" onClick={() => setIsActive(true)}><Zap size={20} /> ODAĞI BAŞLAT</button>
              </div>
            ) : (
              <div className="timer-active-actions">
                <textarea placeholder="Şu an ne üzerine çalışıyorsun?" className="te-note-input" value={note} onChange={e => setNote(e.target.value)} />
                <div className="timer-btns-row">
                  <button className="zihni-btn-premium success" onClick={handleFinishSession}>SEANSI BİTİR</button>
                  <button className="zihni-btn-premium cancel" onClick={() => { setIsActive(false); setSeconds(0); }}>İPTAL</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="analysis-section animate-slideIn">
          <div className="period-tabs glass mb-16">
            {['gun', 'hafta', 'ay', 'yil'].map(p => (
              <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
                {p === 'gun' ? 'Gün' : p === 'hafta' ? 'Hafta' : p === 'ay' ? 'Ay' : 'Yıl'}
              </button>
            ))}
          </div>

          <div className="analysis-nav-header glass mb-20">
            <button className="nav-arrow" onClick={() => navDate(-1)}><ChevronLeft /></button>
            <div className="nav-title">
              <strong>{getPeriodLabel()}</strong>
              <span>{period === 'gun' ? 'Günlük Detay' : 'Periyot Analizi'}</span>
            </div>
            <button className="nav-arrow" onClick={() => navDate(1)}><ChevronRight /></button>
          </div>

          <div className="analysis-summary-card glass mb-20">
            <div className="asc-left">
              <span className="asc-label">Analiz Edilen Süre</span>
              <div className="asc-val">
                <strong>{Math.floor(filteredStats.totalMins / 60)}s {filteredStats.totalMins % 60}dk</strong>
                {period === 'gun' && <span className="perc">%{Math.round((filteredStats.totalMins / 1440) * 100)}</span>}
              </div>
            </div>
            <button className="add-act-btn-mini" onClick={() => setShowAddAct(true)}><Plus size={18} /></button>
          </div>

          <div className="period-visual-container glass mb-24">
            <h3>📊 Zaman Trendi</h3>
            {period === 'gun' ? (
              <div className="day-grid-visual">
                {/* Visual representation of the day's intensity */}
                <div className="dist-list-v2">
                 {Object.entries(filteredStats.totals).map(([cat, mins]) => (
                   mins > 0 && (
                     <div key={cat} className="dist-item-v2">
                       <div className="di-info">
                         <span>{CATEGORIES[cat].emoji} {CATEGORIES[cat].label}</span>
                         <strong>{mins > 60 ? `${Math.floor(mins/60)}s ${mins%60}dk` : `${mins}dk`}</strong>
                       </div>
                       <div className="di-progress">
                         <div className="di-fill" style={{ width: `${(mins / Math.max(1, filteredStats.totalMins)) * 100}%`, backgroundColor: CATEGORIES[cat].color }}></div>
                       </div>
                     </div>
                   )
                 ))}
               </div>
              </div>
            ) : (
              <div className="trend-bar-chart">
                {Object.entries(filteredStats.chartData).map(([key, mins]) => (
                  <div key={key} className="trend-bar-group">
                    <div className="tb-fill-bg">
                      <div className="tb-fill" style={{ height: `${Math.min(100, (mins / (period === 'gun' ? 1440 : period === 'hafta' ? 1440 : 43200)) * 100)}%` }}></div>
                    </div>
                    <span className="tb-label">{period === 'hafta' ? new Date(key).toLocaleDateString('tr-TR', { weekday: 'short' }) : period === 'ay' ? key : (parseInt(key)+1)}</span>
                  </div>
                ))}
              </div>
            )}
            {filteredStats.totalMins === 0 && <div className="empty-mini-state">Veri girişi yapılmadı.</div>}
          </div>

          {period === 'gun' && (
            <div className="daily-flow-container mt-24">
              <h3 className="section-title">🕒 Günlük Akış & Boşluklar</h3>
              <div className="timeline-list">
                {[...filteredStats.allItems, ...filteredStats.emptyHours.map(h => ({ ...h, isEmpty: true, id: 'empty-' + h.start }))]
                  .sort((a, b) => {
                     const getStart = (item) => {
                       if (item.isEmpty) return item.start;
                       if (item.startTime) {
                         const p = item.startTime.split(':');
                         return parseInt(p[0]) * 60 + parseInt(p[1]);
                       }
                       const d = new Date(item.date);
                       return d.getHours() * 60 + d.getMinutes();
                     };
                     return getStart(a) - getStart(b);
                  })
                  .map(item => (
                    item.isEmpty ? (
                      <div key={item.id} className="timeline-empty-card">
                        <div className="te-time">{minToTime(item.start)} - {minToTime(item.end)}</div>
                        <div className="te-label">🕳️ Boş Zaman (Analize Dahil Değil)</div>
                      </div>
                    ) : (
                      <div key={item.id} className="timeline-card glass">
                        <div className="tc-time">
                          {item.startTime ? `${item.startTime} - ${item.endTime}` : new Date(item.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="tc-content" style={{ borderLeftColor: CATEGORIES[item.category]?.color }}>
                          <div className="tc-header">
                            <strong>{item.title || CATEGORIES[item.category]?.label}</strong>
                            <span className="tc-duration">{item.duration} dk</span>
                          </div>
                          {item.note && <p className="tc-note">{item.note}</p>}
                        </div>
                        <button className="tc-delete" onClick={() => item.startTime ? onDeleteActivity(item.id) : onDeleteSession(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  ))}
                  {filteredStats.allItems.length === 0 && <div className="empty-state-v3">Henüz bir akış kaydedilmedi.</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      <ActionSheet isOpen={showAddAct} title="Aktivite Kaydet" onClose={() => setShowAddAct(false)}>
        <div className="tech-form-container">
          <div className="tech-input-group">
            <label>NE YAPTIN? *</label>
            <input placeholder="Örn: Proje Tasarımı" value={newAct.title} onChange={e => setNewAct({...newAct, title: e.target.value})} />
          </div>
          
          <div className="tech-input-row">
            <div className="tech-input-group">
              <label>BAŞLANGIÇ *</label>
              <input type="time" value={newAct.startTime} onChange={e => setNewAct({...newAct, startTime: e.target.value})} />
            </div>
            <div className="tech-input-group">
              <label>BİTİŞ *</label>
              <input type="time" value={newAct.endTime} onChange={e => setNewAct({...newAct, endTime: e.target.value})} />
            </div>
          </div>

          <div className="tech-input-group">
            <label>KATEGORİ</label>
            <select value={newAct.category} onChange={e => setNewAct({...newAct, category: e.target.value})}>
              {Object.entries(CATEGORIES).map(([key, info]) => (
                <option key={key} value={key}>{info.emoji} {info.label}</option>
              ))}
            </select>
          </div>

          <div className="tech-input-group">
            <label>NOTLAR</label>
            <textarea placeholder="Opsiyonel detaylar..." value={newAct.note} onChange={e => setNewAct({...newAct, note: e.target.value})} />
          </div>

          <button className="pro-submit-btn-tech" onClick={handleAddActivity}>
            ⚡ ANALİZE EKLE
          </button>
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
    addEngineeringProblem, updateEngineeringProblem, deleteEngineeringProblem,
    addEngineeringDecision, updateEngineeringDecision, deleteEngineeringDecision,
    togglePinnedConversion,
    addCrmCustomer, updateCrmCustomer, deleteCrmCustomer,
    addCrmDeal, updateCrmDeal, deleteCrmDeal,
    addLifeRoutine, toggleLifeRoutine, deleteLifeRoutine,
    addLifeProgram, deleteLifeProgram,
    addFocusSession, deleteFocusSession,
    addLifeActivity, deleteLifeActivity,
    addZihniProce, updateZihniProce, deleteZihniProce, toggleZihniProceStatus
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
              <h1>Eraylar Teknik</h1>
              <p>Proje & Mühendislik Hub</p>
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
              <span style={{ fontSize: '18px', marginBottom: '4px' }}>{tab.emoji}</span>
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
              onUpdate={updateEngineeringProblem}
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
            onUpdate={updateEngineeringDecision}
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
          <FocusView 
            life={currentModule.life}
            onAddSession={addFocusSession}
            onDeleteSession={deleteFocusSession}
            onAddActivity={addLifeActivity}
            onDeleteActivity={deleteLifeActivity}
          />
        )}

        {activeTab === 'arsiv' && (
          <ZihniView 
            proceler={currentModule.zihniProceler || []} 
            onAddProce={addZihniProce}
            onUpdateProce={updateZihniProce}
            onToggleStatus={toggleZihniProceStatus}
            onDeleteProce={(id) => setShowConfirm({
              open: true,
              message: 'Bu proceyi atölyeden kaldırmak istediğinize emin misiniz?',
              onConfirm: () => deleteZihniProce(id)
            })}
          />
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
