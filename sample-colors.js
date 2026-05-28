const fs = require('fs');
const { PNG } = require('pngjs');

function toHex(v) {
  return v.toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function sample(path, points) {
  const buf = fs.readFileSync(path);
  const png = PNG.sync.read(buf);
  console.log(`\nArquivo: ${path}`);
  console.log(`Dimensoes: ${png.width}x${png.height}`);

  for (const p of points) {
    const x = Math.max(0, Math.min(png.width - 1, p[0]));
    const y = Math.max(0, Math.min(png.height - 1, p[1]));
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    console.log(`(${x},${y}): ${rgbToHex(r, g, b)} [${r},${g},${b}]`);
  }
}

sample('assets/pages/page-32.png', [
  [60, 60],
  [180, 180],
  [1100, 800],
  [1800, 200],
]);

sample('assets/pages/page-42.png', [
  [1000, 600],
  [880, 680],
  [1020, 450],
  [1300, 900],
]);
