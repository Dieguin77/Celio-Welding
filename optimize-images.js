// Converte as fotos *-unsplash.jpg para WebP otimizado (máx. 1920px, q72).
// Uso: node optimize-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'assets', 'brand');
const files = fs.readdirSync(dir).filter((f) => /-unsplash\.jpg$/i.test(f));

(async () => {
  let before = 0;
  let after = 0;
  for (const file of files) {
    const src = path.join(dir, file);
    const out = path.join(dir, file.replace(/\.jpg$/i, '.webp'));
    const inBytes = fs.statSync(src).size;
    await sharp(src)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(out);
    const outBytes = fs.statSync(out).size;
    before += inBytes;
    after += outBytes;
    const kb = (n) => (n / 1024).toFixed(0) + 'KB';
    console.log(`${file.padEnd(46)} ${kb(inBytes).padStart(8)} -> ${kb(outBytes).padStart(8)}`);
  }
  const mb = (n) => (n / 1024 / 1024).toFixed(1) + 'MB';
  console.log('-----------------------------------------------------------------');
  console.log(`TOTAL ${mb(before)} -> ${mb(after)}  (economia ${(100 - (after / before) * 100).toFixed(0)}%)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
