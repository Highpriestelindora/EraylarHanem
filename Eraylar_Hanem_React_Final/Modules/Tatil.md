# ✈️ Tatil Modülü

Tatil modülü, ailenin geçmiş ve gelecek gezilerini, seyahat belgelerini ve hayallerini organize eder.

## 📱 Alt Sekmeler (Tabs)

### 🗺️ Harita
- **İşlev:** Görkem ve Esra'nın birlikte gittiği yerleri dünya haritası üzerinde pinlerle gösterir.
- **İstatistikler:** Kaç ülke, kaç şehir ve kaç gün gezildiği özetlenir.
- **Son Keşifler:** Son 10 geziyi liste olarak sunar.

### 🌴 Geziler
- **İşlev:** Planlanan ve tamamlanan tüm seyahatlerin detaylı listesidir.
- **Detaylar:** Ulaşım, konaklama, hava durumu tahmini ve harcama detayları her gezi kartında bulunur.

### 🛂 Belgeler
- **İşlev:** Pasaport bilgileri ve vizelerin takibini sağlar.
- **Süre Takibi:** Vizelerin bitiş tarihine göre uyarı verir.

### 🌟 Hayaller
- **İşlev:** "Discovery Oracle" (Keşif Kahini) özelliği ile yeni gezi fikirleri sunar ve ailenin gitmek istediği yerleri (Bucket List) tutar.
- **Yeni Bir Hayal Kur:** Kullanıcıların manuel olarak hayallerini ekleyebileceği bir form içerir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Gezgin Sihirbazı (+ Butonu):** Yeni bir gezi planı başlatmak için çok aşamalı bir form açar.
2.  **Keşif Kahini (Moon İkonu):** Rastgele yeni bir gezi önerisi getirir.
3.  **Hayallere Ekle (Sparkles):** Beğenilen bir gezi önerisini hayal listesine (Bucket List) kaydeder.
4.  **Hava Durumu Yenile (Refresh):** Gezi detaylarındaki hava durumu verisini günceller.

## 🔗 Veri Bağlantıları
- Veriler `useStore.js` içindeki `tatil` objesinde tutulur.
- `trips`: Tüm gezi verileri.
- `wishlist`: Hayaller listesi.
- `passport`: Pasaport ve vize verileri.
- Dış API: Hava durumu için `open-meteo.com` kullanılır.
