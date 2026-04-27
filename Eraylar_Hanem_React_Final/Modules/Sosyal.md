# 👫 Sosyal Modülü

Sosyal modülü, Görkem ve Esra'nın ortak etkinliklerini, rutinlerini ve şehirdeki etkinlikleri takip ettikleri sosyal takvimdir.

## 📱 Alt Sekmeler (Tabs)

### 📅 Plan (Hafta/Ay Görünümü)
- **İşlev:** Klasik bir takvim görünümü sunar. Sosyal aktiviteler, notlar, sağlık randevuları ve kesinleşen tatiller burada tek bir merkezde toplanır.
- **Akıllı Asistan Önerisi:** Eğer o ayki aktivite sayısı azsa, asistan otomatik olarak rutinlerden veya fikir havuzundan öneriler çıkarır.
- **Resmi Tatiller:** 2026 yılı Türkiye resmi tatilleri takvim üzerinde işaretlenmiştir.

### 🔁 Rutin
- **İşlev:** Düzenli olarak yapılan (Spor, Kitap Okuma vb.) aktivitelerin takibini sağlar.

### 💡 Fikirler (Havuz)
- **İşlev:** Gelecekte yapılmak istenen ama henüz tarihi belli olmayan etkinlik fikirlerini saklar.

### 🌆 İstanbul
- **İşlev:** Şehirdeki güncel etkinlikleri (Konser, Tiyatro, Sergi) Biletix ve Passo gibi kaynaklardan çekerek (simüle edilmiş) listeler.
- **Plana Ekle:** Beğenilen bir etkinlik tek tıkla Takvim'e eklenebilir.

---

## 🔘 Önemli Butonlar ve Aksiyonlar

1.  **Aktivite Planla (+):** Yeni bir sosyal etkinlik eklemek için form açar.
2.  **Not Ekle (📝):** Takvime hızlıca kısa hatırlatıcılar ekler.
3.  **Aktiviteyi Tamamla (Check):** Yapılan aktiviteyi "Tamamlandı" olarak işaretler ve geçmişe kaydeder.
4.  **Takvim Yaprağı (Immersive View):** Takvimdeki bir güne tıklandığında, o güne özel nostaljik takvim yaprağı görünümü açılır.

## 🔗 Veri Bağlantıları
- **Çoklu Modül Tarayıcı:** Takvim verilerini oluştururken `saglik.randevular`, `tatil.trips` ve `sosyal.aktiviteler` listelerini tarar.
- `sosyal.aktiviteler`: Manuel eklenen planlar.
- `sosyal.havuz`: Fikirler.
- `sosyal.rutinler`: Tekrarlayan işler.
