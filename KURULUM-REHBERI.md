# 🏡 Eraylar Hanesi - Kurulum Rehberi

Bu rehberi adım adım takip ederek uygulamanızı 10 dakikada kurup çalıştırabilirsiniz.
Toplam 3 adım var. Hiçbir kodlama bilgisi gerekmez!

---

## 📌 ADIM 1: Firebase Projesi Oluştur (5 dakika)

Firebase, Google'ın ücretsiz veritabanı servisi. Verileriniz burada saklanacak ve iki telefon arasında anlık senkron olacak.

### 1.1 Firebase'e Git
- Tarayıcıdan şu adrese git: **https://console.firebase.google.com**
- Google hesabınla giriş yap (ikisi için ortak bir hesap kullanabilirsiniz)

### 1.2 Yeni Proje Oluştur
- **"Proje oluştur"** (Create a project) butonuna tıkla
- Proje adı olarak **"eraylar-hanesi"** yaz
- Google Analytics'i **kapat** (gerekmez) → **"Proje oluştur"** de
- Proje hazır olunca **"Devam"** de

### 1.3 Realtime Database Aç
- Sol menüden **"Build"** → **"Realtime Database"** seç
- **"Create Database"** (Veritabanı oluştur) tıkla
- Konum olarak **"europe-west1"** seç (Türkiye'ye en yakın) → **"İleri"**
- **"Test modunda başla"** seç → **"Etkinleştir"**
- ✅ Veritabanı hazır!

### 1.4 Web Uygulaması Ekle ve Ayarları Kopyala
- Sol üstteki ⚙️ (dişli) simgesine tıkla → **"Proje Ayarları"**
- Aşağı kaydır → **"Uygulamalarınız"** bölümünde **"</>"** (Web) simgesine tıkla
- Uygulama adı olarak **"eraylar"** yaz → **"Uygulamayı kaydet"**
- Ekranda **firebaseConfig** göreceksin. Bu bilgileri kopyala:

```
apiKey: "AIza...........",
authDomain: "eraylar-hanesi.firebaseapp.com",
databaseURL: "https://eraylar-hanesi-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "eraylar-hanesi",
storageBucket: "eraylar-hanesi.appspot.com",
messagingSenderId: "123456789",
appId: "1:123456789:web:abcdef123456"
```

### 1.5 Bu Bilgileri Uygulamaya Yaz
- İndirdiğin dosyalardaki **index.html** dosyasını bir metin editöründe aç (Not Defteri bile olur)
- Dosyanın başında şunu bul:

```javascript
const firebaseConfig = {
  apiKey: "BURAYA_API_KEY",
  authDomain: "BURAYA_AUTH_DOMAIN",
  ...
```

- Yukarıdaki `BURAYA_...` yazan yerleri Firebase'den kopyaladığın gerçek bilgilerle değiştir
- Dosyayı kaydet

---

## 📌 ADIM 2: Uygulamayı İnternete Yükle (3 dakika)

Netlify, ücretsiz web hosting servisi. Dosyaları sürükle-bırak yapacaksın, o kadar.

### 2.1 Netlify'a Git
- Tarayıcıdan **https://app.netlify.com/drop** adresine git
- Hesap açmana bile gerek yok!

### 2.2 Dosyaları Yükle
- İndirdiğin **eraylar** klasörünü olduğu gibi sayfadaki kutuya **sürükle-bırak** yap
- Klasörde şu dosyalar olmalı:
  - `index.html`
  - `manifest.json`
  - `icon-192.png`
  - `icon-512.png`
- Birkaç saniye bekle...
- ✅ Sana bir link verecek, örneğin: `https://amazing-abc123.netlify.app`

### 2.3 (İsteğe Bağlı) Linki Özelleştir
- Netlify'da ücretsiz hesap açarsan linki değiştirebilirsin
- Örneğin: `https://eraylar.netlify.app`

---

## 📌 ADIM 3: Telefonlara Yükle (2 dakika)

### iPhone için:
1. **Safari**'den Netlify linkini aç (Chrome değil, Safari olmalı!)
2. Alttaki **paylaş butonu** (↑ kare simgesi) tıkla
3. **"Ana Ekrana Ekle"** seç
4. İsmi "Eraylar" yap → **"Ekle"**
5. ✅ Ana ekranda uygulama ikonu oluştu!

### Android için:
1. **Chrome**'dan Netlify linkini aç
2. Otomatik olarak **"Ana ekrana ekle"** çıkabilir, çıkarsa kabul et
3. Çıkmazsa: sağ üstteki **⋮** menü → **"Ana ekrana ekle"**
4. ✅ Ana ekranda uygulama ikonu oluştu!

---

## 🎉 Tamamlandı!

Artık:
- İki telefondan da uygulamayı açabilirsiniz
- Görkem bir harcama eklediğinde Esra'nın telefonunda anında görünecek
- Alışveriş listesini birlikte yönetebilirsiniz
- İnternet olmasa bile uygulama çalışır (sonra bağlanınca senkron olur)
- Uygulama ikonu ana ekranda, tarayıcı çubuğu görünmez

---

## ❓ Sık Sorulan Sorular

**Verilerimiz güvende mi?**
Evet. Firebase verileri Google sunucularında şifreli olarak saklar. Sadece sizin projenize erişebilirsiniz.

**Ücretsiz mi kalacak?**
Evet. Firebase'in ücretsiz planı (Spark) aylık 1GB veri ve 10GB transfer içerir — bir aile için fazlasıyla yeterli.

**Link'i başkası açarsa?**
Veritabanı güvenlik kurallarını ayarlarsak sadece siz erişebilirsiniz. İsterseniz bu adımı da eklerim.

**Uygulama güncelleme gerekecek mi?**
Hayır. Web uygulaması olduğu için her açtığınızda en güncel sürümü görürsünüz.

---

## 🔒 Bonus: Veritabanı Güvenlik Kuralları

Firebase Console'da **Realtime Database** → **Kurallar** sekmesine git ve şunu yapıştır:

```json
{
  "rules": {
    "eraylar": {
      ".read": true,
      ".write": true
    }
  }
}
```

> Not: Bu kurallar link'i bilen herkesin erişmesine izin verir, ama link'i sadece siz bildiğiniz sürece sorun olmaz. Daha güvenli bir versiyonu isterseniz Claude'a sorun!
