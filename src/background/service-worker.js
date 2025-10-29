/**
 * Background Service Worker
 * Handles message routing, AI operations, and extension lifecycle
 * Senior-level implementation with proper error handling and optimization
 */

import browser from 'webextension-polyfill';

// Constants
const MESSAGE_TYPES = {
  GENERATE_COVER_LETTER: 'GENERATE_COVER_LETTER',
  GENERATE_STREAMING: 'GENERATE_STREAMING',
  GENERATE_MULTIPLE_DRAFTS: 'GENERATE_MULTIPLE_DRAFTS',
  PROOFREAD_TEXT: 'PROOFREAD_TEXT',
  SUMMARIZE_JOB: 'SUMMARIZE_JOB',
  REWRITE_TEXT: 'REWRITE_TEXT',
  WRITE_TEXT: 'WRITE_TEXT',
  TRANSLATE_TEXT: 'TRANSLATE_TEXT',
  CHECK_AI_AVAILABILITY: 'CHECK_AI_AVAILABILITY',
  SAVE_SETTINGS: 'SAVE_SETTINGS',
  GET_SETTINGS: 'GET_SETTINGS',
  EXTRACT_JOB_DESCRIPTION: 'EXTRACT_JOB_DESCRIPTION',
  CALCULATE_MATCH_SCORE: 'CALCULATE_MATCH_SCORE'
};

const DEFAULT_SETTINGS = {
  tone: 'professional',
  resume: null,
  userProfile: {
    name: '',
    skills: [],
    experience: []
  },
  useBuiltInAI: true,
  apiKey: null
};

const CONTEXT_MENU_ID = 'generate-cover-letter';

// State management
let aiAvailability = null;

/**
 * Extension lifecycle - Installation
 */
browser.runtime.onInstalled.addListener(async (details) => {
  console.log('[Service Worker] Extension installed:', details.reason);
  
  try {
    if (details.reason === 'install') {
      await initializeExtension();
    } else if (details.reason === 'update') {
      await handleExtensionUpdate(details.previousVersion);
    }
  } catch (error) {
    console.error('[Service Worker] Installation error:', error);
  }
});

/**
 * Initialize extension on first install
 */
async function initializeExtension() {
  try {
    // Set default settings
    await browser.storage.local.set(DEFAULT_SETTINGS);
    
    // Create context menu
    await createContextMenu();
    
    // Check AI availability
    aiAvailability = await checkAICapabilities();
    
    console.log('[Service Worker] Extension initialized successfully');
  } catch (error) {
    console.error('[Service Worker] Initialization failed:', error);
    throw error;
  }
}

/**
 * Handle extension updates
 */
async function handleExtensionUpdate(previousVersion) {
  console.log(`[Service Worker] Updated from version ${previousVersion}`);
  
  try {
    // Migrate settings if needed
    const settings = await browser.storage.local.get();
    const updatedSettings = { ...DEFAULT_SETTINGS, ...settings };
    await browser.storage.local.set(updatedSettings);
    
    // Recreate context menu
    await createContextMenu();
  } catch (error) {
    console.error('[Service Worker] Update handling failed:', error);
  }
}

/**
 * Create context menu for text selection
 */
async function createContextMenu() {
  try {
    // Remove existing menu items
    await browser.contextMenus.removeAll();
    
    // Create new menu item
    await browser.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Generate Cover Letter from Selection',
      contexts: ['selection']
    });
  } catch (error) {
    console.error('[Service Worker] Context menu creation failed:', error);
  }
}

/**
 * Context menu click handler
 */
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    try {
      // Store the selected text temporarily
      await browser.storage.local.set({
        pendingJobDescription: info.selectionText,
        pendingJobDescriptionTimestamp: Date.now()
      });
      
      // Open extension popup in a new window (workaround for MV3)
      // This provides better UX than just showing a notification
      const popupUrl = browser.runtime.getURL('popup.html');
      
      // Try to open in a small popup window
      await browser.windows.create({
        url: popupUrl,
        type: 'popup',
        width: 420,
        height: 600,
        focused: true
      });
      
      // Also show notification on the page as backup
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      } catch (e) {
        // Content script might already be injected
      }
      
      await browser.tabs.sendMessage(tab.id, {
        type: 'SHOW_NOTIFICATION',
        data: { 
          message: '✅ Job description captured! Opening extension...',
          duration: 2000
        }
      });
      
    } catch (error) {
      console.error('[Service Worker] Context menu action failed:', error);
      
      // Fallback: just store the text and show notification
      await browser.storage.local.set({
        pendingJobDescription: info.selectionText,
        pendingJobDescriptionTimestamp: Date.now()
      });
      
      // Try to at least show notification
      try {
        await browser.tabs.sendMessage(tab.id, {
          type: 'SHOW_NOTIFICATION',
          data: { 
            message: '✅ Job description captured! Click the extension icon.',
            duration: 5000
          }
        });
      } catch (e) {
        console.error('[Service Worker] Could not show notification:', e);
      }
    }
  }
});

/**
 * Message handler with proper routing and error handling
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Validate message structure
  if (!message || !message.type) {
    sendResponse({ success: false, error: 'Invalid message format' });
    return false;
  }
  
  console.log('[Service Worker] Message received:', message.type);
  
  // Route message to appropriate handler
  const handler = getMessageHandler(message.type);
  
  if (!handler) {
    sendResponse({ success: false, error: `Unknown message type: ${message.type}` });
    return false;
  }
  
  // Execute handler asynchronously
  handler(message.data, sender)
    .then(result => sendResponse({ success: true, ...result }))
    .catch(error => {
      console.error(`[Service Worker] Handler error for ${message.type}:`, error);
      sendResponse({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      });
    });
  
  return true; // Keep message channel open for async response
});

/**
 * Get message handler function
 */
function getMessageHandler(messageType) {
  const handlers = {
    [MESSAGE_TYPES.GENERATE_COVER_LETTER]: handleGenerateCoverLetter,
    [MESSAGE_TYPES.GENERATE_STREAMING]: handleStreamingGeneration,
    [MESSAGE_TYPES.GENERATE_MULTIPLE_DRAFTS]: handleGenerateMultipleDrafts,
    [MESSAGE_TYPES.PROOFREAD_TEXT]: handleProofread,
    [MESSAGE_TYPES.SUMMARIZE_JOB]: handleSummarize,
    [MESSAGE_TYPES.REWRITE_TEXT]: handleRewrite,
    [MESSAGE_TYPES.WRITE_TEXT]: handleWrite,
    [MESSAGE_TYPES.TRANSLATE_TEXT]: handleTranslate,
    [MESSAGE_TYPES.CHECK_AI_AVAILABILITY]: handleCheckAI,
    [MESSAGE_TYPES.SAVE_SETTINGS]: handleSaveSettings,
    [MESSAGE_TYPES.GET_SETTINGS]: handleGetSettings,
    [MESSAGE_TYPES.CALCULATE_MATCH_SCORE]: handleCalculateMatchScore
  };
  
  return handlers[messageType];
}

/**
 * Handle cover letter generation
 */
async function handleGenerateCoverLetter(data) {
  const { jobDescription, resume, tone, useBuiltInAI, apiKey, userProfile, geminiModel } = data;
  
  // Validate required data
  if (!jobDescription || !resume) {
    throw new Error('Job description and resume are required');
  }
  
  try {
    let coverLetter;
    
    // Try Chrome Built-in AI first
    if (useBuiltInAI !== false) {
      try {
        coverLetter = await generateWithBuiltInAI({
          jobDescription,
          resume,
          tone: tone || 'professional',
          userProfile
        });
      } catch (builtInError) {
        console.warn('[Service Worker] Built-in AI failed, trying fallback:', builtInError.message);
        
        // Fallback to Gemini API if available
        if (apiKey) {
          coverLetter = await generateWithGemini({
            jobDescription,
            resume,
            tone: tone || 'professional',
            apiKey,
            model: geminiModel
          });
        } else {
          throw new Error('Built-in AI unavailable: ' + builtInError.message + '. Please add a Gemini API key in settings for fallback.');
        }
      }
    } else if (apiKey) {
      // Use Gemini API directly
      coverLetter = await generateWithGemini({
        jobDescription,
        resume,
        tone: tone || 'professional',
        apiKey,
        model: geminiModel
      });
    } else {
      throw new Error('No AI service available. Please enable Chrome Built-in AI or add a Gemini API key in settings.');
    }
    
    // Save to history
    await saveCoverLetterToHistory({
      content: coverLetter,
      jobDescription: jobDescription.substring(0, 200),
      tone,
      timestamp: Date.now()
    });
    
    return { coverLetter };
  } catch (error) {
    console.error('[Service Worker] Generation failed:', error);
    throw error;
  }
}

/**
 * Generate cover letter using Chrome Built-in AI
 */
async function generateWithBuiltInAI({ jobDescription, resume, tone, userProfile }) {
  try {
    // Ensure offscreen document exists
    await ensureOffscreenDocument();
    
    // Send message to offscreen document
    const response = await browser.runtime.sendMessage({
      type: 'OFFSCREEN_GENERATE_COVER_LETTER',
      data: { jobDescription, resume, tone, userProfile }
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate cover letter');
    }
    
    return response.coverLetter;
  } catch (error) {
    console.error('[Service Worker] Built-in AI generation failed:', error);
    throw new Error(`Built-in AI unavailable: ${error.message}. Please add a Gemini API key in settings for fallback.`);
  }
}

/**
 * Generate cover letter using Gemini API (fallback)
 */
async function generateWithGemini({ jobDescription, resume, tone, apiKey, model }) {
  const toneInstructions = {
    professional: 'Write in a formal, business-appropriate tone.',
    enthusiastic: 'Write with energy and passion.',
    confident: 'Write assertively and self-assuredly.',
    friendly: 'Write in a warm, approachable tone.',
    creative: 'Write with an innovative and expressive style.',
    concise: 'Write briefly and to the point.'
  };
  
  const instruction = toneInstructions[tone] || toneInstructions.professional;
  
  const prompt = `You are a professional cover letter writer. ${instruction}

STEP 1: ANALYZE THE RESUME
First, carefully read this resume and extract:
- Full name of the candidate
- Years of experience (specific number)
- Technical skills (list all programming languages, tools, frameworks mentioned)
- Specific projects or achievements (with details)
- Education and certifications
- Current or previous job titles

RESUME:
${resume}

STEP 2: ANALYZE THE JOB DESCRIPTION
Now read this job description and identify:
- Company name
- Position title
- Required skills (technical and soft skills)
- Years of experience required
- Key responsibilities
- Required education/certifications

JOB DESCRIPTION:
${jobDescription}

STEP 3: WRITE THE COVER LETTER
Now write a cover letter that:

CRITICAL RULES:
1. Use the EXACT NAME you found in the resume (not "Johnney K" if the full name is "Johnney Kamau" - use the complete name)
2. Mention SPECIFIC technologies from the resume (e.g., "In my 7 years of experience, I have worked extensively with Java Spring Boot, Python Django, and C# .NET...")
3. Reference ACTUAL projects or achievements from the resume (e.g., "At [Company], I developed a system that...")
4. Match SPECIFIC skills from resume to SPECIFIC requirements in job description
5. Use CONCRETE numbers and facts (e.g., "5 years", "10+ projects", "team of 5 developers")
6. NO generic phrases like "solid foundation" or "comprehensive overview"
7. NO placeholders - every detail must come from the resume or job description
8. Write in ${tone} tone
9. Keep it 300-400 words
10. Make every sentence specific and backed by resume evidence

EXAMPLE OF GOOD SPECIFICITY:
❌ BAD: "I have experience in software development"
✅ GOOD: "Over my 6 years at TechCorp, I developed 15+ enterprise applications using Java, Python, and C#, including a payment processing system that handles 10,000 transactions daily"

Now write the cover letter following these rules:`;

  // Use selected model or default to gemini-2.0-flash-exp
  const selectedModel = model || 'gemini-2.0-flash-exp';
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API request failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }
  
  return result.candidates[0].content.parts[0].text;
}

/**
 * Generate cover letter using OpenAI API (legacy fallback)
 */
async function generateWithOpenAI({ jobDescription, resume, tone, apiKey }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(tone)
        },
        {
          role: 'user',
          content: buildUserPrompt({ jobDescription, resume, tone })
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.choices[0].message.content;
}

/**
 * Handle streaming generation (for future implementation)
 */
async function handleStreamingGeneration(data) {
  throw new Error('Streaming generation not yet implemented');
}

/**
 * Handle proofreading
 */
async function handleProofread(data) {
  const { text } = data;
  
  if (!text) {
    throw new Error('Text is required for proofreading');
  }
  
  // Proofreading would need page context for Built-in AI
  return { correctedText: text, suggestions: [] };
}

/**
 * Handle job description summarization
 */
async function handleSummarize(data) {
  const { jobDescription } = data;
  
  if (!jobDescription) {
    throw new Error('Job description is required');
  }
  
  // Summarization would need page context for Built-in AI
  // For now, return a simple truncation
  const summary = jobDescription.substring(0, 500) + '...';
  return { summary };
}

/**
 * Check AI availability
 */
async function handleCheckAI() {
  if (!aiAvailability) {
    aiAvailability = await checkAICapabilities();
  }
  return { availability: aiAvailability };
}

/**
 * Check AI capabilities
 */
async function checkAICapabilities() {
  // Service worker doesn't have access to window.ai
  // Return default availability
  return {
    prompt: false,
    summarizer: false,
    proofreader: false,
    needsPageContext: true
  };
}

/**
 * Handle settings save
 */
async function handleSaveSettings(data) {
  await browser.storage.local.set(data);
  return { saved: true };
}

/**
 * Handle settings retrieval
 */
async function handleGetSettings() {
  const settings = await browser.storage.local.get();
  return { settings: { ...DEFAULT_SETTINGS, ...settings } };
}

/**
 * Calculate match score between resume and job
 */
async function handleCalculateMatchScore(data) {
  const { resume, jobDescription } = data;
  
  if (!resume || !jobDescription) {
    throw new Error('Resume and job description are required');
  }
  
  // Simple keyword matching for MVP
  const score = calculateSimpleMatchScore(resume, jobDescription);
  return { score };
}

/**
 * Simple match score calculation
 */
function calculateSimpleMatchScore(resume, jobDescription) {
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  const keywords = extractKeywords(jobLower);
  let matches = 0;
  
  keywords.forEach(keyword => {
    if (resumeLower.includes(keyword)) {
      matches++;
    }
  });
  
  return Math.min(Math.round((matches / keywords.length) * 100), 100);
}

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'typescript',
    'leadership', 'communication', 'problem solving'
  ];
  
  return commonSkills.filter(skill => text.includes(skill));
}

/**
 * Save cover letter to history
 */
async function saveCoverLetterToHistory(coverLetter) {
  try {
    const { coverLetters = [] } = await browser.storage.local.get('coverLetters');
    
    const newEntry = {
      id: Date.now().toString(),
      ...coverLetter
    };
    
    coverLetters.unshift(newEntry);
    
    // Keep only last 20
    const trimmed = coverLetters.slice(0, 20);
    
    await browser.storage.local.set({ coverLetters: trimmed });
  } catch (error) {
    console.error('[Service Worker] Failed to save to history:', error);
  }
}

/**
 * Build system prompt
 */
function buildSystemPrompt(tone) {
  const toneMap = {
    professional: 'formal and business-appropriate',
    enthusiastic: 'energetic and passionate',
    confident: 'assertive and self-assured',
    friendly: 'warm and approachable',
    creative: 'innovative and expressive',
    concise: 'brief and to the point'
  };
  
  return `You are a professional cover letter writer. Write in a ${toneMap[tone] || toneMap.professional} tone. Create a compelling cover letter that highlights relevant qualifications and demonstrates fit for the position. Keep it between 250-400 words.`;
}

/**
 * Build user prompt
 */
function buildUserPrompt({ jobDescription, resume, tone }) {
  return `Generate a ${tone} cover letter for this job opportunity.\n\nJob Description:\n${jobDescription}\n\nCandidate Resume:\n${resume}\n\nWrite a tailored cover letter that matches the candidate's qualifications to the job requirements.`;
}

/**
 * Ensure offscreen document exists for AI processing
 */
async function ensureOffscreenDocument() {
  // Check if offscreen document already exists
  const existingContexts = await browser.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });
  
  if (existingContexts.length > 0) {
    return; // Already exists
  }
  
  // Create offscreen document
  try {
    await browser.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['LOCAL_STORAGE'], // Using for AI processing
      justification: 'Required for Chrome Built-in AI APIs which need page context'
    });
    
    console.log('[Service Worker] Offscreen document created');
  } catch (error) {
    console.error('[Service Worker] Failed to create offscreen document:', error);
    throw error;
  }
}

/**
 * Generate multiple draft variations
 */
async function handleGenerateMultipleDrafts(data) {
  try {
    await ensureOffscreenDocument();
    
    const response = await browser.runtime.sendMessage({
      type: 'OFFSCREEN_GENERATE_MULTIPLE',
      data
    });
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return { drafts: response.drafts };
  } catch (error) {
    console.error('[Service Worker] Multiple drafts generation failed:', error);
    throw error;
  }
}

/**
 * Handle rewrite request
 */
async function handleRewrite(data) {
  try {
    await ensureOffscreenDocument();
    
    const response = await browser.runtime.sendMessage({
      type: 'OFFSCREEN_REWRITE',
      data
    });
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return { rewrittenText: response.rewrittenText };
  } catch (error) {
    console.error('[Service Worker] Rewrite failed:', error);
    throw error;
  }
}

/**
 * Handle write request (Writer API)
 */
async function handleWrite(data) {
  try {
    await ensureOffscreenDocument();
    
    const response = await browser.runtime.sendMessage({
      type: 'OFFSCREEN_WRITE',
      data
    });
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return { writtenText: response.writtenText };
  } catch (error) {
    console.error('[Service Worker] Write failed:', error);
    throw error;
  }
}

/**
 * Handle translate request (Translator API)
 */
async function handleTranslate(data) {
  try {
    await ensureOffscreenDocument();
    
    const response = await browser.runtime.sendMessage({
      type: 'OFFSCREEN_TRANSLATE',
      data
    });
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    return { translatedText: response.translatedText, language: response.language };
  } catch (error) {
    console.error('[Service Worker] Translate failed:', error);
    throw error;
  }
}

console.log('[Service Worker] Initialized');
