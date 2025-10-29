# Changelog

All notable changes to the Resume Tailor Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-29

### Added
- ✨ Initial MVP release
- 🤖 Chrome Built-in AI integration (Prompt API, Summarizer API, Proofreader API)
- 📄 Resume upload functionality (PDF, DOC, DOCX, TXT)
- 🎯 Job description extraction from major job sites
- ✍️ AI-powered cover letter generation
- 🎨 6 tone options (Professional, Enthusiastic, Confident, Friendly, Creative, Concise)
- 📋 Copy to clipboard functionality
- 💾 Export as text/HTML/RTF
- 📚 Cover letter history (last 20 letters)
- 📊 Match score calculation
- 🎪 Context menu integration
- 🔘 Floating button on job sites
- 💬 User-friendly notifications
- 🎨 Modern gradient UI design
- 📱 Responsive popup interface

### Technical
- ⚙️ Manifest V3 implementation
- 🏗️ React 19 + Vite build system
- 📦 Optimized bundle size (~230 KB)
- 🔒 Privacy-first architecture
- 🚀 Performance optimizations
- 🧪 Comprehensive error handling
- 📝 JSDoc documentation
- 🎯 Senior-level code quality

### Security
- 🔐 Secure local storage
- 🛡️ Input sanitization
- 🔒 No hardcoded secrets
- 🎯 Minimal permissions
- 🔐 Content Security Policy compliance

### Supported Sites
- LinkedIn Jobs
- Indeed
- Glassdoor
- Monster
- ZipRecruiter
- Generic career pages

---

## [Unreleased]

### Planned for v1.1
- 📄 PDF export with formatting
- 📊 Enhanced match scoring algorithm
- 🎨 Custom tone creation
- 📱 Better mobile support
- 🌐 Improved internationalization
- 📈 Analytics dashboard

### Planned for v2.0
- 🌍 Multi-language support (Translator API)
- 🤝 Deep job board integration
- 📊 Advanced analytics
- 🎯 Skill gap analysis
- 💼 Multiple resume profiles
- 🔄 Version comparison
- 📱 Mobile app companion

---

## Version History

### Version Numbering
- **Major (X.0.0)**: Breaking changes, major features
- **Minor (1.X.0)**: New features, backwards compatible
- **Patch (1.0.X)**: Bug fixes, minor improvements

### Release Schedule
- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly with new features
- **Major releases**: Quarterly with significant changes

---

## Migration Guide

### From v0.x to v1.0
This is the initial release. No migration needed.

---

## Known Issues

### v1.0.0
- Chrome Built-in AI requires Chrome 120+ with flags enabled
- Proofreader API may not be available in all Chrome versions
- PDF export creates text file (full PDF support coming in v1.1)
- Content script may need page refresh on some sites

### Workarounds
- **AI not available**: Use OpenAI API fallback by adding API key in settings
- **Extraction fails**: Manually copy job description to popup
- **PDF export**: Use browser's print-to-PDF feature

---

## Feedback & Bug Reports

Found a bug or have a feature request?
- 🐛 [Report a bug](https://github.com/yourusername/resume-tailor-extension/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/yourusername/resume-tailor-extension/issues/new?template=feature_request.md)
- 💬 [Join discussions](https://github.com/yourusername/resume-tailor-extension/discussions)

---

## Contributors

Thanks to all contributors who helped make this project possible!

- **Lead Developer**: [Your Name]
- **Contributors**: [List contributors here]

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
