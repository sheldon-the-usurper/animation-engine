import { renderMedia, selectComposition } from '@remotion/renderer';
import { bundle } from '@remotion/bundler';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entry = path.resolve(__dirname, '../src/index.tsx');
const output = path.resolve(__dirname, '../out/video.mp4');

async function main() {
  console.log('Step 1: Bundling project...');
  const bundleLocation = await bundle(entry);

  const chromiumOptions = {
    headless: true,
    args: [
      '--headless=old',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--single-process',
      '--no-zygote',
      '--disable-gpu',
      '--disable-gpu-sandbox',
      '--disable-dev-shm-usage',
      '--remote-allow-origins=*',
    ],
  };

  console.log('Step 2: Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'Main',
    chromiumOptions,
  });

  console.log(`Step 3: Rendering ${composition.durationInFrames} frames...`);
  
  if (!fs.existsSync(path.dirname(output))) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
  }

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: output,
    chromiumOptions,
    onProgress: ({ progress }) => {
      const percent = Math.round(progress * 100);
      process.stdout.write(`\rProgress: ${percent}%`);
    },
  });

  console.log('\nRender Complete! Output saved to: out/video.mp4');
}

main().catch((err) => {
  console.error('\nRender failed:', err);
  process.exit(1);
});
