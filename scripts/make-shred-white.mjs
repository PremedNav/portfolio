import opentype from 'opentype.js';
import fs from 'fs';
import path from 'path';

const svgLogoPath = 'C:/All/image (15).svg';
const fontPath = 'C:/All/Pally_Complete/Fonts/OTF/Pally-Bold.otf';
const outputDir = path.join(process.cwd(), 'public', 'img');

const svgLogo = fs.readFileSync(svgLogoPath, 'utf-8');
// Replace blue fills with white
const svgInner = svgLogo
  .replace(/<\?xml[^?]*\?>/, '')
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .replace(/fill="#1E54C0"/g, 'fill="white"')
  .replace(/fill="#1D4AB2"/g, 'fill="white"');

const font = opentype.loadSync(fontPath);
const textPath = font.getPath('Shred', 0, 0, 160);
const textPathData = textPath.toSVG();
const textBBox = textPath.getBoundingBox();
const textWidth = textBBox.x2 - textBBox.x1;
const textHeight = textBBox.y2 - textBBox.y1;

const iconViewBox = { x: 1430, y: 0, w: 1180, h: 1008 };
const iconDisplayHeight = 220;
const iconScale = iconDisplayHeight / iconViewBox.h;
const iconDisplayWidth = iconViewBox.w * iconScale;
const gap = 24;
const totalWidth = iconDisplayWidth + gap + textWidth;
const canvasWidth = Math.ceil(totalWidth + 60);
const canvasHeight = Math.ceil(Math.max(iconDisplayHeight, textHeight) + 80);
const iconY = (canvasHeight - iconDisplayHeight) / 2;
const iconVisualCenterRatio = 0.40;
const iconVisualCenterY = iconY + iconDisplayHeight * iconVisualCenterRatio;
const textTranslateY = iconVisualCenterY - (textBBox.y1 + textHeight / 2);

const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <g transform="translate(30, ${iconY}) scale(${iconScale})">
    <g transform="translate(${-iconViewBox.x}, ${-iconViewBox.y})">
      ${svgInner}
    </g>
  </g>
  <g transform="translate(${30 + iconDisplayWidth + gap}, ${textTranslateY})" fill="white">
    ${textPathData}
  </g>
</svg>`;

fs.writeFileSync(path.join(outputDir, 'shred-logo-white.svg'), whiteSvg);
console.log('White logo saved to public/img/shred-logo-white.svg');
