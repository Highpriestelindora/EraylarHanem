# Tatil Anıları – Yapılanlar Bölümü

## Özet
Tatil bitince `trip.notes` içindeki todo listesi (JSON `[{text, done}]` formatı) anı detayına taşınacak.
"Değerlendirmelerimiz" bölümünün **altına** yeni bir "✅ Yapılanlar" bölümü eklenecek.
Bu bölüm sonradan düzenlenebilir olacak.

## Önerilen Değişiklikler

### [MODIFY] Tatil.jsx

#### 1. `MemoryDetailView` altına `TripTodoMemory` bileşeni ekle (line ~3876)
- `trip.notes` içindeki todos'u parse et
- "Değerlendirmelerimiz" bloğunun **hemen altında** render et
- Yapılanlar ✅ / Yapılamayanlar ❌ olarak gruplanmış görünüm
- "Düzenle" butonu → inline editing (yeni madde ekle, text düzenle, done toggle)
- `updateTrip` ile kaydet

#### 2. `TripDetailContent` → `isCompleted` tetikleyince `activeSubTab` ayarı
- Tatil bittikten sonra "todo" sekmesi gizleniyor (zaten öyle), hiç değişmeyecek

### Veri Akışı
```
trip.notes (string JSON)
  ↓ parse
  [{text: "Belvedere Müzesi", done: true}, {text: "Sacher Pastası", done: false}]
  ↓ MemoryDetailView → TripTodoMemory bileşeni
  Yapılanlar    ✅: Belvedere Müzesi
  Yapılamayanlar ❌: Sacher Pastası
  ↓ Düzenle → updateTrip({notes: JSON.stringify(updated)})
```

## Doğrulama
- `npm run build` başarılı
- Viyana tatili anı detayında bölüm görünür
- Düzenlenebilir (toggle, yeni ekleme)
