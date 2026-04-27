# 🍳 Mutfak Modülü

Mutfak modülü, ailenin yemek düzenini, stoklarını ve mutfakla ilgili diğer ihtiyaçlarını yönettiği merkezdir.

## 📱 Alt Sekmeler (Tabs)

### 📅 Menü
- **İşlev:** Haftalık veya günlük yemek planını tutar.
- **Detaylar:** `MenuTab.jsx` üzerinden yönetilir.

### 🧊 Stok
- **İşlev:** Buzdolabı, Kiler ve Dondurucu stoklarını takip eder.
- **Kritik Stok Uyarıları:** Bir ürünün mevcut miktarı (`cr`), minimum miktarının (`mn`) altına düşerse ana ekranda ve modül başlığında "⚠️ X Ürün Azaldı!" uyarısı çıkar.

### 🥖 Ekmek
- **İşlev:** Ekmeklikteki ekmek çeşitlerini ve taze/bayat durumunu takip eder.

### 💧 Su
- **İşlev:** Damacana su seviyesini takip eder ve su siparişi geçmişini tutar.

### 🛒 Alışveriş
- **İşlev:** Mutfak için gerekli market listesini tutar.
- **Bağlantı:** Stok sekmesinde azalan ürünler buraya otomatik olarak düşebilir.

### 📖 Tarifler (Üst Sağ Buton)
- **İşlev:** Ailenin sevdiği tarifleri sakladığı dijital yemek kitabı.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Geri Butonu (ArrowLeft):** Ana sayfaya döner.
2.  **Kitap Butonu (BookOpen):** Tarifler sekmesini açar/kapatır.
3.  **Kritik Stok Kutusu (⚠️):** Eğer ürün azaldıysa başlıkta belirir, tıklandığında direkt **Alışveriş** sekmesine yönlendirir.
4.  **Tab Butonları:** Alttaki navigasyon çubuğu ile sekmeler arası geçiş sağlar.

## 🔗 Veri Bağlantıları
- Veriler `useStore.js` içindeki `mutfak` objesinde tutulur.
- `buzdolabi`, `kiler`, `dondurucu` listeleri bu modülün temel veri kaynaklarıdır.
