# 🏛️ Kasa Modülü (Varlık Kalesi)

Kasa modülü, ailenin uzun vadeli birikimlerini, mülklerini ve likit varlıklarını yönettiği "dijital kasa"dır.

## 📱 Alt Sekmeler (Tabs)

### 🪙 Birikim
- **İşlev:** Altın, gümüş, borsa veya döviz gibi likit varlıkların takibini yapar.
- **Portföy Dağılımı:** Toplam varlığın yüzde kaçının nakit, yüzde kaçının mülk olduğunu grafik (Doughnut) ile gösterir.

### 🏠 Mülkler (Taşınmazlar)
- **İşlev:** Gayrimenkul portföyünü (ev, arsa vb.) yönetir.
- **Maliyet Takibi:** Her mülk için vergi, sigorta ve ek maliyetlerin takibi yapılır.

### 🎯 Hedefler (Kumbaralar)
- **İşlev:** Belirli hedefler için (örneğin: Araba, Yeni Telefon) ayrılan birikimleri takip eder.
- **İlerleme:** Hedeflenen tutarın yüzde kaçına ulaşıldığı görsel olarak sunulur.

### 💵 Nakit
- **İşlev:** Görkem, Esra ve Ortak hesaplardaki anlık nakit miktarını gösterir.
- **Transfer:** Hesaplar arası sanal para transferi simülasyonu yapabilir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Gizlilik Modu (Eye/EyeOff):** Finans modülüyle ortaktır. Tüm hassas verileri maskeler.
2.  **Transfer Butonu:** Hesaplar arası para aktarımı arayüzünü açar.
3.  **Varlık Güncelle:** Kur veya miktar değiştiğinde varlık detaylarını düzenler.

## 🔗 Veri Bağlantıları
- **Finans Bağlantısı:** `netWorth` (Net Varlık) hesaplanırken Kasa'daki varlıklardan Finans'taki borçlar çıkarılır.
- `kasa.bakiyeler`: Nakit durumları.
- `kasa.varliklar`: Altın, borsa vb.
- `kasa.tasinmazlar`: Gayrimenkuller.
- `kasa.kumbaralar`: Hedef birikimler.
