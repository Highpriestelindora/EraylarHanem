import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  TrendingDown, CreditCard, Clock, Check, X, AlertCircle,
  ChevronDown, ChevronUp, Calendar, ArrowLeft, Eye, EyeOff,
  Landmark, RotateCcw, Plus, History, Wallet, PieChart,
  Settings, Trash2, Edit
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
  const [filter, setFilter] = useState('hepsi');
  const ev = useStore(state => state.ev);
  const buAyHarcamalar = finans?.buAyHarcamalar || [];
  
  const rekuranslar = [
    ...(ev?.abonelikler || []).map(a => ({ ...a, id: `abn-${a.id}`, title: a.name, gun: a.date, type: 'abn' })),
    ...(ev?.duzenliOdemeler || []).map(d => ({ ...d, id: `duz-${d.id}`, title: d.name, gun: d.date, type: 'duz' }))
  ];

  const bugun = new Date();
  const buAy = bugun.getMonth();
  const buYil = bugun.getFullYear();

  const { addHarcama, deleteHarcama, updateHarcama } = useStore();
  const [editingHarcama, setEditingHarcama] = useState(null);
  const [payingExpense, setPayingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const kartlar = useStore(state => state.finans?.kartlar || []);

  const bulunanRekuranslar = rekuranslar.map(r => {
    const gun = r.gun || parseInt((r.date || '').split('-')[2]) || 0;
    const dueDate = new Date(buYil, buAy, gun);
    const gecti = dueDate < bugun;
    const buHafta = (dueDate - bugun) / 86400000 <= 7 && !gecti;
    
    // Gerçekten ödendi mi? (Harcamalarda var mı?)
    const isPaid = buAyHarcamalar.some(h => 
      h.baslik.toLowerCase().includes(r.title.toLowerCase())
    );

    return { ...r, gun, dueDate, gecti, buHafta, isPaid };
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
            <div key={r.id} className={`rekurans-row glass ${r.isPaid ? 'paid' : r.gecti ? 'overdue' : r.buHafta ? 'bu-hafta' : ''}`}>
              <div className="rr-left">
                <span className="rr-icon">{r.icon || '📅'}</span>
                <div>
                  <strong>{r.title}</strong>
                  <small>
                    Her ayın {r.gun}'inde {r.isPaid ? '· ✅ Ödendi' : r.gecti ? '· ⌛ Günü Geçti' : r.buHafta ? '· Bu hafta!' : ''}
                  </small>
                </div>
              </div>
              <div className="rr-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="rr-amount">{fmt(r.amount, prv)}</span>
                {!r.isPaid && (
                  <button 
                    className="rr-pay-btn" 
                    onClick={() => {
                      if (r.linkedCardId) {
                        addHarcama({
                          baslik: r.title,
                          tutar: r.amount,
                          kategori: r.type === 'abn' ? 'Abonelik' : 'Düzenli Ödeme',
                          kart_id: r.linkedCardId,
                          odenme_turu: 'kart',
                          kaynak: 'Sistem',
                          tarih: new Date().toISOString().split('T')[0]
                        });
                        toast.success(`${r.title} kart ile ödendi! 💳`);
                      } else {
                        setPayingExpense(r);
                      }
                    }}
                  >
                    ÖDE
                  </button>
                )}
              </div>
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
          <small>Sistem harcamaları otomatik eşleşir.</small>
        </div>
      ) : (
        filtrelenmis.map(h => (
          <div key={h.id} className="harcama-row glass">
            <div className="hr-icon">{KAYNAK_ICONS[h.kaynak] || '💸'}</div>
            <div className="hr-info">
              <strong>{h.baslik}</strong>
              <small>{h.tarih} · {h.kayit_eden} · {h.kart_id ? h.kart_id.split('-').pop() : (h.banka_id ? 'Havale' : 'Nakit')}</small>
            </div>
            <div className="hr-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span className="hr-amount">{fmt(h.tutar, prv)}</span>
              <div className="hr-actions-mini" style={{ display: 'flex', gap: '8px' }}>
                <button className="icon-btn-mini" onClick={() => setEditingHarcama(h)}><Edit size={12} /></button>
                <button className="icon-btn-mini del" onClick={() => setDeletingId(h.id)}><Trash2 size={12} /></button>
              </div>
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

      {/* Payment Method Selection for Recurring */}
      <ActionSheet 
        isOpen={!!payingExpense} 
        onClose={() => setPayingExpense(null)} 
        title="Ödeme Yöntemi Seçin"
      >
        {payingExpense && (
          <div className="payment-select-modal" style={{ padding: '20px' }}>
            <p style={{ marginBottom: '15px', color: '#1e293b', fontSize: '14px' }}>
              <strong>{payingExpense.title}</strong> için ödeme yöntemi belirleyin.
            </p>
            <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <button className="premium-submit-btn" style={{ background: '#10b981' }} onClick={() => {
                 addHarcama({
                    baslik: payingExpense.title,
                    tutar: payingExpense.amount,
                    kategori: payingExpense.type === 'abn' ? 'Abonelik' : 'Düzenli Ödeme',
                    odenme_turu: 'nakit',
                    kaynak: 'Sistem',
                    tarih: new Date().toISOString().split('T')[0]
                 });
                 setPayingExpense(null);
                 toast.success('Nakit ödeme olarak kaydedildi! 💵');
               }}>
                 💵 Nakit (Kasa)
               </button>

               <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b' }}>veya</div>

               <select className="hub-input" style={{ width: '100%', padding: '12px' }} onChange={(e) => {
                 const [type, id] = e.target.value.split('|');
                 if (!id) return;
                 addHarcama({
                    baslik: payingExpense.title,
                    tutar: payingExpense.amount,
                    kategori: payingExpense.type === 'abn' ? 'Abonelik' : 'Düzenli Ödeme',
                    odenme_turu: type,
                    kart_id: type === 'kart' ? id : null,
                    banka_id: type === 'havale' ? id : null,
                    kaynak: 'Sistem',
                    tarih: new Date().toISOString().split('T')[0]
                 });
                 setPayingExpense(null);
                 toast.success(`${type === 'kart' ? 'Kart' : 'Havale'} ile ödeme kaydedildi! 🏦`);
               }}>
                 <option value="">Kart veya Banka Seçin...</option>
                 <optgroup label="💳 Kredi Kartları">
                    {kartlar.map(k => <option key={k.id} value={`kart|${k.id}`}>{k.name}</option>)}
                 </optgroup>
                 <optgroup label="🏦 Banka Havalesi">
                    {(useStore.getState().kasa?.bankaHesaplari || []).map(b => <option key={b.id} value={`havale|${b.id}`}>{b.name}</option>)}
                 </optgroup>
               </select>
            </div>
          </div>
        )}
      </ActionSheet>

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
const KrediTab = React.memo(({ finans, prv }) => {
  const kartlar = finans?.kartlar || [];
  const borclar = finans?.borclar || [];
  const kartMutabakat = finans?.kartMutabakat || {};
  const { gercekKartBorcuGir, payLoanInstallment, updateFinansData, payCreditCard } = useStore();

  const [inputMap, setInputMap] = useState({});
  const [expandedKart, setExpandedKart] = useState(null);
  const [editingKart, setEditingKart] = useState(null);
  const [deletingKartId, setDeletingKartId] = useState(null);
  const [showKartModal, setShowKartModal] = useState(false);
  const [showBorcModal, setShowBorcModal] = useState(false);
  const buAy = new Date().toISOString().slice(0, 7);

  const handleGercekGir = async (kartId) => {
    const val = inputMap[kartId];
    if (!val || isNaN(val)) return toast.error('Geçerli tutar girin');
    await gercekKartBorcuGir(kartId, val, buAy);
    setInputMap(p => ({ ...p, [kartId]: '' }));
  };

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="ozet-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>💳 Kredi Kartlarım</span>
        <button className="icon-btn" onClick={() => setShowKartModal(true)} style={{ background: 'rgba(255,255,255,0.2)', color: '#1e293b', borderRadius: '50%', padding: '6px' }}><Settings size={16} /></button>
      </div>

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

              <div className="kmc-actions-box">
                <button className="kmc-action-btn" onClick={(e) => { e.stopPropagation(); setEditingKart(kart); }}>
                  <Edit size={14} />
                </button>
                <button className="kmc-action-btn del" onClick={(e) => { e.stopPropagation(); setDeletingKartId(kart.id); }}>
                  <Trash2 size={14} />
                </button>
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
                    placeholder="Ekstre Borcunu Gir (₺)"
                    value={inputMap[kart.id] || ''}
                    onChange={e => setInputMap(p => ({ ...p, [kart.id]: e.target.value }))}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <button className="kmc-kaydet-btn" onClick={() => handleGercekGir(kart.id)} style={{ padding: '8px 16px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Check size={16} /> Kaydet
                  </button>
                </div>

                {mut.gercek > 0 && !mut.paid && (
                  <div className="kmc-payment-actions" style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px' }}>
                        <div style={{ opacity: 0.7 }}>Asgari (%{kart.min_pct || 20})</div>
                        <strong style={{ color: '#ef4444' }}>{fmt(mut.gercek * (kart.min_pct || 20) / 100, prv)}</strong>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '14px' }}>
                        <div style={{ opacity: 0.7 }}>Dönem Borcu</div>
                        <strong style={{ color: '#10b981' }}>{fmt(mut.gercek, prv)}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        style={{ flex: 1, padding: '10px', borderRadius: '50px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => payCreditCard(kart.id, mut.gercek * (kart.min_pct || 20) / 100, 'min')}
                      >
                        ASGARİ ÖDE
                      </button>
                      <button 
                        style={{ flex: 1, padding: '10px', borderRadius: '50px', background: 'var(--finans, #10b981)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => payCreditCard(kart.id, mut.gercek, 'full')}
                      >
                        TAMAMINI ÖDE
                      </button>
                    </div>
                  </div>
                )}

                {mut.paid && (
                  <div style={{ marginTop: '16px', padding: '10px', background: '#f0fdf4', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
                    <Check size={18} />
                    <span>Bu ayın ödemesi yapıldı ({mut.paymentType === 'full' ? 'Tam' : 'Asgari'})</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="ozet-section-title" style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🏦 Krediler</span>
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
              <button className="lc-pay-btn" onClick={() => { payLoanInstallment(loan.id); toast.success(`${loan.name} taksiti ödendi!`); }}>
                TAKSİT ÖDE
              </button>
            </div>
          </div>
        );
      })}

      <KartYonetimModal 
        isOpen={showKartModal || !!editingKart} 
        onClose={() => { setShowKartModal(false); setEditingKart(null); }} 
        finans={finans} 
        updateFinansData={updateFinansData} 
        initialData={editingKart}
      />
      <BorcYonetimModal isOpen={showBorcModal} onClose={() => setShowBorcModal(false)} finans={finans} updateFinansData={updateFinansData} />

      <ConfirmModal 
        isOpen={!!deletingKartId}
        title="Kartı Sil"
        message="Bu kredi kartını silmek istediğine emin misin? Bu karta bağlı tüm mutabakat verileri de silinecektir."
        onConfirm={() => {
          const newKartlar = kartlar.filter(k => k.id !== deletingKartId);
          updateFinansData('kartlar', newKartlar);
          toast.success('Kart silindi!');
          setDeletingKartId(null);
        }}
        onCancel={() => setDeletingKartId(null)}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        icon="🗑️"
      />
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
            <div className="onay-btns">
              <button className="onay-btn reject" onClick={() => reddetHarcama(item.id)}>
                <X size={16} />
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
  const defaults = { id: '', name: '', limit: '', cutoff_day: '', due_day_offset: 10, min_pct: 20, owner: 'ortak', color: '#6366f1' };
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
        min_pct: Number(yeniKart.min_pct)
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

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleSil = (id) => {
    setDeleteModal({ open: true, id });
  };

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

          <button 
            className="premium-submit-btn" 
            style={{ width: '100%', marginTop: '24px' }} 
            onClick={handleEkle}
          >
            Borcu Kaydet
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.open}
        title="Borcu Siliyorsun"
        message="Bu borç veya kredi kaydını tamamen silmek istediğine emin misin?"
        onConfirm={confirmSil}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        icon="📉"
      />
    </ActionSheet>
  );
}
