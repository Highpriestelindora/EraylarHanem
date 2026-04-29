/**
 * Yekta Tilmen v3.0 - The Life Strategist Brain
 * Deep integration with all life sectors: Health, Social, Balance, Career, and Spirit.
 */

const COACHING_INSIGHTS = {
  health: [
    "Vücudun senin tek gerçek evin. Ona iyi bakmak bir tercih değil, bir zorunluluktur.",
    "Bugün içtiğin her bardak su, yarınki enerjine yapılan bir yatırımdır.",
    "Protein alımı sadece kaslar için değil, zihinsel berraklık için de kritiktir. Bugün tabağına odaklan.",
    "Uykunu ihmal etmek, gelecekteki huzurundan borç almaktır. Bu gece erken kapanış yapalım mı?",
    "Hareketsizlik paslandırır. Sadece 15 dakikalık bir yürüyüş bile ruhunu tazeleyecektir."
  ],
  social: [
    "İnsan sosyal bir varlıktır. En son ne zaman sadece gülmek için bir araya geldin?",
    "Sosyal havuzundaki aktiviteler sadece vakit geçirmek için değil, bağlarını güçlendirmek içindir.",
    "Bugün sevdiğin birine 'nasılsın' demek yerine 'seni takdir ediyorum' demeyi dene.",
    "Yalnızlık bazen iyidir ama uzun sürerse zihni yorar. Bir doz sosyallik reçete ediyorum."
  ],
  balance: [
    "İş bir yarıştır ama hayat bir maratondur. Depar atmak yerine tempoyu koru.",
    "Ekran başındaki her saat, gerçek hayattan çalınmış bir saattir. Sınırlarını çiz.",
    "Başarı sadece rakamlarla ölçülmez; akşam yemeğindeki huzurun en büyük başarıdır.",
    "Hayır demeyi öğrenmek, kendine evet demenin ilk adımıdır. Bugün bir sınır çiz."
  ],
  growth: [
    "Konfor alanı güzel bir yerdir ama orada hiçbir şey yetişmez.",
    "Hata yapmak, denediğinin kanıtıdır. Mükemmel olmayı değil, gelişmeyi hedefle.",
    "Zihnin bir bahçedir; bugün oraya hangi düşünce tohumlarını ektin?",
    "Öğrenmeyi bıraktığın gün, yaşlanmaya başladığın gündür. Bugün yeni bir şey keşfet."
  ],
  personality_tips: {
    "Planlı Stratejist": [
      "Planların harika ama hayatın sürprizlerine de küçük bir boşluk bırak.",
      "Kontrol etme arzusunu bir kenara bırakıp akışın tadını çıkarmayı dene.",
      "Mükemmeliyetçilik bazen ilerlemenin önündeki en büyük engeldir."
    ],
    "Sosyal Keşifçi": [
      "Yeni yerler keşfederken kendi iç dünyanı keşfetmeyi de unutma.",
      "Enerjin bulaşıcı ama kendi enerjini korumayı da öğrenmelisin.",
      "Derin bağlar, yüzeysel tanışıklıklardan daha fazla huzur verir."
    ],
    "Yaratıcı Vizyoner": [
      "Fikirlerin uçsuz bucaksız ama onları gerçeğe dönüştürmek için disiplin gerekir.",
      "Kaosun içindeki düzeni görebiliyorsun, bu senin süper gücün.",
      "Zihnini bazen sessizliğe bırak, en büyük fikirler orada doğar."
    ],
    "Uyumlu Arabulucu": [
      "Başkalarının mutluluğu senin sorumluluğun değil, önce kendi kupanı doldur.",
      "Çatışmadan kaçmak bazen sorunları büyütür, nazikçe dürüst ol.",
      "Senin de hayallerin var, onları başkalarınınkilerin arkasına saklama."
    ]
  }
};

export const generateYektaAdvice = (state) => {
  const { ev, sosyal, saglik, currentUser } = state;
  const isEsra = currentUser?.name?.toLowerCase().includes('esra');
  const userKey = isEsra ? 'esra' : 'gorkem';
  const name = currentUser?.name?.split(' ')[0] || 'Dostum';
  const personality = ev?.tracking?.personality || {};

  const advices = [];

  // 1. DYNAMIC SYSTEM ALERTS (Priority 100)
  const medications = saglik?.ilaclar || [];
  const lowMed = medications.find(i => i.kisi.toLowerCase().includes(userKey) && i.stok < i.minStok);
  if (lowMed) {
    advices.push({
      type: 'critical',
      text: `Yekta Analizi: ${lowMed.ad} stoğun kritik seviyede (${lowMed.stok}). Bu senin sağlığın, ihmal etme.`,
      icon: '💊',
      priority: 100
    });
  }

  // 2. DATA-DRIVEN LIFE BALANCE (Priority 90)
  const timeStats = ev?.tracking?.timeAnalysis?.[userKey] || { home: 40, work: 40, other: 20 };
  if (timeStats.work > 55) {
    advices.push({
      type: 'balance',
      text: `Yekta: Çalışma oranınız %${timeStats.work}'e vurdu. Bu tempoyla sarsılırsınız! Acil bir "dur ve nefes al" molası şart.`,
      icon: '⚖️',
      priority: 95
    });
  }

  // 3. PERSONALITY INTEGRATED WISDOM (Priority 80)
  if (personality.type && COACHING_INSIGHTS.personality_tips[personality.type]) {
    const tips = COACHING_INSIGHTS.personality_tips[personality.type];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    advices.push({
      type: 'growth',
      text: `Yekta: Bir ${personality.type} olarak sana tavsiyem; ${randomTip}`,
      icon: '🧠',
      priority: 85
    });
  }

  // 4. SOCIAL & CONNECTION (Priority 70)
  const socialPool = sosyal?.poolItems || [];
  if (socialPool.length > 0) {
    const randomAct = socialPool[Math.floor(Math.random() * socialPool.length)];
    advices.push({
      type: 'social',
      text: `Dostum, sosyal havuzunda "${randomAct.title}" fikrini gördüm. Tam senin kalemine göre bir aktivite!`,
      icon: '🎭',
      priority: 75
    });
  }

  // 5. GENERAL COACHING POOL (Fallback/Variety)
  const categories = ['health', 'social', 'balance', 'growth'];
  categories.forEach(cat => {
    const pool = COACHING_INSIGHTS[cat];
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    advices.push({
      type: cat,
      text: `Yekta Der ki: ${randomPick}`,
      icon: cat === 'health' ? '🥗' : (cat === 'social' ? '🤝' : (cat === 'balance' ? '⏳' : '🌱')),
      priority: 50 + Math.random() * 10
    });
  });

  // If no personality test yet
  if (!personality.type) {
    advices.push({
      type: 'growth',
      text: "Yekta: Henüz seni tam tahlil edemedim. Kişilik testini çözersen, zihninin en derin köşelerine uygun stratejiler kurabiliriz.",
      icon: '🔍',
      priority: 92
    });
  }

  // Return all prioritized and shuffled for variety
  return advices.sort((a, b) => b.priority - a.priority);
};
