import React, { useState } from 'react';

/**
 * Multiple Drafts Component
 * Displays and manages multiple cover letter variations
 */
function MultipleDrafts({ drafts, onSelectDraft }) {
  const [selectedId, setSelectedId] = useState(drafts[0]?.id);

  const handleSelect = (draft) => {
    setSelectedId(draft.id);
    if (onSelectDraft) {
      onSelectDraft(draft);
    }
  };

  if (!drafts || drafts.length === 0) {
    return null;
  }

  const selectedDraft = drafts.find(d => d.id === selectedId) || drafts[0];

  return (
    <div className="multiple-drafts">
      <div className="drafts-header">
        <h3>📝 Multiple Variations</h3>
        <p>Choose the style that best fits your needs</p>
      </div>

      <div className="drafts-tabs">
        {drafts.map((draft) => (
          <button
            key={draft.id}
            className={`draft-tab ${selectedId === draft.id ? 'active' : ''}`}
            onClick={() => handleSelect(draft)}
          >
            <span className="draft-label">{draft.label}</span>
            <span className="draft-temp">T={draft.temperature}</span>
          </button>
        ))}
      </div>

      <div className="draft-content">
        <div className="draft-meta">
          <span className="draft-badge">{selectedDraft.label}</span>
          <span className="draft-description">
            {selectedDraft.label === 'Conservative' && 'Formal and traditional approach'}
            {selectedDraft.label === 'Balanced' && 'Perfect mix of professionalism and personality'}
            {selectedDraft.label === 'Creative' && 'Unique and expressive style'}
          </span>
        </div>
        <pre className="draft-text">{selectedDraft.content}</pre>
      </div>

      <style jsx>{`
        .multiple-drafts {
          width: 100%;
        }

        .drafts-header {
          margin-bottom: 16px;
        }

        .drafts-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .drafts-header p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .drafts-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .draft-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          bottom: -2px;
        }

        .draft-tab:hover {
          background: #f9fafb;
        }

        .draft-tab.active {
          border-bottom-color: #667eea;
          background: #f3f4ff;
        }

        .draft-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .draft-tab.active .draft-label {
          color: #667eea;
        }

        .draft-temp {
          font-size: 11px;
          color: #9ca3af;
          font-family: monospace;
        }

        .draft-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .draft-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .draft-badge {
          padding: 4px 12px;
          background: #667eea;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .draft-description {
          font-size: 12px;
          color: #6b7280;
        }

        .draft-text {
          padding: 20px;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: #1f2937;
          margin: 0;
          max-height: 400px;
          overflow-y: auto;
        }

        .draft-text::-webkit-scrollbar {
          width: 6px;
        }

        .draft-text::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .draft-text::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default MultipleDrafts;
