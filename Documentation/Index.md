# 🧠 Eraylar Hanem - Proje Beyni (Versiyon 1.0.0 🚀)

Bu dökümantasyon, **Eraylar Hanem** uygulamasının tüm mantıksal yapısını, veri akışını ve özelliklerini Obsidian veya benzeri araçlarla bir "dış beyin" olarak kullanabilmeniz için hazırlanmıştır. **24 Nisan 2026** itibariyle uygulama tam sürüm olarak yayındadır.

## 📱 iOS Öncelikli Geliştirme (Mutlak Kural)
Yapılan her yeni özellik ve UI değişikliği, öncelikle **iOS (iPhone)** platformunda kusursuz çalışacak şekilde test edilmelidir. Detaylar için bkz: [[Mimari_ve_Teknoloji#iOS-Uyumluluk--Mobil-Öncelik-Mutlak-Kararlar]].

## 🗺️ Harita
- [[Mimari_ve_Teknoloji]]: Uygulamanın teknik altyapısı ve veri akışı.
- [[State_Yonetimi]]: Merkezi veri yönetimi ve Supabase senkronizasyonu.
- [[Mutfak_Modulu]]: Menü planlama, Akıllı Stok ve Şanslı Hisset.
- [[Finans_ve_Kasa]]: Gelir-gider, borçlar, kartlar ve varlık yönetimi.
- [[Sosyal_ve_Etkinlikler]]: İstanbul etkinlikleri, fikir havuzu ve aktivite takvimi.
- [[Aracim_ve_Ulasim]]: Araç bakım takibi, yakıt ve KM günlükleri.
- [[Ev_ve_Yasam]]: Faturalar, sigortalar ve ev bakım işleri.
- [[Saglik_ve_Pet]]: Randevular, ilaç takibi ve evcil hayvan (Pet) yönetimi.
- [[Tatil_Modulu]]: Detaylı tatil planlama ve vize/pasaport takibi.
- [[Hedefler_ve_Basarilar]]: Rozetler ve kişisel gelişim takibi.

## 🚀 Temel Özellikler
1. **Akıllı Planlama:** [[Mutfak_Modulu#Şanslı-Hisset|Şanslı Hisset]] butonu ile saniyeler içinde haftalık menü oluşturma.
2. **Stok Entegrasyonu:** Tariflerin malzeme durumuna göre [[Mutfak_Modulu#Renk-Kodları|Renk Kodları]] ile görselleştirilmesi.
3. **Gerçek Zamanlı Senkronizasyon:** Supabase ile tüm aile bireyleri arasında anlık veri paylaşımı.

## 🛠️ Geliştirme Notları
- Proje kök dizini: `Eraylar Hanem Moduler/react-app`
- Ana Store dosyası: `src/store/useStore.js`
