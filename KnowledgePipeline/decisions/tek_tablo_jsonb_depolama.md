---
type: decision
tags: [architecture, storage, supabase]
source: [[sources/codebase]]
date: 2026-04-27
status: stable
---

# Decision: Tek Tablo JSONB Depolama

## Konteks
Uygulamanın verileri çok çeşitli ve sürekli evriliyor (Mutfak, Finans, Pet vb.). Her modül için ayrı tablolar oluşturmak veritabanı şemasını yönetmeyi zorlaştırıyordu.

## Karar
Tüm uygulama durumunu (state) tek bir JSON objesi olarak Supabase üzerindeki `eraylar_store` tablosunda saklamaya karar verdik.

## Gerekçe
1. **Şema Esnekliği:** Yeni bir modül veya özellik eklendiğinde veritabanında sütun eklemeye gerek kalmaz.
2. **Kolay Senkronizasyon:** Tek bir objeyi çekmek ve push etmek, çoklu tablo join işlemlerinden daha hızlı ve basittir.
3. **Zustand Uyumu:** Zustand'ın tüm state'i bir obje olarak tutma yapısıyla tam örtüşür.

## Sonuçlar
- Veri boyutu arttıkça `localStorage` limitlerine dikkat edilmesi gerekir.
- Fotoğraflar gibi ağır veriler yerel depolamadan filtrelenerek gönderilir.
