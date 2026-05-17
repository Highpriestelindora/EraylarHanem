import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function testInsert() {
  const familyId = 'eraylar-family-shared-id';
  const { data, error } = await supabase.from('garaj_yakit').upsert({
    id: String(Date.now()),
    vehicle_id: 'v1',
    tarih: new Date().toISOString().split('T')[0],
    km: 41452,
    litre: 50,
    tutar: 2000,
    istasyon: 'Shell',
    tip: 'benzin',
    dolu: true,
    family_id: familyId
  });
  console.log('Error:', error);
  console.log('Data:', data);
}
testInsert();
