const { parentPort, workerData } = require('worker_threads');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const CLEANUP_PATHS = [
    'C:\\Windows\\Temp',
    'C:\\Users\\*\\AppData\\Local\\Temp',
    
    'C:\\Users\\*\\AppData\\Local\\Microsoft\\Windows\\INetCache',
    'C:\\Users\\*\\AppData\\Local\\Microsoft\\Windows\\WebCache',
    'C:\\Users\\*\\AppData\\Local\\Microsoft\\Windows\\History',
    'C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\Recent',
    'C:\\Users\\*\\AppData\\Local\\CrashDumps',
    
    'C:\\Windows\\Prefetch',
    'C:\\Windows\\SoftwareDistribution\\Download',
    'C:\\Windows\\Logs\\CBS',
    'C:\\Windows\\SoftwareDistribution\\DataStore',
    
    'C:\\Users\\*\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache',
    'C:\\Users\\*\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cookies',
    'C:\\Users\\*\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History',
    
    'C:\\Users\\*\\AppData\\Local\\Microsoft\\Windows\\Explorer',
    'C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\Cookies',
    
    'C:\\Users\\*\\AppData\\Local\\Packages\\Microsoft.LockApp_cw5n1h2txyewy\\Settings',
    'C:\\Users\\*\\AppData\\Local\\Packages\\Microsoft.Windows.StartMenuExperienceHost_cw5n1h2txyewy\\Settings',
    'C:\\Users\\*\\AppData\\Local\\Packages\\Microsoft.Windows.StartMenuExperienceHost_cw5n1h2txyewy\\TempState',
    'C:\\Users\\*\\AppData\\Local\\Packages\\Microsoft.WindowsNotepad_8wekyb3d8bbwe\\SystemAppData\\Helium',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\AC\\Temp',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\BrowsingTopicsSiteData',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\DashTrackerDatabase',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\DIPS',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\DIPS-wal',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\EdgeEDrop\\EdgeEDropSQLite.db',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Extension State',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\ExtensionActivityComp',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\ExtensionActivityEdge',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Favicons',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\heavy_ad_intervention_opt_out.db',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\History',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\History-journal',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\IndexedDB',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Local Storage',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Login Data',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Login Data For Account',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Network',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Network Action Predictor',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Safe Browsing Network',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\ServerCertificate',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Service Worker',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Session Storage',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Shared Dictionary',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\SharedStorage',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\shared_proto_db',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Site Characteristics Database',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Sync Data',
    'C:\\Users\\*\\AppData\\Local\\Packages\\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\\LocalState\\EBWebView\\Default\\Top Sites'
];

let cleanupLog = [];
let totalFilesDeleted = 0;
let totalSpaceFreed = 0;

// Progress tracking
let lastProgressUpdate = 0;
const PROGRESS_UPDATE_INTERVAL = 100; // Update every 100ms max

function sendProgress(progress, status, currentPath) {
    const now = Date.now();
    if (now - lastProgressUpdate >= PROGRESS_UPDATE_INTERVAL) {
        parentPort.postMessage({
            type: 'progress',
            progress,
            status,
            currentPath
        });
        lastProgressUpdate = now;
    }
}

function logToDebug(message) {
    console.log(`[${new Date().toLocaleTimeString()}] [INFO] ${message}`);
    cleanupLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: message
    });
}

async function deleteDirectoryContents(dirPath, progressCallback) {
    try {
        const stats = await fs.stat(dirPath);
        if (!stats.isDirectory()) {
            return { filesDeleted: 0, spaceFreed: 0 };
        }
    } catch (error) {
        logToDebug(`Cannot access directory: ${dirPath} - ${error.message}`);
        return { filesDeleted: 0, spaceFreed: 0 };
    }

    let filesDeleted = 0;
    let spaceFreed = 0;

    try {
        const items = await fs.readdir(dirPath);
        
        if (items.length === 0) {
            logToDebug(`⚪ Skipped: ${dirPath} - No files to delete`);
            return { filesDeleted: 0, spaceFreed: 0 };
        }

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            
            try {
                const stats = await fs.stat(itemPath);
                
                if (stats.isDirectory()) {
                    const result = await deleteDirectoryContents(itemPath, progressCallback);
                    filesDeleted += result.filesDeleted;
                    spaceFreed += result.spaceFreed;
                    
                    // Try to remove the empty directory
                    try {
                        await fs.rmdir(itemPath);
                    } catch (rmdirError) {
                        // Directory not empty or permission denied - that's okay
                    }
                } else {
                    try {
                        await fs.unlink(itemPath);
                        filesDeleted++;
                        spaceFreed += stats.size;
                    } catch (unlinkError) {
                        logToDebug(`Skipped: ${itemPath} - ${unlinkError.message}`);
                    }
                }
                
                // Yield control to prevent blocking
                if (filesDeleted % 10 === 0) {
                    await new Promise(resolve => setImmediate(resolve));
                }
                
            } catch (statError) {
                logToDebug(`Skipped: ${itemPath} - ${statError.message}`);
            }
        }
        
        if (filesDeleted > 0) {
            logToDebug(`✅ Processed: ${dirPath} - Deleted ${filesDeleted} items (${(spaceFreed / 1024 / 1024).toFixed(2)} MB)`);
        }
        
    } catch (readError) {
        logToDebug(`Cannot access directory: ${dirPath} - ${readError.message}`);
    }

    return { filesDeleted, spaceFreed };
}

async function clearRecycleBin() {
    try {
        logToDebug('🗑️ Clearing recycle bin...');
        
        const command = 'powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue; if ($?) { Write-Output \'SUCCESS\' } else { Write-Output \'ERROR\' }"';
        const { stdout, stderr } = await execAsync(command);
        
        if (stdout.includes('SUCCESS') || stdout.trim() === '') {
            logToDebug('✅ Recycle bin cleared successfully');
            return true;
        } else {
            logToDebug('⚠️ Could not clear recycle bin - PowerShell reported error');
            return false;
        }
    } catch (error) {
        logToDebug(`⚠️ Could not clear recycle bin: ${error.message}`);
        return false;
    }
}

async function createRestorePoint(progressCallback) {
    try {
        logToDebug('🔄 Creating system restore point...');
        progressCallback(5, 'Creating system restore point...', 'System backup in progress...');
        
        const command = 'powershell -Command "Checkpoint-Computer -Description \'Clean.me Backup\' -RestorePointType \'MODIFY_SETTINGS\' -ErrorAction SilentlyContinue"';
        await execAsync(command);
        
        logToDebug('✅ System restore point created successfully');
        return true;
    } catch (error) {
        logToDebug(`⚠️ Could not create restore point: ${error.message}`);
        return false;
    }
}

async function runDiskCleanup() {
    try {
        logToDebug('🧹 Running Windows Disk Cleanup...');
        
        const command = 'cleanmgr /sagerun:1';
        await execAsync(command);
        
        logToDebug('✅ Disk cleanup completed');
        return true;
    } catch (error) {
        logToDebug(`⚠️ Disk cleanup failed: ${error.message}`);
        return false;
    }
}

async function performCleanup() {
    try {
        logToDebug('🚀 Starting cleanup process...');
        
        // Create restore point first
        await createRestorePoint(sendProgress);
        
        // Clear recycle bin
        await clearRecycleBin();
        
        // Run disk cleanup
        await runDiskCleanup();
        
        // Process cleanup paths
        const totalPaths = CLEANUP_PATHS.length;
        
        for (let i = 0; i < CLEANUP_PATHS.length; i++) {
            const cleanupPath = CLEANUP_PATHS[i];
            const progress = Math.round(((i + 1) / totalPaths) * 100);
            
            sendProgress(progress, 'Cleaning', cleanupPath);
            
            const result = await deleteDirectoryContents(cleanupPath, sendProgress);
            totalFilesDeleted += result.filesDeleted;
            totalSpaceFreed += result.spaceFreed;
            
            // Yield control between paths
            await new Promise(resolve => setImmediate(resolve));
        }
        
        logToDebug(`🎉 Cleanup completed! Deleted ${totalFilesDeleted} files, freed ${(totalSpaceFreed / 1024 / 1024).toFixed(2)} MB`);
        
        // Send final results
        parentPort.postMessage({
            type: 'complete',
            filesDeleted: totalFilesDeleted,
            spaceFreed: totalSpaceFreed,
            log: cleanupLog
        });
        
    } catch (error) {
        logToDebug(`❌ Cleanup failed: ${error.message}`);
        
        parentPort.postMessage({
            type: 'error',
            error: error.message,
            log: cleanupLog
        });
    }
}

// Start cleanup when worker receives message
parentPort.on('message', (message) => {
    if (message.type === 'start-cleanup') {
        performCleanup();
    }
});

// Handle worker termination
parentPort.on('close', () => {
    process.exit(0);
});
