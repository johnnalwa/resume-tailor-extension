import React, { useState } from 'react';
import { Edit2, Save, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './ResumeEditor.css';

function ResumeEditor({ resumeData, onSave, onRefine }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [editedData, setEditedData] = useState(resumeData);

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddArrayItem = (field) => {
    setEditedData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
    toast.success(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Save size={18} />
        <span>Resume saved successfully!</span>
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
  };

  const handleRefine = async () => {
    setIsRefining(true);
    const loadingToast = toast.loading(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Loader2 size={18} className="animate-spin" />
        <span>AI is refining your resume...</span>
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
      const refined = await onRefine(editedData);
      setEditedData(refined);
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} />
          <span>Resume refined with AI!</span>
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
    } catch (error) {
      toast.error('Failed to refine resume', { id: loadingToast });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="resume-editor">
      <div className="editor-header">
        <h3>Your Resume</h3>
        <div className="editor-actions">
          <button 
            className="btn-refine" 
            onClick={handleRefine}
            disabled={isRefining}
          >
            <Sparkles size={16} />
            Refine with AI
          </button>
          {isEditing ? (
            <button className="btn-save" onClick={handleSave}>
              <Save size={16} />
              Save
            </button>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="editor-content">
        {/* Personal Info */}
        <section className="editor-section">
          <h4>Personal Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                />
              ) : (
                <p>{editedData.fullName || 'Not provided'}</p>
              )}
            </div>
            <div className="form-field">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              ) : (
                <p>{editedData.email || 'Not provided'}</p>
              )}
            </div>
            <div className="form-field">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
              ) : (
                <p>{editedData.phone || 'Not provided'}</p>
              )}
            </div>
            <div className="form-field">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              ) : (
                <p>{editedData.location || 'Not provided'}</p>
              )}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="editor-section">
          <h4>Professional Summary</h4>
          {isEditing ? (
            <textarea
              rows="4"
              value={editedData.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              placeholder="Write a brief professional summary..."
            />
          ) : (
            <p>{editedData.summary || 'Not provided'}</p>
          )}
        </section>

        {/* Skills */}
        <section className="editor-section">
          <h4>Skills</h4>
          {isEditing ? (
            <div className="skills-editor">
              {(editedData.skills || []).map((skill, index) => (
                <div key={index} className="skill-item">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                  />
                  <button onClick={() => handleRemoveArrayItem('skills', index)}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => handleAddArrayItem('skills')}>
                + Add Skill
              </button>
            </div>
          ) : (
            <div className="skills-display">
              {(editedData.skills || []).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
              {(!editedData.skills || editedData.skills.length === 0) && <p>No skills listed</p>}
            </div>
          )}
        </section>

        {/* Raw Text (always visible for reference) */}
        <section className="editor-section">
          <h4>Raw Resume Text</h4>
          {isEditing ? (
            <textarea
              rows="10"
              value={editedData.rawText || ''}
              onChange={(e) => handleFieldChange('rawText', e.target.value)}
              placeholder="Paste your resume text here..."
            />
          ) : (
            <pre className="raw-text">{editedData.rawText || 'No text available'}</pre>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResumeEditor;
