
async function checkRates() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    console.log('USD Rates:', Object.keys(data.rates).filter(k => k === 'TRY' || k === 'XAU' || k === 'EUR' || k === 'GBP'));
    console.log('XAU rate (USD per 1 XAU):', 1 / data.rates.XAU);
    console.log('TRY rate (TRY per 1 USD):', data.rates.TRY);
    console.log('Gold Price in TRY (per ounce):', (1 / data.rates.XAU) * data.rates.TRY);
  } catch (e) {
    console.error(e);
  }
}
checkRates();
