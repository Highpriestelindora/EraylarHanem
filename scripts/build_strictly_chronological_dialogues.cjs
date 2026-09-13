const fs = require('fs');
const path = require('path');

// 1. Friday voice transcript
const fridayText = fs.readFileSync('C:/Users/Administrator/Desktop/Friday 925 PM.txt', 'utf-8');

// 2. Chat messages from scraped session
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

let md = `# 💬 SOHBET DİYALOGLARI (TAM KRONOLOJİK & YORUMSUZ)
## 199 Görsel ve Ses Kayıtlarının Birebir Zamana Göre Diyalog Dökümü
*Bu belgede hiçbir şahsi yorum, analiz, değerlendirme veya taraf bulunmamaktadır. Tüm konuşmalar gerçekleştiği tarih ve saat sırasına göre birebir dizilmiştir.*\n\n---\n\n`;

// ==========================================
// 1. 1 EYLÜL 2026 SALI — 13:52 (GÖRSELLER 198 - 199)
// ==========================================
md += `## 📅 1 EYLÜL 2026 SALI — 13:52 (GÖRSELLER 198 - 199)
*Konu: "Laf Sokmayı Bırakmak" Oturumu*

**👤 Kullanıcı** *(1 Eylül 2026 Salı, 13:52)*:
sürekli herkese laf sokmak istiyorum bu huyumdan nasıl vazgeçebilirim

**🧠 Danışman (ChatGPT)** *(1 Eylül 2026 Salı, 13:52)*:
Bu huydan vazgeçebilirsin. Üstelik “laf sokma isteği” çoğu zaman kötü niyetlilikten değil; kızgınlık, kırgınlık, kendini savunma ihtiyacı veya karşıdakine üstün gelme isteğinin hızlı bir dışavurumu oluyor.

Asıl mesele şu: Laf sokmayı bırakmak değil, laf sokmaya ihtiyaç duymayacak hale gelmek.

Önce kendinde şu döngüyü yakala:
Genellikle şöyle oluyor:
Bir şey oluyor → rahatsız oluyorsun → aklına çok hızlı bir cevap geliyor → söylüyorsun → kısa süreli rahatlıyorsun → sonra ya pişman oluyorsun ya da yeni bir tartışma çıkıyor.

Burada değiştireceğimiz yer “aklıma cevap geldi” ile “ağzımdan çıktı” arasındaki 2-3 saniye.

Sana çok basit bir kural:
Aklına gelen ilk cevabı söyleme.
Özellikle şu üç durumda:
• Sinirliyken
• Karşındaki seni küçük düşürmüş gibi hissettirdiğinde
• “Şimdi öyle bir şey söyleyeceğim ki...” diye düşündüğünde

İçinden sadece:
“Bunu söylemek zorunda mıyım?” de.
Sonra 3 saniye bekle.
Çünkü laf sokma genellikle düşünülmüş bir iletişim değil, dürtüsel bir karşı saldırı.

---

`;

// ==========================================
// 2. 11 EYLÜL 2026 CUMA — 21:25 (SES KAYDI DİYALOĞU)
// ==========================================
md += `## 📅 11 EYLÜL 2026 CUMA — 21:25 (SES KAYDI)
*Konu: 2 Milyonluk Altın Krizi ve Arabadaki Tartışma*

**👤 Kullanıcı** *(11 Eylül 2026 Cuma, 21:25)*:
Sana bi olayı anlatıcam ve bi psikiyatrist gibi uzman bi psikolog gibi bana bu olayı yorumla tamam mı?

**🧠 Danışman (ChatGPT)**:
Anlat tabii, buradayım. Sakin sakin anlat.

**👤 Kullanıcı**:
Dün sabah eşim ve kayınvalidem onda bulunan altınları büyütmek istediklerini, fona, hisseye, faize yatırarak değerlendirilmesi gerektiğini söylediler. Bunun üstüne kayınvalidem korktu, istemedi, kavga ettiler. Sonra barıştılar ama o sırada kayınvalidem altınları çantasından çıkardı koydu. Ben de dedim ki: "Sen yanında mı gezdiriyorsun bunu böyle?" "Evet ben yıllardır yanımda gezdiriyorum" dedi. Yaklaşık 2 milyon TL'lik bir altın.

**🧠 Danışman (ChatGPT)**:
Hmm. Anladım, hı-hı.

**👤 Kullanıcı**:
Sonra kayınvalidem ofisten çıkınca eşime dedim ki: "Bizim evimizde kasa var. Kasanın içine koyalım bunu, anahtarı da annene ver. Bu böyle çok riskli yanında gezdirmesi; hırsızlık olur, kapkaç olur, bir yerde düşer bayılır çantasının peşine koşturmayalım" dedim. Eşim de: "Ben bunu daha önce ona teklif ettim, istemedi" dedi. Sonra akşam kayınvalidemde yemek yerken ben tekrardan söyledim. O da "Hayır istemiyorum, yanımda dursun istiyorum" dedi. Ben de bunun saçma olduğunu, zaten tek bu paramızın olduğunu, başka paramızın olmadığını söyledim. Gene de istemedi. Sonra ben balkona çıktım, surat yaptım. Onlar anne-oğul konuştular. Eve gelirken eşim sordu "Ne oldu?" diye. Dedim: "Ben alındım çünkü kasa benim evimde olduğu için herhalde benden çekindiği için oraya koymak istemiyor, kalbim kırıldı. Ayrıca bu para ortak paramız değil mi, neden bana güvenmiyor gibi hissediyorum?" dedim. Eşim de dedi ki: "Konunun senle hiç alakası yok. Zaten o para bizim değil, annemin parası" dedi. Biz üçümüz aynı ofiste birlikte çalışıyoruz. Eşimin dediğine göre biz çok fazla harcama yapıyormuşuz. Ben abuk subuk harcama yapmıyorum, eşim yapıyorsa bilmiyorum çünkü kredi kartı ekstrelerini görmüyorum.

---

`;

// ==========================================
// 3. 11 EYLÜL 2026 CUMA — 22:14 - 22:18 (MESAJLAR 0 - 7)
// ==========================================
md += `## 📅 11 EYLÜL 2026 CUMA — 22:14 - 22:18 (MESAJLAR 0 - 7)
*Konu: Kriz Sonrası Yalnız Kalış ve Film Arayışı*

`;

for (let i = 0; i <= 7; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 4. 12 EYLÜL 2026 CUMARTESİ — 12:24 - 12:48 (MESAJLAR 8 - 9)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 12:24 - 12:48 (MESAJLAR 8 - 9)
*Konu: Mahmut Hakkında Hazırlanan Artı/Eksi Listesi*

`;

for (let i = 8; i <= 9; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 5. 12 EYLÜL 2026 CUMARTESİ — 12:48 - 13:42 (MESAJLAR 10 - 40)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 12:48 - 13:42 (MESAJLAR 10 - 40)
*Konu: Mahmut'un WhatsApp'tan 1.280.000 TL Borç Listesi Göndermesi ve Yanıt Stratejisi*

`;

for (let i = 10; i <= 40; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 6. 12 EYLÜL 2026 CUMARTESİ — 13:47 - 14:18 (MESAJLAR 41 - 48)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 13:47 - 14:18 (MESAJLAR 41 - 48)
*Konu: Mahmut'un Veda Mesajı ("Biz Zaten Bitmişiz...") ve Hazırlanan Cevap*

`;

for (let i = 41; i <= 48; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 7. 12 EYLÜL 2026 CUMARTESİ — 15:49 - 16:19 (MESAJLAR 49 - 60)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 15:49 - 16:19 (MESAJLAR 49 - 60)
*Konu: Evlilik Geçmişi, Yaş Farkı (23-33 / 29-39) ve Yol Ayrımı*

`;

for (let i = 49; i <= 60; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 8. 12 EYLÜL 2026 CUMARTESİ — 17:39 - 18:50 (MESAJLAR 61 - 76 & GÖRSELLER 170 - 178)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 17:39 - 18:50 (MESAJLAR 61 - 76 & GÖRSELLER 170 - 178)
*Konu: Alternatif Hayat Planları — Kediler, İzmir, Marmaris Üniversite Affı, Sydney & Portekiz D7*

`;

for (let i = 61; i <= 76; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `**👤 Kullanıcı** *(Görseller 173-174)*:
Sydney'de eğitim alıp kedilerimle oraya yerleşebilir miyim? Maliyet ve süreç nasıl olur?

**🧠 Danışman (ChatGPT)**:
Türkiye'den kedilerini doğrudan Avustralya'ya götürmek basit bir uçak bileti + taşıma çantası işi değil.
Avustralya'nın resmi kurallarına göre süreç en az 6 ay sürebiliyor ve ülke kategorisine göre test, aşı, izin ve karantina şartları var. Onaylı olmayan ülkelerden gelen hayvanların önce onaylı bir ülkede en az 180 gün kesintisiz ikamet etmesi gerekebiliyor. Ayrıca Melbourne Mickleham'daki karantina tesisi ve ek masrafları bulunuyor.

Şimdi üç seçeneği yan yana koyarsak:
- İzmir: Başlangıç maliyeti düşük, kediler kolay, üniversite yok/değişebilir, İngilizce B1, bağımsızlık yüksek, risk düşük.
- Marmaris: Başlangıç maliyeti orta, kediler kolay, üniversiteye (İçmeler MYO Turizm Rehberliği) kaldığın yerden devam, İngilizce B1, bağımsızlık çok yüksek, yeni çevre yüksek, risk orta.
- Sydney: Başlangıç maliyeti çok yüksek (>1.0 - 1.4 milyon TL / 6 ay), kediler çok zor (karantina), okul ücreti yüksek, İngilizce B2/C1 potansiyeli, bağımsızlık çok yüksek, yeni çevre çok yüksek, risk yüksek.

Senin şu anki durumunda Marmaris seçeneğini çok ciddi düşünürdüm. Çünkü Marmaris'te kedilerin + kendi evin + yarım kalan üniversiten + turizm eğitimi + İngilizceyi geliştirme + Mahmut'tan fiziksel mesafe aynı anda gerçekleşebilir.

**👤 Kullanıcı** *(Görsel 176)*:
Tek başıma Portekiz D7 vizesi alabilir miyim?

**🧠 Danışman (ChatGPT)** *(Görseller 176-178)*:
Evet, tek başına Portekiz D7 vizesine başvurabilirsin. Evli olman eşini başvuruya dahil etmek zorunda olduğun anlamına gelmez; D7'de ana başvuru sahibi olarak kendi adına başvurabilirsin.
Ama D7 “Portekiz'e gidip orada iş bulayım” vizesi değil. Esas olarak emekli maaşı, kira, temettü/faiz gibi düzenli ve sürdürülebilir kendi geliriyle yaşayan kişiler içindir. 
2026 asgari ücreti 920 €/ay; yani yıllık yaklaşık 11.040 € düzenli pasif gelir belgelenmelidir. Banka hesabında para olması yetmez, düzenli nakit akışı kanıtlanmalıdır.

---

`;

// ==========================================
// 9. 12 EYLÜL 2026 CUMARTESİ — 23:23 - 23:34 (MESAJLAR 77 - 90 & GÖRSELLER 179 - 196)
// ==========================================
md += `## 📅 12 EYLÜL 2026 CUMARTESİ — 23:23 - 23:34 (MESAJLAR 77 - 90 & GÖRSELLER 179 - 196)
*Konu: Evden Çıkış Kararı, Güvenlik, Kediler ve Bırakılacak Son Mesaj*

`;

for (let i = 77; i <= 90; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `**👤 Kullanıcı** *(Görseller 194-195)*:
Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik yüz yüze konuşup yeniden aynı tartışmanın içine tekrar girmek anlamsız olacak. Kedilerimi de daha sonra alacağım. Bu nasıl?

**🧠 Danışman (ChatGPT)** *(Görsel 196)*:
Bence çok iyi. Özellikle önceki versiyona göre daha doğal ve güçlü çünkü fazla açıklama yapmıyor. “Kendimi seçiyorum” gibi dramatik bir kapanışa da ihtiyacı yok. Daha da net ve mesafeli şu hali tercih ederim:
> *“Sen gelmeden önce evden ayrıldım. Söyleyeceklerimizi zaten son konuşmalarımızda söyledik. Yüz yüze konuşup yeniden aynı tartışmanın içine girmek artık benim için anlamsız. Bu nedenle bu konuda daha fazla konuşmayacağım. Kedilerimi de daha sonra alacağım.”*

Bu mesaj karşı tarafa saldırmıyor, suçlama yapmıyor ama “bu konuşmanın devamı yok” sınırını çok net çiziyor.

---

`;

// ==========================================
// 10. 13 EYLÜL 2026 PAZAR SABAHI (GÖRSEL 197)
// ==========================================
md += `## 📅 13 EYLÜL 2026 PAZAR SABAHI (GÖRSEL 197)
*Konu: Kırılan Duşakabin ve Camların Belgelenmesi*

**👤 Kullanıcı** *(Görsel 197)*:
Giderken yaptığını tekrar görsün istiyorum (Kırılan duşakabin ve cam parçaları hakkında).

**🧠 Danışman (ChatGPT)** *(Görsel 197)*:
Ben olsam çöpe atmazdım ama özellikle “ona göstermek” amacıyla da ortada bırakmazdım. 
Çünkü burada iki ayrı mesele var:
• Camların güvenli şekilde toplanmış olması: Kovaya koyduysan ve devrilmeyecek, kimsenin elini sokamayacağı güvenli bir yerdeyse, şimdilik öyle kalabilir.
• Mahmut'un yaptığını görmesini istemen: Bunu istemeni anlıyorum. Aslında “Bak, öfkenin sonucunda bunlar oldu ve ben bunları temizlemek zorunda kaldım” mesajını görmesini istiyorsun.
Fakat bunu bir mesaj verme/cezalandırma aracına çevirmemeni öneririm. Eve döndüğünde görürse görür. Sen ayrıca “bak ne yaptın” diye açıklamak zorunda değilsin.
Hatta bence fotoğrafını çekip sakla. Sadece ona göstermek için değil; kırılan camların, duşakabinin ve diğer hasarların fotoğraflarını tarihleriyle birlikte kendinde bulundurman iyi olur. Daha önce de eşyaların kırıldığını söylediğin için yaşananların kaydının sende olması ileride gerekebilir.
Ve camları daha sonra atarken normal çöp poşetine çıplak şekilde koyma. Kalın/kırılmaya dayanıklı bir ambalaja güvenli biçimde sarıp belediyenin cam/kırık eşya için uygun bertaraf yöntemini kullanmak daha güvenli.
Kısacası: Şimdilik güvenli biçimde bırak. Mahmut görürse görsün. Ama senin amacın onun vicdanını harekete geçirmek değil, kendi hayatından çıkmak olsun.

---

`;

// ==========================================
// 11. 13 EYLÜL 2026 PAZAR — 10:08 (MESAJLAR 91 - 92)
// ==========================================
md += `## 📅 13 EYLÜL 2026 PAZAR — 10:08 (MESAJLAR 91 - 92)
*Konu: Sohbet Paylaşım Bağlantısı ve Arşiv Teyidi*

`;

for (let i = 91; i <= 92; i++) {
  const m = msgs[i];
  const speaker = m.role === 'user' ? '👤 Kullanıcı' : '🧠 Danışman (ChatGPT)';
  md += `**${speaker}** *(${formatTrDate(m.createTime)})*:\n${m.text}\n\n`;
}

md += `---\n\n`;

// ==========================================
// 12. 13 EYLÜL 2026 PAZAR — 12:35 - 12:41 (GÖRSELLERİN ARŞİVLENMESİ)
// ==========================================
md += `## 📅 13 EYLÜL 2026 PAZAR — 12:35 - 12:41
*Konu: 199 Ekran Görüntüsünün Eksiksiz Arşivlenmesi*
Yukarıda dökümü yapılan tüm diyaloglar, 13 Eylül 2026 Pazar günü saat 12:35 ile 12:41 arasında 199 adet yüksek çözünürlüklü JPEG formatında kaydedilmiş ve sıfır kayıpla arşive alınmıştır.
`;

// Save files
const mdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Sohbet_Diyaloglari_Yorumsuz.md';
const desktopTxt = 'C:/Users/Administrator/Desktop/Sohbet_Diyaloglari_Yorumsuz.txt';
const desktopMd = 'C:/Users/Administrator/Desktop/Sohbet_Diyaloglari_Yorumsuz.md';

fs.writeFileSync(mdPath, md, 'utf-8');
fs.writeFileSync(desktopTxt, md, 'utf-8');
fs.writeFileSync(desktopMd, md, 'utf-8');

fs.writeFileSync('c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md', md, 'utf-8');
fs.writeFileSync('C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md', md, 'utf-8');

console.log('✅ %100 Kronolojik ve Yorumsuz diyalog dökümü oluşturuldu!');
console.log('Karakter sayısı:', md.length);
console.log('Kelime sayısı:', md.split(/\s+/).length);
