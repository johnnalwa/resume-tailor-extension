# Resume Tailor Extension

> 🏆 **Chrome Built-in AI Challenge 2025 Submission**

> Auto-generate tailored cover letters from job descriptions using Chrome's Built-in AI - 100% private, 100% offline

[![Chrome Built-in AI](https://img.shields.io/badge/Chrome%20Built--in%20AI-6%2F6%20APIs-4285F4?style=for-the-badge&logo=google-chrome)](https://developer.chrome.com/docs/ai/built-in)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-10b981?style=for-the-badge)](HACKATHON_SUBMISSION.md)

## 🎯 Overview

**Resume Tailor Extension** is a Chrome extension that helps job seekers save time by automatically generating tailored cover letters from job descriptions. Simply highlight a job posting, and the extension uses Chrome's Built-in AI (Prompt API, Summarizer API, Proofreader API) to create a personalized cover letter based on your resume.

### Key Benefits
- Fast - Generate cover letters in seconds
- Private - All AI processing happens locally in your browser
- Customizable - Choose from 6 different tones
- Smart - Matches your skills to job requirements
- Polished - Built-in proofreading for grammar and typos

---

## Quick Start

### Prerequisites
- Chrome 120+ (with Built-in AI support)
- Node.js 18+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-tailor-extension.git
   cd resume-tailor-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### Enable Chrome Built-in AI (Required)

1. Open `chrome://flags/#optimization-guide-on-device-model`
2. Select "Enabled BypassPerfRequirement"
3. Restart Chrome
4. Wait for AI models to download (check `chrome://components/`)

---

## How to Use

### 1. Upload Your Resume
- Click the extension icon
- Go to the "Setup" tab
- Upload your resume (PDF, DOC, DOCX, or TXT)
- Select your preferred tone

### 2. Generate Cover Letter
- Navigate to any job posting (LinkedIn, Indeed, Glassdoor, etc.)
- Highlight the job description
- Right-click → "Generate Cover Letter from Selection"
- Or click the floating button on the page

### 3. Review & Export
- Review the generated cover letter
- Edit if needed
- Run proofreader for grammar check
- Copy to clipboard or download

---

## Features

### MVP Features (v1.0)
- Resume/profile upload
- Job description extraction
- AI-powered cover letter generation
- 6 tone options (Professional, Enthusiastic, Confident, Friendly, Creative, Concise)
- Built-in proofreading
- Copy to clipboard
- Export as text
- Cover letter history
- Match score calculation

### Coming Soon
- PDF/DOCX export with formatting
- Multi-language support
- Advanced analytics
- Job board integration
- Offline mode

---

## Architecture

### Tech Stack
- **Frontend**: React 19, Vite
- **Extension**: Manifest V3, webextension-polyfill
- **AI**: Chrome Built-in AI (Prompt API, Summarizer API, Proofreader API)
- **Fallback**: OpenAI API (optional)
- **Storage**: Chrome Storage API

### Project Structure
```
resume-tailor-extension/
├── public/
│   ├── manifest.json          # Extension manifest
│   └── icons/                 # Extension icons
├── src/
│   ├── background/
│   │   └── service-worker.js  # Background service worker
│   ├── content/
│   │   ├── content.js         # Content script
│   │   └── content.css        # Content styles
│   ├── popup/
│   │   ├── Popup.jsx          # Main popup component
│   │   ├── Popup.css          # Popup styles
│   │   └── index.html         # Popup HTML
│   ├── components/
│   │   ├── ResumeUpload.jsx   # Resume upload component
│   │   ├── CoverLetterDisplay.jsx
│   │   └── ToneSelector.jsx   # Tone selection
│   └── utils/
│       ├── chromeAI.js        # Chrome Built-in AI integration
│       ├── aiService.js       # OpenAI fallback
│       ├── storage.js         # Storage utilities
│       └── export.js          # Export utilities
├── scripts/
│   └── post-build.js          # Build automation
├── package.json
├── vite.config.js
├── MVP_STRUCTURE.md           # Detailed MVP documentation
└── README.md
```

---

## Development

### Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build directory
npm run clean
```

### Development Workflow

1. Make changes to source files
2. Run `npm run dev` for development
3. Load extension in Chrome (see installation)
4. Test changes
5. Run `npm run build` for production build

---

## Testing

### Manual Testing Checklist

- [ ] Resume upload works (PDF, DOC, DOCX, TXT)
- [ ] Job description extraction works on major sites
- [ ] Cover letter generation produces quality output
- [ ] All 6 tones work correctly
- [ ] Proofreading catches errors
- [ ] Copy to clipboard works
- [ ] Export functionality works
- [ ] History saves correctly
- [ ] Match score calculates accurately

### Test Sites
- LinkedIn Jobs
- Indeed
- Glassdoor
- Monster
- ZipRecruiter

---

## Performance

### Optimizations
- Lazy loading of UI components
- Debounced text extraction
- Efficient DOM queries with caching
- Minimal React re-renders
- Tree-shaking for smaller bundle size
- Service worker lifecycle management

### Bundle Size
- Popup: ~150 KB
- Content Script: ~50 KB
- Service Worker: ~30 KB
- Total: ~230 KB (minified)

---

## Privacy & Security

- All AI processing happens locally (Chrome Built-in AI)
- No data sent to external servers (except optional OpenAI fallback)
- Resume stored locally in browser storage
- No tracking or analytics
- Minimal permissions requested
- Open source and auditable

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality Standards
- Follow ESLint rules
- Write JSDoc comments for functions
- Add error handling
- Test on multiple job sites
- Keep bundle size small

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Acknowledgments

- Chrome Built-in AI team for the amazing APIs
- React team for the excellent framework
- Open source community

---

## Support

- Email: support@example.com
- Issues: [GitHub Issues](https://github.com/yourusername/resume-tailor-extension/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/resume-tailor-extension/discussions)

---

## Roadmap

See [MVP_STRUCTURE.md](MVP_STRUCTURE.md) for detailed MVP specifications and future enhancements.

### v1.0 (Current)
- Core cover letter generation
- Chrome Built-in AI integration
- Basic export functionality

### v1.1 (Planned)
- PDF/DOCX export with formatting
- Enhanced history management
- Improved match scoring

### v2.0 (Future)
- Multi-language support
- Advanced analytics
- Job board deep integration

---

**Made with by developers, for job seekers**
