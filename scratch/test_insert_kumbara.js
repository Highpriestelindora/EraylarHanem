const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
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
    priority: 'Orta',
    notes: 'Test notes',
    family_id: 'eraylar-family-shared-id'
  };
  
  console.log('Inserting payload:', dbPayload);
  const { data, error } = await supabase.from('kasa_kumbaralar').upsert(dbPayload).select();
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Success inserting! Inserted data:', data);
  }
}

test();
