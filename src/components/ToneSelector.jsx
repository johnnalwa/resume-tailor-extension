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
  const selectedToneData = tones.find(t => t.id === selectedTone) || tones[0];
  
  return (
    <div className="tone-selector">
      <div className="api-key-input">
        <label htmlFor="tone-select">Writing Tone</label>
        <select
          id="tone-select"
          value={selectedTone}
          onChange={(e) => onToneChange(e.target.value)}
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
          {tones.map((tone) => (
            <option key={tone.id} value={tone.id}>
              {tone.name} - {tone.description}
            </option>
          ))}
        </select>
        <small>
          Selected: <strong>{selectedToneData.name}</strong> - {selectedToneData.description}
        </small>
      </div>
    </div>
  );
}

export default ToneSelector;
