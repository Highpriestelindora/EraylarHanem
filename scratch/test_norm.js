const normalizeText = (text) => text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, 'i').replace(/İ/g, 'i').toLowerCase();

console.log('Bulgaristan:', normalizeText('Bulgaristan'));
console.log('İtalya:', normalizeText('İtalya'));
console.log('Kıbrıs:', normalizeText('Kıbrıs'));
console.log('Venedik:', normalizeText('Venedik'));
