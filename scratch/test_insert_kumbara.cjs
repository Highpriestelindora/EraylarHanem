const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Manually parse .env
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const dbPayload = {
    id: String(Date.now()),
    name: 'Test Kumbara',
    target: 5000,
    current: 100,
    deadline: '2026-12-31',
    icon: '🪙',
    owner: 'ortak',
    category: 'Genel',
    family_id: 'eraylar-family-shared-id'
  };
  
  console.log('Inserting payload:', dbPayload);
  const { data, error } = await supabase.from('kasa_kumbaralar').upsert(dbPayload).select();
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Success inserting! Inserted data:', data);
    // Cleanup
    await supabase.from('kasa_kumbaralar').delete().eq('id', dbPayload.id);
  }
}

test();
