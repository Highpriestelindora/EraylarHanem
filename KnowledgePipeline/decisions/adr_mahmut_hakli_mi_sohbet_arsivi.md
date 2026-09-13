---
type: decision
tags: [decision, adr, ai, pdf, chat-archive, mobile, pwa]
date: 2026-09-13
status: accepted
---

# ⚖️ ADR: "Mahmut Haklı mı" Sohbet Arşivi & %100 Dosya Doğrulama Sistemi

## 🎯 Bağlam ve Gerekçe
Kullanıcının `New folder` dizininde biriktirdiği 199 adet WhatsApp/ChatGPT ekran görüntüsü bulunmaktadır. Bu konuşmaların tek bir satırı veya mesajı bile atlanmadan, 1:1 orijinal çözünürlüğünde (1600x1000 HD) PDF belgesine dönüştürülmesi ve doğrudan iPhone (PWA/Safari) ve diğer mobil cihazlara indirilebilir olması talep edilmiştir.

Ayrıca kullanıcının dönüştürülen 199 adet görselin eksiksiz olduğunu teyit edebilmesi için %100 satır ve dosya kontrolünü listeleyen bir doğrulama sistemi istenmiştir.

## 🏛️ Alınan Karar ve Mimari Çözüm

1. **PDF Üretim Motoru (`scripts/generate_chat_pdf.cjs`):**
   - 199 adet ekran görüntüsü dosya adı ve zaman damgasına göre kronolojik sıralandı.
   - `pdf-lib` ve `@pdf-lib/fontkit` kullanılarak orijinal JPEG sıkıştırması korunarak 0 kalite kaybıyla 200 sayfalık (1 Kapak + 199 Görsel) Master PDF üretildi (`Mahmut_Hakli_mi_Sohbet_Arsivi.pdf`).
   - Kapak sayfasında doğrulama ve bütünlük beyanı, çözünürlük ve tarih bilgileri yer alır.

2. **Ayarlar Menüsü İki Özel Buton (`src/pages/Ayarlar.jsx`):**
   - **"Mahmut Haklı mı" Butonu:**
     - 44x44px üzeri dokunmatik alana sahip, gradient ve zıplayan indirme ikonu içeren birincil buton.
     - Tıklandığında iOS Safari ve PWA standartlarına uygun olarak `Mahmut_Hakli_mi_Sohbet_Arsivi.pdf` dosyasını doğrudan telefona indirir.
   - **"%100 Dosya Doğrulama" Butonu:**
     - `src/components/Portal.jsx` üzerinden açılan iOS Bottom Sheet / Modal.
     - 199 görselin her birinin sayfa numarası, dosya adı, saat damgası, dosya boyutu, piksel çözünürlüğü ve "%100 Doğrulandı" rozetini listeler.
     - Arama/filtreleme çubuğu ile sayfa veya dosya bazında anlık arama yapılabilir.
     - iOS auto-zoom engeli (input font-size: 16px) ve Safe Area (`env(safe-area-inset-bottom)`) kurallarına tam uyumludur.

3. **PWA Çevrimdışı Manifest Entegrasyonu:**
   - 199 dosyanın metadata bilgileri `src/constants/chatArchiveManifest.js` içerisinde statik olarak derlenmiş, internet bağlantısı olmadan bile PWA'da anında görüntülenebilir hale getirilmiştir.
