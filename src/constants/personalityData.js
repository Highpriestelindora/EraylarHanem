export const PERSONALITY_TESTS = [
  {
    id: 'big5',
    title: 'Beş Büyük Faktör',
    desc: 'Temel karakter yapınız ve dünyaya bakış açınız.',
    icon: '📁',
    questions: [
      { id: 1, text: "Genellikle kalabalık ortamlarda enerji toplarım.", cat: "extraversion" },
      { id: 2, text: "Yeni deneyimler ve maceralar beni heyecanlandırır.", cat: "openness" },
      { id: 3, text: "Stresli anlarda bile planlı hareket ederim.", cat: "conscientiousness" },
      { id: 4, text: "Başkalarının duygularını anlamak benim için önemlidir.", cat: "agreeableness" },
      { id: 5, text: "Zor durumlar karşısında hızlıca toparlanırım.", cat: "neuroticism" },
      { id: 6, text: "Detaylara dikkat etmek başarımı artırır.", cat: "conscientiousness" },
      { id: 7, text: "Sanatsal faaliyetler hayatımın önemli bir parçasıdır.", cat: "openness" },
      { id: 8, text: "İnsanlarla tanışmak benim için çok doğaldır.", cat: "extraversion" },
      { id: 9, text: "Tartışmalarda orta yolu bulmaya çalışırım.", cat: "agreeableness" },
      { id: 10, text: "Geleceği planlamak yerine anı yaşamayı tercih ederim.", cat: "conscientiousness", reverse: true }
    ]
  },
  {
    id: 'leader',
    title: 'Liderlik & Vizyon',
    desc: 'Karar alma mekanizmanız ve gelecek vizyonunuz.',
    icon: '📂',
    questions: [
      { id: 1, text: "Zor kararlar alırken sorumluluk almaktan çekinmem.", cat: "authority" },
      { id: 2, text: "Grup çalışmalarında genellikle yön veren kişi olurum.", cat: "authority" },
      { id: 3, text: "Uzun vadeli hedeflerim her zaman nettir.", cat: "vision" },
      { id: 4, text: "Eleştirileri kişisel algılamam, gelişim fırsatı görürüm.", cat: "resilience" },
      { id: 5, text: "Risk alırken genellikle sezgilerime güvenirim.", cat: "vision" },
      { id: 6, text: "Başarıyı ekip arkadaşlarımın başarısında görürüm.", cat: "empathy" },
      { id: 7, text: "Kaotik durumlarda sakin kalıp çözüm üretebilirim.", cat: "resilience" },
      { id: 8, text: "Başkalarını motive etmekte başarılıyımdır.", cat: "empathy" },
      { id: 9, text: "Stratejik düşünmek benim için bir yaşam biçimidir.", cat: "vision" },
      { id: 10, text: "Geleneksel yöntemler yerine yenilikçi yolları denerim.", cat: "vision" }
    ]
  },
  {
    id: 'eq',
    title: 'Duygusal Zeka (EQ)',
    desc: 'Kendinizi ve başkalarını ne kadar iyi anlıyorsunuz?',
    icon: '📁',
    questions: [
      { id: 1, text: "Duygularımın ne zaman değiştiğini hemen fark ederim.", cat: "self_awareness" },
      { id: 2, text: "Başkalarının beden dilini okumakta başarılıyımdır.", cat: "social_awareness" },
      { id: 3, text: "Öfkelendiğimde kendimi hızlıca sakinleştirebilirim.", cat: "self_regulation" },
      { id: 4, text: "Karşımdaki kişinin ne hissettiğini sormadan anlarım.", cat: "empathy" },
      { id: 5, text: "Zor konuşmalarda soğukkanlılığımı koruyabilirim.", cat: "social_skills" },
      { id: 6, text: "Kendi zayıf yönlerimi açıkça kabul edebilirim.", cat: "self_awareness" },
      { id: 7, text: "İnsanları dinlerken sadece kelimelere değil, hislere odaklanırım.", cat: "empathy" },
      { id: 8, text: "Grup içindeki gerginlikleri yumuşatabilirim.", cat: "social_skills" },
      { id: 9, text: "Karar alırken mantığım kadar hislerimi de dinlerim.", cat: "self_awareness" },
      { id: 10, text: "Başkalarının başarısından içtenlikle mutlu olurum.", cat: "social_awareness" }
    ]
  },
  {
    id: 'stress',
    title: 'Stres & Dayanıklılık',
    desc: 'Baskı altında ne kadar güçlü kalabiliyorsunuz?',
    icon: '📂',
    questions: [
      { id: 1, text: "Beklenmedik değişiklikler beni strese sokmaz.", cat: "flexibility" },
      { id: 2, text: "Yoğun iş yükü altında odaklanmamı koruyabilirim.", cat: "focus" },
      { id: 3, text: "Olumsuz sonuçlar karşısında motivasyonum düşmez.", cat: "optimism" },
      { id: 4, text: "Yardım istemek benim için bir zayıflık değildir.", cat: "resourcefulness" },
      { id: 5, text: "Sorunlara odaklanmak yerine çözümlere odaklanırım.", cat: "problem_solving" },
      { id: 6, text: "Baskı altındayken daha verimli çalışırım.", cat: "focus" },
      { id: 7, text: "Gelecek kaygısı beni felç etmez, harekete geçirir.", cat: "optimism" },
      { id: 8, text: "Zor bir günden sonra kendimi rahatlatacak yöntemlerim vardır.", cat: "flexibility" },
      { id: 9, text: "Belirsizlik benim için bir korku değil, bir fırsattır.", cat: "optimism" },
      { id: 10, text: "Eleştirileri yapıcı bir şekilde filtreleyebilirim.", cat: "resourcefulness" }
    ]
  },
  {
    id: 'social',
    title: 'Sosyal Uyum & İlişkiler',
    desc: 'İnsanlarla olan bağlarınızın kalitesi.',
    icon: '📁',
    questions: [
      { id: 1, text: "Yeni ortamlarda kendimi kolayca ifade edebilirim.", cat: "confidence" },
      { id: 2, text: "Uzun süreli ve derin dostluklarım vardır.", cat: "loyalty" },
      { id: 3, text: "Başkalarının fikirlerine katılmasam da saygı duyarım.", cat: "tolerance" },
      { id: 4, text: "İnsanlara güvenmekte zorluk çekmem.", cat: "trust" },
      { id: 5, text: "Gerektiğinde 'hayır' demeyi bilirim.", cat: "boundaries" },
      { id: 6, text: "Paylaşmayı ve yardımlaşmayı severim.", cat: "generosity" },
      { id: 7, text: "İlişkilerimde açık ve dürüst iletişim kurarım.", cat: "honesty" },
      { id: 8, text: "Başkalarının hayatındaki önemli anları hatırlarım.", cat: "attention" },
      { id: 9, text: "Kıskançlık duygusuyla kolayca başa çıkabilirim.", cat: "security" },
      { id: 10, text: "Zor zamanlarda dostlarıma güvenebilirim.", cat: "trust" }
    ]
  }
];
