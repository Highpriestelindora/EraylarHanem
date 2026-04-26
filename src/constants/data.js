
export const REYON_ORDER = [
  'Sebze/Meyve', 'Et & Şarküteri', 'Süt Ürünleri', 'Kahvaltılık',
  'Soslar', 'İçecekler', 'Temel Gıda', 'Baharat', 'Yağlar',
  'Çay & Kahve', 'Atıştırmalık', 'Konserve & Turşu', 'Dondurulmuş',
  'Temizlik', 'Bulaşık', 'Ambalaj', 'Evcil Hayvan', 'Diğer'
];

export const REYON_IC = {
  'Sebze/Meyve': '🥬', 'Et & Şarküteri': '🥩', 'Süt Ürünleri': '🥛', 
  'Kahvaltılık': '🍳', 'Soslar': '🥫', 'İçecekler': '🥤',
  'Temel Gıda': '🫙', 'Baharat': '🌶️', 'Yağlar': '🫗',
  'Çay & Kahve': '☕', 'Atıştırmalık': '🍪', 'Konserve & Turşu': '🫙',
  'Dondurulmuş': '❄️', 'Temizlik': '🧹', 'Bulaşık': '🧴', 
  'Ambalaj': '📦', 'Evcil Hayvan': '🐾', 'Diğer': '📋'
};

export const INITIAL_RECIPES = [
  {
    "n": "Makarna Bolonez",
    "c": "makarna",
    "t": 25,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Kıyma:200 gram",
      "Domates:3 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 1
  },
  {
    "n": "Kremalı Makarna",
    "c": "makarna",
    "t": 20,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Krema:200 ml",
      "Kaşar:75 gram",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 2
  },
  {
    "n": "Soslu Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Salça:2 yemek kaşığı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 3
  },
  {
    "n": "Mantarlı Makarna",
    "c": "makarna",
    "t": 20,
    "d": 1,
    "e": "🍄",
    "ig": [
      "Makarna:250 gram",
      "Mantar:200 gram",
      "Soğan:1 adet",
      "Krema:100 ml"
    ],
    "f": false,
    "p": 20,
    "id": 4
  },
  {
    "n": "Fırın Makarna",
    "c": "makarna",
    "t": 40,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:300 gram",
      "Kaşar:150 gram",
      "Yumurta:2 adet",
      "Süt:200 ml"
    ],
    "f": false,
    "p": 20,
    "id": 5
  },
  {
    "n": "Ton Balıklı Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Ton Balığı:1 kutu",
      "Mısır:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 6
  },
  {
    "n": "Peynirli Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Beyaz Peynir:100 gram",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 7
  },
  {
    "n": "Sebzeli Makarna",
    "c": "makarna",
    "t": 20,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Kabak:1 adet",
      "Havuç:1 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 8
  },
  {
    "n": "Pirinç Pilavı",
    "c": "pilav",
    "t": 25,
    "d": 1,
    "e": "🍚",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Tereyağı:2 yemek kaşığı",
      "Tuz:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 9
  },
  {
    "n": "Bulgur Pilavı",
    "c": "pilav",
    "t": 20,
    "d": 1,
    "e": "🌾",
    "ig": [
      "Bulgur:1.5 su bardağı",
      "Soğan:1 adet",
      "Salça:1 yemek kaşığı",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 10
  },
  {
    "n": "Kuru Fasulye",
    "c": "pilav",
    "t": 50,
    "d": 2,
    "e": "🫘",
    "ig": [
      "Fasulye:250 gram",
      "Soğan:1 adet",
      "Salça:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 11
  },
  {
    "n": "Etli Nohut",
    "c": "pilav",
    "t": 45,
    "d": 2,
    "e": "🫘",
    "ig": [
      "Nohut:250 gram",
      "Dana Eti:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 12
  },
  {
    "n": "Türlü",
    "c": "pilav",
    "t": 40,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Patates:2 adet",
      "Kabak:1 adet",
      "Biber:2 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 13
  },
  {
    "n": "Tavuk Sote",
    "c": "tava",
    "t": 25,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:300 gram",
      "Biber:2 adet",
      "Domates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 14
  },
  {
    "n": "Köfte",
    "c": "tava",
    "t": 25,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Soğan:1 adet",
      "Yumurta:1 adet",
      "Tuz:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 15
  },
  {
    "n": "Sebzeli Tavuk",
    "c": "tava",
    "t": 30,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Tavuk:300 gram",
      "Biber:2 adet",
      "Soğan:1 adet",
      "Kabak:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 16
  },
  {
    "n": "Yumurtalı Patates",
    "c": "tava",
    "t": 20,
    "d": 1,
    "e": "🥔",
    "ig": [
      "Patates:3 adet",
      "Yumurta:4 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 17
  },
  {
    "n": "Sucuklu Yumurta",
    "c": "tava",
    "t": 10,
    "d": 1,
    "e": "🍳",
    "ig": [
      "Yumurta:4 adet",
      "Sucuk:100 gram",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 18
  },
  {
    "n": "Mercimek Çorbası",
    "c": "corba",
    "t": 25,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Mercimek:1 su bardağı",
      "Soğan:1 adet",
      "Patates:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 19
  },
  {
    "n": "Domates Çorbası",
    "c": "corba",
    "t": 20,
    "d": 1,
    "e": "🍅",
    "ig": [
      "Domates:4 adet",
      "Süt:150 ml",
      "Un:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 20
  },
  {
    "n": "Tarhana Çorbası",
    "c": "corba",
    "t": 15,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Tarhana:4 yemek kaşığı",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 21
  },
  {
    "n": "Ezogelin Çorbası",
    "c": "corba",
    "t": 30,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Mercimek:1 su bardağı",
      "Bulgur:2 yemek kaşığı",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 22
  },
  {
    "n": "Tavuk Suyu Çorba",
    "c": "corba",
    "t": 35,
    "d": 2,
    "e": "🐔",
    "ig": [
      "Tavuk:300 gram",
      "Havuç:1 adet",
      "Limon:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 23
  },
  {
    "n": "Tavuk Dürüm",
    "c": "tost",
    "t": 15,
    "d": 1,
    "e": "🌯",
    "ig": [
      "Tavuk:250 gram",
      "Lavaş:2 adet",
      "Domates:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 24
  },
  {
    "n": "Kaşarlı Tost",
    "c": "tost",
    "t": 8,
    "d": 1,
    "e": "🥪",
    "ig": [
      "Kaşar:6 dilim",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 25
  },
  {
    "n": "Bazlama Sandwich",
    "c": "tost",
    "t": 10,
    "d": 1,
    "e": "🫓",
    "ig": [
      "Bazlama:2 adet",
      "Peynir:100 gram",
      "Domates:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 26
  },
  {
    "n": "Kaygana",
    "c": "yumurta",
    "t": 10,
    "d": 1,
    "e": "🥞",
    "ig": [
      "Yumurta:4 adet",
      "Un:3 yemek kaşığı",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 27
  },
  {
    "n": "Ispanaklı Yumurta",
    "c": "yumurta",
    "t": 15,
    "d": 1,
    "e": "🥬",
    "ig": [
      "Yumurta:4 adet",
      "Ispanak:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 28
  },
  {
    "n": "Fırın Tavuk",
    "c": "firin",
    "t": 60,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:600 gram",
      "Patates:4 adet",
      "Biber:2 adet",
      "Zeytinyağı:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 29
  },
  {
    "n": "Karnıyarık",
    "c": "firin",
    "t": 50,
    "d": 3,
    "e": "🍆",
    "ig": [
      "Patlıcan:4 adet",
      "Kıyma:250 gram",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 30
  },
  {
    "n": "Fırın Köfte",
    "c": "firin",
    "t": 40,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Patates:3 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 31
  },
  {
    "n": "Tepsi Kebabı",
    "c": "firin",
    "t": 55,
    "d": 3,
    "e": "🥩",
    "ig": [
      "Kıyma:400 gram",
      "Domates:3 adet",
      "Biber:3 adet"
    ],
    "f": false,
    "p": 20,
    "id": 32
  },
  {
    "n": "Su Böreği",
    "c": "hamur",
    "t": 70,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Yumurta:3 adet",
      "Peynir:300 gram",
      "Süt:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 33
  },
  {
    "n": "Pide",
    "c": "hamur",
    "t": 45,
    "d": 3,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:250 gram",
      "Yumurta:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 34
  },
  {
    "n": "Gözleme",
    "c": "hamur",
    "t": 35,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Peynir:150 gram",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 35
  },
  {
    "n": "Yaprak Sarma",
    "c": "dolma",
    "t": 80,
    "d": 3,
    "e": "🫔",
    "ig": [
      "Pirinç:1 su bardağı",
      "Soğan:3 adet",
      "Zeytinyağı:4 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 36
  },
  {
    "n": "Biber Dolma",
    "c": "dolma",
    "t": 50,
    "d": 3,
    "e": "🫑",
    "ig": [
      "Pirinç:1 su bardağı",
      "Biber:8 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 37
  },
  {
    "n": "Mantı",
    "c": "ozel",
    "t": 100,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:200 gram",
      "Yoğurt:300 gram"
    ],
    "f": false,
    "p": 20,
    "id": 38
  },
  {
    "n": "Izgara Köfte",
    "c": "izgara",
    "t": 25,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 39
  },
  {
    "n": "Tavuk Kanat",
    "c": "izgara",
    "t": 35,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 40
  },
  {
    "n": "Çoban Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Domates:3 adet",
      "Salatalık:2 adet",
      "Soğan:1 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 41
  },
  {
    "n": "Tas Kebabı",
    "c": "ana_yemek",
    "t": 60,
    "d": 2,
    "e": "🍖",
    "ig": [
      "Dana Eti:300 gram",
      "Soğan:1 adet",
      "Domates:2 adet",
      "Yağ:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 42
  },
  {
    "n": "İzmir Köfte",
    "c": "ana_yemek",
    "t": 50,
    "d": 2,
    "e": "🍲",
    "ig": [
      "Kıyma:300 gram",
      "Patates:3 adet",
      "Domates:2 adet",
      "Biber:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 43
  },
  {
    "n": "Tavuk Haşlama",
    "c": "ana_yemek",
    "t": 45,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Havuç:2 adet",
      "Patates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 44
  },
  {
    "n": "Et Sote",
    "c": "ana_yemek",
    "t": 30,
    "d": 1,
    "e": "🥩",
    "ig": [
      "Dana Eti:300 gram",
      "Biber:2 adet",
      "Soğan:1 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 45
  },
  {
    "n": "İmam Bayıldı",
    "c": "ana_yemek",
    "t": 60,
    "d": 2,
    "e": "🍆",
    "ig": [
      "Patlıcan:3 adet",
      "Soğan:2 adet",
      "Zeytinyağı:4 yemek kaşığı",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 46
  },
  {
    "n": "Patates Oturtma",
    "c": "ana_yemek",
    "t": 45,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Kıyma:250 gram",
      "Patates:4 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 47
  },
  {
    "n": "Tavuk Güveç",
    "c": "ana_yemek",
    "t": 50,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:400 gram",
      "Biber:2 adet",
      "Domates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 48
  },
  {
    "n": "Sac Kavurma",
    "c": "ana_yemek",
    "t": 35,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Dana Eti:350 gram",
      "Soğan:1 adet",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 49
  },
  {
    "n": "Kapuska",
    "c": "ana_yemek",
    "t": 40,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Lahana:500 gram",
      "Kıyma:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 50
  },
  {
    "n": "Bamya Yemeği",
    "c": "ana_yemek",
    "t": 35,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Bamya:300 gram",
      "Domates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 51
  },
  {
    "n": "Patlıcan Musakka",
    "c": "ana_yemek",
    "t": 45,
    "d": 2,
    "e": "🍆",
    "ig": [
      "Patlıcan:3 adet",
      "Kıyma:250 gram",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 52
  },
  {
    "n": "Patates Yemeği",
    "c": "ana_yemek",
    "t": 30,
    "d": 1,
    "e": "🥔",
    "ig": [
      "Patates:4 adet",
      "Soğan:1 adet",
      "Salça:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 53
  },
  {
    "n": "Tavuk Kapama",
    "c": "ana_yemek",
    "t": 50,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Pirinç:1 su bardağı",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 54
  },
  {
    "n": "Etli Taze Fasulye",
    "c": "ana_yemek",
    "t": 45,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Fasulye:400 gram",
      "Dana Eti:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 55
  },
  {
    "n": "Etli Bezelye",
    "c": "ana_yemek",
    "t": 40,
    "d": 2,
    "e": "🍲",
    "ig": [
      "Bezelye:400 gram",
      "Dana Eti:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 56
  },
  {
    "n": "Sebzeli Güveç",
    "c": "ana_yemek",
    "t": 50,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Patates:2 adet",
      "Kabak:1 adet",
      "Patlıcan:1 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 57
  },
  {
    "n": "Tavuklu Bezelye",
    "c": "ana_yemek",
    "t": 35,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:300 gram",
      "Bezelye:300 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 58
  },
  {
    "n": "Etli Kabak Yemeği",
    "c": "ana_yemek",
    "t": 40,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kabak:3 adet",
      "Dana Eti:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 59
  },
  {
    "n": "Nohutlu Pilav",
    "c": "pilav",
    "t": 30,
    "d": 1,
    "e": "🥘",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Nohut:1 su bardağı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 60
  },
  {
    "n": "Tavuklu Pilav",
    "c": "pilav",
    "t": 35,
    "d": 1,
    "e": "🥘",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Tavuk:300 gram",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 61
  },
  {
    "n": "Gavurdağı Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Domates:3 adet",
      "Soğan:1 adet",
      "Ceviz:50 gram",
      "Nar Ekşisi:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 62
  },
  {
    "n": "Yoğurtlu Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Yoğurt:300 gram",
      "Salatalık:2 adet",
      "Sarımsak:2 diş"
    ],
    "f": false,
    "p": 20,
    "id": 63
  },
  {
    "n": "Patates Salatası",
    "c": "salata",
    "t": 20,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Patates:4 adet",
      "Soğan:1 adet",
      "Limon:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 64
  },
  {
    "n": "Rus Salatası",
    "c": "salata",
    "t": 25,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Patates:3 adet",
      "Havuç:2 adet",
      "Bezelye:1 su bardağı",
      "Mayonez:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 65
  },
  {
    "n": "Akdeniz Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Domates:2 adet",
      "Salatalık:2 adet",
      "Zeytin:10 adet",
      "Peynir:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 66
  },
  {
    "n": "Yeşil Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Marul:1 adet",
      "Salatalık:2 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 67
  },
  {
    "n": "Ton Balıklı Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Ton Balığı:1 kutu",
      "Marul:1 adet",
      "Mısır:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 68
  },
  {
    "n": "Tavuklu Salata",
    "c": "salata",
    "t": 15,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Tavuk:200 gram",
      "Marul:1 adet",
      "Yoğurt:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 69
  },
  {
    "n": "Tavuk Şiş",
    "c": "izgara",
    "t": 30,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:400 gram",
      "Yoğurt:2 yemek kaşığı",
      "Baharat:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 70
  },
  {
    "n": "Adana Kebap",
    "c": "izgara",
    "t": 30,
    "d": 3,
    "e": "🥩",
    "ig": [
      "Kıyma:350 gram",
      "Biber:1 adet",
      "Baharat:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 71
  },
  {
    "n": "Urfa Kebap",
    "c": "izgara",
    "t": 30,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:350 gram",
      "Tuz:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 72
  },
  {
    "n": "Tavuk Pirzola",
    "c": "izgara",
    "t": 35,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Yağ:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 73
  },
  {
    "n": "Dana Bonfile",
    "c": "izgara",
    "t": 20,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Dana Eti:300 gram",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 74
  },
  {
    "n": "Tavuk But Izgara",
    "c": "izgara",
    "t": 40,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Baharat:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 75
  },
  {
    "n": "Kuzu Şiş",
    "c": "izgara",
    "t": 35,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kuzu Eti:350 gram",
      "Yağ:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 76
  },
  {
    "n": "Lahmacun",
    "c": "hamur",
    "t": 45,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:200 gram",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 77
  },
  {
    "n": "Katmer",
    "c": "hamur",
    "t": 30,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 78
  },
  {
    "n": "Börek (Peynirli)",
    "c": "hamur",
    "t": 40,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Yufka:3 adet",
      "Peynir:200 gram",
      "Yumurta:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 79
  },
  {
    "n": "Börek (Kıymalı)",
    "c": "hamur",
    "t": 45,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Yufka:3 adet",
      "Kıyma:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 80
  },
  {
    "n": "Açma",
    "c": "hamur",
    "t": 60,
    "d": 3,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Süt:1 su bardağı",
      "Maya:1 paket"
    ],
    "f": false,
    "p": 20,
    "id": 81
  },
  {
    "n": "Poğaça",
    "c": "hamur",
    "t": 45,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Peynir:150 gram",
      "Yumurta:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 82
  },
  {
    "n": "Fırında Beşamel Makarna",
    "c": "makarna",
    "t": 40,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:300 gram",
      "Süt:300 ml",
      "Un:2 yemek kaşığı",
      "Kaşar:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 83
  },
  {
    "n": "Tavuklu Makarna",
    "c": "makarna",
    "t": 25,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Tavuk:250 gram",
      "Krema:150 ml"
    ],
    "f": false,
    "p": 20,
    "id": 84
  },
  {
    "n": "Sebzeli Kremalı Makarna",
    "c": "makarna",
    "t": 20,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Kabak:1 adet",
      "Krema:150 ml"
    ],
    "f": false,
    "p": 20,
    "id": 85
  },
  {
    "n": "Yoğurtlu Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Yoğurt:300 gram",
      "Sarımsak:2 diş"
    ],
    "f": false,
    "p": 20,
    "id": 86
  },
  {
    "n": "Salçalı Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Salça:2 yemek kaşığı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 87
  },
  {
    "n": "Peynirli Fırın Makarna",
    "c": "makarna",
    "t": 40,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:300 gram",
      "Kaşar:150 gram",
      "Süt:200 ml"
    ],
    "f": false,
    "p": 20,
    "id": 88
  },
  {
    "n": "Sebzeli Pirinç Pilavı",
    "c": "pilav",
    "t": 30,
    "d": 1,
    "e": "🍚",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Havuç:1 adet",
      "Bezelye:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 89
  },
  {
    "n": "Domatesli Bulgur Pilavı",
    "c": "pilav",
    "t": 25,
    "d": 1,
    "e": "🌾",
    "ig": [
      "Bulgur:1.5 su bardağı",
      "Domates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 90
  },
  {
    "n": "Tavuklu Bulgur Pilavı",
    "c": "pilav",
    "t": 30,
    "d": 1,
    "e": "🍚",
    "ig": [
      "Bulgur:1.5 su bardağı",
      "Tavuk:250 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 91
  },
  {
    "n": "Arpa Şehriyeli Pilav",
    "c": "pilav",
    "t": 25,
    "d": 1,
    "e": "🍚",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Arpa Şehriye:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 92
  },
  {
    "n": "Tavuk Kavurma",
    "c": "tava",
    "t": 25,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:350 gram",
      "Soğan:1 adet",
      "Biber:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 93
  },
  {
    "n": "Kıyma Kavurma",
    "c": "tava",
    "t": 20,
    "d": 1,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Soğan:1 adet",
      "Yağ:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 94
  },
  {
    "n": "Menemen Sucuklu",
    "c": "tava",
    "t": 15,
    "d": 1,
    "e": "🍳",
    "ig": [
      "Yumurta:4 adet",
      "Sucuk:80 gram",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 95
  },
  {
    "n": "Patates Kavurma",
    "c": "tava",
    "t": 25,
    "d": 1,
    "e": "🥔",
    "ig": [
      "Patates:4 adet",
      "Soğan:1 adet",
      "Yağ:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 96
  },
  {
    "n": "Tavuklu Sebze Sote",
    "c": "tava",
    "t": 25,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:300 gram",
      "Kabak:1 adet",
      "Biber:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 97
  },
  {
    "n": "İşkembe Çorbası",
    "c": "corba",
    "t": 60,
    "d": 3,
    "e": "🍲",
    "ig": [
      "İşkembe:300 gram",
      "Sarımsak:3 diş",
      "Sirke:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 98
  },
  {
    "n": "Kelle Paça",
    "c": "corba",
    "t": 90,
    "d": 3,
    "e": "🍲",
    "ig": [
      "Kemik:500 gram",
      "Sarımsak:3 diş"
    ],
    "f": false,
    "p": 20,
    "id": 99
  },
  {
    "n": "Tarator Çorba",
    "c": "corba",
    "t": 10,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Yoğurt:300 gram",
      "Salatalık:2 adet",
      "Sarımsak:2 diş"
    ],
    "f": false,
    "p": 20,
    "id": 100
  },
  {
    "n": "Erişte Çorbası",
    "c": "corba",
    "t": 20,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Erişte:1 çay bardağı",
      "Yoğurt:200 gram"
    ],
    "f": false,
    "p": 20,
    "id": 101
  },
  {
    "n": "Domatesli Şehriye Çorbası",
    "c": "corba",
    "t": 15,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Şehriye:4 yemek kaşığı",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 102
  },
  {
    "n": "Kısır",
    "c": "salata",
    "t": 20,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Bulgur:1 su bardağı",
      "Domates:2 adet",
      "Salatalık:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 103
  },
  {
    "n": "Mercimek Köftesi",
    "c": "salata",
    "t": 30,
    "d": 2,
    "e": "🥗",
    "ig": [
      "Kırmızı Mercimek:1 su bardağı",
      "Bulgur:1 su bardağı",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 104
  },
  {
    "n": "Yoğurtlu Havuç",
    "c": "salata",
    "t": 15,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Havuç:3 adet",
      "Yoğurt:300 gram",
      "Sarımsak:2 diş"
    ],
    "f": false,
    "p": 20,
    "id": 105
  },
  {
    "n": "Cacık",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Yoğurt:300 gram",
      "Salatalık:2 adet",
      "Nane:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 106
  },
  {
    "n": "Piyaz",
    "c": "salata",
    "t": 20,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Fasulye:250 gram",
      "Soğan:1 adet",
      "Limon:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 107
  },
  {
    "n": "Tavuk Izgara Göğüs",
    "c": "izgara",
    "t": 25,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:400 gram",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 108
  },
  {
    "n": "Kuzu Pirzola",
    "c": "izgara",
    "t": 30,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kuzu Eti:400 gram",
      "Tuz:1 çay kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 109
  },
  {
    "n": "Tavuk Kanat Acılı",
    "c": "izgara",
    "t": 35,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:500 gram",
      "Biber Salçası:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 110
  },
  {
    "n": "Izgara Sucuk",
    "c": "izgara",
    "t": 15,
    "d": 1,
    "e": "🥩",
    "ig": [
      "Sucuk:200 gram"
    ],
    "f": false,
    "p": 20,
    "id": 111
  },
  {
    "n": "Tavuk Şiş Sebzeli",
    "c": "izgara",
    "t": 30,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:400 gram",
      "Biber:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 112
  },
  {
    "n": "Gözleme Patatesli",
    "c": "hamur",
    "t": 35,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Patates:2 adet",
      "Yağ:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 113
  },
  {
    "n": "Gözleme Ispanaklı",
    "c": "hamur",
    "t": 35,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Ispanak:200 gram",
      "Peynir:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 114
  },
  {
    "n": "Bazlama",
    "c": "hamur",
    "t": 40,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Maya:1 paket",
      "Su:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 115
  },
  {
    "n": "Lavaş",
    "c": "hamur",
    "t": 20,
    "d": 1,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Su:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 116
  },
  {
    "n": "Kabak Dolması",
    "c": "dolma",
    "t": 45,
    "d": 3,
    "e": "🫑",
    "ig": [
      "Kabak:4 adet",
      "Pirinç:1 su bardağı",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 117
  },
  {
    "n": "Patlıcan Dolması",
    "c": "dolma",
    "t": 50,
    "d": 3,
    "e": "🍆",
    "ig": [
      "Patlıcan:4 adet",
      "Pirinç:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 118
  },
  {
    "n": "Domates Dolması",
    "c": "dolma",
    "t": 45,
    "d": 3,
    "e": "🫑",
    "ig": [
      "Domates:6 adet",
      "Pirinç:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 119
  },
  {
    "n": "İçli Köfte",
    "c": "ozel",
    "t": 90,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Bulgur:2 su bardağı",
      "Kıyma:250 gram",
      "Soğan:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 120
  },
  {
    "n": "Sigara Böreği",
    "c": "ozel",
    "t": 25,
    "d": 1,
    "e": "🥟",
    "ig": [
      "Yufka:3 adet",
      "Peynir:150 gram"
    ],
    "f": false,
    "p": 20,
    "id": 121
  },
  {
    "n": "Paçanga Böreği",
    "c": "ozel",
    "t": 30,
    "d": 2,
    "e": "🥟",
    "ig": [
      "Yufka:3 adet",
      "Pastırma:100 gram",
      "Kaşar:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 122
  },
  {
    "n": "Kol Böreği",
    "c": "ozel",
    "t": 50,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Yufka:4 adet",
      "Kıyma:200 gram"
    ],
    "f": false,
    "p": 20,
    "id": 123
  },
  {
    "n": "Çiğ Börek",
    "c": "ozel",
    "t": 45,
    "d": 2,
    "e": "🥟",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:200 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 124
  },
  {
    "n": "Menemen",
    "c": "kahvalti",
    "t": 15,
    "d": 1,
    "e": "🍳",
    "ig": [
      "Yumurta:4 adet",
      "Domates:3 adet",
      "Biber:2 adet",
      "Zeytinyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 125
  },
  {
    "n": "Sahanda Yumurta",
    "c": "kahvalti",
    "t": 10,
    "d": 1,
    "e": "🍳",
    "ig": [
      "Yumurta:4 adet",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 126
  },
  {
    "n": "Peynir Tabağı",
    "c": "kahvalti",
    "t": 5,
    "d": 1,
    "e": "🧀",
    "ig": [
      "Beyaz Peynir:150 gram",
      "Kaşar:75 gram",
      "Zeytin:15 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 127
  },
  {
    "n": "Tost",
    "c": "kahvalti",
    "t": 8,
    "d": 1,
    "e": "🥪",
    "ig": [
      "Kaşar:6 dilim",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 128
  },
  {
    "n": "Omlet",
    "c": "kahvalti",
    "t": 10,
    "d": 1,
    "e": "🥚",
    "ig": [
      "Yumurta:4 adet",
      "Süt:3 yemek kaşığı",
      "Kaşar:50 gram"
    ],
    "f": false,
    "p": 20,
    "id": 129
  },
  {
    "n": "Çılbır",
    "c": "kahvalti",
    "t": 15,
    "d": 2,
    "e": "🥚",
    "ig": [
      "Yumurta:4 adet",
      "Yoğurt:300 gram",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 130
  },
  {
    "n": "Simit + Çay",
    "c": "kahvalti",
    "t": 5,
    "d": 1,
    "e": "🥯",
    "ig": [
      "Simit:2 adet",
      "Beyaz Peynir:75 gram"
    ],
    "f": false,
    "p": 20,
    "id": 131
  },
  {
    "n": "Kahvaltı Gözleme",
    "c": "kahvalti",
    "t": 25,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2.5 su bardağı",
      "Beyaz Peynir:200 gram",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 132
  },
  {
    "n": "Makarna Bolonez",
    "c": "makarna",
    "t": 25,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Kıyma:200 gram",
      "Domates:3 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 133
  },
  {
    "n": "Kremalı Makarna",
    "c": "makarna",
    "t": 20,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Krema:200 ml",
      "Kaşar:75 gram",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 134
  },
  {
    "n": "Soslu Makarna",
    "c": "makarna",
    "t": 15,
    "d": 1,
    "e": "🍝",
    "ig": [
      "Makarna:250 gram",
      "Domates Salçası:2 yemek kaşığı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 135
  },
  {
    "n": "Lazanya",
    "c": "makarna",
    "t": 60,
    "d": 3,
    "e": "🍝",
    "ig": [
      "Lazanya:250 gram",
      "Kıyma:250 gram",
      "Domates:4 adet",
      "Süt:500 ml"
    ],
    "f": false,
    "p": 20,
    "id": 136
  },
  {
    "n": "Mantarlı Makarna",
    "c": "makarna",
    "t": 20,
    "d": 1,
    "e": "🍄",
    "ig": [
      "Makarna:250 gram",
      "Mantar:200 gram",
      "Soğan:1 adet",
      "Krema:100 ml"
    ],
    "f": false,
    "p": 20,
    "id": 137
  },
  {
    "n": "Fırın Makarna",
    "c": "makarna",
    "t": 40,
    "d": 2,
    "e": "🍝",
    "ig": [
      "Makarna:300 gram",
      "Kaşar:150 gram",
      "Yumurta:2 adet",
      "Süt:200 ml"
    ],
    "f": false,
    "p": 20,
    "id": 138
  },
  {
    "n": "Etli Nohut",
    "c": "pilav",
    "t": 45,
    "d": 2,
    "e": "🫘",
    "ig": [
      "Nohut:250 gram",
      "Dana Eti:200 gram",
      "Soğan:1 adet",
      "Salça:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 139
  },
  {
    "n": "Kuru Fasulye",
    "c": "pilav",
    "t": 50,
    "d": 2,
    "e": "🫘",
    "ig": [
      "Fasulye:250 gram",
      "Soğan:1 adet",
      "Salça:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 140
  },
  {
    "n": "Türlü",
    "c": "pilav",
    "t": 40,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Patates:2 adet",
      "Kabak:1 adet",
      "Biber:2 adet",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 141
  },
  {
    "n": "Pirinç Pilavı",
    "c": "pilav",
    "t": 25,
    "d": 1,
    "e": "🍚",
    "ig": [
      "Pirinç:1.5 su bardağı",
      "Tereyağı:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 142
  },
  {
    "n": "Bulgur Pilavı",
    "c": "pilav",
    "t": 20,
    "d": 1,
    "e": "🌾",
    "ig": [
      "Bulgur:1.5 su bardağı",
      "Soğan:1 adet",
      "Salça:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 143
  },
  {
    "n": "Tavuk Sote",
    "c": "tava",
    "t": 25,
    "d": 1,
    "e": "🍗",
    "ig": [
      "Tavuk:300 gram",
      "Biber:2 adet",
      "Domates:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 144
  },
  {
    "n": "Köfte",
    "c": "tava",
    "t": 25,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Soğan:1 adet",
      "Yumurta:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 145
  },
  {
    "n": "Sebzeli Tavuk",
    "c": "tava",
    "t": 30,
    "d": 2,
    "e": "🥘",
    "ig": [
      "Tavuk:300 gram",
      "Biber:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 146
  },
  {
    "n": "Yumurtalı Patates",
    "c": "tava",
    "t": 20,
    "d": 1,
    "e": "🥔",
    "ig": [
      "Patates:3 adet",
      "Yumurta:4 adet"
    ],
    "f": false,
    "p": 20,
    "id": 147
  },
  {
    "n": "Sucuklu Yumurta",
    "c": "tava",
    "t": 10,
    "d": 1,
    "e": "🍳",
    "ig": [
      "Yumurta:4 adet",
      "Sucuk:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 148
  },
  {
    "n": "Mercimek Çorbası",
    "c": "corba",
    "t": 25,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Mercimek:1 su bardağı",
      "Soğan:1 adet",
      "Patates:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 149
  },
  {
    "n": "Domates Çorbası",
    "c": "corba",
    "t": 20,
    "d": 1,
    "e": "🍅",
    "ig": [
      "Domates:4 adet",
      "Süt:150 ml",
      "Un:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 150
  },
  {
    "n": "Tarhana Çorbası",
    "c": "corba",
    "t": 15,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Tarhana:4 yemek kaşığı",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 151
  },
  {
    "n": "Ezogelin Çorbası",
    "c": "corba",
    "t": 30,
    "d": 1,
    "e": "🍲",
    "ig": [
      "Mercimek:1 su bardağı",
      "Bulgur:2 yemek kaşığı",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 152
  },
  {
    "n": "Tavuk Suyu Çorba",
    "c": "corba",
    "t": 35,
    "d": 2,
    "e": "🐔",
    "ig": [
      "Tavuk:300 gram",
      "Limon:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 153
  },
  {
    "n": "Tavuk Dürüm",
    "c": "tost",
    "t": 15,
    "d": 1,
    "e": "🌯",
    "ig": [
      "Tavuk:250 gram",
      "Lavaş:2 adet",
      "Domates:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 154
  },
  {
    "n": "Kaşarlı Tost",
    "c": "tost",
    "t": 8,
    "d": 1,
    "e": "🥪",
    "ig": [
      "Kaşar:6 dilim",
      "Tereyağı:1 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 155
  },
  {
    "n": "Bazlama Sandwich",
    "c": "tost",
    "t": 10,
    "d": 1,
    "e": "🫓",
    "ig": [
      "Bazlama:2 adet",
      "Beyaz Peynir:100 gram"
    ],
    "f": false,
    "p": 20,
    "id": 156
  },
  {
    "n": "Kaygana",
    "c": "yumurta",
    "t": 10,
    "d": 1,
    "e": "🥞",
    "ig": [
      "Yumurta:4 adet",
      "Un:3 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 157
  },
  {
    "n": "Ispanaklı Yumurta",
    "c": "yumurta",
    "t": 15,
    "d": 1,
    "e": "🥬",
    "ig": [
      "Yumurta:4 adet",
      "Ispanak:200 gram"
    ],
    "f": false,
    "p": 20,
    "id": 158
  },
  {
    "n": "Fırın Tavuk",
    "c": "firin",
    "t": 60,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk:600 gram",
      "Patates:4 adet",
      "Biber:3 adet"
    ],
    "f": false,
    "p": 20,
    "id": 159
  },
  {
    "n": "Karnıyarık",
    "c": "firin",
    "t": 50,
    "d": 3,
    "e": "🍆",
    "ig": [
      "Patlıcan:4 adet",
      "Kıyma:250 gram",
      "Domates:2 adet"
    ],
    "f": false,
    "p": 20,
    "id": 160
  },
  {
    "n": "Fırın Köfte",
    "c": "firin",
    "t": 40,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Patates:3 adet"
    ],
    "f": false,
    "p": 20,
    "id": 161
  },
  {
    "n": "Tepsi Kebabı",
    "c": "firin",
    "t": 55,
    "d": 3,
    "e": "🥩",
    "ig": [
      "Kıyma:400 gram",
      "Domates:3 adet",
      "Biber:3 adet"
    ],
    "f": false,
    "p": 20,
    "id": 162
  },
  {
    "n": "Su Böreği",
    "c": "hamur",
    "t": 70,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Yumurta:3 adet",
      "Beyaz Peynir:300 gram",
      "Süt:1 su bardağı"
    ],
    "f": false,
    "p": 20,
    "id": 163
  },
  {
    "n": "Pide",
    "c": "hamur",
    "t": 45,
    "d": 3,
    "e": "🫓",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:250 gram"
    ],
    "f": false,
    "p": 20,
    "id": 164
  },
  {
    "n": "Gözleme",
    "c": "hamur",
    "t": 35,
    "d": 2,
    "e": "🫓",
    "ig": [
      "Un:2 su bardağı",
      "Peynir:150 gram"
    ],
    "f": false,
    "p": 20,
    "id": 165
  },
  {
    "n": "Yaprak Sarma",
    "c": "dolma",
    "t": 80,
    "d": 3,
    "e": "🫔",
    "ig": [
      "Pirinç:1 su bardağı",
      "Soğan:3 adet"
    ],
    "f": false,
    "p": 20,
    "id": 166
  },
  {
    "n": "Biber Dolma",
    "c": "dolma",
    "t": 50,
    "d": 3,
    "e": "🫑",
    "ig": [
      "Pirinç:1 su bardağı",
      "Biber:8 adet"
    ],
    "f": false,
    "p": 20,
    "id": 167
  },
  {
    "n": "Mantı",
    "c": "ozel",
    "t": 100,
    "d": 3,
    "e": "🥟",
    "ig": [
      "Un:3 su bardağı",
      "Kıyma:200 gram",
      "Yoğurt:300 gram"
    ],
    "f": false,
    "p": 20,
    "id": 168
  },
  {
    "n": "Izgara Köfte",
    "c": "izgara",
    "t": 25,
    "d": 2,
    "e": "🥩",
    "ig": [
      "Kıyma:300 gram",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 169
  },
  {
    "n": "Tavuk Kanat",
    "c": "izgara",
    "t": 35,
    "d": 2,
    "e": "🍗",
    "ig": [
      "Tavuk Kanat:500 gram",
      "Yağ:2 yemek kaşığı"
    ],
    "f": false,
    "p": 20,
    "id": 170
  },
  {
    "n": "Çoban Salata",
    "c": "salata",
    "t": 10,
    "d": 1,
    "e": "🥗",
    "ig": [
      "Domates:3 adet",
      "Salatalık:2 adet",
      "Soğan:1 adet"
    ],
    "f": false,
    "p": 20,
    "id": 171
  }
];

export const INITIAL_FRIDGE = [
  {
    "n": "Kıyma",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Domates",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Soğan",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Krema",
    "u": "litre",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Kaşar",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Tereyağı",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Mantar",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Yumurta",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Süt",
    "u": "litre",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Ton Balığı",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Kahvaltılık",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Beyaz Peynir",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Kabak",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Havuç",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Zeytinyağı",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Kahvaltılık",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Dana Eti",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Patates",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Biber",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Tavuk",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Sucuk",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Limon",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Peynir",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Patlıcan",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Yoğurt",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Süt Ürünleri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Salatalık",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Bamya",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Zeytin",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Kahvaltılık",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Marul",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Kuzu Eti",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Biber Salçası",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Domates Salçası",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Sebze/Meyve",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Tavuk Kanat",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Et & Şarküteri",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  }
];

export const INITIAL_PANTRY = [
  {
    "n": "Makarna",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Salça",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Mısır",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Pirinç",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Tuz",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Bulgur",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Fasulye",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Nohut",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Mercimek",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Un",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Tarhana",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Lavaş",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Bazlama",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Ispanak",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Yağ",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Lahana",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Bezelye",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Ceviz",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Nar Ekşisi",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Sarımsak",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Mayonez",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Baharat",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Yufka",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Maya",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Arpa Şehriye",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "İşkembe",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Sirke",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Kemik",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Erişte",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Şehriye",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Kırmızı Mercimek",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Nane",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Su",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Pastırma",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Simit",
    "u": "adet",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  },
  {
    "n": "Lazanya",
    "u": "gram",
    "mn": 0,
    "cr": 0,
    "ic": "📦",
    "ct": "Temel Gıda",
    "br": "",
    "mk": "Pazar",
    "pk": "",
    "bt": "2026-04-23T12:00:00Z"
  }
];

export const INITIAL_FROZEN = [];

export const ACHIEVEMENTS = [
  {id:'ilk_tarif',ic:'🌱',n:'İlk Tarif',d:'İlk tarifi ekledin!'},
  {id:'on_tarif',ic:'📖',n:'Tarif Ustası',d:'10+ tarif eklendi!'},
  {id:'tam_hafta',ic:'📋',n:'Tam Hafta',d:'7 günlük menü planlandı!'},
  {id:'waffle_mama',ic:'🐕',n:'Waffle Mutlu',d:'Waffle maması 1 ay dolmadı!'},
  {id:'mays_mama',ic:'🐈',n:'Mayıs Mutlu',d:'Mayıs maması 1 ay dolmadı!'},
  {id:'bakim_eklendi',ic:'🔧',n:'Bakımlı Araç',d:'İlk bakım kaydı eklendi!'}
];

export const PET_META = {
  waffle: {
    name:'Waffle', emoji:'🐕', species:'Köpek', breed:'Alpine Dachsbracke-Corgi', 
    gender:'Dişi', birth:'26.02.2021', color:'Sarı', passport:'TR02280338',
    chip:'990000001478246', chipDate:'31.10.2023', chipLoc:'İnterscapular arca', grad:'linear-gradient(135deg,#F97316,#EA580C)'
  },
  mayis: {
    name:'Mayıs', emoji:'🐈', species:'Kedi', breed:'Tekir', 
    gender:'Erkek', birth:'20.03.2025', color:'Beyaz', passport:'TR03590082',
    chip:'900233005962314', chipDate:'25.08.2025', chipLoc:'İki Scopula Arası', grad:'linear-gradient(135deg,#FB923C,#F97316)'
  }
};

export const VACCINES = {
  waffle: [
    {n:'Ekinokok', last:'15.02.2026', ev:60, h:['15.09.2023','23.11.2023','28.03.2024','28.05.2024','22.07.2024','10.10.2024','20.02.2025','10.04.2025','11.06.2025','12.08.2025','15.02.2026']},
    {n:'Antiparaziter', last:'15.02.2026', ev:60, h:['13.09.2023','23.11.2023','28.03.2024','28.05.2024','22.07.2024','10.10.2024','20.02.2025','10.04.2025','11.06.2025','12.08.2025','15.02.2026']},
    {n:'Kuduz', last:'01.05.2025', ev:365, h:['19.04.2023','15.04.2024','01.05.2025']}
  ],
  mayis: [
    {n:'Ekinokok', last:'26.03.2026', ev:60, h:['25.08.2025','18.10.2025','14.01.2026','26.03.2026']},
    {n:'Antiparaziter', last:'26.03.2026', ev:60, h:['18.10.2025','14.01.2026','26.03.2026']},
    {n:'Kuduz', last:'25.08.2025', ev:365, h:['25.08.2025']},
    {n:'Karma', last:'01.04.2026', ev:365, h:['01.04.2026']}
  ]
};

export const INITIAL_WEIGHTS = {
  waffle: [
    { id: 1, w: 10.2, dt: '15.02.2026' },
    { id: 2, w: 10.4, dt: '10.01.2026' },
    { id: 3, w: 10.1, dt: '05.11.2025' }
  ],
  mayis: [
    { id: 1, w: 3.2, dt: '01.04.2026' },
    { id: 2, w: 2.8, dt: '15.02.2026' },
    { id: 3, w: 1.5, dt: '25.08.2025' }
  ]
};

export const INITIAL_TRIPS = [
  {
    id:'t1',title:'Marsilya',country:'Fransa',city:'Marsilya',startDate:'2023-02-03',endDate:'2023-02-07',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'İlk yurt dışı gezimiz ❤️',
    hotels:[{name:'New Hotel Le Quai - Vieux Port',address:'Vieux Port, Marsilya, Fransa'}]
  },
  {
    id:'t2',title:'Londra',country:'İngiltere',city:'Londra',startDate:'2024-02-02',endDate:'2024-02-08',type:'yurtdisi',who:'ikisi',schengen:false,status:'tamamlandi',notes:'',
    hotels:[{name:'AirBnb',address:'Piccadilly Circus, Londra'}]
  },
  {
    id:'t3',title:'Saraybosna & Kotor',country:'Bosna Hersek',city:'Saraybosna',startDate:'2024-09-19',endDate:'2024-09-21',type:'yurtdisi',who:'ikisi',schengen:false,status:'tamamlandi',notes:'Ucakla gidip araba kiralayip Kotora gectik.',
    hotels:[{name:"AirBnb",address:"Bascarsı, Saraybosna"},{name:"AirBnb",address:"Old Town, Kotor, Karadağ"}],
    car:{company:"Kiralik Arac",notes:"Saraybosnadan Kotora"}
  },
  {
    id:'t4',title:'Berlin',country:'Almanya',city:'Berlin',startDate:'2025-05-23',endDate:'2025-05-26',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',
    hotels:[{name:'Hotel Motel One Berlin',address:'Alexanderplatz, Berlin, Almanya'}]
  },
  {
    id:'t5',title:'Kavala & Selanik',country:'Yunanistan',city:'Kavala',startDate:'2025-10-31',endDate:'2025-11-02',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',
    hotels:[{name:'Hotel Galaxy',address:'Kavala, Yunanistan'},{name:'AirBnb',address:'Selanik, Yunanistan'}]
  },
  {
    id:'t6',title:'Sofya',country:'Bulgaristan',city:'Sofya',startDate:'2026-01-15',endDate:'2026-01-16',type:'yurtdisi',who:'ikisi',schengen:true,status:'tamamlandi',notes:'',
    hotels:[{name:'Hotel Coop',address:'Sofya, Bulgaristan'}]
  }
];

export const INITIAL_VEHICLE = {
  km: 45200,
  plaka: '34 HH 1144',
  model: 'Volkswagen Tiguan R-Line',
  muayene: {
    last: '2025-06-15',
    next: '2027-06-15',
    result: 'KUSURSUZ',
    type: 'Periyodik Muayene',
    report: '984521360012'
  },
  ev: [
    {id:1,ic:'🚨',nm:'Araç Muayenesi',dt:'2027-06-15',tp:'date'},
    {id:2,ic:'🛡️',nm:'Kasko',dt:'2026-11-20',tp:'date'},
    {id:3,ic:'🚗',nm:'Trafik Sigortası',dt:'2026-11-20',tp:'date'},
    {id:4,ic:'🛢️',nm:'Periyodik Bakım',kmL:15000,tp:'km'}
  ],
  hs: [
    { id: 1, date: '2025-10-15', km: 42000, title: 'Periyodik Bakım', detail: 'Yağ ve filtreler değişti', cost: 4500, shop: 'VW Yetkili Servis' }
  ],
  yakitlar: [
    { id: 1, date: '2026-04-20', km: 45100, amount: 45.5, price: 42.5, station: 'Shell', consumption: 7.2 },
    { id: 2, date: '2026-04-10', km: 44500, amount: 42.0, price: 41.8, station: 'Opet', consumption: 7.5 }
  ]
};

export const INITIAL_SOCIAL = {
  tab: 'hafta',
  aktiviteler: [
    { id: 1, baslik: "Özkuruşlardan alışveriş", tarih: "2026-04-19", mekan: "Özkuruşlar", harcama: 3500, tur: "disari", durum: "tamamlandi" },
    { id: 2, baslik: "Haftalık Sinema Gecesi", tarih: "2026-04-26", mekan: "Ev", harcama: 0, tur: "evde", durum: "planda" }
  ],
  havuz: [
    { id: 'h1', baslik: 'Film Gecesi', tur: 'evde', emoji: '🎬', count: 5, freq: 'Haftalık', last: 'Inception - 1 hafta önce' },
    { id: 'h2', baslik: 'Kutu Oyunu', tur: 'evde', emoji: '🎲', count: 12, freq: 'Aylık', last: 'Catan - 2 hafta önce' },
    { id: 'h3', baslik: 'Birlikte Yemek Yapma', tur: 'evde', emoji: '🍳', count: 45, freq: 'Günlük', last: 'Mantı - Dün' },
    { id: 'h4', baslik: 'Sahil Yürüyüşü', tur: 'disari', emoji: '🚶', count: 20, freq: 'Haftalık', last: 'Caddebostan - 3 gün önce' },
    { id: 'h5', baslik: 'Havuz/Deniz', tur: 'disari', emoji: '🏊', count: 2, freq: 'Mevsimlik', last: 'Geçen Yaz' },
    { id: 'h6', baslik: 'Sanat Atölyesi', tur: 'disari', emoji: '🎨', count: 1, freq: 'Yıllık', last: 'Seramik - 6 ay önce' },
    { id: 'h7', baslik: 'Fotoğraf Gezisi', tur: 'disari', emoji: '📸', count: 3, freq: 'Aylık', last: 'Kuzguncuk' },
    { id: 'h8', baslik: 'AVM Gezisi', tur: 'disari', emoji: '🛍️', count: 10, freq: 'Aylık', last: 'Emaar' },
    { id: 'h9', baslik: 'Kafe Keşfi', tur: 'disari', emoji: '☕', count: 15, freq: 'Haftalık', last: 'Espresso Lab' },
    { id: 'h10', baslik: 'Piknik', tur: 'disari', emoji: '🌳', count: 4, freq: 'Mevsimlik', last: 'Belgrad Ormanı' },
    { id: 'h11', baslik: 'Şehir Dışı Gezi', tur: 'disari', emoji: '🚗', count: 6, freq: 'Yıllık', last: 'Bolu' },
    { id: 'h12', baslik: 'Tiyatro/Konser', tur: 'disari', emoji: '🎭', count: 2, freq: 'Aylık', last: 'Zorlu PSM' },
    { id: 'h13', baslik: 'Puzzle Yapma', tur: 'evde', emoji: '🧩', count: 1, freq: 'Yıllık', last: '1000 Parça' },
    { id: 'h14', baslik: 'Pizza Gecesi', tur: 'evde', emoji: '🍕', count: 8, freq: 'Aylık', last: 'Ev yapımı' },
    { id: 'h15', baslik: 'Waffle ile Park', tur: 'disari', emoji: '🐕', count: 100, freq: 'Günlük', last: 'Sabah Yürüyüşü' },
    { id: 'h16', baslik: 'Kitap Okuma Saati', tur: 'evde', emoji: '📚', count: 30, freq: 'Günlük', last: 'Geceyarısı Kütüphanesi' },
    { id: 'h17', baslik: 'Oyun Gecesi', tur: 'evde', emoji: '🎮', count: 10, freq: 'Haftalık', last: 'PS5 - FC24' }
  ],
  rutinler: [
    { id: 'r1', aktivite: 'İngilizce Kursu', kisi: 'Görkem', gunler: [1, 3], saati: '19:00', sure: '6 Ay', ucret: 2500, ucretOdendi: true },
    { id: 'r2', aktivite: 'Almanca Kursu', kisi: 'Esra', gunler: [2, 4], saati: '18:30', sure: '1 Yıl', ucret: 3000, ucretOdendi: true }
  ]
};

export const INITIAL_EV = {
  tab: 'faturalar',
  faturalar: [
    { id: 1, name: 'Elektrik', provider: 'EnerjiSa', amount: 850, dueDate: '2026-04-20', status: 'Ödendi', autoPay: true, icon: '⚡' },
    { id: 2, name: 'İnternet', provider: 'TurkNet', amount: 399, dueDate: '2026-04-25', status: 'Bekliyor', autoPay: true, icon: '🌐' },
    { id: 3, name: 'Doğalgaz', provider: 'İGDAŞ', amount: 1250, dueDate: '2026-04-15', status: 'Ödendi', autoPay: false, icon: '🔥' }
  ],
  bakim: [
    { id: 'kombi', name: 'Kombi Bakımı', lastDate: '2025-11-01', intervalDays: 365, icon: '🔥' },
    { id: 'klima', name: 'Klima Temizliği', lastDate: '2025-06-15', intervalDays: 180, icon: '❄️' },
    { id: 'aritma', name: 'Su Arıtma Filtre', lastDate: '2026-01-10', intervalDays: 180, icon: '💧' }
  ],
  sigortalar: [
    { id: 1, name: 'DASK', dueDate: '2026-09-10', provider: 'Aksigorta' },
    { id: 2, name: 'Konut Sigortası', dueDate: '2026-09-10', provider: 'Aksigorta' }
  ],
  malVarligi: [
    {
      id: 'tapu1',
      ad: 'Antalya Kepez Mesken',
      il: 'ANTALYA',
      ilce: 'KEPEZ',
      mahalle: 'ULUS',
      tip: 'Kat İrtifakı',
      adaParsel: '1382/7',
      bbNo: '7, Kat: 1',
      nitelik: 'MESKEN',
      deger: 4500000,
      emoji: '🏢'
    },
    {
      id: 'tapu2',
      ad: 'Didim Prefabrik Ev',
      il: 'AYDIN',
      ilce: 'DİDİM',
      mahalle: 'AKYENİKÖY M',
      tip: 'Ana Taşınmaz',
      adaParsel: '1268/20',
      nitelik: 'TEK KATLI PREFABRİK EV',
      deger: 2800000,
      emoji: '🏡'
    }
  ]
};

export const SEASONS = {
  spring: ['enginar','bezelye','çilek','bakla','marul','dereotu','roka','kuşkonmaz'],
  summer: ['domates','patlıcan','biber','karpuz','kiraz','levrek','kabak','salatalık','mısır','şeftali'],
  autumn: ['kabak','mantar','nar','ayva','palamut','kestane','hamsi','pancar','balkabağı'],
  winter: ['lahana','ıspanak','kereviz','portakal','hamsi','turp','pırasa']
};

export const INITIAL_SOCIAL_POOL = [
  { id: 1, title: 'Maltepe Sahil Parkı yürüyüş', duration: '1–3 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🌊' },
  { id: 2, title: 'Sahilde gün doğumu izleme', duration: '1 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🌅' },
  { id: 3, title: 'Gün batımı + fotoğraf', duration: '1 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🌇' },
  { id: 4, title: 'Köpekle serbest oyun', duration: '1–2 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🐶' },
  { id: 5, title: 'Sahilde koşu', duration: '30 dk', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🏃‍♂️' },
  { id: 6, title: 'Bisiklet turu', duration: '1–2 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🚲' },
  { id: 7, title: 'Sahilde termos kahve keyfi', duration: '1 saat', cost: '50 TL', category: 'Sahil & Açık Alan', icon: '☕' },
  { id: 8, title: 'Açık hava egzersizi', duration: '30 dk', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '💪' },
  { id: 9, title: 'Sahilde kitap okuma', duration: '1–2 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '📖' },
  { id: 10, title: 'Drone/foto çekim günü', duration: '1 saat', cost: '0 TL', category: 'Sahil & Açık Alan', icon: '🚁' },
  { id: 11, title: 'Basit balık tutma denemesi', duration: '2 saat', cost: '100–200 TL', category: 'Sahil & Açık Alan', icon: '🎣' },
  { id: 12, title: 'Mini kahvaltı (evden)', duration: '1–2 saat', cost: '100 TL', category: 'Sahil & Açık Alan', icon: '🥪' },
  { id: 13, title: 'Orhangazi Şehir Parkı gezisi', duration: '1–2 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🌳' },
  { id: 14, title: 'Piknik (detaylı hazırlık)', duration: '2–4 saat', cost: '200–400 TL', category: 'Park & Doğa', icon: '🧺' },
  { id: 15, title: 'Yoga / meditasyon', duration: '30 dk', cost: '0 TL', category: 'Park & Doğa', icon: '🧘‍♀️' },
  { id: 16, title: 'Hafif doğa yürüyüşü', duration: '1–2 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🚶‍♂️' },
  { id: 17, title: 'Köpekle eğitim egzersizi', duration: '1 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🐩' },
  { id: 18, title: 'Ağaç altında kitap + müzik', duration: '1–2 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🎵' },
  { id: 19, title: 'Masa oyunları (parkta)', duration: '1–2 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🎲' },
  { id: 20, title: 'Hamak kurup dinlenme', duration: '1–2 saat', cost: '0 TL', category: 'Park & Doğa', icon: '🛏️' },
  { id: 21, title: 'Caddebostan Sahili günü', duration: '2–3 saat', cost: '100 TL', category: 'Yakın Lokasyon Keşif', icon: '🏙️' },
  { id: 22, title: 'Moda Sahili yürüyüş', duration: '2–3 saat', cost: '150 TL', category: 'Yakın Lokasyon Keşif', icon: '🍦' },
  { id: 23, title: 'Bağdat Caddesi gezinti', duration: '2 saat', cost: '0–300 TL', category: 'Yakın Lokasyon Keşif', icon: '🛍️' },
  { id: 24, title: 'Sokak lezzetleri turu', duration: '2 saat', cost: '200–400 TL', category: 'Yakın Lokasyon Keşif', icon: '🌭' },
  { id: 25, title: 'Kahve keşif günü', duration: '2–3 saat', cost: '300–600 TL', category: 'Yakın Lokasyon Keşif', icon: '☕' },
  { id: 26, title: 'İkinci el kitapçılar turu', duration: '1–2 saat', cost: '100–300 TL', category: 'Yakın Lokasyon Keşif', icon: '📚' },
  { id: 27, title: 'Fotoğraf yürüyüşü', duration: '2 saat', cost: '0 TL', category: 'Yakın Lokasyon Keşif', icon: '📷' },
  { id: 28, title: 'Sokak müzisyenleri dinleme', duration: '1–2 saat', cost: '0 TL', category: 'Yakın Lokasyon Keşif', icon: '🎸' },
  { id: 29, title: 'Günlük mini vlog çekimi', duration: '1–2 saat', cost: '0 TL', category: 'Yakın Lokasyon Keşif', icon: '🤳' },
  { id: 30, title: 'Yeni semt keşfi', duration: '2–4 saat', cost: '200–500 TL', category: 'Yakın Lokasyon Keşif', icon: '🗺️' },
  { id: 31, title: 'Pet-friendly kafede kahvaltı', duration: '2 saat', cost: '500–800 TL', category: 'Sosyal & Eğlence', icon: '🍳' },
  { id: 32, title: 'Tatlı & kahve turu', duration: '1–2 saat', cost: '300–600 TL', category: 'Sosyal & Eğlence', icon: '🍰' },
  { id: 33, title: 'Dondurma + yürüyüş', duration: '1 saat', cost: '150–300 TL', category: 'Sosyal & Eğlence', icon: '🍦' },
  { id: 34, title: 'Hilltown AVM gezisi', duration: '2–3 saat', cost: '300–800 TL', category: 'Sosyal & Eğlence', icon: '🏢' },
  { id: 35, title: 'Maltepe Piazza AVM', duration: '2–4 saat', cost: '400–900 TL', category: 'Sosyal & Eğlence', icon: '🛒' },
  { id: 36, title: 'Sinema', duration: '2–3 saat', cost: '400–700 TL', category: 'Sosyal & Eğlence', icon: '🎬' },
  { id: 37, title: 'Bowling', duration: '1–2 saat', cost: '400–800 TL', category: 'Sosyal & Eğlence', icon: '🎳' },
  { id: 38, title: 'Oyun salonu', duration: '1 saat', cost: '200–500 TL', category: 'Sosyal & Eğlence', icon: '🕹️' },
  { id: 39, title: 'Karaoke', duration: '1–2 saat', cost: '400–800 TL', category: 'Sosyal & Eğlence', icon: '🎤' },
  { id: 40, title: 'Canlı müzik akşamı', duration: '2–3 saat', cost: '500–1000 TL', category: 'Sosyal & Eğlence', icon: '🎶' },
  { id: 41, title: 'Büyükada günübirlik', duration: '6–8 saat', cost: '600–1200 TL', category: 'Deneyim & Kaçamak', icon: '🚢' },
  { id: 42, title: 'Heybeliada kaçamağı', duration: '5–7 saat', cost: '500–1000 TL', category: 'Deneyim & Kaçamak', icon: '🚲' },
  { id: 43, title: 'Polonezköy doğa turu', duration: 'Yarım gün', cost: '800–1500 TL', category: 'Deneyim & Kaçamak', icon: '🌲' },
  { id: 44, title: 'Tekne turu', duration: 'Yarım gün', cost: '1000–2500 TL', category: 'Deneyim & Kaçamak', icon: '🚤' },
  { id: 45, title: 'Spa günü', duration: '2–3 saat', cost: '1000–2500 TL', category: 'Deneyim & Kaçamak', icon: '💆‍♂️' },
  { id: 46, title: 'Masaj', duration: '1 saat', cost: '1000–3000 TL', category: 'Deneyim & Kaçamak', icon: '🧴' },
  { id: 47, title: 'Escape room', duration: '1 saat', cost: '800–1500 TL', category: 'Deneyim & Kaçamak', icon: '🧩' },
  { id: 48, title: 'Trambolin parkı', duration: '1 saat', cost: '800–1200 TL', category: 'Deneyim & Kaçamak', icon: '🤸‍♂️' },
  { id: 49, title: 'Workshop (seramik, kahve vb.)', duration: '2–3 saat', cost: '500–1500 TL', category: 'Deneyim & Kaçamak', icon: '🎨' },
  { id: 50, title: 'Pet park sosyalleşme günü', duration: '1–2 saat', cost: '0–200 TL', category: 'Deneyim & Kaçamak', icon: '🐕' }
];

export const SOCIAL_ROUTINES = [
  { id: 'r1', name: 'Klasik Cumartesi', items: ['Sahil yürüyüş', 'Kahve', 'Sinema'], cost: '500–900 TL', icon: '📅' },
  { id: 'r2', name: 'Full Doğa Günü', items: ['Park + piknik', 'Köpek oyun', 'Gün batımı'], cost: '200–400 TL', icon: '🌲' },
  { id: 'r3', name: 'Sosyal Gün', items: ['Bağdat Caddesi', 'Kahve turu', 'Akşam yemek'], cost: '600–1200 TL', icon: '🏙️' },
  { id: 'r4', name: 'Minimal Gün', items: ['Sahilde oturma', 'Kitap + kahve'], cost: '100–300 TL', icon: '🧘' },
  { id: 'r5', name: 'Keşif Günü', items: ['Yeni semt', 'Sokak lezzetleri'], cost: '300–700 TL', icon: '🔍' },
  { id: 'r6', name: 'AVM + Eğlence', items: ['AVM', 'Bowling / sinema'], cost: '700–1200 TL', icon: '🍿' },
  { id: 'r7', name: 'Ada Kaçamağı', items: ['Feribot', 'Bisiklet + yemek'], cost: '800–1500 TL', icon: '🏝️' },
  { id: 'r8', name: 'Spor + Rahatlama', items: ['Sabah koşu', 'Akşam spa'], cost: '1000–2500 TL', icon: '💆' },
  { id: 'r9', name: 'Pet Odaklı Gün', items: ['Uzun yürüyüş', 'Pet cafe'], cost: '300–800 TL', icon: '🐶' },
  { id: 'r10', name: 'Premium Gün', items: ['Brunch', 'Tekne turu', 'Akşam yemek'], cost: '1500–3000 TL', icon: '⭐' }
];
