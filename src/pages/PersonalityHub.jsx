import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Folder, CheckCircle2, ChevronRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { PERSONALITY_TESTS } from '../constants/personalityData';
import './PersonalityHub.css';

export default function PersonalityHub() {
  const navigate = useNavigate();
  const { ev } = useStore();
  const personality = ev?.tracking?.personality || { results: {} };

  return (
    <AnimatedPage className="p-hub-page">
      <header className="p-hub-header glass">
        <button className="back-btn" onClick={() => navigate('/ev')}>
          <ArrowLeft size={24} />
        </button>
        <div className="p-hub-title">
          <Brain size={24} color="var(--ev)" />
          <h1>Karakter Arşivi</h1>
        </div>
        <div style={{ width: 40 }} />
      </header>

      <div className="p-hub-content">
        <div className="p-hub-intro">
          <p>Yekta Tilmen'in senin için hazırladığı gizli dosyalar. Her test, karakterinin farklı bir katmanını aydınlatır.</p>
        </div>

        <div className="dossier-grid">
          {PERSONALITY_TESTS.map((test, idx) => {
            const result = personality.results?.[test.id];
            const isCompleted = !!result;
            
            return (
              <motion.div 
                key={test.id}
                className={`dossier-card glass ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/yekta-test?id=${test.id}`)}
              >
                <div className="dossier-folder">
                  <Folder size={48} color={isCompleted ? 'var(--ev)' : '#94a3b8'} strokeWidth={1.5} />
                  <div className="dossier-icon-overlay">{test.icon}</div>
                </div>
                
                <div className="dossier-info">
                  <h3>{test.title}</h3>
                  <p>{test.desc}</p>
                </div>

                {isCompleted ? (
                   <div className="dossier-status stamp">ANALİZ EDİLDİ</div>
                ) : (
                   <div className="dossier-status">BEKLİYOR</div>
                )}

                <div className="dossier-footer">
                  <span className="text-10 font-bold opacity-40">DOSYA NO: 2026/A-{idx+1}</span>
                  <ChevronRight size={14} opacity={0.3} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="archive-stats mt-32 glass">
           <div className="stat-item">
              <strong>{Object.keys(personality.results || {}).length} / {PERSONALITY_TESTS.length}</strong>
              <span>Tamamlanan Dosyalar</span>
           </div>
           <div className="stat-divider" />
           <div className="stat-item">
              <strong>{personality.history?.length || 0}</strong>
              <span>Toplam Analiz</span>
           </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
