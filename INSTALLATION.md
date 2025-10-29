# Installation Guide - Resume Tailor Extension

## 📋 Prerequisites

### Required
- **Chrome Browser**: Version 120 or higher
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher

### Check Your Versions
```bash
# Check Chrome version
chrome://version

# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Enable Chrome Built-in AI

1. **Open Chrome Flags**
   ```
   chrome://flags/#optimization-guide-on-device-model
   ```

2. **Enable the Flag**
   - Find "Optimization Guide On Device Model"
   - Select **"Enabled BypassPerfRequirement"** from dropdown
   - Click **"Relaunch"** button

3. **Verify AI Models**
   ```
   chrome://components/
   ```
   - Look for "Optimization Guide On Device Model"
   - Should show version number (e.g., "2024.11.15.2347")
   - If not installed, wait 5-10 minutes and refresh

### Step 2: Clone Repository

```bash
git clone https://github.com/yourusername/resume-tailor-extension.git
cd resume-tailor-extension
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Build Extension

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

### Step 5: Load Extension in Chrome

1. **Open Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Select the `dist/` folder
   - Extension icon should appear in toolbar

### Step 6: Verify Installation

1. Click the extension icon in toolbar
2. You should see the popup interface
3. Try uploading a resume
4. Navigate to a job site (LinkedIn, Indeed, etc.)
5. You should see the floating button

---

## 🔧 Detailed Setup

### Chrome Built-in AI Setup (Critical)

#### Why This Is Required
Chrome Built-in AI APIs (`window.ai`) are experimental and require:
1. Chrome 120+ (Dev/Canary channel recommended)
2. Specific flags enabled
3. AI models downloaded

#### Step-by-Step Flag Configuration

1. **Prompt API Flag**
   ```
   chrome://flags/#prompt-api-for-gemini-nano
   ```
   Set to: **Enabled**

2. **Optimization Guide Flag**
   ```
   chrome://flags/#optimization-guide-on-device-model
   ```
   Set to: **Enabled BypassPerfRequirement**

3. **Relaunch Chrome**
   - Click "Relaunch" button
   - Wait for Chrome to restart

#### Verify AI Availability

Open DevTools Console (F12) and run:
```javascript
// Check if AI is available
if ('ai' in window) {
  console.log('✅ AI APIs available');
  
  // Check Prompt API
  window.ai.languageModel.capabilities().then(caps => {
    console.log('Prompt API:', caps.available);
  });
  
  // Check Summarizer API
  window.ai.summarizer.capabilities().then(caps => {
    console.log('Summarizer API:', caps.available);
  });
} else {
  console.log('❌ AI APIs not available');
}
```

Expected output:
```
✅ AI APIs available
Prompt API: readily
Summarizer API: readily
```

#### Troubleshooting AI Setup

**Problem**: AI APIs not available
**Solutions**:
1. Ensure Chrome 120+
2. Check flags are enabled
3. Wait 10-15 minutes for model download
4. Check `chrome://components/` for model installation
5. Try Chrome Canary/Dev channel

**Problem**: Model not downloading
**Solutions**:
1. Check internet connection
2. Restart Chrome
3. Clear browser cache
4. Check available disk space (models ~1-2 GB)

---

## 💻 Development Setup

### For Development (Hot Reload)

```bash
# Start development server
npm run dev
```

This starts Vite dev server with hot module replacement.

**Note**: For Chrome extensions, you still need to:
1. Build once: `npm run build`
2. Load extension from `dist/`
3. Rebuild when making changes: `npm run build`
4. Click "Reload" button in `chrome://extensions/`

### Development Workflow

```bash
# 1. Make code changes
# 2. Rebuild
npm run build

# 3. Reload extension in Chrome
# Click reload button in chrome://extensions/

# 4. Test changes
```

### Useful Development Commands

```bash
# Clean build directory
npm run clean

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Production build
npm run build:prod
```

---

## 📦 Build Output Structure

After running `npm run build`, the `dist/` folder contains:

```
dist/
├── manifest.json          # Extension manifest
├── popup.html            # Popup interface
├── service-worker.js     # Background service worker
├── offscreen.html        # Offscreen document for AI
├── offscreen.js          # AI processing logic
├── content.js            # Content script
├── content.css           # Content script styles
├── assets/               # Compiled assets
│   ├── popup-[hash].js
│   ├── popup-[hash].css
│   └── ...
└── icons/                # Extension icons (if added)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🎨 Adding Extension Icons (Optional)

The extension references icons but they're not included. To add them:

### Option 1: Create Your Own

1. Create `public/icons/` folder
2. Add three PNG files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. Rebuild: `npm run build`

### Option 2: Use Placeholder

Create simple colored squares as placeholders:

```bash
# Create icons directory
mkdir -p public/icons

# Use any image editor or online tool to create:
# - 16x16 purple square → icon16.png
# - 48x48 purple square → icon48.png
# - 128x128 purple square → icon128.png
```

---

## 🧪 Testing Installation

### Basic Functionality Test

1. **Popup Test**
   - Click extension icon
   - Popup should open
   - No console errors

2. **Resume Upload Test**
   - Go to "Setup" tab
   - Upload a text file
   - Should show success message

3. **Content Script Test**
   - Navigate to linkedin.com/jobs
   - Floating button should appear
   - Right-click on text → see context menu

4. **AI Generation Test**
   - Upload resume
   - Paste job description
   - Click "Generate Cover Letter"
   - Should generate text (may take 5-10 seconds first time)

### Advanced Testing

```bash
# Open extension background page
chrome://extensions/ → Click "service worker" link

# Check console for errors
# Should see: "[Service Worker] Initialized"
```

---

## 🔍 Troubleshooting

### Extension Not Loading

**Symptoms**: Extension doesn't appear in toolbar

**Solutions**:
1. Check `dist/` folder exists
2. Verify `manifest.json` is in `dist/`
3. Check for build errors: `npm run build`
4. Try removing and re-adding extension

### AI Not Working

**Symptoms**: "AI not available" error

**Solutions**:
1. Verify Chrome flags enabled
2. Check `chrome://components/` for model
3. Wait 10-15 minutes for download
4. Restart Chrome
5. Try Chrome Canary

### Content Script Not Injecting

**Symptoms**: No floating button on job sites

**Solutions**:
1. Check you're on supported site (LinkedIn, Indeed, etc.)
2. Refresh page after loading extension
3. Check console for errors (F12)
4. Verify `content.js` in `dist/` folder

### Build Errors

**Symptoms**: `npm run build` fails

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean

# Try building again
npm run build
```

### Permission Errors

**Symptoms**: "Permissions" errors in console

**Solutions**:
1. Check `manifest.json` has all required permissions
2. Reload extension after changes
3. Check host_permissions for job sites

---

## 📱 Testing on Different Sites

### Supported Job Sites

1. **LinkedIn** - https://linkedin.com/jobs
2. **Indeed** - https://indeed.com
3. **Glassdoor** - https://glassdoor.com
4. **Monster** - https://monster.com
5. **ZipRecruiter** - https://ziprecruiter.com

### Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Resume upload works
- [ ] Tone selector works
- [ ] Content script injects on job sites
- [ ] Floating button appears
- [ ] Context menu appears on text selection
- [ ] Job description extraction works
- [ ] Cover letter generation works
- [ ] Multiple drafts generate
- [ ] Match score calculates
- [ ] Copy to clipboard works
- [ ] Export functions work

---

## 🚀 Production Deployment

### Preparing for Chrome Web Store

1. **Create Production Build**
   ```bash
   npm run build:prod
   ```

2. **Create ZIP File**
   ```bash
   cd dist
   zip -r ../resume-tailor-extension.zip *
   cd ..
   ```

3. **Test ZIP**
   - Load unpacked from ZIP contents
   - Verify all features work

4. **Submit to Chrome Web Store**
   - Go to Chrome Developer Dashboard
   - Pay one-time $5 developer fee
   - Upload ZIP file
   - Fill in store listing
   - Submit for review

---

## 📞 Getting Help

### Resources

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

### Common Issues

Check `TROUBLESHOOTING.md` for detailed solutions to common problems.

---

## ✅ Installation Complete!

You should now have:
- ✅ Chrome Built-in AI enabled
- ✅ Extension installed and working
- ✅ All features functional
- ✅ Ready to generate cover letters!

**Next Steps**:
1. Upload your resume
2. Navigate to a job site
3. Generate your first cover letter!

---

**Need help?** Open an issue on GitHub or check the documentation.
