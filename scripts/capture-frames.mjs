import { chromium } from 'playwright';
import { bundle } from '@remotion/bundler';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const timing = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/timing.json'), 'utf8'));
const entry = path.resolve(__dirname, '../src/index.tsx');
const framesDir = path.resolve(__dirname, '../frames');
const PORT = 3000;

async function main() {
  console.log('Step 1: Bundling project...');
  const bundleLocation = await bundle(entry);

  const server = http.createServer((req, res) => {
    let relativePath = req.url === '/' ? 'index.html' : req.url;
    relativePath = relativePath.split('?')[0];
    const filePath = path.join(bundleLocation, relativePath);
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentTypes = {
        '.js': 'application/javascript',
        '.html': 'text/html',
        '.css': 'text/css',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.json': 'application/json'
      };
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(PORT);
  console.log(`Step 2: Server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'] 
  });
  const page = await browser.newPage({ 
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);
  const totalFrames = timing.reduce((s, x) => s + x.frames, 0);

  console.log(`Step 3: Capturing ${totalFrames} frames...`);
  
  // Navigate once to ensure base bundle and fonts are cached
  await page.goto(`http://localhost:${PORT}/index.html?composition=Main&frame=0`, {
    waitUntil: 'networkidle'
  });
  await page.evaluate(() => document.fonts.ready);
  // Wait for the actual content to appear
  await page.waitForSelector('svg', { timeout: 15000 });

  for (let i = 0; i < totalFrames; i++) {
    // Navigate via URL
    await page.goto(`http://localhost:${PORT}/index.html?composition=Main&frame=${i}`);
    
    // Fast check for frame change: wait for any visual update
    // Remotion renders frame N immediately when the URL param changes
    await page.waitForSelector('svg', { timeout: 5000 });

    const frameName = `frame_${i.toString().padStart(4, '0')}.png`;
    await page.screenshot({ path: path.join(framesDir, frameName), type: 'png' });
    
    if (i % 50 === 0) process.stdout.write(`\rProgress: ${Math.round((i/totalFrames)*100)}% (${i}/${totalFrames})`);
  }

  console.log('\nStep 4: Cleanup...');
  await browser.close();
  server.close();
  console.log('Done! Frames saved to: frames/');
}

main().catch(err => {
  console.error('\nCapture failed:', err);
  process.exit(1);
});
