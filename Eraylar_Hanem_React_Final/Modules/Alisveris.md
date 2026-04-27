# 🛍️ Alisveris Modülü

Alışveriş modülü, kişisel ve evle ilgili tüm satın alma ihtiyaçlarını organize eder.

## 📱 Alt Sekmeler (Tabs)

### 👨 Görkem
- **İşlev:** Görkem'e özel kişisel alışveriş listesi. Bakım, Giyim, Teknoloji gibi kategorilerle hızlı ürün ekleme imkanı sunar.

### 👩 Esra
- **İşlev:** Esra'ya özel kişisel alışveriş listesi. Cilt bakımı, Kozmetik, Hobi gibi kategoriler içerir.

### 🏡 Ev
- **İşlev:** Ev demirbaşları (Mobilya, Elektronik vb.) ve genel temizlik ihtiyaçlarını içerir.

### 🛒 Market
- **İşlev:** Mutfak modülü ile senkronize çalışır. Buzdolabı, kiler ve dondurucu için gerekli ürünlerin listesidir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Hızlı Ekle (Quick Add):** Her tabın üstünde bulunan emoji butonları ile kategorilere göre hızlıca ürün eklemeyi sağlar.
2.  **Satın Alımı Onayla (CheckCircle):** Bir ürün alındığında bu butona basılır.
    - **Finans Bağlantısı:** Satın alma tutarı, market ve ödeme yapılan kart seçilerek harcama olarak kaydedilir.
    - **Depo Bağlantısı:** Alınan ürün otomatik olarak "Ev Depo" (Envanter) listesine eklenir.
3.  **İstek Listesi (Wishlist):** Ürün eklerken "ŞİMDİ" yerine "İSTEK" seçilirse, ürün hemen alınacaklar yerine istek listesine (gelecek planları) düşer.

## 🔗 Veri Bağlantıları
- **Mutfak Senkronizasyonu:** `market` tabı direkt `mutfak.alisveris` verisini okur ve yazar.
- `alisveris.gorkem`, `alisveris.esra`, `alisveris.ev`: Kişisel ve ev listeleri.
- `alisveris.wishlist`: İstek listesi.
- **Finans Entegrasyonu:** `addExpense` fonksiyonu ile harcamalar Finans Havuzuna veya direkt Kasa'ya basılır.
