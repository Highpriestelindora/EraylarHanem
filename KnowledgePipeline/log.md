# Knowledge Pipeline Log

## [2026-04-27] init | Vault yapısı kuruldu ve CLAUDE.md anayasası oluşturuldu.
## [2026-04-27] ingest | Major Update: Tüm modüller (Finans, Sağlık, Sosyal, Araç, Ev, Pet, Tatil) teknik dökümleriyle birlikte sisteme işlendi.
## [2026-04-27] ingest | Mimari kavramlar (Zustand, Supabase Sync) ve kritik kararlar (ADR) dökümante edildi.
## [2026-04-27] sync | Obsidian'daki `ev_ve_yasam` güncellemesi koda işlendi: Gemini Advanced aboneliği sisteme eklendi.
## [2026-04-27] milat | Proje için "İkinci Beyin" (Second Brain) kuralı ve Obsidian entegrasyonu resmi olarak doğrulandı. Git path ve canlı repo referansları eklendi.
## [2026-04-27] upgrade | Alışveriş ve Tatil modüllerinde radikal UI küçültmesi (nazik tasarım) yapıldı. 
## [2026-04-27] upgrade | Tatil Modülü: "Keşif Kahini" ve "Vize & Pasaport Uyumluluk Asistanı" (6 ay kuralı + Otomatik Ülke Tespiti) devreye alındı.
## [2026-04-28] upgrade | Tatil Modülü: v2.30.0 — Harita HUD filtreleri, unique country istatistikleri ve bireysel macera filtreleme devreye alındı.
## [2026-04-28] upgrade | Ev Modülü: v3.0 — 5-tab navigasyon (Yaşam, Bakım, Abonelik, Taşınmaz, Güvenlik) ve Depo v3.5 envanter sistemi kuruldu.
## [2026-05-01] upgrade | v2.32.0 "Aristotle" — Finans Hub Entegrasyonu: Ev modülündeki aboneliklerin Finans'a bağlanması, Araç Piyasa Değeri takibi ve Kasa servet yönetimi stabilizasyonu tamamlandı. 
## [2026-05-01] upgrade | v2.32.1 — Sosyal Rutin UI: iPhone hizalama sorunları giderildi, 'Uygulama Tarihi' seçicisi kaldırılarak 'UYGULA' butonuna dinamik tarih seçimi (ActionSheet) eklendi.
## [2026-05-01] upgrade | v2.33.0 — Kasa Modülü Finalizasyonu: 4-sekme yapısı (Özet, Birikim, Taşınmaz, Kumbara) kuruldu. Finans modülünden borç verileri çekilerek Net Servet hesabı eklendi. Tüm varlık ve hedef yönetim butonları (Ekle/Düzenle/Transfer) aktif edildi.
## [2026-05-06] sync | Group 1 & 2 & 3 Supabase Migration: Mutfak, Sağlık, Alışveriş, Tatil, Sosyal, Ev, Pet, Garaj ve Finans modülleri tamamen SQL tabanlı "Online-First" mimariye taşındı. Zustand state'i Supabase ile real-time senkronize hale getirildi.
## [2026-05-06] upgrade | v4.0.0 "Socrates" — Visual Unification Phase: Tüm modüller için dinamik renkli başlık sistemi (AppLayout integration) devreye alındı. CSS çakışmaları (global .module-header overrides) temizlendi. Splash Screen aile/evcil hayvan odaklı komik/sevimli quetolarla güncellendi.
## [2026-08-23] fix | FloatingHub UI Refactor: "Hızlı Harcama" modalındaki CSS transform çakışması (translateX(-50%) ezilmesi ve sağa taşma) giderildi. Modal tam ortalandı, çift label kaldırıldı, input/kategori stilleri ve z-index hiyerarşisi iOS standartlarına uyarlandı.
## [2026-08-23] fix | Finans Geçmiş Aylar Toplamları: `finans_arsiv` tablosundaki boş/null veri sorunu giderildi. `useStore.js` (`fetchArsivFromSupabase` ve `ayKapat`) fonksiyonları gerçek tutar, kart/nakit/havale kırılımlarını ve kayıt sayılarını hesaplayacak şekilde güncellendi, Supabase arşivi backfill edildi ve UI (`Finans.jsx`) zenginleştirildi.
