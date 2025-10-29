import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2, FileText, Sparkles } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import ResumeSummary from '../components/ResumeSummary';
import CoverLetterDisplay from '../components/CoverLetterDisplay';
import ToneSelector from '../components/ToneSelector';
import ModelSelector from '../components/ModelSelector';
import { getSettings, saveSettings } from '../utils/storage';
import { generateCoverLetter } from '../utils/aiService';
import './Popup.css';

function Popup() {
  const [activeTab, setActiveTab] = useState('upload');
  const [resume, setResume] = useState(null);
  const [tone, setTone] = useState('professional');
  const [apiKey, setApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash-exp');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await browser.storage.local.get();
      if (settings.resume) setResume(settings.resume);
      if (settings.tone) setTone(settings.tone);
      if (settings.apiKey) setApiKey(settings.apiKey);
      if (settings.geminiModel) setGeminiModel(settings.geminiModel);
      
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
    } catch (err) {
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
        <h1>Resume Tailor</h1>
        <p>Generate tailored cover letters instantly</p>
      </header>

      <nav className="popup-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Setup
        </button>
        <button
          className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
          disabled={!resume}
        >
          Resume
        </button>
        <button
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate
        </button>
        <button
          className={`tab ${activeTab === 'result' ? 'active' : ''}`}
          onClick={() => setActiveTab('result')}
          disabled={!coverLetter}
        >
          Result
        </button>
      </nav>

      <main className="popup-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="tab-content">
            <section className="settings-section">
              <div className="ai-status-banner">
                <div className="ai-status-icon">🤖</div>
                <div className="ai-status-content">
                  <h3>Powered by Chrome Built-in AI (Gemini Nano)</h3>
                  <p>All processing happens locally on your device - 100% private & offline capable</p>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <h2>Upload Resume</h2>
              <ResumeUpload onUpload={handleResumeUpload} currentResume={resume} />
            </section>

            <section className="settings-section">
              <h2>Tone Preference</h2>
              <ToneSelector selectedTone={tone} onToneChange={handleToneChange} />
            </section>

            <section className="settings-section">
              <h2>Advanced Settings (Optional)</h2>
              <div className="api-key-input">
                <label htmlFor="api-key">
                  Gemini API Key 
                  <span className="optional-badge">Optional Fallback</span>
                </label>
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="AIza... (only if Chrome AI unavailable)"
                />
                <small>⚠️ Only used as fallback if Chrome Built-in AI is unavailable. Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>. Your API key is stored locally.</small>
              </div>
              
              {apiKey && (
                <div style={{ marginTop: '16px' }}>
                  <ModelSelector 
                    selectedModel={geminiModel} 
                    onModelChange={handleModelChange} 
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="tab-content">
            <ResumeSummary resumeData={resume} />
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="tab-content">
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
          </div>
        )}

        {activeTab === 'result' && (
          <div className="tab-content">
            <CoverLetterDisplay 
              coverLetter={coverLetter} 
              candidateName={resume?.name || 'Candidate'}
              jobTitle={jobDescription.split('\n')[0] || 'Position'}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Mount the popup
const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<Popup />);

export default Popup;
