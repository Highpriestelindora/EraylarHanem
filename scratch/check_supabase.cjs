
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fwjykrcxalrkyuoeidia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from('eraylar_store')
    .select('data')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  console.log('Size:', JSON.stringify(data.data).length);
  console.log('Muhendislik Keys:', data.data.muhendislik ? Object.keys(data.data.muhendislik) : 'MISSING');
  if (data.data.muhendislik) {
    console.log('ProblemBank Count:', data.data.muhendislik.problemBank?.length);
    console.log('DecisionLog Count:', data.data.muhendislik.decisionLog?.length);
  }
}

checkData();
