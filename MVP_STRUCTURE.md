# Resume Tailor Extension - MVP Structure

## Overview
A Chrome extension that auto-generates tailored cover letters from job descriptions using Chrome's Built-in AI APIs (Prompt API, Summarizer API, Proofreader API) for client-side, privacy-preserving AI operations.

## Core Value Proposition
**Problem:** Tailoring cover letters for each job posting is tedious, time-consuming, and error-prone.  
**Solution:** Highlight a job description anywhere, auto-generate a tailored cover letter based on your uploaded resume — saving time and improving relevance.  
**Privacy:** Uses built-in browser AI so user data remains private and processing is quick.

---

## MVP Feature Set

### ✅ Must-Have Features (MVP)
1. **Extension UI** - Icon + popup interface
2. **Resume/Profile Upload** - User can upload resume or input profile (name, skills, experience)
3. **Highlight Job Description** - Via context menu or toolbar on any site
4. **Generate Cover Letter** - Sends profile + job description to Chrome Built-in AI
5. **Display Draft** - Shows generated cover letter in popup for review/edit
6. **Proofreading** - Basic grammar/typo correction using Proofreader API
7. **Tone Selector** - Choose tone (Professional/Enthusiastic/Confident/Friendly/Creative/Concise)
8. **Export/Copy** - Copy to clipboard or download as text

### 🚫 Out of Scope for MVP
- Multi-language generation
- Multi-version history & comparison
- Advanced export formats (PDF/DOCX with formatting)
- Auto-detection of company details
- Deep integration with career sites
- Fully offline mode
- Advanced analytics

---

## User Flow

1. **Install Extension** → User adds extension to Chrome
2. **Upload Resume** → User uploads resume/profile in extension settings
3. **Browse Job Sites** → User navigates to LinkedIn, Indeed, Glassdoor, etc.
4. **Highlight Job Description** → User selects job description text
5. **Generate** → Click extension icon or context menu → "Generate Cover Letter"
6. **AI Processing** → Extension extracts text + sends to Chrome Built-in AI with profile and tone
7. **Review Draft** → AI returns cover letter draft in popup
8. **Proofread** → User can run proofreader for grammar/typo fixes
9. **Edit** → User can manually edit the draft
10. **Copy/Download** → User copies to clipboard or downloads
11. **(Optional) History** → Extension stores generated versions locally

---

## Technical Architecture

### Components

#### 1. **Manifest (manifest.json)**
- Manifest V3
- Permissions: `storage`, `activeTab`, `contextMenus`, `clipboardWrite`, `scripting`
- Host permissions for job sites
- Content scripts for job site detection
- Background service worker

#### 2. **Background Service Worker** (`src/background/service-worker.js`)
- Message routing between popup, content scripts, and AI
- Settings management
- Context menu creation
- Cover letter history management
- Fallback to OpenAI API if Built-in AI unavailable

#### 3. **Content Script** (`src/content/content.js`)
- Injected into job posting pages
- Detects job sites (LinkedIn, Indeed, Glassdoor, etc.)
- Extracts job description from page DOM
- Shows floating button for quick access
- Displays cover letter panel overlay

#### 4. **Popup UI** (`src/popup/Popup.jsx`)
- React-based interface
- Three tabs: Setup, Generate, Result
- Resume upload interface
- Tone selector
- Job description input/extraction
- Cover letter display and editing
- Export/copy functionality

#### 5. **Components**
- **ResumeUpload.jsx** - Drag-and-drop resume upload with validation
- **ToneSelector.jsx** - Visual tone selection (6 options)
- **CoverLetterDisplay.jsx** - Display with copy/export actions

#### 6. **Utilities**
- **chromeAI.js** - Chrome Built-in AI integration (Prompt, Summarizer, Proofreader APIs)
- **aiService.js** - OpenAI API fallback
- **storage.js** - Browser storage management
- **export.js** - Export utilities (text, HTML, RTF)

---

## Chrome Built-in AI Integration

### Prompt API
```javascript
const session = await window.ai.languageModel.create({
  systemPrompt: buildSystemPrompt(tone),
  temperature: 0.7,
  topK: 40
});

const coverLetter = await session.prompt(userPrompt);
```

### Summarizer API
```javascript
const summarizer = await window.ai.summarizer.create({
  type: 'key-points',
  format: 'plain-text',
  length: 'medium'
});

const summary = await summarizer.summarize(jobDescription);
```

### Proofreader API
```javascript
const proofreader = await window.ai.proofreader.create();
const result = await proofreader.proofread(text);
```

---

## Data Flow

```
User Action (Highlight Text)
    ↓
Content Script (Extract Job Description)
    ↓
Background Service Worker (Route Message)
    ↓
Chrome Built-in AI (Generate Cover Letter)
    ↓
Popup UI (Display Result)
    ↓
User (Review, Edit, Copy/Download)
```

---

## Storage Schema

```javascript
{
  // User Settings
  tone: 'professional',
  useBuiltInAI: true,
  apiKey: null,
  
  // User Profile
  userProfile: {
    name: 'John Doe',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: [...]
  },
  
  // Resume
  resume: {
    name: 'resume.pdf',
    content: '...',
    uploadedAt: '2025-01-29T...'
  },
  
  // History
  coverLetters: [
    {
      id: '1738166400000',
      content: '...',
      jobDescription: '...',
      tone: 'professional',
      timestamp: 1738166400000
    }
  ]
}
```

---

## Success Metrics

1. **Adoption** - Number of users who upload a resume
2. **Usage** - Number of cover letters generated
3. **Conversion** - Percentage of drafts copied/downloaded
4. **Satisfaction** - User feedback on quality
5. **Time Saved** - Self-reported vs manual writing

---

## Next-Phase Enhancements (Post-MVP)

1. **Multiple Tone Presets** - More granular tone control
2. **Multilingual Support** - Using Translator API
3. **History Dashboard** - List, compare, reuse previous letters
4. **Job Board Integration** - One-click generate on specific sites
5. **Advanced Export** - PDF/DOCX with formatting
6. **Analytics** - Match score, skill highlighting
7. **Offline Mode** - Full offline AI support
8. **Mobile Support** - Chromebook/Android compatibility

---

## Development Setup

### Prerequisites
- Node.js 18+
- Chrome 120+ (for Built-in AI APIs)
- Chrome flags enabled: `chrome://flags/#optimization-guide-on-device-model`

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Load Extension
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist` folder

---

## Code Quality Standards

### Senior-Level Practices
- ✅ Comprehensive error handling with try-catch blocks
- ✅ Input validation and sanitization
- ✅ Proper async/await usage
- ✅ Memory leak prevention (cleanup sessions/listeners)
- ✅ Performance optimization (debouncing, lazy loading)
- ✅ Modular architecture with clear separation of concerns
- ✅ JSDoc comments for all public functions
- ✅ Consistent naming conventions
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ SOLID principles where applicable

### Performance Optimizations
- Lazy initialization of UI components
- Debounced text extraction
- Efficient DOM queries with caching
- Minimal re-renders in React components
- Optimized bundle size with tree-shaking
- Service worker lifecycle management

### Security
- No hardcoded API keys
- Input sanitization for XSS prevention
- Secure storage of sensitive data
- Content Security Policy compliance
- Minimal permissions requested

---

## File Structure

```
resume-tailor-extension/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── background/
│   │   └── service-worker.js
│   ├── content/
│   │   ├── content.js
│   │   └── content.css
│   ├── popup/
│   │   ├── Popup.jsx
│   │   ├── Popup.css
│   │   └── index.html
│   ├── components/
│   │   ├── ResumeUpload.jsx
│   │   ├── CoverLetterDisplay.jsx
│   │   └── ToneSelector.jsx
│   └── utils/
│       ├── chromeAI.js (Chrome Built-in AI)
│       ├── aiService.js (OpenAI fallback)
│       ├── storage.js
│       └── export.js
├── package.json
├── vite.config.js
└── README.md
```

---

## License
MIT

## Author
Senior Developer - Optimized for Production
