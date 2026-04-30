
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
    id: 't_vienna',
    title: 'Viyana Kaçamağı',
    country: 'Avusturya',
    city: 'Viyana',
    startDate: '2026-05-10',
    endDate: '2026-05-14',
    type: 'yurtdisi',
    tripType: 'tatil',
    travelers: 'ikimiz',
    transportType: 'ucak',
    who: 'ikisi',
    schengen: true,
    status: 'kesin',
    notes: 'Pegasus ile Viyana kaçamağı! 🇦🇹',
    valiz: {
      gorkem: [
        { id: 1, text: 'Pasaport', done: false },
        { id: 2, text: 'Viyana Rehberi', done: false }
      ],
      esra: [
        { id: 1, text: 'Pasaport', done: false },
        { id: 2, text: 'Kamera', done: false }
      ]
    },
    transportation: { 
      departure: { flightNo: 'PC903', airline: 'Pegasus', pnr: '1TG17K', time: '10:15 (SAW)', status: 'Planlandı' },
      return: { flightNo: 'PC904', airline: 'Pegasus', pnr: '1TG17K', time: '12:20 (VIE)', status: 'Planlandı' }
    },
    accommodation: { 
      hotel: 'Austria Trend Hotel Europa Wien', 
      address: 'Kärntner Str. 18, 1010 Wien', 
      bookingId: '3824.152.941', 
      link: 'https://www.booking.com/hotel/at/austriatrendhoteleuropa.tr.html' 
    }
  },
  {
    id: 't_kibris',
    title: 'Kıbrıs Turu',
    country: 'KKTC',
    city: 'Girne',
    startDate: '2026-06-19',
    endDate: '2026-06-21',
    type: 'yurtici',
    tripType: 'tatil',
    travelers: 'ikimiz',
    transportType: 'ucak',
    who: 'ikisi',
    schengen: false,
    status: 'planlandi',
    notes: 'Yaz tatili başlangıcı ☀️'
  },
  {
    id:'t1',title:'Marsilya',country:'Fransa',city:'Marsilya',startDate:'2023-02-03',endDate:'2023-02-07',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'ucak',who:'ikisi',schengen:true,status:'tamamlandi',notes:'İlk yurt dışı gezimiz ❤️',
    accommodation: { hotel: 'New Hotel Le Quai - Vieux Port', address: 'Vieux Port, Marsilya, Fransa' },
    evaluations: { gorkem: { star: 10, note: 'Harikaydı!' }, esra: { star: 10, note: 'Unutulmaz...' } }
  },
  {
    id:'t2',title:'Londra',country:'İngiltere',city:'Londra',startDate:'2024-02-02',endDate:'2024-02-08',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'ucak',who:'ikisi',schengen:false,status:'tamamlandi',notes:'',
    accommodation: { hotel: 'AirBnb', address: 'Piccadilly Circus, Londra' },
    evaluations: { gorkem: { star: 9, note: 'Yağmurluydu ama güzeldi.' }, esra: { star: 10, note: 'Müzeler harikaydı.' } }
  },
  {
    id:'t_saraybosna',title:'Saraybosna & Kotor',country:'Bosna Hersek',city:'Saraybosna',startDate:'2024-09-19',endDate:'2024-09-24',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'ucak',who:'ikisi',schengen:false,status:'tamamlandi',notes:'Balkanlar turu!',
    evaluations: { gorkem: { star: 10, note: 'Kotor harikaydı.' }, esra: { star: 10, note: 'Yemekler süperdi.' } }
  },
  {
    id:'t_kavala',title:'Kavala & Selanik',country:'Yunanistan',city:'Selanik',startDate:'2025-05-15',endDate:'2025-05-18',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'araba',who:'ikisi',schengen:true,status:'tamamlandi',notes:'Araba ile Yunanistan kaçamağı.',
    evaluations: { gorkem: { star: 9, note: 'Yollar rahattı.' }, esra: { star: 9, note: 'Deniz çok güzeldi.' } }
  },
  {
    id:'t_sofya',title:'Sofya',country:'Bulgaristan',city:'Sofya',startDate:'2026-01-10',endDate:'2026-01-13',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'ucak',who:'ikisi',schengen:true,status:'tamamlandi',notes:'Kısa bir kış tatili.',
    evaluations: { gorkem: { star: 8, note: 'Soğuk ama keyifliydi.' }, esra: { star: 8, note: 'Şehir merkezi güzel.' } }
  },
  {
    id:'t3',title:'Berlin Gezisi',country:'Almanya',city:'Berlin',startDate:'2023-11-10',endDate:'2023-11-13',type:'yurtdisi',tripType:'tatil',travelers:'ikimiz',transportType:'ucak',who:'ikisi',schengen:true,status:'tamamlandi',notes:'Birlikte Berlin turu.',
    evaluations: { gorkem: { star: 8, note: 'Berlin çok güzeldi.' }, esra: { star: 8, note: 'Fuar ve şehir turu harikaydı.' } }
  }
];

export const INITIAL_VEHICLE = {
  marketValue: 1550000,
  km: 41452,
  plaka: '34 HH 1144',
  model: 'Toyota C-HR 1.8 Hybrid',
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
  { id: 'r9', name: 'Vlog Günü', items: ['Güzel mekan', 'Foto/Video çekim'], cost: '200–500 TL', icon: '🎥' },
  { id: 'r10', name: 'Kış Keyfi', items: ['Sıcak çikolata', 'Kartopu/Kar yürüyüşü'], cost: '200–400 TL', icon: '❄️' }
];

export const PACKING_POOL = [
  // TEMEL (1-20)
  { id: 'p1', text: 'Pasaport', category: 'Temel', icon: '🛂', minDays: 0, type: 'yurtdisi', priority: 100 },
  { id: 'p2', text: 'Nüfus Cüzdanı / Kimlik', category: 'Temel', icon: '🪪', minDays: 0, priority: 100 },
  { id: 'p3', text: 'Uçak / Tren Biletleri', category: 'Temel', icon: '🎫', minDays: 0, priority: 100 },
  { id: 'p4', text: 'Nakit Para (Döviz/TL)', category: 'Temel', icon: '💵', minDays: 0, priority: 90 },
  { id: 'p5', text: 'Kredi Kartları', category: 'Temel', icon: '💳', minDays: 0, priority: 100 },
  { id: 'p6', text: 'Vize Belgeleri', category: 'Temel', icon: '📄', minDays: 0, type: 'yurtdisi', priority: 100 },
  { id: 'p7', text: 'Otel Rezervasyon Çıktısı', category: 'Temel', icon: '🏨', minDays: 0 },
  { id: 'p8', text: 'Seyahat Sigortası Poliçesi', category: 'Temel', icon: '🛡️', minDays: 0, type: 'yurtdisi' },
  { id: 'p9', text: 'Ehliyet', category: 'Temel', icon: '🪪', minDays: 0 },
  { id: 'p10', text: 'Ev Anahtarları', category: 'Temel', icon: '🔑', minDays: 0 },
  { id: 'p11', text: 'Acil Durum İletişim Listesi', category: 'Temel', icon: '📞', minDays: 0 },
  { id: 'p12', text: 'Yol Tarifi / Harita (Çevrimdışı)', category: 'Temel', icon: '🗺️', minDays: 0 },
  { id: 'p13', text: 'Kalem', category: 'Temel', icon: '🖊️', minDays: 0 },
  { id: 'p14', text: 'Not Defteri', category: 'Temel', icon: '📓', minDays: 0 },
  { id: 'p15', text: 'ISIC / Öğrenci Kartı', category: 'Temel', icon: '🎓', minDays: 0 },
  { id: 'p16', text: 'Müze Kart', category: 'Temel', icon: '🏛️', minDays: 0 },
  { id: 'p17', text: 'Aşı Kartı / HES (Opsiyonel)', category: 'Temel', icon: '💉', minDays: 0 },
  { id: 'p18', text: 'Küçük Sırt Çantası (Günlük)', category: 'Temel', icon: '🎒', minDays: 0 },
  { id: 'p19', text: 'Bel Çantası (Gizli)', category: 'Temel', icon: '👛', minDays: 0 },
  { id: 'p20', text: 'Valiz Kilidi', category: 'Temel', icon: '🔒', minDays: 0 },

  // ELEKTRONİK (21-45)
  { id: 'p21', text: 'Akıllı Telefon', category: 'Elektronik', icon: '📱', minDays: 0, priority: 100 },
  { id: 'p22', text: 'Telefon Şarj Cihazı', category: 'Elektronik', icon: '🔌', minDays: 0, priority: 100 },
  { id: 'p23', text: 'Powerbank', category: 'Elektronik', icon: '🔋', minDays: 0, priority: 80 },
  { id: 'p24', text: 'Laptop / Tablet', category: 'Elektronik', icon: '💻', minDays: 0 },
  { id: 'p25', text: 'Laptop Şarj Cihazı', category: 'Elektronik', icon: '🔌', minDays: 0 },
  { id: 'p26', text: 'Kulaklık (Kablolu/Bluetooth)', category: 'Elektronik', icon: '🎧', minDays: 0 },
  { id: 'p27', text: 'Evrensel Priz Adaptörü', category: 'Elektronik', icon: '🔌', minDays: 0, type: 'yurtdisi' },
  { id: 'p28', text: 'Fotoğraf Makinesi', category: 'Elektronik', icon: '📷', minDays: 0 },
  { id: 'p29', text: 'Kamera Bataryası & Şarjı', category: 'Elektronik', icon: '🔋', minDays: 0 },
  { id: 'p30', text: 'SD Kartlar (Yedek)', category: 'Elektronik', icon: '💾', minDays: 0 },
  { id: 'p31', text: 'Kindle / E-Kitap Okuyucu', category: 'Elektronik', icon: '📖', minDays: 2 },
  { id: 'p32', text: 'Akıllı Saat & Şarjı', category: 'Elektronik', icon: '⌚', minDays: 0 },
  { id: 'p33', text: 'Bluetooth Hoparlör', category: 'Elektronik', icon: '🔊', minDays: 2 },
  { id: 'p34', text: 'Çoklu Priz (Grup Priz)', category: 'Elektronik', icon: '🔌', minDays: 3 },
  { id: 'p35', text: 'Elektronik Diş Fırçası Şarjı', category: 'Elektronik', icon: '🪥', minDays: 3 },
  { id: 'p36', text: 'Tıraş Makinesi & Şarjı', category: 'Elektronik', icon: '🪒', minDays: 3 },
  { id: 'p37', text: 'Saç Kurutma Makinesi (Mini)', category: 'Elektronik', icon: '💨', minDays: 2 },
  { id: 'p38', text: 'GoPro & Aksesuarları', category: 'Elektronik', icon: '📹', minDays: 2 },
  { id: 'p39', text: 'USB Bellek', category: 'Elektronik', icon: '💾', minDays: 0 },
  { id: 'p40', text: 'HDMI Kablosu', category: 'Elektronik', icon: '🔌', minDays: 4 },
  { id: 'p41', text: 'Gürültü Engelleyici Kulaklık', category: 'Elektronik', icon: '🎧', minDays: 0 },
  { id: 'p42', text: 'Selfie Çubuğu / Tripod', category: 'Elektronik', icon: '🤳', minDays: 0 },
  { id: 'p43', text: 'Dron & Kumandası', category: 'Elektronik', icon: '🚁', minDays: 3 },
  { id: 'p44', text: 'Mouse & Mousepad', category: 'Elektronik', icon: '🖱️', minDays: 0, type: 'is' },
  { id: 'p45', text: 'Sunum Kumandası', category: 'Elektronik', icon: '🖱️', minDays: 0, type: 'is' },

  // GİYİM (46-85)
  { id: 'p46', text: 'İç Çamaşırı', category: 'Giyim', icon: '🩲', minDays: 0, perDay: 1.2, priority: 100 },
  { id: 'p47', text: 'Çorap', category: 'Giyim', icon: '🧦', minDays: 0, perDay: 1.2, priority: 100 },
  { id: 'p48', text: 'Tişört (Kısa Kollu)', category: 'Giyim', icon: '👕', minDays: 0, perDay: 0.8, temp: 'hot' },
  { id: 'p49', text: 'Tişört (Uzun Kollu)', category: 'Giyim', icon: '👕', minDays: 0, perDay: 0.5, temp: 'mild' },
  { id: 'p50', text: 'Pantolon (Jean)', category: 'Giyim', icon: '👖', minDays: 0, perDay: 0.3 },
  { id: 'p51', text: 'Pantolon (Kumaş/Şık)', category: 'Giyim', icon: '👖', minDays: 2 },
  { id: 'p52', text: 'Şort', category: 'Giyim', icon: '🩳', minDays: 0, type: 'yaz', temp: 'hot' },
  { id: 'p53', text: 'Etek / Elbise', category: 'Giyim', icon: '👗', minDays: 0, owner: 'esra' },
  { id: 'p54', text: 'Gömlek (Casual)', category: 'Giyim', icon: '👔', minDays: 2 },
  { id: 'p55', text: 'Gömlek (Resmi)', category: 'Giyim', icon: '👔', minDays: 0, type: 'is' },
  { id: 'p56', text: 'Ceket / Blazer', category: 'Giyim', icon: '🧥', minDays: 0, type: 'is' },
  { id: 'p57', text: 'Kazak / Hoodie', category: 'Giyim', icon: '🧥', minDays: 2, temp: 'cold' },
  { id: 'p58', text: 'Hırka', category: 'Giyim', icon: '🧥', minDays: 2, temp: 'mild' },
  { id: 'p59', text: 'Mont / Kaban', category: 'Giyim', icon: '🧥', minDays: 0, type: 'kis', temp: 'cold' },
  { id: 'p60', text: 'Yağmurluk / Rüzgarlık', category: 'Giyim', icon: '🧥', minDays: 0, weather: 'rainy' },
  { id: 'p61', text: 'Pijama Takımı', category: 'Giyim', icon: '🛌', minDays: 1 },
  { id: 'p62', text: 'Yürüyüş Ayakkabısı', category: 'Giyim', icon: '👟', minDays: 0, priority: 90 },
  { id: 'p63', text: 'Şık Ayakkabı', category: 'Giyim', icon: '👞', minDays: 2 },
  { id: 'p64', text: 'Sandalet / Terlik', category: 'Giyim', icon: '🩴', minDays: 0, temp: 'hot' },
  { id: 'p65', text: 'Deniz Terliği', category: 'Giyim', icon: '🩴', minDays: 0, type: 'yaz', temp: 'hot' },
  { id: 'p66_g', text: 'Deniz Şortu / Mayo', category: 'Giyim', icon: '🩳', minDays: 0, type: 'yaz', temp: 'hot', owner: 'gorkem' },
  { id: 'p66_e', text: 'Bikini / Mayo', category: 'Giyim', icon: '🩱', minDays: 0, type: 'yaz', temp: 'hot', owner: 'esra' },
  { id: 'p67', text: 'Plaj Havlusu', category: 'Giyim', icon: '🧣', minDays: 0, type: 'yaz' },
  { id: 'p68', text: 'Kemer', category: 'Giyim', icon: 'ベルト', minDays: 0 },
  { id: 'p69', text: 'Atkı / Şal', category: 'Giyim', icon: '🧣', minDays: 0, type: 'kis', temp: 'cold' },
  { id: 'p70', text: 'Bere / Şapka', category: 'Giyim', icon: '🧢', minDays: 0 },
  { id: 'p71', text: 'Eldiven', category: 'Giyim', icon: '🧤', minDays: 0, type: 'kis', temp: 'cold' },
  { id: 'p72', text: 'Güneş Gözlüğü', category: 'Giyim', icon: '🕶️', minDays: 0, temp: 'hot' },
  { id: 'p73', text: 'Spor Kıyafetleri', category: 'Giyim', icon: '🎽', minDays: 3 },
  { id: 'p74', text: 'Eşofman Altı', category: 'Giyim', icon: '👖', minDays: 1 },
  { id: 'p75', text: 'İnce Hırka (Uçak İçin)', category: 'Giyim', icon: '🧥', minDays: 0 },
  { id: 'p76', text: 'Yelek', category: 'Giyim', icon: '🧥', minDays: 3 },
  { id: 'p77', text: ' Kravat', category: 'Giyim', icon: '👔', minDays: 0, type: 'is' },
  { id: 'p78', text: 'Takım Elbise', category: 'Giyim', icon: '👔', minDays: 0, type: 'is' },
  { id: 'p79', text: 'Tayt', category: 'Giyim', icon: '👖', minDays: 1, owner: 'esra' },
  { id: 'p80', text: 'Fular', category: 'Giyim', icon: '🧣', minDays: 2, owner: 'esra' },
  { id: 'p81', text: 'Atlet / Fanila', category: 'Giyim', icon: '👕', minDays: 0 },
  { id: 'p82', text: 'Yağmur Botu', category: 'Giyim', icon: '👢', minDays: 0, type: 'kis', weather: 'rainy' },
  { id: 'p83', text: 'Kar Pantolonu', category: 'Giyim', icon: '👖', minDays: 0, type: 'kis', temp: 'cold' },
  { id: 'p84', text: 'Termal İçlik', category: 'Giyim', icon: '👕', minDays: 0, type: 'kis', temp: 'cold' },
  { id: 'p85', text: 'Yedek Bağcık', category: 'Giyim', icon: '🧵', minDays: 5 },

  // HİJYEN & BAKIM (86-115)
  { id: 'p86', text: 'Diş Fırçası', category: 'Hijyen', icon: '🪥', minDays: 0, priority: 100 },
  { id: 'p87', text: 'Diş Macunu', category: 'Hijyen', icon: '🦷', minDays: 0, priority: 100 },
  { id: 'p88', text: 'Diş İpi', category: 'Hijyen', icon: '🧵', minDays: 0 },
  { id: 'p89', text: 'Deodorant / Roll-on', category: 'Hijyen', icon: '🧴', minDays: 0, priority: 90 },
  { id: 'p90', text: 'Parfüm', category: 'Hijyen', icon: '✨', minDays: 0 },
  { id: 'p91', text: 'Şampuan (Seyahat Boy)', category: 'Hijyen', icon: '🧴', minDays: 1 },
  { id: 'p92', text: 'Saç Kremi', category: 'Hijyen', icon: '🧴', minDays: 1 },
  { id: 'p93', text: 'Duş Jeli', category: 'Hijyen', icon: '🧼', minDays: 1 },
  { id: 'p94', text: 'Yüz Yıkama Jeli', category: 'Hijyen', icon: '🧼', minDays: 1 },
  { id: 'p95', text: 'Nemlendirici Krem', category: 'Hijyen', icon: '🧴', minDays: 0 },
  { id: 'p96', text: 'Güneş Kremi', category: 'Hijyen', icon: '☀️', minDays: 0, temp: 'hot' },
  { id: 'p97', text: 'Dudak Balmı (SPF)', category: 'Hijyen', icon: '💄', minDays: 0 },
  { id: 'p98', text: 'Tıraş Bıçağı & Köpüğü', category: 'Hijyen', icon: '🪒', minDays: 2, owner: 'gorkem' },
  { id: 'p99', text: 'Saç Fırçası / Tarak', category: 'Hijyen', icon: '🪮', minDays: 0 },
  { id: 'p100', text: 'Tırnak Makası & Törpü', category: 'Hijyen', icon: '✂️', minDays: 3 },
  { id: 'p101', text: 'Cımbız', category: 'Hijyen', icon: '📐', minDays: 3 },
  { id: 'p102', text: 'Makyaj Malzemeleri', category: 'Hijyen', icon: '💄', minDays: 0, owner: 'esra' },
  { id: 'p103', text: 'Makyaj Temizleme Suyu', category: 'Hijyen', icon: '🧴', minDays: 0, owner: 'esra' },
  { id: 'p104', text: 'Pamuk & Kulak Çubuğu', category: 'Hijyen', icon: '☁️', minDays: 1 },
  { id: 'p105', text: 'El Dezenfektanı', category: 'Hijyen', icon: '🧼', minDays: 0 },
  { id: 'p106', text: 'Islak Mendil', category: 'Hijyen', icon: '🧻', minDays: 0 },
  { id: 'p107', text: 'Kağıt Mendil', category: 'Hijyen', icon: '🧻', minDays: 0 },
  { id: 'p108', text: 'Ped / Tampon', category: 'Hijyen', icon: '🩸', minDays: 0, owner: 'esra' },
  { id: 'p109', text: 'Saç Spreyi / Jöle', category: 'Hijyen', icon: '🧴', minDays: 2 },
  { id: 'p110', text: 'Lensi Kutusu & Solüsyonu', category: 'Hijyen', icon: '👁️', minDays: 0 },
  { id: 'p111', text: 'Güneş Sonrası Losyon', category: 'Hijyen', icon: '🧴', minDays: 0, type: 'yaz', temp: 'hot' },
  { id: 'p112', text: 'Kişisel Bakım Çantası', category: 'Hijyen', icon: '👝', minDays: 0 },
  { id: 'p113', text: 'Ayna (Küçük)', category: 'Hijyen', icon: '🪞', minDays: 3 },
  { id: 'p114', text: 'Katı Sabun (Yedek)', category: 'Hijyen', icon: '🧼', minDays: 5 },
  { id: 'p115', text: 'Ayakkabı Boyası / Süngeri', category: 'Hijyen', icon: '🧽', minDays: 3 },

  // SAĞLIK (116-130)
  { id: 'p116', text: 'Düzenli Kullanılan İlaçlar', category: 'Sağlık', icon: '💊', minDays: 0, priority: 100 },
  { id: 'p117', text: 'Ağrı Kesici & Ateş Düşürücü', category: 'Sağlık', icon: '💊', minDays: 0, priority: 80 },
  { id: 'p118', text: 'Yara Bandı', category: 'Sağlık', icon: '🩹', minDays: 0 },
  { id: 'p119', text: 'Mide İlacı / Antiasit', category: 'Sağlık', icon: '💊', minDays: 0 },
  { id: 'p120', text: 'Vitaminler', category: 'Sağlık', icon: '💊', minDays: 0 },
  { id: 'p121', text: 'Böcek Kovucu Sprey', category: 'Sağlık', icon: '🦟', minDays: 0, temp: 'hot' },
  { id: 'p122', text: 'Sinek Isırığı Kremi', category: 'Sağlık', icon: '🧴', minDays: 0, temp: 'hot' },
  { id: 'p123', text: 'Termometre', category: 'Sağlık', icon: '🌡️', minDays: 2 },
  { id: 'p124', text: 'Kas Gevşetici Krem', category: 'Sağlık', icon: '🧴', minDays: 3 },
  { id: 'p125', text: 'Göz Damlası', category: 'Sağlık', icon: '💧', minDays: 0 },
  { id: 'p126', text: 'Burun Spreyi', category: 'Sağlık', icon: '👃', minDays: 0 },
  { id: 'p127', text: 'Boğaz Pastili', category: 'Sağlık', icon: '🍬', minDays: 2 },
  { id: 'p128', text: 'Güneş Yanığı Kremi', category: 'Sağlık', icon: '🧴', minDays: 0, type: 'yaz', temp: 'hot' },
  { id: 'p129', text: 'Küçük İlk Yardım Kiti', category: 'Sağlık', icon: '🩺', minDays: 5 },
  { id: 'p130', text: 'Maske (Cerrahi)', category: 'Sağlık', icon: '😷', minDays: 0 },

  // DİĞER (131-150)
  { id: 'p131', text: 'Boyun Yastığı', category: 'Diğer', icon: '🛌', minDays: 0 },
  { id: 'p132', text: 'Göz Bandı', category: 'Diğer', icon: '🙈', minDays: 0 },
  { id: 'p133', text: 'Kulak Tıkacı', category: 'Diğer', icon: '👂', minDays: 0 },
  { id: 'p134', text: 'Şemsiye', category: 'Diğer', icon: '☂️', minDays: 0, weather: 'rainy' },
  { id: 'p135', text: 'Kilitli Poşetler', category: 'Diğer', icon: '🛍️', minDays: 1 },
  { id: 'p136', text: 'Kirli Çamaşır Torbası', category: 'Diğer', icon: '🛍️', minDays: 1 },
  { id: 'p137', text: 'Seyahat Tipi Ütü', category: 'Diğer', icon: '💨', minDays: 4 },
  { id: 'p138', text: 'Dikiş Seti (Mini)', category: 'Diğer', icon: '🪡', minDays: 5 },
  { id: 'p139', text: 'İsviçre Çakısı (Valizde!)', category: 'Diğer', icon: '🔪', minDays: 3 },
  { id: 'p140', text: 'El Feneri', category: 'Diğer', icon: '🔦', minDays: 3 },
  { id: 'p141', text: 'Çakmak / Kibrit', category: 'Diğer', icon: '🔥', minDays: 0 },
  { id: 'p142', text: 'Termos / Matara', category: 'Diğer', icon: '🥤', minDays: 0 },
  { id: 'p143', text: 'Atıştırmalık (Kuruyemiş vb.)', category: 'Diğer', icon: '🥜', minDays: 0 },
  { id: 'p144', text: 'Sakız / Şekerleme', category: 'Diğer', icon: '🍬', minDays: 0 },
  { id: 'p145', text: 'Kağıt Oyun Kartları', category: 'Diğer', icon: '🃏', minDays: 2 },
  { id: 'p146', text: 'Dergiler', category: 'Diğer', icon: '📚', minDays: 2 },
  { id: 'p147', text: 'Yedek Gözlük', category: 'Diğer', icon: '👓', minDays: 5 },
  { id: 'p148', text: 'Adres Etiketi (Valiz İçin)', category: 'Diğer', icon: '🏷️', minDays: 0 },
  { id: 'p149', text: 'Küçük Bir Hediye', category: 'Diğer', icon: '🎁', minDays: 0 },
  { id: 'p150', text: 'Waffle İçin Yedek Mama', category: 'Diğer', icon: '🐶', minDays: 0 },
  { id: 'p151', text: 'Linen Gömlek', category: 'Giyim', icon: '👕', minDays: 0, temp: 'hot', type: 'yaz' },
  { id: 'p152', text: 'Katlanabilir Ek Çanta', category: 'Diğer', icon: '🛍️', minDays: 0 },
  { id: 'p153', text: 'Mütevazı Kıyafetler (Omuz örten)', category: 'Giyim', icon: '🧣', minDays: 0 },
  { id: 'p154', text: 'Kabin Boy Valiz', category: 'Temel', icon: '🧳', minDays: 0 },
  { id: 'p155', text: 'Yedek Valiz Etiketi', category: 'Diğer', icon: '🏷️', minDays: 0 }
];

export const GEO_ADVICE = {
  countries: {
    'ingiltere': { tips: ['Priz tipi farklı (Tip G), dönüştürücünü unutma!', 'Her an yağmur yağabilir, şemsiye hep yanında olsun.'], items: ['p27', 'p134'] },
    'uk': { tips: ['Priz tipi farklı (Tip G), dönüştürücünü unutma!', 'Her an yağmur yağabilir, şemsiye hep yanında olsun.'], items: ['p27', 'p134'] },
    'abd': { tips: ['Priz tipi farklı (Tip A/B), dönüştürücünü unutma!', 'Porsiyonlar büyük, mide ilacı yanına alabilirsin.'], items: ['p27', 'p119'] },
    'usa': { tips: ['Priz tipi farklı (Tip A/B), dönüştürücünü unutma!', 'Porsiyonlar büyük, mide ilacı yanına alabilirsin.'], items: ['p27', 'p119'] },
    'japonya': { tips: ['Nakit çok önemli, yanına yeterli Yen al.', 'Çok fazla yürüyeceksin, en rahat ayakkabını seç.'], items: ['p4', 'p62'] },
    'italya': { tips: ['Vatikan/Kilise ziyaretleri için omuz örten kıyafet al.', 'Şehir vergisi için bozuk para taşı.'], items: ['p153', 'p4'] },
    'bae': { tips: ['UV indeksi çok yüksek, güneş kremi şart!', 'Klimalar çok soğuk, ince bir hırka al.'], items: ['p96', 'p75'] },
    'dubai': { tips: ['UV indeksi çok yüksek, güneş kremi şart!', 'Klimalar çok soğuk, ince bir hırka al.'], items: ['p96', 'p75'] },
    'fransa': { tips: ['Paris\'te yankesicilere dikkat, bel çantanı al.', 'Pazar günleri çoğu yer kapalıdır.'], items: ['p19'] },
    'hollanda': { tips: ['Bisiklet kiralayacaksan rüzgarlık al.', 'Kanal turunda hava serin olabilir.'], items: ['p60', 'p75'] },
    'avusturya': { tips: ['Opera için şık bir kıyafet alabilirsin.', 'Yürüyüş ayakkabısı şehir turunda lazım.'], items: ['p51', 'p62'] }
  },
  cities: {
    'roma': { tips: ['Antik yollarda yürümek zor olabilir, tabanı kalın ayakkabı seç.'], items: ['p62'] },
    'londra': { tips: ['Metro (Tube) çok karışık ama hızlıdır, çevrimdışı harita al.'], items: ['p12'] },
    'milano': { tips: ['Moda başkenti, şık bir ceket/elbise al.', 'Alışveriş için valizde yer ayır.'], items: ['p56', 'p53', 'p152'] },
    'paris': { tips: ['Eyfel kulesi akşam serin olur, ince bir hırka al.'], items: ['p75'] },
    'viyana': { tips: ['Klasik müzik konserleri için resmi kıyafet önerilir.'], items: ['p55', 'p56'] },
    'istanbul': { tips: ['Ferry yolculukları için hırka al.', 'Cami ziyaretleri için şal bulundur.'], items: ['p75', 'p69'] }
  }
};


export const BUCKET_LIST = [
  { 
    id: 1, title: 'Machu Picchu', country: 'Peru', city: 'Cusco', duration: '17s', flag: '🇵🇪', category: 'Macera', budget: '€2.500–3.500', season: 'Mayıs–Eylül',
    wikiTitle: 'Machu_Picchu', 
    highlights: ['İnka Yolu Yürüyüşü', 'Güneş Kapısı Manzarası', 'Antik İnka Şehri Turu'],
    funFacts: ['Tekerlek kullanmadan devasa taşlarla inşa edilmiştir.', '1911 yılına kadar dış dünyadan gizli kalmıştır.'],
    fallbackDesc: 'And Dağları\'nın zirvesinde yer alan, 15. yüzyıldan kalma büyüleyici bir İnka antik şehri.'
  },
  { 
    id: 2, title: 'Great Barrier Reef', country: 'Avustralya', city: 'Cairns', duration: '20s', flag: '🇦🇺', category: 'Doğa', budget: '€3.000–4.500', season: 'Haziran–Ekim',
    wikiTitle: 'Great_Barrier_Reef',
    highlights: ['Resif Üzerinde Dalış', 'Helikopter Turu', 'Whitsunday Adaları Gezisi'],
    funFacts: ['Dünyanın en büyük mercan resif sistemidir.', 'Uzaydan görülebilen tek canlı yapıdır.'],
    fallbackDesc: '2.300 kilometreden fazla alana yayılan, dünyanın en büyük ve en büyüleyici mercan resifi.'
  },
  { 
    id: 3, title: 'Grand Canyon', country: 'ABD', city: 'Arizona', duration: '13s', flag: '🇺🇸', category: 'Doğa', budget: '€2.000–3.000', season: 'Mart–Mayıs',
    wikiTitle: 'Grand_Canyon',
    highlights: ['Havasu Şelaleleri', 'Skywalk Cam Teras', 'Colorado Nehri Rafting'],
    funFacts: ['Kanyonun en derin noktası 1.8 kilometre derinliktedir.', 'Milyarlarca yıllık jeolojik tarihi yansıtır.'],
    fallbackDesc: 'Colorado Nehri tarafından milyonlarca yılda oyulmuş, devasa ve görkemli bir kanyon sistemi.'
  },
  { 
    id: 4, title: 'Northern Lights', country: 'Norveç', city: 'Tromsø', duration: '5s', flag: '🇳🇴', category: 'Doğa', budget: '€1.500–2.500', season: 'Kasım–Mart',
    wikiTitle: 'Aurora',
    highlights: ['Aurora Avı Turu', 'Ren Geyiği Safarisi', 'Fiyort Gezisi'],
    funFacts: ['Güneşten gelen yüklü parçacıkların atmosferle etkileşimi sonucu oluşur.', 'Sadece kutup bölgelerine yakın yerlerde görülebilir.'],
    fallbackDesc: 'Gökyüzünde dans eden büyüleyici renkli ışıklar, doğanın en muazzam gösterilerinden biri.'
  },
  { 
    id: 5, title: 'Paris', country: 'Fransa', city: 'Paris', duration: '3.5s', flag: '🇫🇷', category: 'Romantik', budget: '€800–1.500', season: 'Nisan–Haziran',
    wikiTitle: 'Paris',
    highlights: ['Eiffel Kulesi Çıkışı', 'Louvre Müzesi Turu', 'Seine Nehri Akşam Yemeği'],
    funFacts: ['Paris\'te 300\'den fazla müze bulunmaktadır.', 'Şehirdeki en eski köprü "Pont Neuf" (Yeni Köprü) adını taşır.'],
    fallbackDesc: 'Işıklar Şehri olarak bilinen, aşkın, sanatın ve gastronomini kalbi Paris.'
  },
  { 
    id: 6, title: 'Kyoto', country: 'Japonya', city: 'Osaka', duration: '11s', flag: '🇯🇵', category: 'Kültür', budget: '€2.000–3.000', season: 'Mart–Nisan',
    wikiTitle: 'Kyoto',
    highlights: ['Fushimi Inari Tapınağı', 'Arashiyama Bambu Ormanı', 'Gion Geyşa Bölgesi'],
    funFacts: ['Japonya\'nın 1000 yıldan fazla bir süre başkentliğini yapmıştır.', '2000\'den fazla tapınak ve türbeye ev sahipliği yapar.'],
    fallbackDesc: 'Geleneksel Japon kültürünün merkezi, büyüleyici tapınakları ve bahçeleriyle ünlü tarihi şehir.'
  },
  { 
    id: 12, title: 'Serengeti National Park', country: 'Tanzanya', city: 'Arusha', duration: '8s', flag: '🇹🇿', category: 'Macera', budget: '€2.500–4.000', season: 'Haziran–Ekim',
    wikiTitle: 'Serengeti_National_Park',
    highlights: ['Büyük Göçü İzle', 'Sıcak Hava Balonu Safarisi', 'Beş Büyük Av Hayvanını Gör'],
    funFacts: ['Dünyanın en büyük kara memelisi göçüne ev sahipliği yapar.', '"Serengeti" kelimesi Masay dilinde "sonsuz düzlükler" anlamına gelir.'],
    fallbackDesc: 'Afrika\'nın en ünlü vahşi yaşam koruma alanı, muazzam düzlükleri ve Büyük Göç ile biliniyor.'
  },
  { 
    id: 13, title: 'Amazon Rainforest', country: 'Brezilya', city: 'Manaus', duration: '16s', flag: '🇧🇷', category: 'Doğa', budget: '€2.500–4.000', season: 'Temmuz–Kasım',
    wikiTitle: 'Amazon_rainforest',
    highlights: ['Kano ile Nehir Turu', 'Gece Orman Yürüyüşü', 'Yerli Kabile Ziyareti'],
    funFacts: ['Dünyadaki oksijenin %20\'sini üretir, "Dünyanın Akciğerleri" olarak bilinir.', 'İçinde hala keşfedilmemiş binlerce tür barındırır.'],
    fallbackDesc: 'Dünyanın en büyük tropikal yağmur ormanı, biyolojik çeşitliliğin zirve noktası.'
  },
  { 
    id: 14, title: 'Venice', country: 'İtalya', city: 'Venedik', duration: '2s', flag: '🇮🇹', category: 'Romantik', budget: '€800–1.400', season: 'Nisan–Haziran',
    wikiTitle: 'Venice',
    highlights: ['Gondol Turu', 'Aziz Mark Meydanı', 'Rialto Köprüsü'],
    funFacts: ['118 küçük ada üzerine kurulmuştur ve 400\'den fazla köprüsü vardır.', 'Şehirde hiç otomobil bulunmaz, ulaşım tamamen su yoluyladır.'],
    fallbackDesc: 'Kanallar şehri Venedik, eşsiz mimarisi ve romantik atmosferiyle zamansız bir destinasyon.'
  },
  { 
    id: 15, title: 'Mount Fuji', country: 'Japonya', city: 'Shizuoka', duration: '11s', flag: '🇯🇵', category: 'Doğa', budget: '€2.000–3.000', season: 'Temmuz–Eylül',
    wikiTitle: 'Mount_Fuji',
    highlights: ['Zirve Tırmanışı', 'Kawaguchi Gölü Manzarası', 'Arakurayama Sengen Parkı'],
    funFacts: ['Japonya\'nın en yüksek dağıdır ve hala aktif bir yanardağdır.', 'Sanatçılar ve şairler için yüzyıllardır kutsal bir ilham kaynağıdır.'],
    fallbackDesc: 'Japonya\'nın simgesi, mükemmel konik yapısıyla ünlü kutsal dağ Fuji.'
  },
  { 
    id: 16, title: 'Cape Town', country: 'Güney Afrika', city: 'Cape Town', duration: '11s', flag: '🇿🇦', category: 'Şehir', budget: '€2.000–3.500', season: 'Kasım–Mart',
    wikiTitle: 'Cape_Town',
    highlights: ['Masa Dağı Teleferik', 'Boulders Plajı Penguenleri', 'Ümit Burnu Gezisi'],
    funFacts: ['Aynı anda iki farklı okyanusu (Atlantik ve Hint) görebileceğiniz nadir yerlerden biridir.', 'Dünyanın en eski botanik bahçelerinden biri olan Kirstenbosch buradadır.'],
    fallbackDesc: 'Okyanus ile dağların buluştuğu, kültürel çeşitliliği ve doğal güzellikleriyle büyüleyen şehir.'
  },
  { 
    id: 17, title: 'Angkor Wat', country: 'Kamboçya', city: 'Siem Reap', duration: '10s', flag: '🇰🇭', category: 'Tarih', budget: '€1.500–2.500', season: 'Kasım–Şubat',
    wikiTitle: 'Angkor_Wat',
    highlights: ['Gündoğumu Tapınak Turu', 'Bayon Tapınağı Yüzleri', 'Ta Prohm Orman Tapınağı'],
    funFacts: ['Dünyanın en büyük dini anıtıdır.', 'Başlangıçta Hindu tapınağı olarak inşa edilmiş, sonra Budist tapınağına dönüşmüştür.'],
    fallbackDesc: 'Kmer İmparatorluğu\'nun görkemli mirası, dünyanın en büyük antik tapınak kompleksi.'
  },
  { 
    id: 18, title: 'Dubai', country: 'BAE', city: 'Dubai', duration: '4.5s', flag: '🇦🇪', category: 'Macera', budget: '€1.000–2.000', season: 'Kasım–Mart',
    wikiTitle: 'Dubai',
    highlights: ['Burj Khalifa Seyir Terası', 'Çöl Safarisi', 'Dubai Mall & Çeşme Gösterisi'],
    funFacts: ['Dünyanın en yüksek binası olan Burj Khalifa\'ya ev sahipliği yapar.', 'Şehirde polisler süper arabalar (Lamborghini, Ferrari) kullanır.'],
    fallbackDesc: 'Modern mimarinin sınırlarını zorlayan, lüks ve maceranın buluştuğu çöl metropolü.'
  },
  { 
    id: 19, title: 'Niagara Falls', country: 'Kanada', city: 'Ontario', duration: '10s', flag: '🇨🇦', category: 'Doğa', budget: '€2.000–3.000', season: 'Mayıs–Eylül',
    wikiTitle: 'Niagara_Falls',
    highlights: ['Tekne Turu (Maid of the Mist)', 'Şelale Arkasına Yolculuk', 'Skylon Tower Manzarası'],
    funFacts: ['Şelalelerden her saniye 3000 tondan fazla su akar.', 'Dünyanın en büyük hidroelektrik güç kaynaklarından biridir.'],
    fallbackDesc: 'Kuzey Amerika\'nın en güçlü ve görkemli şelaleleri, doğanın ham gücünün kanıtı.'
  },
  { 
    id: 20, title: 'Rome', country: 'İtalya', city: 'Roma', duration: '2.5s', flag: '🇮🇹', category: 'Tarih', budget: '€900–1.500', season: 'Nisan–Haziran',
    wikiTitle: 'Rome',
    highlights: ['Kolezyum Turu', 'Vatikan Müzeleri', 'Trevi Çeşmesi (Dilek Tut)'],
    funFacts: ['Şehrin içinde Vatikan adında bağımsız bir devlet bulunur.', 'Efsaneye göre Roma, kurtlar tarafından büyütülen Romulus ve Remus tarafından kurulmuştur.'],
    fallbackDesc: 'Ebedi Şehir Roma, her köşesinde binlerce yıllık tarih ve sanat barındıran açık hava müzesi.'
  },
  { 
    id: 21, title: 'Barcelona', country: 'İspanya', city: 'Barselona', duration: '3.5s', flag: '🇪🇸', category: 'Kültür', budget: '€900–1.500', season: 'Mayıs–Haziran',
    wikiTitle: 'Barcelona',
    highlights: ['Sagrada Familia Ziyareti', 'Park Güell Gezisi', 'La Rambla Yürüyüşü'],
    funFacts: ['Gaudi\'nin Sagrada Familia kilisesi 140 yıldır hala inşa halindedir.', 'Şehirde 7 tane yapay plaj bulunmaktadır.'],
    fallbackDesc: 'Gaudi\'nin mimari şaheserleri, canlı sokakları ve Akdeniz enerjisiyle dolu Katalan başkenti.'
  },
  { 
    id: 22, title: 'London', country: 'İngiltere', city: 'Londra', duration: '4s', flag: '🇬🇧', category: 'Şehir', budget: '€1.000–1.800', season: 'Mayıs–Eylül',
    wikiTitle: 'London',
    highlights: ['London Eye Manzarası', 'British Museum Turu', 'Buckingham Sarayı'],
    funFacts: ['Londra Metrosu (The Tube) dünyanın en eski yer altı ulaşım sistemidir.', 'Şehirde 300\'den fazla dil konuşulmaktadır.'],
    fallbackDesc: 'Tarihi kökleri modern bir ritimle birleştiren, dünyanın en önemli kültür ve finans merkezlerinden biri.'
  },
  { 
    id: 23, title: 'Amsterdam', country: 'Hollanda', city: 'Amsterdam', duration: '3.5s', flag: '🇳🇱', category: 'Şehir', budget: '€900–1.600', season: 'Nisan–Haziran',
    wikiTitle: 'Amsterdam',
    highlights: ['Kanal Tekne Turu', 'Rijksmuseum Gezisi', 'Anne Frank Evi'],
    funFacts: ['Şehirde insan sayısından daha fazla bisiklet bulunmaktadır.', 'Evlerin çoğu 17. yüzyıldan kalma ahşap kazıklar üzerine inşa edilmiştir.'],
    fallbackDesc: 'Özgürlükçü ruhu, tarihi kanalları ve bisiklet kültürüyle ünlü ikonik Hollanda şehri.'
  },
  { 
    id: 24, title: 'Prague', country: 'Çekya', city: 'Prag', duration: '2.5s', flag: '🇨🇿', category: 'Şehir', budget: '€700–1.200', season: 'Nisan–Haziran',
    wikiTitle: 'Prague',
    highlights: ['Charles Köprüsü', 'Prag Kalesi', 'Astronomik Saat Kulesi'],
    funFacts: ['Dünyanın en büyük antik kalesine ev sahipliği yapar.', '"Bin Kuleli Şehir" olarak bilinir.'],
    fallbackDesc: 'Masalsı mimarisi, gotik kuleleri ve tarihi sokaklarıyla Avrupa\'nın en korunmuş Orta Çağ şehirlerinden biri.'
  },
  { 
    id: 25, title: 'Vienna', country: 'Avusturya', city: 'Viyana', duration: '2.5s', flag: '🇦🇹', category: 'Kültür', budget: '€800–1.400', season: 'Nisan–Haziran',
    wikiTitle: 'Vienna',
    highlights: ['Schönbrunn Sarayı', 'Devlet Operası\'nda Konser', 'Klasik Viyana Kahvehaneleri'],
    funFacts: ['Dünyanın en eski hayvanat bahçesi (Tiergarten Schönbrunn) buradadır.', 'Müziğin başkenti olarak bilinir; Mozart, Beethoven ve Strauss burada yaşamıştır.'],
    fallbackDesc: 'İmparatorluk ihtişamı, klasik müzik mirası ve zarif kahve kültürüyle Avrupa\'nın kültür merkezi.'
  },
  { 
    id: 26, title: 'Budapest', country: 'Macaristan', city: 'Budapeşte', duration: '2s', flag: '🇭🇺', category: 'Keyif', budget: '€600–1.100', season: 'Mart–Mayıs',
    wikiTitle: 'Budapest',
    highlights: ['Parlamento Binası', 'Széchenyi Termal Hamamı', 'Balıkçı Tabyası Manzarası'],
    funFacts: ['Budapeşte, aslında Tuna Nehri ile ayrılan Buda ve Peşte şehirlerinin birleşmesiyle oluşmuştur.', 'Dünyanın en büyük termal su sistemlerinden birine sahiptir.'],
    fallbackDesc: 'Tuna\'nın İncisi, muazzam köprüleri ve termal banyolarıyla hem tarihi hem de keyifli bir şehir.'
  },
  { 
    id: 27, title: 'Athens', country: 'Yunanistan', city: 'Atina', duration: '1.5s', flag: '🇬🇷', category: 'Tarih', budget: '€600–1.100', season: 'Nisan–Haziran',
    wikiTitle: 'Athens',
    highlights: ['Akropolis & Parthenon', 'Plaka Mahallesi', 'Antik Agora Gezisi'],
    funFacts: ['Dünyanın en eski şehirlerinden biridir ve 3400 yılı aşkın kayıtlı tarihe sahiptir.', 'Demokrasinin ve Batı felsefesinin doğum yeridir.'],
    fallbackDesc: 'Antik dünyanın kalbi, felsefenin ve sanatın beşiği olan yaşayan bir tarih müzesi.'
  },
  { 
    id: 28, title: 'Cairo', country: 'Mısır', city: 'Kahire', duration: '2s', flag: '🇪🇬', category: 'Tarih', budget: '€700–1.200', season: 'Ekim–Mart',
    wikiTitle: 'Cairo',
    highlights: ['Mısır Müzesi', 'Han el-Halili Çarşısı', 'Selahaddin Eyyubi Kalesi'],
    funFacts: ['Afrika ve Orta Doğu\'nun en büyük şehridir.', '"Bin Minareli Şehir" olarak anılır.'],
    fallbackDesc: 'Nil Nehri kıyısında, binlerce yıllık medeniyetin ve kaotik ama büyüleyici bir modernizmin merkezi.'
  },
  { 
    id: 29, title: 'Pyramids of Giza', country: 'Mısır', city: 'Gize', duration: '2s', flag: '🇪🇬', category: 'Tarih', budget: '€700–1.200', season: 'Ekim–Mart',
    wikiTitle: 'Giza_pyramid_complex',
    highlights: ['Büyük Piramit Ziyareti', 'Sfenks Önünde Fotoğraf', 'Deve Safarisi'],
    funFacts: ['Antik Dünyanın Yedi Harikası\'ndan günümüze ulaşan tek yapıdır.', 'Piramitler, yıldızların konumuna göre milimetrik bir hassasiyetle inşa edilmiştir.'],
    fallbackDesc: 'İnsanlık tarihinin en büyük gizemlerinden biri, devasa piramitler ve sırlar dolu Sfenks.'
  },
  { 
    id: 30, title: 'Moscow', country: 'Rusya', city: 'Moskova', duration: '3s', flag: '🇷🇺', category: 'Şehir', budget: '€900–1.500', season: 'Mayıs–Eylül',
    wikiTitle: 'Moscow',
    highlights: ['Kızıl Meydan', 'Kremlin Sarayı', 'Aziz Vasil Katedrali'],
    funFacts: ['Moskova Metrosu, sanat galerisi gibi süslenmiş istasyonlarıyla ünlüdür.', 'Dünyanın en büyük çanına (Çar Kolokol) ev sahipliği yapar.'],
    fallbackDesc: 'Görkemli meydanları, ikonik soğan kubbeleri ve derin tarihiyle Rus ruhunun kalbi.'
  },
  { 
    id: 31, title: 'Bangkok', country: 'Tayland', city: 'Bangkok', duration: '9s', flag: '🇹🇭', category: 'Kültür', budget: '€1.200–2.000', season: 'Kasım–Mart',
    wikiTitle: 'Bangkok',
    highlights: ['Grand Palace Ziyareti', 'Wat Arun Tapınağı', 'Yüzen Çarşı Turu'],
    funFacts: ['Dünyanın en uzun ismine sahip şehridir (Krung Thep...).', 'Şehirde 400\'den fazla tapınak bulunmaktadır.'],
    fallbackDesc: 'Göz alıcı tapınakları, sokak lezzetleri ve enerjik gece hayatıyla egzotik bir metropol.'
  },
  { 
    id: 32, title: 'Singapore', country: 'Singapur', city: 'Singapur', duration: '11s', flag: '🇸🇬', category: 'Şehir', budget: '€1.800–3.000', season: 'Şubat–Nisan',
    wikiTitle: 'Singapore',
    highlights: ['Gardens by the Bay', 'Marina Bay Sands Havuzu', 'Sentosa Adası'],
    funFacts: ['Dünyanın en yeşil şehirlerinden biridir.', 'Sakız çiğnemek ve satmak yasaktır.'],
    fallbackDesc: 'Geleceğin şehri olarak adlandırılan, teknoloji ve doğanın kusursuz uyumu.'
  },
  { 
    id: 33, title: 'Hong Kong', country: 'Hong Kong', city: 'Hong Kong', duration: '10s', flag: '🇭🇰', category: 'Şehir', budget: '€1.800–3.000', season: 'Ekim–Aralık',
    wikiTitle: 'Hong_Kong',
    highlights: ['Victoria Peak Manzarası', 'Star Ferry ile Geçiş', 'Lantau Adası & Dev Buddha'],
    funFacts: ['Dünyada en çok gökdelene sahip olan şehirdir.', 'Şehrin %40\'ı parklardan ve doğa koruma alanlarından oluşur.'],
    fallbackDesc: 'Doğu ile Batı\'nın buluştuğu, dikey mimarisi ve muazzam limanıyla ünlü ticaret merkezi.'
  },
  { 
    id: 34, title: 'Seoul', country: 'Güney Kore', city: 'Seul', duration: '10s', flag: '🇰🇷', category: 'Kültür', budget: '€1.800–2.800', season: 'Nisan–Haziran',
    wikiTitle: 'Seoul',
    highlights: ['Gyeongbokgung Sarayı', 'Bukchon Hanok Köyü', 'Myeongdong Alışveriş Turu'],
    funFacts: ['Dünyanın en hızlı internet hızlarından birine sahiptir.', 'Dijital ve geleneksel yaşamın en iç içe olduğu metropollerden biridir.'],
    fallbackDesc: 'K-Pop\'un kalbi, teknoloji devlerinin merkezi ve köklü Kore geleneklerinin korunduğu canlı şehir.'
  },
  { 
    id: 35, title: 'Tokyo', country: 'Japonya', city: 'Tokyo', duration: '11s', flag: '🇯🇵', category: 'Şehir', budget: '€2.000–3.200', season: 'Mart–Nisan',
    wikiTitle: 'Tokyo',
    highlights: ['Shibuya Kavşağı', 'Senso-ji Tapınağı', 'Akihabara Elektronik Şehri'],
    funFacts: ['Dünyanın en kalabalık metropol alanıdır.', 'Şehirde her adımda bir otomat (vending machine) bulabilirsiniz.'],
    fallbackDesc: 'Sadelik ve kaosun, gelenek ve fütürizmin bir arada yaşadığı benzersiz bir dünya başkenti.'
  },
  { 
    id: 36, title: 'Los Angeles', country: 'ABD', city: 'Los Angeles', duration: '13s', flag: '🇺🇸', category: 'Şehir', budget: '€2.500–3.500', season: 'Nisan–Haziran',
    wikiTitle: 'Los_Angeles',
    highlights: ['Hollywood Tabelası', 'Santa Monica İskelesi', 'Universal Studios Hollywood'],
    funFacts: ['Dünya film endüstrisinin merkezi "Hollywood" buradadır.', 'Şehirde insan sayısından daha fazla kayıtlı otomobil vardır.'],
    fallbackDesc: 'Melekler Şehri, sinema dünyasının kalbi, geniş plajları ve bitmek bilmeyen güneşiyle ünlü.'
  },
  { 
    id: 37, title: 'San Francisco', country: 'ABD', city: 'San Francisco', duration: '13s', flag: '🇺🇸', category: 'Şehir', budget: '€2.500–3.500', season: 'Eylül–Kasım',
    wikiTitle: 'San_Francisco',
    highlights: ['Golden Gate Köprüsü', 'Alcatraz Hapishanesi', 'Pier 39 Deniz Aslanları'],
    funFacts: ['Şehirdeki meşhur dik yokuşlar ve tramvaylar simgesi haline gelmiştir.', 'Fortune Cookie (Fal Kurabiyesi) aslında burada icat edilmiştir.'],
    fallbackDesc: 'Sisi, dik yokuşları ve özgürlükçü kültürüyle Amerika\'nın en karakteristik şehirlerinden biri.'
  },
  { 
    id: 38, title: 'Las Vegas', country: 'ABD', city: 'Las Vegas', duration: '13s', flag: '🇺🇸', category: 'Keyif', budget: '€2.000–3.000', season: 'Mart–Mayıs',
    wikiTitle: 'Las_Vegas',
    highlights: ['The Strip Yürüyüşü', 'Bellagio Çeşme Gösterisi', 'Grand Canyon Helikopter Turu'],
    funFacts: ['Dünyanın en çok aydınlatılmış yeridir.', 'Şehirdeki otellerde toplamda 150.000\'den fazla oda bulunur.'],
    fallbackDesc: 'Eğlence ve ışıklar şehri, çölde kurulan bir vaha ve kumarhaneleriyle ünlü dünya merkezi.'
  },
  { 
    id: 39, title: 'Miami', country: 'ABD', city: 'Miami', duration: '12s', flag: '🇺🇸', category: 'Keyif', budget: '€2.000–3.000', season: 'Kasım–Nisan',
    wikiTitle: 'Miami',
    highlights: ['South Beach Plajı', 'Little Havana Turu', 'Everglades Ulusal Parkı'],
    funFacts: ['ABD\'nin tek tropikal metropolüdür.', 'Dünyanın "Yolcu Gemisi Başkenti" olarak bilinir.'],
    fallbackDesc: 'Beyaz kumlu plajları, Art Deco mimarisi ve Latin Amerika esintili canlı kültürü.'
  },
  { 
    id: 40, title: 'Chicago', country: 'ABD', city: 'Chicago', duration: '11s', flag: '🇺🇸', category: 'Şehir', budget: '€2.000–3.000', season: 'Mayıs–Eylül',
    wikiTitle: 'Chicago',
    highlights: ['The Bean (Cloud Gate)', 'Willis Tower Cam Teras', 'Chicago Nehri Mimari Turu'],
    funFacts: ['"Rüzgarlı Şehir" olarak bilinir.', 'Dünyanın ilk gökdeleni 1885 yılında burada inşa edilmiştir.'],
    fallbackDesc: 'Muazzam mimarisi, caz kulüpleri ve Michigan Gölü kıyısındaki modern silüeti.'
  },
  { 
    id: 41, title: 'Sydney', country: 'Avustralya', city: 'Sidney', duration: '20s', flag: '🇦🇺', category: 'Şehir', budget: '€3.500–5.000', season: 'Eylül–Kasım',
    wikiTitle: 'Sydney',
    highlights: ['Opera Binası Turu', 'Bondi Plajı Yürüyüşü', 'Harbour Bridge Tırmanışı'],
    funFacts: ['Dünyanın en büyük doğal limanına sahiptir.', 'Opera Binası\'nın çatısı 1 milyondan fazla seramik karoyla kaplıdır.'],
    fallbackDesc: 'İkonik limanı, plajları ve modern yaşam tarzıyla Avustralya\'nın en büyük ve ünlü şehri.'
  },
  { 
    id: 42, title: 'Melbourne', country: 'Avustralya', city: 'Melbourne', duration: '20s', flag: '🇦🇺', category: 'Kültür', budget: '€3.500–5.000', season: 'Mart–Mayıs',
    wikiTitle: 'Melbourne',
    highlights: ['Hosier Lane Sokak Sanatı', 'Great Ocean Road Gezisi', 'Kraliçe Victoria Çarşısı'],
    funFacts: ['Dünyanın spor başkenti olarak bilinir.', 'Dört mevsimin bir günde yaşanabildiği değişken havasıyla ünlüdür.'],
    fallbackDesc: 'Kültür, sanat, kahve ve sporun harmanlandığı, Avustralya\'nın en "Avrupalı" şehri.'
  },
  { 
    id: 43, title: 'Auckland', country: 'Yeni Zelanda', city: 'Auckland', duration: '22s', flag: '🇳🇿', category: 'Doğa', budget: '€4.000–6.000', season: 'Kasım–Mart',
    wikiTitle: 'Auckland',
    highlights: ['Sky Tower Manzarası', 'Waiheke Adası Şarap Turu', 'Mount Eden Krateri'],
    funFacts: ['"Yelkenliler Şehri" olarak bilinir.', 'Şehir, üzerinde 50\'den fazla sönmüş yanardağ bulunan bir volkanik alan üzerine kurulmuştur.'],
    fallbackDesc: 'İki liman arasında yer alan, volkanik tepeleri ve denizci ruhuyla Yeni Zelanda\'nın kapısı.'
  },
  { 
    id: 44, title: 'Rio de Janeiro', country: 'Brezilya', city: 'Rio de Janeiro', duration: '15s', flag: '🇧🇷', category: 'Kültür', budget: '€2.500–3.500', season: 'Aralık–Mart',
    wikiTitle: 'Rio_de_Janeiro',
    highlights: ['Kurtarıcı İsa Heykeli', 'Kesmeşeker Dağı Teleferik', 'Copacabana Plajı'],
    funFacts: ['Dünyanın en büyük karnavalı olan Rio Karnavalı her yıl burada düzenlenir.', '"Rio de Janeiro" ismi "Ocak Nehri" anlamına gelir.'],
    fallbackDesc: 'Enerji dolu karnavalları, muazzam manzaraları ve sambanın ritmiyle büyüleyen Marvelous City.'
  },
  { 
    id: 45, title: 'Buenos Aires', country: 'Arjantin', city: 'Buenos Aires', duration: '17s', flag: '🇦🇷', category: 'Kültür', budget: '€2.500–3.500', season: 'Ekim–Aralık',
    wikiTitle: 'Buenos_Aires',
    highlights: ['La Boca & Caminito', 'Tango Gösterisi', 'Recoleta Mezarlığı Ziyareti'],
    funFacts: ['"Güney\'in Paris\'i" olarak bilinir.', 'Dünyada kişi başına en çok kitapçının düşüğü şehirdir.'],
    fallbackDesc: 'Tangonun doğduğu topraklar, geniş bulvarları ve zengin kültürel mirasıyla bir Latin Amerika klasiği.'
  },
  { 
    id: 46, title: 'Reykjavik', country: 'İzlanda', city: 'Reykjavik', duration: '5s', flag: '🇮🇸', category: 'Doğa', budget: '€1.500–2.500', season: 'Haziran–Ağustos',
    wikiTitle: 'Reykjavík',
    highlights: ['Blue Lagoon Termal Havuz', 'Altın Çember Turu', 'Hallgrímskirkja Kilisesi'],
    funFacts: ['Dünyanın en kuzeydeki başkentidir.', 'Şehrin ismi "Dumanlı Koy" anlamına gelir (jeotermal buharlar nedeniyle).'],
    fallbackDesc: 'Viking mirası, jeotermal enerjisi ve kuzey ışıklarıyla büyüleyen, dünyanın en huzurlu başkentlerinden biri.'
  },
  { 
    id: 47, title: 'Oslo', country: 'Norveç', city: 'Oslo', duration: '4s', flag: '🇳🇴', category: 'Doğa', budget: '€1.200–2.000', season: 'Mayıs–Ağustos',
    wikiTitle: 'Oslo',
    highlights: ['Vigeland Heykel Parkı', 'Viking Gemi Müzesi', 'Oslo Fiyordu Turu'],
    funFacts: ['Dünyanın en yeşil şehirlerinden biridir.', 'Nobel Barış Ödülü her yıl burada verilir.'],
    fallbackDesc: 'Fiyort ile orman arasında yer alan, modern mimarisi ve yüksek yaşam kalitesiyle öne çıkan İskandinav başkenti.'
  },
  { 
    id: 48, title: 'Stockholm', country: 'İsveç', city: 'Stokholm', duration: '4s', flag: '🇸🇪', category: 'Şehir', budget: '€1.200–2.000', season: 'Mayıs–Ağustos',
    wikiTitle: 'Stockholm',
    highlights: ['Gamla Stan (Eski Şehir)', 'Vasa Müzesi', 'ABBA Müzesi'],
    funFacts: ['14 ada üzerine kurulmuştur ve 50\'den fazla köprüsü vardır.', 'Şehir merkezinde bile denize girmek ve balık tutmak mümkündür.'],
    fallbackDesc: 'Su üzerinde yüzen bir şehir, şık tasarımı ve Orta Çağ ile modernizmin buluştuğu eşsiz dokusu.'
  },
  { 
    id: 49, title: 'Helsinki', country: 'Finlandiya', city: 'Helsinki', duration: '3.5s', flag: '🇫🇮', category: 'Şehir', budget: '€1.200–2.000', season: 'Haziran–Ağustos',
    wikiTitle: 'Helsinki',
    highlights: ['Suomenlinna Kalesi', 'Temppeliaukio (Kaya Kilisesi)', 'Pazar Meydanı'],
    funFacts: ['Dünyanın "En Mutlu Ülkesi"nin başkentidir.', 'Şehirde 3 milyondan fazla sauna bulunmaktadır.'],
    fallbackDesc: 'Kuzeyin Beyaz Şehri, sahil şeridi, Baltık Denizi havası ve sade tasarımıyla huzur dolu bir liman.'
  },
  { 
    id: 50, title: 'Zurich', country: 'İsviçre', city: 'Zürih', duration: '3s', flag: '🇨🇭', category: 'Doğa', budget: '€1.200–2.000', season: 'Haziran–Eylül',
    wikiTitle: 'Zürich',
    highlights: ['Zürih Gölü Tekne Turu', 'Bahnhofstrasse Alışveriş', 'Üetliberg Dağı Manzarası'],
    funFacts: ['Şehirde 1200\'den fazla içilebilir su çeşmesi vardır.', 'Çikolatası ve bankalarıyla dünya çapında ünlüdür.'],
    fallbackDesc: 'Alplerin eteğinde, göl kıyısında yer alan, lüksün ve doğal güzelliğin mükemmel birleşimi.'
  },
];

export const INITIAL_VISAS = [
  { id: 'v1', owner: 'gorkem', country: 'Almanya', type: 'Schengen', start: '2024-01-01', end: '2025-01-01' },
  { id: 'v2', owner: 'esra', country: 'Yunanistan', type: 'Schengen', start: '2023-05-10', end: '2023-11-10' },
  { id: 'v3', owner: 'gorkem', country: 'ABD', type: 'B1/B2', start: '2020-01-01', end: '2030-01-01' }
];
