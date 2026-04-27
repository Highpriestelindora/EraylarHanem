---
type: entity
tags: [module, health, medicine]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Entity: Sağlık Modülü

Kişisel sağlık verileri, randevular ve ilaç takibi için kullanılır.

## Özellikler
- **Randevu Takibi:** Doktor kontrolleri ve rekürens (yıllık/aylık) randevular.
- **İlaç Takibi:** İlaç stok yönetimi, dozaj ve kritik stok uyarıları.
- **Ölçümler:** Tansiyon, ateş, kilo gibi verilerin tarihsel kaydı.
- **Mood (Ruh Hali):** Günlük ruh hali takibi ve notları.

## Kritik Mantık
- `takeMedicine` fonksiyonu stoğu bir azaltır ve `minStok` altına düştüğünde sistem loglarına uyarı düşer.
