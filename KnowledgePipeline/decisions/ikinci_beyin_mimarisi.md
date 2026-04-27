# ADR: İkinci Beyin (Second Brain) Mimarisi ve Bilgi Boru Hattı

* **Tarih**: 2026-04-27
* **Durum**: Kabul Edildi (Milat)
* **Karar Verici**: Kullanıcı & Antigravity

## Bağlam (Context)
Uygulama geliştirme süreci ilerledikçe öğrenilen yeni bilgilerin, teknik detayların ve modüler yapının kaybolmaması için merkezi bir bilgi yönetim sistemine ihtiyaç duyulmuştur.

## Karar (Decision)
1. **Obsidian** resmi "İkinci Beyin" (Second Brain) olarak kabul edilmiştir.
2. `KnowledgePipeline` klasörü, bu bilginin kodla senkronize kaldığı ana merkezdir.
3. Her yeni teknik öğrenim (Milat sonrası) bu pipeline üzerinden geçmek zorundadır.
4. Kodun canlı versiyonu `https://github.com/Highpriestelindora/EraylarHanem` referans alınarak geliştirilecektir.

## Sonuçlar (Consequences)
* **Olumlu**: Bilgi kaybı önlenir, yapay zeka (Antigravity) projenin geçmişini ve mantığını daha iyi kavrar.
* **Olumlu**: Yeni modüller eklenirken eski kararlarla çelişki yaşanmaz.
* **Dikkat**: Her kod değişikliğinde dökümantasyonun da güncellenmesi ek bir efor gerektirir.
