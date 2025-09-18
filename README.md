# Clean.me - Windows PC Cleaner

<div align="center">
  <img src="assets/logo.png" alt="Clean.me Logo" width="128" height="128">
  
  <h3>One-Click Windows PC Cleaner</h3>
  <p>A sleek, modern desktop application built with Electron and Tailwind CSS</p>
  
  [![License: Dual](https://img.shields.io/badge/License-Dual-green.svg)](LICENSE)
  [![Electron](https://img.shields.io/badge/Electron-38.1.2-blue.svg)](https://electronjs.org/)
  [![Windows](https://img.shields.io/badge/Platform-Windows-blue.svg)](https://www.microsoft.com/windows)
</div>

## ✨ Features

- **🎯 One-Click Cleanup**: Simple, elegant interface with a single button
- **🎨 Liquid Glass UI**: Modern glassmorphism design with interactive effects
- **🛡️ Safe Cleaning**: Only removes non-essential files and temporary data
- **📊 Real-time Feedback**: Progress indicator and detailed cleanup results
- **⚡ Worker Threads**: Non-blocking cleanup operations for smooth UI
- **🚀 Comprehensive Coverage**: Cleans 60+ different locations including:
  - Windows temporary files and cache
  - Browser data (Chrome, Edge, Firefox)
  - Application cache (Teams, Slack, Zoom, Spotify, Discord)
  - System logs and crash dumps
  - Recycle bin and Windows update cache

## 🎬 Screenshots

*Coming soon - add screenshots of your app here*

## 🔧 What Gets Cleaned

### ✅ Safe Locations
- **System Temp**: `C:\Windows\Temp`, `%TEMP%`
- **Browser Cache**: Chrome, Edge, Firefox cache and cookies
- **App Data**: Teams, Slack, Zoom, Spotify, Discord logs/cache
- **Windows Logs**: Event logs, crash dumps, CBS logs
- **Prefetch**: Windows prefetch files
- **Update Cache**: Windows Update temporary files
- **Recycle Bin**: Deleted files in recycle bin

### ❌ Never Touched
- Personal documents and files
- Installed programs and settings
- Critical system files
- Active registry keys

## 📦 Installation

### Option 1: Download Release
1. Go to [Releases](https://github.com/git-x-ai/clean.me/releases)
2. Download the latest `.exe` installer
3. Run the installer and follow the prompts
4. Launch Clean.me from your desktop or start menu

### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/git-x-ai/clean.me.git
cd clean.me

# Install dependencies
npm install

# Start the application
npm start

# Build for distribution
npm run build
```

## 🚀 Development

### Prerequisites
- Node.js 16+ and npm
- Windows 10 or later
- Git

### Setup
```bash
# Clone and install
git clone https://github.com/git-x-ai/clean.me.git
cd clean.me
npm install

# Development with hot reload
npm run dev

# Build CSS (watch mode)
npm run build:css:watch

# Build for production
npm run build
```

### Project Structure
```
clean.me/
├── src/                 # Source code
│   ├── main.js         # Electron main process
│   ├── renderer.js     # UI renderer process
│   ├── cleanup.js      # Cleanup worker management
│   ├── cleanup-worker.js # Cleanup logic (worker thread)
│   ├── index.html      # Main UI
│   ├── debug.html      # Debug console
│   ├── input.css       # Tailwind CSS input
│   └── styles.css      # Generated CSS (auto-generated)
├── assets/             # Images and icons
│   ├── logo.png        # App logo
│   ├── favicon.ico     # Taskbar icon
│   ├── github.svg      # GitHub icon
│   └── wizard.bmp      # Installer sidebar
├── build/              # Build scripts and manifests
├── docs/               # Documentation
└── dist/               # Build output (generated)
```

## 🛡️ Security

Clean.me is designed with security in mind:
- **No network access** - Works entirely offline
- **Safe operations only** - Never modifies critical system files
- **Open source** - Full transparency of operations
- **Minimal permissions** - Only requests necessary access

See our [Security Policy](docs/SECURITY.md) for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Quick Start
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Requirements

- **OS**: Windows 10 or later
- **Permissions**: Administrator privileges (for system file cleanup)
- **RAM**: 100MB minimum
- **Storage**: 200MB for installation

## 📄 License

This project is dual-licensed under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) and GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.

**Commercial use requires a separate license from XTRA Tweaks LLC.**

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons and design inspiration from modern UI/UX principles

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/git-x-ai/clean.me/issues)
- 💡 **Feature Requests**: [Request a feature](https://github.com/git-x-ai/clean.me/issues)
- 📖 **Documentation**: Check our [docs](docs/) folder
- 💬 **Discussions**: [GitHub Discussions](https://github.com/git-x-ai/clean.me/discussions)
- 🌐 **Website**: [xtratweaks.com](https://xtratweaks.com)

---

<div align="center">
  <p>Made with ❤️ for the Windows community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
