const fs = require('fs');
const path = require('path');

// 1. Friday 925 PM.txt'yi oku
const fridayText = fs.readFileSync('C:/Users/Administrator/Desktop/Friday 925 PM.txt', 'utf-8');

// 2. Temizlenmiş chat mesajlarını oku
const msgs = JSON.parse(fs.readFileSync('scratch/cleaned_chat_messages.json', 'utf-8'));

function formatTrDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  });
}

let md = `# ⚖️ MAHMUT HAKLI MI?
## Kronolojik ve Tematik AI Süzgecinden Geçirilmiş Eksiksiz Olay ve Sohbet Dökümü
*Belge Tarihi: 11 - 13 Eylül 2026 | Derleyen: Eraylar Hanem İkinci Beyin & AI Analiz Motoru*

---

## 📋 YÖNETİCİ ÖZETİ VE OLAY ÖRGÜSÜ (NARRATIVE OVERVIEW)

Bu doküman; kullanıcının evliliğinde yaşadığı derin finansal, duygusal ve kişisel kriz anlarında uzman bir psikolog/psikiyatrist gibi rehberlik etmesi için yapay zeka ile yürüttüğü kapsamlı sohbet dökümünün **hiçbir detayı, duyguyu, argümanı ve satırı atlamadan** kronolojik ve tematik olarak düzenlenmiş halidir.

### 🧭 Olayın Kronolojik Gelişim Çizgisi:
1. **11 Eylül 2026 Cuma (21:25):** 
   - **Krizin Fitili (Altın Vakası):** Kayınvalidede bulunan yaklaşık 2 milyon TL değerindeki altının çantada taşınması, evdeki kasaya konulması teklifinin reddedilmesi, ortak bütçe / aile parası konusundaki belirsizlik ve kullanıcının hissettiği dışlanmışlık/güvensizlik duygusu.
2. **11 Eylül 2026 Cuma (22:14):**
   - **İlk Şok ve Moral Toparlama:** Kullanıcının kriz anındaki ruh halini toparlamak için sığındığı moral arayışı (*Wild* ve *Demolition* filmleri analizi).
3. **12 Eylül 2026 Cumartesi (12:24):**
   - **Mahmut'un Karakter Analizi (Terazi Tablosu):** Kullanıcının Mahmut'un iyi huyları (sağlıkla ilgilenme, çalışkanlık, hayvan sevgisi) ile yıpratıcı/korkutucu huyları (evham, parasızlık şikayeti, agresyon, empati yoksunluğu) arasında hazırladığı iki sütunlu karşılaştırma.
4. **12 Eylül 2026 Cumartesi (14:30):**
   - **Finansal Baskı ve WhatsApp Savunması:** Mahmut'un WhatsApp üzerinden attığı 1.170.000 TL'lik borç, dükkan kiraları, araç bakım ve kedi giderleri listesiyle kendini savunması; *"Beni sen bu hale getirdin, senin yüzünden sinir krizi geçirdim"* şeklindeki sorumluluktan kaçınma ve suçlama manipülasyonunun psikolojik çözümü.
5. **12 Eylül 2026 Cumartesi (16:30 - 18:49):**
   - **Sınır Çizme ve Karar Anı:** Kullanıcının suçluluk tuzağına düşmeden Mahmut'a karşı net, sakin ama geri adımsız sınırlar koyması.
   - **Radikal Ayrılık Kararı:** *"Sen gelmeden önce evden ayrıldım. Bu kez kendimi seçiyorum. Kedilerimi de sonra alacağım"* mesajı ile döngüden çıkış.
6. **12 Eylül 2026 Cumartesi (19:40 - Gece):**
   - **Yeni Bir Hayat İnşası (Marmaris & Üniversite Affı):** Marmaris'e dönüş kararı, Muğla Sıtkı Koçman Üniversitesi İçmeler MYO Turizm Rehberliği bölümüne öğrenci affı ile dönüş imkanı, kedilerle birlikte tutulacak ev, eşya, kira ve geçim bütçesinin adım adım hesaplanması.
7. **13 Eylül 2026 Pazar (Sabah):**
   - Kararın pekişmesi, bağımsızlık planı ve duygusal özgürleşme.

---

`;

// Bölüm 1: Friday Ses Kaydı Metni
md += `## 🌙 BÖLÜM 1: KRİZ GECESİ — ALTIN VAKASI, GÜVENSİZLİK VE ORTAK BÜTÇE
**Tarih:** 11 Eylül 2026 Cuma, 21:25 (İstanbul Saati)  
**Bağlam:** Kullanıcı ofiste ve evde yaşanan altın krizini bir uzmana danışır gibi sesli olarak ChatGPT'ye aktarır.

> **Olayın Çekirdeği:** Kayınvalidenin çantasında gezdirdiği yaklaşık 2 milyon TL'lik altın, kullanıcının evdeki kasaya koyma teklifine karşı sergilenen direnç, ortak şirket ve ortak para algısının sarsılması, Mahmut'un "O para senin değil, annemin parası" çıkışı.

### Diyalog Dökümü:

`;

// Friday text parse
const fridayLines = fridayText.split('\n\n').filter(l => l.trim().length > 0);
let currentSpeaker = 'Kullanıcı';
fridayLines.forEach(para => {
  const clean = para.trim().replace(/^["“]/, '').replace(/["”]$/, '');
  if (clean.startsWith('Anlat tabii') || clean.startsWith('Tamam, anladım') || clean.startsWith('buradayım') || clean.startsWith('Hı-hı') || clean.startsWith('Anladım') || clean.startsWith('Hmm')) {
    md += `**🧠 Psikolog (ChatGPT):**\n> ${clean}\n\n`;
  } else if (clean.startsWith('Daha vurucu olması için') || clean.startsWith('Bence iyi.') || clean.startsWith('Sen gelmeden önce') || clean.startsWith('Evet, anladım')) {
    // Sonraki aşamaların notları
  } else {
    md += `**👤 Kullanıcı:**\n${clean}\n\n`;
  }
});

md += `\n---\n\n## 🎬 BÖLÜM 2: GECE YÜZLEŞMESİ — RUHSAL DAYANIKLILIK VE İLHAM ARAYIŞI
**Tarih:** 11 Eylül 2026 Cuma, 22:14 - 22:25  
**Bağlam:** Kriz gecesi evdeki gerilim sonrası kullanıcının içine düştüğü boşluktan çıkabilmek ve güç toplamak için istediği film önerisi ve psikolojik değerlendirme.

`;

// Mesaj 0'dan mesaj 15'e kadar (Film diyalogları)
for (let i = 0; i < 15; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  const time = formatTrDate(m.createTime);
  md += `**${speaker}** ${time ? `*(${time})*` : ''}:\n${m.text}\n\n`;
}

md += `\n---\n\n## ⚖️ BÖLÜM 3: TERAZİ — MAHMUT'UN ARTILARI VE EKSİLERİ TABLOSU
**Tarih:** 12 Eylül 2026 Cumartesi, 12:24  
**Bağlam:** Kullanıcı bir kağıda/not defterine Mahmut ile ilgili sevmediği (yıpratıcı) huyları sol tarafa, sevdiği (olumlu) huyları sağ tarafa yazarak dürüst bir yüzleşme listesi hazırlar ve analize sunar.

`;

// Mesaj 15 (Terazi mesajı)
if (msgs[15]) {
  md += `**👤 Kullanıcı** *(${formatTrDate(msgs[15].createTime)})*:\n${msgs[15].text}\n\n`;
}

// Mesaj 16-25 arası (Terazi analizi)
for (let i = 16; i < 26; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 💬 BÖLÜM 4: FİNANSAL BASKI VE WHATSAPP SAVUNMASI
**Tarih:** 12 Eylül 2026 Cumartesi, 14:00 - 15:30  
**Bağlam:** Mahmut, tartışmanın ardından kullanıcının kırgınlığını anlamak yerine, "Ben parayı saçmıyorum, bak nereye gidiyor" diyerek 1.170.000 TL'lik borç, dükkan kirası ve masraf dökümlerini WhatsApp'tan iletir. Ardından *"Sen beni bu hale getirdin"* diyerek suçu kullanıcıya yıkar.

`;

// Mesaj 26-45 arası (WhatsApp mesajları ve manipülasyon analizi)
for (let i = 26; i < 46; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🛡️ BÖLÜM 5: NET SINIRLAR VE MESAJ TASLAKLARI
**Tarih:** 12 Eylül 2026 Cumartesi, 15:30 - 18:00  
**Bağlam:** Kullanıcı suçluluk tuzağına düşmeden, Mahmut'un öfkesini ve sınır ihlallerini sırtlanmayacağını ilan eden, tartışmayı tırmandırmayan ama net bir duvar ören mesaj taslaklarını psikologla birlikte hazırlar.

`;

// Mesaj 46-65 arası (Mesaj taslakları)
for (let i = 46; i < 66; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🚪 BÖLÜM 6: YOL AYRIMI — "BU DEFA KENDİMİ SEÇİYORUM"
**Tarih:** 12 Eylül 2026 Cumartesi, 18:49  
**Bağlam:** Artık sözlerin tükendiği nokta. Kullanıcı evi terk etme kararını somutlaştırır: *"Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten söyledik. Bu defa gerçekten kendimi seçiyorum. Kedilerimi de sonra alacağım."*

`;

// Mesaj 66-78 arası (Ayrılık ve evden çıkış)
for (let i = 66; i < 79; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🌊 BÖLÜM 7: YENİ HAYAT İNŞASI — MARMARİS, ÜNİVERSİTE AFFI VE BAĞIMSIZLIK PLANI
**Tarih:** 12 Eylül 2026 Cumartesi, 19:40 - 23:30  
**Bağlam:** Evlilikten çıkışın bir kaçış değil, yeni bir hayat inşası haline getirilmesi. Muğla Sıtkı Koçman Üniversitesi İçmeler MYO Turizm Rehberliği öğrenci affı şartları, Marmaris'te kedi dostu bir kiralık ev, aylık geçim ve bütçe planlaması.

`;

// Mesaj 79'dan sonuna kadar
for (let i = 79; i < msgs.length; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Psikolog (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 📌 BÖLÜM 8: NİHAİ PSİKOLOJİK DEĞERLENDİRME: "MAHMUT HAKLI MI?"

### 1. Finansal Haklılık Açısından:
* **Mahmut'un Savunması:** *"Annemin parası, bizim değil. Biz çok harcıyoruz, benim üzerimde 1.170.000 TL borç var, şirketin giderlerini ben döndürüyorum."*
* **Gerçek Tablo ve Haksızlık:** 
  - Üçü aynı ofiste birlikte çalışmakta ve kullanıcı da bu işletmeye emek vermektedir. Ancak kullanıcıya şirketin mali durumu, kredi kartı ekstreleri ve nakit akışı şeffafça gösterilmemektedir.
  - 2 milyon TL'lik altının evdeki kasada saklanması gibi son derece mantıklı bir güvenlik önerisi bile "bize/sana güvenmiyoruz" duvarına çarpmıştır.
  - Mahmut borç listesini kullanıcının duygusal kırgınlığını anlamak için değil, kendi kontrolsüzlüğünü ve öfkesini aklamak için bir kalkan olarak kullanmıştır.

### 2. İletişim ve Duygusal Şiddet Açısından:
* **Mahmut'un Tavrı:** *"Sen beni bu hale getirdin, senin yüzünden sinir krizi geçirdim, bana surat yapıyorsun."*
* **Psikolojik Teşhis (Yansıtma ve Sorumluluktan Kaçma):**
  - Bir yetişkinin kendi öfkesini, bağırmasını veya kendine/çevreye zarar verici davranışlarını eşine yüklemesi tipik bir manipülasyondur.
  - Karşı tarafın sakin kalmasını "tavır yapma" veya "trip atma" olarak etiketleyerek meşru bir duygusal tepkiyi değersizleştirmektedir.

### 3. Karar ve Sonuç:
* Kullanıcının sınır çizme, suçluluk duygusundan arınma, evi terk ederek kendini koruma altına alma ve Marmaris'te yarım kalan eğitimini tamamlayıp kendi ayakları üzerinde durma kararı **psikolojik, hukuki ve insani açıdan %100 meşru ve sağlıklı bir karardır.**

---
*Bu rapor Eraylar Hanem sistemi altında kişisel arşiv niteliğinde oluşturulmuştur.*
`;

// Dosyaları kaydet
const outMdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';
const desktopMdPath = 'C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';

fs.writeFileSync(outMdPath, md, 'utf-8');
fs.writeFileSync(desktopMdPath, md, 'utf-8');
console.log('✅ Markdown tam metin oluşturuldu:', outMdPath);
console.log('✅ Masaüstüne kopyalandı:', desktopMdPath);
