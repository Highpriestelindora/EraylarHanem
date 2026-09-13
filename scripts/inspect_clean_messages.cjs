const fs = require('fs');

const msgs = JSON.parse(fs.readFileSync('scratch/extracted_chat_messages.json', 'utf-8'));

const realMsgs = msgs.filter(m => {
  if (!m.text || m.text.length === 0) return false;
  if (m.role === 'system') return false;
  if (m.text.includes('Original custom instructions')) return false;
  return true;
});

console.log('Real messages count:', realMsgs.length);

console.log('--- Sample Dialogue (First 8 exchanges) ---');
realMsgs.slice(0, 16).forEach((m, idx) => {
  const speaker = m.role === 'user' ? 'Kullanıcı' : 'ChatGPT (Uzman Psikolog Asistanı)';
  console.log(`\n[#${idx + 1}] [${speaker}] [${m.createTime || 'Bilinmiyor'}]:`);
  console.log(m.text.slice(0, 250) + (m.text.length > 250 ? '...' : ''));
});
