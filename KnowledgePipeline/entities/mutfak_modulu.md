---
type: entity
tags: [module, features, kitchen]
date: 2026-05-10
status: stable
---

# Entity: Mutfak Modülü

Eraylar Hanem uygulamasının yemek ve mutfak yönetiminden sorumlu merkezi modülüdür. Ailenin günlük beslenme düzenini ve stok yönetimini optimize eder.

## 🎲 Temel Özellikler

### Şanslı Hisset (Lucky Fill)
Haftalık menüde boş kalan yerleri mevcut tarif havuzundan rastgele doldurur.
- **Kahvaltı (k):** Sadece `kahvalti` kategorisindeki tarifleri seçer.
- **Akşam (a):** Kahvaltı dışındaki tüm tarifleri (Ana yemek, çorba vb.) seçer.
- **Atomik Güncelleme:** Tüm hafta tek bir paket halinde güncellenir, veri kaybı önlenir.

### Akıllı Stok ve Renk Kodları
Sistem, her yemeğin malzeme durumunu kontrol ederek görselleştirir.

| Renk       | Anlamı        | Açıklama                                              |
| :--------- | :------------ | :---------------------------------------------------- |
| 🟢 Yeşil   | **Hazır**     | Tüm malzemeler Buzdolabı veya Kiler'de mevcut.        |
| 🔵 Mavi    | **Dondurucu** | Temel malzemeler Dondurucu'da, çıkarılması gerekiyor. |
| 🔴 Kırmızı | **Eksik**     | Malzemelerden en az biri stokta yok.                  |

### Hızlı Market
Haftalık plandaki eksik malzemeleri tek tuşla alışveriş listesine ekler. `1 Haftalık`, `2 Haftalık` veya `1 Aylık` periyotlarla hesaplama yapılabilir.

## 🛠️ Teknik Detaylar
- **Veri Yapısı:** `src/constants/data.js` içindeki `INITIAL_RECIPES` başlangıç noktasını oluşturur.
- **Mantık Konumu:** `src/store/useStore.js` -> `getAvailableRecipes`

## 🏛️ İlgili Kararlar
- 2. Milat Anayasası (Bkz: Index)
