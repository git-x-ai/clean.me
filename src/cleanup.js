const { Worker } = require('worker_threads');
const path = require('path');

let cleanupWorker = null;

function performCleanup(progressCallback) {
    return new Promise((resolve, reject) => {
        // Create worker thread for cleanup
        cleanupWorker = new Worker(path.join(__dirname, 'cleanup-worker.js'));
        
        cleanupWorker.on('message', (message) => {
            switch (message.type) {
                case 'progress':
                    progressCallback(message.progress, message.status, message.currentPath);
                    break;
                    
                case 'complete':
                    cleanupWorker.terminate();
                    resolve({
                        filesDeleted: message.filesDeleted,
                        spaceFreed: message.spaceFreed,
                        log: message.log
                    });
                    break;
                    
                case 'error':
                    cleanupWorker.terminate();
                    reject(new Error(message.error));
                    break;
            }
        });
        
        cleanupWorker.on('error', (error) => {
            cleanupWorker.terminate();
            reject(error);
        });
        
        cleanupWorker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
        
        // Start cleanup in worker thread
        cleanupWorker.postMessage({ type: 'start-cleanup' });
    });
}

function stopCleanup() {
    if (cleanupWorker) {
        cleanupWorker.terminate();
        cleanupWorker = null;
    }
}

module.exports = {
    performCleanup,
    stopCleanup
};