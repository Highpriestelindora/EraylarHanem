# Eraylar Hanem Project Rules

## 🧠 Second Brain (İkinci Beyin) - Obsidian & Knowledge Pipeline
- **Ana Kural**: Obsidian, bu projenin "İkinci Beyni"dir. Tüm mimari kararlar, yeni öğrenilen teknikler ve modül detayları `KnowledgePipeline` klasörü altında dökümante edilmelidir.
- **Dökümantasyon Akışı**: 
    1. **Ingest**: Kodda yapılan önemli değişiklikler Obsidian vault'una (`KnowledgePipeline`) yansıtılır.
    2. **Sync**: Obsidian'da alınan kararlar veya güncellenen bilgiler koda (özellikle state ve sabitler) yansıtılır.
- **Klasör Yapısı**:
    - `concepts/`: Teknik kavramlar (Zustand, iOS design vb.)
    - `decisions/`: Mimari kararlar (ADR - Architecture Decision Records)
    - `entities/`: Modül detayları (Mutfak, Finans vb.)
    - `sources/`: Kaynak dökümanlar ve codebase referansları

## 🛠️ Teknik Kurallar
- **Git Komutu**: Git işlemleri için HER ZAMAN şu tam yol kullanılmalıdır: `& "C:\Users\Administrator\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe"`
- **Kural**: Git komutu bulunamadığında veya hata alındığında başka yer arama, direkt bu dosyadaki (`CLAUDE.md`) yolu kullan.
- **iOS Öncelikli Tasarım**: Uygulama her zaman iPhone 14 Pro Max ve iPhone 15 baz alınarak tasarlanmalıdır. Safe area inset kurallarına DOKUNULMAZ — AppLayout.css'de doğru kurulmuş halde bırakılır.
- **Silme Kuralı (Deletion Rule)**: Herhangi bir veriyi silerken STANDART tarayıcı uyarısı (`window.confirm`) KESİNLİKLE kullanılmamalıdır. Bunun yerine HER ZAMAN `src/components/ConfirmModal.jsx` bileşeni kullanılmalı ve silme işlemi bir onay modalı üzerinden gerçekleştirilmelidir.
- **State Yönetimi**: Global state için Zustand kullanılır. Karmaşık state'ler JSONB olarak Supabase'de tutulur.

## 🚀 Git Push Anayasası (2026-05-21)
- **Vercel `main` branch'ini deploy eder.** AI agent `dark-zone-sails-17h47` branch'inde çalışır.
- **"git push" her zaman İKİ adım demektir:**
    1. `git push` → aktif branch'e (dark-zone-sails-17h47)
    2. `git -C "C:/Users/gorke/OneDrive/Masaüstü/Eraylar Hanem Moduler" merge dark-zone-sails-17h47` + `git push origin main` → Vercel'in gördüğü main branch'e
- **Bu iki adım ASLA atlanamaz.** Sadece dark-zone-sails-17h47'ye push edilirse değişiklikler canlıya yansımaz.
- **Tek satır komut:**
    ```
    git push; git -C "C:/Users/gorke/OneDrive/Masaüstü/Eraylar Hanem Moduler" merge dark-zone-sails-17h47; git -C "C:/Users/gorke/OneDrive/Masaüstü/Eraylar Hanem Moduler" push origin main
    ```

## 🚀 Milat (2026-04-27)
- Projenin canlı versiyonu: https://github.com/Highpriestelindora/EraylarHanem
- Bu tarihten itibaren tüm geliştirmeler "Second Brain" disipliniyle takip edilecektir.

