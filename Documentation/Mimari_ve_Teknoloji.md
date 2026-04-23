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
- **Animasyonlar:** `framer-motion` benzeri geçişler ve hareketli etkileşimler.
