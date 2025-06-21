/**
 * NeonFrame Asset Converter
 * Converts WAV to OGG, JPG to PNG, etc.
 */
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

export function wavToOgg(src, dest) {
  child_process.execSync(`ffmpeg -y -i "${src}" -acodec libvorbis "${dest}"`);
  console.log(`Converted ${src} to ${dest}`);
}

export function jpgToPng(src, dest) {
  child_process.execSync(`ffmpeg -y -i "${src}" "${dest}"`);
  console.log(`Converted ${src} to ${dest}`);
}

export function convertAssets(srcDir) {
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    if (f.endsWith('.wav')) {
      wavToOgg(path.join(srcDir, f), path.join(srcDir, f.replace('.wav', '.ogg')));
    }
    if (f.endsWith('.jpg') || f.endsWith('.jpeg')) {
      jpgToPng(path.join(srcDir, f), path.join(srcDir, f.replace(/\.(jpg|jpeg)$/, '.png')));
    }
  }
}