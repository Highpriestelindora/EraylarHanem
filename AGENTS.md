# Eraylar Hanem - Agent Guidelines & Hard Rules

## 🚨 HARD RULE: 100% PWA & iPhone Compatibility (MANDATORY)

**Her ne geliştirilirse geliştirilsin, her bileşen, modal, buton, layout ve akış KESİNLİKLE iPhone ve iOS PWA (Progressive Web App - Ana Ekrana Ekle) ile %100 uyumlu olmak ZORUNDADIR.**

### 1. iOS Safe Area & Viewport Kuralları
- Üst header, alt navigation bar, bottom sheet'ler ve floating butonlar çentik (Notch), Dinamik Ada (Dynamic Island) veya home indicator (alt çizgi) ile ASLA çakışmamalıdır.
- `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, `env(safe-area-inset-right)` kurallarına tam uyulmalıdır.
- Viewport yüksekliklerinde iOS Safari toolbar kaybolma durumları için `100dvh` veya `maxHeight: '85vh'` gibi esnek birimler kullanılmalıdır.

### 2. Dokunmatik & Etkileşim Standartları (iOS HIG)
- Tıklanabilir tüm alanlar (butonlar, ikonlar, sekmeler) en az **44x44px** dokunma hedefine sahip olmalıdır.
- Butonlarda `-webkit-tap-highlight-color: transparent;` ve `touch-action: manipulation;` tanımlanmalıdır.
- Kaydırılabilir alanlarda `-webkit-overflow-scrolling: touch;` kullanılmalıdır.
- Input odaklanmalarında iOS Safari'nin otomatik yakınlaştırmasını (auto-zoom) engellemek için metin giriş fontu **en az 16px** olmalıdır.

### 3. Modal, ActionSheet & Portallar
- iOS Safari'deki CSS transform / Framer Motion katmanlama (`stacking context`) ve `z-index` çakışmalarını önlemek için tüm modallar ve açılır pencereler **HER ZAMAN `Portal`** (`src/components/Portal.jsx`) ile render edilmelidir.
- Modallar küçük ekranlı iPhone'larda (iPhone SE / 13 mini - 375px genişlik) yatay veya dikey taşma yapmamalı, içerik `overflow-y: auto` ile rahatça kaydırılabilmelidir.

### 4. Silme ve Onay Akışları
- Standart tarayıcı `window.confirm` veya `window.alert` KESİNLİKLE kullanılmamalıdır (iOS PWA'da kötü deneyim oluşturur).
- Silme ve onay işlemleri HER ZAMAN `src/components/ConfirmModal.jsx` veya özel iOS bottom sheet üzerinden yapılmalıdır.

### 5. Responsive Grid & Dar Ekranlar
- Grid yapıları (özellikle 3-4 kolonlu buton grupları) 375px - 390px iPhone ekranlarında metinleri kesmemeli, taşma yapmamalı, gerekirse `flex-wrap` veya `auto-fit` ile esnemelidir.

---

## 🧠 Second Brain (İkinci Beyin) Entegrasyonu
- Mimari kararlar ve yeni standartlar `KnowledgePipeline/` altında dökümante edilmelidir.
- Yapılan değişiklikler İkinci Beyin disipliniyle takip edilir.
