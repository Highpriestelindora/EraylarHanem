import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles, Brain, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import { PERSONALITY_TESTS } from '../constants/personalityData';
import './PersonalityTest.css';

export default function PersonalityTest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('id') || 'big5';
  
  const testConfig = PERSONALITY_TESTS.find(t => t.id === testId) || PERSONALITY_TESTS[0];
  const QUESTIONS = testConfig.questions;

  const { savePersonalityResults, currentUser } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers) => {
    setIsFinishing(true);
    setTimeout(() => {
      const traits = {};
      const counts = {};
      
      QUESTIONS.forEach(q => {
        if (!traits[q.cat]) {
          traits[q.cat] = 0;
          counts[q.cat] = 0;
        }
        let score = finalAnswers[q.id];
        if (q.reverse) score = 6 - score;
        traits[q.cat] += score;
        counts[q.cat]++;
      });

      Object.keys(traits).forEach(key => {
        traits[key] = traits[key] / (counts[key] || 1);
      });

      savePersonalityResults(testId, traits);
      navigate('/personality-hub');
    }, 2500);
  };

  return (
    <AnimatedPage className="p-test-page">
      <div className="p-test-header glass">
        <button className="back-btn" onClick={() => navigate('/ev')}>
          <ArrowLeft size={20} />
        </button>
        <div className="p-test-title">
           <Brain size={20} color="var(--ev)" />
           <span>Yekta Tilmen Karakter Analizi</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="p-test-content">
        {!isFinishing ? (
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="q-card"
            >
              <div className="step-info">Soru {step + 1} / {QUESTIONS.length}</div>
              <h2 className="q-text">{currentQ.text}</h2>
              
              <div className="options-stack">
                {[
                  { val: 1, label: 'Kesinlikle Katılmıyorum', color: '#ef4444' },
                  { val: 2, label: 'Katılmıyorum', color: '#f87171' },
                  { val: 3, label: 'Kararsızım', color: '#94a3b8' },
                  { val: 4, label: 'Katılıyorum', color: '#4ade80' },
                  { val: 5, label: 'Kesinlikle Katılıyorum', color: '#22c55e' }
                ].map(opt => (
                  <button 
                    key={opt.val} 
                    className="opt-btn glass"
                    onClick={() => handleAnswer(opt.val)}
                  >
                    <div className="opt-indicator" style={{ background: opt.color }} />
                    <span>{opt.label}</span>
                    <ChevronRight size={16} opacity={0.3} />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="finishing-state"
          >
            <div className="lottie-placeholder">
               <Sparkles size={48} color="var(--ev)" className="animate-bounce" />
            </div>
            <h2>Analiz Tamamlanıyor...</h2>
            <p>Yekta Tilmen, verdiğin yanıtları yaşam dengesi verilerinle sentezliyor. Sana özel karakter tahlilin hazırlanıyor.</p>
            <div className="loading-line mt-24">
              <motion.div 
                className="loading-line-fill"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-test-footer">
         <div className="p-progress-bg">
            <motion.div 
              className="p-progress-fill" 
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
         </div>
      </div>
    </AnimatedPage>
  );
}
