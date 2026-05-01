
async function checkGenelPara() {
  try {
    const res = await fetch('https://api.genelpara.com/embed/altin.json');
    const data = await res.json();
    console.log('GenelPara Altın:', data);
  } catch (e) {
    console.error('Error fetching from GenelPara:', e);
  }
}

async function checkGenelParaDoviz() {
  try {
    const res = await fetch('https://api.genelpara.com/embed/doviz.json');
    const data = await res.json();
    console.log('GenelPara Döviz:', data);
  } catch (e) {
    console.error('Error fetching from GenelPara Döviz:', e);
  }
}

checkGenelPara();
checkGenelParaDoviz();
