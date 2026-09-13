const fs = require('fs');

const htmlPath = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/b4269120-3e2f-4f15-bd46-aab68bd43a89/.system_generated/steps/255/content.md';
const html = fs.readFileSync(htmlPath, 'utf-8');

const idx = html.indexOf('linear_conversation');
console.log('Index:', idx);
const snippet = html.slice(idx - 100, idx + 400);
console.log('Snippet around linear_conversation:');
console.log(snippet);

// Check if there is JSON inside a <script> tag
const scripts = [];
const regex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  if (match[1].includes('linear_conversation')) {
    console.log('Found script containing linear_conversation! Length:', match[1].length);
    fs.writeFileSync('scratch/conversation_script.js', match[1]);
  }
}
