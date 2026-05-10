---
type: source
tags: [code, react, architecture]
date: 2026-05-10
status: updated
---

# Source: React Codebase (v4.0.0)

Eraylar Hanem uygulamasının çekirdek kod tabanı ve mimari desenleri.

## 🧱 Teknik Yığın (Tech Stack)
- **Frontend:** React (Vite tabanlı)
- **State Yönetimi:** Zustand (Merkezi Store)
- **Veritabanı:** Supabase (PostgreSQL + Realtime Sync)
- **Stil:** Vanilla CSS (iOS Öncelikli)

## 🔄 Mimari Desenler
- **Merkezi Depo:** `src/store/useStore.js` tüm uygulama durumunu ve senkronizasyon mantığını yönetir.
- **SSOT Mimari:** Veriler modül bazlı SQL tablolarında saklanır. Detaylar için [[decisions/2_milat_mimari|Teknik Mimari]] dökümanına bakınız.
- **iOS Standartları:** Tasarım ve test süreçleri [[concepts/ios_standartlari|iOS Geliştirme Standartları]] uyarınca yürütülür.

## 📁 Ana Dosya Yapısı
- `src/pages/`: Modül bazlı sayfalar.
- `src/store/useStore.js`: Ana state ve SSOT push/fetch fonksiyonları.
- `src/lib/supabase.js`: Veritabanı bağlantı yapılandırması.
