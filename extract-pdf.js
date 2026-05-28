const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function main() {
  const files = fs.readdirSync(process.cwd());
  const pdfFile = files.find((f) => f.toLowerCase().endsWith('.pdf'));

  if (!pdfFile) {
    throw new Error('Nenhum arquivo PDF encontrado na pasta.');
  }

  const dataBuffer = fs.readFileSync(path.join(process.cwd(), pdfFile));
  const parser = new PDFParse({ data: dataBuffer });
  const data = await parser.getText();
  await parser.destroy();

  fs.writeFileSync('conteudo-extraido.txt', data.text || '', 'utf8');
  console.log(`PDF: ${pdfFile}`);
  console.log(`Paginas: ${data.total}`);
  console.log('Texto salvo em conteudo-extraido.txt');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
