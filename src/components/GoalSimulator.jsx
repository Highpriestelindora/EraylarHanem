import React, { useState, useMemo } from 'react';
import { X, Play, Zap, Calendar, TrendingUp } from 'lucide-react';

const GoalSimulator = ({ goals, onClose }) => {
  const [extraSaving, setExtraSaving] = useState(0);

  const simulatedGoals = useMemo(() => {
    return goals.map(g => {
      if (g.type !== 'money' || g.current >= g.target) return g;
      
      const remaining = g.target - g.current;
      const currentMonthly = g.forecast?.monthlyNeeded || 0;
      
      // We assume the extra saving is distributed proportionally or just added to all (simple version)
      // Let's assume the user adds the extra saving to a 'Focused Goal' or distributes it.
      // For simplicity, let's say the extra saving is added to the TOTAL monthly saving.
      
      // Let's calculate new months needed if we increase monthly saving by X% or fixed amount.
      const newMonthly = currentMonthly + Number(extraSaving);
      const newMonths = Math.ceil(remaining / newMonthly);
      const monthsSaved = (g.forecast?.months || 0) - newMonths;

      return {
        ...g,
        simulatedMonths: newMonths,
        monthsSaved: monthsSaved > 0 ? monthsSaved : 0
      };
    });
  }, [goals, extraSaving]);

  return (
    <div className="simulator-overlay animate-fadeIn">
      <div className="simulator-card glass-premium animate-slideUp">
        <div className="sim-header">
          <div className="sim-title">
            <Zap size={20} color="#f59e0b" fill="#f59e0b" />
            <h3>Senaryo Simülatörü</h3>
          </div>
          <button className="sim-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="sim-body">
           <p className="sim-intro">Aylık birikiminizi artırırsanız hedeflerinize ne kadar erken ulaşırsınız? Test edin.</p>
           
           <div className="sim-input-box">
              <label>Ekstra Aylık Birikim (₺)</label>
              <div className="sim-slider-container">
                 <input 
                   type="range" 
                   min="0" 
                   max="50000" 
                   step="500" 
                   value={extraSaving} 
                   onChange={(e) => setExtraSaving(e.target.value)} 
                 />
                 <div className="sim-value">{new Intl.NumberFormat('tr-TR').format(extraSaving)} ₺</div>
              </div>
           </div>

           <div className="sim-results">
              {simulatedGoals.filter(g => g.type === 'money' && g.current < g.target).map(g => (
                <div key={g.id} className="sim-result-item">
                   <div className="sri-info">
                      <span className="sri-emoji">{g.icon}</span>
                      <strong>{g.title}</strong>
                   </div>
                   <div className="sri-data">
                      <div className="sri-stat">
                        <small>Yeni Süre</small>
                        <span>{g.simulatedMonths} Ay</span>
                      </div>
                      {g.monthsSaved > 0 && (
                        <div className="sri-badge">
                           <TrendingUp size={12} />
                           <span>{g.monthsSaved} Ay Kazanç!</span>
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="sim-footer">
           <button className="sim-apply-btn" onClick={onClose}>Planı Koru</button>
        </div>
      </div>
    </div>
  );
};

export default GoalSimulator;
