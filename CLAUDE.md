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
- **iOS Öncelikli Tasarım**: Uygulama her zaman iPhone 15 Pro simülatörü (`/iphone15.html`) üzerinden test edilmelidir. Safe area ve dynamic island uyumu kritiktir.
- **Silme Kuralı (Deletion Rule)**: Herhangi bir veriyi silerken STANDART tarayıcı uyarısı (`window.confirm`) KESİNLİKLE kullanılmamalıdır. Bunun yerine HER ZAMAN `src/components/ConfirmModal.jsx` bileşeni kullanılmalı ve silme işlemi bir onay modalı üzerinden gerçekleştirilmelidir.
- **State Yönetimi**: Global state için Zustand kullanılır. Karmaşık state'ler JSONB olarak Supabase'de tutulur.

## 🚀 Milat (2026-04-27)
- Projenin canlı versiyonu: https://github.com/Highpriestelindora/EraylarHanem
- Bu tarihten itibaren tüm geliştirmeler "Second Brain" disipliniyle takip edilecektir.
