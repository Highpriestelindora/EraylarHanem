import React, { useState, useMemo } from 'react';
import { X, Play, Zap, Calendar, TrendingUp, Coins, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const GoalSimulator = ({ goals, onClose }) => {
  const [mode, setMode] = useState('sim'); // 'sim' or 'dist'
  const [extraSaving, setExtraSaving] = useState(0);
  const [distAmount, setDistAmount] = useState(0);
  const { distributeSavings } = useStore();

  const simulatedGoals = useMemo(() => {
    return goals.map(g => {
      if (g.type !== 'money' || g.current >= g.target) return g;
      const remaining = g.target - g.current;
      const currentMonthly = g.forecast?.monthlyNeeded || 0;
      const newMonthly = currentMonthly + Number(extraSaving);
      const newMonths = Math.ceil(remaining / newMonthly);
      const monthsSaved = (g.forecast?.months || 0) - newMonths;
      return { ...g, simulatedMonths: newMonths, monthsSaved: monthsSaved > 0 ? monthsSaved : 0 };
    });
  }, [goals, extraSaving]);

  const distributionPreview = useMemo(() => {
    if (mode !== 'dist' || distAmount <= 0) return [];
    
    let remaining = Number(distAmount);
    // Mimic the store logic for preview
    const activeGoals = goals
      .filter(g => g.type === 'money' && g.current < g.target)
      .sort((a, b) => {
        const pMap = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };
        if (pMap[b.priority] !== pMap[a.priority]) return pMap[b.priority] - pMap[a.priority];
        if (a.targetDate && b.targetDate) return new Date(a.targetDate) - new Date(b.targetDate);
        return 0;
      });

    return activeGoals.map(g => {
      if (remaining <= 0) return { ...g, distributed: 0 };
      const needed = g.target - g.current;
      const toAdd = Math.min(needed, remaining);
      remaining -= toAdd;
      return { ...g, distributed: toAdd };
    });
  }, [goals, distAmount, mode]);

  const handleApplyDist = () => {
    distributeSavings(distAmount);
    onClose();
  };

  return (
    <div className="simulator-overlay animate-fadeIn">
      <div className="simulator-card glass-premium animate-slideUp">
        <div className="sim-header">
          <div className="sim-title">
            {mode === 'sim' ? <Zap size={20} color="#f59e0b" fill="#f59e0b" /> : <Coins size={20} color="#10b981" />}
            <h3>{mode === 'sim' ? 'Senaryo Simülatörü' : 'Akıllı Dağıtım'}</h3>
          </div>
          <button className="sim-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="sim-tabs">
           <button className={`sim-tab ${mode === 'sim' ? 'active' : ''}`} onClick={() => setMode('sim')}>Simülasyon</button>
           <button className={`sim-tab ${mode === 'dist' ? 'active' : ''}`} onClick={() => setMode('dist')}>Akıllı Dağıtım</button>
        </div>

        <div className="sim-body">
           {mode === 'sim' ? (
             <>
               <p className="sim-intro">Aylık birikiminizi artırırsanız hedeflerinize ne kadar erken ulaşırsınız? Test edin.</p>
               <div className="sim-input-box">
                  <label>Ekstra Aylık Birikim (₺)</label>
                  <div className="sim-slider-container">
                     <input type="range" min="0" max="50000" step="500" value={extraSaving} onChange={(e) => setExtraSaving(e.target.value)} />
                     <div className="sim-value">{new Intl.NumberFormat('tr-TR').format(extraSaving)} ₺</div>
                  </div>
               </div>
               <div className="sim-results">
                  {simulatedGoals.filter(g => g.type === 'money' && g.current < g.target).map(g => (
                    <div key={g.id} className="sim-result-item">
                       <div className="sri-info"><span className="sri-emoji">{g.icon}</span><strong>{g.title}</strong></div>
                       <div className="sri-data">
                          <div className="sri-stat"><small>Yeni Süre</small><span>{g.simulatedMonths} Ay</span></div>
                          {g.monthsSaved > 0 && <div className="sri-badge"><TrendingUp size={12} /><span>{g.monthsSaved} Ay Kazanç!</span></div>}
                       </div>
                    </div>
                  ))}
               </div>
             </>
           ) : (
             <>
               <p className="sim-intro">Elinizdeki toplu parayı hedeflerinize en verimli şekilde (öncelik sırasına göre) dağıtın.</p>
               <div className="sim-input-box">
                  <label>Dağıtılacak Toplam Tutar (₺)</label>
                  <input 
                    type="number" 
                    className="sim-number-input" 
                    value={distAmount} 
                    onChange={(e) => setDistAmount(e.target.value)} 
                    placeholder="Örn: 10000"
                  />
               </div>
               <div className="sim-results">
                  {distributionPreview.filter(g => g.distributed > 0).map(g => (
                    <div key={g.id} className="sim-result-item dist">
                       <div className="sri-info"><span className="sri-emoji">{g.icon}</span><strong>{g.title}</strong></div>
                       <div className="sri-data">
                          <div className="sri-stat">
                            <small>Eklenecek</small>
                            <span className="dist-val">+{new Intl.NumberFormat('tr-TR').format(g.distributed)} ₺</span>
                          </div>
                          <span className="priority-tag-mini">{g.priority}</span>
                       </div>
                    </div>
                  ))}
                  {distAmount > 0 && distributionPreview.filter(g => g.distributed > 0).length === 0 && (
                    <p className="sim-empty">Tüm hedefler zaten tamamlanmış! 🎉</p>
                  )}
               </div>
             </>
           )}
        </div>

        <div className="sim-footer">
           {mode === 'sim' ? (
             <button className="sim-apply-btn" onClick={onClose}>Anladım</button>
           ) : (
             <button className="sim-apply-btn dist" onClick={handleApplyDist} disabled={distAmount <= 0}>
                DAĞITIMI ONAYLA 🚀
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default GoalSimulator;
