# 🍲 Mutfak Modülü

Mutfak modülü, ailenin günlük beslenme düzenini ve stok yönetimini optimize eder.

## 🎲 Şanslı Hisset (Lucky Fill)
Bu özellik, haftalık menüde boş kalan yerleri mevcut tarif havuzundan rastgele doldurur.

### Mantık:
- **Kahvaltı (k):** Sadece `c: 'kahvalti'` kategorisindeki tarifleri seçer.
- **Akşam (a):** Kahvaltı dışındaki tüm tarifleri (Ana yemek, çorba vb.) seçer.
- **Atomik Güncelleme:** Tüm hafta tek bir paket halinde güncellenir, böylece veri kaybı yaşanmaz.

## ❄️ Akıllı Stok ve Renk Kodları
Sistem, `src/store/useStore.js` içindeki `getAvailableRecipes` fonksiyonunu kullanarak her yemeğin malzeme durumunu kontrol eder.

| Renk       | Anlamı        | Açıklama                                              |
| :--------- | :------------ | :---------------------------------------------------- |
| 🟢 Yeşil   | **Hazır**     | Tüm malzemeler Buzdolabı veya Kiler'de mevcut.        |
| 🔵 Mavi    | **Dondurucu** | Temel malzemeler Dondurucu'da, çıkarılması gerekiyor. |
| 🔴 Kırmızı | **Eksik**     | Malzemelerden en az biri stokta yok.                  |

## 🛒 Hızlı Market
Haftalık plandaki eksik malzemeleri tek tuşla alışveriş listesine ekler.
- `1 Haftalık`, `2 Haftalık` veya `1 Aylık` periyotlarla malzeme ihtiyacı hesaplanabilir.

## 📝 Tarif Havuzu
`src/constants/data.js` içinde `INITIAL_RECIPES` olarak tanımlanmıştır ve Supabase üzerinden kullanıcı tarafından güncellenebilir.
