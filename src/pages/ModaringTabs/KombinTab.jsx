import React from 'react';
import { Shirt, Plus, Heart, Camera } from 'lucide-react';
import useStore from '../../store/useStore';

const KombinTab = () => {
  const modaring = useStore(state => state.modaring);
  const kombins = modaring?.kombinler || [];

  return (
    <div className="tab-view-content animate-fadeIn">
      <div className="section-header-v2">
        <h3>👗 Günlük Kombinler</h3>
        <button className="add-btn-mini"><Plus size={14} /></button>
      </div>

      {kombins.length === 0 ? (
        <div className="empty-state-card glass">
          <div className="esc-icon">
            <Shirt size={40} color="#fb7185" />
          </div>
          <h4>Gardırobun Boş</h4>
          <p>İlk kombinini oluşturmak için "+" butonuna dokun.</p>
          <div className="esc-actions">
             <button className="esc-btn secondary"><Camera size={16} /> Fotoğraf Çek</button>
             <button className="esc-btn">Yeni Kombin</button>
          </div>
        </div>
      ) : (
        <div className="kombin-list">
          {kombins.map(kombin => (
            <div key={kombin.id} className="kombin-card glass">
              <div className="kc-image">
                {kombin.photo ? <img src={kombin.photo} alt={kombin.title} /> : <Shirt size={24} />}
              </div>
              <div className="kc-info">
                <strong>{kombin.title}</strong>
                <div className="kc-tags">
                  {kombin.tags?.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
              <Heart size={18} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KombinTab;
