import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function inspectTables() {
  const tables = ['garaj_araclar', 'garaj_yakit', 'garaj_servis', 'garaj_belgeler', 'garaj_parts', 'garaj_park'];
  for (const table of tables) {
    try {
      // Trying to select 1 row to see keys
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table ${table} error:`, error.message);
      } else {
        // If data is empty, try to insert a dummy row then delete it to see columns?
        // No, let's just try to query with family_id.
        const { error: fError } = await supabase.from(table).select('family_id').limit(1);
        if (fError) {
          console.log(`Table ${table} has NO family_id column.`);
        } else {
          console.log(`Table ${table} has family_id column.`);
        }
      }
    } catch (err) {
      console.log(`Table ${table} exception:`, err.message);
    }
  }
}

inspectTables();
