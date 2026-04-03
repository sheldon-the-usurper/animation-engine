const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Robust Video Renderer
 * @param {string} taskId Unique ID for this render
 * @param {object} options Metadata (fps, duration, etc)
 */
async function renderVideo(taskId, options = {}) {
    const {
        fps = 60,
        duration = 82.968,
        width = 720,
        height = 1280,
        baseUrl = 'http://localhost:3000',
        startFrame = 0,
        endFrame = null
    } = options;

    const framesDir = path.join(__dirname, '../frames', taskId);
    await fs.ensureDir(framesDir);

    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width, height });
        await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle0' });

        const totalFrames = Math.ceil(fps * duration);
        const actualEndFrame = endFrame || totalFrames;
        
        console.log(`[${taskId}] Rendering range: ${startFrame} to ${actualEndFrame}`);

        for (let i = startFrame; i < actualEndFrame; i++) {
            await page.evaluate((frameIndex) => {
                if (window.renderFrame) window.renderFrame(frameIndex);
            }, i);

            const framePath = path.join(framesDir, `frame_${i.toString().padStart(5, '0')}.png`);
            await page.screenshot({ path: framePath, omitBackground: false });
        }

        await browser.close();
        return true;
    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}

module.exports = { renderVideo };