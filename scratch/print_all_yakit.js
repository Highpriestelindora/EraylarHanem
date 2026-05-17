import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function printAll() {
  const { data, error } = await supabase.from('garaj_yakit').select('*');
  console.log('Error:', error);
  console.log('Records count:', data?.length);
  console.log('Records:', JSON.stringify(data, null, 2));
}
printAll();
