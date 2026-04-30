import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingDown, CreditCard, Clock, Check, X, AlertCircle,
  ChevronDown, ChevronUp, Calendar, ArrowLeft, Eye, EyeOff,
  Landmark, RotateCcw, Plus, History, Wallet, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Finans.css';

const fmt = (val, prv = false) => {
  if (prv) return '••••₺';
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val || 0);
};

const AY_ADLARI = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const KAYNAK_ICONS = {
  'Alışveriş': '🛒', 'Tatil': '✈️', 'Pet': '🐾', 'Sağlık': '💊',
  'Mutfak': '🍽️', 'Araç': '🚗', 'Onay Havuzu': '📥', 'Manuel': '✏️', 'Sistem': '⚙️'
};

const KART_GRADIENTS = {
  'gorkem-ziraat': 'linear-gradient(135deg, #c41c1c, #991b1b)',
  'gorkem-ykb': 'linear-gradient(135deg, #1a56db, #1e40af)',
  'esra-garanti': 'linear-gradient(135deg, #057a55, #065f46)',
  'esra-enpara': 'linear-gradient(135deg, #5b21b6, #4c1d95)',
};

// ── Özet Sekmesi ──────────────────────────────────────────────
function OzetTab({ finans, prv }) {
  const pool = finans?.approvalPool || [];
  const borclar = finans?.borclar || [];
  const kartMutabakat = finans?.kartMutabakat || {};
  const buAyHarcamalar = finans?.buAyHarcamalar || [];

  const toplamBeklenen = Object.values(kartMutabakat).reduce((s, k) => s + (k.beklenen || 0), 0);
  const toplamHarcama = buAyHarcamalar.reduce((s, h) => s + Number(h.tutar || 0), 0);
  const toplamKredi = borclar.reduce((s, b) => s + (b.monthly || 0), 0);
  const ayTahmini = toplamBeklenen + toplamKredi;

  const buAy = new Date();
  const ayAdi = `${AY_ADLARI[buAy.getMonth()]} ${buAy.getFullYear()}`;

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="ozet-ay-badge">{ayAdi}</div>

      <div className="ozet-grid">
        <div className="ozet-card glass primary">
          <small>BU AY HARCAMA</small>
          <h2>{fmt(toplamHarcama, prv)}</h2>
          <span className="ozet-sub">Supabase'den canlı</span>
        </div>
        <div className="ozet-card glass">
          <small>KART BEKLENEN</small>
          <h2 style={{ color: '#f59e0b' }}>{fmt(toplamBeklenen, prv)}</h2>
          <span className="ozet-sub">4 kart toplam</span>
        </div>
      </div>

      {pool.length > 0 && (
        <div className="ozet-alert-bar">
          <AlertCircle size={16} />
          <span><strong>{pool.length}</strong> harcama onay bekliyor</span>
        </div>
      )}

      <div className="ozet-section-title">📅 Bu Ay Kredi Taksitleri</div>
      {borclar.map(b => (
        <div key={b.id} className="ozet-loan-row glass">
          <div>
            <strong>{b.name}</strong>
            <small>Her ayın {b.due_day}'inde</small>
          </div>
          <span className="ozet-loan-amount">{fmt(b.monthly, prv)}</span>
        </div>
      ))}

      <div className="ozet-tahmin glass">
        <div className="ozet-tahmin-label">
          <Wallet size={16} />
          <span>Ay Sonu Tahmini Toplam</span>
        </div>
        <strong>{fmt(ayTahmini, prv)}</strong>
      </div>
    </div>
  );
}

// ── Harcamalar Sekmesi ────────────────────────────────────────
function HarcamalarTab({ finans, prv }) {
  const [filter, setFilter] = useState('hepsi');
  const buAyHarcamalar = finans?.buAyHarcamalar || [];
  const rekuranslar = finans?.rekurans || [];

  const bugun = new Date();
  const buAy = bugun.getMonth();
  const buYil = bugun.getFullYear();

  const bulunanRekuranslar = rekuranslar.map(r => {
    const gun = r.gun || parseInt((r.date || '').split('-')[2]) || 0;
    const dueDate = new Date(buYil, buAy, gun);
    const gecti = dueDate < bugun;
    const buHafta = (dueDate - bugun) / 86400000 <= 7 && !gecti;
    return { ...r, gun, dueDate, gecti, buHafta };
  }).sort((a, b) => a.gun - b.gun);

  const kategoriler = ['hepsi', ...new Set(buAyHarcamalar.map(h => h.kategori).filter(Boolean))];

  const filtrelenmis = filter === 'hepsi'
    ? buAyHarcamalar
    : buAyHarcamalar.filter(h => h.kategori === filter);

  return (
    <div className="f-tab-content animate-fadeIn">
      {bulunanRekuranslar.length > 0 && (
        <>
          <div className="ozet-section-title">⏰ Bu Ay Gelmesi Beklenenler</div>
          {bulunanRekuranslar.map(r => (
            <div key={r.id} className={`rekurans-row glass ${r.gecti ? 'gecti' : r.buHafta ? 'bu-hafta' : ''}`}>
              <div className="rr-left">
                <span className="rr-icon">{r.icon || '📅'}</span>
                <div>
                  <strong>{r.title}</strong>
                  <small>Her ayın {r.gun}'inde {r.gecti ? '· ✅ İşlendi' : r.buHafta ? '· Bu hafta!' : ''}</small>
                </div>
              </div>
              <span className="rr-amount">{fmt(r.amount, prv)}</span>
            </div>
          ))}
        </>
      )}

      <div className="ozet-section-title" style={{ marginTop: '24px' }}>
        📋 Bu Ayın Harcamaları
        <span className="h-count">{filtrelenmis.length} kayıt</span>
      </div>

      <div className="h-filter-scroll">
        {kategoriler.map(k => (
          <button key={k} className={`h-filter-btn ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
            {k === 'hepsi' ? 'Tümü' : k}
          </button>
        ))}
      </div>

      {filtrelenmis.length === 0 ? (
        <div className="f-empty glass">
          <Calendar size={40} opacity={0.2} />
          <p>Bu ay henüz harcama kaydı yok.</p>
        </div>
      ) : (
        filtrelenmis.map(h => (
          <div key={h.id} className="harcama-row glass">
            <div className="hr-icon">{KAYNAK_ICONS[h.kaynak] || '💸'}</div>
            <div className="hr-info">
              <strong>{h.baslik}</strong>
              <small>{h.tarih} · {h.kayit_eden} · {h.kart_id ? h.kart_id.split('-').pop() : 'Nakit'}</small>
            </div>
            <span className="hr-amount">{fmt(h.tutar, prv)}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ── Kredi Sekmesi ─────────────────────────────────────────────
function KrediTab({ finans, prv }) {
  const kartlar = finans?.kartlar || [];
  const borclar = finans?.borclar || [];
  const kartMutabakat = finans?.kartMutabakat || {};
  const { gercekKartBorcuGir, payLoanInstallment } = useStore();

  const [inputMap, setInputMap] = useState({});
  const [expandedKart, setExpandedKart] = useState(null);
  const buAy = new Date().toISOString().slice(0, 7);

  const handleGercekGir = async (kartId) => {
    const val = inputMap[kartId];
    if (!val || isNaN(val)) return toast.error('Geçerli tutar girin');
    await gercekKartBorcuGir(kartId, val, buAy);
    setInputMap(p => ({ ...p, [kartId]: '' }));
  };

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="ozet-section-title">💳 Kart Mutabakatı</div>
      <p className="kredi-hint">Ay sonunda gerçek banka borcunu gir, sistem farkı gösterir.</p>

      {kartlar.map(kart => {
        const mut = kartMutabakat[kart.id] || {};
        const fark = (mut.gercek != null) ? (mut.gercek - (mut.beklenen || 0)) : null;
        const expanded = expandedKart === kart.id;

        return (
          <div key={kart.id} className="kart-mutabakat-card glass">
            <div className="kmc-header" onClick={() => setExpandedKart(expanded ? null : kart.id)}>
              <div className="kmc-dot" style={{ background: kart.color }} />
              <div className="kmc-name">
                <strong>{kart.name}</strong>
                <small>{kart.owner === 'gorkem' ? '👨🏻‍💻 Görkem' : '👩 Esra'} · Kesim: {kart.cutoff_day}'i</small>
              </div>
              <div className="kmc-beklenen">
                <small>Beklenen</small>
                <strong>{fmt(mut.beklenen || 0, prv)}</strong>
              </div>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {expanded && (
              <div className="kmc-body">
                <div className="kmc-row">
                  <span>Sistem Beklentisi:</span>
                  <strong>{fmt(mut.beklenen || 0, prv)}</strong>
                </div>
                {mut.gercek != null && (
                  <div className="kmc-row">
                    <span>Banka Gerçek Borcu:</span>
                    <strong style={{ color: '#10b981' }}>{fmt(mut.gercek, prv)}</strong>
                  </div>
                )}
                {fark != null && (
                  <div className={`kmc-fark ${fark > 0 ? 'pozitif' : 'negatif'}`}>
                    {fark > 0
                      ? `⚠️ Sistemin görmediği ${fmt(fark, prv)} var`
                      : `✅ Beklentiden ${fmt(Math.abs(fark), prv)} az`}
                  </div>
                )}
                <div className="kmc-input-row">
                  <input
                    type="number"
                    placeholder="Gerçek borcu gir (₺)"
                    value={inputMap[kart.id] || ''}
                    onChange={e => setInputMap(p => ({ ...p, [kart.id]: e.target.value }))}
                  />
                  <button className="kmc-kaydet-btn" onClick={() => handleGercekGir(kart.id)}>
                    <Check size={16} /> Kaydet
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="ozet-section-title" style={{ marginTop: '28px' }}>🏦 Krediler</div>
      {borclar.map(loan => {
        const perc = ((loan.total - loan.remaining) / loan.total) * 100;
        return (
          <div key={loan.id} className="loan-card-v2 glass">
            <div className="lc-header">
              <strong>{loan.name}</strong>
              <span className="lc-badge">Her ayın {loan.due_day}'i</span>
            </div>
            <div className="lc-bar-bg"><div className="lc-bar-fill" style={{ width: `${perc}%` }} /></div>
            <div className="lc-footer">
              <div>
                <div className="lc-stat"><small>Kalan</small><strong>{fmt(loan.remaining, prv)}</strong></div>
                <div className="lc-stat"><small>Aylık Taksit</small><strong style={{ color: '#f59e0b' }}>{fmt(loan.monthly, prv)}</strong></div>
              </div>
              <button className="lc-pay-btn" onClick={() => { payLoanInstallment(loan.id); toast.success(`${loan.name} taksiti ödendi!`); }}>
                TAKSİT ÖDE
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Onay Sekmesi ──────────────────────────────────────────────
function OnayTab({ finans, prv }) {
  const { onaylaHarcama, reddetHarcama } = useStore();
  const pool = finans?.approvalPool || [];
  const kartlar = finans?.kartlar || [];
  const [kartSecim, setKartSecim] = useState({});

  if (pool.length === 0) {
    return (
      <div className="f-tab-content animate-fadeIn">
        <div className="f-empty glass" style={{ marginTop: '40px' }}>
          <Check size={48} opacity={0.2} />
          <p>Tüm harcamalar güncel ✅</p>
          <small>Onay bekleyen işlem yok</small>
        </div>
      </div>
    );
  }

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="onay-header-row">
        <div className="ozet-section-title">{pool.length} harcama onay bekliyor</div>
      </div>

      {pool.map(item => (
        <div key={item.id} className="onay-card glass">
          <div className="onay-top">
            <div className="onay-icon">{KAYNAK_ICONS[item.source] || '📥'}</div>
            <div className="onay-info">
              <strong>{item.title || item.baslik}</strong>
              <small>{item.source || item.kaynak} · {item.kayit_eden || item.payer || '—'} · {item.dt || item.tarih}</small>
            </div>
            <span className="onay-amount">{fmt(item.amount || item.tutar, prv)}</span>
          </div>

          <div className="onay-bottom">
            <select
              className="onay-kart-select"
              value={kartSecim[item.id] || ''}
              onChange={e => setKartSecim(p => ({ ...p, [item.id]: e.target.value }))}
            >
              <option value="">Kart seç...</option>
              {kartlar.map(k => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
              <option value="nakit">💵 Nakit</option>
            </select>
            <div className="onay-btns">
              <button className="onay-btn reject" onClick={() => reddetHarcama(item.id)}>
                <X size={16} />
              </button>
              <button
                className="onay-btn approve"
                disabled={!kartSecim[item.id]}
                onClick={() => onaylaHarcama(item.id, kartSecim[item.id] === 'nakit' ? null : kartSecim[item.id])}
              >
                <Check size={16} /> Onayla
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Geçmiş Sekmesi ────────────────────────────────────────────
function GecmisTab({ prv }) {
  const { getFinansArsiv, getGecmisAy, ayKapat } = useStore();
  const [arsiv, setArsiv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detay, setDetay] = useState([]);
  const [detayLoading, setDetayLoading] = useState(false);
  const [showGecenAyForm, setShowGecenAyForm] = useState(false);

  useEffect(() => {
    getFinansArsiv(24).then(data => { setArsiv(data); setLoading(false); });
  }, []);

  const handleAySecim = async (ay) => {
    if (selected === ay) { setSelected(null); setDetay([]); return; }
    setSelected(ay);
    setDetayLoading(true);
    const data = await getGecmisAy(ay);
    setDetay(data);
    setDetayLoading(false);
  };

  const oncekiAy = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  };

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="gecmis-header-row">
        <div className="ozet-section-title">📦 Geçmiş Aylar</div>
        <button className="gecmis-kapat-btn" onClick={() => ayKapat()}>
          <RotateCcw size={14} /> Ayı Kapat
        </button>
      </div>

      {loading ? (
        <div className="f-empty"><div className="spinner-mini" /></div>
      ) : arsiv.length === 0 ? (
        <div className="f-empty glass">
          <History size={40} opacity={0.2} />
          <p>Henüz arşivlenmiş ay yok.</p>
          <small>Ay sonu "Ayı Kapat" ile arşivle.</small>
        </div>
      ) : (
        arsiv.map(a => (
          <div key={a.ay} className="gecmis-ay-card glass">
            <div className="gac-header" onClick={() => handleAySecim(a.ay)}>
              <div>
                <strong>{a.ay}</strong>
                <small>{fmt(a.toplam_harcama, prv)} · Kart: {fmt(a.toplam_kart, prv)} · Nakit: {fmt(a.toplam_nakit, prv)}</small>
              </div>
              {selected === a.ay ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {selected === a.ay && (
              <div className="gac-detay">
                {detayLoading ? <div className="spinner-mini" /> : detay.map(h => (
                  <div key={h.id} className="gac-row">
                    <span>{h.baslik}</span>
                    <span>{fmt(h.tutar, prv)}</span>
                  </div>
                ))}
                {!detayLoading && detay.length === 0 && <small>Kayıt bulunamadı.</small>}
              </div>
            )}
          </div>
        ))
      )}

      <div className="gecen-ay-section">
        <button className="gecen-ay-btn glass" onClick={() => setShowGecenAyForm(!showGecenAyForm)}>
          <Plus size={14} /> Geçen Aya Harcama Ekle
        </button>
        {showGecenAyForm && <GecenAyForm oncekiAy={oncekiAy()} onClose={() => setShowGecenAyForm(false)} />}
      </div>
    </div>
  );
}

function GecenAyForm({ oncekiAy, onClose }) {
  const { addHarcama, finans, currentUser } = useStore();
  const kartlar = finans?.kartlar || [];
  const [form, setForm] = useState({ baslik: '', tutar: '', kategori: 'Diğer', kart_id: '', tarih: `${oncekiAy}-15` });

  const handleSave = async () => {
    if (!form.baslik || !form.tutar) return toast.error('Başlık ve tutar gerekli');
    await addHarcama({ ...form, kayit_eden: currentUser?.name || 'Manuel', kaynak: 'Manuel' });
    toast.success('Geçen aya harcama eklendi!');
    onClose();
  };

  return (
    <div className="gecen-ay-form glass">
      <input placeholder="Başlık" value={form.baslik} onChange={e => setForm(p => ({ ...p, baslik: e.target.value }))} />
      <input type="number" placeholder="Tutar (₺)" value={form.tutar} onChange={e => setForm(p => ({ ...p, tutar: e.target.value }))} />
      <input type="date" value={form.tarih} max={`${oncekiAy}-31`} min={`${oncekiAy}-01`} onChange={e => setForm(p => ({ ...p, tarih: e.target.value }))} />
      <select value={form.kart_id} onChange={e => setForm(p => ({ ...p, kart_id: e.target.value }))}>
        <option value="">Kart seç (opsiyonel)</option>
        {kartlar.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
      </select>
      <div className="gecen-ay-form-btns">
        <button className="gaf-cancel" onClick={onClose}>İptal</button>
        <button className="gaf-save" onClick={handleSave}>Kaydet</button>
      </div>
    </div>
  );
}

// ── Ana Bileşen ───────────────────────────────────────────────
const TABS = [
  { id: 'ozet', icon: '📊', label: 'Özet' },
  { id: 'harcamalar', icon: '💸', label: 'Harcamalar' },
  { id: 'kredi', icon: '💳', label: 'Kredi' },
  { id: 'onay', icon: '✅', label: 'Onay' },
  { id: 'gecmis', icon: '📦', label: 'Geçmiş' },
];

export default function Finans() {
  const [activeTab, setActiveTab] = useState('ozet');
  const navigate = useNavigate();
  const { finans, kasa, togglePrivacyMode } = useStore();
  const prv = kasa?.privacyMode || false;
  const pool = finans?.approvalPool || [];

  return (
    <AnimatedPage className="finans-container">
      <header className="finans-header">
        <div className="fh-top">
          <div className="fh-title">
            <span className="fh-emoji">💰</span>
            <div>
              <h1>Eraylar Finans</h1>
              <p>Akıllı Harcama Yönetimi</p>
            </div>
          </div>
          <div className="fh-actions">
            <button className="fh-icon-btn" onClick={togglePrivacyMode}>
              {prv ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button className="fh-icon-btn" onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>

        <nav className="finans-tab-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`f-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'onay' && pool.length > 0 && (
                <span className="f-tab-badge">{pool.length}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="finans-scroll-content">
        {activeTab === 'ozet'       && <OzetTab finans={finans} prv={prv} />}
        {activeTab === 'harcamalar' && <HarcamalarTab finans={finans} prv={prv} />}
        {activeTab === 'kredi'      && <KrediTab finans={finans} prv={prv} />}
        {activeTab === 'onay'       && <OnayTab finans={finans} prv={prv} />}
        {activeTab === 'gecmis'     && <GecmisTab prv={prv} />}
      </div>
    </AnimatedPage>
  );
}
