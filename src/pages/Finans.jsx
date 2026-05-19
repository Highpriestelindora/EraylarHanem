import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  TrendingDown, CreditCard, Clock, Check, X, AlertCircle,
  ChevronDown, ChevronUp, Calendar, ArrowLeft, Eye, EyeOff,
  Landmark, RotateCcw, Plus, History, Wallet, PieChart,
  Settings, Trash2, Edit, Edit3, RefreshCcw, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import ActionSheet from '../components/ActionSheet';
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
const OzetTab = React.memo(({ finans, prv }) => {
  const pool = finans?.approvalPool || [];
  const borclar = finans?.borclar || [];
  const kartlar = finans?.kartlar || [];
  const kartMutabakat = finans?.kartMutabakat || {};
  const buAyHarcamalar = finans?.buAyHarcamalar || [];

  // Sadece mevcut kartların beklenen borçlarını topla
  const toplamBeklenen = kartlar.reduce((s, kart) => {
    const mut = kartMutabakat[kart.id] || {};
    return s + (mut.beklenen || 0);
  }, 0);

  const toplamHarcama = buAyHarcamalar.reduce((s, h) => h.odenme_turu === 'kayitdisi' ? s : s + Number(h.tutar || 0), 0);
  const toplamKredi = borclar.reduce((s, b) => s + (b.monthly || 0), 0);
  const ayTahmini = toplamBeklenen + toplamKredi;

  // Nakit, Kart ve Havale Harcamaları Kırılımı
  const toplamNakitHarcama = buAyHarcamalar.reduce((s, h) => {
    const isNakit = h.odenme_turu === 'nakit' || (!h.kart_id && !h.banka_id && h.odenme_turu !== 'havale' && h.odenme_turu !== 'kayitdisi');
    return isNakit ? s + Number(h.tutar || 0) : s;
  }, 0);

  const toplamKrediKartiHarcama = buAyHarcamalar.reduce((s, h) => {
    const isKart = h.odenme_turu === 'kart' || !!h.kart_id;
    return isKart ? s + Number(h.tutar || 0) : s;
  }, 0);

  const toplamHavaleHarcama = buAyHarcamalar.reduce((s, h) => {
    const isHavale = h.odenme_turu === 'havale' || !!h.banka_id;
    return isHavale ? s + Number(h.tutar || 0) : s;
  }, 0);

  const buAy = new Date();
  const ayAdi = `${AY_ADLARI[buAy.getMonth()]} ${buAy.getFullYear()}`;

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="ozet-ay-badge">{ayAdi}</div>

      <div className="ozet-grid">
        <div className="ozet-card glass primary">
          <small>BU AY HARCAMA</small>
          <h2>{fmt(toplamHarcama, prv)}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '12px', borderTop: '1px dashed rgba(124, 58, 237, 0.2)', paddingTop: '10px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--txt-light)', fontWeight: '600' }}>💵 Elden Nakit:</span>
              <strong style={{ color: '#10b981', fontSize: '12px' }}>{fmt(toplamNakitHarcama, prv)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--txt-light)', fontWeight: '600' }}>💳 Kredi Kartı:</span>
              <strong style={{ color: '#3b82f6', fontSize: '12px' }}>{fmt(toplamKrediKartiHarcama, prv)}</strong>
            </div>
            {toplamHavaleHarcama > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--txt-light)', fontWeight: '600' }}>🏦 Banka Havale:</span>
                <strong style={{ color: '#6366f1', fontSize: '12px' }}>{fmt(toplamHavaleHarcama, prv)}</strong>
              </div>
            )}
          </div>
        </div>
        <div className="ozet-card glass">
          <small>KART BEKLENEN</small>
          <h2 style={{ color: '#f59e0b' }}>{fmt(toplamBeklenen, prv)}</h2>
          <span className="ozet-sub">{kartlar.length} kart toplam</span>
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
});

const HarcamalarTab = React.memo(({ finans, prv }) => {
  const buAyHarcamalar = finans?.buAyHarcamalar || [];
  const { deleteHarcama, updateHarcama } = useStore();
  const [filter, setFilter] = useState('hepsi');
  const [methodFilter, setMethodFilter] = useState('hepsi');
  const [editingHarcama, setEditingHarcama] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const kategoriler = ['hepsi', ...new Set(buAyHarcamalar.map(h => h.kategori).filter(Boolean))];

  // 1. Calculate totals for all payment methods in buAyHarcamalar
  const totals = useMemo(() => {
    let cash = 0;
    let transfer = 0;
    let card = 0;
    let grand = 0;

    buAyHarcamalar.forEach(h => {
      const tutar = Number(h.tutar || 0);
      if (h.odenme_turu === 'kayitdisi') return;
      grand += tutar;
      if (h.odenme_turu === 'kart') {
        card += tutar;
      } else if (h.banka_id) {
        transfer += tutar;
      } else {
        cash += tutar;
      }
    });

    return { cash, transfer, card, grand };
  }, [buAyHarcamalar]);

  // 2. Weekly breakdown calculations
  const currentMonthName = useMemo(() => {
    const d = new Date();
    return AY_ADLARI[d.getMonth()] || 'Ay';
  }, []);

  const weeklyBreakdown = useMemo(() => {
    const weeks = [
      { name: '1. Hafta', range: '1 - 7', start: 1, end: 7, total: 0 },
      { name: '2. Hafta', range: '8 - 14', start: 8, end: 14, total: 0 },
      { name: '3. Hafta', range: '15 - 21', start: 15, end: 21, total: 0 },
      { name: '4. Hafta', range: '22 - 28', start: 22, end: 28, total: 0 },
      { name: '5. Hafta', range: '29 - 31', start: 29, end: 31, total: 0 }
    ];

    buAyHarcamalar.forEach(h => {
      if (!h.tarih || h.odenme_turu === 'kayitdisi') return;
      const day = new Date(h.tarih).getDate();
      const tutar = Number(h.tutar || 0);

      const week = weeks.find(w => day >= w.start && day <= w.end);
      if (week) {
        week.total += tutar;
      }
    });

    return weeks;
  }, [buAyHarcamalar]);

  // 3. Filter expenses based on both Category and Payment Method
  const filtrelenmis = useMemo(() => {
    return buAyHarcamalar.filter(h => {
      const matchesCategory = filter === 'hepsi' || h.kategori === filter;
      
      let matchesMethod = true;
      if (methodFilter === 'nakit') {
        matchesMethod = h.odenme_turu !== 'kart' && !h.banka_id && h.odenme_turu !== 'kayitdisi';
      } else if (methodFilter === 'havale') {
        matchesMethod = !!h.banka_id;
      } else if (methodFilter !== 'hepsi') {
        matchesMethod = h.odenme_turu === 'kart' && h.kart_id === methodFilter;
      }

      return matchesCategory && matchesMethod;
    });
  }, [buAyHarcamalar, filter, methodFilter]);

  const filteredTotal = useMemo(() => {
    return filtrelenmis.reduce((sum, h) => h.odenme_turu === 'kayitdisi' ? sum : sum + Number(h.tutar || 0), 0);
  }, [filtrelenmis]);

  // Group by date
  const bugunStr = new Date().toISOString().split('T')[0];
  const dunStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const grouped = filtrelenmis.reduce((acc, h) => {
    let group = 'Daha Eski';
    if (h.tarih === bugunStr) group = 'Bugün';
    else if (h.tarih === dunStr) group = 'Dün';
    else if (new Date(h.tarih) > new Date(Date.now() - 7 * 86400000)) group = 'Bu Hafta';
    else if (h.tarih) {
      const d = new Date(h.tarih);
      group = `${d.getDate()} ${AY_ADLARI[d.getMonth()]}`;
    }
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(h);
    return acc;
  }, {});

  return (
    <div className="f-tab-content animate-fadeIn">
      {/* 1. TOP PREMIUM STATS GRID */}
      <div className="premium-stats-grid mb-24">
        <div className="p-stat-card cash glass">
          <div className="p-stat-header">
            <span className="p-stat-icon">💵</span>
            <span className="p-stat-label">Toplam Nakit</span>
          </div>
          <div className="p-stat-amount">{fmt(totals.cash, prv)}</div>
          <div className="p-stat-decor"></div>
        </div>

        <div className="p-stat-card transfer glass">
          <div className="p-stat-header">
            <span className="p-stat-icon">🏦</span>
            <span className="p-stat-label">Toplam Havale</span>
          </div>
          <div className="p-stat-amount">{fmt(totals.transfer, prv)}</div>
          <div className="p-stat-decor"></div>
        </div>

        <div className="p-stat-card card glass">
          <div className="p-stat-header">
            <span className="p-stat-icon">💳</span>
            <span className="p-stat-label">Kredi Kartları</span>
          </div>
          <div className="p-stat-amount">{fmt(totals.card, prv)}</div>
          <div className="p-stat-decor"></div>
        </div>
      </div>

      {/* 2. WEEKLY DETAILED BREAKDOWN GRID */}
      <div className="weekly-analysis-widget glass mb-24 animate-fadeIn">
        <div className="w-widget-header">
          <div className="w-header-left">
            <span className="w-widget-icon">📊</span>
            <h4>Haftalık Detaylı Dağılım</h4>
          </div>
          <span className="w-widget-sub">Haftalık Performans</span>
        </div>
        
        <div className="weekly-grid mt-16">
          {(() => {
            const maxWeeklySpent = Math.max(...weeklyBreakdown.map(w => w.total), 1);
            return weeklyBreakdown.map(w => {
              const perc = totals.grand > 0 ? Math.round((w.total / totals.grand) * 100) : 0;
              const isHighest = w.total === maxWeeklySpent && w.total > 0;
              const isQuiet = w.total === 0;
              
              let cardClass = "weekly-card";
              let badgeText = "📉 Dengeli";
              let progressColor = "linear-gradient(90deg, #10b981, #059669)"; // Green gradient
              
              if (isQuiet) {
                cardClass += " quiet";
                badgeText = "💤 Sakin";
                progressColor = "#cbd5e1"; // Gray
              } else if (isHighest) {
                cardClass += " highest";
                badgeText = "🔥 En Yoğun";
                progressColor = "linear-gradient(90deg, #7c3aed, #ec4899)"; // Purple-pink gradient
              } else if (perc > 25) {
                cardClass += " high";
                badgeText = "📈 Yüksek";
                progressColor = "linear-gradient(90deg, #3b82f6, #6366f1)"; // Blue-indigo gradient
              }
              
              const weekNum = w.name.split('.')[0]?.padStart(2, '0') || '00';
              
              return (
                <div key={w.name} className={cardClass}>
                  <div className="w-card-header">
                    <span className="w-card-number-badge">{weekNum}</span>
                    <span className="w-card-status-badge">{badgeText}</span>
                  </div>
                  
                  <div className="w-card-main-content">
                    <div className="w-card-title-group">
                      <span className="w-card-name">{w.name}</span>
                      <span className="w-card-range">{w.range} {currentMonthName}</span>
                    </div>
                    <div className="w-card-amount">{fmt(w.total, prv)}</div>
                  </div>

                  <div className="w-progress-section">
                    <div className="w-progress-labels">
                      <span className="w-progress-ratio">Harcamanın %{perc}'si</span>
                    </div>
                    <div className="w-progress-bg">
                      <div className="w-progress-bar" style={{ width: `${perc}%`, background: progressColor }}></div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* 3. ADVANCED COMBINED FILTER BOARD */}
      <div className="filter-board glass mb-24">
        <div className="fb-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>⚙️ Harcama Filtre & Analiz Paneli</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Kategori ve ödeme yöntemini dilediğiniz gibi kombinleyin</p>
          </div>
          <div className="fb-filtered-total glass">
            <span className="fbt-label">Filtrelenmiş Toplam:</span>
            <span className="fbt-value">{fmt(filteredTotal, prv)}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="fb-row mt-16">
          <span className="fb-row-label">📂 Kategori</span>
          <div className="h-filter-scroll">
            {kategoriler.map(k => (
              <button key={k} className={`h-filter-btn ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>
                {k === 'hepsi' ? 'Tümü' : k}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Filter */}
        <div className="fb-row mt-12">
          <span className="fb-row-label">💳 Ödeme Yöntemi</span>
          <div className="h-filter-scroll">
            <button className={`h-filter-btn ${methodFilter === 'hepsi' ? 'active' : ''}`} onClick={() => setMethodFilter('hepsi')}>
              Tüm Yöntemler 🔄
            </button>
            <button className={`h-filter-btn ${methodFilter === 'nakit' ? 'active' : ''}`} onClick={() => setMethodFilter('nakit')}>
              Nakit 💵
            </button>
            <button className={`h-filter-btn ${methodFilter === 'havale' ? 'active' : ''}`} onClick={() => setMethodFilter('havale')}>
              Havale 🏦
            </button>
            {finans?.kartlar?.map(k => (
              <button key={k.id} className={`h-filter-btn ${methodFilter === k.id ? 'active' : ''}`} onClick={() => setMethodFilter(k.id)}>
                {k.name} 💳
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ozet-section-title" style={{ marginTop: '0px' }}>
        📋 Harcama Listesi
        <span className="h-count" style={{ float: 'right', fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>{filtrelenmis.length} kayıt</span>
      </div>

      {filtrelenmis.length === 0 ? (
        <div className="f-empty glass" style={{ marginTop: '20px' }}>
          <Calendar size={40} opacity={0.2} />
          <p>Harcama kaydı bulunamadı.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([gName, items]) => (
          <div key={gName} className="harcama-group" style={{ marginBottom: '24px' }}>
            <div className="hg-title" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px', paddingLeft: '4px' }}>
              {gName}
            </div>
            <div className="hg-items" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(h => (
                <div key={h.id} className="harcama-row glass" style={{ padding: '12px 16px', borderLeft: `4px solid ${h.odenme_turu === 'kart' ? '#3b82f6' : (h.odenme_turu === 'kayitdisi' ? '#f59e0b' : '#10b981')}` }}>
                  <div className="hr-icon" style={{ background: 'transparent', width: 'auto', height: 'auto', fontSize: '20px' }}>{KAYNAK_ICONS[h.kaynak] || '💸'}</div>
                  <div className="hr-info" style={{ flex: 1 }}>
                    <strong style={{ fontSize: '15px', color: '#1e293b' }}>{h.baslik}</strong>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{h.kategori || 'Diğer'}</span>
                      <small style={{ color: '#64748b' }}>
                        · {h.kayit_eden} · {(() => {
                          if (h.odenme_turu === 'kayitdisi') return 'Kayıt Dışı';
                          if (h.odenme_turu === 'kart') {
                            const card = finans?.kartlar?.find(k => k.id === h.kart_id);
                            return card ? card.name : (h.kart_id ? h.kart_id.split('-').pop() : 'Kredi Kartı');
                          }
                          return h.banka_id ? 'Havale' : 'Nakit';
                        })()}
                      </small>
                    </div>
                  </div>
                  <div className="hr-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="hr-amount" style={{ fontSize: '15px', fontWeight: 'bold' }}>{fmt(h.tutar, prv)}</span>
                    <div className="hr-actions-mini" style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn-mini" onClick={() => setEditingHarcama(h)}><Edit size={12} /></button>
                      <button className="icon-btn-mini del" onClick={() => setDeletingId(h.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {editingHarcama && (
        <EditHarcamaModal 
          harcama={editingHarcama} 
          onClose={() => setEditingHarcama(null)} 
          onSave={(updates) => updateHarcama(editingHarcama.id, updates)}
        />
      )}

      <ConfirmModal 
        isOpen={!!deletingId}
        title="Harcamayı Sil"
        message="Bu harcama kaydını silmek istediğine emin misin? Bu işlem geri alınamaz."
        onConfirm={() => { deleteHarcama(deletingId); setDeletingId(null); }}
        onCancel={() => setDeletingId(null)}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        icon="🗑️"
      />
    </div>
  );
});

// ── Kredi Sekmesi ─────────────────────────────────────────────
const BRAND_LOGOS = {
  troy: 'TROY',
  visa: 'VISA',
  mastercard: 'Mastercard',
};

const KrediTab = React.memo(({ finans, prv }) => {
  const kartlar = finans?.kartlar || [];
  const borclar = finans?.borclar || [];
  const kartMutabakat = finans?.kartMutabakat || {};
  const kartOdemeleri = finans?.kartOdemeleri || [];
  const { gercekKartBorcuGir, payCreditCard, updateFinansData, payLoanInstallment, getKartOdemeleri, kasa } = useStore();

  const [selectedKartId, setSelectedKartId] = useState(kartlar[0]?.id || null);
  const [eksreInput, setEkstreInput] = useState('');
  const [editingKart, setEditingKart] = useState(null);
  const [deletingKartId, setDeletingKartId] = useState(null);
  const [deletingOdemeId, setDeletingOdemeId] = useState(null);
  const [editingOdeme, setEditingOdeme] = useState(null);
  const [showKartModal, setShowKartModal] = useState(false);
  const [showBorcModal, setShowBorcModal] = useState(false);
  const [payingCard, setPayingCard] = useState(null);
  const [odemeTuru, setOdemeTuru] = useState('full');
  const [odemeKaynak, setOdemeKaynak] = useState('havale');
  const [odemeBankaId, setOdemeBankaId] = useState('');
  const [odemeOzelTutar, setOdemeOzelTutar] = useState('');
  const buAy = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (kartlar.length > 0 && !selectedKartId) setSelectedKartId(kartlar[0].id);
    getKartOdemeleri?.();
  }, [kartlar.length]);
  const selectedKart = kartlar.find(k => k.id === selectedKartId) || kartlar[0];
  const mut = selectedKart ? (kartMutabakat[selectedKart.id] || {}) : {};
  const buAyHarcamalar = finans?.buAyHarcamalar || [];
  const taksitler = finans?.taksitler || [];
  
  const limit = selectedKart?.limit || 0;
  const cutoffDay = selectedKart?.cutoff_day || 10;
  const dueOffset = selectedKart?.due_day_offset || 10;

  // ── Cycle-Aware & Installment Calculation ──
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    useStore.getState().fetchTaksitler?.();
  }, [selectedKartId]);

  const calcBeklenen = useMemo(() => {
    let ekstre = 0;
    let guncel = 0;
    let taksitYuku = 0;
    let gelecekTaksitler = 0;

    // 1. Normal Harcamalar
    buAyHarcamalar.forEach(h => {
      if (h.odenme_turu === 'kart' && h.kart_id === selectedKart?.id) {
        const hDate = new Date(h.tarih);
        if (hDate.getDate() <= cutoffDay) ekstre += Number(h.tutar);
        guncel += Number(h.tutar);
      }
    });

    // 2. Taksitler
    taksitler.forEach(t => {
      if (t.kart_id === selectedKart?.id) {
        const aylik = Number(t.toplam_tutar) / Number(t.taksit_sayisi);
        // Bu ayki ekstreye binen taksit
        if (t.kalan_taksit > 0) {
          taksitYuku += aylik;
        }
        // Gelecekteki tüm taksitler (bu ay hariç)
        if (t.kalan_taksit > 1) {
          gelecekTaksitler += aylik * (Number(t.kalan_taksit) - 1);
        }
      }
    });

    return { 
      ekstre: ekstre + taksitYuku, 
      guncel: guncel + taksitYuku, 
      taksitYuku, 
      gelecekTaksitler 
    };
  }, [buAyHarcamalar, taksitler, selectedKartId, cutoffDay]);

  const gercek = mut.gercek ?? null; 
  const guncel = mut.guncel ?? null; 

  const toplamOdemeThisMonth = useMemo(() => {
    return kartOdemeleri
      .filter(o => o.kart_id === selectedKart?.id && o.ay === buAy)
      .reduce((sum, o) => sum + Number(o.tutar), 0);
  }, [kartOdemeleri, selectedKartId, buAy]);

  const aktifGuncelBorc = guncel !== null ? guncel : Math.max(0, calcBeklenen.guncel - toplamOdemeThisMonth);
  const aktifEkstreBorcu = gercek !== null ? gercek : Math.max(0, calcBeklenen.ekstre - toplamOdemeThisMonth);

  const sistemKartHarcamalari = useMemo(() => {
    return buAyHarcamalar
      .filter(h => h.odenme_turu === 'kart' && h.kart_id === selectedKart?.id)
      .reduce((sum, h) => sum + Number(h.tutar), 0);
  }, [buAyHarcamalar, selectedKartId]);

  // Toplam Borç Yükü (Gelecek Taksitler ve Sistemdeki Ek Harcamalar Dahil)
  const pendingHarcamalar = guncel !== null ? sistemKartHarcamalari : 0;
  const toplamBorcYuku = aktifGuncelBorc + calcBeklenen.gelecekTaksitler + pendingHarcamalar;
  const limitPerc = limit > 0 ? Math.min(100, (toplamBorcYuku / limit) * 100) : 0;
  const barColor = limitPerc > 90 ? '#ef4444' : limitPerc > 70 ? '#f59e0b' : '#10b981';

  // Asgari Ödeme Hesaplama (BDDK: 50k altı %20, üstü %40)
  const originalEkstre = gercek !== null ? (gercek + toplamOdemeThisMonth) : calcBeklenen.ekstre;
  const asgariPct = selectedKart?.min_pct || (limit > 50000 ? 40 : 20);
  const originalAsgari = originalEkstre * (asgariPct / 100);
  const kalanAsgari = Math.max(0, originalAsgari - toplamOdemeThisMonth);

  const cutoffStr = `${String(cutoffDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
  const dueDate = new Date(currentYear, currentMonth, cutoffDay + dueOffset);
  const dueDateStr = `${String(dueDate.getDate()).padStart(2, '0')}/${String(dueDate.getMonth() + 1).padStart(2, '0')}/${currentYear}`;

  const buKartinOdemeleri = kartOdemeleri.filter(o => o.kart_id === selectedKart?.id).slice(0, 5);

  const [ekstreVal, setEkstreVal] = useState('');
  const [guncelVal, setGuncelVal] = useState('');
  const [showTaksitModal, setShowTaksitModal] = useState(false);
  const [editingTaksit, setEditingTaksit] = useState(null);
  const [showBorcGiris, setShowBorcGiris] = useState(false);

  const handleBorcKaydet = async () => {
    if (!ekstreVal || !guncelVal || isNaN(ekstreVal) || isNaN(guncelVal)) 
      return toast.error('Lütfen her iki borç bilgisini de girin');
    await gercekKartBorcuGir(selectedKart.id, ekstreVal, guncelVal, buAy);
    setEkstreVal('');
    setGuncelVal('');
    setShowBorcGiris(false);
    toast.success('Borç bilgileri güncellendi!');
  };

  const handleOdeme = async () => {
    if (!selectedKart) return;
    let tutar = aktifEkstreBorcu > 0 ? aktifEkstreBorcu : aktifGuncelBorc;
    if (odemeTuru === 'min') tutar = kalanAsgari;
    if (odemeTuru === 'kismi') tutar = Number(odemeOzelTutar);
    if (!tutar || tutar <= 0) return toast.error('Geçerli tutar girin');
    const src = odemeKaynak === 'nakit'
      ? { type: 'nakit' }
      : { type: 'havale', id: odemeBankaId || (kasa?.bankaHesaplari?.[0]?.id || '') };
    await payCreditCard(selectedKart.id, tutar, odemeTuru, src);
    setPayingCard(null);
  };

  if (kartlar.length === 0) {
    return (
      <div className="f-tab-content animate-fadeIn">
        <div className="f-empty glass" style={{ marginTop: '40px' }}>
          <CreditCard size={48} opacity={0.2} />
          <p>Henüz kart tanımlanmamış</p>
          <button className="submit-btn" style={{ background: 'var(--finans)', width: 'auto', padding: '12px 24px', marginTop: '16px' }} onClick={() => setShowKartModal(true)}>
            <Plus size={16} /> Kart Ekle
          </button>
        </div>
        <KartYonetimModal isOpen={showKartModal} onClose={() => setShowKartModal(false)} finans={finans} updateFinansData={updateFinansData} />
      </div>
    );
  }

  return (
    <div className="f-tab-content animate-fadeIn">

      {/* ── Kart Seçici Şeridi ── */}
      <div className="kredi-kart-strip">
        {kartlar.map(k => {
          const m = kartMutabakat[k.id] || {};
          const odeme = kartOdemeleri
            .filter(o => o.kart_id === k.id && o.ay === buAy)
            .reduce((sum, o) => sum + Number(o.tutar), 0);
          
          const hasManual = m.guncel !== undefined && m.guncel !== null;
          const kalanBorc = hasManual ? m.guncel : Math.max(0, (m.gercek ?? m.beklenen ?? 0) - odeme);
          const isSelected = k.id === selectedKartId;
          
          return (
            <button
              key={k.id}
              className={`kredi-strip-btn ${isSelected ? 'active' : ''}`}
              style={{ borderColor: isSelected ? (k.color || '#6366f1') : 'transparent' }}
              onClick={() => { setSelectedKartId(k.id); setPayingCard(null); setEkstreVal(''); setGuncelVal(''); }}
            >
              <span className="ksb-name">{k.name}</span>
              <span className="ksb-borc" style={{ color: kalanBorc > 0 ? '#ef4444' : '#10b981' }}>
                {fmt(kalanBorc, prv)}
              </span>
              <span className="ksb-owner">{k.owner === 'gorkem' ? 'Görkem' : k.owner === 'esra' ? 'Esra' : 'Ortak'}</span>
            </button>
          );
        })}
        <button className="kredi-strip-btn add-btn" onClick={() => setShowKartModal(true)}>
          <Plus size={18} />
          <span>Ekle</span>
        </button>
      </div>

      {selectedKart && (
        <>
          {/* ── Kart Görseli ── */}
          <div
            className="premium-cc-card"
            style={{ background: `linear-gradient(135deg, ${selectedKart.color || '#3b82f6'} 0%, #1e293b 100%)`, margin: '16px 0' }}
          >
            <div className="premium-cc-top">
              <div className="premium-cc-bank-name">{selectedKart.name}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="icon-btn-mini" onClick={() => setEditingKart(selectedKart)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}><Edit size={12} /></button>
                <button className="icon-btn-mini del" onClick={() => setDeletingKartId(selectedKart.id)} style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="premium-cc-chip"></div>
            <div className="premium-cc-number">**** **** **** {selectedKart.card_number || '••••'}</div>
            <div className="premium-cc-bottom">
              <div className="premium-cc-holder">
                {selectedKart.owner === 'gorkem' ? 'GÖRKEM ERAY' : selectedKart.owner === 'esra' ? 'ESRA ERAY' : 'ERAY AİLESİ'}
              </div>
              <div className="premium-cc-brand">{BRAND_LOGOS[selectedKart.brand] || 'Mastercard'}</div>
            </div>
          </div>

          {/* ── Limit Barı ── */}
          <div className="premium-cc-limit-sec">
            <div className="premium-cc-limit-labels">
              <div><strong>{fmt(Math.max(0, limit - toplamBorcYuku), prv)}</strong><small>Kullanılabilir Limit</small></div>
              <div className="right"><strong>{fmt(limit, prv)}</strong><small>Toplam Kart Limiti</small></div>
            </div>
            <div className="premium-cc-limit-bar">
              <div className="premium-cc-limit-fill" style={{ width: `${limitPerc}%`, background: barColor }} />
            </div>
          </div>

          {/* ── Borç Bilgileri (Banka Uygulaması Tarzı) ── */}
          <div className="kredi-bank-info glass">
             <div className="kbi-row">
                <div className="kbi-item">
                   <div className="kbi-val">{fmt(aktifGuncelBorc, prv)}</div>
                   <div className="kbi-label">Güncel Dönem Borcu <AlertCircle size={12} /></div>
                </div>
                <div className="kbi-divider" />
                <div className="kbi-item">
                   <div className="kbi-val">{fmt(aktifEkstreBorcu, prv)}</div>
                   <div className="kbi-label">Kalan Hesap Özeti Borcu <AlertCircle size={12} /></div>
                </div>
             </div>

             <div className="kbi-dates">
                <div className="kbi-date">
                   <span>Hesap Kesim Tarihi</span>
                   <strong>{cutoffStr}</strong>
                </div>
                <div className="kbi-date right">
                   <span>Son Ödeme Tarihi</span>
                   <strong style={{ color: '#ef4444' }}>{dueDateStr}</strong>
                </div>
             </div>

             {/* Borç Giriş Alanı */}
             <div className="borc-giris-toggle" style={{ marginTop: '16px', textAlign: 'center' }}>
                <button 
                  onClick={() => setShowBorcGiris(!showBorcGiris)} 
                  style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: '1px solid rgba(124, 58, 237, 0.2)', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> {showBorcGiris ? 'Borç Girişini Gizle' : 'Banka Borç Bilgilerini Gir'}
                </button>
             </div>

             {showBorcGiris && (
               <div className="kbi-inputs" style={{ marginTop: '12px', animation: 'fadeIn 0.3s ease' }}>
                  <div className="kbi-input-group">
                     <small>Hesap Özeti (Ekstre)</small>
                     <input type="number" placeholder="0₺" value={ekstreVal} onChange={e => setEkstreVal(e.target.value)} />
                  </div>
                  <div className="kbi-input-group">
                     <small>Güncel Borç</small>
                     <input type="number" placeholder="0₺" value={guncelVal} onChange={e => setGuncelVal(e.target.value)} />
                  </div>
                  <button className="kbi-save-btn" onClick={handleBorcKaydet}>KAYDET</button>
               </div>
             )}
          </div>

          {/* ── Ödeme Paneli ── */}
          {!mut.paid ? (
            <div className="kredi-odeme-panel glass">
              <div className="kop-title">💰 Ödeme Yap</div>

              {/* Ödeme Türü */}
              <div className="kop-type-row">
                {[
                  { id: 'full', label: 'Tam', val: fmt(aktifEkstreBorcu > 0 ? aktifEkstreBorcu : aktifGuncelBorc, prv) },
                  { id: 'min', label: 'Asgari', val: fmt(kalanAsgari, prv) },
                  { id: 'kismi', label: 'Kısmi', val: '—' },
                ].map(t => (
                  <button key={t.id} className={`kop-type-btn ${odemeTuru === t.id ? 'active' : ''}`} onClick={() => setOdemeTuru(t.id)}>
                    <span>{t.label}</span>
                    <small>{t.val}</small>
                  </button>
                ))}
              </div>

              {odemeTuru === 'kismi' && (
                <input className="kop-custom-input" type="number" placeholder="Tutar girin (₺)" value={odemeOzelTutar} onChange={e => setOdemeOzelTutar(e.target.value)} />
              )}

              {/* Kaynak Seçimi */}
              <div className="kop-kaynak-row">
                <button className={`kop-kaynak-btn ${odemeKaynak === 'nakit' ? 'active' : ''}`} onClick={() => setOdemeKaynak('nakit')}>💵 Nakit</button>
                <button className={`kop-kaynak-btn ${odemeKaynak === 'havale' ? 'active' : ''}`} onClick={() => setOdemeKaynak('havale')}>🏦 Havale</button>
              </div>

              {odemeKaynak === 'havale' && (
                <select className="kop-banka-select" value={odemeBankaId} onChange={e => setOdemeBankaId(e.target.value)}>
                  <option value="">Banka seçin...</option>
                  {(kasa?.bankaHesaplari || []).map(b => (
                    <option key={b.id} value={b.id}>{b.name} — {fmt(b.balance, prv)}</option>
                  ))}
                </select>
              )}

              {/* Faiz Danışmanı (TCMB Uyumlu Akdi/Gecikme Faiz Hesaplayıcı) */}
              <div className="interest-advisor-box animate-fadeIn" style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px',
                borderRadius: '20px',
                marginTop: '15px',
                marginBottom: '15px',
                fontSize: '13px',
                lineHeight: '1.5'
              }}>
                {(() => {
                  let tutar = aktifEkstreBorcu > 0 ? aktifEkstreBorcu : aktifGuncelBorc;
                  if (odemeTuru === 'min') tutar = kalanAsgari;
                  if (odemeTuru === 'kismi') tutar = Number(odemeOzelTutar) || 0;

                  // 1. TAM ÖDEME (Ekstre Borcunun Tamamı veya fazlası)
                  if (odemeTuru === 'full' || tutar >= aktifEkstreBorcu) {
                    return (
                      <div style={{ color: '#10b981', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px' }}>🎉</span>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '2px', fontWeight: '800' }}>Sıfır Faiz Avantajı!</strong>
                          <span>Ekstre borcunun tamamını kapatıyorsunuz. Hiçbir akdi faiz veya gecikme faizi uygulanmayacaktır. Kalan dönem borcunuz faizsiz ertelenir.</span>
                        </div>
                      </div>
                    );
                  }

                  // 2. ASGARİ ÖDEME (Gecikmeye girmez ama akdi faiz uygulanır)
                  if (odemeTuru === 'min' || (tutar >= kalanAsgari && tutar < aktifEkstreBorcu)) {
                    const kalanEkstre = aktifEkstreBorcu - tutar;
                    const tahminiFaiz = kalanEkstre * 0.0425; // TCMB Akdi Faiz Oranı (%4.25)
                    return (
                      <div style={{ color: '#f59e0b', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px' }}>⚠️</span>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '2px', fontWeight: '800' }}>Akdi Faiz Uygulanacak!</strong>
                          <span>Asgari ödemeyi yaptığınız için yasal takibe veya gecikmeye girmezsiniz. Kalan <strong>{fmt(kalanEkstre, prv)}</strong> ekstre borcunuza günlük <strong>%4.25</strong> akdi faiz işletilecektir.</span>
                          <span style={{ display: 'block', marginTop: '6px', fontSize: '11px', opacity: 0.9, fontWeight: '700', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '8px', width: 'fit-content' }}>
                            📉 Tahmini Aylık Faiz Yükü: ~{fmt(tahminiFaiz, prv)}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // 3. ASGARİ ALTI / KISMİ ÖDEME (Gecikme faizi ve sicil riski)
                  if (tutar < kalanAsgari) {
                    const kalanAsgariBorc = kalanAsgari - tutar;
                    const kalanAkdiBorc = Math.max(0, aktifEkstreBorcu - kalanAsgari);
                    const gecikmeFaiz = kalanAsgariBorc * 0.0455; // TCMB Gecikme Faiz Oranı (%4.55)
                    const akdiFaiz = kalanAkdiBorc * 0.0425; // TCMB Akdi Faiz Oranı (%4.25)
                    return (
                      <div style={{ color: '#ef4444', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '18px' }}>🚨</span>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '2px', fontWeight: '800' }}>Temerrüt & Gecikme Riski!</strong>
                          <span>Asgari tutarın altında kalıyorsunuz! Kalan asgari borcunuz için <strong>%4.55 gecikme faizi</strong>, kalan diğer ekstre borcunuz için ise <strong>%4.25 akdi faiz</strong> uygulanacaktır. Ayrıca KKB kredi notunuz olumsuz etkilenebilir.</span>
                          <span style={{ display: 'block', marginTop: '6px', fontSize: '11px', opacity: 0.9, fontWeight: '700', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '8px', width: 'fit-content' }}>
                            📈 Tahmini Aylık Faiz Yükü: ~{fmt(gecikmeFaiz + akdiFaiz, prv)} (%4.55 Gecikme + %4.25 Akdi)
                          </span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              <button className="kop-submit-btn" onClick={handleOdeme}>
                ✅ Ödemeyi Kaydet
              </button>
            </div>
          ) : (
            <div className="kredi-paid-badge">
              <Check size={20} />
              <span>Bu ay ödendi ({mut.paymentType === 'full' ? 'Tam' : mut.paymentType === 'min' ? 'Asgari' : 'Kısmi'} — {fmt(mut.paidAmount, prv)})</span>
            </div>
          )}

          {/* ── Taksit Planları ── */}
          {taksitler.filter(t => t.kart_id === selectedKart?.id).length > 0 && (
            <div className="kredi-taksit-list" style={{ marginTop: '24px' }}>
              <div className="kog-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                <span>🗓️ Aktif Taksitler</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--txt-light)', fontWeight: '600' }}>Bu Ayki Taksit: <strong style={{ color: 'var(--txt)', fontSize: '13px' }}>{fmt(calcBeklenen.taksitYuku, prv)}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--txt-light)', fontWeight: '600' }}>Kalan Toplam: <strong style={{ color: 'var(--finans)', fontSize: '13px' }}>{fmt(calcBeklenen.taksitYuku + calcBeklenen.gelecekTaksitler, prv)}</strong></div>
                </div>
              </div>
              {taksitler.filter(t => t.kart_id === selectedKart?.id).map(t => (
                <div key={t.id} className="taksit-row glass" style={{ padding: '12px', borderRadius: '16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800' }}>{t.baslik}</div>
                    <div style={{ fontSize: '11px', color: 'var(--txt-light)', fontWeight: '700' }}>
                      {fmt(Number(t.toplam_tutar) / t.taksit_sayisi, prv)} x {t.kalan_taksit} Ay Kaldı
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--finans)' }}>
                      {fmt(t.toplam_tutar, prv)}
                    </div>
                    <button className="icon-btn-mini" onClick={() => { setEditingTaksit(t); setShowTaksitModal(true); }} style={{ marginRight: '4px' }}><Edit size={12} /></button>
                    <button className="icon-btn-mini del" onClick={() => useStore.getState().deleteTaksit(t.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.1)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Info size={16} color="#7c3aed" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'var(--txt-light)', lineHeight: '1.4' }}>
                  <strong>Hesap Kesim Kuralı:</strong> Her hesap kesiminde taksitler güncel borcunuza yansır. Vadesi dolup <strong>0 Ay Kaldı</strong> yazan taksit planlarını yandaki <Trash2 size={10} style={{ display: 'inline', color: '#ef4444', verticalAlign: 'middle' }}/> butonuyla temizleyebilirsiniz.
                </span>
              </div>
            </div>
          )}

          {/* ── Ödeme Geçmişi ── */}
          {buKartinOdemeleri.length > 0 && (
            <div className="kredi-odeme-gecmis" style={{ marginTop: '24px' }}>
              <div className="kog-title">📋 Son Ödemeler</div>
              {buKartinOdemeleri.map(o => (
                <div key={o.id} className="kog-row">
                  <div className="kog-left">
                    <span className="kog-ay">{o.ay}</span>
                    <span className="kog-turu">{o.turu === 'full' ? 'Tam' : o.turu === 'min' ? 'Asgari' : 'Kısmi'}</span>
                  </div>
                  <div className="kog-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                      <strong>{fmt(o.tutar, prv)}</strong><br/>
                      <small>{o.kaynak === 'nakit' ? '💵 Nakit' : '🏦 Havale'}</small>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button className="icon-btn-mini" onClick={() => setEditingOdeme(o)}>
                        <Edit size={12} />
                      </button>
                      <button className="icon-btn-mini del" onClick={() => setDeletingOdemeId(o.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Krediler / Taksitler ── */}
      {borclar.length > 0 && (
        <>
          <div className="ozet-section-title" style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🏦 Krediler & Taksitler</span>
            <button className="icon-btn" onClick={() => setShowBorcModal(true)} style={{ background: 'rgba(255,255,255,0.2)', color: '#1e293b', borderRadius: '50%', padding: '6px' }}><Settings size={16} /></button>
          </div>
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
                  <button className="lc-pay-btn" onClick={() => { payLoanInstallment(loan.id); toast.success(`${loan.name} taksiti ödendi!`); }}>TAKSİT ÖDE</button>
                </div>
              </div>
            );
          })}
        </>
      )}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button className="kredi-mgmt-btn" onClick={() => setShowKartModal(true)}><CreditCard size={14} /> Kart Yönet</button>
        <button className="kredi-mgmt-btn" onClick={() => { setEditingTaksit(null); setShowTaksitModal(true); }}><Plus size={14} /> Taksit Ekle</button>
        <button className="kredi-mgmt-btn" onClick={() => setShowBorcModal(true)}><TrendingDown size={14} /> Kredi Yönet</button>
      </div>

      <KartYonetimModal isOpen={showKartModal || !!editingKart} onClose={() => { setShowKartModal(false); setEditingKart(null); }} finans={finans} updateFinansData={updateFinansData} initialData={editingKart} />
      <BorcYonetimModal isOpen={showBorcModal} onClose={() => setShowBorcModal(false)} finans={finans} updateFinansData={updateFinansData} />
      <TaksitYonetimModal isOpen={showTaksitModal || !!editingTaksit} onClose={() => { setShowTaksitModal(false); setEditingTaksit(null); }} selectedKartId={selectedKartId} editingTaksit={editingTaksit} />
      <ConfirmModal isOpen={!!deletingKartId} title="Kartı Sil" message="Bu kredi kartını silmek istediğine emin misin?" onConfirm={() => { useStore.getState().deleteFinansKart(deletingKartId); toast.success('Kart silindi!'); setDeletingKartId(null); }} onCancel={() => setDeletingKartId(null)} confirmText="Evet, Sil" cancelText="Vazgeç" icon="🗑️" />
      <ConfirmModal isOpen={!!deletingOdemeId} title="Ödemeyi Sil" message="Bu kart ödemesini silmek istediğine emin misin? Ödenen tutar ilgili kasaya iade edilecek ve kart borcu tekrar açılacaktır." onConfirm={() => { useStore.getState().deleteKartOdemesi(deletingOdemeId); setDeletingOdemeId(null); }} onCancel={() => setDeletingOdemeId(null)} confirmText="Evet, Sil" cancelText="Vazgeç" icon="🗑️" />
      
      {editingOdeme && (
        <EditKartOdemeModal 
          odeme={editingOdeme} 
          onClose={() => setEditingOdeme(null)} 
          kasa={kasa}
          onSave={useStore.getState().updateKartOdemesi}
        />
      )}
    </div>
  );
});

// ── Onay Sekmesi ──────────────────────────────────────────────
const OnayTab = React.memo(({ finans, prv }) => {
  const onaylaHarcama = useStore(state => state.onaylaHarcama);
  const reddetHarcama = useStore(state => state.reddetHarcama);
  const pool = finans?.approvalPool || [];
  const kartlar = finans?.kartlar || [];
  const [kartSecim, setKartSecim] = useState({});

  // Sync defaults from pool items
  useEffect(() => {
    const newChoices = { ...kartSecim };
    let changed = false;
    pool.forEach(item => {
      if (!newChoices[item.id] && item.defaultPay) {
        newChoices[item.id] = item.defaultPay;
        changed = true;
      }
    });
    if (changed) setKartSecim(newChoices);
  }, [pool]);

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
              <option value="">Ödeme türü seç...</option>
              <option value="nakit">💵 Nakit (Kasa)</option>
              <optgroup label="💳 Kredi Kartları">
                {kartlar.map(k => (
                  <option key={k.id} value={`kart|${k.id}`}>{k.name}</option>
                ))}
              </optgroup>
              <optgroup label="🏦 Banka Havalesi">
                {(useStore.getState().kasa?.bankaHesaplari || []).map(b => (
                  <option key={b.id} value={`havale|${b.id}`}>{b.name}</option>
                ))}
              </optgroup>
            </select>
            <div className="onay-btns" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button 
                className="onay-btn reject" 
                onClick={() => reddetHarcama(item.id)}
                title="Reddet (Sil)"
              >
                <X size={16} />
              </button>
              
              <button
                className="onay-btn"
                style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 'bold' }}
                title="Sadece kayıtlara geçsin, hiçbir bakiye veya karttan düşmesin."
                onClick={() => {
                  onaylaHarcama(item.id, { odenme_turu: 'kayitdisi', kart_id: null, banka_id: null });
                }}
              >
                <EyeOff size={14} style={{ marginRight: '4px' }} /> Kayıt Dışı
              </button>

              <button
                className="onay-btn approve"
                disabled={!kartSecim[item.id]}
                onClick={() => {
                  const [type, id] = kartSecim[item.id].split('|');
                  const updates = {
                    odenme_turu: type || 'nakit',
                    kart_id: type === 'kart' ? id : null,
                    banka_id: type === 'havale' ? id : null
                  };
                  onaylaHarcama(item.id, updates);
                }}
              >
                <Check size={16} /> Onayla
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// ── Geçmiş Sekmesi ────────────────────────────────────────────
const GecmisTab = React.memo(({ prv }) => {
  const getFinansArsiv = useStore(state => state.getFinansArsiv);
  const getGecmisAy = useStore(state => state.getGecmisAy);
  const ayKapat = useStore(state => state.ayKapat);
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
                <small>{fmt(a.total_amount, prv)} · Kart: {fmt(a.card_total, prv)} · Nakit: {fmt(a.cash_total, prv)}</small>
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
});

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
      <select value={form.odenme_turu || 'nakit'} onChange={e => setForm({...form, odenme_turu: e.target.value, kart_id: '', banka_id: ''})}>
        <option value="nakit">Nakit</option>
        <option value="kart">Kredi Kartı</option>
        <option value="havale">Banka Havalesi</option>
        <option value="kayitdisi">Kayıt Dışı</option>
      </select>
      {form.odenme_turu === 'kart' && (
        <select value={form.kart_id} onChange={e => setForm(p => ({ ...p, kart_id: e.target.value }))}>
          <option value="">Kart seçin...</option>
          {kartlar.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
        </select>
      )}
      {form.odenme_turu === 'havale' && (
        <select value={form.banka_id} onChange={e => setForm(p => ({ ...p, banka_id: e.target.value }))}>
          <option value="">Banka seçin...</option>
          {(useStore.getState().kasa?.bankaHesaplari || []).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      )}
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

function EditHarcamaModal({ harcama, onClose, onSave }) {
  const [form, setForm] = useState({ ...harcama });
  const finans = useStore(state => state.finans);
  const kartlar = finans?.kartlar || [];

  const handleSave = () => {
    if (!form.baslik || !form.tutar) return toast.error('Başlık ve tutar gerekli');
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content animate-scaleIn">
        <div className="modal-header">
          <h3>Harcamayı Düzenle</h3>
          <button className="icon-btn" onClick={onClose}><X size={20}/></button>
        </div>
        <div className="modal-body">
          <div className="premium-form-card glass">
            <div className="form-field-v2 full">
              <label>Başlık</label>
              <input value={form.baslik} onChange={e => setForm({...form, baslik: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Tutar (₺)</label>
              <input type="number" value={form.tutar} onChange={e => setForm({...form, tutar: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Tarih</label>
              <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Ödeme Yöntemi</label>
              <select 
                value={form.odenme_turu || (form.kart_id ? 'kart' : (form.banka_id ? 'havale' : 'nakit'))} 
                onChange={e => setForm({...form, odenme_turu: e.target.value, kart_id: null, banka_id: null})}
              >
                <option value="nakit">Nakit</option>
                <option value="kart">Kredi Kartı</option>
                <option value="havale">Banka Havalesi</option>
                <option value="kayitdisi">Kayıt Dışı</option>
              </select>
            </div>
            {form.odenme_turu === 'kart' && (
              <div className="form-field-v2">
                <label>Kart Seçin</label>
                <select value={form.kart_id || ''} onChange={e => setForm({...form, kart_id: e.target.value})}>
                  <option value="">Seçiniz...</option>
                  {kartlar.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </div>
            )}
            {form.odenme_turu === 'havale' && (
              <div className="form-field-v2">
                <label>Banka Seçin</label>
                <select value={form.banka_id || ''} onChange={e => setForm({...form, banka_id: e.target.value})}>
                  <option value="">Seçiniz...</option>
                  {(useStore.getState().kasa?.bankaHesaplari || []).map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
            <button className="premium-submit-btn" style={{ width: '100%', marginTop: '20px' }} onClick={handleSave}>Değişiklikleri Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Finans() {
  const [activeTab, setActiveTab] = useState('ozet');
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  
  // Performans için seçici abonelikler
  const finans = useStore(state => state.finans);
  const privacyMode = useStore(state => state.kasa?.privacyMode ?? false);
  const togglePrivacyMode = useStore(state => state.togglePrivacyMode);
  
  const prv = privacyMode;
  const pool = finans?.approvalPool || [];

  const handleTabChange = (id) => {
    startTransition(() => {
      setActiveTab(id);
    });
  };

  return (
    <AnimatedPage className="finans-container">
      <header className="module-header glass" style={{ background: 'var(--finans)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">💰</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Finans</h1>
              <p>Akıllı Harcama Yönetimi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={togglePrivacyMode} title="Gizlilik Modu">
              {prv ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menü">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>

        <nav className="tab-nav" style={{ paddingBottom: '0', overflowX: 'auto', flexWrap: 'nowrap' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => handleTabChange(t.id)}
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
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

// ── Yönetim Modalları ─────────────────────────────────────────

function KartYonetimModal({ isOpen, onClose, finans, updateFinansData, initialData }) {
  const kartlar = finans?.kartlar || [];
  const defaults = { id: '', name: '', limit: '', cutoff_day: '', due_day_offset: 10, min_pct: 20, owner: 'ortak', color: '#6366f1', card_number: '', brand: 'mastercard' };
  const [yeniKart, setYeniKart] = useState(defaults);

  useEffect(() => {
    if (initialData) setYeniKart(initialData);
    else setYeniKart(defaults);
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!yeniKart.name || !yeniKart.limit || !yeniKart.cutoff_day) return toast.error('Eksik alanları doldurun!');
    
    if (initialData) {
      const newKartlar = kartlar.map(k => k.id === initialData.id ? { 
        ...yeniKart, 
        limit: Number(yeniKart.limit), 
        cutoff_day: Number(yeniKart.cutoff_day), 
        due_day_offset: Number(yeniKart.due_day_offset),
        min_pct: Number(yeniKart.min_pct),
        card_number: yeniKart.card_number,
        brand: yeniKart.brand
      } : k);
      updateFinansData('kartlar', newKartlar);
      toast.success('Kart güncellendi!');
    } else {
      const kartId = yeniKart.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const newKartlar = [...kartlar, { 
        ...yeniKart, 
        id: kartId, 
        limit: Number(yeniKart.limit), 
        cutoff_day: Number(yeniKart.cutoff_day), 
        due_day_offset: Number(yeniKart.due_day_offset),
        min_pct: Number(yeniKart.min_pct),
        card_number: yeniKart.card_number,
        brand: yeniKart.brand,
        balance: 0 
      }];
      updateFinansData('kartlar', newKartlar);
      toast.success('Kart eklendi!');
    }
    onClose();
  };


  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title={initialData ? "✏️ Kart Düzenle" : "💳 Kart Yönetimi"}>
      <div className="modal-body" style={{ padding: 0 }}>

        <div className="premium-form-card glass" style={{ padding: '20px', marginTop: '24px', color: '#1e293b', borderRadius: '16px', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--finans, #10b981)', padding: '6px', borderRadius: '8px', color: 'white' }}>
              {initialData ? <Edit size={18} /> : <Plus size={18} />}
            </div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>
              {initialData ? 'Kart Bilgilerini Güncelle' : 'Yeni Kart Ekle'}
            </h4>
          </div>

          <div className="form-grid-v2">
            <div className="form-field-v2 full">
              <label><CreditCard size={14} /> Kart Adı</label>
              <input type="text" placeholder="Örn: Garanti Bonus" value={yeniKart.name} onChange={e => setYeniKart({...yeniKart, name: e.target.value})} />
            </div>
            
            <div className="form-field-v2">
              <label>💰 Limit (₺)</label>
              <input type="number" placeholder="0" value={yeniKart.limit} onChange={e => setYeniKart({...yeniKart, limit: e.target.value})} />
            </div>

            <div className="form-field-v2">
              <label>📅 Kesim Günü</label>
              <input type="number" placeholder="1-31" value={yeniKart.cutoff_day} onChange={e => setYeniKart({...yeniKart, cutoff_day: e.target.value})} />
              <small>Ekstre kesim tarihi</small>
            </div>

            <div className="form-field-v2">
              <label>⏰ Vade (+Gün)</label>
              <input type="number" placeholder="10" value={yeniKart.due_day_offset} onChange={e => setYeniKart({...yeniKart, due_day_offset: e.target.value})} />
              <small>Kesimden kaç gün sonra?</small>
            </div>

            <div className="form-field-v2">
              <label>📉 Asgari (%)</label>
              <input type="number" placeholder="20" value={yeniKart.min_pct} onChange={e => setYeniKart({...yeniKart, min_pct: e.target.value})} />
              <small>Min. ödeme yüzdesi</small>
            </div>

            <div className="form-field-v2">
              <label>👤 Sahibi</label>
              <select value={yeniKart.owner} onChange={e => setYeniKart({...yeniKart, owner: e.target.value})}>
                <option value="ortak">Ortak</option>
                <option value="gorkem">Görkem</option>
                <option value="esra">Esra</option>
              </select>
            </div>

            <div className="form-field-v2">
              <label>💳 Son 4 Hane</label>
              <input type="text" placeholder="Örn: 4287" maxLength="4" value={yeniKart.card_number} onChange={e => setYeniKart({...yeniKart, card_number: e.target.value})} />
              <small>Opsiyonel</small>
            </div>

            <div className="form-field-v2">
              <label>🏷️ Kart Tipi</label>
              <select value={yeniKart.brand} onChange={e => setYeniKart({...yeniKart, brand: e.target.value})}>
                <option value="mastercard">Mastercard</option>
                <option value="visa">Visa</option>
                <option value="troy">Troy</option>
              </select>
            </div>

            <div className="form-field-v2">
              <label>🎨 Renk</label>
              <input type="color" value={yeniKart.color} onChange={e => setYeniKart({...yeniKart, color: e.target.value})} style={{ width: '100%', height: '44px', border: 'none', borderRadius: '12px', cursor: 'pointer', padding: '4px', background: 'white' }} />
            </div>
          </div>

          <button 
            className="premium-submit-btn" 
            style={{ width: '100%', marginTop: '24px' }} 
            onClick={handleSave}
          >
            {initialData ? 'Değişiklikleri Kaydet' : 'Kartı Sisteme Tanımla'}
          </button>
        </div>
      </div>
    </ActionSheet>
  );
}


function BorcYonetimModal({ isOpen, onClose, finans, updateFinansData }) {
  const borclar = finans?.borclar || [];
  const [yeniBorc, setYeniBorc] = useState({ name: '', total: '', remaining: '', monthly: '', due_day: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleEkle = () => {
    if (!yeniBorc.name || !yeniBorc.total || !yeniBorc.monthly) return toast.error('Eksik alanları doldurun!');
    const newBorclar = [...borclar, { 
      id: Date.now(), 
      name: yeniBorc.name, 
      total: Number(yeniBorc.total), 
      remaining: Number(yeniBorc.remaining || yeniBorc.total), 
      monthly: Number(yeniBorc.monthly), 
      due_day: Number(yeniBorc.due_day),
      type: 'kredi'
    }];
    updateFinansData('borclar', newBorclar);
    setYeniBorc({ name: '', total: '', remaining: '', monthly: '', due_day: '' });
    toast.success('Borç/Kredi eklendi!');
  };

  const handleSil = (id) => setDeleteModal({ open: true, id });

  const confirmSil = () => {
    if (deleteModal.id) {
      const newBorclar = borclar.filter(b => b.id !== deleteModal.id);
      updateFinansData('borclar', newBorclar);
      toast.success('Borç/Kredi silindi!');
      setDeleteModal({ open: false, id: null });
    }
  };

  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title="📉 Borç & Kredi Yönetimi">
      <div className="modal-body" style={{ padding: 0 }}>
        {borclar.map(b => (
          <div key={b.id} className="glass" style={{ padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1e293b', borderRadius: '14px' }}>
            <div>
              <strong style={{ fontSize: '14px' }}>{b.name}</strong>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Aylık: ₺{b.monthly} · Kalan: ₺{b.remaining}</div>
            </div>
            <button className="icon-btn-mini del" onClick={() => handleSil(b.id)}><Trash2 size={14} /></button>
          </div>
        ))}

        <div className="premium-form-card glass" style={{ padding: '20px', marginTop: '24px', color: '#1e293b', borderRadius: '16px', background: 'rgba(255,255,255,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--finans, #10b981)', padding: '6px', borderRadius: '8px', color: 'white' }}>
              <Plus size={18} />
            </div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Yeni Kredi Ekle</h4>
          </div>

          <div className="form-grid-v2">
            <div className="form-field-v2 full">
              <label>Borç/Kredi Adı</label>
              <input type="text" placeholder="Örn: Konut Kredisi" value={yeniBorc.name} onChange={e => setYeniBorc({...yeniBorc, name: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Toplam Tutar</label>
              <input type="number" placeholder="0" value={yeniBorc.total} onChange={e => setYeniBorc({...yeniBorc, total: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Kalan Tutar</label>
              <input type="number" placeholder="0" value={yeniBorc.remaining} onChange={e => setYeniBorc({...yeniBorc, remaining: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Aylık Taksit</label>
              <input type="number" placeholder="0" value={yeniBorc.monthly} onChange={e => setYeniBorc({...yeniBorc, monthly: e.target.value})} />
            </div>
            <div className="form-field-v2">
              <label>Ödeme Günü</label>
              <input type="number" placeholder="1-31" value={yeniBorc.due_day} onChange={e => setYeniBorc({...yeniBorc, due_day: e.target.value})} />
            </div>
          </div>

          <button className="premium-submit-btn" style={{ width: '100%', marginTop: '24px' }} onClick={handleEkle}>Borç Ekle</button>
        </div>
      </div>
      <ConfirmModal isOpen={deleteModal.open} title="Borcu Sil" message="Bu kaydı silmek istediğine emin misin?" onConfirm={confirmSil} onCancel={() => setDeleteModal({ open: false, id: null })} />
    </ActionSheet>
  );
}

function TaksitYonetimModal({ isOpen, onClose, selectedKartId, editingTaksit }) {
  const { addTaksit } = useStore();
  const [taksit, setTaksit] = useState({ baslik: '', toplam_tutar: '', taksit_sayisi: 12, kalan_taksit: 12, kategori: 'Genel', kart_id: selectedKartId });

  useEffect(() => {
    if (editingTaksit) {
      setTaksit(editingTaksit);
    } else {
      setTaksit({ baslik: '', toplam_tutar: '', taksit_sayisi: 12, kalan_taksit: 12, kategori: 'Genel', kart_id: selectedKartId });
    }
  }, [editingTaksit, selectedKartId, isOpen]);

  const handleSave = async () => {
    if (!taksit.baslik || !taksit.toplam_tutar) return toast.error('Eksik alanları doldurun!');
    await addTaksit(taksit);
    toast.success(editingTaksit ? 'Taksit planı güncellendi! 🗓️' : 'Taksit planı oluşturuldu! 🗓️');
    onClose();
  };

  return (
    <ActionSheet isOpen={isOpen} onClose={onClose} title={editingTaksit ? "🗓️ Taksit Planını Düzenle" : "🗓️ Yeni Taksit Ekle"}>
      <div className="modal-body" style={{ padding: '20px' }}>
        <div className="modal-form">
          <div className="form-group">
            <label>İşlem Başlığı</label>
            <input type="text" value={taksit.baslik} onChange={e => setTaksit({...taksit, baslik: e.target.value})} placeholder="Örn: iPhone 15 Pro" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Toplam Tutar (₺)</label>
              <input type="number" value={taksit.toplam_tutar} onChange={e => setTaksit({...taksit, toplam_tutar: e.target.value})} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Taksit Sayısı</label>
              <input type="number" value={taksit.taksit_sayisi} onChange={e => setTaksit({...taksit, taksit_sayisi: e.target.value})} placeholder="12" />
            </div>
          </div>
          
          <div className="form-row" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label>Kalan Taksit Sayısı</label>
              <input type="number" value={taksit.kalan_taksit} onChange={e => setTaksit({...taksit, kalan_taksit: e.target.value})} placeholder="12" />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select value={taksit.kategori} onChange={e => setTaksit({...taksit, kategori: e.target.value})}>
                <option value="Genel">Genel</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Mutfak">Mutfak</option>
                <option value="Sosyal">Sosyal</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          <button className="submit-btn" style={{ background: 'var(--finans)', marginTop: '20px' }} onClick={handleSave}>
            {editingTaksit ? 'GÜNCELLE' : 'PLANI OLUŞTUR'}
          </button>
        </div>
      </div>
    </ActionSheet>
  );
}

const EditKartOdemeModal = ({ odeme, onClose, onSave, kasa }) => {
  const [tutar, setTutar] = useState(odeme?.tutar || '');
  const [kaynak, setKaynak] = useState(odeme?.kaynak || 'havale');
  const [bankaId, setBankaId] = useState(odeme?.banka_id || '');
  const [tarih, setTarih] = useState(odeme?.tarih || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (odeme) {
      setTutar(odeme.tutar);
      setKaynak(odeme.kaynak);
      setBankaId(odeme.banka_id || '');
      setTarih(odeme.tarih);
    }
  }, [odeme]);

  const handleSave = async () => {
    if (!tutar || Number(tutar) <= 0) return toast.error('Geçerli bir tutar girin');
    if (kaynak === 'havale' && !bankaId) return toast.error('Banka hesabı seçmelisiniz');
    
    await onSave(odeme.id, {
      tutar: Number(tutar),
      kaynak,
      banka_id: kaynak === 'havale' ? bankaId : null,
      tarih
    });
    onClose();
  };

  return (
    <ActionSheet isOpen={!!odeme} onClose={onClose} title="✏️ Ödemeyi Düzenle">
      <div className="modal-body" style={{ padding: '20px' }}>
        <div className="modal-form">
          <div className="form-group">
            <label>Tutar (₺)</label>
            <input type="number" value={tutar} onChange={e => setTutar(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Tarih</label>
            <input type="date" value={tarih} onChange={e => setTarih(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Ödeme Kaynağı</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                type="button"
                className={`kop-kaynak-btn ${kaynak === 'nakit' ? 'active' : ''}`} 
                style={{ flex: 1 }} 
                onClick={() => setKaynak('nakit')}
              >
                💵 Nakit
              </button>
              <button 
                type="button"
                className={`kop-kaynak-btn ${kaynak === 'havale' ? 'active' : ''}`} 
                style={{ flex: 1 }} 
                onClick={() => setKaynak('havale')}
              >
                🏦 Havale
              </button>
            </div>
            {kaynak === 'havale' && (
              <select value={bankaId} onChange={e => setBankaId(e.target.value)}>
                <option value="">Banka seçin...</option>
                {(kasa?.bankaHesaplari || []).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button className="submit-btn" style={{ background: '#3b82f6', marginTop: '20px' }} onClick={handleSave}>
          Kaydet
        </button>
      </div>
    </ActionSheet>
  );
};
