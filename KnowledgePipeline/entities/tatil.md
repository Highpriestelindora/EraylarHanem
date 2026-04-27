---
type: entity
tags: [module, travel, planning]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Entity: Tatil Modülü

Seyahat rehberi, gezi planlama, bütçe takibi, resmi döküman yönetimi ve ortak anıların paylaşıldığı merkezi alan.

## Özellikler
- **Tatiller:** Planlanan, kesinleşen ve devam eden seyahatlerin listelendiği, uçuş ve konaklama detaylarının tutulduğu bölüm.
- **Anılar:** Geçmiş gezilerin detayları, fotoğrafları ve kullanıcı bazlı (Görkem/Esra) değerlendirmeleri.
- **Harita:** Ortak keşiflerin dünya haritası üzerinde gösterildiği ve istatistiklerin (ülke/şehir/gün) tutulduğu sayfa.
- **Hayaller (Wishlist):** 
    - **Keşif Kahini:** Rastgele seyahat önerileri sunan akıllı algoritma.
    - **Kategori Filtreleme:** Macera, Doğa, Kültür vb. kategorilerde emojili ve optimize edilmiş keşif dünyası.
- **Pasaport ve Vize:**
    - **Vize & Pasaport Uyumluluk Asistanı:** Seyahat tarihlerine göre vize geçerliliğini ve pasaportun "6 ay kuralı"na (dönüşten sonra 6 ay geçerlilik) uygunluğunu otomatik denetleyen sistem.
    - **Otomatik Bölge Tespiti:** Gidilecek şehre/ülkeye göre (Örn: Viyana) vize gereksinimini (Schengen vb.) otomatik belirler.
- **Premium Seyahat Rehberi:** Wikipedia REST API entegrasyonu ile destinasyonlar hakkında canlı tarihçe, özet ve yüksek kaliteli hero görseller sunan etkileşimli rehber sistemi.
- **Biliyor muydunuz? & Mutlaka Yap:** Her lokasyon için küratörlü ilginç bilgiler ve aktivite önerileri.

## Tasarım Prensipleri
- **iOS Öncelikli & Nazik Tasarım:** Aile uygulaması estetiğine uygun, çok küçük ve zarif fontlar (10-12px), pastel renk paletleri ve yoğun emoji kullanımı.
- **Etkileşim:** "Keşif Kahini" gibi bölümlerde yüksek mikro-animasyon ve kullanıcı geri bildirimi.

## Teknik Detaylar
- **Depolama Stratejisi:** `extractAppData` fonksiyonu, `localStorage` limitini aşmamak için yerel depolama sırasında tatil fotoğraflarını temizler; fotoğraflar sadece Supabase üzerinde tutulur.
- **Vize Mantığı:** `Tatil.jsx` içinde merkezi bir ülke-vize eşleştirme listesi üzerinden dinamik sorgulama yapılır.
