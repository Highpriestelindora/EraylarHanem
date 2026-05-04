import React from 'react';
import useStore from '../store/useStore';

export default function PaymentSelector({ value, onChange, label = '💳 Ödeme Yöntemi' }) {
  const { finans, kasa } = useStore();
  const kartlar = finans?.kartlar || [];
  const bankalar = kasa?.bankaHesaplari || [];

  return (
    <div className="form-group-v2">
      <label style={{ fontSize: '13px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>{label}</label>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="premium-select"
        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--brd)', background: 'white' }}
      >
        <option value="">Yöntem Seç...</option>
        <option value="nakit">💵 Nakit</option>
        <optgroup label="💳 Kartlar">
          {kartlar.map(k => <option key={k.id} value={`kart|${k.id}`}>{k.name}</option>)}
        </optgroup>
        <optgroup label="🏦 Havale">
          {bankalar.map(b => <option key={b.id} value={`havale|${b.id}`}>{b.name}</option>)}
        </optgroup>
      </select>
    </div>
  );
}
