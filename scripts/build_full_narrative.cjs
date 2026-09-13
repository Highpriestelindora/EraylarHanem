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
## Olaylar, İddialar ve Gerçekler: Bağımsız Kronolojik Analiz ve Tam Metin
### Eraylar Hanem İnceleme Heyeti — Olay, Belge ve Diyalog Dökümü
*Belge Tarihi: 11 - 13 Eylül 2026 | Dosya Durumu: Tarafsız İnceleme & Tam Arşiv*

---

## 🔍 GİRİŞ: İDDİALAR VE MASADAKİ TABLO

"Mahmut Haklı mı?" sorusu, tarafların beyanları, kriz anı ses kayıtları ve WhatsApp yazışmaları ışığında bağımsız ve soğukkanlı bir şekilde masaya yatırılmıştır.

Dışarıdan bakıldığında ve Mahmut'un ilk anlatımında çizilen portre: *"Sürekli borç ödeyen, fedakarlık yapan, dükkan ve evin yükünü sırtlanan, ancak karşılığında surat asılan ve haksızlığa uğrayan bir mağdur"* iddiasıdır. Ancak resmi kayıtlar, finansal dökümler ve kriz anı kronolojisi incelendiğinde tablonun perde arkası tüm açıklığıyla belirginleşmektedir:

### 📌 Dosyaya Giren 4 Temel Uyuşmazlık Maddesi:

1. **"Beni Sen Bu Hale Getirdin" Savunması (Sorumluluk Dağılımı):**
   - Mahmut tartışmalarda yaşanan gerilimi ve öfke krizlerini tamamen karşı tarafın tavırlarına bağlamaktadır. Oysa kayıtlar, öfke patlamalarının tek taraflı bir kontrol kaybı olduğunu ve bir yetişkinin kendi saldırganlığından eşini sorumlu tutamayacağını göstermektedir.
   
2. **Finansal Şeffaflık Eksikliği ve 1.280.000 TL Borç:**
   - Aynı ofiste ortak mesai verilmesine rağmen şirket hesaplarının ve ekstrelerin gizlenmesi; buna karşın kavga anlarında toplam borcun bir kalkan ve baskı unsuru olarak öne sürülmesi rasyonel bir ortaklık yaklaşımıyla bağdaşmamaktadır.

3. **Güven Zafiyeti ve 2 Milyonluk Altın Krizi:**
   - Eşin evdeki çelik kasayı koruma ve güvence amaçlı teklifine karşın, kayınvalide ile oluşturulan cephe ve sergilenen dışlayıcı tutum, aile içi güven mekanizmasını zedelemiştir.

4. **Kurban ve Mağduriyet Algısı:**
   - Karşı tarafın sakinleşme ve alan açma talepleri haksız bir şekilde "nankörlük" olarak etiketlenirken, gerçekte ticari ve kişisel kararların faturasının başkasına kesildiği anlaşılmaktadır.

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

md += `\n---\n\n## 🌏 BÖLÜM 8: KÜRESEL ALTERNATİFLER — SYDNEY & PORTEKİZ D7 VİZESİ (Görseller 170-178)
**Tarih:** 12 Eylül 2026 Cumartesi Gecesi  
**Bağlam:** Marmaris dışında uluslararası bağımsız yaşam ihtimallerinin, öğrenci vizelerinin ve evcil hayvan ihracat protokollerinin karşılaştırılması.

**👤 Kullanıcı** *(Görsel 173-174)*:
Sydney'de eğitim alıp kedilerimle oraya yerleşebilir miyim? Maliyet ve süreç nasıl olur?

**🧠 Danışman (ChatGPT)**:
Türkiye'den kedilerini doğrudan Avustralya'ya götürmek basit bir uçak bileti + taşıma çantası işi değil.
Avustralya'nın resmi kurallarına göre süreç en az 6 ay sürebiliyor ve ülke kategorisine göre test, aşı, izin ve karantina şartları var. Onaylı olmayan ülkelerden gelen hayvanların önce onaylı bir ülkede en az 180 gün kesintisiz ikamet etmesi gerekebiliyor. Ayrıca Melbourne Mickleham'daki karantina tesisi ve ek masrafları bulunuyor.

Şimdi üç seçeneği yan yana koyarsak:
- **İzmir:** Başlangıç maliyeti düşük, kediler kolay, üniversite yok/değişebilir, İngilizce B1, bağımsızlık yüksek, risk düşük.
- **Marmaris:** Başlangıç maliyeti orta, kediler kolay, üniversiteye (İçmeler MYO Turizm Rehberliği) kaldığın yerden devam, İngilizce B1, bağımsızlık çok yüksek, yeni çevre yüksek, risk orta.
- **Sydney:** Başlangıç maliyeti çok yüksek (>1.0 - 1.4 milyon TL / 6 ay), kediler çok zor (karantina), okul ücreti yüksek, İngilizce B2/C1 potansiyeli, bağımsızlık çok yüksek, yeni çevre çok yüksek, risk yüksek.

Senin şu anki durumunda Marmaris seçeneğini çok ciddi düşünürdüm. Çünkü Marmaris'te: Kedilerin + kendi evin + yarım kalan üniversiten + turizm eğitimi + İngilizceyi geliştirme + Mahmut'tan fiziksel mesafe aynı anda gerçekleşebilir.

**👤 Kullanıcı** *(Görsel 176)*:
Tek başıma Portekiz D7 vizesi alabilir miyim?

**🧠 Danışman (ChatGPT)** *(Görseller 176-178)*:
Evet, tek başına Portekiz D7 vizesine başvurabilirsin. Evli olman eşini başvuruya dahil etmek zorunda olduğun anlamına gelmez; D7'de ana başvuru sahibi olarak kendi adına başvurabilirsin.
Ama D7 “Portekiz'e gidip orada iş bulayım” vizesi değil. Esas olarak emekli maaşı, kira, temettü/faiz gibi düzenli ve sürdürülebilir kendi geliriyle yaşayan kişiler içindir. 
2026 asgari ücreti 920 €/ay; yani yıllık yaklaşık 11.040 € düzenli pasif gelir belgelenmelidir. Banka hesabında para olması yetmez, düzenli nakit akışı kanıtlanmalıdır. 

---

## 🚪 BÖLÜM 9: GÜVENLİ ÇIKIŞ VE TAHLİYE PROTOKOLÜ (Görseller 179-191)
**Tarih:** 13 Eylül 2026 Pazar Sabahı  
**Bağlam:** Mahmut eve dönmeden önce çatışmasız, güvenli ve kontrollü bir şekilde evden ayrılma adımları.

**👤 Kullanıcı** *(Görsel 179)*:
Sence evden ne zaman gitmeliyim? İlk önce bir süre annemlerde kalmam gerekecek ama onunla yalnız kalmayı göze almazdım.

**🧠 Danışman (ChatGPT)** *(Görseller 179-181)*:
Mahmut yarın akşam gelebilecekse, yarını beklemezdim. Eğer annenlere gidebiliyorsan, Mahmut gelmeden önce gündüz saatlerinde kedilerini ve temel eşyalarını alıp çıkardım. Bunu “boşanıyorum, gidiyorum” şeklinde yüz yüze bir hesaplaşmaya çevirmeden.
Yanına mutlaka alacakların:
- Kimlik ve pasaport
- Banka kartları ve nakit
- Telefon ve şarj aleti
- İlaçların
- Önemli kişisel ve işle ilgili belgeler
- Kedilerin taşıma çantaları, mama, kum ve aşı kartları
- Birkaç günlük kıyafet

Değerli eşyaları almak için Mahmut'la karşı karşıya gelmeni önermiyorum. Gerekirse daha sonra yanında güvendiğin biriyle ve güvenli bir zamanda alırsın.
Annenlerin evi nihai adresin değil; sadece zihinsel olarak toparlanacağın güvenli bir geçiş istasyonudur.

**👤 Kullanıcı** *(Görsel 182)*:
Mahmut'un bana vurabileceğini mi zannediyorsun?

**🧠 Danışman (ChatGPT)** *(Görseller 182-184)*:
Hayır, “Mahmut kesinlikle sana vurur” demiyorum. Ama dün gece kontrolünü kaybedip camları kırdığı, duşakabine zarar verdiği ve ağır bir kriz yaşadığı için, ayrılık gibi duygusal olarak çok yüklü bir konuşmayı yalnızken yapmanı gereksiz bir risk olarak görüyorum. Eğer sen “Bana vurabileceğini düşünmüyorum, bana yönelik böyle bir davranışı hiç olmadı” diyorsan bunu dikkate alırım; ancak yine de kriz anında yalnız kalmak gereksiz bir yıpranma riskidir.

**👤 Kullanıcı** *(Görsel 188-189)*:
Kedileri almadan gidebilirim anca, ondan sonra almaya gelebilirim kedileri. Son mesajlaşmamızda resmen vedalaştık anlaşmaya da niyetimiz yok. Onu görmeden gidersem kaçmış gibi mi olurum?

**🧠 Danışman (ChatGPT)** *(Görseller 189-191)*:
Hayır. Onu görmeden gitmen “kaçmak” olmaz. Özellikle son mesajlaşmanızda ikiniz de fiilen vedalaşmış ve anlaşmaya niyetiniz kalmamışsa, onu görmeden çıkman kaçmak değil, olası bir krizi ve şiddeti önlemektir. 
Kedileri ilk seferde alamıyorsan kararını erteleme; sen önce güvenli bir yere geç, sonra gündüz saatinde yanında biriyle gelip kedilerini alırsın. Altı yıllık bir ilişkide saatlerce konuşup vedalaştıktan sonra geri çekilmek bir kaçış değil, meşru bir sınır koymadır.

---

## ✉️ BÖLÜM 10: NİHAİ AYRILIK MESAJI VE DELİL TESPİTİ (Görseller 192-197)
**Tarih:** 13 Eylül 2026 Pazar Öğle Saatleri  
**Bağlam:** Kapıya bırakılacak/telefona gönderilecek son mesajın dili ve evdeki maddi hasarların belgelenmesi.

**👤 Kullanıcı** *(Görsel 194-195)*:
Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik yüz yüze konuşup yeniden aynı tartışmanın içine tekrar girmek anlamsız olacak. Kedilerimi de daha sonra alacağım. Bu nasıl?

**🧠 Danışman (ChatGPT)** *(Görsel 196)*:
Bence çok iyi. Özellikle önceki versiyonlara göre daha doğal ve güçlü çünkü fazla açıklama yapmıyor. “Kendimi seçiyorum” gibi dramatik bir kapanışa ihtiyacı yok. Daha da net ve mesafeli şu hali tercih ederim:
> *“Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik. Yüz yüze konuşup yeniden aynı tartışmanın içine girmek artık benim için anlamsız. Bu nedenle bu konuda daha fazla konuşmayacağım. Kedilerimi de daha sonra alacağım.”*

Bu mesaj karşı tarafa saldırmıyor, suçlama yapmıyor ama “bu konuşmanın devamı yok” sınırını çok net çiziyor.

**👤 Kullanıcı** *(Görsel 197)*:
Giderken yaptığını tekrar görsün istiyorum (Kırılan duşakabin ve camlar hakkında).

**🧠 Danışman (ChatGPT)** *(Görsel 197)*:
Ben olsam çöpe atmazdım ama özellikle “ona göstermek” amacıyla da ortada bırakmazdım. 
- Camların güvenli toplanması: Kovaya koyduysan devrilmeyecek güvenli bir yerde dursun.
- Hatta bence fotoğrafını çekip sakla. Sadece ona göstermek için değil; kırılan camların, duşakabinin ve diğer hasarların fotoğraflarını tarihleriyle birlikte kendinde bulundurman iyi olur. Daha önce de eşyaların kırıldığını söylediğin için yaşananların kaydının sende olması ileride hukuki süreçte gerekebilir.
Kısacası: Şimdilik güvenli biçimde bırak. Mahmut görürse görsün. Ama senin amacın onun vicdanını harekete geçirmek değil, kendi hayatından çıkmak olsun.

---

## 💡 BÖLÜM 11: EK SEANS — "LAF SOKMAYI BIRAKMAK" VE İLETİŞİM DÖNGÜSÜ (Görseller 198-199)
**Tarih:** 1 Eylül 2026 Salı, 13:52  
**Bağlam:** Arşivin son iki görselinde yer alan bağımsız iletişim ve dürtü kontrolü oturumu.

**👤 Kullanıcı** *(Görsel 198)*:
Sürekli herkese laf sokmak istiyorum, bu huyumdan nasıl vazgeçebilirim?

**🧠 Danışman (ChatGPT)** *(Görseller 198-199)*:
Bu huydan vazgeçebilirsin. Üstelik “laf sokma isteği” çoğu zaman kötü niyetlilikten değil; kızgınlık, kırgınlık, kendini savunma ihtiyacı veya karşıdakine üstün gelme isteğinin hızlı bir dışavurumu oluyor.
Asıl mesele şu: Laf sokmayı bırakmak değil, laf sokmaya ihtiyaç duymayacak hale gelmek.

Önce kendinde şu döngüyü yakala:
Genellikle şöyle oluyor:
Bir şey oluyor → Rahatsız oluyorsun → Aklına çok hızlı bir cevap geliyor → Söylüyorsun → Kısa süreli rahatlıyorsun → Sonra ya pişman oluyorsun ya da yeni bir tartışma çıkıyor.

Burada değiştireceğimiz yer “aklıma cevap geldi” ile “ağzımdan çıktı” arasındaki 2-3 saniye.
Sana çok basit bir kural:
Aklına gelen ilk cevabı söyleme. Özellikle şu üç durumda:
- Sinirliyken
- Karşındaki seni küçük düşürmüş gibi hissettirdiğinde
- “Şimdi öyle bir şey söyleyeceğim ki...” diye düşündüğünde

İçinden sadece:
**“Bunu söylemek zorunda mıyım?”** de. Sonra 3 saniye bekle. Çünkü laf sokma genellikle düşünülmüş bir iletişim değil, dürtüsel bir karşı saldırıdır.

---

## 🏆 BÖLÜM 12: DEĞERLENDİRME VE NİHAİ HEYET RAPORU

Dosyadaki **199 adet ekran görüntüsü**, kriz anı ses kayıtları ve diyalog dökümleri bir bütün olarak değerlendirildiğinde:

1. **Finansal Baskı Haklılık Teşkil Etmez:** Borçların veya dükkan giderlerinin varlığı, aile birliğinde şeffaflığı reddetme ve bunu karşı tarafa karşı duygusal bir baskı unsuru olarak kullanma gerekçesi olamaz.
2. **Kişisel Öfkenin Sorumluluğu Bireye Aittir:** *"Beni sen bu hale getirdin"* argümanı psikolojik literatürde sorumluluktan kaçınma ve suç yansıtma mekanizmasıdır; rasyonel bir haklılık payı barındırmaz.
3. **Güven Zafiyeti ve Dışlama:** Annenin altınları bahanesiyle eşe evinde yabancı muamelesi yapılması güven ilkesini temelden sarsmıştır.
4. **Nihai Karar:** Kullanıcının sınırlarını çizmesi, yıpratıcı ortamdan uzaklaşması, Marmaris'te kendi ayakları üzerinde yeni ve bağımsız bir sayfa açması **tüm veriler ışığında meşru, rasyonel ve haklı bir karardır.**

---
*Eraylar Hanem İnceleme Heyeti Raporu © 2026*
`;

// Dosyaları kaydet
const outMdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';
const desktopMdPath = 'C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';

fs.writeFileSync(outMdPath, md, 'utf-8');
fs.writeFileSync(desktopMdPath, md, 'utf-8');
console.log('✅ İronik Çözümlemeli Markdown tam metin oluşturuldu:', outMdPath);
console.log('✅ Masaüstüne kopyalandı:', desktopMdPath);
