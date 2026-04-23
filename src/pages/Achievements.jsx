import React from 'react';
import { Trophy, Star, Medal, Target, Wallet, HeartPulse, Utensils, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import './Achievements.css';

export default function Achievements() {
  const { kasa, hedefler, mutfak, saglik } = useStore();

  const K = kasa || { gorkem: 0, esra: 0, ortak: 0 };
  const totalMoney = (K.gorkem || 0) + (K.esra || 0) + (K.ortak || 0);
  const doneGoals = (hedefler || []).filter(h => h.done).length;
  const recipeCount = (mutfak?.tarifler || []).length;
  const doneMeds = (saglik?.ilaclar || []).length;

  const achs = [
    { 
      id: 1, 
      title: 'Milyoner Yolunda', 
      desc: 'Toplam birikim 100.000₺ üzerine çıktı.', 
      icon: Wallet, 
      met: totalMoney >= 100000 
    },
    { 
      id: 2, 
      title: 'Hedef Avcısı', 
      desc: 'En az 5 hedef başarıyla tamamlandı.', 
      icon: Trophy, 
      met: doneGoals >= 5 
    },
    { 
      id: 3, 
      title: 'Master Chef', 
      desc: 'Tarif defterine 50+ tarif eklendi.', 
      icon: Utensils, 
      met: recipeCount >= 50 
    },
    { 
      id: 4, 
      title: 'Sağlıklı Yaşam', 
      desc: 'En az 3 aktif ilaç/takviye kaydı var.', 
      icon: HeartPulse, 
      met: doneMeds >= 3 
    },
    { 
      id: 5, 
      title: 'Aile Birliği', 
      desc: 'Ortak kasa bakiyesi oluşturuldu.', 
      icon: Medal, 
      met: K.ortak > 0 
    },
    { 
      id: 6, 
      title: 'Erkenci Kuş', 
      desc: 'Sabah rutini başarıyla uygulandı.', 
      icon: Star, 
      met: false // Placeholder for future logic
    }
  ];

  return (
    <AnimatedPage className="achs-container">
      <div className="achs-header">
        <div className="h-top">
          <Trophy size={32} color="#f59e0b" />
          <h2>Eraylar Hanem Başarılar</h2>
        </div>
        <p>Birlikte elde ettiğimiz tüm başarılar ve rozetler.</p>
      </div>

      <div className="achs-grid">
        {achs.map(a => (
          <div key={a.id} className={`ach-card ${a.met ? 'unlocked' : 'locked'}`}>
            <div className="ach-icon-box">
              <a.icon size={24} />
              {a.met && <div className="unlock-badge"><CheckCircle size={12} /></div>}
            </div>
            <div className="ach-info">
              <strong>{a.title}</strong>
              <p>{a.desc}</p>
            </div>
            {!a.met && <div className="lock-overlay">🔒</div>}
          </div>
        ))}
      </div>
    </AnimatedPage>
  );
}
