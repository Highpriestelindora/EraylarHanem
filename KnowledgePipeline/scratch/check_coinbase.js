
async function checkCoinbase() {
  try {
    const res = await fetch('https://api.coinbase.com/v2/prices/XAU-TRY/spot');
    const data = await res.json();
    console.log('Coinbase Gold (Ounce):', data.data.amount);
    console.log('Gram Gold (TRY):', Number(data.data.amount) / 31.1035);
  } catch (e) {
    console.error(e);
  }
}
checkCoinbase();
