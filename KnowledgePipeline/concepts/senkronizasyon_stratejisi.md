---
type: concept
tags: [architecture, sync, supabase]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Concept: Senkronizasyon Stratejisi

Eraylar Hanem, aile bireyleri arasında anlık veri paylaşımını sağlamak için gelişmiş bir senkronizasyon mekanizması kullanır.

## Mekanizma
1. **Supabase Channel:** `subscribeToSupabase` fonksiyonu, veritabanındaki değişiklikleri dinleyen bir kanal açar.
2. **Gerçek Zamanlı Güncelleme:** Eşlerden biri bir veri girdiğinde (Örn: harcama veya not), diğerinin ekranı sayfayı yenilemeye gerek kalmadan otomatik olarak güncellenir.
3. **Akıllı Bildirimler:** Senkronizasyon kanalı üzerinden gelen yeni veriler (harcama, mutfak notu vb.) eğer uygulama sessiz modda değilse kullanıcıya bildirim olarak sunulur.

## Veri Formatı
Veritabanında `eraylar_store` tablosunda `id: 1` olan satırda devasa bir **JSONB** objesi olarak tutulur. Bu, şema esnekliği sağlar.
