---
type: concept
tags: [architecture, state, zustand]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Concept: Merkezi State Yönetimi

Uygulamanın tüm verisi tek bir merkezi depo (store) üzerinden yönetilir.

## Teknoloji: Zustand
React uygulamaları için hafif ve esnek bir state yönetim kütüphanesi olan **Zustand** kullanılmaktadır.

## Yapılandırma
- **`persist` middleware:** Uygulama verileri tarayıcının `localStorage` alanına kaydedilir. Böylece sayfa yenilendiğinde veriler kaybolmaz.
- **Sync Katmanı:** `saveToSupabase` ve `loadFromSupabase` fonksiyonları ile yerel veri uzak veritabanı ile eşleşir.

## Avantajları
1. **Tek Doğruluk Kaynağı (Single Source of Truth):** Uygulamanın herhangi bir yerindeki değişiklik tüm bileşenleri anında günceller.
2. **Offline Çalışma:** İnternet olmasa bile kullanıcı işlem yapmaya devam edebilir, bağlandığında senkronize olur.
3. **Kolay Debugging:** Tüm state değişimleri merkezi bir yerden izlenebilir.
