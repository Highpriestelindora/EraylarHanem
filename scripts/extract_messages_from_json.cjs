const fs = require('fs');

const content = fs.readFileSync('scratch/conversation_script.js', 'utf-8');
const start = content.indexOf('enqueue(');
const end = content.lastIndexOf(');');
const jsonStr = content.slice(start + 8, end).trim();
const arr = JSON.parse(JSON.parse(jsonStr));

function unflatten(val, depth = 0, seen = new Map()) {
  if (depth > 25) return val;
  if (typeof val === 'number') {
    if (val < 0 || val >= arr.length) return val;
    if (seen.has(val)) return seen.get(val);
    const res = unflatten(arr[val], depth + 1, seen);
    seen.set(val, res);
    return res;
  }
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(item => unflatten(item, depth + 1, seen));
  }
  const obj = {};
  for (const [k, v] of Object.entries(val)) {
    const realKey = k.startsWith('_') ? arr[parseInt(k.slice(1), 10)] : k;
    obj[realKey] = unflatten(v, depth + 1, seen);
  }
  return obj;
}

// Find the shared_conversation object
// In step2, let's search for linear_conversation
const linIdx = arr.indexOf('linear_conversation');
console.log('linear_conversation index:', linIdx);
const linearNodesIndices = arr[linIdx + 1];
console.log('Total linear nodes:', linearNodesIndices.length);

const messages = [];
for (let i = 0; i < linearNodesIndices.length; i++) {
  const nodeIdx = linearNodesIndices[i];
  const node = unflatten(nodeIdx);
  if (node && node.message) {
    const msg = node.message;
    const role = msg.author ? msg.author.role : 'unknown';
    let text = '';
    if (msg.content && msg.content.parts) {
      text = msg.content.parts.filter(p => typeof p === 'string').join('\n');
    }
    const createTime = msg.create_time ? new Date(msg.create_time * 1000).toISOString() : null;
    messages.push({
      nodeId: node.id,
      role,
      createTime,
      text: text.trim()
    });
  }
}

console.log('Extracted messages count:', messages.length);
console.log('First 3 messages:');
messages.slice(0, 3).forEach((m, idx) => console.log(`[${idx}] ${m.role} (${m.createTime}): ${m.text.slice(0, 100)}...`));

console.log('\nLast 3 messages:');
messages.slice(-3).forEach((m, idx) => console.log(`[${idx}] ${m.role} (${m.createTime}): ${m.text.slice(0, 100)}...`));

fs.writeFileSync('scratch/extracted_chat_messages.json', JSON.stringify(messages, null, 2), 'utf-8');
