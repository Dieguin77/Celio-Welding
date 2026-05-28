const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function main() {
  const pdfFile = 'inspiração-celio.pdf';
  const dataBuffer = fs.readFileSync(path.join(process.cwd(), pdfFile));
  const parser = new PDFParse({ data: dataBuffer });

  const textResult = await parser.getText();
  fs.writeFileSync('inspiracao-extraida.txt', textResult.text || '', 'utf8');

  const shotResult = await parser.getScreenshot({ scale: 1.1, imageDataUrl: false, imageBuffer: true });
  const outputDir = path.join(process.cwd(), 'assets', 'inspiration-pages');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const page of shotResult.pages) {
    const pageNumber = String(page.pageNumber).padStart(2, '0');
    fs.writeFileSync(path.join(outputDir, `page-${pageNumber}.png`), page.data);
  }

  await parser.destroy();
  console.log(`Texto salvo em inspiracao-extraida.txt`);
  console.log(`Paginas exportadas: ${shotResult.pages.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
