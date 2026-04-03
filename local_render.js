const { renderVideo } = require('./src/renderer');

(async () => {
    try {
        await renderVideo('local_test', {
            startFrame: 0,
            endFrame: Math.ceil(82.968 * 60),
            fps: 60,
            duration: 82.968,
            baseUrl: 'http://localhost:3000'
        });
        console.log('Done!');
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
})();