# 🧠 State ve Store Yapısı (useStore.js)

Uygulamanın kalbi `src/store/useStore.js` dosyasıdır. **Zustand** kütüphanesi kullanılarak geliştirilmiştir.

## 🔄 Senkronizasyon Mekanizması

Store iki katmanlı bir senkronizasyon kullanır:
1.  **LocalStorage (Persist):** Uygulama verilerini tarayıcıda saklar. Fotoğraflar gibi ağır veriler yer kaplamaması için kaydedilmez.
2.  **Supabase Sync:**
    - `initSync()`: Uygulama açıldığında verileri veritabanından çeker.
    - `saveToSupabase()`: Her veri değişiminde veritabanını günceller.
    - `subscribeToSupabase()`: Başka bir cihazda yapılan değişiklikleri anında (Realtime) algılar ve UI'ı günceller.

## 📂 Ana State Yapısı

Store içinde her modülün kendine ait bir objesi bulunur:
- `finans`: Harcamalar, borçlar, kartlar.
- `kasa`: Bakiyeler, varlıklar, taşınmazlar.
- `mutfak`: Stok, menü, tarifler, su takibi.
- `saglik`: Randevular, ilaçlar, ölçümler.
- `tatil`: Geziler, vize/pasaport, hayaller.
- `pet`: Waffle & Mayıs verileri.
- `ev`: Faturalar, bakımlar, demirbaşlar.
- `garaj`: Araç detayları ve yakıt logları.

## 🛠️ Temel Fonksiyonlar

- `setModuleData(moduleName, data)`: Belirtilen modülün verisini günceller ve Supabase'e basar.
- `addLog(action, detail)`: Uygulama genelindeki işlem geçmişine (Home modülündeki loglar) kayıt ekler.
- `currentUser`: O anki aktif kullanıcıyı (Görkem/Esra) tutar.

## ⚠️ Kritik Notlar
- `extractAppData`: Veriyi Supabase'e gönderirken temizleyen (gereksiz UI state'lerini atan) fonksiyondur.
- `DEFAULT_STATE`: Uygulamanın fabrika ayarları buradadır. Eğer veritabanı boşsa buradan başlar.
