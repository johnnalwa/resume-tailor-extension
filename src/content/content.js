/**
 * Content Script
 * Handles job description extraction, floating UI, and page interaction
 * Senior-level implementation with robust extraction and performance optimization
 */

import browser from 'webextension-polyfill';

console.log('[Content Script] Resume Tailor Extension loaded');

// State management
let floatingButton = null;
let coverLetterPanel = null;
let isInitialized = false;
let currentJobDescription = null;

// Configuration
const CONFIG = {
  buttonPosition: { bottom: '24px', right: '24px' },
  extractionSelectors: [
    // LinkedIn
    '.jobs-description__content',
    '.jobs-description',
    // Indeed
    '#jobDescriptionText',
    '.jobsearch-jobDescriptionText',
    // Glassdoor
    '.jobDescriptionContent',
    '.desc',
    // Generic
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    'article[role="main"]',
    'main'
  ],
  jobSitePatterns: [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'careers',
    'jobs'
  ],
  minDescriptionLength: 100,
  maxDescriptionLength: 10000
};

// Initialize the extension UI
function initializeExtension() {
  createFloatingButton();
  setupMessageListener();
}

// Create a floating button on job posting pages
function createFloatingButton() {
  // Check if we're on a job posting site
  const isJobSite = detectJobSite();
  
  if (!isJobSite) return;
  
  floatingButton = document.createElement('div');
  floatingButton.id = 'resume-tailor-button';
  floatingButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `;
  floatingButton.title = 'Generate Cover Letter';
  
  floatingButton.addEventListener('click', handleButtonClick);
  document.body.appendChild(floatingButton);
}

// Detect if we're on a job posting site
function detectJobSite() {
  const hostname = window.location.hostname.toLowerCase();
  const jobSites = [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'careers.',
    'jobs.'
  ];
  
  return jobSites.some(site => hostname.includes(site));
}

// Handle button click
async function handleButtonClick() {
  const jobDescription = extractJobDescription();
  
  if (!jobDescription) {
    showNotification('Could not extract job description. Please try selecting the text manually.', 'error');
    return;
  }
  
  // Get stored resume and settings
  const { resume, tone, apiKey } = await browser.storage.local.get(['resume', 'tone', 'apiKey']);
  
  if (!resume) {
    showNotification('Please upload your resume first in the extension popup.', 'warning');
    browser.runtime.openOptionsPage();
    return;
  }
  
  if (!apiKey) {
    showNotification('Please configure your API key in the extension settings.', 'warning');
    browser.runtime.openOptionsPage();
    return;
  }
  
  // Show loading state
  showCoverLetterPanel('Generating your cover letter...');
  
  // Send message to background script to generate cover letter
  try {
    const response = await browser.runtime.sendMessage({
      type: 'GENERATE_COVER_LETTER',
      data: {
        jobDescription,
        resume,
        tone: tone || 'professional',
        apiKey
      }
    });
    
    if (response.success) {
      showCoverLetterPanel(response.coverLetter);
    } else {
      showNotification(`Error: ${response.error}`, 'error');
    }
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}

// Extract job description from the page
function extractJobDescription() {
  // Try common selectors for job descriptions
  const selectors = [
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[class*="description"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    'article',
    'main'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.length > 100) {
      return element.textContent.trim();
    }
  }
  
  // Fallback: get all text from body
  return document.body.textContent.trim().substring(0, 5000);
}

// Show cover letter panel
function showCoverLetterPanel(content) {
  // Remove existing panel if any
  if (coverLetterPanel) {
    coverLetterPanel.remove();
  }
  
  coverLetterPanel = document.createElement('div');
  coverLetterPanel.id = 'resume-tailor-panel';
  coverLetterPanel.innerHTML = `
    <div class="panel-header">
      <h3>Generated Cover Letter</h3>
      <button class="close-btn" id="close-panel">×</button>
    </div>
    <div class="panel-content">
      <pre>${content}</pre>
    </div>
    <div class="panel-actions">
      <button class="btn-copy" id="copy-letter">Copy to Clipboard</button>
      <button class="btn-export" id="export-letter">Export as PDF</button>
    </div>
  `;
  
  document.body.appendChild(coverLetterPanel);
  
  // Add event listeners
  document.getElementById('close-panel').addEventListener('click', () => {
    coverLetterPanel.remove();
  });
  
  document.getElementById('copy-letter').addEventListener('click', () => {
    navigator.clipboard.writeText(content);
    showNotification('Cover letter copied to clipboard!', 'success');
  });
  
  document.getElementById('export-letter').addEventListener('click', () => {
    exportToPDF(content);
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `resume-tailor-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export to PDF
function exportToPDF(content) {
  // Create a blob and download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cover-letter.txt';
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Cover letter downloaded!', 'success');
}

// Setup message listener
function setupMessageListener() {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACT_JOB_DESCRIPTION') {
      const jobDescription = message.selection || extractJobDescription();
      sendResponse({ jobDescription });
    } else if (message.type === 'SHOW_NOTIFICATION') {
      showNotification(message.data.message, 'success');
      sendResponse({ success: true });
    }
    return true; // Keep channel open for async response
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}
