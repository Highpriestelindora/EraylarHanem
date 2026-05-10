---
type: index
date: 2026-05-10
---

# Eraylar Hanem Hub 🏛️🧠

Bu sayfa projenin "İkinci Beyni" ve ana komuta merkezidir. Tüm modüller ve kararlar burada merkezileştirilmiştir.

## 🏛️ 2. MİLAT ANAYASASI (%100 SQL SSOT)
Uygulamanın değişmez temel kuralı şudur: **Tek Doğruluk Kaynağı (SSOT) her zaman Supabase SQL'dir.**

1.  **SQL Otoritedir:** Lokal veriler (JSON/Cache) asla SQL'den gelen veriyi ezemez.
2.  **Atomik Güncelleme:** Veritabanı "OK" demeden UI güncellenmez.
3.  **Hiyerarşi:** Tüm modüller bu anayasaya bağlıdır:
    - [[entities/mutfak_modulu|🍲 Mutfak]], [[entities/finans_ve_kasa|💎 Finans]], [[entities/saglik|🩺 Sağlık]], [[entities/sosyal_ve_etkinlikler|🎭 Sosyal]], [[entities/aracim|🚗 Aracım]], [[entities/ev_ve_yasam|🏠 Ev]], [[entities/pet|🐾 Pet]], [[entities/tatil|✈️ Tatil]], [[entities/hedefler|🏆 Hedefler]]

## 📁 Teknik Rehberler
- [[decisions/2_milat_mimari|📊 Teknik Mimari & SQL Sync]] (SSOT Kuralları)
- [[concepts/ios_standartlari|📱 iOS Tasarım ve Test Standartları]]
- [[sources/codebase|💻 React Codebase (v4.0.0)]]
- [[concepts/merkezi_state_yonetimi|⚙️ State Yönetimi (Zustand)]]

## 🧠 Meta: İkinci Beyin Nasıl Çalışır?
1. **Obsidian** resmi bilgi yönetim merkezidir.
2. `KnowledgePipeline` klasörü, kodla senkronize yaşayan ana bilgi deposudur.
3. **Loglar:** [[log|Günlük Değişim Logları]]

---
*Eraylar Hanem: Güvenli, Modüler ve iOS Öncelikli.* 🛡️🏦✨
