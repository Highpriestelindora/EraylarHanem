# 💎 Finans ve Kasa Modülü

Eraylar Hanem'in finansal kalbi, harcamaların takibi ile nakit varlıkların yönetimini tek bir noktada birleştirir.

## 🏦 Varlık Yönetimi (Kasa)
Uygulama, aile bireylerinin nakit varlıklarını üç ana bakiye üzerinden takip eder:
- **Görkem:** Kişisel nakit bakiye.
- **Esra:** Kişisel nakit bakiye.
- **Ortak:** Aile ortak harcamaları için ayrılan bakiye.

Bakiyeler, harcama girildiğinde seçilen ödeme yöntemine göre otomatik olarak güncellenir.

## 💸 Harcama Takibi
Harcamalar kategorize edilerek saklanır (`mutfak`, `araç`, `sosyal`, `fatura`, `diğer`).
- **Ödeme Yöntemi:** Nakit (Bakiye düşer) veya Kredi Kartı (Kart borcu artar).
- **Entegrasyon:** Her harcama hem `finans.harcamalar` listesine hem de `kasa.gecmis` loglarına işlenir.

## 💳 Borçlar ve Kartlar
- **Kredi Kartları:** Limit, güncel borç ve hesap kesim tarihleri takip edilir.
- **Borçlar (Krediler):** Toplam tutar, kalan miktar ve aylık taksit ödemeleri yönetilir. Borç ödemesi yapıldığında hem bakiye düşer hem de kalan borç güncellenir.

## 📺 Abonelikler (Rekurans)
Düzenli aylık ödemeler (Netflix, Spotify, Kira vb.) burada listelenir ve aylık finansal yükün analizine dahil edilir.

## 📊 Analiz
Giderlerin kategorik dağılımı ve varlık/borç dengesi görselleştirilerek finansal sağlık takibi yapılır.
