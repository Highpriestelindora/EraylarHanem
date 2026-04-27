# 🧩 Ortak Bileşenler (Shared Components)

Uygulama genelinde tutarlılığı sağlamak için kullanılan temel UI bileşenleri `src/components/` klasöründe yer alır.

## 📦 Temel Bileşenler

### 🎭 AnimatedPage
- **Dosya:** `src/components/AnimatedPage.jsx`
- **İşlev:** Sayfa geçişlerinde pürüzsüz "Fade-in" ve kayma efektleri sağlar. **Framer Motion** kullanır.

### 📝 ActionSheet
- **Dosya:** `src/components/ActionSheet.jsx`
- **İşlev:** Ekranın altından açılan (iOS tarzı) modern form ve detay pencereleridir. Modalların yerine daha mobil dostu bir deneyim sunar.

### ⚠️ ConfirmModal
- **Dosya:** `src/components/ConfirmModal.jsx`
- **İşlev:** Silme veya onaylama gibi kritik işlemlerden önce kullanıcıdan teyit alır.

### 🚪 Portal
- **Dosya:** `src/components/Portal.jsx`
- **İşlev:** Modalların ve ActionSheet'lerin HTML hiyerarşisinde en üstte (Root dışında) render edilmesini sağlayarak z-index sorunlarını çözer.

### 🏗️ Navbar (FloatingHub)
- **Dosya:** `src/components/FloatingHub.jsx`
- **İşlev:** Uygulamanın en altındaki ana navigasyon merkezidir. Pet asistanı, bildirimler ve ana menü butonlarını içerir.

## 🎨 Tasarım Prensipleri
- **Glassmorphism:** Arka planlarda `backdrop-filter: blur()` ve yarı şeffaf beyaz/siyah tonları kullanılır.
- **Premium Dark:** Ana tema koyu mor (`#2E1065`) ve derin lacivert tonları üzerine kuruludur.
- **Vurgu Renkleri:** Her modülün kendine ait bir CSS değişkeni (`--mutfak`, `--tatil` vb.) vardır.
