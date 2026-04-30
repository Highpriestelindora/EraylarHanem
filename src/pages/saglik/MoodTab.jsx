import React, { useState, useMemo } from 'react';
import { Send, Heart, User, Briefcase, Users, Activity, Sparkles, HelpCircle } from 'lucide-react';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Mutlu', color: '#fef3c7' },
  { id: 'calm', emoji: '😌', label: 'Huzurlu', color: '#ecfdf5' },
  { id: 'tired', emoji: '😫', label: 'Yorgun', color: '#f8fafc' },
  { id: 'sad', emoji: '😔', label: 'Üzgün', color: '#eff6ff' },
  { id: 'energetic', emoji: '🤩', label: 'Enerjik', color: '#fff7ed' },
  { id: 'sick', emoji: '🤒', label: 'Hasta', color: '#fef2f2' }
];

const KATEGORILER = [
  { id: 'İş', icon: <Briefcase size={14} />, label: 'İş / Kariyer' },
  { id: 'Aile', icon: <Heart size={14} />, label: 'Aile' },
  { id: 'Sosyal', icon: <Users size={14} />, label: 'Sosyal' },
  { id: 'Sağlık', icon: <Activity size={14} />, label: 'Sağlık' },
  { id: 'Genel', icon: <Sparkles size={14} />, label: 'Genel' },
  { id: 'Diğer', icon: <HelpCircle size={14} />, label: 'Diğer' }
];

export default function MoodTab() {
  const { saglik, addMood, currentUser } = useStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedKat, setSelectedKat] = useState('Genel');
  const [note, setNote] = useState('');
  const [visibleDays, setVisibleDays] = useState(5);

  const handleShare = () => {
    if (!selectedMood) {
      toast.error('Önce bir ruh hali seçmelisin! ✨');
      return;
    }
    const userName = currentUser?.name?.toLowerCase().includes('esra') ? 'esra' : 'gorkem';
    addMood(userName, selectedMood, note, selectedKat);
    setSelectedMood(null);
    setSelectedKat('Genel');
    setNote('');
    toast.success('Wellness kaydı paylaşıldı! 🎭');
  };

  const moods = saglik?.moods || [];

  const groupedMoods = useMemo(() => {
    const groups = {};
    // Sort all moods by date descending first
    const sortedMoods = [...moods].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedMoods.forEach(m => {
      const d = new Date(m.date);
      const today = new Date();
      let dateKey;
      
      const isToday = d.toDateString() === today.toDateString();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();

      if (isToday) dateKey = 'Bugün';
      else if (isYesterday) dateKey = 'Dün';
      else dateKey = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
      
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return Object.entries(groups);
  }, [moods]);

  return (
    <div className="mood-tab animate-fadeIn">
      <div className="mood-input-card glass" style={{ padding: '16px', borderRadius: '24px' }}>
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#1e293b' }}>🎭 Wellness Paylaş</h3>
        </div>

        <div className="mood-grid-premium">
          {MOODS.map(m => (
            <motion.button 
              key={m.id} 
              whileTap={{ scale: 0.9 }}
              className={`mood-btn-v2 ${selectedMood?.id === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMood(m)}
              style={{ '--mood-bg': m.color }}
            >
              <span className="m-emoji">{m.emoji}</span>
              <span className="m-label">{m.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="reason-section" style={{ marginTop: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '800', opacity: 0.6, marginBottom: '8px', display: 'block' }}>Neden?</label>
          <div className="reason-scroll-row">
            {KATEGORILER.map(k => (
              <button 
                key={k.id} 
                className={`reason-tag-mini ${selectedKat === k.id ? 'active' : ''}`}
                onClick={() => setSelectedKat(k.id)}
              >
                {k.id}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <textarea 
            placeholder="Bir şeyler eklemek ister misin? (opsiyonel)" 
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="premium-input"
            style={{ minHeight: '80px' }}
          />
        </div>

        <button className="submit-btn-premium wellness" onClick={handleShare}>
          <Send size={18} /> Paylaş
        </button>
      </div>

      <div className="mood-history-premium mt-20">
        <div className="section-title-premium">
          <Heart size={18} color="#EC4899" fill="#EC4899" />
          <span>Haftalık Wellness Takibi</span>
        </div>
        
        {groupedMoods.length === 0 ? (
          <div className="empty-state-v2">
             <p>Henüz ruh hali paylaşılmamış. Günün ilk paylaşımını yapmaya ne dersin?</p>
          </div>
        ) : (
          <div className="mood-timeline-v3">
            {groupedMoods.slice(0, visibleDays).map(([date, items], gIdx) => (
              <div key={date} className="mood-day-group">
                <div className="day-header">
                  <span className="dh-line"></span>
                  <span className="dh-text">{date}</span>
                  <span className="dh-line"></span>
                </div>
                <div className="day-items">
                  {items.map((m, idx) => (
                    <motion.div 
                      key={m.id} 
                      className="mood-compact-card glass"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="mcc-left">
                        <div className="mcc-emoji" style={{ background: m.mood.color }}>{m.mood.emoji}</div>
                        <div className="mcc-content">
                          <div className="mcc-top">
                            <span className="mcc-user">{m.user === 'gorkem' ? 'Görkem' : 'Esra'}</span>
                            <span className="mcc-status">{m.mood.label}</span>
                          </div>
                          {m.note && <p className="mcc-note">"{m.note}"</p>}
                        </div>
                      </div>
                      <div className="mcc-right">
                         <span className="mcc-time">{new Date(m.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                         <span className="mcc-kat">{m.kategori}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {groupedMoods.length > visibleDays && (
              <button 
                className="btn-load-more glass mt-10" 
                onClick={() => setVisibleDays(prev => prev + 5)}
              >
                Daha Eski Kayıtları Yükle ({groupedMoods.length - visibleDays} gün daha)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
