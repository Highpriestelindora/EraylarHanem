import React, { useState } from 'react';
import { 
  Play, CheckCircle2, AlertTriangle, XCircle, Database, 
  Target, Sparkles, TrendingUp, RefreshCcw, ShieldCheck
} from 'lucide-react';
import useStore from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function MassDebugTool() {
  const [results, setResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const { hedefler, kasa, syncAllHedefler } = useStore();

  const runHedeflerTests = async () => {
    setIsTesting(true);
    const newResults = [];
    const familyId = 'eraylar-family-shared-id';

    const addResult = (name, status, message) => {
      newResults.push({ name, status, message });
    };

    try {
      // 1. Check Active Money Goals
      const moneyGoals = kasa?.kumbaralar || [];
      const { data: dbMoney, error: errMoney } = await supabase
        .from('hedefler_aktif')
        .select('id')
        .eq('family_id', familyId)
        .eq('type', 'money');

      if (errMoney) addResult('Para Hedefleri (SQL)', 'error', `Sorgu hatası: ${errMoney.message}`);
      else if (moneyGoals.length === 0) addResult('Para Hedefleri', 'warning', 'Yerel state boş.');
      else {
        const missing = moneyGoals.filter(lg => !dbMoney.some(rg => String(rg.id).includes(String(lg.id))));
        if (missing.length === 0) addResult('Para Hedefleri', 'success', `${moneyGoals.length} hedef SQL ile uyumlu.`);
        else addResult('Para Hedefleri', 'warning', `${missing.length}/${moneyGoals.length} hedef SQL'de bulunamadı!`);
      }

      // 2. Check Vision Goals
      const visionGoals = hedefler?.goals || [];
      const { data: dbVision, error: errVision } = await supabase
        .from('hedefler_aktif')
        .select('id')
        .eq('family_id', familyId)
        .eq('type', 'vision');

      if (errVision) addResult('Vizyon Hedefleri (SQL)', 'error', `Sorgu hatası: ${errVision.message}`);
      else if (visionGoals.length === 0) addResult('Vizyon Hedefleri', 'warning', 'Yerel state boş.');
      else {
        const missing = visionGoals.filter(lg => !dbVision.some(rg => String(rg.id).includes(String(lg.id))));
        if (missing.length === 0) addResult('Vizyon Hedefleri', 'success', `${visionGoals.length} hedef SQL ile uyumlu.`);
        else addResult('Vizyon Hedefleri', 'warning', `${missing.length}/${visionGoals.length} hedef SQL'de bulunamadı!`);
      }

      // 3. Check Long Term Vision Plans
      const visionPlans = hedefler?.longTermVision || [];
      const { data: dbPlans, error: errPlans } = await supabase
        .from('hedefler_vizyon')
        .select('id')
        .eq('family_id', familyId);

      if (errPlans) addResult('Vizyon Planları (SQL)', 'error', `Sorgu hatası: ${errPlans.message}`);
      else if (visionPlans.length === 0) addResult('Vizyon Planları', 'warning', 'Yerel state boş.');
      else {
        const missing = visionPlans.filter(lp => !dbPlans.some(rp => String(rp.id).includes(String(lp.id))));
        if (missing.length === 0) addResult('Vizyon Planları', 'success', `${visionPlans.length} plan SQL ile uyumlu.`);
        else addResult('Vizyon Planları', 'warning', `${missing.length}/${visionPlans.length} plan SQL'de bulunamadı!`);
      }

    } catch (e) {
      addResult('Genel Test', 'error', e.message);
    }

    setResults(newResults);
    setIsTesting(false);
  };

  const handleFullSync = async () => {
    await syncAllHedefler();
    runHedeflerTests();
  };

  return (
    <div className="mass-debug-card glass">
      <div className="md-header">
        <div className="md-title">
          <Database size={20} className="text-primary" />
          <h3>Hedefler Senkronizasyon Masası</h3>
        </div>
        <div className="md-actions">
          <button 
            className={`debug-btn primary ${isTesting ? 'loading' : ''}`}
            onClick={runHedeflerTests}
            disabled={isTesting}
          >
            <Play size={16} /> Test Et
          </button>
          <button 
            className="debug-btn success"
            onClick={handleFullSync}
            disabled={isTesting}
          >
            <RefreshCcw size={16} /> SQL'e Gönder
          </button>
        </div>
      </div>

      <div className="md-status-grid">
        <div className="md-status-item">
          <TrendingUp size={14} />
          <span>Para: {kasa?.kumbaralar?.length || 0}</span>
        </div>
        <div className="md-status-item">
          <Target size={14} />
          <span>Vizyon: {hedefler?.goals?.length || 0}</span>
        </div>
        <div className="md-status-item">
          <Sparkles size={14} />
          <span>Planlar: {hedefler?.longTermVision?.length || 0}</span>
        </div>
      </div>

      <div className="md-results">
        {results.length === 0 ? (
          <div className="empty-results">
            <ShieldCheck size={32} />
            <p>Sistem taraması için "Test Et" butonuna bas.</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((r, idx) => (
              <div key={idx} className={`result-row ${r.status}`}>
                <div className="result-info">
                  {r.status === 'success' && <CheckCircle2 size={16} className="text-success" />}
                  {r.status === 'warning' && <AlertTriangle size={16} className="text-warning" />}
                  {r.status === 'error' && <XCircle size={16} className="text-danger" />}
                  <span className="result-name">{r.name}</span>
                </div>
                <span className="result-message">{r.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
