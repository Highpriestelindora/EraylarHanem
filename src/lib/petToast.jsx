import toast from 'react-hot-toast';
import React from 'react';

// Genişletilmiş Waffle Dağarcığı (Pozitif, Sakin, Yardımsever)
const waffleVocab = [
  "Hav hav! {msg} Minik patilerimle hallettim! 🐾🦴",
  "Oley! {msg} Burnumla onayladım, her şey yolunda! 🐶✨",
  "Hav! {msg} Kuyruğumu sallayarak kaydettim! 🐕",
  "{msg} Aferin bana, çok uslu bir köpeğim değil mi? 🐾❤️",
  "Merak etme! {msg} Kulübeme sakladım, güvende! 🏡🦴",
  "Hav hav! {msg} Koklayarak teyit ettim, sıfır hata! 🐶✅",
  "Görev tamam! {msg} Karşılığında ödül maması alabilir miyim? 🥺🐾",
  "{msg} İşlem tamam, şimdi parka gidebilir miyiz? 🌳🐕",
  "Hav! {msg} Patilerimle sıkıca tutuyorum, asla kaybolmaz! 🐶💪",
  "{msg} En sevdiğim oyuncağım gibi koruyacağım bunu! 🎾🐾"
];

// Genişletilmiş Mayıs Dağarcığı (Negatif, Kaos, Yıkıcı)
const mayisVocab = [
  "Miyav! {msg} Tırmalayıp paramparça ettim! O dosya artık çöpte! 😼🔪",
  "Hıh! {msg} Masadan aşağı yuvarlayıp kırdım! Yaşasın kaos! 🐈‍⬛💥",
  "Tısss! {msg} Tırnaklarımla yırtıp attım! Hiç beğenmemiştim zaten! 😾",
  "Kötü haber insan: {msg} Gidip perdelere tırmanacağım şimdi! 🙀💦",
  "{msg} Eziyet bitti, parçalayıp yok ettim! Bana yaş mama ver! 🐟😼",
  "Miyav! {msg} Gözümü bile kırpmadan sildim! Hiç acımam! 😈🐈‍⬛",
  "{msg} Zaten tadı kötüydü, tırmalayarak çöpe yolladım! 🗑️😼",
  "Uyarı! {msg} Suçu bana atma, patilerim temiz! 🐾😇 (Tabii ki ben yaptım)",
  "Hıh! {msg} Üstüne oturdum ve yok ettim! Burası benim çöplüğüm! 🐈‍⬛👑",
  "Tısss! {msg} Tüylerimi kabarttın, hepsini tırmalayacağım! 🙀💥"
];

const getRandomPhrase = (vocab, originalMsg) => {
  const template = vocab[Math.floor(Math.random() * vocab.length)];
  return template.replace('{msg}', `"${originalMsg}"`);
};

const PetToastContent = ({ t, character, message }) => {
  const isWaffle = character === 'waffle';
  
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto flex`}
      style={{
        maxWidth: '350px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        border: isWaffle ? '2px solid #93c5fd' : '2px solid #fda4af',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ display: 'flex', padding: '16px', width: '100%', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: isWaffle ? '#eff6ff' : '#fff1f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            border: isWaffle ? '1px solid #bfdbfe' : '1px solid #fecdd3'
          }}>
            {isWaffle ? '🐶' : '🐈‍⬛'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: '800', 
            color: isWaffle ? '#1d4ed8' : '#be123c', 
            marginBottom: '4px',
            letterSpacing: '-0.3px'
          }}>
            {isWaffle ? 'Waffle Diyor ki:' : 'Mayıs Diyor ki:'}
          </p>
          <p style={{ 
            fontSize: '12px', 
            color: '#475569', 
            fontWeight: '600',
            lineHeight: '1.4' 
          }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

const isDestructive = (msg) => {
  if (typeof msg !== 'string') return false;
  const lower = msg.toLowerCase();
  return lower.includes('silindi') || 
         lower.includes('reddedildi') || 
         lower.includes('hata') || 
         lower.includes('kaldırıldı') || 
         lower.includes('sıfırlandı') ||
         lower.includes('paramparça') ||
         lower.includes('başarısız') ||
         lower.includes('iptal');
};

let interceptorInitialized = false;

export const initPetToastInterceptor = () => {
  if (interceptorInitialized) return;
  
  const originalSuccess = toast.success;
  const originalError = toast.error;

  toast.success = (msg, options) => {
    if (isDestructive(msg)) {
      const finalMsg = getRandomPhrase(mayisVocab, msg);
      return toast.custom((t) => <PetToastContent t={t} character="mayis" message={finalMsg} />, { duration: 4500, ...options });
    } else {
      const finalMsg = getRandomPhrase(waffleVocab, msg);
      return toast.custom((t) => <PetToastContent t={t} character="waffle" message={finalMsg} />, { duration: 4000, ...options });
    }
  };

  toast.error = (msg, options) => {
    const finalMsg = getRandomPhrase(mayisVocab, msg);
    return toast.custom((t) => <PetToastContent t={t} character="mayis" message={finalMsg} />, { duration: 5000, ...options });
  };
  
  interceptorInitialized = true;
  console.log("🐾 Pet Toast Interceptor Initialized! Waffle and Mayis are on duty!");
};
