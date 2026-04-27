# 🐾 Pet Modülü

Pet modülü, Waffle (Köpek) ve Mayıs (Kedi) için özel olarak tasarlanmış bir sağlık ve bakım takip merkezidir.

## 📱 Evcil Hayvan Seçimi
Üst kısımdaki navigasyon barı ile Waffle ve Mayıs arasında geçiş yapılır. Her pet için ayrı veri seti (Aşı, Kilo, Geçmiş) tutulur.

## 📱 Temel Özellikler

### 🦴 Mama ve Kum Takibi (Quick Supply Bar)
- **İşlev:** Mama veya kumun bitip bitmediğini tek tıkla işaretlemeyi sağlar.
- **Mutfak Entegrasyonu:** Eğer "AZALDI" seçilirse, ilgili ürün otomatik olarak Mutfak -> Alışveriş listesine eklenir.

### 💳 Kimlik Kartı
- **İşlev:** Cins, doğum tarihi, mikroçip numarası ve pasaport numarası gibi kritik bilgileri saklar.

### ⚖️ Kilo Takibi
- **İşlev:** Evcil hayvanın kilo değişimini izler. Son ölçüme göre artış/azalış miktarını gösterir.

### 💉 Aşı Takvimi
- **İşlev:** Aşıların son yapılma tarihini ve periyodunu tutar.
- **Durum Göstergesi:** Aşıya kalan gün sayısına göre "İYİ" (Yeşil), "YAKINDA" (Turuncu) veya "GECİKMİŞ" (Kırmızı) uyarısı verir.

### ⌛ Sağlık & Bakım Günlüğü
- **İşlev:** Veteriner ziyaretleri, ilaç kullanımları veya önemli notların tutulduğu kronolojik listedir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Harcama Ekle (Heart):** Pet ile ilgili (Mama, Veteriner faturası vb.) harcamaları direkt Finans modülüne kaydeder.
2.  **Aşı Ekle (+):** Yeni bir aşı tipi ve periyodu tanımlar.
3.  **Kilo Ölçümü (+):** Yeni bir ağırlık kaydı girer.
4.  **Emoji Tıklama:** Pet emojisine tıklandığında, o pete özel komik veya sevgi dolu bir mesaj (toast) çıkarır.

## 🔗 Veri Bağlantıları
- `pet.meta`: Genel bilgiler.
- `pet.vaccines`: Aşı kayıtları.
- `pet.history`: Günlük notları.
- `pet.weights`: Kilo kayıtları.
- `pet.supplies`: Mama/kum durumları.
