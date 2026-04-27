# 🏎️ Garajım (Araçlarım) Modülü

Garajım modülü, ailenin araç (otomobil, tekne vb.) operasyonlarını, bakım takvimlerini ve yakıt ekonomisini yönettiği modüldür.

## 📱 Alt Sekmeler (Tabs)

### 🏎️ Panel (Dashboard)
- **İşlev:** Aracın anlık durumunu gösterir.
- **KM Widget:** Güncel kilometreyi takip eder.
- **Parça Bakım Göstergeleri:** Yağ, Filtre, Fren Balatası gibi parçaların ömrünü (KM bazlı) analog göstergelerle sunar. %85'i geçen parçalar kırmızıya döner.
- **Acil Destek:** Yol yardım ve sigorta numaralarına hızlı erişim sağlar.

### 🛠️ Servis
- **İşlev:** Aracın geçmişteki tüm servis ve tamir kayıtlarını maliyetleriyle birlikte listeler.

### 📂 Torpido (Dijital Arşiv)
- **İşlev:** Kasko, Sigorta, Muayene gibi belgelerin bitiş tarihlerini takip eder.
- **Uyarı Sistemi:** Bitişine az kalan belgeler için kalan gün sayısını gösterir.

### 📊 Analiz
- **İşlev:** Yakıt tüketim istatistiklerini (L/100km) grafikler üzerinden analiz eder.
- **Yakıt Geçmişi:** Alınan yakıtların litre fiyatı ve istasyon bilgisini tutar.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Yakıt Al (Fuel):** Yeni yakıt kaydı girer ve maliyeti Finans'a aktarır.
2.  **Yıkama (Droplets):** Araç yıkama masrafını kaydeder ve son yıkama tarihini günceller.
3.  **Park Yeri (MapPin):** Aracın park edildiği konumu (GPS + Kat/Sıra bilgisi) kaydeder. Parktan çıkınca süreyi ve ücreti hesaplayabilir.
4.  **Garaj Değiştir (Warehouse):** Birden fazla araç/tekne varsa aralarında geçiş yapmayı sağlar.

## 🔗 Veri Bağlantıları
- `garaj`: Tüm araçların verisini içeren ana listedir.
- `selectedVehicleId`: O an hangi aracın görüntülendiğini tutar.
- **Zustand Fonksiyonları:** `updateKM`, `addFuelLog`, `addServiceRecord` gibi fonksiyonlarla veri tabanı güncellenir.
