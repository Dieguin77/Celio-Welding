const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function cropPng(inputPath, outputPath, x, y, width, height) {
  const src = PNG.sync.read(fs.readFileSync(inputPath));
  const out = new PNG({ width, height });

  for (let yy = 0; yy < height; yy += 1) {
    for (let xx = 0; xx < width; xx += 1) {
      const srcX = x + xx;
      const srcY = y + yy;
      if (srcX < 0 || srcY < 0 || srcX >= src.width || srcY >= src.height) {
        continue;
      }

      const srcIdx = (src.width * srcY + srcX) << 2;
      const outIdx = (out.width * yy + xx) << 2;
      out.data[outIdx] = src.data[srcIdx];
      out.data[outIdx + 1] = src.data[srcIdx + 1];
      out.data[outIdx + 2] = src.data[srcIdx + 2];
      out.data[outIdx + 3] = src.data[srcIdx + 3];
    }
  }

  fs.writeFileSync(outputPath, PNG.sync.write(out));
}

function copyFile(from, to) {
  fs.copyFileSync(from, to);
}

const base = path.join(process.cwd(), 'assets', 'pages');
const out = path.join(process.cwd(), 'assets', 'brand');
fs.mkdirSync(out, { recursive: true });

cropPng(
  path.join(base, 'page-29.png'),
  path.join(out, 'logo-oficial.png'),
  730,
  420,
  1140,
  590
);

copyFile(path.join(base, 'page-28.png'), path.join(out, 'foto-soldagem-01.png'));
copyFile(path.join(base, 'page-26.png'), path.join(out, 'foto-ambiente-01.png'));
copyFile(path.join(base, 'page-33.png'), path.join(out, 'foto-uniforme-01.png'));

console.log('Ativos preparados em assets/brand');
