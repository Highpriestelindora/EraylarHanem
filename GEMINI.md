# Eraylar Hanem - System Rules & Hard Constraints

## 🚨 KESİN KURAL: PWA iPhone & iOS Safari Uyumluluğu

Herhangi bir yeni özellik, arayüz bileşeni, modal, buton, tablo veya düzenleme eklenirken/değiştirilirken:

1. **iPhone & PWA İlk Önceliktir:** Tasarlanan ve yazılan her kod, iPhone (iOS Safari ve Standalone PWA modunda) kusursuz görünmeli ve çalışmalıdır.
2. **Safe Area Koruması:** `env(safe-area-inset-top)` ve `env(safe-area-inset-bottom)` tam uygulanmalıdır.
3. **Portal Kullanımı:** Tüm modallar ve ActionSheet'ler `src/components/Portal.jsx` üzerinden açılmalıdır.
4. **Dokunma Hedefleri:** Minimum 44x44px dokunma alanı ve `-webkit-tap-highlight-color: transparent`.
5. **Auto-zoom Engeli:** Input font boyutu en az 16px.
6. **window.confirm Yasağı:** Silme/onay için `ConfirmModal.jsx` zorunludur.
7. **Mobil Grid Esnekliği:** 375px–393px iPhone ekranlarında hiçbir buton veya metin taşmamalı / kesilmemelidir.
