import React from 'react';

const tones = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-appropriate',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    id: 'enthusiastic',
    name: 'Enthusiastic',
    description: 'Energetic and passionate',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    )
  },
  {
    id: 'confident',
    name: 'Confident',
    description: 'Assertive and self-assured',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    )
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and approachable',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Innovative and expressive',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
      </svg>
    )
  },
  {
    id: 'concise',
    name: 'Concise',
    description: 'Brief and to the point',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="21" y1="10" x2="3" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="21" y1="18" x2="3" y2="18"></line>
      </svg>
    )
  }
];

function ToneSelector({ selectedTone, onToneChange }) {
  return (
    <div className="tone-selector">
      <div className="tone-grid">
        {tones.map((tone) => (
          <button
            key={tone.id}
            className={`tone-option ${selectedTone === tone.id ? 'selected' : ''}`}
            onClick={() => onToneChange(tone.id)}
          >
            <div className="tone-icon">{tone.icon}</div>
            <div className="tone-info">
              <div className="tone-name">{tone.name}</div>
              <div className="tone-description">{tone.description}</div>
            </div>
            {selectedTone === tone.id && (
              <div className="selected-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        .tone-selector {
          width: 100%;
        }

        .tone-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .tone-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          position: relative;
        }

        .tone-option:hover {
          border-color: #667eea;
          background: #f9fafb;
          transform: translateX(2px);
        }

        .tone-option.selected {
          border-color: #667eea;
          background: #f3f4ff;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .tone-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tone-option.selected .tone-icon {
          background: #667eea;
          color: white;
        }

        .tone-info {
          flex: 1;
          min-width: 0;
        }

        .tone-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .tone-description {
          font-size: 12px;
          color: #6b7280;
        }

        .selected-indicator {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #667eea;
          border-radius: 50%;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default ToneSelector;
