---
type: concept
tags: [design, mobile, ios, ui, ux, testing]
date: 2026-05-10
status: unified
---

# 📱 iOS Geliştirme ve Tasarım Standartları

Eraylar Hanem uygulamasının ana kullanım mecrası **iPhone** olduğu için, tüm geliştirme ve tasarım süreçleri iOS öncelikli bir disiplinle yürütülür.

## 🎨 Tasarım İlkeleri (Premium UX)
- **Emoji Odaklı:** Navigasyon ve içeriklerde zengin emoji kullanımı ile sıcak bir atmosfer.
- **Glassmorphism:** Buzlu cam efektli (Glass) kartlar ve panellerle premium his.
- **Premium Renk Paleti:** Her modül için özel belirlenmiş gradient ve gölge setleri.
- **Mikro Animasyonlar:** Yumuşak sayfa geçişleri ve etkileşimli geri bildirimler.

## 🛠️ Teknik Uyumluluk Kuralları
1.  **Safe Area (Çentik):** Üst banner ve alt navigasyon, iPhone çentiği ile çakışmayacak şekilde `env(safe-area-inset-*)` kullanılarak korunmalıdır.
2.  **Dokunmatik Alanlar:** Tıklanabilir alanlar en az 44x44px olmalıdır.
3.  **Z-Index & Modals:** iOS Safari katmanlama sorunları için modallar `React Portal` ile render edilmelidir.
4.  **Formlar:** Otomatik zoom'u engellemek için font size en az `16px` olmalıdır.

## 🧪 Test ve Onay Süreci
Hiçbir özellik, iOS (iPhone) üzerinde aşağıdaki kontrollerden geçmeden yayına alınamaz:
- **Safari Mobil Uyumluluk:** CSS Flex/Grid yapıları Safari motorunda kontrol edilir.
- **PWA Uyumluluğu:** "Add to Home Screen" sonrası tam ekran deneyimi test edilir.
- **Swipe Back:** iOS sistem geri hareketinin uygulama akışını bozmadığı doğrulanır.
