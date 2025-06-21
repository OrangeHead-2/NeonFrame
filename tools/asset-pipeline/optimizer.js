/**
 * NeonFrame Asset Optimizer
 * Lossless PNG compression, OGG audio normalization.
 */
import fs from 'fs';
import path from 'path';
import { optimizePng } from './png-opt.js';
import { normalizeOgg } from './ogg-norm.js';

export function optimizeAssets(srcDir) {
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    if (f.endsWith('.png')) {
      const filePath = path.join(srcDir, f);
      optimizePng(filePath);
    }
    if (f.endsWith('.ogg')) {
      const filePath = path.join(srcDir, f);
      normalizeOgg(filePath);
    }
  }
}