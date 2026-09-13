const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const mdPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/docs/Mahmut_Hakli_mi_Tam_Metin_Kronolojik.md';
const outputPdfPath = 'c:/Users/Administrator/Desktop/EraylarHanem-main/public/sohbet_arsiv/Mahmut_Hakli_mi_Tam_Metin_Kitap.pdf';
const desktopPdfPath = 'C:/Users/Administrator/Desktop/Mahmut_Hakli_mi_Tam_Metin_Kitap.pdf';

const arialRegular = 'C:/Windows/Fonts/arial.ttf';
const arialBold = 'C:/Windows/Fonts/arialbd.ttf';
const arialItalic = 'C:/Windows/Fonts/ariali.ttf';

async function generatePdfBook() {
  console.log('--- Mahmut Haklı mı? Tam Metin PDF Kitap Üretimi Başlıyor ---');

  const text = fs.readFileSync(mdPath, 'utf-8');
  const lines = text.split('\n');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true,
    info: {
      Title: 'Mahmut Haklı mı? — Tam Metin Kronolojik Döküm',
      Author: 'Eraylar Hanem AI Analiz Motoru',
      Subject: '11-13 Eylül 2026 Olay Örgüsü ve Psikolojik Sohbet Çözümlemesi',
      Keywords: 'Mahmut, Eraylar Hanem, Psikoloji, Sohbet Arşivi'
    }
  });

  const writeStream = fs.createWriteStream(outputPdfPath);
  doc.pipe(writeStream);

  // Kapak ve Başlık
  doc.font(arialBold).fontSize(24).fillColor('#1e1b4b').text('⚖️ MAHMUT HAKLI MI?', { align: 'center' });
  doc.moveDown(0.5);
  doc.font(arialRegular).fontSize(13).fillColor('#4f46e5').text('Kronolojik ve Tematik AI Süzgecinden Geçirilmiş Tam Metin', { align: 'center' });
  doc.moveDown(0.3);
  doc.font(arialItalic).fontSize(10).fillColor('#64748b').text('11 - 13 Eylül 2026 • 18.500+ Kelime • Eksiksiz Diyalog ve Olay Örgüsü', { align: 'center' });
  doc.moveDown(1.5);

  // Çizgi
  doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Başlık 1 (# )
    if (line.startsWith('# ')) {
      continue; // Zaten kapakta yazıldı
    }

    // Başlık 2 (## )
    if (line.startsWith('## ')) {
      doc.moveDown(1);
      const title = line.replace('## ', '');
      doc.font(arialBold).fontSize(15).fillColor('#312e81').text(title);
      doc.moveDown(0.3);
      doc.strokeColor('#818cf8').lineWidth(1.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      continue;
    }

    // Başlık 3 (### )
    if (line.startsWith('### ')) {
      doc.moveDown(0.8);
      const subTitle = line.replace('### ', '');
      doc.font(arialBold).fontSize(12).fillColor('#1e293b').text(subTitle);
      doc.moveDown(0.3);
      continue;
    }

    // Konuşmacı: Kullanıcı
    if (line.startsWith('**👤 Kullanıcı**')) {
      doc.moveDown(0.5);
      const header = line.replace(/\*\*/g, '');
      doc.font(arialBold).fontSize(10.5).fillColor('#0369a1').text(header);
      doc.moveDown(0.2);
      continue;
    }

    // Konuşmacı: Psikolog (ChatGPT)
    if (line.startsWith('**🧠 Psikolog (ChatGPT)**')) {
      doc.moveDown(0.5);
      const header = line.replace(/\*\*/g, '');
      doc.font(arialBold).fontSize(10.5).fillColor('#4338ca').text(header);
      doc.moveDown(0.2);
      continue;
    }

    // Alıntı / Quote (> )
    if (line.startsWith('> ')) {
      const quoteText = line.replace('> ', '');
      doc.font(arialItalic).fontSize(9.5).fillColor('#475569').text(quoteText, { indent: 15 });
      doc.moveDown(0.2);
      continue;
    }

    // Ayırıcı çizgi
    if (line.trim() === '---') {
      doc.moveDown(0.5);
      doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      continue;
    }

    // Liste elemanı (- veya *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
      const itemText = line.trim().replace(/^[-*•]\s+/, '');
      const cleanItem = itemText.replace(/\*\*(.*?)\*\*/g, '$1');
      doc.font(arialRegular).fontSize(9.5).fillColor('#334155').text('• ' + cleanItem, { indent: 10 });
      doc.moveDown(0.15);
      continue;
    }

    // Boş satır
    if (line.trim().length === 0) {
      doc.moveDown(0.3);
      continue;
    }

    // Normal metin
    const cleanText = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    doc.font(arialRegular).fontSize(9.5).fillColor('#1e293b').text(cleanText, {
      align: 'justify',
      lineGap: 2.5
    });
  }

  // Sayfa Numaraları Ekleme
  const range = doc.bufferedPageRange();
  for (let p = range.start; p < range.start + range.count; p++) {
    doc.switchToPage(p);
    
    // Üst Bilgi (Sayfa 1 hariç)
    if (p > 0) {
      doc.font(arialRegular).fontSize(8).fillColor('#94a3b8').text(
        'Mahmut Haklı mı? — Eksiksiz Kronolojik Sohbet ve Olay Örgüsü',
        50,
        25,
        { align: 'left' }
      );
      doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, 36).lineTo(545, 36).stroke();
    }

    // Alt Bilgi
    const pageNum = `Sayfa ${p + 1} / ${range.count}`;
    doc.font(arialRegular).fontSize(8).fillColor('#94a3b8').text(
      pageNum,
      50,
      800,
      { align: 'center' }
    );
  }

  doc.end();

  writeStream.on('finish', () => {
    console.log(`✅ PDF Kitap başarıyla üretildi: ${outputPdfPath}`);
    // Masaüstüne de kopyalayalım
    fs.copyFileSync(outputPdfPath, desktopPdfPath);
    console.log(`✅ Masaüstüne kopyalandı: ${desktopPdfPath}`);
  });
}

generatePdfBook().catch(err => {
  console.error('PDF Kitap hatası:', err);
});
