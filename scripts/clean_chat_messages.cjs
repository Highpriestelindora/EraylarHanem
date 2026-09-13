const fs = require('fs');

const msgs = JSON.parse(fs.readFileSync('scratch/extracted_chat_messages.json', 'utf-8'));

// Filter out noise
const cleanMsgs = [];
for (const m of msgs) {
  if (!m.text || m.text.trim().length === 0) continue;
  if (m.role === 'system') continue;
  if (m.text.includes('Original custom instructions')) continue;
  if (m.text.includes('The output of this plugin was redacted')) continue;
  
  // Clean citations and special tokens
  let text = m.text
    .replace(/image_group[\s\S]*?/g, '')
    .replace(/cite[\s\S]*?/g, '')
    .replace(/url[\s\S]*?/g, '')
    .trim();

  if (text.length === 0) continue;

  cleanMsgs.push({
    role: m.role,
    createTime: m.createTime,
    text
  });
}

console.log('Cleaned messages count:', cleanMsgs.length);
fs.writeFileSync('scratch/cleaned_chat_messages.json', JSON.stringify(cleanMsgs, null, 2), 'utf-8');

let totalWords = 0;
cleanMsgs.forEach(m => {
  totalWords += m.text.split(/\s+/).length;
});
console.log('Total words:', totalWords);
