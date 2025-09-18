const { ipcRenderer } = require('electron');

const cleanupBtn = document.getElementById('cleanup-btn');
const btnText = document.getElementById('btn-text');
const statusTitle = document.getElementById('status-title');
const statusText = document.getElementById('status-text');
const currentPath = document.getElementById('current-path');
const closeBtn = document.getElementById('close-btn');
const minimizeBtn = document.getElementById('minimize-btn');
const githubBtn = document.getElementById('github-btn');
const debugLink = document.getElementById('debug-link');

let cleanupLog = [];

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

githubBtn.addEventListener('click', () => {
    ipcRenderer.send('open-github');
});

debugLink.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('toggle-debug');
});

ipcRenderer.on('cleanup-progress', (event, progressData) => {
    // Check if we're still in restore point creation phase
    if (progressData.currentPath && progressData.currentPath.includes('restore point')) {
        statusTitle.textContent = 'Preparing';
        statusText.textContent = 'Creating system restore point for safety';
        currentPath.textContent = 'System backup in progress...';
        updateProgressRing(5); // Show small progress for restore point
        return;
    }
    
    // Switch to cleaning mode once actual cleanup starts
    statusTitle.textContent = 'Cleaning';
    statusText.textContent = 'Cleaning in progress please wait';
    btnText.textContent = 'Cleaning...';
    
    // Show current path being cleaned
    const pathName = progressData.currentPath.split('\\').pop() || progressData.currentPath;
    currentPath.textContent = `Processing: ${pathName}`;
    
    // Update progress ring
    updateProgressRing(progressData.progress || 0);
    
    // Log the cleanup action
    cleanupLog.push({
        path: progressData.currentPath,
        filesDeleted: progressData.filesDeleted || 0,
        spaceFreed: progressData.spaceFreed || '0 B',
        timestamp: new Date().toLocaleTimeString()
    });
});

async function performCleanup() {
    try {
        console.log('🚀 Starting cleanup from UI...');
        
        // Initialize cleanup log
        cleanupLog = [];
        cleanupLog.push({
            action: 'Cleanup started',
            timestamp: new Date().toLocaleString()
        });

        // Disable button and show initial status
        cleanupBtn.disabled = true;
        btnText.textContent = 'Creating Backup...';
        statusTitle.textContent = 'Preparing';
        statusText.textContent = 'Creating system restore point for safety';
        currentPath.textContent = 'System backup in progress...';

        // Perform actual cleanup with real-time progress
        console.log('Starting cleanup from renderer...');
        const result = await ipcRenderer.invoke('start-cleanup');
        console.log('Cleanup result from main:', result);

        if (result.success) {
            console.log('✅ Cleanup completed successfully!', result);
            
            // Final log entry
            cleanupLog.push({
                action: 'Cleanup completed successfully',
                filesDeleted: result.filesDeleted,
                spaceFreed: result.spaceFreed,
                pathsProcessed: result.pathsProcessed,
                timestamp: new Date().toLocaleString()
            });

            // Show completion status and keep it
            statusTitle.textContent = 'Complete!';
            statusText.textContent = 'Cleanup finished successfully';
            currentPath.textContent = `Deleted ${result.filesDeleted} files - Freed ${result.spaceFreed}`;
            btnText.textContent = 'Finished';
            
            // Keep the finished state - don't restart
            cleanupBtn.disabled = true;
        } else {
            // Error handling
            cleanupLog.push({
                action: 'Cleanup failed',
                error: result.error,
                timestamp: new Date().toLocaleString()
            });

            statusTitle.textContent = 'Error';
            statusText.textContent = 'Cleanup failed';
            currentPath.textContent = result.error;
            btnText.textContent = 'Failed';
            
            // Keep the error state - don't restart
            cleanupBtn.disabled = true;
        }
    } catch (error) {
        console.error('Cleanup error:', error);
        cleanupLog.push({
            action: 'Cleanup error',
            error: error.message,
            timestamp: new Date().toLocaleString()
        });

        statusTitle.textContent = 'Error';
        statusText.textContent = 'An error occurred during cleanup';
        currentPath.textContent = error.message;
        btnText.textContent = 'Failed';
        
        // Keep the error state - don't restart
        cleanupBtn.disabled = true;
    }
}


cleanupBtn.addEventListener('click', performCleanup);

document.addEventListener('keydown', (e) => {
    // Ctrl+R or F5 to refresh
    if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        location.reload();
    }
    
    // Escape to close
    if (e.key === 'Escape') {
        ipcRenderer.send('window-close');
    }
    
    // Enter or Space to start cleanup
    if ((e.key === 'Enter' || e.key === ' ') && !cleanupBtn.disabled) {
        e.preventDefault();
        performCleanup();
    }
});

function resetToInitialState() {
    // Reset UI elements
    statusTitle.textContent = 'Ready to clean';
    statusText.textContent = 'Click below to start cleaning';
    currentPath.textContent = 'Ready to start';
    btnText.textContent = 'Start Cleanup';
    
    // Reset button functionality
    cleanupBtn.disabled = false;
    cleanupBtn.onclick = performCleanup;
    
    // Reset progress
    updateProgressRing(0);
    
    // Clear cleanup log
    cleanupLog = [];
    
    console.log('🔄 App reset to initial state');
}

console.log('Clean.me renderer loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    // Get all glass elements
    const glassElements = document.querySelectorAll('.glass-button');
    
    // Add mousemove effect for each glass element
    glassElements.forEach(element => {
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Handle mouse movement over glass elements
    function handleMouseMove(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add highlight effect
        const specular = this.querySelector('.glass-specular');
        if (specular) {
            specular.style.background = `radial-gradient(
                circle at ${x}px ${y}px,
                rgba(255,255,255,0.15) 0%,
                rgba(255,255,255,0.05) 30%,
                rgba(255,255,255,0) 60%
            )`;
        }
    }
    
    // Reset effects when mouse leaves
    function handleMouseLeave() {
        const filter = document.querySelector('#glass-distortion feDisplacementMap');
        if (filter) {
            filter.setAttribute('scale', '77');
        }
        
        const specular = this.querySelector('.glass-specular');
        if (specular) {
            specular.style.background = 'none';
        }
    }
});
