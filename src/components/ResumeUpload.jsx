import React, { useState, useRef } from 'react';

function ResumeUpload({ onUpload, currentResume }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      alert('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      alert('File size must be less than 5MB');
      return;
    }

    setUploadStatus('uploading');

    try {
      const text = await readFileAsText(file);
      const resumeData = {
        name: file.name,
        content: text,
        uploadedAt: new Date().toISOString()
      };

      onUpload(resumeData);
      setUploadStatus('success');
      
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error reading file:', error);
      setUploadStatus('error');
      alert('Failed to read file. Please try again.');
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        reject(e);
      };
      
      reader.readAsText(file);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="resume-upload">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${uploadStatus}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploadStatus === 'uploading' && (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>Uploading...</p>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="upload-status success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Resume uploaded successfully!</p>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="upload-status error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p>Upload failed. Please try again.</p>
          </div>
        )}
        
        {!uploadStatus && !currentResume && (
          <div className="upload-prompt">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="prompt-title">Drop your resume here</p>
            <p className="prompt-subtitle">or click to browse</p>
            <p className="prompt-formats">PDF, DOC, DOCX, TXT (max 5MB)</p>
          </div>
        )}
        
        {!uploadStatus && currentResume && (
          <div className="upload-current">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p className="current-file-name">{currentResume.name}</p>
            <p className="current-file-date">
              Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
            </p>
            <p className="prompt-subtitle">Click to upload a new resume</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .resume-upload {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 32px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #f9fafb;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f3f4ff;
        }

        .upload-area.dragging {
          border-color: #667eea;
          background: #e0e7ff;
          transform: scale(1.02);
        }

        .upload-area.uploading,
        .upload-area.success,
        .upload-area.error {
          cursor: default;
        }

        .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
        }

        .upload-status.success {
          color: #10b981;
        }

        .upload-status.error {
          color: #ef4444;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .upload-prompt,
        .upload-current {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
        }

        .upload-prompt svg,
        .upload-current svg {
          color: #9ca3af;
        }

        .prompt-title,
        .current-file-name {
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          margin-top: 4px;
        }

        .prompt-subtitle {
          font-size: 13px;
          color: #6b7280;
        }

        .prompt-formats {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .current-file-date {
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default ResumeUpload;
