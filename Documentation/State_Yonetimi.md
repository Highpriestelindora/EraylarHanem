# ⚙️ State Yönetimi (Zustand & Supabase)

Uygulamanın kalbi `src/store/useStore.js` dosyasıdır.

## 🌉 Veri Köprüsü
Uygulama, yerel durumu (Local State) ile bulut veritabanını (Supabase) senkronize etmek için hibrit bir yapı kullanır:

1. **Yerel Değişiklik:** Kullanıcı bir işlem yaptığında `set()` ile Zustand state'i anında güncellenir (UI anlık tepki verir).
2. **Arka Plan Senkronizasyonu:** `saveToSupabase()` fonksiyonu tetiklenerek veriler JSON formatında `eraylar_store` tablosuna `upsert` edilir.
3. **Gerçek Zamanlı Dinleme:** `subscribeToSupabase()` ile veritabanındaki değişiklikler anlık olarak yakalanır ve diğer cihazlardaki UI'lar güncellenir.

## 📦 Veri Yapısı
Tüm uygulama verisi tek bir JSON nesnesi içinde saklanır:
- `finans`: Harcamalar, borçlar, kartlar.
- `mutfak`: Menü, stoklar, tarifler.
- `kasa`: Bakiyeler ve varlıklar.
- `saglik/pet/tatil`: Diğer modül verileri.

## 🛠️ Önemli Fonksiyonlar
- `initSync()`: Uygulama açılışında verileri çeker.
- `luckyFill()`: [[Mutfak_Modulu#Şanslı-Hisset|Şanslı Hisset]] algoritmasını çalıştırır.
- `addExpense()`: Finans ve kasa bakiyelerini koordineli günceller.
