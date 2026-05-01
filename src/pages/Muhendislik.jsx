import React from 'react';
import { Cpu, ArrowLeft, Terminal, Code2, Database, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import './Muhendislik.css';

const Muhendislik = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage className="muhendislik-container">
      <header className="module-header glass" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">⚙️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Mühendislik</h1>
              <p>Görkem'in Teknik Atölyesi</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="muhendislik-content">
        <div className="empty-state-premium-tech">
          <div className="empty-icon-circle-tech">
            <Cpu size={48} color="#6366f1" />
          </div>
          <h2>Atölye Hazırlanıyor...</h2>
          <p>Yazılım projeleri, teknik dökümanlar ve Görkem'in mühendislik notları için tasarlanan bu özel alan çok yakında aktif olacak. 🛠️</p>
          
          <div className="feature-previews-tech">
            <div className="feature-mini-card-tech glass">
              <Code2 size={20} />
              <span>Projeler</span>
            </div>
            <div className="feature-mini-card-tech glass">
              <Terminal size={20} />
              <span>Scripts</span>
            </div>
            <div className="feature-mini-card-tech glass">
              <Database size={20} />
              <span>Docs</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Muhendislik;
