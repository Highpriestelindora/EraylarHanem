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

async function check() {
  const { data, error } = await supabase.from('kasa_kumbaralar').select('*').limit(1);
  if (error) {
    console.error('Error fetching from kasa_kumbaralar:', error);
  } else {
    if (data.length > 0) {
      console.log('Columns in kasa_kumbaralar:', Object.keys(data[0]));
      console.log('Data:', data);
    } else {
      console.log('No rows returned, trying to insert one to see the columns, or let us query postgrest schema');
      // Let's do a dummy upsert to see if it succeeds or what errors it gives
      const dummy = {
        id: 'check-schema-temp-id',
        name: 'Schema Temp Check',
        target: 100,
        current: 0,
        icon: '🎯',
        deadline: '2026-12-31',
        owner: 'ortak',
        category: 'Genel',
        family_id: 'eraylar-family-shared-id'
      };
      console.log('Attempting upsert with family_id...');
      const res = await supabase.from('kasa_kumbaralar').upsert(dummy);
      if (res.error) {
        console.log('Upsert with family_id failed:', res.error.message);
        console.log('Attempting upsert without family_id...');
        const { family_id, ...noFamilyId } = dummy;
        const res2 = await supabase.from('kasa_kumbaralar').upsert(noFamilyId);
        if (res2.error) {
          console.error('Upsert without family_id also failed:', res2.error.message);
        } else {
          console.log('Upsert WITHOUT family_id succeeded! Table does not have family_id column.');
          await supabase.from('kasa_kumbaralar').delete().eq('id', 'check-schema-temp-id');
        }
      } else {
        console.log('Upsert WITH family_id succeeded! Table has family_id column.');
        await supabase.from('kasa_kumbaralar').delete().eq('id', 'check-schema-temp-id');
      }
    }
  }
}

check();
