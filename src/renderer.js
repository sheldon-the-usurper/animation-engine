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
        baseUrl = 'http://localhost:3000'
    } = options;

    const framesDir = path.join(__dirname, '../frames', taskId);
    const exportPath = path.join(__dirname, '../exports', `${taskId}.mp4`);
    const silentVideo = path.join(framesDir, 'silent.mp4');
    const audioPath = path.join(__dirname, '../public/assets/voiceover_nexus.mp3');

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
        console.log(`[${taskId}] Starting render: ${totalFrames} frames`);

        for (let i = 0; i < totalFrames; i++) {
            await page.evaluate((frameIndex) => {
                if (window.renderFrame) window.renderFrame(frameIndex);
            }, i);

            const framePath = path.join(framesDir, `frame_${i.toString().padStart(5, '0')}.png`);
            await page.screenshot({ path: framePath, omitBackground: false });
        }

        await browser.close();

        // FFmpeg Processing
        console.log(`[${taskId}] Muxing video and audio...`);
        execSync(`ffmpeg -y -framerate ${fps} -i ${framesDir}/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -r ${fps} ${silentVideo}`);
        execSync(`ffmpeg -y -i ${silentVideo} -i ${audioPath} -c:v copy -c:a aac -shortest ${exportPath}`);

        // Cleanup frames
        await fs.remove(framesDir);
        console.log(`[${taskId}] Render Complete: ${exportPath}`);
        
        return `${taskId}.mp4`;
    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}

module.exports = { renderVideo };