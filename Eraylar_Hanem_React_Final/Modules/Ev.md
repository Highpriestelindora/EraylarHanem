# 🏡 Ev Modülü (Malikane Operasyon Merkezi)

Ev modülü, ailenin evle ilgili tüm teknik, finansal ve güvenlik süreçlerini yönettiği Hub merkezidir.

## 📱 Alt Sekmeler (Tabs)

### 🪴 Yaşam
- **İşlev:** Günlük ev operasyonlarını içerir.
- **Fatura Girişi:** Elektrik, Su, Doğalgaz gibi faturaların takibi yapılır.
- **Bakım & Tamir:** Evdeki tamir edilecekler ve periyodik bakımlar (Örn: Kombi bakımı, Çiçek sulama) listelenir.
- **AI Analizi:** Faturaların ortalamasına göre enerji verimliliği hakkında akıllı notlar (Insight) çıkarır.

### 🏗️ Taşınmaz
- **İşlev:** Ailenin sahip olduğu gayrimenkul portföyünü (Daire, Arsa vb.) yönetir.
- **Detaylı Takip:** Ada/Parsel bilgileri, piyasa değeri, aylık kira geliri ve vergi durumları her taşınmaz için ayrı ayrı tutulur.

### 📦 Depo (Envanter)
- **İşlev:** Alışveriş modülünden alınan ve "Ev Depo"ya gönderilen tüm ürünlerin kronolojik listesidir. 
- **Entegrasyon:** Kim, ne zaman, kaça almış bilgisi burada saklanır.

### 🛡️ Güvenlik
- **İşlev:** Evin kritik bilgilerini saklar.
- **Şifreler:** Wi-Fi şifresi ve Alarm kodu (varsayılan olarak gizlidir).
- **Misafir Modu:** Eve gelen misafirler için hızlı bilgi paylaşım kartı sunar.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Bakım Sıfırla:** Periyodik bir bakım yapıldığında tıklandığında sayacı (gün) sıfırlar.
2.  **Piyasa Değeri Araştır (Piyasa İkonu):** Taşınmazlar için güncel piyasa değerini otomatik olarak (simüle edilmiş) günceller.
3.  **Şifreleri Göster (Anahtar):** Gizli olan güvenlik kodlarını görünür hale getirir.

## 🔗 Veri Bağlantıları
- `ev.faturalar`: Fatura kayıtları.
- `kasa.tasinmazlar`: Gayrimenkul verileri (Kasa modülüyle ortaktır).
- `ev.depo`: Satın alınan envanter listesi.
- `ev.guvenlik`: Şifre ve kodlar.
