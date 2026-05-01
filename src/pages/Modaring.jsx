import React from 'react';
import { Sparkles, ArrowLeft, Heart, Palette, Shirt, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import './Modaring.css';

const Modaring = () => {
  const navigate = useNavigate();

  return (
    <AnimatedPage className="modaring-container">
      <header className="module-header glass" style={{ background: 'linear-gradient(135deg, #fb7185, #e11d48)' }}>
        <div className="header-top">
          <div className="header-title">
            <span className="header-emoji animate-float">✨</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1>Eraylar Modaring</h1>
              <p>Esra'nın Tasarım Dünyası</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/')} title="Ana Menüye Dön">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="modaring-content">
        <div className="empty-state-premium">
          <div className="empty-icon-circle">
            <Palette size={48} color="#fb7185" />
          </div>
          <h2>Modaring Yakında Burada!</h2>
          <p>Tasarım fikirleri, moda takipleri ve Esra'nın yaratıcı dünyasına dair her şey çok yakında bu modülde yerini alacak. ✨</p>
          
          <div className="feature-previews">
            <div className="feature-mini-card glass">
              <Shirt size={20} />
              <span>Kombinler</span>
            </div>
            <div className="feature-mini-card glass">
              <Heart size={20} />
              <span>İlhamlar</span>
            </div>
            <div className="feature-mini-card glass">
              <Camera size={20} />
              <span>Portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Modaring;
