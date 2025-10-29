import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { exportToPDF, exportToWord, exportToText, copyToClipboard } from '../utils/exportUtils';

function CoverLetterDisplay({ coverLetter, candidateName, jobTitle }) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    const result = await copyToClipboard(coverLetter);
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('📋 Copied to clipboard!', {
        style: {
          background: '#0c4a6e',
          color: '#fff',
          border: '2px solid #eab308',
        }
      });
    } else {
      toast.error('Failed to copy to clipboard', {
        style: { background: '#dc2626', color: '#fff' }
      });
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    const loadingToast = toast.loading('📄 Generating PDF...');
    
    try {
      const result = await exportToPDF(coverLetter, candidateName, jobTitle);
      if (result.success) {
        toast.success(`✅ PDF downloaded: ${result.filename}`, {
          id: loadingToast,
          duration: 4000,
          style: {
            background: '#0c4a6e',
            color: '#fff',
            border: '2px solid #eab308',
          }
        });
      } else {
        toast.error(`Failed to export PDF: ${result.error}`, {
          id: loadingToast,
          style: { background: '#dc2626', color: '#fff' }
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export PDF', {
        id: loadingToast,
        style: { background: '#dc2626', color: '#fff' }
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportWord = async () => {
    setExporting(true);
    const loadingToast = toast.loading('📝 Generating Word document...');
    
    try {
      const result = await exportToWord(coverLetter, candidateName, jobTitle);
      if (result.success) {
        toast.success(`✅ Word document downloaded: ${result.filename}`, {
          id: loadingToast,
          duration: 4000,
          style: {
            background: '#0c4a6e',
            color: '#fff',
            border: '2px solid #eab308',
          }
        });
      } else {
        toast.error(`Failed to export Word: ${result.error}`, {
          id: loadingToast,
          style: { background: '#dc2626', color: '#fff' }
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export Word document', {
        id: loadingToast,
        style: { background: '#dc2626', color: '#fff' }
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportText = async () => {
    setExporting(true);
    const loadingToast = toast.loading('📄 Generating text file...');
    
    try {
      const result = exportToText(coverLetter, candidateName, jobTitle);
      if (result.success) {
        toast.success(`✅ Text file downloaded: ${result.filename}`, {
          id: loadingToast,
          duration: 4000,
          style: {
            background: '#0c4a6e',
            color: '#fff',
            border: '2px solid #eab308',
          }
        });
      } else {
        toast.error(`Failed to export text: ${result.error}`, {
          id: loadingToast,
          style: { background: '#dc2626', color: '#fff' }
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export text file', {
        id: loadingToast,
        style: { background: '#dc2626', color: '#fff' }
      });
    } finally {
      setExporting(false);
    }
  };

  if (!coverLetter) {
    return (
      <div className="cover-letter-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>No cover letter generated yet</p>
        <small>Generate a cover letter to see it here</small>
      </div>
    );
  }

  return (
    <div className="cover-letter-display">
      <div className="cover-letter-content">
        <pre>{coverLetter}</pre>
      </div>

      <div className="cover-letter-actions">
        <button
          className="action-btn copy-btn"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          className="action-btn export-btn"
          onClick={handleExportPDF}
          disabled={exporting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>

        <button
          className="action-btn export-btn"
          onClick={handleExportWord}
          disabled={exporting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          {exporting ? 'Exporting...' : 'Export Word'}
        </button>

        <button
          className="action-btn export-btn"
          onClick={handleExportText}
          disabled={exporting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          {exporting ? 'Exporting...' : 'Export Text'}
        </button>
      </div>

      <style jsx>{`
        .cover-letter-display {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cover-letter-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        }

        .cover-letter-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: #1f2937;
          margin: 0;
        }

        .cover-letter-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn {
          background: #667eea;
          color: white;
        }

        .copy-btn:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .copy-btn:disabled {
          background: #10b981;
          cursor: default;
        }

        .export-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .export-btn:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #d1d5db;
          transform: translateY(-1px);
        }

        .export-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cover-letter-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
          color: #9ca3af;
        }

        .cover-letter-empty svg {
          margin-bottom: 16px;
        }

        .cover-letter-empty p {
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .cover-letter-empty small {
          font-size: 12px;
        }

        .cover-letter-content::-webkit-scrollbar {
          width: 6px;
        }

        .cover-letter-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .cover-letter-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .cover-letter-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default CoverLetterDisplay;
