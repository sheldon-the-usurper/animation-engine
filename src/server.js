const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');
const { renderVideo } = require('./renderer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Simple in-memory task store
const tasks = new Map();

/**
 * Trigger a new render
 */
app.post('/render', async (req, res) => {
    const taskId = uuidv4();
    const options = req.body;

    tasks.set(taskId, {
        id: taskId,
        status: 'processing',
        progress: 0,
        createdAt: new Date()
    });

    // Start rendering in background
    renderVideo(taskId, {
        ...options,
        baseUrl: `http://localhost:${PORT}`
    })
    .then(filename => {
        tasks.set(taskId, { ...tasks.get(taskId), status: 'completed', videoUrl: `/download/${filename}` });
    })
    .catch(err => {
        console.error(`Render Error [${taskId}]:`, err);
        tasks.set(taskId, { ...tasks.get(taskId), status: 'failed', error: err.message });
    });

    res.json({ taskId, message: "Render started in background" });
});

/**
 * Check task status
 */
app.get('/status/:id', (req, res) => {
    const task = tasks.get(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
});

/**
 * Download generated video
 */
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../exports', req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log(`🚀 EulerFold Render Engine running on port ${PORT}`);
});