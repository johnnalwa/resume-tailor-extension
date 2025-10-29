import React from 'react';

/**
 * Privacy Badge Component
 * Emphasizes privacy-first, client-side processing
 */
function PrivacyBadge({ variant = 'full' }) {
  if (variant === 'compact') {
    return (
      <div className="privacy-badge-compact">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
        <span>100% Private</span>
      </div>
    );
  }
  
  return (
    <div className="privacy-badge">
      <div className="privacy-badge-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      </div>
      <div className="privacy-badge-content">
        <h4>🔒 Privacy-First Design</h4>
        <p>All AI processing happens locally in your browser. Your resume and data never leave your device.</p>
        <ul>
          <li>✓ No server uploads</li>
          <li>✓ No data collection</li>
          <li>✓ 100% offline capable</li>
          <li>✓ Open source & auditable</li>
        </ul>
      </div>

      <style jsx>{`
        .privacy-badge {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 8px;
          color: white;
          margin-bottom: 20px;
        }

        .privacy-badge-icon {
          flex-shrink: 0;
        }

        .privacy-badge-icon svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .privacy-badge-content h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .privacy-badge-content p {
          margin: 0 0 12px 0;
          font-size: 13px;
          opacity: 0.95;
          line-height: 1.5;
        }

        .privacy-badge-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .privacy-badge-content li {
          font-size: 12px;
          opacity: 0.9;
        }

        .privacy-badge-compact {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #10b981;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .privacy-badge-compact svg {
          width: 14px;
          height: 14px;
        }
      `}</style>
    </div>
  );
}

export default PrivacyBadge;
