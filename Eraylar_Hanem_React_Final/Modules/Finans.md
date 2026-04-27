# 💰 Finans Modülü

Finans modülü, ailenin nakit akışını, harcamalarını ve borçlarını yönettiği ana merkezdir.

## 📱 Alt Sekmeler (Tabs)

### ⌛ Havuz
- **İşlev:** Onay bekleyen harcamaların tutulduğu yerdir. 
- **Mekanizma:** Alışveriş modülünde veya diğer yerlerde yapılan harcamalar buraya "bekleyen" olarak düşer. Görkem veya Esra onayladığında harcama kesinleşir ve bakiyeden düşer.

### 💳 Borçlar
- **İşlev:** Kredi kartı borçları ve kredi taksitlerini takip eder.
- **Kart Görseli:** Banka kartı şeklinde tasarlanmış kartlar üzerinden limit ve borç takibi yapılır.
- **Krediler:** Kalan tutar üzerinden bir ilerleme çubuğu (progress bar) gösterir.

### 📊 Analiz
- **İşlev:** Ailenin toplam varlık dağılımını (Görkem, Esra, Ortak) grafiklerle gösterir.
- **Grafikler:** Chart.js kullanılarak oluşturulan halka grafik (Doughnut) ve nakit akış özetlerini içerir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Gizlilik Modu (Göz İkonu):** Tıklandığında tüm rakamları `••••₺` şeklinde gizler. Misafir yanındayken veya ekran paylaşırken kullanılır.
2.  **Onay (Check):** Havuzdaki harcamayı onaylar ve bakiyeden düşer.
3.  **Reddet (X):** Havuzdaki harcamayı siler.
4.  **Taksit Öde:** Kredi borcundan taksit miktarını düşer ve bunu bir harcama olarak kaydeder.

## 🔗 Veri Bağlantıları
- **Kasa Bağlantısı:** Finans modülündeki harcama onayları direkt `kasa.bakiyeler` verisini etkiler.
- `finans.approvalPool`: Onay bekleyenler.
- `finans.borclar`: Krediler.
- `finans.kartlar`: Kredi kartları.
