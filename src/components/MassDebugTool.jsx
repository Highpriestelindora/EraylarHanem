
import React, { useState } from 'react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { ShieldAlert, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MassDebugTool() {
  const store = useStore();
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (moduleName, testFn, verifyFn) => {
    setResults(prev => ({ ...prev, [moduleName]: 'RUNNING...' }));
    try {
      await testFn();
      // Wait for state update
      await new Promise(r => setTimeout(r, 1000));
      
      const isValid = verifyFn ? verifyFn(useStore.getState()) : true;
      
      if (isValid) {
        setResults(prev => ({ ...prev, [moduleName]: '✅ SUCCESS & VERIFIED' }));
      } else {
        setResults(prev => ({ ...prev, [moduleName]: '⚠️ SUCCESS BUT NOT IN STATE' }));
      }
    } catch (err) {
      console.error(`Test Failed [${moduleName}]:`, err);
      setResults(prev => ({ ...prev, [moduleName]: `❌ FAILED: ${err.message}` }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // 1. Kasa (Bankalar)
    const bankId = `test-bank-${Date.now()}`;
    await runTest('Kasa (Bankalar)', 
      async () => {
        await store.addBankaHesabi({ id: bankId, name: 'Debug Bank', bank: 'Supabase Test', balance: 1234, icon: '🏦' });
      },
      (state) => state.kasa.bankaHesaplari.some(b => b.name === 'Debug Bank')
    );

    // 2. Kasa (Varlıklar)
    await runTest('Kasa (Varlıklar)', 
      async () => {
        await store.addVarlik({ name: 'Debug Altın', amount: 99, unit: 'gr', type: 'altin', location: 'Kasa', icon: '🟡' });
      },
      (state) => state.kasa.varliklar.some(v => v.name === 'Debug Altın')
    );

    // 3. Kasa (Taşınmazlar)
    await runTest('Kasa (Taşınmazlar)', 
      async () => {
        await store.addTasinmaz({ name: 'Debug Daire', city: 'TestCity', district: 'TestDist', value: 500000 });
      },
      (state) => state.kasa.tasinmazlar.some(t => t.name === 'Debug Daire')
    );

    // 4. Ev (Acil Durum)
    await runTest('Ev (Acil Durum)', 
      async () => {
        await store.addEmergencyItem('deprem', { item: 'Debug Fener', amount: '2 Adet', icon: '🔦' }, 'gorkem');
      },
      (state) => (state.ev.emergencyKits?.deprem || []).some(i => i.item === 'Debug Fener')
    );

    setIsRunning(false);
    toast.success('Tüm testler tamamlandı. Sayfayı yenileyip SQL verilerini kontrol edebilirsiniz!');
  };

  return (
    <div className="mass-debug-tool glass" style={{ padding: '20px', borderRadius: '20px', border: '2px solid #ef4444', margin: '20px', background: 'rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <ShieldAlert color="#ef4444" />
        <h3 style={{ margin: 0, color: '#ef4444', fontSize: '16px' }}>Kasa & Ev Senkronizasyon Testi</h3>
      </div>
      
      <div className="test-results" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {Object.entries(results).map(([mod, res]) => (
          <div key={mod} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
            <span style={{ color: '#64748b' }}>{mod}</span>
            <span style={{ color: res.includes('✅') ? '#10b981' : (res.includes('❌') ? '#ef4444' : '#64748b') }}>{res}</span>
          </div>
        ))}
      </div>

      <button 
        className="premium-submit-btn" 
        onClick={runAllTests} 
        disabled={isRunning}
        style={{ background: '#ef4444', border: 'none', padding: '12px', borderRadius: '12px', color: 'white', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}
      >
        {isRunning ? 'SENKRONİZASYON KONTROLÜ...' : 'SENKRONİZASYONU DOĞRULA 🚀'}
      </button>

      <p style={{ fontSize: '11px', marginTop: '10px', opacity: 0.6, color: '#64748b' }}>
        Bu araç, yeni düzelttiğimiz Kasa ve Ev modüllerinin veritabanına yazılıp yazılmadığını ve state'e girip girmediğini doğrular.
      </p>
    </div>
  );
}
