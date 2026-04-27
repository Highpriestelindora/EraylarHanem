---
type: entity
tags: [module, travel, planning]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Entity: Tatil Modülü

Gezi planlama, bütçe takibi ve resmi döküman yönetimi.

## Özellikler
- **Geziler:** Planlanan ve geçmiş gezilerin detayları, fotoğrafları ve değerlendirmeleri.
- **İstek Listesi (Wishlist):** Gelecekte gidilmek istenen yerler ve notlar.
- **Pasaport ve Vize:** Pasaport bilgileri (son kullanma) ve Schengen vizesi detayları.

## Teknik Kısıtlama
`extractAppData` fonksiyonu, `localStorage` limitini aşmamak için yerel depolama sırasında tatil fotoğraflarını temizler; fotoğraflar sadece Supabase üzerinde tutulur.
