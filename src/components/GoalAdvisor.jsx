import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

const GoalAdvisor = ({ visionGoals, moneyGoals }) => {
  const advice = useMemo(() => {
    const totalVision = visionGoals.length;
    const completedVision = visionGoals.filter(g => g.completed).length;
    
    const moneySummary = moneyGoals.reduce((acc, g) => {
      const perc = (g.current / g.target) * 100;
      if (perc >= 100) acc.completed++;
      else if (perc > 80) acc.nearDone++;
      acc.total++;
      return acc;
    }, { total: 0, completed: 0, nearDone: 0 });

    // logic for smart messages
    const overdueGoals = moneyGoals.filter(g => {
      if (!g.deadline) return false;
      return new Date(g.deadline) < now && g.current < g.target;
    });

    if (overdueGoals.length > 0) {
      return {
        icon: <AlertTriangle className="animate-bounce" color="#ef4444" />,
        title: "Dikkat: Süresi Dolan Hedefler",
        text: `"${overdueGoals[0].name}" hedefin için planlanan süre dolmuş. Bütçeni yeniden gözden geçirelim mi? 🧐`,
        type: 'warning'
      };
    }

    if (moneySummary.nearDone > 0) {
      const nearGoal = moneyGoals.find(g => (g.current / g.target) > 0.8 && (g.current / g.target) < 1);
      return {
        icon: <Sparkles className="animate-pulse" color="#f59e0b" />,
        title: "Neredeyse Oradasın!",
        text: `"${nearGoal.name}" hedefin için son düzlüktesin. %${Math.round((nearGoal.current / nearGoal.target) * 100)} tamamlandı. Küçük bir gayretle bu hafta bitirebiliriz! 🚀`,
        type: 'success'
      };
    }

    // New: Monthly savings advice
    const activeMoneyGoals = moneyGoals.filter(g => g.current < g.target && g.deadline);
    if (activeMoneyGoals.length > 0) {
       const firstGoal = activeMoneyGoals[0];
       const dl = new Date(firstGoal.deadline);
       const diffMonths = Math.ceil((dl - now) / (1000 * 60 * 60 * 24 * 30.44));
       if (diffMonths > 0) {
         const monthly = Math.round((firstGoal.target - firstGoal.current) / diffMonths);
         return {
           icon: <TrendingUp color="#3b82f6" />,
           title: "Aylık Birikim Planı",
           text: `"${firstGoal.name}" hedefine zamanında ulaşmak için ayda en az ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(monthly)} kenara ayırmalısın. 💪`,
           type: 'info'
         };
       }
    }

    return {
      icon: <CheckCircle2 color="#10b981" />,
      title: "Her Şey Yolunda",
      text: "Hedeflerin ve birikimlerin dengeli ilerliyor. Eraylar ailesi için vizyon net! 🎯",
      type: 'neutral'
    };
  }, [visionGoals, moneyGoals]);

  return (
    <div className={`goal-advisor-card ${advice.type}`}>
       <div className="ga-icon-box">{advice.icon}</div>
       <div className="ga-content">
          <h4>{advice.title}</h4>
          <p>{advice.text}</p>
       </div>
    </div>
  );
};

export default GoalAdvisor;
