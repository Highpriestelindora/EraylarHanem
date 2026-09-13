const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');
const os = require('os');

const INPUT_DIR = 'C:/Users/Administrator/Desktop/New folder';
const OUTPUT_JSON = path.join(__dirname, '../scratch/ocr_raw_results.json');

function parseWhatsAppName(name) {
  const match = name.match(/at (\d{2})\.(\d{2})\.(\d{2})(?: \((\d+)\))?\.jpeg$/i);
  if (!match) return { time: '99.99.99', timeFormatted: 'Bilinmiyor', num: 999999 };
  const time = match[1] + match[2] + match[3];
  const timeFormatted = `${match[1]}:${match[2]}:${match[3]}`;
  const num = match[4] ? parseInt(match[4], 10) : 0;
  return { time, timeFormatted, num };
}

async function run() {
  console.log('--- 199 Görsel İçin Paralel OCR Başlatılıyor ---');
  console.time('total_ocr');

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));
  const sortedFiles = [...files].sort((a, b) => {
    const pa = parseWhatsAppName(a);
    const pb = parseWhatsAppName(b);
    if (pa.time !== pb.time) return pa.time.localeCompare(pb.time);
    return pa.num - pb.num;
  });

  console.log(`Toplam dosya: ${sortedFiles.length}`);

  // 6 worker havuzu kuralım
  const NUM_WORKERS = 6;
  const workers = [];
  console.log(`${NUM_WORKERS} adet Tesseract worker başlatılıyor...`);
  for (let i = 0; i < NUM_WORKERS; i++) {
    const w = await createWorker('tur');
    workers.push(w);
  }
  console.log('Workerlar hazır!');

  const results = new Array(sortedFiles.length);
  let currentIndex = 0;
  let completed = 0;

  async function work(workerId) {
    const worker = workers[workerId];
    while (currentIndex < sortedFiles.length) {
      const idx = currentIndex++;
      const fileName = sortedFiles[idx];
      const filePath = path.join(INPUT_DIR, fileName);
      try {
        const ret = await worker.recognize(filePath);
        results[idx] = {
          index: idx + 1,
          fileName,
          text: ret.data.text
        };
      } catch (err) {
        console.error(`Hata [${idx + 1}] ${fileName}:`, err.message);
        results[idx] = {
          index: idx + 1,
          fileName,
          text: '',
          error: err.message
        };
      }
      completed++;
      if (completed % 15 === 0 || completed === sortedFiles.length) {
        console.log(`İlerleme: ${completed} / ${sortedFiles.length} (%${Math.round(completed / sortedFiles.length * 100)})`);
      }
    }
  }

  await Promise.all(workers.map((_, i) => work(i)));

  for (const w of workers) {
    await w.terminate();
  }

  // scratch klasörünün varlığını doğrula
  const scratchDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ OCR sonuçları kaydedildi: ${OUTPUT_JSON}`);
  console.timeEnd('total_ocr');
}

run().catch(err => {
  console.error('Kritik Hata:', err);
  process.exit(1);
});
