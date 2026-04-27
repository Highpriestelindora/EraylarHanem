# 🌐 API ve Supabase Yapısı

Uygulama, verilerini bulutta saklamak ve cihazlar arası senkronizasyon sağlamak için **Supabase** (PostgreSQL tabanlı) kullanır.

## 🔗 Supabase Bağlantısı

Bağlantı ayarları `.env` dosyasında tutulur:
- `VITE_SUPABASE_URL`: Proje URL'i.
- `VITE_SUPABASE_ANON_KEY`: Anonim erişim anahtarı.

## 🗄️ Veritabanı Tabloları

### `app_state` Tablosu
Uygulamanın tüm verisi bu tablodaki tek bir satırda (veya kullanıcı bazlı satırlarda) JSON formatında tutulur.
- **Sütunlar:** `id`, `user_id`, `data` (JSONB), `updated_at`.

## 📡 Dış API'ler

Uygulama bazı modüllerde dış servislerden veri çeker:

### 🌦️ Hava Durumu (Open-Meteo)
- **Kullanıldığı Yer:** Tatil Modülü.
- **İşlev:** Gezi planlanan şehirlerin hava durumu tahminlerini çeker.
- **URL:** `api.open-meteo.com/v1/forecast`

### 🗺️ Harita Verileri (OpenStreetMap / Leaflet)
- **Kullanıldığı Yer:** Tatil Modülü (Harita Tabı).
- **İşlev:** Gezilen yerlerin koordinatlarını harita üzerinde görselleştirir.

## 🔄 Realtime Abonelik
`useStore.js` içindeki `subscribeToSupabase` fonksiyonu, veritabanındaki her değişikliği dinler. Eğer başka bir telefon/bilgisayar veri girişi yaparsa, uygulama sayfa yenilemeden bu veriyi çeker ve arayüzü günceller.
