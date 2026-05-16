import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function testInsert() {
  const familyId = 'eraylar-family-shared-id';
  const svc = {
    id: 'test-' + Date.now(),
    vehicle_id: 'v1',
    tarih: '2026-05-15',
    km: 10000,
    islem: 'Test Islem',
    tutar: 500,
    yer: 'Test Yer',
    notlar: 'Test Notlar',
    family_id: familyId
  };

  const { data, error } = await supabase.from('garaj_servis').upsert(svc);
  if (error) {
    console.log('Insert Error:', error);
  } else {
    console.log('Insert Success!');
  }
}

testInsert();
