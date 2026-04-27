---
type: source
tags: [code, react, architecture]
source: [[src/App.jsx]]
date: 2026-04-27
status: stable
---

# Source: React Codebase (v2.7.1)

Eraylar Hanem uygulamasının çekirdek kod tabanı. 

## Teknik Yığın (Tech Stack)
- **Frontend:** React (Vite)
- **State Yönetimi:** Zustand + Persist Middleware
- **Backend/DB:** Supabase (Single-table JSONB storage)
- **Stil:** Vanilla CSS (Modül bazlı)
- **Bildirimler:** Custom `notificationService`

## Mimari Desenler
- **Merkezi Depo:** `src/store/useStore.js` tüm uygulama durumunu yönetir.
- **Gerçek Zamanlı Senkronizasyon:** Supabase `postgres_changes` kanalı üzerinden anlık güncelleme.
- **Offline-First:** `persist` middleware ile yerel depolama ve online olduğunda senkronizasyon.

## İlgili Sayfalar
- [[concepts/merkezi_state_yonetimi]]
- [[concepts/senkronizasyon_stratejisi]]
- [[concepts/ios_oncelikli_tasarim]]
