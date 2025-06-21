import https from 'https';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipe = promisify(pipeline);

async function download(url, dest) {
  const file = fs.createWriteStream(dest);
  await pipe(
    https.get(url, res => res),
    file
  );
}

async function main() {
  console.log('Downloading sample platformer ground tile...');
  await download('https://kenney.nl/assets/platformer-kit', 'examples/platformer/assets/ground.png');
  // Add more as needed
}

main().catch(err => {
  console.error('Failed to fetch assets:', err);
});