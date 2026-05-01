
async function checkErApi() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/TRY');
    const data = await res.json();
    console.log('ER-API Rates:', Object.keys(data.rates).filter(k => k === 'USD' || k === 'EUR' || k === 'XAU'));
    console.log('XAU rate:', data.rates.XAU);
  } catch (e) {
    console.error(e);
  }
}
checkErApi();
