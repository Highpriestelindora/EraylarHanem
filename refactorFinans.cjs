const fs = require('fs');
const file = 'c:/Users/gorke/OneDrive/Masaüstü/EraylarHanem-main/src/pages/Finans.jsx';
let content = fs.readFileSync(file, 'utf8');

const harcamalarBody = `const HarcamalarTab = React.memo(({ finans, prv }) => {
  const buAyHarcamalar = finans?.buAyHarcamalar || [];
  const { deleteHarcama, updateHarcama } = useStore();
  const [filter, setFilter] = useState('hepsi');
  const [editingHarcama, setEditingHarcama] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const kategoriler = ['hepsi', ...new Set(buAyHarcamalar.map(h => h.kategori).filter(Boolean))];

  const filtrelenmis = filter === 'hepsi'
    ? buAyHarcamalar
    : buAyHarcamalar.filter(h => h.kategori === filter);

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
      group = \`\${d.getDate()} \${AY_ADLARI[d.getMonth()]}\`;
    }
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(h);
    return acc;
  }, {});

  return (
    <div className="f-tab-content animate-fadeIn">
      <div className="ozet-section-title" style={{ marginTop: '0px' }}>
        📋 Bu Ayın Harcamaları
        <span className="h-count" style={{ float: 'right', fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>{filtrelenmis.length} kayıt</span>
      </div>

      <div className="h-filter-scroll" style={{ paddingBottom: '12px' }}>
        {kategoriler.map(k => (
          <button key={k} className={\`h-filter-btn \${filter === k ? 'active' : ''}\`} onClick={() => setFilter(k)}>
            {k === 'hepsi' ? 'Tümü' : k}
          </button>
        ))}
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
                <div key={h.id} className="harcama-row glass" style={{ padding: '12px 16px', borderLeft: \`4px solid \${h.odenme_turu === 'kart' ? '#3b82f6' : '#10b981'}\` }}>
                  <div className="hr-icon" style={{ background: 'transparent', width: 'auto', height: 'auto', fontSize: '20px' }}>{KAYNAK_ICONS[h.kaynak] || '💸'}</div>
                  <div className="hr-info" style={{ flex: 1 }}>
                    <strong style={{ fontSize: '15px', color: '#1e293b' }}>{h.baslik}</strong>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ fontSize: '10px', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>{h.kategori || 'Diğer'}</span>
                      <small style={{ color: '#64748b' }}>· {h.kayit_eden} · {h.kart_id ? h.kart_id.split('-').pop() : (h.banka_id ? 'Havale' : 'Nakit')}</small>
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

// ── Kredi Sekmesi ─────────────────────────────────────────────`;

const regex = /const HarcamalarTab = React\.memo\(\(\{\s*finans,\s*prv\s*\}\) => \{[\s\S]*?\/\/\s*── Kredi Sekmesi ─────────────────────────────────────────────/;
if (regex.test(content)) {
  content = content.replace(regex, harcamalarBody);
  fs.writeFileSync(file, content, 'utf8');
  console.log('REPLACED HARCAMALAR OK');
} else {
  console.log('COULD NOT MATCH HARCAMALAR REGEX');
}
