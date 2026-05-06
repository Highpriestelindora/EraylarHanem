export const ALL_ACHIEVEMENTS = [
  // --- Mutfak (1-7) ---
  { id: 'k1', title: 'İlk Tarif', cat: 'mutfak', icon: '🍳', desc: 'Sisteme ilk yemek tarifini ekle.' },
  { id: 'k2', title: 'Şef Adayı', cat: 'mutfak', icon: '👨‍🍳', desc: '10 farklı tarif kaydet.' },
  { id: 'k3', title: 'Master Chef', cat: 'mutfak', icon: '👑', desc: '25 adet tarifle mutfağın hakimi ol.' },
  { id: 'k4', title: 'Stokçu', cat: 'mutfak', icon: '📦', desc: 'Buzdolabı veya kileri tam kapasite doldur.' },
  { id: 'k5', title: 'Ekmek Ustası', cat: 'mutfak', icon: '🥖', desc: 'Ekmeklik modülünü aktif kullan.' },
  { id: 'k6', title: 'Su İçici', cat: 'mutfak', icon: '💧', desc: 'Günlük su içme hedefine 1 hafta boyunca ulaş.' },
  { id: 'k7', title: 'Gurme', cat: 'mutfak', icon: '🥗', desc: '5 farklı kategoride yemek tarifi dene.' },

  // --- Tatil (8-14) ---
  { id: 't1', title: 'Yolcu', cat: 'tatil', icon: '✈️', desc: 'İlk tatil planını oluştur.' },
  { id: 't2', title: 'Gezgin', cat: 'tatil', icon: '🌍', desc: '5 farklı geziyi başarıyla tamamla.' },
  { id: 't3', title: 'Kaptan', cat: 'tatil', icon: '🛳️', desc: '10. tatiline damga vur.' },
  { id: 't4', title: 'Harita Kaşifi', cat: 'tatil', icon: '🗺️', desc: 'Gezilecek yerler haritasında 10 nokta işaretle.' },
  { id: 't5', title: 'Fotoğrafçı', cat: 'tatil', icon: '📸', desc: 'Tatil albümlerine toplam 50 fotoğraf yükle.' },
  { id: 't6', title: 'Valiz Ustası', cat: 'tatil', icon: '🧳', desc: 'Hazırlık listesini eksiksiz tamamla.' },
  { id: 't7', title: 'Kaşif', cat: 'tatil', icon: '🔭', desc: '3 farklı ülkeye veya 10 farklı şehre git.' },

  // --- Finans (15-22) ---
  { id: 'f1', title: 'Finansçı', cat: 'finans', icon: '💰', desc: 'İlk harcama kaydını oluştur.' },
  { id: 'f2', title: 'Onay Kralı', cat: 'finans', icon: '✅', desc: '10 harcamayı onay havuzundan geçir.' },
  { id: 'f3', title: 'Bütçe Dostu', cat: 'finans', icon: '📉', desc: 'Aylık bütçenin %20 altında kalarak tasarruf et.' },
  { id: 'f4', title: 'Tasarrufçu', cat: 'finans', icon: '🐖', desc: 'Bir kumbarayı %100 doldur.' },
  { id: 'f5', title: 'Borçsuz Hayat', cat: 'finans', icon: '🕊️', desc: 'Bir kredi veya borç kaydını tamamen kapat.' },
  { id: 'f6', title: 'Yatırımcı', cat: 'finans', icon: '📈', desc: 'Varlıklar bölümüne 3 farklı yatırım aracı ekle.' },
  { id: 'f7', title: 'Kart Ustası', cat: 'finans', icon: '💳', desc: 'Kredi kartı limit ve ekstre takibini düzenli yap.' },
  { id: 'f8', title: 'Zenginlik Yolunda', cat: 'finans', icon: '🏦', desc: 'Toplam net varlığını bir önceki aya göre artır.' },

  // --- Hedefler (23-29) ---
  { id: 'h1', title: 'Vizyoner', cat: 'hedefler', icon: '🔭', desc: 'İlk uzun vadeli (3 yıllık) planını yap.' },
  { id: 'h2', title: 'İstikrar Abidesi', cat: 'hedefler', icon: '🔥', desc: 'Bir alışkanlığı 15 gün kesintisiz sürdür.' },
  { id: 'h3', title: 'Hedef Avcısı', cat: 'hedefler', icon: '🎯', desc: '3 adet kısa vadeli stratejik hedefi tamamla.' },
  { id: 'h4', title: 'Başarı Galerisi', cat: 'hedefler', icon: '🏆', desc: 'Hall of Fame\'e ilk girişini yap.' },
  { id: 'h5', title: 'Planlamacı', cat: 'hedefler', icon: '📅', desc: 'Aynı anda 5 aktif hedef yönet.' },
  { id: 'h6', title: 'Yolun Yarısı', cat: 'hedefler', icon: '🏃', desc: 'Bir hedefin %50 ilerlemesine ulaş.' },
  { id: 'h7', title: 'Büyük Final', cat: 'hedefler', icon: '🎊', desc: 'En az 1 yıl süren bir vizyonu gerçekleştir.' },

  // --- Sağlık (30-36) ---
  { id: 's1', title: 'Sağlık Olsun', cat: 'saglik', icon: '🏥', desc: 'İlk doktor randevusunu sisteme işle.' },
  { id: 's2', title: 'İlaç Takipçisi', cat: 'saglik', icon: '💊', desc: 'İlaç stoklarını 3 kez güncelle.' },
  { id: 's3', title: 'Wellness Tutkunu', cat: 'saglik', icon: '💖', desc: '10 gün boyunca ruh hali (mood) kaydı yap.' },
  { id: 's4', title: 'Uyku Modu', cat: 'saglik', icon: '😴', desc: 'Uyku hedefine 1 hafta üst üste ulaş.' },
  { id: 's5', title: 'Demir Gibi', cat: 'saglik', icon: '💪', desc: 'Sağlık ölçümlerini (tansiyon, ateş vb.) düzenli gir.' },
  { id: 's6', title: 'Şifacı', cat: 'saglik', icon: '🌿', desc: 'Bitkisel takviyeler veya vitaminleri takip et.' },
  { id: 's7', title: 'Zinde Aile', cat: 'saglik', icon: '🚴', desc: 'Ailece bir spor aktivitesi tamamla.' },

  // --- Sosyal (37-43) ---
  { id: 'so1', title: 'Sosyal Kelebek', cat: 'sosyal', icon: '🦋', desc: '5 farklı sosyal aktiviteye katılım sağla.' },
  { id: 'so2', title: 'Eleştirmen', cat: 'sosyal', icon: '🍿', desc: 'Gidilen 5 mekanı veya etkinliği puanla.' },
  { id: 'so3', title: 'Rutin Master', cat: 'sosyal', icon: '🔄', desc: 'Bir sosyal rutini 1 ay boyunca bozma.' },
  { id: 'so4', title: 'Parti Gurusu', cat: 'sosyal', icon: '🎉', desc: 'Bir ev organizasyonu veya davet planla.' },
  { id: 'so5', title: 'Kültür Mantarı', cat: 'sosyal', icon: '🎭', desc: 'Tiyatro, sinema veya konser kaydı ekle.' },
  { id: 'so6', title: 'Lezzet Kaşifi', cat: 'sosyal', icon: '🍕', desc: '3 yeni restoran deneyip sisteme kaydet.' },
  { id: 'so7', title: 'Hatıra Defteri', cat: 'sosyal', icon: '📔', desc: 'Aktivitelere detaylı notlar ekle.' },

  // --- Ev & Pet (44-50) ---
  { id: 'e1', title: 'Ev Sahibi', cat: 'ev', icon: '🏠', desc: 'İlk ev bakım veya onarım görevini tamamla.' },
  { id: 'e2', title: 'Usta Tekniker', cat: 'ev', icon: '🔨', desc: '5 farklı onarım kaydını başarıyla kapat.' },
  { id: 'p1', title: 'Hayvan Dostu', cat: 'pet', icon: '🐶', desc: 'Waffle veya Mayıs için ilk aşıyı kaydet.' },
  { id: 'p2', title: 'Pati Koruyucu', cat: 'pet', icon: '🛡️', desc: 'Pet sağlık karnesini %100 doldur.' },
  { id: 'p3', title: 'Lojistik Sorumlusu', cat: 'pet', icon: '🍗', desc: 'Mama ve kum stoklarını hiç bitirme.' },
  { id: 'sys1', title: 'Güçlü Kullanıcı', cat: 'sistem', icon: '⚡', desc: 'Uygulamanın 10 farklı modülünü ziyaret et.' },
  { id: 'sys2', title: 'Vefalı Kullanıcı', cat: 'sistem', icon: '🎖️', desc: 'Eraylar Hanem\'i 30 gün boyunca her gün aç.' }
];
