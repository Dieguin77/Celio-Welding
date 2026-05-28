const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function main() {
  const files = fs.readdirSync(process.cwd());
  const pdfFile = files.find((f) => f.toLowerCase().endsWith('.pdf'));

  if (!pdfFile) {
    throw new Error('Nenhum arquivo PDF encontrado na pasta.');
  }

  const outputDir = path.join(process.cwd(), 'assets', 'pages');
  fs.mkdirSync(outputDir, { recursive: true });
  const oldInvalid = path.join(outputDir, 'page-undefined.png');
  if (fs.existsSync(oldInvalid)) {
    fs.unlinkSync(oldInvalid);
  }

  const dataBuffer = fs.readFileSync(path.join(process.cwd(), pdfFile));
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getScreenshot({ scale: 1.35, imageDataUrl: false, imageBuffer: true });

  for (const page of result.pages) {
    const pageNumber = String(page.pageNumber).padStart(2, '0');
    const outPath = path.join(outputDir, `page-${pageNumber}.png`);
    fs.writeFileSync(outPath, page.data);
  }

  await parser.destroy();
  console.log(`Exportadas ${result.pages.length} páginas para ${outputDir}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
