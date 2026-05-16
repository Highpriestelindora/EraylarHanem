import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fwjykrcxalrkyuoeidia.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3anlrcmN4YWxya3l1b2VpZGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTgxMTgsImV4cCI6MjA5MjMzNDExOH0.V93qVHtsKhNlnL-34MY0gjVpUhtDEQluzPOgX2W-_SU"
);

async function checkRecords() {
  const familyId = 'eraylar-family-shared-id';
  const { data: svc } = await supabase.from('garaj_servis').select('*').eq('family_id', familyId);
  const { data: yakit } = await supabase.from('garaj_yakit').select('*').eq('family_id', familyId);
  const { data: docs } = await supabase.from('garaj_belgeler').select('*').eq('family_id', familyId);

  console.log('Services:', svc?.length, svc?.[svc.length-1]);
  console.log('Fuel:', yakit?.length, yakit?.[yakit.length-1]);
  console.log('Docs:', docs?.length, docs?.[docs.length-1]);
}
checkRecords();
