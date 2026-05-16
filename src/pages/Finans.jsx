import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  TrendingDown, CreditCard, Clock, Check, X, AlertCircle,
  ChevronDown, ChevronUp, Calendar, ArrowLeft, Eye, EyeOff,
  Landmark, RotateCcw, Plus, History, Wallet, PieChart,
  Settings, Trash2, Edit, RefreshCcw
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
  const beklenen = mut.beklenen || 0;
  const gercek = mut.gercek ?? null;
  const fark = gercek != null ? (gercek - beklenen) : null;
  const limit = selectedKart?.limit || 0;
  const aktifBorc = gercek != null ? gercek : beklenen;
  const limitPerc = limit > 0 ? Math.min(100, (aktifBorc / limit) * 100) : 0;
  const barColor = limitPerc > 90 ? '#ef4444' : limitPerc > 70 ? '#f59e0b' : '#10b981';

  const today = new Date();
  const cutoffDay = selectedKart?.cutoff_day || 10;
  const dueOffset = selectedKart?.due_day_offset || 10;
  const cutoffStr = `Her ayın ${cutoffDay}. günü`;
  const dueDate = new Date(today.getFullYear(), today.getMonth(), cutoffDay + dueOffset);
  const dueDateStr = dueDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' });

  const buKartinOdemeleri = kartOdemeleri.filter(o => o.kart_id === selectedKart?.id).slice(0, 5);

  const handleEkstreGir = async () => {
    if (!eksreInput || isNaN(eksreInput)) return toast.error('Geçerli tutar girin');
    await gercekKartBorcuGir(selectedKart.id, eksreInput, buAy);
    setEkstreInput('');
  };

  const handleOdeme = async () => {
    if (!selectedKart) return;
    let tutar = aktifBorc;
    if (odemeTuru === 'min') tutar = aktifBorc * ((selectedKart.min_pct || 20) / 100);
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
          const borc = m.gercek ?? m.beklenen ?? 0;
          const isSelected = k.id === selectedKartId;
          return (
            <button
              key={k.id}
              className={`kredi-strip-btn ${isSelected ? 'active' : ''}`}
              style={{ borderColor: isSelected ? (k.color || '#6366f1') : 'transparent' }}
              onClick={() => { setSelectedKartId(k.id); setPayingCard(null); setEkstreInput(''); }}
            >
              <span className="ksb-name">{k.name}</span>
              <span className="ksb-borc" style={{ color: borc > 0 ? '#ef4444' : '#10b981' }}>
                {fmt(borc, prv)}
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
              <div><strong>{fmt(Math.max(0, limit - aktifBorc), prv)}</strong><small>Kullanılabilir</small></div>
              <div className="right"><strong>{fmt(limit, prv)}</strong><small>Limit</small></div>
            </div>
            <div className="premium-cc-limit-bar">
              <div className="premium-cc-limit-fill" style={{ width: `${limitPerc}%`, background: barColor }} />
            </div>
          </div>

          {/* ── Borç Karşılaştırma ── */}
          <div className="kredi-compare-card glass">
            <div className="kcc-row">
              <div className="kcc-item">
                <div className="kcc-label">📊 SİSTEM TAHMİNİ</div>
                <div className="kcc-val amber">{fmt(beklenen, prv)}</div>
                <div className="kcc-sub">Bu ay girilen harcamalar</div>
              </div>
              <div className="kcc-divider" />
              <div className="kcc-item">
                <div className="kcc-label">📄 GERÇEK EKSTRE</div>
                <div className="kcc-val" style={{ color: gercek != null ? '#1e293b' : '#94a3b8' }}>
                  {gercek != null ? fmt(gercek, prv) : '—'}
                </div>
                <div className="kcc-sub">Bankadan baktığın tutar</div>
              </div>
            </div>

            {fark != null && (
              <div className={`kcc-fark ${Math.abs(fark) < 10 ? 'ok' : fark > 0 ? 'warn' : 'good'}`}>
                {Math.abs(fark) < 10
                  ? '✅ Sistem doğru! Tüm harcamalar kayıtlı.'
                  : fark > 0
                  ? `⚠️ +${fmt(fark, prv)} fark: Sistemde kayıt dışı harcama var`
                  : `🎉 ${fmt(Math.abs(fark), prv)} az: Fazla kayıt girilmiş olabilir`}
              </div>
            )}

            {/* Ekstre Giriş */}
            <div className="kcc-ekstre-input">
              <input
                type="number"
                placeholder={gercek != null ? `Mevcut: ${fmt(gercek, prv)} — Güncelle` : 'Bankadan bak ve gir (₺)'}
                value={eksreInput}
                onChange={e => setEkstreInput(e.target.value)}
              />
              <button onClick={handleEkstreGir}>Kaydet</button>
            </div>
          </div>

          {/* ── Tarihler ── */}
          <div className="kredi-dates-row">
            <div className="kdr-item"><span>🗓️ Kesim</span><strong>{cutoffStr}</strong></div>
            <div className="kdr-item right"><span>⏰ Son Ödeme</span><strong style={{ color: '#ef4444' }}>{dueDateStr}</strong></div>
          </div>

          {/* ── Ödeme Paneli ── */}
          {!mut.paid ? (
            <div className="kredi-odeme-panel glass">
              <div className="kop-title">💰 Ödeme Yap</div>

              {/* Ödeme Türü */}
              <div className="kop-type-row">
                {[
                  { id: 'full', label: 'Tam', val: fmt(aktifBorc, prv) },
                  { id: 'min', label: 'Asgari', val: fmt(aktifBorc * (selectedKart.min_pct || 20) / 100, prv) },
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

          {/* ── Ödeme Geçmişi ── */}
          {buKartinOdemeleri.length > 0 && (
            <div className="kredi-odeme-gecmis">
              <div className="kog-title">📋 Son Ödemeler</div>
              {buKartinOdemeleri.map(o => (
                <div key={o.id} className="kog-row">
                  <div className="kog-left">
                    <span className="kog-ay">{o.ay}</span>
                    <span className="kog-turu">{o.turu === 'full' ? 'Tam' : o.turu === 'min' ? 'Asgari' : 'Kısmi'}</span>
                  </div>
                  <div className="kog-right">
                    <strong>{fmt(o.tutar, prv)}</strong>
                    <small>{o.kaynak === 'nakit' ? '💵 Nakit' : '🏦 Havale'}</small>
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
        <button className="kredi-mgmt-btn" onClick={() => setShowBorcModal(true)}><TrendingDown size={14} /> Kredi Yönet</button>
      </div>

      <KartYonetimModal isOpen={showKartModal || !!editingKart} onClose={() => { setShowKartModal(false); setEditingKart(null); }} finans={finans} updateFinansData={updateFinansData} initialData={editingKart} />
      <BorcYonetimModal isOpen={showBorcModal} onClose={() => setShowBorcModal(false)} finans={finans} updateFinansData={updateFinansData} />
      <ConfirmModal isOpen={!!deletingKartId} title="Kartı Sil" message="Bu kredi kartını silmek istediğine emin misin?" onConfirm={() => { useStore.getState().deleteFinansKart(deletingKartId); toast.success('Kart silindi!'); setDeletingKartId(null); }} onCancel={() => setDeletingKartId(null)} confirmText="Evet, Sil" cancelText="Vazgeç" icon="🗑️" />
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
