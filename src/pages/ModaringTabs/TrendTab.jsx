import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Zap, Image as ImageIcon, 
  TrendingUp, Star, Award, Palette, 
  ChevronRight, RefreshCw, Layers, Gem,
  X, Calendar, Info
} from 'lucide-react';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';

const TrendTab = () => {
  const { modaring, addModaringRefika, deleteModaringRefika } = useStore();
  const savedIdeas = modaring?.refikaFikirleri || [];
  
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [viewingIdea, setViewingIdea] = useState(null);

  // 🧜 Refika'nın Kimlik Kartı
  const refikaBio = "Ben Dul Refika. Mücevher dünyasının 'ikonik' ismiyim. İstanbul'un tozunu yutmuş, en lüks butiklerden AVM kuytularına kadar her vitrini ben dizmişimdir. Esra'ya sadece fikir vermem; ona dükkanını parlatacak, rakiplerini çatlatacak servetlik stratejiler fısıldarım. Benim zevkim dükkanın imzasıdır!";

  // 🧠 Refika Brain v5: Infinite Matrix Engine (1.3M+ Combinations)
  // Phase 1 + Phase 2 + Phase 3 Integration
  const refikaBrain = useMemo(() => ({
    contexts: [
      // Phase 1
      "Hafta sonu yoğunluğu kapıda; vitrinin en önüne 'Cross-Sell' kraliçelerini dizmeliyiz!",
      "Maaş günü geldi, kadınlar 'kendine ödül' arıyor. Premium setlerimizi parlat Esra!",
      "AVM kalabalık ama cüzdanlar sıkı; hızlı tüketilen, 'hediyelik' takılarla vurmalıyız.",
      "Akşam saati... Bağdat Caddesi'nin şık kadınları dükkanın önünden süzülüyor.",
      "Mevsim dönüyor! Gardıroplar yenilenirken takı ve çanta setlerimizi öne çıkarmanın tam vakti.",
      "Bugün dükkan sessiz... VIP müşterilere özel 'gizli koleksiyon' WhatsApp mesajı atma vakti.",
      "Hava yağmurlu, herkes AVM içine sığındı. Işıkları %20 daha parlat, dükkan vaha gibi görünsün.",
      "Yarın özel bir gün yaklaşıyor, 'hazır set' paketleri hazır mı?",
      "Okul çıkış saati, anneler AVM turunda. Onların 'günlük şıklık' ihtiyacına oynamalıyız.",
      "Yeni sevkiyat geldi! Kutuları dükkanın ortasında aç, 'yeni geldi' heyecanı yarat.",
      "Pazartesi sendromu... Kadınların ruhunu takıyla iyileştirelim.",
      "Rakipler indirimde! Biz 'değer' ve 'stil danışmanlığına' odaklanmalıyız.",
      "Öğle arası... Ofis şıklığı arayan bankacı kadınlar dükkana girebilir.",
      "Dışarıda rüzgar var, çelik takıların 'kararmazlık' gücünü anlatmak için harika bir gün.",
      "Akşam yemeği planları yapılıyor; iddialı küpeler ve portföy çantaların saati geldi.",
      // Phase 2
      "Ay sonu durgunluğu; 'fiyat-performans' canavarı Xuping'leri vitrinin kalbine al.",
      "Güneş açtı! Aynaları dışarıdaki ışığı dükkana kıracak şekilde açılandır.",
      "Dükkana bir grup arkadaş girdi; 'arkadaş indirimi' değil, 'set tamamlama' teklif et.",
      "Bir müşteri ürünü iadeye getirdi; onu kırmadan en yeni ithal kolyeyi denetmeliyiz.",
      "Instagram'da bir influencer takılarımızı paylaştı! O kombini hemen mankene giydir.",
      "AVM'de büyük bir marka indirim başlattı, kapıdaki trafiği çekmek için en parlak küpeleri diz.",
      "Salı sallanır derler; bugün dükkanın enerjisini tazelemek için sergileme yerlerini değiştir.",
      "VIP bir müşteri randevu aldı; onun zevkine özel 3 farklı kombin hazırla.",
      "Yaz düğünleri sezonu açıldı; gösterişli ama hafif Xuping setler vitrine!",
      "Mezuniyet baloları yaklaşıyor; genç kızların 'ilk gerçek mücevherim' hissini yakalayalım.",
      "Dükkanın önünde bir kalabalık birikti; onlara 'deneme' daveti yapacak bir görsel hazırla.",
      "Bayram öncesi son hafta... Hediye kutularını kasanın üzerine kule yap.",
      "Kış güneşi... Altın kaplama takıların en iyi göründüğü o soluk ışığı kullan.",
      "Dükkana bir beyefendi girdi; ona 'asla hata yapmayacağı' klasik bir hediye seçtir.",
      "Müşteri ürünün 'çelik' olduğunu anlamadı; ona ağırlığını ve dokusunu hissettir.",
      // Phase 3
      "Global altın fiyatları fırladı; müşteriye 'çelik takının yatırım zekasını' anlatma vakti.",
      "Bağdat Caddesi'nde festival var; dükkanın önüne en renkli, en bohem parçaları çıkar.",
      "AVM'nin klima sistemi bozuk; müşteriye 'serinleten zarafet' temasında su yolu setler göster.",
      "Dükkanın 1. yılı/Yıl dönümü! Sadık müşterilere 'Refika'nın Seçimi' kartları hazırla.",
      "Yeni bir rakip açıldı; biz 'Dul Refika'nın mirası ve kalitesiyle' farkımızı koyacağız.",
      "Müşteri çok kararsız; ona 'bu sizin auranızı tamamlıyor' diyerek psikolojik onay ver.",
      "Gece pazarı/Gece alışverişi etkinliği; dükkanı loş tutup sadece takıları aydınlat.",
      "Dükkana bir 'stil ikonu' girdi; ona en cesur, en 'kimse takamaz' dediğin parçayı göster.",
      "Ekonomi konuşuluyor; müşteriye 'küçük bir lüksün' ruh halini nasıl düzelteceğini fısılda.",
      "Mağazada çocuklu bir anne var; çocuğa küçük bir hediye paketi yapıp anneyi rahatlat.",
      "Vitrin camı yeni silindi; o pırıl pırıl görüntüye en sofistike saat ve bileklikleri koy.",
      "Dükkanın müzik listesini değiştir; enerjiyi yükseltip satış hızını artırmalıyız.",
      "Bir müşteri 'Modaring' markasını sordu; ona dükkanın hikayesini ve Refika'nın vizyonunu anlat.",
      "Hafta içi sabahı... Sessizliği fırsat bilip envanteri Refika usulü 'hikayeleştir'.",
      "Kapanışa 15 dakika var; 'son şans' vitrini yapıp hızlı satışı yakala."
    ],
    concepts: [
      // Phase 1
      { title: "Luna Çanta & Xuping Işıltısı", desc: "Haki Luna çanta ile uyumlu gümüş rengi Xuping baget bileklik seti. Tam bir 'Caddeli' kombini." },
      { title: "İkonik Twist: Küpe & Zincir", desc: "Geometrik formlu ithal halka küpeler ve siyah rodajlı ithal yüzükler. Modern ve asi." },
      { title: "Sedef & Altın: Bohem Zırh", desc: "Sedef kalp detaylı çelik kolye ve dorika çift renk zincirler. Kararmayan, ömürlük şıklık." },
      { title: "AVM Yıldızı: Şahmeran & Broş", desc: "Baget taşlı çelik şahmeran ve 'Ekonomist' broş. Gösterişi sevenlerin tek tercihi." },
      { title: "Minimalist Lüks: Xuping & Yüzük", desc: "Triple-plating Xuping ince bileklik ve yeşil taşlı sarmal yüzük. Zarafetin zirvesi." },
      { title: "Kruvaze Çanta & Künye", desc: "Bej kruvaze askılı çanta ve üzerine takılmış büyük boy 'Chain' künye kolye." },
      { title: "Vintage Ruh: Baget & İnci", desc: "Vintage kesim baget yüzükler ve inci detaylı çelik kıkırdak küpeler. Klasik ve modernin dansı." },
      { title: "Gece Mavisi: Clutch & Safir", desc: "Kadife clutch çanta ve safir rengi taşlı Xuping kolye-küpe seti. Davetlerin gözdesi." },
      { title: "Şehirli Amazon: Deri & Çelik", desc: "Yumuşak deri tote çanta ve kalın halka çelik bilezikler. Güçlü kadın imajı." },
      { title: "Güneş Işıltısı: Altın Kaplama", desc: "24 ayar altın kaplama görünümlü Xuping setler ve taba rengi omuz çantası." },
      { title: "Mat Siyah & Rose Gold", desc: "Mat siyah deri sırt çantası ve rose gold detaylı çelik tasma kolyeler." },
      { title: "Deniz Yıldızı: Yaz Esintisi", desc: "Mavi mineli çelik halhal ve hasır detaylı küçük el çantası." },
      { title: "Kristal Gece: Zirkon & Saten", desc: "Full zirkon taşlı su yolu bileklik ve saten akşam çantası. 'Gelin görümce' favorisi." },
      { title: "Zebra Desen & Neon Çelik", desc: "Zebra desenli çanta ve neon yeşil mineli çelik piercing-küpe kombinasyonu." },
      { title: "Royal Set: Taç & Yüzük", desc: "Zirkon taşlı saç tokaları (taç) ve beştaş görünümlü Xuping yüzük." },
      // Phase 2
      { title: "Metalik Gece: Clutch & Rodyum", desc: "Gümüş metalik portföy çanta ve rodyum kaplama çelik koker kolye." },
      { title: "Toprak Tonları: Süet & Bakır", desc: "Süet taba çanta ve antik bakır görünümlü çelik halka küpeler." },
      { title: "Modern Sanat: Asimetrik Set", desc: "Asimetrik kesim çelik kolyeler ve şeffaf akrilik detaylı el çantası." },
      { title: "Ofis Starı: Deri Evrak Çantası & Saat", desc: "Şık bir deri evrak çantası ve rose gold çelik kordonlu zarif bir saat." },
      { title: "Bohem Çiçek: Mine & Hasır", desc: "Renkli mineli çiçekli çelik küpeler ve hasır örgü omuz çantası." },
      { title: "Punk Chic: Zımba & Zincir", desc: "Zımbalı deri cüzdan çanta ve çok katmanlı çelik zincir bileklikler." },
      { title: "Mermer Desen: Akrilik & Çelik", desc: "Mermer desenli akrilik yüzükler ve beyaz deri silindir çanta." },
      { title: "Altın Yağmuru: Shakira Bileklik", desc: "Şakira model çelik bileklikler ve altın varaklı siyah gece çantası." },
      { title: "Minimalist Gri: Keçe & Gümüş", desc: "Antrasit keçe çanta ve mat gümüş bitişli ince çelik kolyeler." },
      { title: "Bahar Dalı: Pembe Kuvars", desc: "Pembe taşlı Xuping küpeler ve pudra rengi yumuşak omuz çantası." },
      { title: "Deniz Kabuğu: İthal Set", desc: "Deniz kabuğu formlu ithal kolyeler ve şeffaf plaj çantası tasarımı." },
      { title: "Şehir Savaşçısı: Kelepçe & Sırt Çantası", desc: "Geniş çelik kelepçe bilezikler ve siyah kanvas tasarım sırt çantası." },
      { title: "Kelebek Etkisi: Zirkon Broş", desc: "Zirkon taşlı büyük kelebek broş ve ipek şal ile kombinlenmiş çanta." },
      { title: "Neon Geceler: Şeffaf & Renkli", desc: "Şeffaf PVC çanta ve içinde parlayan renkli mineli çelik yüzükler." },
      { title: "Klasik İnci: Modern Yorum", desc: "Büyük barok inci uçlu çelik zincir ve krokodil desenli bordo çanta." },
      // Phase 3
      { title: "Sultanın Mirası: Otantik Set", desc: "Otantik görünümlü ağır çelik kolyeler ve kadife işlemeli el çantası." },
      { title: "Gelecekten Gelen: Hologram & Çelik", desc: "Hologram efektli çanta ve lazer kesim çelik küpeler." },
      { title: "Doğa Dostu: Keten & Ahşap", desc: "Keten omuz çantası ve ahşap detaylı çelik bileklik kombinasyonu." },
      { title: "Venedik Maskesi: Gizemli Broş", desc: "Maske formlu çelik broş ve dantel detaylı akşam çantası." },
      { title: "Gökkuşağı: Multicolour Xuping", desc: "Çok renkli taşlı Xuping tamtur yüzükler ve renk bloklu çanta." },
      { title: "Siyah İnci: Gizemli Zarafet", desc: "Siyah inci detaylı çelik set ve rugan siyah mini çanta." },
      { title: "Aslan Kral: Figürlü Takı", desc: "Aslan kafası figürlü çelik yüzük ve safari tarzı büyük çanta." },
      { title: "Yıldız Tozu: Simli & Parlak", desc: "Simli deri çanta ve üzerinde parlayan zirkon taşlı yıldız kolyeler." },
      { title: "Geometrik Bahçe: Üçgen & Kare", desc: "Üçgen formlu çelik küpeler ve kare kesim el çantası." },
      { title: "Zeytin Dalı: Barışçıl Tasarım", desc: "Zeytin dalı figürlü çelik halhal ve yeşil deri hobos çanta." },
      { title: "Müzik Notası: Ritmik Takı", desc: "Sol anahtarı figürlü çelik kolye ve nota desenli bez çanta." },
      { title: "Ejderha Nefesi: İddialı Künye", desc: "Ejderha pulu desenli çelik künye ve gotik tarz deri çanta." },
      { title: "Sonsuz Aşk: Kalp & Kilit", desc: "Kilit ve anahtar figürlü çelik bileklik seti ve kırmızı kalp çanta." },
      { title: "Ay ve Yıldız: Gece Gökyüzü", desc: "Ay-yıldız mineli çelik set ve lacivert yıldızlı çanta." },
      { title: "Refika'nın İmzası: Özel Seri", desc: "Refika'nın kendi seçtiği en nadide Xuping parçalar ve sınırlı üretim çanta." }
    ],
    tactics: [
      // Phase 1
      "Müşteriyi dükkanın en aydınlık köşesinde karşıla; Xuping'in gerçek ışıltısı orada çıkar.",
      "Caddeli kadın 'bu kararır mı' diye sormaz, 'altın mı' diye sorar; ona PVD kaplamayı anlat.",
      "Hediye paketine dükkanın özel esansını sık; AVM'nin havasını dağıt Esra!",
      "Çantanın yanına broşu iliştir, 'bu bunun ayrılmaz parçası' diyerek cross-sell patlat.",
      "Sınırlı üretim vurgusu yap; Maltepe kadını pişti olmayı sevmez.",
      "Takıyı müşterinin tenine değil, beyaz bir kumaş üzerine koyarak göster.",
      "Müşterinin ayakkabı rengine göre çanta öner.",
      "Çelik takıların anti-alerjik yapısını vurgula.",
      "Set alana 'bu küpe bu kolyenin ruhu, ayırmayalım' de.",
      "Ürünü verirken 'bu size özel seçildi' de.",
      "Dükkanın aynalarını her 30 dakikada bir sil.",
      "Xuping'in markasını anlatırken 'Dünya çapında bir teknoloji' olduğunu hatırla.",
      "Müşteri çantayı incelerken içine bir cüzdan koyup ağırlığını hissettir.",
      "Kasanın yanına mutlaka 'son dakika' küpeleri koy.",
      "Ayrılan müşterinin arkasından 'Işıltınız daim olsun' diye seslen.",
      // Phase 2
      "Müşteriye aynada bakarken arkasında dur ve takıyı onun boynuna tut, 'tam sizin renginiz' de.",
      "Takının sesini (şıngırtısını) müşteriye dinlet, 'kalitenin sesi bu' fısılda.",
      "Müşteri 'pahalı' derse, 'ucuz olanın ömrü kısa, bu ömürlük bir yatırım' cevabını ver.",
      "Çantayı müşterinin koluna tak ve onu dükkanın içinde bir tur yürüt.",
      "Eski müşterilere 'isminize özel indirim' değil, 'isminize özel yeni bir koleksiyon geldi' de.",
      "Müşterinin stilini analiz et ve 'sizin tarzınız daha çok avangart, şu parça sizi tamamlar' de.",
      "Ödeme yaparken müşteriye küçük bir 'Refika şans bilekliği' hediye et.",
      "Vitrindeki ürünü isteyen müşteriye 'bu son parça, sizin için ayırmıştık sanki' hissi ver.",
      "Müşteri kararsızsa, iki ürünü de göster ve 'biri gündüz şıklığı, diğeri gece asaleti' diyerek ikisini de sat.",
      "Takıyı paketlemeden önce ipek bir bezle son kez parlat ve müşteriye izlet.",
      "Mağaza önünden geçenlere 'içerideki yeni enerjiyi hissetmek ister misiniz?' diye gülümse.",
      "Müşteriye takıyı denetirken 'bu parça sizin özgüveninizi vitrine koyuyor' de.",
      "Çantanın dikiş kalitesini ve astar dokusunu özellikle göster.",
      "Müşteriye 'bu kombinle katıldığınız davette tüm gözler üzerinizde olacak' vaadini ver.",
      "Mağaza içinde müşteriye mutlaka bir bardak su veya kahve teklif et, ortamı evine çevir.",
      // Phase 3
      "Müşteri 'bu çelik mi?' diye sorduğunda, 'mücevher zekasıyla işlenmiş 316L cerrahi çelik' de.",
      "Kombini yaparken 'bu kolye sizi 5 yaş genç, bu çanta ise 10 kat daha şık gösterir' şakası yap.",
      "Müşteriye 'bu takı sizin imzanız olacak, her taktığınızda bizi hatırlayacaksınız' de.",
      "Takıyı gösterirken müşterinin göz hizasına getir ve 'ışığın içinde kaybolun' de.",
      "Müşteri eşine hediye alıyorsa, 'eşinizin zarafetine ancak bu yakışır' diyerek çıtayı yükselt.",
      "Dükkana giren her müşteriye 'hoş geldiniz prenses/kraliçem' yerine 'hoş geldiniz ikonik hanımefendi' de.",
      "Takıyı paketlerken müşteriye 'bu paket sadece bir kutu değil, bir mutluluk Reçetesi' de.",
      "Müşteri 'başka bir dükkanda gördüm' derse, 'onlar trendleri takip eder, biz trendleri yaratırız' cevabını ver.",
      "Müşteriye 'bu takıyı taktığınızda aynaya değil, insanların gözlerine bakın' tavsiyesi ver.",
      "Çantanın fonksiyonelliğini anlatırken 'içine dünyaları, dışına ise asaletinizi sığdırın' de.",
      "Müşteriye 'bu parça dükkanın ruhu, onu size emanet ediyorum' diyerek bağ kur.",
      "Takıyı denerken müşteriye 'bu parça sizin sesinizi değil, tarzınızı konuşturacak' de.",
      "Müşteri 'indirim' isterse, 'zevkin indirimi olmaz ama dostluğun hatırı olur' diyerek küçük bir jest yap.",
      "Mağazadan ayrılan müşteriye 'bir sonraki ışıltılı karşılaşmamıza kadar hoşça kalın' de.",
      "Refika'nın bir taktiği: 'Müşteriye asla hayır demeyin, sadece daha iyisini gösterin.'"
    ],
    sassyNotes: [
      "Kızım, bu kombinle dükkandan çıkan kadının arkasından ordu takılır. Güven bana!",
      "Müşteri 'pahalı' mı dedi? Ona Modaring.com fiyatlarını göster, ayrıcalığını hissettir.",
      "Ben dul kaldım ama zevkimi kaybetmedim; bu parça dükkanın en asil ruhudur.",
      "Şu mankenin üzerine bu seti tak, yanına da o taba çantayı koy; bak nasıl bitiyor.",
      "Bak Esra, bu fikir dükkanda kalırsa gel benim yüzüme tükür. Hemen vitrine!",
      "Benim altınlarım gitti ama gözüm hala keskin; bu takı dükkanı zengin gösterir.",
      "Caddeli kadın bu kombini görse butiği komple satın alır, şanslısın ki Maltepe'deyiz!",
      "Şu taşların parıltısı rakiplerin gözünü alır, dükkana güneş gözlüğüyle girmesinler sakın.",
      "Bu çanta omuzda değil, bir 'statement' olarak taşınmalı. Öyle anlat müşteriye.",
      "Kızım, zevk parayla alınmaz ama bu kombinle alınmış gibi hissettiririz.",
      "Aman Esra, bu takıyı sakın o ucuz bujiterilerle yan yana koyma; asaletine gölge düşer.",
      "Benim rahmetli bey bile bu kombin karşısında diz çökerdi, öyle bir güç bu!",
      "Müşteri 'kararır mı' dediğinde hafif bir kahkaha at, 'Refika'nın olduğu yerde kararmaya yer yok' de.",
      "Bu kolye boyunda değil, kadının ruhunda parlamalı. Refika felsefesi budur!",
      "Hadi canım, bu fikirle dükkanda ciro patlamazsa emekli olurum. Hemen uygula!"
    ]
  }), []);

  const handleGenerate = () => {
    setGenerating(true);
    setResult(null);
    
    setTimeout(() => {
      const ctx = refikaBrain.contexts[Math.floor(Math.random() * refikaBrain.contexts.length)];
      const conc = refikaBrain.concepts[Math.floor(Math.random() * refikaBrain.concepts.length)];
      const tac = refikaBrain.tactics[Math.floor(Math.random() * refikaBrain.tactics.length)];
      const sassy = refikaBrain.sassyNotes[Math.floor(Math.random() * refikaBrain.sassyNotes.length)];
      
      const baseCost = Math.floor(Math.random() * (150 - 50) + 50);
      const retailPrice = Math.round((baseCost * (Math.random() * (4.5 - 2.8) + 2.8)) / 10) * 10 + 9;
      
      setResult({
        id: Date.now(),
        context: ctx,
        title: conc.title,
        desc: conc.desc,
        cost: `${baseCost} ₺`,
        price: `${retailPrice} ₺`,
        strategy: tac,
        sassy: sassy,
        date: new Date().toLocaleDateString('tr-TR')
      });
      
      setGenerating(false);
      toast.success('Refika harika bir strateji fısıldadı! 🧚');
    }, 1200);
  };

  const saveIdea = () => {
    if (!result) return;
    const isAlreadySaved = savedIdeas.some(i => i.title === result.title && i.desc === result.desc);
    if (isAlreadySaved) {
      toast.error('Refika bu fikri zaten kaydetmişti tatlım! 🧚');
      return;
    }
    
    addModaringRefika(result);
    toast.success('Fikir Refika\'nın Ajandasına kaydedildi! 💎');
  };

  const deleteIdea = (e, id) => {
    e.stopPropagation();
    deleteModaringRefika(id);
    toast.success('Refika fikri çöpe attı! ✨');
  };

  return (
    <div className="tab-view-content animate-fadeIn refika-vibe">
      {/* 🧚 Refika Profile & Bio */}
      <div className="refika-profile-card glass animate-pop">
        <div className="rpc-header">
          <div className="refika-avatar-box large">
            <img src="/assets/refika.png" alt="Refika" className="refika-img" />
            <div className="refika-status-dot large"></div>
          </div>
          <div className="rpc-title">
            <h2>Dul Refika</h2>
            <span className="badge-expert">SHOW-OFF & SATIŞ UZMANI</span>
          </div>
        </div>
        <div className="rpc-bio">
          <p>{refikaBio}</p>
        </div>
      </div>

      {/* 🎯 Single Action Zone */}
      <div className="refika-consult-zone mt-32">
        <div className="refika-btn-wrapper">
          <div className="refika-btn-glow"></div>
          <button 
            className={`refika-main-btn-v2 ${generating ? 'loading' : ''}`} 
            onClick={handleGenerate} 
            disabled={generating}
          >
            <div className="btn-icon-stack">
              {generating ? <RefreshCw className="animate-spin" size={28} /> : <Sparkles size={28} className="sparkle-icon" />}
            </div>
            <div className="btn-text-stack">
              <span className="btn-main-text">{generating ? 'Zeka Motoru Analiz Ediyor...' : 'Refika\'nın Zekasına Sor'}</span>
              <span className="btn-sub-text">Maksimum Katmanlı Pazar Analizi</span>
            </div>
          </button>
        </div>

        <p className="consult-note-v2">
          <Zap size={14} className="zap-icon" /> 
          <span>Refika; Maltepe AVM trafiğini, global trendleri ve dükkanın o anki ruhunu süzerek benzersiz bir reçete hazırlar.</span>
        </p>

        {result && (
          <div className="refika-result-container animate-slideUp">
            <div className="rr-seal"><Award size={24} /></div>
            
            <div className="rr-header">
              <div className="rr-title">
                <strong><Sparkles size={16} /> {result.title}</strong>
                <small>Refika'nın İkonik Reçetesi • {result.date}</small>
              </div>
            </div>

            <div className="rr-context-box mb-16">
              <p>📍 <strong>Durum Analizi:</strong> {result.context}</p>
            </div>
            
            <div className="rr-grid">
              <div className="rr-item"><strong>💡 Tasarım & Kombin:</strong> <p>{result.desc}</p></div>
              <div className="rr-item"><strong>💰 Tedarik Maliyeti:</strong> <p>{result.cost}</p></div>
              <div className="rr-item highlight-price">
                <strong>🏷️ Önerilen Satış Fiyatı:</strong> 
                <p>{result.price}</p>
              </div>
              <div className="rr-item tactic-box">
                <strong>🎯 Satış & Psikoloji Taktikleri:</strong> 
                <p>{result.strategy}</p>
              </div>
            </div>
            
            <div className="rr-footer-sassy">
              <p>"{result.sassy}" — Refika</p>
            </div>

            <button className="save-idea-btn-v2 mt-20" onClick={saveIdea}>
              <Gem size={18} />
              <span>Bu Fikri Arşive Kilitle</span>
            </button>
          </div>
        )}
      </div>

      {/* 📒 Strategy Archive (Refika's Vault) */}
      {savedIdeas.length > 0 && (
        <div className="refika-vault-section mt-64 mb-100">
          <div className="vault-header">
            <div className="vh-title">
              <Layers size={20} className="emerald-icon" />
              <h3>Strateji Arşivi</h3>
            </div>
            <span className="vault-count">{savedIdeas.length} Uzman Reçetesi</span>
          </div>
          
          <div className="vault-grid">
            {savedIdeas.map(idea => (
              <div 
                key={idea.id} 
                className="vault-card animate-pop"
                onClick={() => setViewingIdea(idea)}
              >
                <div className="vc-tag">UZMAN NOTU</div>
                <div className="vc-body">
                  <h4>{idea.title}</h4>
                  <p>{idea.desc.substring(0, 65)}...</p>
                </div>
                <div className="vc-footer">
                  <div className="vc-price">{idea.price}</div>
                  <div className="vc-date">{idea.date}</div>
                  <button className="vc-delete" onClick={(e) => deleteIdea(e, idea.id)}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🖼️ Full Detail Modal Overlay */}
      {viewingIdea && (
        <div className="refika-overlay animate-fadeIn" onClick={() => setViewingIdea(null)}>
          <div className="refika-modal-container animate-pop" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewingIdea(null)}><X size={24} /></button>
            
            <div className="refika-result-container modal-style">
              <div className="rr-seal"><Award size={24} /></div>
              
              <div className="rr-header">
                <div className="rr-title">
                  <strong><Sparkles size={16} /> {viewingIdea.title}</strong>
                  <small>Kayıtlı Reçete • {viewingIdea.date}</small>
                </div>
              </div>

              <div className="rr-context-box mb-16">
                <p>📍 <strong>Durum Analizi:</strong> {viewingIdea.context}</p>
              </div>
              
              <div className="rr-grid">
                <div className="rr-item"><strong>💡 Tasarım & Kombin:</strong> <p>{viewingIdea.desc}</p></div>
                <div className="rr-item"><strong>💰 Tedarik Maliyeti:</strong> <p>{viewingIdea.cost}</p></div>
                <div className="rr-item highlight-price">
                  <strong>🏷️ Önerilen Satış Fiyatı:</strong> 
                  <p>{viewingIdea.price}</p>
                </div>
                <div className="rr-item tactic-box">
                  <strong>🎯 Satış & Psikoloji Taktikleri:</strong> 
                  <p>{viewingIdea.strategy}</p>
                </div>
              </div>
              
              <div className="rr-footer-sassy">
                <p>"{viewingIdea.sassy}" — Refika</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendTab;
