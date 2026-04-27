---
type: entity
tags: [module, vehicle, maintenance]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Entity: Aracım Modülü

Araç (Garaj) yönetimi, periyodik bakımlar ve yakıt takibi.

## Veri Yapısı
`garaj` dizisi içinde birden fazla araç desteklenir (Varsayılan: `v1 - Volkswagen Tiguan R-Line`).

## Takip Edilenler
- **Parça Ömürleri:** Yağ, filtre, fren balatası gibi parçaların KM bazlı takibi.
- **Yakıt Günlüğü:** Yakıt alımları ve tüketim analizi.
- **Dökümanlar:** Muayene, Kasko ve Trafik Sigortası bitiş tarihleri.
- **Destek:** Yol yardım ve sigorta danışmanı iletişim bilgileri.
- **Park Konumu:** Aracın bırakıldığı yerin notu ve konumu.
