# Contributing to Clean.me

Thank you for your interest in contributing to Clean.me! This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

1. Check if the issue already exists in our [Issues](https://github.com/git-x-ai/clean.me/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - System information (Windows version, etc.)

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Explain how it should work
4. Consider backward compatibility

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a pull request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/git-x-ai/clean.me.git
   cd clean.me
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Project Structure

```
clean.me/
├── src/                 # Source code
│   ├── main.js         # Electron main process
│   ├── renderer.js     # Renderer process
│   ├── cleanup.js      # Cleanup logic
│   ├── index.html      # UI
│   ├── input.css       # Tailwind input
│   └── styles.css      # Generated CSS
├── assets/             # Images and icons
├── build/              # Build scripts
├── docs/               # Documentation
└── dist/               # Build output
```

## Coding Standards

- Use consistent indentation (2 spaces)
- Add comments for complex logic
- Follow existing code style
- Test your changes thoroughly
- Update documentation if needed

## Safety Guidelines

When modifying cleanup paths:
- Only add paths that are safe to delete
- Never touch user documents or system files
- Test on a virtual machine first
- Add proper error handling

## Testing

Before submitting:
1. Test on a clean Windows system
2. Verify all cleanup paths work safely
3. Check UI responsiveness
4. Test build process

## Questions?

Feel free to open an issue for questions about contributing!
