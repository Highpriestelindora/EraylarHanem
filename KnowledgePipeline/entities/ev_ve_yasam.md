---
type: entity
tags: [module, home, maintenance, inventory]
source: [[sources/codebase]]
date: 2026-04-28
status: stable
version: 3.0
---

# Entity: Ev ve Yaşam Modülü

Eraylar Malikanesi Hub & Operasyon Merkezi. Evin fiziksel bakımı, demirbaş yönetimi, finansal abonelikler ve güvenlik protokollerinin merkezi.

## Özellikler (5-Tab Yapısı)
- **Yaşam (🪴):** Kullanıcı (Görkem/Esra) bazlı zaman analizi, akıllı yaşam asistanı (Advice Motor) ve AI destekli günlük tavsiyeler.
- **Bakım (🔧):** 
    - **Periyodik Bakımlar:** Klima, hava arıtma vb. için gün bazlı sayaçlı takip.
    - **Tamir & Bakım Listeleri:** Dinamik görev takibi.
    - **Tamir İçin Alınacaklar:** Depo modülü ile entegre parça listesi.
- **Abonelikler (💳):** Faturalar (Elektrik, Su, Doğalgaz) ve dijital aboneliklerin (Netflix, Youtube vb.) takibi. Finans modülü ile senkronize ödeme onayı.
- **Taşınmaz (🏗️):** Gayrimenkul portföyü. Piyasa değeri takibi, vergi dönem hatırlatıcıları (Mayıs/Kasım) ve net getiri hesaplama.
- **Güvenlik (🛡️):** 
    - **Acil Durum Çantaları:** Deprem ve İlk Yardım çantası envanteri, SKT takibi ve eksik ürün önerileri.
    - **Premium Wi-Fi Kartları:** Ana hat ve Misafir ağı için QR kod destekli, katlanabilir şık kartlar.
    - **Şifreli Defter (Vintage Safe):** Kişisel notlar için vintage tasarımlı, şifre korumalı ve "Resmi Mühür" detaylı dijital defter.

## Envanter Sistemi (Depo v3.5)
- **Akıllı Yaşam Döngüsü:** Ürünlerin son kullanma tarihlerine göre otomatik uyarı sistemi.
- **Entegrasyon:** Alışveriş ve Finans modülleri ile tam senkronizasyon.

## Teknik Detaylar
- **Bileşen:** `src/pages/Ev.jsx`.
- **State:** Zustand `ev` objesi. `emergencyKits`, `depo`, `tasinmazlar` (kasa store'dan) verilerini kullanır.
- **Güvenlik:** `personalSafe` verileri sadece doğru şifre ile belleğe yüklenir.

