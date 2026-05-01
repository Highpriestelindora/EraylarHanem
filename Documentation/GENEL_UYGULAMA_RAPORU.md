# 🏠 Eraylar Hanem Hub - Genel Uygulama Raporu (v3.0+)

**Eraylar Hanem Hub**, bir evin ve içindeki bireylerin (Görkem & Esra) tüm operasyonel süreçlerini tek bir çatı altında toplayan, "premium" tasarım anlayışıyla geliştirilmiş bir **Kişisel İşletim Sistemi**dir.

---

## 🍳 1. Mutfak & Yaşam Yönetimi
Mutfak modülü, evdeki gıda ve tüketim döngüsünü tamamen dijitalize eder.
- **Akıllı Stok Takibi**: Buzdolabı, Kiler ve Dondurucu katmanlı stok yönetimi. Kritik stok seviyesi uyarıları.
- **Ekmeklik v2.0**: Ekmeğin türüne göre (Somun, Tam Buğday vb.) tazelik süresini hesaplayan ve bayatlama uyarısı veren dinamik takip sistemi.
- **Su Takibi**: Günlük tüketime göre otomatik düşüm yapan, damacana ve pet şişe envanterini yöneten akıllı sistem.
- **Gastronomi & Tarifler**: Mevcut stok durumuna göre "Hazır", "Dondurucuda" veya "Eksik" olarak filtrelenebilen, yapay zeka destekli tarif bankası.

## 💰 2. Finans & Bütçe Merkezi
Tüm harcamaların ve varlıkların kontrol merkezi.
- **Kart & Nakit Yönetimi**: Kredi kartı limitleri, hesap kesim tarihleri ve güncel borçların anlık takibi.
- **Borç & Kredi Defteri**: Taksitli alışverişlerin ve banka kredilerinin ödeme planı ve kalan tutar takibi.
- **Abonelikler**: Netflix, Spotify gibi düzenli ödemelerin otomatik takibi.
- **Onay Havuzu**: Alışveriş veya Sosyal modüllerinden gelen harcamaların merkezi onaya düşmesi ve bütçeye işlenmesi.

## 🛒 3. Akıllı Alışveriş Sistemi
Kağıt kalem devrini kapatan, modüller arası entegre liste yönetimi.
- **Dinamik Listeler**: Görkem, Esra, Ev ve Market için ayrı sekmeler.
- **Stok Entegrasyonu**: Mutfakta biten ürünlerin tek tıkla alışveriş listesine aktarılması.
- **Satın Alım Onayı**: Alınan bir ürünün tek tıkla Finans modülüne (harcama) ve Ev Depo modülüne (envanter) işlenmesi.

## 🏎️ 4. Aracım (Garaj Yönetimi)
Araç veya tekne gibi tüm ulaşım varlıklarının bakım defteri.
- **Panel & KM**: Güncel kilometre ve parça ömürleri (Yağ, Filtre vb.) üzerinden periyodik bakım takibi.
- **Dijital Torpido**: Sigorta, kasko, muayene gibi belgelerin bitiş tarihlerini takip eden ve hatırlatan sistem.
- **Park Yeri & Yakıt**: Aracın bırakıldığı son konumu (GPS) kaydetme ve yakıt verimliliği analizleri.

## 👫 5. Sosyal & Planlama
Bireylerin ve ortak yaşamın ritmini düzenleyen modül.
- **Haftalık Plan**: Ortak aktivitelerin ve randevuların takvimi.
- **Fikir Havuzu**: "Bir ara yaparız" denilen aktivitelerin (restoran, film, gezi) saklandığı yer.
- **Rutinler**: Günlük veya haftalık tekrarlanan alışkanlıkların takibi.

## 🏢 6. Eraylar Kasa (Varlık & Gayrimenkul)
Ailenin toplam net değerini ve uzun vadeli yatırımlarını yönetir.
- **Varlık Portföyü**: Altın, hisse senedi ve nakit birikimlerin güncel değer takibi.
- **Taşınmaz Takibi**: Ev, arsa gibi gayrimenkullerin tapu bilgileri, vergileri ve piyasa değerleri.
- **Kumbara**: Belirli hedefler (yeni araba, tatil vb.) için birikim ilerleme takibi.

## 🏡 7. Ev & Güvenlik
Evin fiziksel durumunu ve teknik altyapısını yönetir.
- **Bakım Onarım**: Tamir bekleyen işlerin listesi ve servis geçmişi.
- **Güvenlik & Wi-Fi**: Misafirler için hızlı Wi-Fi paylaşımı (QR kod) ve güvenlik notları.
- **Depo v3.5**: Evdeki tüm eşyaların (teknoloji, kıyafet, hırdavat) yer ve durum bazlı envanteri.

## 🌍 8. Tatil & Keşif
Gidilen yerlerin ve biriktirilen anıların haritası.
- **İnteraktif Harita**: Gidilen şehirlerin ve ülkelerin görselleştirilmesi.
- **Waffle İstatistikleri**: Gezi verilerinin modern grafiklerle sunumu.
- **Anı Galerisi**: Tatil fotoğraflarının modül içerisinde şık bir şekilde sergilenmesi.

## 👤 9. Kişiye Özel Modüller (v3.1.0)
Giriş yapan kullanıcıya göre değişen, tamamen kişiselleştirilmiş 12. modül alanı.
- **Modaring (Esra)**: Esra'nın tasarım, moda ve yaratıcı projelerini yönettiği özel estetik alan.
- **Mühendislik (Görkem)**: Görkem'in yazılım, teknik dökümantasyon ve mühendislik projeleri için kullandığı teknik atölye.

---

### 🛡️ Temel Güvenlik Kuralı
Tüm modüllerdeki silme ve kritik veri değişiklikleri, "yakışıklı" bir onay modalı (`ConfirmModal`) ile güvence altına alınmıştır. Yanlışlıkla veri kaybı bu sistemle engellenmektedir.

---
*Uygulama, iPhone 15 Pro standartlarına uygun, Safe Area ve Dynamic Island destekli premium bir arayüzle sunulmaktadır.*
