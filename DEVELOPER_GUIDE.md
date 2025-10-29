# Developer Guide - Resume Tailor Extension

## Quick Reference for Development

### 🚀 Getting Started

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### 📁 Project Structure

```
src/
├── background/          # Service worker (background tasks)
├── content/            # Content scripts (page interaction)
├── popup/              # Extension popup UI
├── components/         # Reusable React components
└── utils/              # Utility functions
    ├── chromeAI.js     # Chrome Built-in AI integration
    ├── aiService.js    # OpenAI API fallback
    ├── storage.js      # Browser storage management
    └── export.js       # Export utilities
```

### 🔧 Key Files

| File | Purpose |
|------|---------|
| `public/manifest.json` | Extension configuration |
| `src/background/service-worker.js` | Background message handling |
| `src/content/content.js` | Page interaction & extraction |
| `src/popup/Popup.jsx` | Main UI component |
| `src/utils/chromeAI.js` | Chrome AI integration |
| `vite.config.js` | Build configuration |

### 📝 Common Tasks

#### Adding a New Message Type

1. **Define in service worker:**
```javascript
// src/background/service-worker.js
const MESSAGE_TYPES = {
  YOUR_NEW_TYPE: 'YOUR_NEW_TYPE'
};

async function handleYourNewType(data) {
  // Implementation
  return { result: 'success' };
}

// Add to handlers
const handlers = {
  [MESSAGE_TYPES.YOUR_NEW_TYPE]: handleYourNewType
};
```

2. **Send from popup/content:**
```javascript
const response = await browser.runtime.sendMessage({
  type: 'YOUR_NEW_TYPE',
  data: { /* your data */ }
});
```

#### Adding a New Component

```javascript
// src/components/YourComponent.jsx
import React, { useState, useCallback } from 'react';

function YourComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  const handleAction = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  return (
    <div>
      {/* Your JSX */}
    </div>
  );
}

export default React.memo(YourComponent);
```

#### Adding a New Utility Function

```javascript
// src/utils/yourUtil.js

/**
 * Description of what this function does
 * @param {Type} param - Parameter description
 * @returns {ReturnType} Return value description
 */
export function yourFunction(param) {
  try {
    // Implementation
    return result;
  } catch (error) {
    console.error('Error in yourFunction:', error);
    throw error;
  }
}
```

### 🎨 Styling Guidelines

- Use inline styles for component-specific styles
- Use CSS files for global/shared styles
- Follow BEM naming convention for classes
- Use CSS variables for theming
- Maintain consistent spacing (4px, 8px, 12px, 16px, 24px)

### 🔍 Debugging

#### Enable Extension Debugging

1. Open `chrome://extensions/`
2. Find "Resume Tailor Extension"
3. Click "Inspect views: service worker" (for background)
4. Click "Inspect" on popup (for popup debugging)
5. Open DevTools on any page (for content script)

#### Logging Best Practices

```javascript
// Use prefixes for easy filtering
console.log('[Service Worker] Message received:', data);
console.log('[Content Script] Extracting job description');
console.log('[Popup] User clicked generate');

// Use appropriate log levels
console.error('[Service Worker] Generation failed:', error);
console.warn('[Content Script] No job description found');
console.info('[Popup] Settings saved successfully');
```

### 🧪 Testing Checklist

#### Before Committing
- [ ] Code lints without errors (`npm run lint`)
- [ ] Extension builds successfully (`npm run build`)
- [ ] Tested in Chrome
- [ ] No console errors
- [ ] All features work as expected

#### Manual Testing
- [ ] Resume upload (PDF, DOC, DOCX, TXT)
- [ ] Job description extraction on LinkedIn
- [ ] Job description extraction on Indeed
- [ ] Cover letter generation
- [ ] All 6 tones work
- [ ] Copy to clipboard
- [ ] Export functionality
- [ ] Settings persistence

### 🔐 Security Checklist

- [ ] No hardcoded API keys
- [ ] Input sanitization for user data
- [ ] Proper error messages (no sensitive info)
- [ ] Secure storage usage
- [ ] Minimal permissions requested
- [ ] Content Security Policy compliance

### ⚡ Performance Tips

1. **Use React.memo for expensive components**
```javascript
export default React.memo(YourComponent, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

2. **Use useCallback for event handlers**
```javascript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

3. **Debounce expensive operations**
```javascript
const debouncedFunction = debounce(expensiveFunction, 300);
```

4. **Cache DOM queries**
```javascript
const element = useMemo(() => document.querySelector(selector), [selector]);
```

### 📦 Build Optimization

#### Analyzing Bundle Size
```bash
npm run build
# Check dist/ folder sizes
```

#### Reducing Bundle Size
- Remove unused dependencies
- Use dynamic imports for large modules
- Enable tree-shaking
- Minimize third-party libraries

### 🐛 Common Issues & Solutions

#### Issue: Extension not loading
**Solution:** Check manifest.json syntax, ensure all files exist in dist/

#### Issue: Content script not injecting
**Solution:** Check matches patterns in manifest.json, verify site URL

#### Issue: Built-in AI not available
**Solution:** Enable chrome://flags/#optimization-guide-on-device-model

#### Issue: Messages not reaching background
**Solution:** Check message type spelling, ensure service worker is running

### 📚 Useful Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Built-in AI](https://developer.chrome.com/docs/ai/built-in)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)

### 🤝 Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### 📝 Commit Message Convention

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Refactor function
perf: Improve performance
test: Add tests
chore: Update dependencies
```

### 🎯 Code Review Checklist

- [ ] Code follows project style guide
- [ ] Functions have JSDoc comments
- [ ] Error handling is comprehensive
- [ ] No console.logs in production code
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Tests pass (if applicable)
- [ ] Documentation updated

### 🚢 Release Process

1. **Update version in manifest.json and package.json**
2. **Update CHANGELOG.md**
3. **Run full test suite**
4. **Build production version**
   ```bash
   npm run build:prod
   ```
5. **Test built extension**
6. **Create git tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
7. **Prepare Chrome Web Store package**
8. **Submit for review**

### 💡 Tips for Senior-Level Code

1. **Always validate inputs**
2. **Handle errors gracefully**
3. **Write self-documenting code**
4. **Keep functions small and focused**
5. **Use constants for magic numbers**
6. **Avoid premature optimization**
7. **Write for maintainability**
8. **Consider edge cases**
9. **Clean up resources (sessions, listeners)**
10. **Follow SOLID principles**

---

## Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run lint               # Check code quality
npm run lint:fix           # Fix linting issues
npm run clean              # Clean dist folder

# Git
git status                 # Check status
git add .                  # Stage changes
git commit -m "message"    # Commit changes
git push                   # Push to remote

# Chrome
chrome://extensions/       # Manage extensions
chrome://flags/            # Enable features
chrome://components/       # Check AI models
```

---

**Happy Coding! 🚀**
