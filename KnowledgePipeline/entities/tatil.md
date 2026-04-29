---
type: entity
tags: [module, travel, planning]
source: [[sources/codebase]]
date: 2026-04-28
status: stable
version: 2.30.0
---

# Entity: Tatil Modülü

Seyahat rehberi, gezi planlama, bütçe takibi, resmi döküman yönetimi ve ortak anıların paylaşıldığı merkezi alan.

## Özellikler
- **Tatiller:** Planlanan, kesinleşen ve devam eden seyahatlerin listelendiği, uçuş ve konaklama detaylarının tutulduğu bölüm.
- **Anılar:** Geçmiş gezilerin detayları, fotoğrafları ve kullanıcı bazlı (Görkem/Esra) değerlendirmeleri.
    - **Bireysel Maceralar:** Kullanıcı seçimine göre solo seyahatlerin listelendiği filtreli görünüm.
    - **Fotoğraf Kalıcılığı:** Fotoğraflar sadece Supabase'de saklanır, `localStorage` limitlerini korumak için yerel depolama sırasında temizlenir.
- **Harita:** Ortak keşiflerin dünya haritası üzerinde gösterildiği ve istatistiklerin tutulduğu sayfa.
    - **Floating HUD Filters:** Harita üzerinde Esra/Ortak/Görkem seyahatlerini dinamik filtreleyen yüzer kontrol paneli.
    - **visitedData Mantığı:** İstatistikler seyahat bazlı değil, benzersiz yer (unique countries) bazlı hesaplanır. Farklı zamanlarda gidilen aynı ülkeler tek sayılır.
    - **Pet Toggle Stats:** Esra/Görkem kartlarına tıklandığında "miyav/hav hav" ses efektli ve min-height korumalı görsel geri bildirim.
- **Hayaller (Wishlist):** 
    - **Keşif Kahini:** Wikipedia REST API (Türkçe öncelikli) entegrasyonu ile destinasyonlar hakkında canlı tarihçe ve görseller sunan akıllı rehber.
- **Pasaport ve Vize:**
    - **Vize & Pasaport Uyumluluk Asistanı:** 6 ay kuralı denetimi ve otomatik vize gereksinim tespiti.

## Teknik Detaylar
- **Status Döngüsü:** `planned → upcoming (7 gün kala) → ongoing (başlangıç günü) → completed`.
- **Zustand Store:** `tatil` anahtarı altında `eraylar_store` tablosuna senkronize edilir.
- **Görsel Optimizasyon:** 700px width, 0.5 JPEG kalite ile fotoğraf sıkıştırma.
- **Kritik Classlar:** `.map-traveler-pill-container.floating-hud`, `.scrollable-history`, `.hss-column`.
