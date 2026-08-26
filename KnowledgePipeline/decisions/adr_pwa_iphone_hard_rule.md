---
type: decision
tags: [decision, adr, mobile, ios, pwa, hard-rule]
date: 2026-08-27
status: accepted
---

# 📱 ADR: PWA & iPhone Uyumluluğu Zorunlu Hard Kural

## 🎯 Bağlam ve Gerekçe
Eraylar Hanem uygulamasının birincil ve günlük kullanım mecrası **iPhone (PWA - Standalone & Safari)**'dir. Masaüstü görünümünün yanında, geliştirilen her yeni özelliğin ve arayüz bileşeninin iPhone ekranlarında (iPhone SE'den iPhone 16 Pro Max'e kadar) kusursuz çalışması, hiçbir içeriğin taşmaması, butonların kırpılmaması ve dokunmatik etkileşimlerin tam optimize olması zorunludur.

## 🏛️ Alınan Karar (Hard Rule)
İkinci Beyin ve AI geliştirme süreçlerinde şu kurallar **ASLA ATLANAMAZ VE TAVİZ VERİLEMEZ (HARD RULE)** olarak tescil edilmiştir:

1. **iPhone & PWA Uyumluluğu Zorunluluğu:**
   - Yazılan her bileşen, modal, tablo ve form iPhone dikey ekranında test edilmiş ve uyumlu olmalıdır.
2. **iOS Safe Area & Viewport:**
   - `env(safe-area-inset-top)` ve `env(safe-area-inset-bottom)` tam korunur.
   - Modallar `Portal` (`src/components/Portal.jsx`) ile render edilir.
3. **Dokunmatik & Tipografi:**
   - Minimum 44x44px dokunma hedefi.
   - Safari auto-zoom engellemek için input `font-size: 16px`.
   - Butonlarda `-webkit-tap-highlight-color: transparent`.
4. **Dialog ve Uyarılar:**
   - `window.confirm` / `window.alert` kesinlikle yasaktır, `ConfirmModal` kullanılır.
5. **Geliştirici Kuralları:**
   - Bu kural `AGENTS.md`, `GEMINI.md`, `CLAUDE.md` ve `.agents/rules/pwa-iphone-compatibility.md` dosyalarında daima aktif tutulur.
