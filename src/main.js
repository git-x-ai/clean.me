const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { performCleanup, stopCleanup } = require('./cleanup.js');

let mainWindow;
let debugWindow;

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('GPU') || 
      message.includes('gpu_process_host') || 
      message.includes('gpu_channel_manager') ||
      message.includes('command_buffer_proxy_impl') ||
      message.includes('ContextResult::kTransientFailure') ||
      message.includes('ContextResult::kFatalFailure') ||
      message.includes('GLES3 context') ||
      message.includes('GLES2') ||
      message.includes('shared context for virtualization') ||
      message.includes('gpu-process-crashed event') ||
      message.includes('deprecated')) {
    return; // Suppress GPU-related and deprecated event errors
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args.join(' ');
  if (message.includes('GPU') || 
      message.includes('deprecated') ||
      message.includes('electron')) {
    return; // Suppress GPU and electron warnings
  }
  originalConsoleWarn.apply(console, args);
};

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-hang-monitor');
app.commandLine.appendSwitch('disable-features=VizDisplayCompositor');
app.commandLine.appendSwitch('disable-gl-drawing-for-tests');
app.commandLine.appendSwitch('disable-accelerated-2d-canvas');
app.commandLine.appendSwitch('disable-accelerated-jpeg-decoding');
app.commandLine.appendSwitch('disable-accelerated-mjpeg-decode');
app.commandLine.appendSwitch('disable-accelerated-video-decode');
app.commandLine.appendSwitch('use-gl=swiftshader-webgl');
app.commandLine.appendSwitch('disable-webgl');
app.commandLine.appendSwitch('disable-webgl2');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    frame: false, // Frameless window
    resizable: false,
    transparent: true,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      hardwareAcceleration: false, // Disable for stability
      backgroundThrottling: false,
      offscreen: false,
      webSecurity: false,
      experimentalFeatures: true
    },
    icon: path.join(__dirname, '../assets/favicon.ico')
  });

  mainWindow.loadFile('src/index.html');

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Handle window controls
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    mainWindow.close();
  });

  // Handle GitHub link
  ipcMain.on('open-github', () => {
    shell.openExternal('https://github.com/git-x-ai');
  });

  // Handle debug console
  ipcMain.on('toggle-debug', () => {
    if (debugWindow) {
      debugWindow.close();
      debugWindow = null;
    } else {
      createDebugWindow();
    }
  });

  // Handle cleanup request with progress updates
  ipcMain.handle('start-cleanup', async (event) => {
    console.log('Cleanup request received in main process');
    try {
      const progressCallback = (progressData) => {
        // Send progress updates to renderer
        event.sender.send('cleanup-progress', progressData);
      };
      
      const result = await performCleanup(progressCallback);
      console.log('Cleanup completed with result:', result);
      return { success: true, ...result };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { success: false, error: error.message };
    }
  });

  // Handle drag functionality
  ipcMain.on('start-drag', (event, { x, y }) => {
    const [currentX, currentY] = mainWindow.getPosition();
    const [width, height] = mainWindow.getSize();
    
    const newX = currentX + x - width / 2;
    const newY = currentY + y - height / 2;
    
    mainWindow.setPosition(newX, newY);
  });
}

function createDebugWindow() {
  const [x, y] = mainWindow.getPosition();
  const [width, height] = mainWindow.getSize();
  
  debugWindow = new BrowserWindow({
    width: 600,
    height: 400,
    x: x + width + 10,
    y: y,
    frame: true,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Clean.me Debug Console'
  });

  debugWindow.loadFile('src/debug.html');
  
  debugWindow.on('closed', () => {
    debugWindow = null;
  });
}

// Enhanced logging system
const debugLogs = [];
const originalConsoleLog = console.log;

function logToDebug(level, message, ...args) {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = {
    timestamp,
    level,
    message: typeof message === 'string' ? message : JSON.stringify(message),
    args: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg))
  };
  
  debugLogs.push(logEntry);
  
  // Send to debug window if open
  if (debugWindow && !debugWindow.isDestroyed()) {
    debugWindow.webContents.send('debug-log', logEntry);
  }
  
  // Also log to original console
  originalConsoleLog(`[${timestamp}] [${level}]`, message, ...args);
}

// Override console methods
console.log = (...args) => logToDebug('INFO', ...args);
console.error = (...args) => logToDebug('ERROR', ...args);
console.warn = (...args) => logToDebug('WARN', ...args);

// IPC handler to get debug logs
ipcMain.handle('get-debug-logs', () => {
  return debugLogs;
});

app.whenReady().then(() => {
  createWindow();
  logToDebug('INFO', 'Clean.me application started');
});

// Handle app closing
app.on('before-quit', () => {
    console.log('🔄 App is closing, stopping cleanup worker...');
    stopCleanup();
});

app.on('window-all-closed', () => {
    console.log('🔄 All windows closed, stopping cleanup worker...');
    stopCleanup();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle child process errors gracefully (suppress all GPU-related warnings)
app.on('child-process-gone', (event, details) => {
  // Suppress GPU-related messages completely
  if (details.type !== 'GPU' && details.type !== 'Utility') {
    console.log('Child process gone:', details.type, details.reason);
  }
});

// Handle render process crashes
app.on('render-process-gone', (event, webContents, details) => {
  console.log('Render process gone:', details.reason);
  if (details.reason === 'crashed') {
    // Optionally reload the window
    webContents.reload();
  }
});

// Request admin privileges on Windows
if (process.platform === 'win32') {
  app.setAppUserModelId('com.xtratweaks.cleanme');
  
  // Check if running as administrator
  const isAdmin = () => {
    try {
      const fs = require('fs');
      const testPath = 'C:\\Windows\\Temp\\admin_test.tmp';
      fs.writeFileSync(testPath, 'test');
      fs.unlinkSync(testPath);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Log admin status for debugging
  console.log('Running as administrator:', isAdmin());
}
