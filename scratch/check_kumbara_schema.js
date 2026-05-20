const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('kasa_kumbaralar').select('*').limit(1);
  if (error) {
    console.error('Error fetching from kasa_kumbaralar:', error);
  } else {
    console.log('Columns in kasa_kumbaralar:', Object.keys(data[0] || { 'No rows exist': true }));
    console.log('Data:', data);
  }
}

check();
