/**
 * Yekta Tilmen Synthesis Engine
 * Aggregates multiple test results into a cohesive character profile.
 */

export const synthesizeCharacter = (personalityState) => {
  const { results = {} } = personalityState;
  const testsTaken = Object.keys(results);

  if (testsTaken.length === 0) {
    return "Henüz bir analiz dosyası oluşturulmamış. Seni tanımak için sabırsızlanıyorum.";
  }

  let synthesis = "";
  const big5 = results.big5?.traits || {};
  const leader = results.leader?.traits || {};
  const eq = results.eq?.traits || {};

  // Core personality foundation
  if (big5.extraversion > 4) synthesis += "Dışadönük ve enerjik bir yapın var. ";
  else if (big5.extraversion < 2) synthesis += "İçsel dünyası zengin ve sakinliği seven birisin. ";

  if (big5.conscientiousness > 4) synthesis += "Disiplin ve düzen senin kodlarında yazılı. ";

  // Leadership & EQ overlay
  if (leader.authority > 4 && eq.empathy > 4) {
    synthesis += "Empatik bir liderlik tarzına sahipsin; insanları kırmadan yönlendirmeyi biliyorsun. ";
  } else if (leader.authority > 4) {
    synthesis += "Otoriter ve sonuç odaklı bir yaklaşımın var. ";
  }

  if (eq.self_awareness > 4) {
    synthesis += "Kendini tanıma konusundaki derinliğin, kararlarındaki isabeti artırıyor. ";
  }

  // Final summary based on volume of data
  if (testsTaken.length >= 3) {
    synthesis += "\n\nAnalizler derinleştikçe görüyorum ki; sen çok boyutlu ve adaptasyon yeteneği yüksek bir karaktersin.";
  } else {
    synthesis += "\n\nDosyaların biriktikçe tahlilim daha da netleşecek.";
  }

  return synthesis;
};
