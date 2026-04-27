---
type: entity
tags: [module, social, events]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Entity: Sosyal ve Etkinlikler

Sosyal hayatın planlanması ve aktivite havuzunun yönetilmesi.

## Bölümler
- **Aktiviteler:** Planlanmış sosyal etkinlikler.
- **Rutinler:** Haftalık spor, temizlik gibi düzenli aktiviteler.
- **Aktivite Havuzu:** 50+ önceden tanımlanmış İstanbul etkinliği ve kullanıcı fikirleri.
- **Rutin Paketleri:** Önceden hazırlanmış aktivite grupları.

## Veri Kaynağı
`src/constants/data.js` içerisindeki `INITIAL_SOCIAL_POOL` ve `SOCIAL_ROUTINES` sabitlerinden beslenir.
