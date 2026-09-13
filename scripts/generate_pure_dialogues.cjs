const fs = require('fs');
const path = require('path');

// 1. Friday 925 PM.txt
const fridayText = fs.readFileSync('C:/Users/Administrator/Desktop/Friday 925 PM.txt', 'utf-8');

// 2. Chat messages
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
    minute: '2-digit'
  });
}

let out = '# 💬 SOHBET DİYALOGLARI (YORUMSUZ TAM METİN)\n';
out += '## 199 Görsel ve Ses Kayıtlarının Birebir Kronolojik Diyalog Dökümü\n';
out += '*Bu belgede hiçbir şahsi yorum, analiz, değerlendirme veya taraf bulunmamaktadır. Yalnızca tarafların ve danışmanın birebir ifadeleri yer almaktadır.*\n\n---\n\n';

out += '### 📅 11 EYLÜL 2026 CUMA — 21:25 (SES KAYDI DİYALOĞU)\n\n';

const fridayLines = fridayText.split('\n\n').filter(l => l.trim().length > 0);
fridayLines.forEach(para => {
  const clean = para.trim().replace(/^["“]/, '').replace(/["”]$/, '');
  if (clean.startsWith('Anlat tabii') || clean.startsWith('Tamam, anladım') || clean.startsWith('buradayım') || clean.startsWith('Hı-hı') || clean.startsWith('Anladım') || clean.startsWith('Hmm')) {
    out += `**Danışman (ChatGPT):**\n${clean}\n\n`;
  } else if (clean.startsWith('Friday 9:25 PM')) {
    // skip header
  } else {
    out += `**Kullanıcı:**\n${clean}\n\n`;
  }
});

out += '\n---\n\n### 📅 12 - 13 EYLÜL 2026 (WHATSAPP & CHATGPT YAZIŞMALARI — GÖRSELLER 1 - 169)\n\n';

msgs.forEach((m, idx) => {
  const speaker = m.role === 'user' ? 'Kullanıcı' : 'Danışman (ChatGPT)';
  const dateStr = m.createTime ? ` [${formatTrDate(m.createTime)}]` : '';
  out += `**${speaker}**${dateStr}:\n${m.text}\n\n`;
});

out += '\n---\n\n### 📅 13 EYLÜL 2026 (DEVAM DİYALOGLARI — GÖRSELLER 170 - 197)\n\n';

out += `**Kullanıcı:**
Sydney'de eğitim alıp kedilerimle oraya yerleşebilir miyim? Maliyet ve süreç nasıl olur?

**Danışman (ChatGPT):**
Türkiye'den kedilerini doğrudan Avustralya'ya götürmek basit bir uçak bileti + taşıma çantası işi değil.
Avustralya'nın resmi kurallarına göre süreç en az 6 agony sürebiliyor ve ülke kategorisine göre test, aşı, izin ve karantina şartları var. Onaylı olmayan ülkelerden gelen hayvanların önce onaylı bir ülkede en az 180 gün kesintisiz ikamet etmesi gerekebiliyor. Ayrıca Melbourne Mickleham'daki karantina tesisi ve ek masrafları bulunuyor.

Şimdi üç seçeneği yan yana koyarsak:
- İzmir: Başlangıç maliyeti düşük, kediler kolay, üniversite yok/değişebilir, İngilizce B1, bağımsızlık yüksek, risk düşük.
- Marmaris: Başlangıç maliyeti orta, kediler kolay, üniversiteye (İçmeler MYO Turizm Rehberliği) kaldığın yerden devam, İngilizce B1, bağımsızlık çok yüksek, yeni çevre yüksek, risk orta.
- Sydney: Başlangıç maliyeti çok yüksek (>1.0 - 1.4 milyon TL / 6 ay), kediler çok zor (karantina), okul ücreti yüksek, İngilizce B2/C1 potansiyeli, bağımsızlık çok yüksek, yeni çevre çok yüksek, risk yüksek.

**Kullanıcı:**
Tek başıma Portekiz D7 vizesi alabilir miyim?

**Danışman (ChatGPT):**
Evet, tek başına Portekiz D7 vizesine başvurabilirsin. Evli olman eşini başvuruya dahil etmek zorunda olduğun anlamına gelmez; D7'de ana başvuru sahibi olarak kendi adına başvurabilirsin.
Ama D7 “Portekiz'e gidip orada iş bulayım” vizesi değil. Esas olarak emekli maaşı, kira, temettü/faiz gibi düzenli ve sürdürülebilir kendi geliriyle yaşayan kişiler içindir. 
2026 asgari ücreti 920 €/ay; yani yıllık yaklaşık 11.040 € düzenli pasif gelir belgelenmelidir. Banka hesabında para olması yetmez, düzenli nakit akışı kanıtlanmalıdır.

**Kullanıcı:**
Sence evden ne zaman gitmeliyim? İlk önce bir süre annemlerde kalmam gerekecek ama onunla yalnız kalmayı göze almazdım.

**Danışman (ChatGPT):**
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

**Kullanıcı:**
Mahmut'un bana vurabileceğini mi zannediyorsun?

**Danışman (ChatGPT):**
Hayır, “Mahmut kesinlikle sana vurur” demiyorum. Ama dün gece kontrolünü kaybedip camları kırdığı, duşakabine zarar verdiği ve ağır bir kriz yaşadığı için, ayrılık gibi duygusal olarak çok yüklü bir konuşmayı yalnızken yapmanı gereksiz bir risk olarak görüyorum. Eğer sen “Bana vurabileceğini düşünmüyorum, bana yönelik böyle bir davranışı hiç olmadı” diyorsan bunu dikkate alırım; ancak yine de kriz anında yalnız kalmak gereksiz bir yıpranma riskidir.

**Kullanıcı:**
Kedileri almadan gidebilirim anca, ondan sonra almaya gelebilirim kedileri. Son mesajlaşmamızda resmen vedalaştık anlaşmaya da niyetimiz yok. Onu görmeden gidersem kaçmış gibi mi olurum?

**Danışman (ChatGPT):**
Hayır. Onu görmeden gitmen “kaçmak” olmaz. Özellikle son mesajlaşmanızda ikiniz de fiilen vedalaşmış ve anlaşmaya niyetiniz kalmamışsa, onu görmeden çıkman kaçmak değil, olası bir krizi ve gerilimi önlemektir.
Kedileri ilk seferde alamıyorsan kararını erteleme; sen önce güvenli bir yere geç, sonra gündüz saatinde yanında biriyle gelip kedilerini alırsın.

**Kullanıcı:**
Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik yüz yüze konuşup yeniden aynı tartışmanın içine tekrar girmek anlamsız olacak. Kedilerimi de daha sonra alacağım. Bu nasıl?

**Danışman (ChatGPT):**
Bence çok iyi. Özellikle önceki versiyonlara göre daha doğal ve güçlü çünkü fazla açıklama yapmıyor. Daha da net ve mesafeli şu hali tercih ederim:
“Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik. Yüz yüze konuşup yeniden aynı tartışmanın içine girmek artık benim için anlamsız. Bu nedenle bu konuda daha fazla konuşmayacağım. Kedilerimi de daha sonra alacağım.”

**Kullanıcı:**
Giderken yaptığını tekrar görsün istiyorum (Kırılan duşakabin ve camlar hakkında).

**Danışman (ChatGPT):**
Ben olsam çöpe atmazdım ama özellikle “ona göstermek” amacıyla da ortada bırakmazdım. 
- Camların güvenli toplanması: Kovaya koyduysan devrilmeyecek güvenli bir yerde dursun.
- Fotoğrafını çekip sakla: Kırılan camların, duşakabinin ve diğer hasarların fotoğraflarını tarihleriyle birlikte kendinde bulundurman iyi olur. Yaşananların kaydının sende olması ileride hukuki süreçte gerekebilir.
Kısacası: Şimdilik güvenli biçimde bırak. Mahmut görürse görsün. Ama senin amacın onun vicdanını harekete geçirmek değil, kendi hayatından çıkmak olsun.
`;

out += '\n---\n\n### 📅 1 EYLÜL 2026 SALI — 13:52 (GÖRSELLER 198 - 199 — LAF SOKMAYI BIRAKMAK)\n\n';

out += `**Kullanıcı:**
Sürekli herkese laf sokmak istiyorum bu huyumdan nasıl vazgeçebilirim?

**Danışman (ChatGPT):**
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
“Bunu söylemek zorunda mıyım?” de. Sonra 3 saniye bekle.
Çünkü laf sokma genellikle düşünülmüş bir iletişim değil, dürtüsel bir karşı saldırıdır.
`;

// Save files
const mdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Sohbet_Diyaloglari_Yorumsuz.md';
const desktopTxt = 'C:/Users/Administrator/Desktop/Sohbet_Diyaloglari_Yorumsuz.txt';
const desktopMd = 'C:/Users/Administrator/Desktop/Sohbet_Diyaloglari_Yorumsuz.md';

fs.writeFileSync(mdPath, out, 'utf-8');
fs.writeFileSync(desktopTxt, out, 'utf-8');
fs.writeFileSync(desktopMd, out, 'utf-8');

// Also overwrite Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md so the default full text is pure dialogue!
fs.writeFileSync('c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md', out, 'utf-8');
fs.writeFileSync('C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md', out, 'utf-8');

console.log('✅ Yorumsuz tam metin başarıyla oluşturuldu!');
console.log('Karakter sayısı:', out.length);
console.log('Kelime sayısı:', out.split(/\s+/).length);
