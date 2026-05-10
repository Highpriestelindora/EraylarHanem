---
type: concept
tags: [architecture, state, zustand, supabase, sql]
date: 2026-05-10
status: isolated
---

# Concept: Merkezi State Yönetimi (Zustand & Supabase)

Eraylar Hanem'in tüm veri akışı, `src/store/useStore.js` dosyasında tanımlanan merkezi bir depo (store) üzerinden yönetilir.

## 🧱 Teknoloji Yığını
- **Zustand:** Uygulama içi hızlı state yönetimi.
- **Supabase:** Bulut veritabanı ve gerçek zamanlı senkronizasyon.

## 🔄 Senkronizasyon Mimarisi
Uygulama, **Legacy JSON** (Shadow Writes) ve **Modern SQL** yaklaşımlarını hibrit olarak kullanır. Kritik modüller (Finans, Hedefler, Sağlık) direkt SQL tablolarına yazılırken, tüm state bir bütün olarak JSON formatında da yedeklenir.

Detaylı kurallar için ana sayfadaki **2. Milat Anayasası** bölümüne bakınız.

## 🛠️ Temel İşlemler
- **Yerel Değişiklik:** Zustand state'i anında güncellenir (Optimistic UI).
- **Sync Katmanı:** `initSync()` ve `subscribeToSupabase()` ile bulut-yerel senkronizasyonu sağlanır.

## 💡 Önemli Fonksiyonlar
- `addExpense()`: Finans ve kasa bakiyelerini koordineli günceller.
- `luckyFill()`: Mutfak modülü "Şanslı Hisset" algoritmasını çalıştırır.
- `pushToSupabase()`: Verileri buluta gönderir.
