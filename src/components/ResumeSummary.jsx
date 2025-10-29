import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, FolderGit2 } from 'lucide-react';
import './ResumeSummary.css';

function ResumeSummary({ resumeData }) {
  if (!resumeData) {
    return (
      <div className="resume-summary-empty">
        <p>No resume uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="resume-summary">
      {/* Personal Info Card */}
      <div className="summary-card personal-card">
        <div className="card-header">
          <User size={20} />
          <h3>Personal Information</h3>
        </div>
        <div className="card-content">
          <div className="info-grid">
            {resumeData.fullName && (
              <div className="info-item">
                <User size={16} className="info-icon" />
                <div>
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{resumeData.fullName}</span>
                </div>
              </div>
            )}
            {resumeData.email && (
              <div className="info-item">
                <Mail size={16} className="info-icon" />
                <div>
                  <span className="info-label">Email</span>
                  <span className="info-value">{resumeData.email}</span>
                </div>
              </div>
            )}
            {resumeData.phone && (
              <div className="info-item">
                <Phone size={16} className="info-icon" />
                <div>
                  <span className="info-label">Phone</span>
                  <span className="info-value">{resumeData.phone}</span>
                </div>
              </div>
            )}
            {resumeData.location && (
              <div className="info-item">
                <MapPin size={16} className="info-icon" />
                <div>
                  <span className="info-label">Location</span>
                  <span className="info-value">{resumeData.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {resumeData.summary && (
        <div className="summary-card">
          <div className="card-header">
            <Briefcase size={20} />
            <h3>Professional Summary</h3>
          </div>
          <div className="card-content">
            <p className="summary-text">{resumeData.summary}</p>
          </div>
        </div>
      )}

      {/* Skills Card */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="summary-card">
          <div className="card-header">
            <Code size={20} />
            <h3>Skills</h3>
            <span className="badge">{resumeData.skills.length}</span>
          </div>
          <div className="card-content">
            <div className="skills-grid">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience Card */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="summary-card">
          <div className="card-header">
            <Briefcase size={20} />
            <h3>Work Experience</h3>
            <span className="badge">{resumeData.experience.length}</span>
          </div>
          <div className="card-content">
            <div className="experience-list">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="exp-header">
                    <h4>{exp.title || 'Position'}</h4>
                    <span className="exp-duration">{exp.duration || ''}</span>
                  </div>
                  <p className="exp-company">{exp.company || ''}</p>
                  {exp.description && (
                    <p className="exp-description">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education Card */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="summary-card">
          <div className="card-header">
            <GraduationCap size={20} />
            <h3>Education</h3>
            <span className="badge">{resumeData.education.length}</span>
          </div>
          <div className="card-content">
            <div className="education-list">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree || 'Degree'}</h4>
                  <p className="edu-institution">{edu.institution || ''}</p>
                  {edu.year && <span className="edu-year">{edu.year}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Card */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="summary-card">
          <div className="card-header">
            <FolderGit2 size={20} />
            <h3>Projects</h3>
            <span className="badge">{resumeData.projects.length}</span>
          </div>
          <div className="card-content">
            <div className="projects-list">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <h4>{project.name || 'Project'}</h4>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications Card */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div className="summary-card">
          <div className="card-header">
            <Award size={20} />
            <h3>Certifications</h3>
            <span className="badge">{resumeData.certifications.length}</span>
          </div>
          <div className="card-content">
            <div className="certifications-list">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="cert-item">
                  <Award size={14} />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeSummary;
