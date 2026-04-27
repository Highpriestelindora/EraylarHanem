---
type: entity
tags:
  - module
  - finance
  - asset-management
source:
  - - sources/codebase
date: 2026-04-27
status: stable
---

# Entity: Finans ve Kasa

Eraylar ailesinin tüm mali varlıklarını, harcamalarını ve borçlarını yöneten modüldür.

## Alt Bileşenler
### 1. Gider Yönetimi (`finans`)
- **Harcamalar:** Günlük giderlerin takibi.
- **Onay Havuzu (Approval Pool):** Eşler arası harcama onayı sistemi.
- **Borçlar/Krediler:** Konut ve araç kredisi gibi uzun vadeli borçların takibi.
- **Kartlar:** Kredi kartı limit ve hesap kesim takibi.
- **Abonelikler (Rekurans):** Netflix, Spotify gibi düzenli ödemeler.

### 2. Varlık Yönetimi (`kasa`)
- **Bakiyeler:** Görkem, Esra ve Ortak hesap bakiyeleri.
- **Taşınmazlar:** Antalya, Didim ve Eskişehir'deki mülklerin (ada/parsel/değer) detaylı dökümü.
- **Varlıklar:** Altın, borsa portföyü ve döviz birikimleri.
- **Kumbaralar:** Hedef odaklı birikim (Yeni Araba, Yaz Tatili).

## Teknik Veri Yapısı
`useStore.js` içerisinde `finans` ve `kasa` objeleri altında tutulur. `privacyMode` ile hassas verilerin gizlenmesi desteklenir.

## İlgili İş Akışları
- Harcama girildiğinde onay havuzuna düşer.
- Onaylandığında ilgili kişinin bakiyesinden (nakit ise) düşülür.
