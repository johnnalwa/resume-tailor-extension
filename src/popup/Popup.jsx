import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2, FileText, Sparkles, Sun, Moon, Settings as SettingsIcon, ChevronDown, ChevronUp, Lock, Zap, Globe, Rocket, Languages } from 'lucide-react';
import '../utils/i18n';
import ResumeUpload from '../components/ResumeUpload';
import ResumeSummary from '../components/ResumeSummary';
import CoverLetterDisplay from '../components/CoverLetterDisplay';
import ToneSelector from '../components/ToneSelector';
import ModelSelector from '../components/ModelSelector';
import { saveSettings } from '../utils/storage';
import { generateCoverLetter } from '../utils/aiService';
import './Popup.css';

function Popup() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('upload');
  const [theme, setTheme] = useState('light');
  const [resume, setResume] = useState(null);
  const [tone, setTone] = useState('professional');
  const [aiProvider, setAiProvider] = useState('builtin'); // 'builtin', 'gemini', 'openai', 'claude', 'deepseek'
  const [apiKey, setApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash-exp');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    initializeTheme();
    loadSettings();
  }, []);

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const autoTheme = prefersDark ? 'dark' : 'light';
      setTheme(autoTheme);
      document.documentElement.setAttribute('data-theme', autoTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const loadSettings = async () => {
    try {
      const settings = await browser.storage.local.get();
      const syncSettings = await browser.storage.sync.get();
      
      if (settings.resume) setResume(settings.resume);
      if (settings.tone || syncSettings.defaultTone) setTone(settings.tone || syncSettings.defaultTone);
      if (settings.apiKey) setApiKey(settings.apiKey);
      if (settings.geminiModel) setGeminiModel(settings.geminiModel);
      if (syncSettings.aiProvider) setAiProvider(syncSettings.aiProvider);
      if (syncSettings.language) setLanguage(syncSettings.language);
      if (syncSettings.uiLanguage) {
        i18n.changeLanguage(syncSettings.uiLanguage);
      }
      
      // Check for pending job description from context menu
      if (settings.pendingJobDescription && settings.pendingJobDescriptionTimestamp) {
        const age = Date.now() - settings.pendingJobDescriptionTimestamp;
        // Only use if less than 5 minutes old
        if (age < 5 * 60 * 1000) {
          setJobDescription(settings.pendingJobDescription);
          setActiveTab('generate'); // Switch to generate tab
          
          // Show success toast
          toast.success(
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              <span>Job description loaded! Ready to generate.</span>
            </div>,
            {
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0c4a6e',
                border: '3px solid #eab308',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }
            }
          );
          
          // Clear the pending data
          await browser.storage.local.remove(['pendingJobDescription', 'pendingJobDescriptionTimestamp']);
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleResumeUpload = async (resumeData) => {
    setResume(resumeData);
    await saveSettings({ resume: resumeData });
    setError('');
  };

  const handleToneChange = async (newTone) => {
    setTone(newTone);
    await saveSettings({ tone: newTone });
  };

  const handleApiKeyChange = async (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    await saveSettings({ apiKey: newApiKey });
  };

  const handleAiProviderChange = async (newProvider) => {
    setAiProvider(newProvider);
    await browser.storage.sync.set({ aiProvider: newProvider });
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    await browser.storage.sync.set({ language: newLanguage });
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle size={18} />
        <span>Cover letter language changed to {getLanguageName(newLanguage)}</span>
      </div>,
      {
        duration: 2000,
        style: { background: '#10b981', color: '#fff' }
      }
    );
  };

  const handleUiLanguageChange = async (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    await browser.storage.sync.set({ uiLanguage: newLanguage });
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle size={18} />
        <span>{t('languageChanged')} {getLanguageName(newLanguage)}</span>
      </div>,
      {
        duration: 2000,
        style: { background: '#10b981', color: '#fff' }
      }
    );
  };

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'pt': 'Portuguese',
      'it': 'Italian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'ru': 'Russian'
    };
    return languages[code] || code;
  };

  const handleModelChange = async (newModel) => {
    setGeminiModel(newModel);
    await saveSettings({ geminiModel: newModel });
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle size={18} />
        <span>Model changed to {newModel}</span>
      </div>,
      {
        duration: 2000,
        style: {
          background: '#ffffff',
          color: '#0c4a6e',
          border: '3px solid #eab308',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }
      }
    );
  };

  const handleGenerateCoverLetter = async () => {
    if (!resume) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} />
          <span>Please upload your resume first</span>
        </div>,
        { style: { background: '#ffffff', color: '#dc2626', border: '3px solid #dc2626', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' } }
      );
      return;
    }

    if (!jobDescription.trim()) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} />
          <span>Please enter a job description</span>
        </div>,
        { style: { background: '#ffffff', color: '#dc2626', border: '3px solid #dc2626', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' } }
      );
      return;
    }

    setIsGenerating(true);
    setError('');
    
    const loadingToast = toast.loading(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Loader2 size={18} className="animate-spin" />
        <span>Generating with Gemini Nano...</span>
      </div>,
      {
        style: {
          background: '#ffffff',
          color: '#0c4a6e',
          border: '3px solid #eab308',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }
      }
    );

    try {
      // Use Chrome Built-in AI (Gemini Nano) by default
      const result = await generateCoverLetter({
        jobDescription,
        resume,
        tone,
        language, // Multi-language support
        useBuiltInAI: true, // Primary: Chrome Built-in AI
        apiKey: apiKey || null, // Optional fallback: Gemini API
        geminiModel: geminiModel // Selected Gemini model
      });

      if (result.success) {
        setCoverLetter(result.coverLetter);
        setActiveTab('result');
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>Cover letter generated successfully!</span>
          </div>,
          {
            id: loadingToast,
            style: {
              background: '#ffffff',
              color: '#0c4a6e',
              border: '3px solid #eab308',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }
          }
        );
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} />
            <span>{result.error || 'Failed to generate cover letter'}</span>
          </div>,
          {
            id: loadingToast,
            style: { background: '#dc2626', color: '#fff' }
          }
        );
      }
    } catch (err) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} />
          <span>{err.message || 'An error occurred'}</span>
        </div>,
        {
          id: loadingToast,
          style: { background: '#dc2626', color: '#fff' }
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtractFromPage = async () => {
    const loadingToast = toast.loading(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Loader2 size={18} className="animate-spin" />
        <span>Extracting job description...</span>
      </div>,
      {
        style: {
          background: '#ffffff',
          color: '#0c4a6e',
          border: '3px solid #eab308',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }
      }
    );
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      const response = await browser.tabs.sendMessage(tab.id, {
        type: 'EXTRACT_JOB_DESCRIPTION'
      });
      
      if (response && response.jobDescription) {
        setJobDescription(response.jobDescription);
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} />
            <span>Job description extracted!</span>
          </div>,
          {
            id: loadingToast,
            style: {
              background: '#ffffff',
              color: '#0c4a6e',
              border: '3px solid #eab308',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }
          }
        );
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} />
            <span>{response.error || 'Could not extract job description'}</span>
          </div>,
          {
            id: loadingToast,
            style: { background: '#dc2626', color: '#fff' }
          }
        );
      }
    } catch (error) {
      console.error('Error extracting from page:', error);
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} />
          <span>Failed to extract. Make sure you are on a job posting page.</span>
        </div>,
        {
          id: loadingToast,
          style: { background: '#dc2626', color: '#fff' }
        }
      );
    }
  };

  return (
    <div className="popup-container">
      <Toaster position="top-center" />
      <header className="popup-header">
        <div className="logo-section">
          <img src="icons/icon48.png" alt="Resume Tailor" className="logo" />
          <h1>Resume Tailor</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
          <Sun className="sun-icon" size={20} />
          <Moon className="moon-icon" size={20} />
        </button>
      </header>

      <motion.nav 
        className="popup-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText size={16} />
          Resume
        </motion.button>
        <motion.button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={16} />
          Generate
        </motion.button>
        <motion.button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SettingsIcon size={16} />
          Settings
        </motion.button>
        <motion.button
          className={`tab ${activeTab === 'result' ? 'active' : ''}`}
          onClick={() => setActiveTab('result')}
          disabled={!coverLetter}
          whileHover={{ scale: coverLetter ? 1.05 : 1 }}
          whileTap={{ scale: coverLetter ? 0.95 : 1 }}
        >
          <CheckCircle size={16} />
          Result
        </motion.button>
      </motion.nav>

      <main className="popup-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
        {activeTab === 'upload' && (
          <motion.div 
            key="upload"
            className="tab-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.section 
              className="settings-section"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="ai-status-banner" 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, #5b7cff 100%)',
                padding: '16px 20px',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-10%',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ 
                    fontSize: '15px', 
                    marginBottom: '10px', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: 'white',
                    lineHeight: '1.3'
                  }}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                    Create Professional Cover Letters Instantly
                  </h3>
                  <p style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '10px',
                    lineHeight: '1.5'
                  }}>
                    Upload your resume, paste a job posting, and get a tailored cover letter in seconds
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={13} />
                      Your data stays private
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} />
                      Works offline
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={13} />
                      Supports 12 languages
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            <section className="settings-section">
              <div 
                onClick={() => setShowInstructions(!showInstructions)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  marginBottom: showInstructions ? '12px' : '0',
                  transition: 'all 0.2s ease'
                }}
              >
                <h2 className="section-title" style={{ marginBottom: 0 }}>How to Use</h2>
                {showInstructions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              <AnimatePresence>
              {showInstructions && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                  background: 'var(--bg-secondary)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  overflow: 'hidden'
                }}>
                  <ol style={{ paddingLeft: '20px', margin: 0 }}>
                    <li><strong>Upload Your Resume:</strong> Click below to upload your resume in PDF, DOCX, or DOC format.</li>
                    <li><strong>Configure Settings:</strong> Go to the Settings tab to choose your AI provider and tone preference.</li>
                    <li><strong>Generate Cover Letter:</strong> Navigate to the Generate tab, paste a job description, and click generate.</li>
                    <li><strong>Quick Access:</strong> Right-click on any job posting and select "Generate Cover Letter" from the context menu.</li>
                  </ol>
                  <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '13px', opacity: 0.8 }}>
                    <strong>Tip:</strong> Chrome Built-in AI works completely offline and keeps your data 100% private!
                  </p>
                </motion.div>
              )}
              </AnimatePresence>
            </section>

            <section className="settings-section">
              <h2 className="section-title">Upload Resume</h2>
              <p className="section-description">Upload your resume or enter your information manually</p>
              <ResumeUpload onUpload={handleResumeUpload} currentResume={resume} />
            </section>
          </motion.div>
        )}

        {activeTab === 'generate' && (
          <motion.div 
            key="generate"
            className="tab-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="generate-section">
              <h2>Job Description</h2>
              <div className="job-description-input">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here or extract it from the current page..."
                  rows={10}
                />
                <button
                  className="btn-extract"
                  onClick={handleExtractFromPage}
                >
                  Extract from Current Page
                </button>
              </div>

              <button
                className="btn-generate"
                onClick={handleGenerateCoverLetter}
                disabled={isGenerating || !resume || !jobDescription}
              >
                {isGenerating ? '🤖 Generating with Gemini Nano...' : '✨ Generate Cover Letter'}
              </button>

              {!resume && (
                <p className="warning-text">⚠️ Please upload your resume in the Setup tab first</p>
              )}
            </section>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            className="tab-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Language Settings Card */}
            <motion.div 
              className="settings-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Languages size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{t('languageSettings')}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t('languageDesc')}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label htmlFor="ui-language-select" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    {t('interfaceLanguage')}
                  </label>
                  <select 
                    id="ui-language-select"
                    value={i18n.language} 
                    onChange={(e) => handleUiLanguageChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish (Español)</option>
                    <option value="fr">French (Français)</option>
                  </select>
                  <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {t('interfaceLanguageNote')}
                  </small>
                </div>

                <div>
                  <label htmlFor="language-select" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: 500,
                    color: 'var(--text-primary)'
                  }}>
                    {t('coverLetterLanguage')}
                  </label>
                  <select 
                    id="language-select"
                    value={language} 
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish (Español)</option>
                    <option value="fr">French (Français)</option>
                    <option value="de">German (Deutsch)</option>
                    <option value="pt">Portuguese (Português)</option>
                    <option value="it">Italian (Italiano)</option>
                    <option value="zh">Chinese (中文)</option>
                    <option value="ja">Japanese (日本語)</option>
                    <option value="ko">Korean (한국어)</option>
                    <option value="ar">Arabic (العربية)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="ru">Russian (Русский)</option>
                  </select>
                  <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {t('coverLetterLanguageHelp')}
                  </small>
                </div>
              </div>
            </motion.div>

            {/* Tone Settings Card */}
            <motion.div 
              className="settings-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{t('tonePreference')}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t('tonePreferenceDesc')}</p>
                </div>
              </div>
              <ToneSelector selectedTone={tone} onToneChange={handleToneChange} />
            </motion.div>

            {/* AI Provider Card */}
            <motion.div 
              className="settings-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{t('aiProvider')}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t('aiProviderDesc')}</p>
                </div>
              </div>
              
              <div>
                <select 
                  value={aiProvider} 
                  onChange={(e) => handleAiProviderChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    marginBottom: '8px'
                  }}
                >
                  <option value="builtin">Chrome Built-in AI (Gemini Nano) - Recommended</option>
                  <option value="gemini">Google Gemini API</option>
                  <option value="openai">OpenAI GPT-4</option>
                  <option value="claude">Anthropic Claude</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
                <small style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {t('aiProviderHelp')}
                </small>
              </div>
            </motion.div>

            {aiProvider === 'gemini' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600 }}>Gemini API Settings</h3>
                <div>
                  <label htmlFor="api-key" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: 500 
                  }}>
                    Gemini API Key <span style={{ 
                      fontSize: '11px', 
                      background: 'var(--primary-color)', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      marginLeft: '8px'
                    }}>Fallback</span>
                  </label>
                  <input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="AIza..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
                  </small>
                </div>
                
                {apiKey && (
                  <div style={{ marginTop: '16px' }}>
                    <ModelSelector 
                      selectedModel={geminiModel} 
                      onModelChange={handleModelChange} 
                    />
                  </div>
                )}
              </motion.div>
            )}

            {(aiProvider === 'openai' || aiProvider === 'claude' || aiProvider === 'deepseek') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600 }}>
                  {aiProvider === 'openai' ? 'OpenAI' : aiProvider === 'claude' ? 'Claude' : 'DeepSeek'} API Settings
                </h3>
                <div>
                  <label htmlFor="api-key" style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: 500 
                  }}>
                    {aiProvider === 'openai' ? 'OpenAI' : aiProvider === 'claude' ? 'Claude' : 'DeepSeek'} API Key
                  </label>
                  <input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder={aiProvider === 'openai' ? 'sk-...' : aiProvider === 'claude' ? 'sk-ant-...' : 'Enter API key'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Get your API key from: 
                    {aiProvider === 'openai' && <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a>}
                    {aiProvider === 'claude' && <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic Console</a>}
                    {aiProvider === 'deepseek' && <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer">DeepSeek Platform</a>}
                  </small>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'result' && (
          <motion.div 
            key="result"
            className="tab-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CoverLetterDisplay 
              coverLetter={coverLetter} 
              candidateName={resume?.fullName || resume?.name || 'Candidate'}
              jobTitle={jobDescription.split('\n')[0] || 'Position'}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Mount the popup
const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<Popup />);

export default Popup;
