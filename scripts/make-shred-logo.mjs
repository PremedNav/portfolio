import sharp from 'sharp';
import opentype from 'opentype.js';
import fs from 'fs';
import path from 'path';

// Paths
const svgLogoPath = 'C:/All/image (15).svg';
const fontPath = 'C:/All/Pally_Complete/Fonts/OTF/Pally-Bold.otf';
const outputDir = path.join(process.cwd(), 'public', 'logos');

// Read the original SVG logo and extract inner content
const svgLogo = fs.readFileSync(svgLogoPath, 'utf-8');
const svgInner = svgLogo
  .replace(/<\?xml[^?]*\?>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '');

// Load font and convert "Shred" to SVG paths
const font = opentype.loadSync(fontPath);
const textPath = font.getPath('Shred', 0, 0, 160);
const textPathData = textPath.toSVG();

// Get text bounding box for positioning
const textBBox = textPath.getBoundingBox();
const textWidth = textBBox.x2 - textBBox.x1;
const textHeight = textBBox.y2 - textBBox.y1;

// Original SVG logo viewBox: 4096 x 1008
// The actual icon content spans roughly x:1450-2590, y:0-1000
// Let's crop to just the icon part
const iconViewBox = { x: 1430, y: 0, w: 1180, h: 1008 };

// Layout: icon on left, text on right, vertically centered
const iconDisplayHeight = 220;
const iconScale = iconDisplayHeight / iconViewBox.h;
const iconDisplayWidth = iconViewBox.w * iconScale;

const gap = 24;
const totalWidth = iconDisplayWidth + gap + textWidth;
const canvasWidth = Math.ceil(totalWidth + 60);
const canvasHeight = Math.ceil(Math.max(iconDisplayHeight, textHeight) + 80);

// The icon's visual center is ~40% from top (where bars meet the shred fan)
// Align text center to that visual center instead of geometric center
const iconVisualCenterRatio = 0.40;
const iconY = (canvasHeight - iconDisplayHeight) / 2;
const iconVisualCenterY = iconY + iconDisplayHeight * iconVisualCenterRatio;
const textCenterY = iconVisualCenterY;
const textTranslateY = textCenterY - (textBBox.y1 + textHeight / 2);

// --- FULL LOGO (icon + text) ---
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <!-- Icon -->
  <g transform="translate(30, ${iconY}) scale(${iconScale})">
    <g transform="translate(${-iconViewBox.x}, ${-iconViewBox.y})">
      ${svgInner}
    </g>
  </g>
  <!-- "Shred" text as paths (Pally Bold), aligned to icon visual center -->
  <g transform="translate(${30 + iconDisplayWidth + gap}, ${textTranslateY})" fill="#1E54C0">
    ${textPathData}
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'shred.svg'), fullLogoSvg);
console.log('Full logo SVG saved');

try {
  await sharp(Buffer.from(fullLogoSvg))
    .resize(canvasWidth * 2, canvasHeight * 2) // 2x for sharpness
    .png()
    .toFile(path.join(outputDir, 'shred.png'));
  console.log('Full logo PNG saved (2x resolution)');
} catch (err) {
  console.error('Full logo PNG error:', err.message);
}

// --- ICON ONLY (square, centered) ---
const iconOnlySize = 512;
const iconOnlyScale = (iconOnlySize * 0.7) / iconViewBox.h;
const iconOnlyW = iconViewBox.w * iconOnlyScale;
const iconOnlyH = iconViewBox.h * iconOnlyScale;
const iconOnlyX = (iconOnlySize - iconOnlyW) / 2;
const iconOnlyY = (iconOnlySize - iconOnlyH) / 2;

const iconOnlySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconOnlySize}" height="${iconOnlySize}" viewBox="0 0 ${iconOnlySize} ${iconOnlySize}">
  <g transform="translate(${iconOnlyX}, ${iconOnlyY}) scale(${iconOnlyScale})">
    <g transform="translate(${-iconViewBox.x}, ${-iconViewBox.y})">
      ${svgInner}
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'shred-icon.svg'), iconOnlySvg);
console.log('Icon SVG saved');

try {
  await sharp(Buffer.from(iconOnlySvg))
    .resize(iconOnlySize * 2, iconOnlySize * 2)
    .png()
    .toFile(path.join(outputDir, 'shred-icon.png'));
  console.log('Icon PNG saved (2x resolution)');
} catch (err) {
  console.error('Icon PNG error:', err.message);
}

console.log('\nDone! Files in public/logos/:');
console.log('  shred.svg / shred.png — full logo (icon + Pally Bold text)');
console.log('  shred-icon.svg / shred-icon.png — icon only');
