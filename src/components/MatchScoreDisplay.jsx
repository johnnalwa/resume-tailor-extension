import React from 'react';

/**
 * Match Score Display Component
 * Shows detailed match analytics with recommendations
 */
function MatchScoreDisplay({ matchData }) {
  if (!matchData) return null;

  const { overallScore, breakdown, matchedSkills, missingSkills, recommendations } = matchData;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="match-score-display">
      {/* Overall Score */}
      <div className="score-header">
        <div className="score-circle" style={{ borderColor: getScoreColor(overallScore) }}>
          <div className="score-value">{overallScore}</div>
          <div className="score-max">/100</div>
        </div>
        <div className="score-info">
          <h3>{getScoreLabel(overallScore)}</h3>
          <p>Your resume matches {overallScore}% of the job requirements</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="score-breakdown">
        <h4>Score Breakdown</h4>
        {Object.entries(breakdown).map(([key, data]) => (
          <div key={key} className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="breakdown-score">{data.score}%</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ 
                  width: `${data.score}%`,
                  background: getScoreColor(data.score)
                }}
              />
            </div>
            <span className="breakdown-weight">Weight: {data.weight}</span>
          </div>
        ))}
      </div>

      {/* Matched Skills */}
      {matchedSkills && matchedSkills.length > 0 && (
        <div className="skills-section">
          <h4>✓ Matched Skills ({matchedSkills.length})</h4>
          <div className="skills-tags">
            {matchedSkills.slice(0, 10).map((skill, index) => (
              <span key={index} className="skill-tag matched">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills && missingSkills.length > 0 && (
        <div className="skills-section">
          <h4>⚠ Missing Skills ({missingSkills.length})</h4>
          <div className="skills-tags">
            {missingSkills.slice(0, 10).map((skill, index) => (
              <span key={index} className="skill-tag missing">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="recommendations-section">
          <h4>💡 Recommendations</h4>
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation ${rec.priority}`}>
              <div className="rec-header">
                <span className="rec-type">{rec.type}</span>
                <span className={`rec-priority priority-${rec.priority}`}>{rec.priority}</span>
              </div>
              <p className="rec-message">{rec.message}</p>
              <p className="rec-action">{rec.action}</p>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .match-score-display {
          background: white;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .score-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f3f4f6;
        }

        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 6px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
        }

        .score-max {
          font-size: 14px;
          color: #6b7280;
        }

        .score-info h3 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .score-info p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .score-breakdown {
          margin-bottom: 24px;
        }

        .score-breakdown h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .breakdown-item {
          margin-bottom: 16px;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .breakdown-label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .breakdown-score {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        .breakdown-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .breakdown-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .breakdown-weight {
          font-size: 11px;
          color: #9ca3af;
        }

        .skills-section {
          margin-bottom: 24px;
        }

        .skills-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .skill-tag.matched {
          background: #d1fae5;
          color: #065f46;
        }

        .skill-tag.missing {
          background: #fee2e2;
          color: #991b1b;
        }

        .recommendations-section h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .recommendation {
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 12px;
          border-left: 3px solid;
        }

        .recommendation.high {
          background: #fef3c7;
          border-color: #f59e0b;
        }

        .recommendation.medium {
          background: #dbeafe;
          border-color: #3b82f6;
        }

        .recommendation.low {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .rec-type {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }

        .rec-priority {
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-high {
          background: #dc2626;
          color: white;
        }

        .priority-medium {
          background: #2563eb;
          color: white;
        }

        .priority-low {
          background: #6b7280;
          color: white;
        }

        .rec-message {
          margin: 0 0 6px 0;
          font-size: 13px;
          font-weight: 500;
          color: #1f2937;
        }

        .rec-action {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default MatchScoreDisplay;
