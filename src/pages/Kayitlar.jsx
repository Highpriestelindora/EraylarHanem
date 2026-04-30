
import React, { useState, useMemo } from 'react';
import { 
  History as HistoryIcon, 
  Archive as ArchiveIcon, 
  ChevronRight as ChevronRightIcon, 
  Wrench as WrenchIcon, 
  ShoppingCart as ShoppingCartIcon, 
  DollarSign as DollarSignIcon, 
  Heart as HeartIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  Clock as ClockIcon, 
  Trash2 as Trash2Icon, 
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import './Kayitlar.css';

export default function Kayitlar() {
  const navigate = useNavigate();
  const { ev, mutfak, pet, users, saglik, deleteOnarimItem, deleteAlisverisItem, deleteVaccineHistory } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Helpers to safely get date objects
  const safeDate = (d) => {
    if (!d) return new Date(0);
    const date = new Date(d);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  const getCatColor = (cat) => {
    switch(cat) {
      case 'Ev Bakımı': return '#f5f3ff';
      case 'Alışveriş': return '#ecfdf5';
      case 'İlaç Takibi': return '#fff1f2';
      case 'Pet Sağlık': return '#fffbeb';
      default: return '#f8fafc';
    }
  };

  const allRecords = useMemo(() => {
    const records = [];

    // 1. Ev Bakımı
    (ev.onarimListesi || []).filter(item => item.isArchived).forEach(item => {
      records.push({
        ...item,
        category: 'Ev Bakımı',
        icon: <WrenchIcon size={18} />,
        title: item.task,
        date: item.clearedAt || item.completedAt || item.createdAt,
        type: 'maintenance',
        onDelete: () => deleteOnarimItem(item.id)
      });
    });

    // 2. Alışveriş
    const shoppingLists = ['gorkem', 'esra', 'ev'];
    shoppingLists.forEach(listKey => {
      (mutfak.alisveris?.[listKey] || []).filter(i => i.done).forEach(item => {
        records.push({
          ...item,
          category: 'Alışveriş',
          icon: <ShoppingCartIcon size={18} />,
          title: `${item.nm} (Alındı)`,
          date: item.doneDate || item.dt,
          type: 'shopping',
          onDelete: () => deleteAlisverisItem(item.id, listKey)
        });
      });
    });

    // 3. Pet Sağlık
    Object.entries(pet.vaccines || {}).forEach(([petName, vaccines]) => {
      vaccines.forEach(v => {
        (v.h || []).forEach(hDate => {
          const [d, m, y] = (hDate || "").split('.');
          const isoDate = y && m && d ? `${y}-${m}-${d}` : null;
          records.push({
            id: `pet-${petName}-${v.n}-${hDate}`,
            category: 'Pet Sağlık',
            icon: <ShieldCheckIcon size={18} />,
            title: `${petName}: ${v.n} Aşısı`,
            date: isoDate,
            type: 'pet',
            user: petName,
            onDelete: () => deleteVaccineHistory(petName, v.n, hDate)
          });
        });
      });
    });

    // 4. İlaç Takibi (Aggregated)
    const medLogs = saglik?.logs || [];
    const medGroups = {};
    medLogs.forEach(log => {
      const key = `${log.medId}-${log.kisi}`;
      if (!medGroups[key]) medGroups[key] = [];
      medGroups[key].push(log);
    });

    Object.values(medGroups).forEach(groupLogs => {
      const sorted = [...groupLogs].sort((a, b) => a.id - b.id);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const count = sorted.length;
      
      const d1 = new Date(first.id);
      const d2 = new Date(last.id);
      const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) + 1;

      records.push({
        id: `med-agg-${first.id}`,
        category: 'İlaç Takibi',
        icon: <HeartIcon size={18} />,
        title: `${first.ad} (${diffDays} Gün / ${count} Doz)`,
        date: last.id,
        type: 'medicine',
        user: first.kisi,
        onDelete: () => toast.error('Tıbbi kayıtlar silinemez.')
      });
    });

    return records.sort((a, b) => safeDate(b.date) - safeDate(a.date));
  }, [ev, mutfak, pet, saglik]);

  const filteredRecords = allRecords.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || activeTab === item.type;
    return matchesSearch && matchesTab;
  });

  return (
    <AnimatedPage className="kayitlar-container">
      <header className="kayitlar-header glass">
        <div className="kh-top">
          <button className="back-btn" onClick={() => navigate('/ayarlar')}>
            <HistoryIcon size={20} />
          </button>
          <div className="kh-titles">
            <h1>Sistem Kayıtları</h1>
            <p>Arşivlenmiş tüm veriler ve geçmiş işlemler</p>
          </div>
        </div>

        <div className="kh-filters">
          <div className="search-bar-v2">
            <SearchIcon size={18} />
            <input 
              type="text" 
              placeholder="Kayıtlarda ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="tabs-scroll-v2">
            {[
              { id: 'all', label: 'Tümü', icon: <ArchiveIcon size={16} /> },
              { id: 'maintenance', label: 'Ev Bakımı', icon: <WrenchIcon size={16} /> },
              { id: 'shopping', label: 'Alışveriş', icon: <ShoppingCartIcon size={16} /> },
              { id: 'medicine', label: 'İlaç Takibi', icon: <HeartIcon size={16} /> },
              { id: 'pet', label: 'Pet Sağlık', icon: <HeartIcon size={16} /> }
            ].map(cat => (
              <button 
                key={cat.id}
                className={`tab-btn-v2 ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="records-list">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((item, idx) => {
            const userKey = item.user?.toLowerCase() || 'sistem';
            const userData = (users && users[userKey]) || { name: item.user || 'Sistem', emoji: '⚙️' };
            
            return (
              <div key={item.id || idx} className="record-card glass animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                <button 
                  className="rc-delete-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('Bu kaydı arşivden tamamen silmek istiyor musunuz?')) {
                      item.onDelete();
                    }
                  }}
                >
                  <Trash2Icon size={14} />
                </button>
                <div className="rc-icon" style={{ background: getCatColor(item.category) }}>
                  {item.icon}
                </div>
                <div className="rc-content">
                  <div className="rc-header">
                    <span className="rc-cat">{item.category}</span>
                    <span className="rc-date">
                      <CalendarIcon size={10} /> {safeDate(item.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <strong className="rc-title">{item.title}</strong>
                  <div className="rc-footer">
                    <div className="rc-user">
                      <span>{userData.emoji}</span>
                      <small>{userData.name?.split(' ')[0] || 'Sistem'}</small>
                    </div>
                    <div className="rc-time">
                      <ClockIcon size={10} />
                      <small>{safeDate(item.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  </div>
                </div>
                <ChevronRightIcon size={18} className="rc-chevron" />
              </div>
            );
          })
        ) : (
          <div className="empty-records">
            <ArchiveIcon size={48} opacity={0.1} />
            <p>Aranılan kriterlere uygun kayıt bulunamadı.</p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
