import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Plus, Minus, Bell, BellOff, History, Flame, 
  Utensils, Wallet, Home as HomeIcon, 
  Stethoscope, Plane, PawPrint, Settings, Smile, BarChart2
} from 'lucide-react';
import useStore from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import logo from '../assets/eraylar-logo.png';
import './Home.css';

const Home = () => {
  const { 
    mutfak, ev, saglik, finans, tatil, pet, sosyal, aracim, logs, settings, toggleSilentMode, currentUser 
  } = useStore();
  
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().split('T')[0];

  const [dismissedToday, setDismissedToday] = useState(() => {
    const saved = localStorage.getItem(`dismissed_alerts_${todayIso}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);

  useEffect(() => {
    // Supabase bağlantı durumunu store üzerinden veya basit bir ping ile takip edebiliriz.
    // Şimdilik 401 hatası almamak için manuel fetch'i kaldırıyoruz.
    setIsSupabaseConnected(true);
  }, []);

  const waffleQuotes = [
    "Zürafaların dilleri 50 cm'dir ve dilleriyle kulaklarını temizleyebilirler! 🦒",
    "Ahtapotların üç tane kalbi vardır! 🐙",
    "Penguenler eşlerine aşklarını çakıl taşı vererek ilan ederler. 🐧",
    "Bal arıları dakikada 11.400 kez kanat çırparlar. 🐝",
    "Kediler hayatlarının yaklaşık %70'ini uyuyarak geçirirler. 🐈",
    "Bir karınca kendi ağırlığının 50 katını kaldırabilir! 🐜",
    "İnsanlar ömürlerinin yaklaşık 6 yılını rüya görerek geçirirler. 😴",
    "Filler zıplayamayan tek memelilerdir. 🐘",
    "Çilek, çekirdekleri dışında olan tek meyvedir. 🍓",
    "Uzayda ağlayamazsınız çünkü gözyaşları aşağı akmaz. 👨‍🚀",
    "Altın balıkların hafızası 3 saniye değil, en az 3 aydır! 🐠",
    "Güneş ışığının dünyaya ulaşması yaklaşık 8 dakika sürer. ☀️",
    "Kar tanelerinin her biri eşsizdir ve asla aynı olmazlar. ❄️",
    "Mavi balinaların kalbi bir araba büyüklüğündedir! 🐳",
    "Deniz atları, erkeklerin doğum yaptığı tek canlı türüdür. 🧜‍♂️",
    "Gözlerimiz doğduğumuzdan itibaren hiç büyümezler! 👀",
    "Sıcak su soğuk sudan daha hızlı donar (Mpemba etkisi). ❄️",
    "Vücudumuzdaki en güçlü kas dildir. 👅",
    "Koalalar günde yaklaşık 22 saat uyurlar. 🐨",
    "Bir panda günde 12-14 saatini sadece bambu yiyerek geçirir! 🐼",
    "İneklerin en iyi arkadaşları vardır ve onlardan ayrılınca strese girerler. 🐄",
    "İstiridyeler cinsiyet değiştirebilirler. 🦪",
    "Kelebekler ayaklarıyla tat alırlar. 🦋",
    "Bir su damlası buluttan yere yaklaşık 2 dakikada düşer. 💧",
    "Samanyolu galaksisinde dünyadaki kum tanelerinden daha fazla yıldız vardır. ✨",
    "Bal hiç bozulmayan tek gıdadır, 3000 yıllık bal bile yenilebilir. 🍯",
    "Parmak izi gibi dil izi de her insanda benzersizdir. 👅",
    "Atlar ayakta uyuyabilirler. 🐎",
    "Hamamböcekleri kafaları olmadan bir hafta yaşayabilirler. 🪳",
    "Dünyanın en yaşlı ağacı yaklaşık 4800 yaşındadır. 🌳",
    "Ay her yıl dünyadan 3.8 cm uzaklaşmaktadır. 🌙",
    "Bir insan hayatı boyunca iki yüzme havuzunu dolduracak kadar tükürük üretir. 💦",
    "Everest Tepesi her yıl yaklaşık 4 milimetre yükselmektedir. 🏔️",
    "Devekuşlarının gözleri beyinlerinden daha büyüktür. 🥚",
    "Timsahlar dillerini dışarı çıkaramazlar. 🐊",
    "Bir aslanın kükremesi 8 kilometre öteden duyulabilir. 🦁",
    "Fareler gıdıklanabilir ve gıdıklanınca gülerler. 🐭",
    "Domuzlar gökyüzüne bakamazlar, anatomileri buna izin vermez. 🐷",
    "Su aygırlarının sütü pembe renklidir. 🦛",
    "Baykuşlar gözlerini hareket ettiremezler, başlarını çevirirler. 🦉",
    "Karideslerin kalbi kafalarının içindedir. 🦐",
    "Sincaplar diktikleri ağaçlar sayesinde binlerce ormana hayat verirler. 🐿️",
    "Bir elmasın erimesi için yaklaşık 4700 derece sıcaklık gerekir. 💎",
    "Dünyadaki altınların %99'u dünyanın çekirdeğindedir. 💰",
    "İnsan vücudundaki kemiklerin dörtte biri ayaklardadır. 🦶",
    "Bir damla petrolde binlerce mikrop yaşayabilir. 🧪",
    "Arılar dünyanın en çalışkan canlılarıdır, hiç uyumazlar. 🐝",
    "Kartallar uçarken uyuyabilirler. 🦅",
    "Bukalemunların dilleri kendi vücutlarından daha uzundur. 🦎",
    "Bir insan günde ortalama 23.000 kez nefes alır. 💨"
  ];

  const mayisMischiefs = [
    "Mayıs koltukları tırmaladı! 🐾",
    "Mayıs masanın üstündeki bardağı devirdi! 🥛",
    "Mayıs klavyenin üstünde uyudu! ⌨️",
    "Mayıs gece saat 3'te evde koşu yaptı! 🏃‍♂️",
    "Mayıs mama kabını boş görünce sana dik dik baktı! 🙀",
    "Mayıs perdeleri tırmanma duvarı sanıyor! 🧗‍♀️",
    "Mayıs tuvalet kağıdını tüm eve yaydı! 🧻",
    "Mayıs senin ayakkabının içine saklandı! 👟",
    "Mayıs televizyonun önünde durup ekranı kapatıyor! 📺",
    "Mayıs yeni yıkanmış çamaşırların üstüne yattı! 🧺",
    "Mayıs saksıdaki toprağı kazdı! 🪴",
    "Mayıs bilgisayar kablosuyla oyun oynuyor! 🔌",
    "Mayıs senin su bardağından su içmeye çalıştı! 💧",
    "Mayıs alışveriş poşetinin içine girdi! 🛍️",
    "Mayıs gece senin saçınla oynadı! 💆‍♂️",
    "Mayıs masadaki kalemi yere attı ve izledi! 🖋️",
    "Mayıs aynadaki kendi görüntüsüne saldırdı! 🪞",
    "Mayıs dolabın en üst rafına çıkıp mahsur kaldı! 🪜",
    "Mayıs senin en sevdiğin kazağı tiftikledi! 🧶",
    "Mayıs kapalı kapıların önünde saatlerce ağlıyor! 🚪",
    "Mayıs sinek yakalamaya çalışırken vazoyu devirdi! 🏺",
    "Mayıs mutfak tezgahında izinsiz geziye çıktı! 🍳",
    "Mayıs senin kulaklığını çiğnemeye niyetlendi! 🎧",
    "Mayıs lazer noktasını yakalamak için duvara çarptı! 🔴",
    "Mayıs çekmeceleri açıp içindekileri boşaltıyor! 🗄️",
    "Mayıs senin çantanın içine tüy bıraktı! 👜",
    "Mayıs yorganın altından ayağına saldırdı! 👣",
    "Mayıs banyodaki suyu izlemeye bayılıyor! 🛁",
    "Mayıs kendi kuyruğunu kovalarken düştü! 🐈",
    "Mayıs senin kahvaltılık peynirinden bir parça kaptı! 🧀",
    "Mayıs gece lambasını patisiyle devirdi! 💡",
    "Mayıs kum kabını tüm odaya dağıttı! 🏖️",
    "Mayıs senin gözlüklerini patiledi! 👓",
    "Mayıs kargo kutusunun içine yerleşti, kutu artık onun! 📦",
    "Mayıs saksıdaki çiçeğin tadına baktı! 🌻",
    "Mayıs senin mouse'unu masadan aşağı uçurdu! 🖱️",
    "Mayıs dolap kapağının arkasına saklanıp seni korkuttu! 👻",
    "Mayıs elektrikli süpürgeye meydan okudu (ve kaçtı)! 🧹",
    "Mayıs senin yoga matını tırmalama tahtası yaptı! 🧘‍♀️",
    "Mayıs telefonun çalınca üstüne oturup aramayı reddetti! 📱"
  ];

  const funnyStatuses = {
    Esra: [
      "Esra yine mutfakta harikalar yaratıyor! 👩‍🍳",
      "Esra evi süpürüyor, tozlara elveda! 🧹",
      "Esra kahvesini yudumlayıp plan yapıyor. ☕",
      "Esra yine 'bunu nereye koysak' diye düşünüyor. 🤔",
      "Esra çiçekleriyle dertleşiyor. 🌸",
      "Esra alışveriş listesini 3. kez kontrol ediyor. 📝",
      "Esra 'bugün ne pişirsek' sorusuna cevap arıyor. 🍲",
      "Esra Waffle'a yeni numaralar öğretiyor. 🐶",
      "Esra yine bir dekorasyon fikri peşinde. 🖼️",
      "Esra sessiz modu açtı, kitap okuyor. 📚",
      "Esra 'Görkem şunu yapabilir misin' demeye hazırlanıyor. 🔨",
      "Esra Mayıs'ı koltuktan indirmeye çalışıyor. 🐈",
      "Esra yine bir yerleri düzenliyor. ✨",
      "Esra 'bu fatura niye böyle' diye bakıyor. 🧾",
      "Esra yeni bir tarif denemek üzere. 🍰",
      "Esra 'yarın ne giysem' operasyonunda. 👗",
      "Esra tatil hayalleri kuruyor. ✈️",
      "Esra spor yapmaya niyetlendi. 🧘‍♀️",
      "Esra 'Waffle mama yedi mi' diye soruyor. 🐕",
      "Esra yine en sevdiği diziyi açtı. 📺",
      "Esra dolapları boşaltıp geri diziyor. 🧺",
      "Esra 'bu renk buraya uymadı mı' diyor. 🎨"
    ],
    Görkem: [
      "Görkem çivi çakıyor, tablo asılacak! 🔨",
      "Görkem yine kod yazıyor, dünyayı kurtarıyor. 💻",
      "Görkem 'bu neden çalışmıyor' diye mırıldanıyor. 🔧",
      "Görkem Waffle ile güreş tutuyor. 🐶",
      "Görkem yine bir teknolojik alet siparişi verdi. 📦",
      "Görkem mutfakta bir şeyler devirdi. 🍳",
      "Görkem 'Mayıs yine ne yedi' diye kontrol ediyor. 🐈",
      "Görkem balkonda keyif yapıyor. ☀️",
      "Görkem arabanın bakım zamanını hesaplıyor. 🚗",
      "Görkem 'bugün çok yoruldum' demeye hazırlanıyor. 🥱",
      "Görkem yine bir oyunun başında. 🎮",
      "Görkem 'Waffle gel buraya' diye bağırıyor. 🐕",
      "Görkem evi akıllı ev yapma peşinde. 🏠",
      "Görkem 'bu kumanda nerede' diye arıyor. 🕵️‍♂️",
      "Görkem yine yeni bir hobi buldu. 🎸",
      "Görkem 'açım' demeye geliyor. 🍔",
      "Görkem çay demlenmiş mi diye bakıyor. ☕",
      "Görkem 'şunu tamir edeyim' dedi ve işler karıştı. 🛠️",
      "Görkem spor yapacağını iddia ediyor. 🏋️‍♂️",
      "Görkem tatil rotasını çiziyor. 🗺️",
      "Görkem yeni bir yapay zeka deniyor. 🤖",
      "Görkem 'bu kablo nereden geliyor' diye bakıyor. 🔌"
    ]
  };

  const randomStatus = useMemo(() => {
    const targetUser = currentUser?.name === 'Görkem' ? 'Esra' : 
                       currentUser?.name === 'Esra' ? 'Görkem' : null;
    if (!targetUser) return "Eraylar Hanem Keyfi";
    const statuses = funnyStatuses[targetUser];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }, [currentUser]);

  const handleWaffleClick = () => {
    const quote = waffleQuotes[Math.floor(Math.random() * waffleQuotes.length)];
    toast(quote, { icon: '🐶', style: { borderRadius: '15px', background: '#FFF7ED', color: '#9A3412', fontWeight: 'bold' } });
  };

  const handleMayisClick = () => {
    const mischief = mayisMischiefs[Math.floor(Math.random() * mayisMischiefs.length)];
    toast(mischief, { icon: '🐈', style: { borderRadius: '15px', background: '#FDF2F8', color: '#9D174D', fontWeight: 'bold' } });
  };

  const handleDismissAlert = (id) => {
    const newDismissed = [...dismissedToday, id];
    setDismissedToday(newDismissed);
    localStorage.setItem(`dismissed_alerts_${todayIso}`, JSON.stringify(newDismissed));
    toast.success('Hatırlatıcı bugünkü listeden kaldırıldı.');
  };

  const handleRefreshAlerts = () => {
    setDismissedToday([]);
    localStorage.removeItem(`dismissed_alerts_${todayIso}`);
    toast.success('Tüm bildirimler yenilendi! ✨');
  };

  // --- AKILLI ASİSTAN MOTORU ---
  const allAlerts = useMemo(() => {
    const alerts = [];

    // 1. Mutfak Kritik Stok (Özet Alert)
    const shoppingListNames = (Array.isArray(mutfak?.alisveris) ? mutfak.alisveris : []).map(i => i.n?.toLowerCase() || '');
    const stockCategories = ['buzdolabi', 'kiler', 'dondurucu'];
    const lowStockItems = [];

    stockCategories.forEach(cat => {
      const items = mutfak?.[cat] || [];
      items.forEach(item => {
        if (item.mn > 0 && item.cr <= item.mn && !shoppingListNames.includes(item.n?.toLowerCase() || '')) {
          lowStockItems.push(item.n);
        }
      });
    });

    if (lowStockItems.length > 0) {
      alerts.push({
        id: 'mutfak_low_stock_summary',
        type: 'mutfak',
        icon: '🍎',
        text: `Mutfak: ${lowStockItems.length} ürün kritik seviyede! (${lowStockItems.slice(0, 3).join(', ')}${lowStockItems.length > 3 ? '...' : ''})`,
        color: '#f97316'
      });
    }

    // 2. Alışveriş Listesi Yoğunluğu (>10 ürün)
    if ((mutfak?.alisveris || []).length > 10) {
      alerts.push({
        id: 'mutfak_shopping_heavy',
        type: 'mutfak',
        icon: '🛒',
        text: `Alışveriş listesi çok birikti (${mutfak.alisveris.length} ürün). Bir ara uğrasak mı?`,
        color: '#3b82f6'
      });
    }

    // 3. Bugün Menüde Olup Eksik Malzeme
    const todayMenu = mutfak?.menu?.[todayIso];
    if (todayMenu && (todayMenu.k || todayMenu.a)) {
      const meals = [todayMenu.k, todayMenu.a].filter(Boolean);
      const allStockItems = [...(mutfak.buzdolabi || []), ...(mutfak.kiler || []), ...(mutfak.dondurucu || [])];
      
      meals.forEach(mealName => {
        const recipe = mutfak.tarifler?.find(r => r.n === mealName);
        if (recipe && recipe.ig) {
          const missing = recipe.ig.filter(igLine => {
            const ingName = igLine.split(':')[0].trim().toLowerCase();
            const stockItem = allStockItems.find(s => (s.n?.toLowerCase() || '') === ingName);
            return !stockItem || stockItem.cr <= 0;
          });
          
          if (missing.length > 0) {
            alerts.push({
              id: `mutfak_menu_missing_${mealName}`,
              type: 'mutfak',
              icon: '🍳',
              text: `Bugün ${mealName} var ama ${missing.length} malzeme eksik!`,
              color: '#ef4444'
            });
          }
        }
      });
    }

    // 4. Bekleyen Bayat Alışveriş Ürünü (>30 gün)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const staleItems = (Array.isArray(mutfak?.alisveris) ? mutfak.alisveris : []).filter(i => i.dt && new Date(i.dt) < thirtyDaysAgo);
    if (staleItems.length > 0) {
      alerts.push({
        id: 'mutfak_shopping_stale',
        type: 'mutfak',
        icon: '⏳',
        text: `Alışveriş listesinde 30 gündür bekleyen ${staleItems.length} ürün var.`,
        color: '#f59e0b'
      });
    }

    // 5. Sosyal Aktivite Hatırlatıcı (Önümüzdeki 6 saat)
    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const nearActivities = (Array.isArray(sosyal?.aktiviteler) ? sosyal.aktiviteler : []).filter(act => {
      if (act.tarih !== todayIso || act.durum === 'tamamlandi') return false;
      if (!act.saat) return true; // Saati yoksa bugün uyarısı ver
      const [h, m] = act.saat.split(':');
      const actDate = new Date(now.getTime());
      actDate.setHours(parseInt(h), parseInt(m), 0, 0);
      return actDate >= now && actDate <= sixHoursLater;
    });

    nearActivities.forEach(act => {
      alerts.push({
        id: `sosyal_near_${act.id}`,
        type: 'sosyal',
        icon: '🎯',
        text: `Sosyal: "${act.baslik}" aktivitesine az kaldı! (${act.saat || 'Bugün'})`,
        color: '#8b5cf6'
      });
    });

    // 6. Sosyal Boşluk (5 gündür aktivite yoksa)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const recentActivities = (Array.isArray(sosyal?.aktiviteler) ? sosyal.aktiviteler : []).filter(act => new Date(act.tarih) >= fiveDaysAgo);
    if (recentActivities.length === 0) {
      alerts.push({
        id: 'sosyal_gap',
        type: 'sosyal',
        icon: '🌈',
        text: '5 gündür hiç aktivite yapmadık, hadi bir plan yapalım! ✨',
        color: '#ec4899'
      });
    }

    // 7. Ödenmemiş Faturalar
    const unpaid = (Array.isArray(ev?.faturalar) ? ev.faturalar : []).filter(f => !f.odendi);
    unpaid.forEach(f => {
      alerts.push({
        id: `fatura_${f.id}`,
        type: 'ev',
        icon: '📄',
        text: `Fatura: ${f.ad} ödemesi bekliyor!`,
        color: '#ef4444'
      });
    });

    // 8. Sağlık Randevuları (Son 3 gün)
    const appointments = (saglik?.randevular || []);
    appointments.forEach(r => {
      const diff = Math.ceil((new Date(r.tarih) - today) / 864e5);
      if (diff >= 0 && diff <= 3) {
        alerts.push({
          id: `saglik_${r.id}`,
          type: 'saglik',
          icon: '🏥',
          text: `Sağlık: ${r.ad} için randevunuz ${diff === 0 ? 'Bugün!' : diff + ' gün sonra.'}`,
          color: '#06b6d4'
        });
      }
    });

    // 9. Tatil Geri Sayım (1 hafta)
    const trips = (tatil?.trips || []);
    trips.forEach(t => {
      const diff = Math.ceil((new Date(t.baslangic || t.date) - today) / 864e5);
      if (diff >= 0 && diff <= 7) {
        alerts.push({
          id: `tatil_${t.id}`,
          type: 'tatil',
          icon: '✈️',
          text: `Tatil: ${t.rota || t.title} seyahatine ${diff === 0 ? 'Bugün gidiyoruz!' : diff + ' gün kaldı!'}`,
          color: '#8b5cf6'
        });
      }
    });

    // 10. Araç Muayene (1 hafta)
    if (aracim?.muayene?.next) {
      const diff = Math.ceil((new Date(aracim.muayene.next) - today) / 864e5);
      if (diff >= 0 && diff <= 7) {
        alerts.push({
          id: 'aracim_muayene',
          type: 'aracim',
          icon: '🚨',
          text: `Araç: Muayene tarihine ${diff === 0 ? 'Bugün son gün!' : diff + ' gün kaldı.'}`,
          color: '#ef4444'
        });
      }
    }

    // 11. Pet Aşıları (Yaklaşan ve Gecikmişler)
    const petVaccines = Array.isArray(pet?.vaccines) 
      ? pet.vaccines 
      : Object.values(pet?.vaccines || {}).flat();

    petVaccines.forEach(v => {
      if (!v.last || !v.ev) return;
      const parts = v.last.split('.');
      const lastDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      const nextDate = new Date(lastDate.getTime() + (v.ev * 864e5));
      const diff = Math.ceil((nextDate - today) / 864e5);
      
      if (diff <= 7) {
        alerts.push({
          id: `pet_${v.n}_${v.petName}`,
          type: 'pet',
          icon: '🐾',
          text: diff < 0 
            ? `${v.petName || 'Pet'}: ${v.n} aşısı ${Math.abs(diff)} gün gecikti!` 
            : `${v.petName || 'Pet'}: ${v.n} aşısına ${diff} gün kaldı.`,
          color: diff < 0 ? '#ef4444' : '#10b981'
        });
      }
    });

    return alerts.filter(a => !dismissedToday.includes(a.id));
  }, [mutfak, ev, saglik, tatil, pet, sosyal, aracim, dismissedToday, today, todayIso]);

  // --- UI COUNTS ---
  const unpaidCount = (Array.isArray(ev?.faturalar) ? ev.faturalar : []).filter(f => !f.odendi).length;
  const appointmentCount = (saglik?.randevular || []).length;
  const tripCount = (tatil?.trips || []).length;
  const vaccineCount = Array.isArray(pet?.vaccines) 
    ? pet.vaccines.length 
    : Object.values(pet?.vaccines || {}).flat().length;

  const activeAlert = allAlerts[0];

  return (
    <AnimatedPage className="home-container">
      {/* Premium Hero Header - Optimized & Cleaned */}
      <div className="home-hero-sweet">
        {/* Left: Avatar & Brand Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-left-avatar" onClick={() => navigate('/profil')} title="Profilim">
            <div className="user-avatar-sweet">{currentUser?.emoji || '👤'}</div>
          </div>
          <div className="header-center-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={logo} alt="Logo" className="header-logo-original" />
              <h1>Eraylar Hanem</h1>
            </div>
            <div className="funny-bubble-text">
              {randomStatus}
            </div>
          </div>
        </div>

        {/* Center: Waffle & Mayıs */}
        <div className="pet-row-center">
          <div className="pet-mini" onClick={handleWaffleClick} title="Waffle'dan Özlü Söz">🐶</div>
          <div className="pet-mini" onClick={handleMayisClick} title="Mayıs'ın Yaramazlıkları">🐈</div>
        </div>

        {/* Right: Actions & Status Indicator */}
        <div className="header-right-actions">
          <div className="action-row-mini">
            <div className={`supabase-status-indicator ${isSupabaseConnected ? 'online' : 'offline'}`} title={isSupabaseConnected ? 'Supabase Bağlı' : 'Supabase Bağlantısı Kesik'}>
              <div className="status-dot-pulse" />
            </div>
            <button className="mini-icon-btn" onClick={() => navigate('/analiz')} title="İstatistikler">
              <BarChart2 size={16} />
            </button>
            <button className="mini-icon-btn" onClick={() => navigate('/ayarlar')} title="Ayarlar">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Akıllı Bildirimler - Enhanced Multi-Alert System */}
      <div className="assistant-section-v2">
        <div className="assistant-header">
          <div className="title-group">
            <span className="sparkle">✨</span>
            <h2>Akıllı Aile Asistanı</h2>
          </div>
          <button className="refresh-alerts-btn" onClick={handleRefreshAlerts} title="Bildirimleri Yenile">
            <History size={18} />
          </button>
        </div>
        
        <div className="alerts-container">
          {allAlerts.length > 0 ? (
            allAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="alert-card-v2"
                style={{ '--alert-color': alert.color }}
              >
                <div className="alert-main">
                  <span className="alert-icon">{alert.icon}</span>
                  <p className="alert-text">{alert.text}</p>
                </div>
                <div className="alert-actions">
                  <button onClick={() => handleDismissAlert(alert.id)} className="close-btn" title="Bugünlük Kapat">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="all-clear glass">
              <span className="check-icon">💖</span>
              <p>Bugün her şey yolunda, keyfine bak!</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Grid - Premium Cards */}
      <div className="dashboard-grid">
        {/* Active Modules */}
        <Link to="/mutfak" className="nav-card mutfak">
          <div className="card-visual">🍳</div>
          <div className="card-info">
            <h3>Eraylar Mutfak</h3>
            <span>Yemek & Alışveriş</span>
          </div>
        </Link>

        <Link to="/sosyal" className="nav-card sosyal">
          <div className="card-visual">🎯</div>
          <div className="card-info">
            <h3>Eraylar Sosyal</h3>
            <span>Aktivite & Rutin</span>
          </div>
        </Link>

        {/* Coming Soon Modules - Visually 'Closed' but Functional */}
        <Link to="/alisveris" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🛍️</div>
          <div className="card-info">
            <h3>Eraylar Alışveriş</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/tatil" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">✈️</div>
          <div className="card-info">
            <h3>Eraylar Tatil</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/pet" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🐾</div>
          <div className="card-info">
            <h3>Eraylar Pet</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/saglik" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🏥</div>
          <div className="card-info">
            <h3>Eraylar Sağlık</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/ev" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🏠</div>
          <div className="card-info">
            <h3>Eraylar Ev</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/aracim" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🚗</div>
          <div className="card-info">
            <h3>Eraylar Aracım</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/kasa" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">🧾</div>
          <div className="card-info">
            <h3>Eraylar Kasa</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/finans" className="nav-card" style={{ opacity: 0.85 }}>
          <div className="card-visual">💰</div>
          <div className="card-info">
            <h3>Eraylar Finans</h3>
            <span className="coming-soon-badge">Geliştiriliyor</span>
          </div>
        </Link>

        <Link to="/hedefler" className="nav-card hedefler wide-slim" style={{ opacity: 0.85 }}>
          <div className="card-content-horizontal">
            <span className="card-visual-small">🏆</span>
            <h3>Eraylar Hedeflerim</h3>
            <span className="coming-soon-badge-small">Geliştiriliyor</span>
          </div>
        </Link>
      </div>

      {/* System Logs Modal */}
      {showLogs && (
        <div className="modal-overlay" onClick={() => setShowLogs(false)}>
          <div className="logs-modal animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><History size={18} /> Sistem Hareketleri</h3>
              <button onClick={() => setShowLogs(false)}><X size={20} /></button>
            </div>
            <div className="logs-list">
              {(logs || []).slice(-15).reverse().map((log, idx) => (
                <div key={idx} className="log-item">
                  <span className="log-time">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="log-text">{log.text}</span>
                </div>
              ))}
              {(!logs || logs.length === 0) && <p className="no-logs">Henüz hareket kaydı yok.</p>}
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Home;