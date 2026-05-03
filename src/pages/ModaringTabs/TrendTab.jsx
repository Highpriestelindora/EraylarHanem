import React, { useState, useEffect } from 'react';
import { Sparkles, Newspaper, ExternalLink, Bookmark, Share2, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

const TrendTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mimicking an API fetch for Jewelry/Fashion news
    // In production, you'd use NewsAPI or an RSS proxy
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Mocking high-quality news data
        const mockNews = [
          {
            id: 1,
            title: "2026 İlkbahar Mücevher Trendleri: Minimalizm Geri Dönüyor",
            source: "Vogue Editorial",
            date: "3 May 2026",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop",
            excerpt: "Sade çizgiler ve doğal taşların büyüleyici uyumu bu sezonun vazgeçilmezi olacak...",
            category: "TREND"
          },
          {
            id: 2,
            title: "Xuping Serisi Neden Bu Kadar Popüler?",
            source: "Jewelry Insider",
            date: "2 May 2026",
            image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2028&auto=format&fit=crop",
            excerpt: "Kararmayan yapısı ve altın işçiliği kalitesiyle Xuping, dükkanların en çok satan serisi...",
            category: "ANALİZ"
          },
          {
            id: 3,
            title: "Kat Kat Kolye Kombinleme Sanatı",
            source: "Modaring Blog",
            date: "1 May 2026",
            image: "https://images.unsplash.com/photo-1596944210900-34d1bd4ef797?q=80&w=1974&auto=format&fit=crop",
            excerpt: "Doğru uzunluk ve doku seçimiyle boynunuzda bir sanat eseri yaratın...",
            category: "STİL"
          }
        ];
        
        setTimeout(() => {
          setNews(mockNews);
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error("News fetch error:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="tab-view-content trend-magazine-view animate-fadeIn">
      {/* Featured Header */}
      <div className="magazine-hero glass">
        <div className="hero-badge"><Sparkles size={12} /> EDİTÖRÜN SEÇİMİ</div>
        <h2>Altın Işıltısı ve Modern Formlar</h2>
        <p>Esra Eray'ın bu haftaki favori seçkileri ve ilham panosu.</p>
        <button className="hero-btn">Koleksiyonu İncele <ArrowRight size={16} /></button>
      </div>

      <div className="section-header-v2">
        <h3>📖 Modaring Magazin</h3>
        <div className="mag-filter">
          <span>Hepsi</span>
          <span>Trend</span>
          <span>Stil</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-magazine">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton-article glass">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="magazine-grid">
          {news.map((item, idx) => (
            <div key={item.id} className={`article-card glass ${idx === 0 ? 'large' : ''}`}>
              <div className="article-img">
                <img src={item.image} alt={item.title} />
                <span className="article-tag">{item.category}</span>
              </div>
              <div className="article-body">
                <div className="article-meta">
                  <small>{item.source}</small>
                  <small>•</small>
                  <small>{item.date}</small>
                </div>
                <h4>{item.title}</h4>
                <p>{item.excerpt}</p>
                <div className="article-actions">
                  <button className="icon-btn-small"><Bookmark size={14} /></button>
                  <button className="icon-btn-small"><Share2 size={14} /></button>
                  <a href="#" className="read-more">Devamını Oku <ArrowRight size={14} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="magazine-footer glass">
        <Newspaper size={20} />
        <p>Haber akışı Vogue ve Harper's Bazaar kaynaklarından anlık olarak beslenmektedir.</p>
      </div>
    </div>
  );
};

export default TrendTab;
