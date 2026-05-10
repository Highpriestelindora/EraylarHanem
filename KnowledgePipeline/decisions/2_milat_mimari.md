# Eraylar Hanem — Teknik Mimari (2. Milat) 🏛️📊

Bu doküman, uygulamanın %100 SQL tabanlı SSOT yapısının detaylarını ve veritabanı şemasını açıklar.

## 🗄️ SQL Tablo Yapısı (Supabase)

Tüm domain verileri bağımsız tablolarda saklanır. JSON alanı sadece sistem metadata'sı içindir.

### 1. Finans Modülü 💳
- `finans_harcamalar`: Tüm harcama kayıtları.
- `finans_kartlar`: Kredi kartı tanımları ve limitleri.
- `finans_krediler`: Borç ve taksit takibi.
- `finans_onay_havuzu`: Onay bekleyen (otomatik/manuel) harcamalar.
- `finans_ayarlar`: `id='limitler'` verisi burada JSONB olarak saklanır.
- `finans_rekuranslar`: Düzenli ödemelerin şablonları.

### 2. Kasa & Nakit 💰
- `kasa_bakiyeler`: Kişi bazlı nakit bakiye kayıtları.
- `kasa_ayarlar`: `id='doviz_kurlari'` ve `id='gizlilik_modu'` verileri.
- `kasa_kumbaralar`: Hedeflenen para birikimleri.

### 3. Mutfak & Stok 🍏
- `mutfak_stok`: Tüm envanter (miktar, birim, min_stok).
- `mutfak_tarifler`: Yemek tarifleri ve içerikleri.
- `mutfak_menu`: Haftalık yemek planı.
- `mutfak_sohbet`: Buzdolabı üzerindeki dijital notlar/mesajlar.
- `mutfak_su`: Su sipariş ve seviye takibi.

### 4. Tatil & Seyahat ✈️
- `tatil_seyahatler`: Planlanan ve kesinleşen tüm geziler.
- `tatil_belgeler`: Pasaport, vize ve uçak bileti metadata'ları.

### 5. Sağlık 🩺
- `saglik_olcumler`: Tansiyon, kilo, şeker vb.
- `saglik_randevular`: Doktor ve hastane randevuları.
- `saglik_ayarlar`: `id='uyku_hedefleri'` verisi.

## 🔄 Veri Akış Diyagramı (SSOT)

```mermaid
graph TD
    User([Kullanıcı]) -- Aksiyon --> Store[useStore.js]
    Store -- 1. Atomic Push --> SQL[(Supabase SQL)]
    SQL -- 2. Confirmation --> Store
    Store -- 3. UI Update --> UI[React UI]
    Store -- 4. Shadow Write --> JSON[(System JSON)]
```

## 🛡️ Veri Güvenliği (RLS)
Her tablo `family_id` ve `user_id` üzerinden RLS (Row Level Security) ile korunmaktadır. Kullanıcılar sadece kendi ailelerine ait verileri görebilir ve değiştirebilir.

---
*2. Milat mimarisi, Eraylar Hanem'in ölçeklenebilir ve sağlam geleceğinin garantisidir.* 🛡️🏦✨
