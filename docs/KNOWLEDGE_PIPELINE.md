# Eraylar Hanem - Second Brain Knowledge Pipeline & Architecture

Bu doküman, Eraylar Hanem uygulamasının **Supabase SQL tablolarını** ve bağlı oldukları **React Modüllerini** teknik detayları ve bağlamlarıyla açıklamaktadır. "Second Brain" (İkinci Beyin) mimarisine uygun olarak, tüm kalıcı hafıza bu tablolar üzerinden yönetilmektedir.

---

## 💰 Finans Modülü (Finans.jsx)
Uygulamanın kalbi olan Finans modülü, nakit, havale, kredi kartı ve taksit işlemlerini V2 online-first mimarisiyle işler.
* **`finans_harcamalar`**: Sisteme işlenmiş (onaylanmış) tüm harcama kalemleri. Kasa ve limitlerden düşülen ana veridir.
* **`finans_onay_havuzu`**: Diğer modüllerden (Tatil, Pet vb.) eklenen ancak henüz ödenme türü (Hangi kart veya kasa) seçilmemiş *bekleyen* işlemler.
* **`finans_kartlar`**: Aile üyelerine ait tüm kredi kartlarının (limit, hesap kesim, son ödeme günleri) saklandığı tablo.
* **`finans_kart_odemeler`**: Kredi kartlarına yapılan ödeme işlemlerinin kayıtları.
* **`finans_taksitler`**: Kredi kartlarına bağlı veya bağımsız taksit planlarının her ay güncel borca yansıyan kayıtları.
* **`finans_krediler`**: Kredilerin (İhtiyaç/Taşıt/Konut) ana para ve aylık ödeme planlarının kaydı.

## 🏖️ Tatil Modülü (Tatil.jsx)
Eraylar ailesinin seyahat planlaması, bütçelemesi ve dijital bellek yönetimi.
* **`tatil_trips`**: Planlanan veya tamamlanan seyahatlerin ana kimlikleri (Başlangıç/Bitiş tarihi, lokasyon, rota haritası).
* **`tatil_wishlist`**: Seyahat öncesi "alınacaklar/görülecekler" istek listesi.
* **`tatil_pasaport`**: Görkem ve Esra'nın pasaport bilgileri ve geçerlilik tarihleri.
* **`tatil_vize`**: Aktif vizelerin veya vize başvuru süreçlerinin takibi.
* *Bağlam:* Harcamalar, Tatil sayfası üzerinden `finans_onay_havuzu`na gönderilir.

## 🐾 Pet Modülü (Pet.jsx)
Waffle ve Mayıs'ın sağlık, aşı ve günlük yaşantılarının kaydedildiği modül.
* **`pet_asilar`**: Veteriner ziyaretleri ve uygulanan aşı takvimleri.
* **`pet_agirlik`**: Kilo değişim grafiği verileri.
* **`pet_gunluk`**: Pet günlük notları (sağlık/bakım logları).

## 🍽️ Mutfak Modülü (Mutfak.jsx)
Evin erzağını, menülerini ve alışveriş listesini akıllıca yöneten sistem.
* **`mutfak_stok`**: Evde bulunan mevcut erzak/malzeme envanteri.
* **`mutfak_su`**: Damacana/su sipariş döngüsü.
* **`mutfak_tarifler`**: Ailenin favori yemek tarifleri ve malzemeleri.
* **`mutfak_menu`**: Haftalık yemek planı (Sabah, Öğle, Akşam, Ara Öğün).
* **`alisveris_listesi`**: Eksilen stoklardan otomatik veya manuel oluşturulan market listesi.
* **`mutfak_sohbet`**: Mutfak ekranında aile içi bırakılan notlar/sohbet mesajları.

## 🚗 Garaj Modülü (Garaj.jsx)
Araç bakım, yakıt ve resmi belge takip sistemi.
* **`garaj_araclar`**: Eray ailesine ait araçların (veya favori araçların) profil bilgileri.
* **`garaj_yakit`**: Akaryakıt alımları, litre ve maliyet geçmişi.
* **`garaj_servis`**: Periyodik bakım, parça değişimi ve servis notları.
* **`garaj_belgeler`**: Kasko, Sigorta ve Muayene poliçe tarihleri/uyarıları.
* **`garaj_park`**: Aracın en son park edildiği konum (Harita destekli).

## 🏥 Sağlık Modülü (Saglik.jsx)
Ailenin medikal geçmişi, randevuları ve günlük rutin sağlık verileri.
* **`saglik_ilaclar`**: Düzenli kullanılan ilaçlar, dozajları ve alarm zamanları.
* **`saglik_randevular`**: Hastane/Doktor randevu takvimi.
* **`saglik_olcumler`**: Tansiyon, kan şekeri, nabız gibi hayati bulguların kronolojik kaydı.
* **`saglik_mood`**: Günlük ruh hali/psikoloji takibi.
* **`saglik_sleep`**: Uyku süresi ve kalitesi analizi.
* **`saglik_log`**: Genel sağlık notları ve semptom günlükleri.

## 🏠 Ev Modülü (Ev.jsx)
Konutun fiziksel durumunu, faturalarını ve demirbaşlarını takip eden bölüm.
* **`ev_duzenli_odemeler`**: Kira, aidat, internet gibi sabit aylık giderler.
* **`ev_abonelikler`**: Netflix, Spotify gibi dijital platform üyelikleri.
* **`ev_onarim`**: Evde bozulan veya tamir gerektiren şeylerin listesi.
* **`ev_demirbaslar`**: Beyaz eşya, mobilya garanti ve model bilgileri.
* **`ev_bakimlar`**: Kombi, klima gibi sistemlerin yıllık bakım takvimi.

## 🎯 Hedefler Modülü (Hedefler.jsx)
Ailenin kısa ve uzun vadeli gelişim, vizyon ve başarı metrikleri.
* **`hedefler_aktif`**: Üzerinde çalışılan mevcut hedefler (OKR stili).
* **`hedefler_gecmis`**: Tamamlanmış ve başarılmış hedeflerin arşivi.
* **`hedefler_vizyon`**: 1 Yıllık / 5 Yıllık genel aile vizyon panosu.
* **`hedefler_habits`**: Kazanılmaya çalışılan günlük/haftalık alışkanlıklar.

## 💼 Kasa Modülü (Kasa.jsx)
Toplam varlık, banka hesapları ve kripto/yatırım cüzdanları.
* **`kasa_bakiyeler`**: Nakit (Cüzdan) paraların tutulduğu alan.
* **`kasa_banka_hesaplari`**: Tüm vadesiz ve vadeli banka hesaplarının anlık bakiye yansımaları.
* **`kasa_yatirim_cuzdan`**: Kripto (ETHFI vb.), hisse senedi ve döviz varlıklarının portföyü.

## 🧠 İkinci Beyin & Profesyonel Yaşam
* **`muhendislik_problem` & `muhendislik_decision`**: Yazılım ve sistem mühendisliği sorun/karar kayıtları.
* **`crm_customer` & `crm_deal`**: İş geliştirme, müşteri ve teklif takibi.
* **`zihni_proce` & `life_routine`**: Kişisel gelişim ve günlük hayat rutin otomasyonları.

---
*Görkem & Esra Eray © 2026 - Tüm modüller online-first prensibiyle Supabase SQL üzerinden tekil doğru kaynak (Single Source of Truth) olarak çalışmaktadır.*
