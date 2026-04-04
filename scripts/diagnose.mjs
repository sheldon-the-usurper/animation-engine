import { chromium } from 'playwright';
import { bundle } from '@remotion/bundler';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entry = path.resolve(__dirname, '../src/index.tsx');
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

  console.log('Step 3: Diagnostics...');
  
  // Navigate and capture any console errors
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  await page.goto(`http://localhost:${PORT}/index.html?composition=Main&frame=0`, {
    waitUntil: 'networkidle'
  });
  
  // Wait a bit and take a screenshot of the state
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'out/diagnostic.png' });
  
  const html = await page.content();
  fs.writeFileSync('out/diagnostic.html', html);
  
  console.log('Diagnostic screenshot and HTML saved to out/');
  
  await browser.close();
  server.close();
}

main().catch(err => {
  console.error('\nDiagnostic failed:', err);
  process.exit(1);
});
