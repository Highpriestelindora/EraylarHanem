import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function checkSchema() {
  const tables = ['garaj_yakit', 'garaj_servis', 'garaj_belgeler', 'garaj_parts'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table ${table} error:`, error.message);
      } else {
        // If data is empty, we can't see columns easily with select.
        // We can use a trick or just report it's empty.
        if (data.length > 0) {
          console.log(`Table ${table} columns:`, Object.keys(data[0]));
        } else {
          console.log(`Table ${table} exists but is empty.`);
        }
      }
    } catch (err) {
      console.log(`Table ${table} exception:`, err.message);
    }
  }
}

checkSchema();
