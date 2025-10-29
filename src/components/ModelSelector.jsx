import React from 'react';
import './ModelSelector.css';

const GEMINI_MODELS = [
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Experimental)',
    description: 'Latest model, fastest, best quality',
    recommended: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient, stable'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Most capable, slower'
  }
];

function ModelSelector({ selectedModel, onModelChange }) {
  return (
    <div className="model-selector">
      <label className="model-selector-label">
        Gemini Model
        <span className="info-icon" title="Select which Gemini model to use for generation">ℹ️</span>
      </label>
      
      <div className="model-options">
        {GEMINI_MODELS.map((model) => (
          <div
            key={model.id}
            className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
            onClick={() => onModelChange(model.id)}
          >
            <div className="model-option-header">
              <input
                type="radio"
                name="gemini-model"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={() => onModelChange(model.id)}
              />
              <span className="model-name">
                {model.name}
                {model.recommended && <span className="recommended-badge">Recommended</span>}
              </span>
            </div>
            <p className="model-description">{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
