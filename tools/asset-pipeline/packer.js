/**
 * NeonFrame Asset Packer
 * Combines multiple images/sounds into efficient bundles.
 * Only PNG and OGG files supported.
 */
import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

export async function packImages(srcDir, outFile) {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));
  const images = await Promise.all(files.map(f => loadImage(path.join(srcDir, f))));
  // Calculate total width/height for a spritesheet
  const pad = 2;
  let width = 0, height = 0;
  for (const img of images) {
    width += img.width + pad;
    height = Math.max(height, img.height);
  }
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  let x = 0, atlas = {};
  for (let i=0; i<images.length; ++i) {
    ctx.drawImage(images[i], x, 0);
    atlas[files[i]] = { x, y: 0, w: images[i].width, h: images[i].height };
    x += images[i].width + pad;
  }
  fs.writeFileSync(outFile.replace('.png', '.json'), JSON.stringify(atlas, null, 2));
  fs.writeFileSync(outFile, canvas.toBuffer('image/png'));
  console.log(`Packed ${files.length} images to ${outFile}`);
}

export function packAudio(srcDir, outFile) {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ogg'));
  const buffers = files.map(f => fs.readFileSync(path.join(srcDir, f)));
  const totalLen = buffers.reduce((acc, b) => acc + b.length, 0);
  const merged = Buffer.concat(buffers, totalLen);
  fs.writeFileSync(outFile, merged);
  console.log(`Packed ${files.length} audio files to ${outFile}`);
}