# 🏗️ Mimari ve Teknoloji

Eraylar Hanem, modern web teknolojileri üzerine inşa edilmiş, modüler ve yüksek performanslı bir aile yönetim platformudur.

## 🛠️ Teknoloji Yığını
- **Frontend:** [React](https://react.dev/) (Vite tabanlı)
- **State Yönetimi:** [Zustand](https://github.com/pmndrs/zustand) (Merkezi ve hızlı veri yönetimi)
- **Veritabanı & Sync:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime Sync)
- **Styling:** Vanilla CSS (Özel premium tasarımlar için)
- **İkonlar:** [Lucide React](https://lucide.dev/) (Modern ve temiz ikon seti)
- **Bildirimler:** [React Hot Toast](https://react-hot-toast.com/) (Anlık kullanıcı geri bildirimleri)

## 📁 Dosya Yapısı
```text
react-app/
├── src/
│   ├── components/     # Ortak kullanılan UI bileşenleri
│   ├── constants/      # data.js (Varsayılan veriler)
│   ├── lib/            # Supabase istemcisi ve servisler
│   ├── pages/          # Modül sayfaları (Finans, Mutfak, vb.)
│   ├── store/          # useStore.js (Ana uygulama mantığı)
│   └── App.jsx         # Ana yönlendirme ve yapı
├── Documentation/      # Obsidian "Proje Beyni" dosyaları
└── public/             # Statik varlıklar
```

## 🔄 Veri Akış Şeması
1. **User Action:** Kullanıcı butona tıklar.
2. **Local Update:** Zustand state'i anında güncellenir (Hız).
3. **Async Sync:** Supabase `upsert` işlemi arka planda başlatılır.
4. **Realtime Broadcast:** Diğer aile bireylerinin cihazları veritabanı değişikliğini yakalar ve ekranlarını otomatik günceller.

## 🎨 Tasarım İlkeleri
- **Emoji Odaklı:** Navigasyon ve içeriklerde zengin emoji kullanımı.
- **Glassmorphism:** Buzlu cam efektli (Glass) kartlar ve paneller.
- **Premium Renk Paleti:** Her modül için özel belirlenmiş gradient ve gölge setleri.
- **Animasyonlar:** Mikro etkileşimler ve yumuşak sayfa geçişleri.

## 📱 iOS Uyumluluk & Mobil Öncelik (Mutlak Kararlar)
> [!IMPORTANT]
> Uygulamanın ana kullanım mecrası iPhone olduğu için, yapılan her geliştirme mutlak suretle iOS standartlarına uygun olmalıdır.

1.  **Versiyon 1.0.0 Canlıda:** Proje 24 Nisan 2026 itibariyle tam fonksiyonel olarak yayına alınmıştır.
2.  **Safe Area (Çentik) Bilinci:** Üst banner ve alt navigasyon, iPhone çentiği ve "home indicator" alanı ile çakışmayacak şekilde `viewport-fit=cover` ve CSS `env(safe-area-inset-*)` kullanılarak korunmalıdır.
3.  **Dokunmatik Alanlar:** Butonlar ve tıklanabilir alanlar, parmakla rahat seçilebilmesi için en az 44x44px efektif alana sahip olmalıdır.
4.  **Z-Index & Modal Düzeni:** iOS Safari'deki katmanlama sorunlarını önlemek için modallar her zaman `React Portal` kullanılarak ana DOM dışına render edilmelidir.
5.  **Geri Tuşu & Navigasyon:** Sayfa geçişlerinde iOS "swipe back" hissini bozmayacak akışlar tercih edilmelidir.
