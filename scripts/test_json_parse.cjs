const fs = require('fs');

const content = fs.readFileSync('scratch/conversation_script.js', 'utf-8');

// The argument inside enqueue(...) is a JSON string
const start = content.indexOf('enqueue(');
const end = content.lastIndexOf(');');
const jsonStr = content.slice(start + 8, end).trim();

try {
  const parsed = JSON.parse(jsonStr);
  console.log('Successfully parsed JSON! Type:', typeof parsed, 'Length:', Array.isArray(parsed) ? parsed.length : 'not array');
  fs.writeFileSync('scratch/parsed_stream_array.json', JSON.stringify(parsed, null, 2), 'utf-8');
} catch (e) {
  console.log('JSON parse error:', e.message);
  // It might be double-escaped string
  try {
    const rawParsed = JSON.parse('\"' + jsonStr + '\"');
    console.log('Double parse attempt...');
  } catch (e2) {
    console.log('e2:', e2.message);
  }
}
