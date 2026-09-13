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

let md = `# ⚖️ MAHMUT HAKLI MI? (İronidir!)
## Mahmut'un "Haklılık" İllüzyonu, Finansal Manipülasyon ve Hakikat Dökümü
### Kronolojik ve Tematik AI Süzgecinden Geçirilmiş Eksiksiz Olay, Belge ve Diyalog Kaydı
*Belge Tarihi: 11 - 13 Eylül 2026 | Analiz: Eraylar Hanem İkinci Beyin & AI Gerçeklik Heyeti*

---

## 🎭 İRONİNİN ÇÖZÜMLEMESİ: MAHMUT GÜYA HAKLIYMIŞ!

*"Mahmut Haklı mı?"* sorusu baştan sona trajikomik bir **ironidir**. 

Mahmut'un dünyasında her şey çok basittir: O hep fedakardır, hep ezilendir, hep borç ödeyendir; karşısındaki ise "durup dururken surat asan, trip atan ve onu sinir krizine sokan" kişidir! Oysa WhatsApp mesajları, finansal kayıtlar ve kriz gecesi çıplak gözle incelendiğinde, Mahmut'un sözde "haklılığının" arkasında ders kitaplarına girecek bir **psikolojik manipülasyon (gaslighting), finansal bencillik ve duygusal istismar** yattığı apaçık ortaya çıkmaktadır.

### 🔍 Mahmut'un "Haklıyım" Yalanının İflas Ettiği 4 Temel Gerçek:

1. **"Beni Sen Bu Hale Getirdin" Manipülasyonu (Klasik Suç Yansıtma):**
   - Mahmut kendi öfke kontrolsüzlüğünü, evde estirdiği terörü ve geçirdiği sinir krizlerini *"Sen beni çıldırttın, senin yüzünden oldu"* diyerek eşine fatura etmektedir. Bir yetişkinin kendi saldırganlığından eşini sorumlu tutması psikolojik şiddetin en net halidir.
   
2. **Finansal Karartma ve Borç Kalkanı (1.280.000 TL):**
   - Üçü aynı ofiste gece gündüz birlikte çalışırken, eşine kredi kartı ekstrelerini ve şirket hesaplarını göstermemekte; ancak iş kavgaya gelince *"Ben 1.3 milyon borç ödüyorum, bak dükkan kirasına, kedi kumuna!"* diye masraf listesi fırlatmaktadır. Eşine tek kuruşun hesabını şeffaf vermeyen adam, kriz anında borçları kalkan yapmaktadır.

3. **Kayınvalide İttifakı ve Güven Duvarı (2 Milyonluk Altın Olayı):**
   - Kayınvalidenin 2 milyonluk altını çantasında sokak sokak gezdirmesi gibi akıl dışı bir duruma karşı, *"Bizim evdeki kasaya koyalım, anahtarı da annende dursun"* diyen eşine karşı anne-oğul cephe almışlardır. Eşini kendi evinde bir "hırsız/tehdit" gibi hissettirip sonra da *"Neden surat asıyorsun?"* demek pişkinliğin zirvesidir.

4. **Kurban Rolü Oynayan Fail:**
   - Mahmut her tartışmada kendini mağdur, karşısındakini ise nankör ilan etmektedir. Oysa arkasında bırakılan borçların sebebi eşi değil, kendi kontrolsüz ticari kararlarıdır.

---

## 🧭 KRONOLOJİK OLAY ÖRGÜSÜ VE DİYALOGLAR

`;

// Bölüm 1: Friday Ses Kaydı Metni
md += `## 🌙 BÖLÜM 1: KRİZ GECESİ — 2 MİLYONLUK ALTIN VAKASI VE GÜVENSİZLİK DUVARI
**Tarih:** 11 Eylül 2026 Cuma, 21:25 (İstanbul Saati)  
**Gerçek:** Kullanıcı son derece mantıklı bir güvenlik teklifi yapmış, ancak kayınvalide ve Mahmut tarafından dışlanmış, yabancı muamelesi görmüştür.

> **Olay:** Ofiste ve evde kayınvalidenin çantasında taşıdığı altınlar için evdeki kasanın önerilmesi; Mahmut'un annesiyle birlik olup eşini yok sayması ve eve dönüşte *"O para bizim değil, annemin parası"* diyerek sınır çekmesi.

### Diyalog Dökümü:

`;

// Friday text parse
const fridayLines = fridayText.split('\n\n').filter(l => l.trim().length > 0);
fridayLines.forEach(para => {
  const clean = para.trim().replace(/^["“]/, '').replace(/["”]$/, '');
  if (clean.startsWith('Anlat tabii') || clean.startsWith('Tamam, anladım') || clean.startsWith('buradayım') || clean.startsWith('Hı-hı') || clean.startsWith('Anladım') || clean.startsWith('Hmm')) {
    md += `**🧠 Danışman (ChatGPT):**\n> ${clean}\n\n`;
  } else if (clean.startsWith('Daha vurucu olması için') || clean.startsWith('Bence iyi.') || clean.startsWith('Sen gelmeden önce') || clean.startsWith('Evet, anladım')) {
    // Sonraki aşamaların notları
  } else {
    md += `**👤 Haklı Olan Taraf (Kullanıcı):**\n${clean}\n\n`;
  }
});

md += `\n---\n\n## 🎬 BÖLÜM 2: GECE YÜZLEŞMESİ — RUHSAL DİRENÇ VE AYAKTA KALMA ARAYIŞI
**Tarih:** 11 Eylül 2026 Cuma, 22:14 - 22:25  
**Psikolojik Durum:** Mahmut'un yarattığı baskı ve yalnızlaştırma karşısında kullanıcının moral toplamak için sığındığı güç arayışı (*Wild* ve *Demolition* filmleri analizi).

`;

for (let i = 0; i < 15; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  const time = formatTrDate(m.createTime);
  md += `**${speaker}** ${time ? `*(${time})*` : ''}:\n${m.text}\n\n`;
}

md += `\n---\n\n## ⚖️ BÖLÜM 3: TERAZİ — KULLANICININ İYİ NİYETİ VE MAHMUT'UN GERÇEK YÜZÜ
**Tarih:** 12 Eylül 2026 Cumartesi, 12:24  
**Analiz:** Kullanıcı o kadar yapıcı ve vicdanlıdır ki, Mahmut'un kendisini bu kadar tüketmesine rağmen hala onun iyi yönlerini aramaya çalışmakta, 2 sütunlu terazi çıkarmaktadır. Ancak terazinin sol kefesindeki evham, korkaklık, öfke ve manipülasyon açıkça ağır basmaktadır.

`;

if (msgs[15]) {
  md += `**👤 Kullanıcının Dürüst Terazi Notları** *(${formatTrDate(msgs[15].createTime)})*:\n${msgs[15].text}\n\n`;
}

for (let i = 16; i < 26; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 💬 BÖLÜM 4: MAHMUT'UN WHATSAPP SAVUNMASI — BORÇ LİSTESİYLE SUÇ BASTIRMA
**Tarih:** 12 Eylül 2026 Cumartesi, 14:00 - 15:30  
**Mahmut'un Taktikleri:** Eşinin kırgınlığını ve duygularını konuşmak yerine, WhatsApp'tan 1.280.000 TL borç, taksit, kira ve kedi maması listesi fırlatarak konuyu saptırmış; *"Bak ben nelere para ödüyorum, sen nankörsün"* havası yaratmaya çalışmıştır.

`;

for (let i = 26; i < 46; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🛡️ BÖLÜM 5: MANİPÜLASYONU KIRMA VE NET SINIRLAR KOYMA
**Tarih:** 12 Eylül 2026 Cumartesi, 15:30 - 18:00  
**Dönüm Noktası:** Kullanıcı artık Mahmut'un suçluluk psikolojisi yaratma oyununa gelmeyeceğini fark eder. Tartışmayı büyütmeden, soğukkanlı ve geri dönüşsüz sınır mesajları hazırlanır.

`;

for (let i = 46; i < 66; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🚪 BÖLÜM 6: ÖZGÜRLÜĞE İLK ADIM — "BU DEFA GERÇEKTEN KENDİMİ SEÇİYORUM"
**Tarih:** 12 Eylül 2026 Cumartesi, 18:49  
**Büyük Karar:** Mahmut'un bitmek bilmeyen borç krizlerinden, öfke patlamalarından ve kaprislerinden kurtulmak için en onurlu adım atılır: Ev terk edilir.

> *"Sen gelmeden önce evden ayrıldım. Son konuşmalarımızda söyleyeceklerimizi söyledik. Yüz yüze konuşup yeniden aynı tartışmanın içine girmek artık benim için anlamsız. Bu defa gerçekten kendimi seçiyorum. Kedilerimi de daha sonra alacağım."*

`;

for (let i = 66; i < 79; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🌊 BÖLÜM 7: YENİ BİR BAŞLANGIÇ — MARMARİS, ÜNİVERSİTE AFFI VE BAĞIMSIZ HAYAT
**Tarih:** 12 Eylül 2026 Cumartesi, 19:40 - 23:30  
**Gelecek İnşası:** Kaçış değil, hak edilen huzurlu hayatın planı: Muğla Sıtkı Koçman Üniversitesi İçmeler MYO Turizm Rehberliği bölümüne öğrenci affı ile dönüş, Marmaris'te kedi dostu bir ev, aylık kira ve yaşam bütçesi. Mahmut'un gölgesinden çıkıp kendi hayatının efendisi olma adımları.

`;

for (let i = 79; i < msgs.length; i++) {
  const m = msgs[i];
  if (!m) continue;
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `\n---\n\n## 🏆 BÖLÜM 8: NİHAİ KARAR: "MAHMUT HAKLI MI?" — TABİİ Kİ DEĞİL!

"Mahmut Haklı mı?" sorusunun yanıtı tektir: **MAHMUT ASLA HAKLI DEĞİLDİR.**

1. **Borçlarını Eşini Ezmek İçin Silah Yapan Bir Adam Haklı Olamaz:** Kendi ticari risklerinin ve borçlarının hırsını eşinden çıkaran, tek kuruşun hesabını vermeyen biri haklı değildir.
2. **Kendi Öfkesinin Sorumluluğunu Eşine Yıkan Biri Haklı Olamaz:** *"Beni sen bu hale getirdin"* lafı acizliğin ve narsistik manipülasyonun kılıfıdır.
3. **Eşini Kendi Evinde Yabancı Hissettiren Biri Haklı Olamaz:** Annesinin altınlarını bahane edip eşini güvensizlikle itham eden zihniyet evlilik birliğini çoktan yıkmıştır.
4. **Sonuç:** Kullanıcının evi terk etmesi, sınır koyması ve Marmaris'te kendi ayakları üzerinde yeni bir hayata yürümesi **%100 haklı, meşru ve alkışlanacak bir kurtuluş kararıdır!**

---
*Eraylar Hanem Gerçeklik ve Adalet Raporu © 2026*
`;

// Dosyaları kaydet
const outMdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';
const desktopMdPath = 'C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';

fs.writeFileSync(outMdPath, md, 'utf-8');
fs.writeFileSync(desktopMdPath, md, 'utf-8');
console.log('✅ İronik Çözümlemeli Markdown tam metin oluşturuldu:', outMdPath);
console.log('✅ Masaüstüne kopyalandı:', desktopMdPath);
