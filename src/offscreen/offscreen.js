/**
 * Offscreen Document for Chrome Built-in AI Processing
 * This runs in a page context where window.ai APIs are available
 */

import browser from 'webextension-polyfill';

console.log('[Offscreen] AI Processing document loaded');

// Message handler for AI operations
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Offscreen] Message received:', message.type);
  
  switch (message.type) {
    case 'OFFSCREEN_GENERATE_COVER_LETTER':
      handleGenerateCoverLetter(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_SUMMARIZE':
      handleSummarize(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_PROOFREAD':
      handleProofread(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_REWRITE':
      handleRewrite(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_GENERATE_MULTIPLE':
      handleGenerateMultipleDrafts(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_CHECK_AVAILABILITY':
      handleCheckAvailability()
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_WRITE':
      handleWrite(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'OFFSCREEN_TRANSLATE':
      handleTranslate(message.data)
        .then(result => sendResponse({ success: true, ...result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
  
  return false;
});

/**
 * Check AI availability
 */
async function handleCheckAvailability() {
  const availability = {
    prompt: false,
    summarizer: false,
    proofreader: false,
    rewriter: false,
    translator: false
  };
  
  try {
    // Check Prompt API
    if ('ai' in window && 'languageModel' in window.ai) {
      const capabilities = await window.ai.languageModel.capabilities();
      availability.prompt = capabilities.available === 'readily';
    }
    
    // Check Summarizer API
    if ('ai' in window && 'summarizer' in window.ai) {
      const capabilities = await window.ai.summarizer.capabilities();
      availability.summarizer = capabilities.available === 'readily';
    }
    
    // Check Rewriter API
    if ('ai' in window && 'rewriter' in window.ai) {
      const capabilities = await window.ai.rewriter.capabilities();
      availability.rewriter = capabilities.available === 'readily';
    }
    
    // Check Translator API
    if ('ai' in window && 'translator' in window.ai) {
      availability.translator = true;
    }
  } catch (error) {
    console.error('[Offscreen] Error checking availability:', error);
  }
  
  return { availability };
}

/**
 * Generate cover letter using Prompt API
 */
async function handleGenerateCoverLetter(data) {
  const { jobDescription, resume, tone, userProfile } = data;
  
  if (!('ai' in window) || !('languageModel' in window.ai)) {
    throw new Error('Prompt API not available. Please enable Chrome Built-in AI.');
  }
  
  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: buildSystemPrompt(tone),
      temperature: 0.7,
      topK: 40
    });
    
    const userPrompt = buildUserPrompt({ jobDescription, resume, tone, userProfile });
    const coverLetter = await session.prompt(userPrompt);
    
    session.destroy();
    
    return { coverLetter };
  } catch (error) {
    console.error('[Offscreen] Generation error:', error);
    throw error;
  }
}

/**
 * Generate multiple draft variations
 */
async function handleGenerateMultipleDrafts(data) {
  const { jobDescription, resume, tone, userProfile, count = 3 } = data;
  
  if (!('ai' in window) || !('languageModel' in window.ai)) {
    throw new Error('Prompt API not available');
  }
  
  const drafts = [];
  const temperatures = [0.5, 0.7, 0.9]; // Different creativity levels
  
  try {
    for (let i = 0; i < Math.min(count, 3); i++) {
      const session = await window.ai.languageModel.create({
        systemPrompt: buildSystemPrompt(tone),
        temperature: temperatures[i],
        topK: 40
      });
      
      const userPrompt = buildUserPrompt({ jobDescription, resume, tone, userProfile });
      const coverLetter = await session.prompt(userPrompt);
      
      drafts.push({
        id: `draft-${i + 1}`,
        content: coverLetter,
        temperature: temperatures[i],
        label: i === 0 ? 'Conservative' : i === 1 ? 'Balanced' : 'Creative'
      });
      
      session.destroy();
    }
    
    return { drafts };
  } catch (error) {
    console.error('[Offscreen] Multiple drafts error:', error);
    throw error;
  }
}

/**
 * Summarize job description
 */
async function handleSummarize(data) {
  const { jobDescription, options = {} } = data;
  
  if (!('ai' in window) || !('summarizer' in window.ai)) {
    throw new Error('Summarizer API not available');
  }
  
  try {
    const summarizer = await window.ai.summarizer.create({
      type: options.type || 'key-points',
      format: options.format || 'plain-text',
      length: options.length || 'medium'
    });
    
    const summary = await summarizer.summarize(jobDescription);
    summarizer.destroy();
    
    return { summary };
  } catch (error) {
    console.error('[Offscreen] Summarization error:', error);
    throw error;
  }
}

/**
 * Proofread text
 */
async function handleProofread(data) {
  const { text } = data;
  
  if (!('ai' in window) || !('languageModel' in window.ai)) {
    // Fallback: use Prompt API for proofreading
    return await proofreadWithPromptAPI(text);
  }
  
  try {
    // Try dedicated proofreader if available
    if ('proofreader' in window.ai) {
      const proofreader = await window.ai.proofreader.create();
      const result = await proofreader.proofread(text);
      proofreader.destroy();
      
      return {
        correctedText: result.correctedText || text,
        suggestions: result.suggestions || []
      };
    } else {
      return await proofreadWithPromptAPI(text);
    }
  } catch (error) {
    console.error('[Offscreen] Proofreading error:', error);
    return await proofreadWithPromptAPI(text);
  }
}

/**
 * Proofread using Prompt API as fallback
 */
async function proofreadWithPromptAPI(text) {
  const session = await window.ai.languageModel.create({
    systemPrompt: 'You are a professional proofreader. Fix grammar, spelling, and punctuation errors. Return only the corrected text.',
    temperature: 0.3
  });
  
  const correctedText = await session.prompt(`Proofread and correct this text:\n\n${text}`);
  session.destroy();
  
  return { correctedText, suggestions: [] };
}

/**
 * Rewrite text with different style
 */
async function handleRewrite(data) {
  const { text, tone, context } = data;
  
  if (!('ai' in window)) {
    throw new Error('AI APIs not available');
  }
  
  try {
    // Try dedicated Rewriter API if available
    if ('rewriter' in window.ai) {
      const rewriter = await window.ai.rewriter.create({
        tone: tone || 'as-is',
        length: 'as-is',
        format: 'as-is'
      });
      
      const rewritten = await rewriter.rewrite(text, { context });
      rewriter.destroy();
      
      return { rewrittenText: rewritten };
    } else {
      // Fallback to Prompt API
      return await rewriteWithPromptAPI(text, tone, context);
    }
  } catch (error) {
    console.error('[Offscreen] Rewriting error:', error);
    return await rewriteWithPromptAPI(text, tone, context);
  }
}

/**
 * Rewrite using Prompt API as fallback
 */
async function rewriteWithPromptAPI(text, tone, context) {
  const toneInstructions = {
    professional: 'more formal and professional',
    friendly: 'more friendly and approachable',
    confident: 'more confident and assertive',
    enthusiastic: 'more enthusiastic and energetic',
    creative: 'more creative and expressive',
    concise: 'more concise and brief'
  };
  
  const instruction = toneInstructions[tone] || 'clearer and better';
  
  const session = await window.ai.languageModel.create({
    systemPrompt: `You are a professional writer. Rewrite the given text to make it ${instruction}. Maintain the core message but improve the style.`,
    temperature: 0.7
  });
  
  const prompt = context 
    ? `Context: ${context}\n\nRewrite this text:\n${text}`
    : `Rewrite this text:\n${text}`;
  
  const rewrittenText = await session.prompt(prompt);
  session.destroy();
  
  return { rewrittenText };
}

/**
 * Build system prompt based on tone
 */
function buildSystemPrompt(tone) {
  const toneMap = {
    professional: 'You are a professional cover letter writer. Write in a formal, business-appropriate tone. Use professional language and maintain a respectful, competent demeanor.',
    enthusiastic: 'You are an enthusiastic cover letter writer. Write with energy and genuine passion. Show excitement while remaining professional.',
    confident: 'You are a confident cover letter writer. Write assertively and self-assuredly. Emphasize strengths with conviction.',
    friendly: 'You are a friendly cover letter writer. Write in a warm, approachable tone. Be personable while maintaining professionalism.',
    creative: 'You are a creative cover letter writer. Write with an innovative and expressive style. Use engaging language that stands out.',
    concise: 'You are a concise cover letter writer. Write briefly and to the point. Keep sentences short and focus on key qualifications.'
  };
  
  return `${toneMap[tone] || toneMap.professional}

CRITICAL INSTRUCTIONS:
1. Extract the candidate's ACTUAL NAME from the resume (not placeholders)
2. Identify SPECIFIC skills, projects, and achievements from the resume
3. Match these to the EXACT requirements in the job description
4. Use concrete examples and real technologies mentioned in the resume
5. Reference specific job responsibilities from the job description
6. Write 300-400 words
7. NO placeholders like [Your Name], [Company Name] - use real information
8. Make it highly personalized and specific to this candidate and job`;
}

/**
 * Build user prompt
 */
function buildUserPrompt({ jobDescription, resume, tone, userProfile }) {
  let prompt = `You are writing a HIGHLY PERSONALIZED cover letter. You MUST use SPECIFIC details from the resume.

=== RESUME (READ CAREFULLY) ===
${resume}

=== JOB DESCRIPTION ===
${jobDescription}

=== CRITICAL INSTRUCTIONS ===

1. EXTRACT THESE EXACT DETAILS FROM RESUME:
   - Candidate's FULL NAME (use it in the letter)
   - EXACT job titles and company names
   - SPECIFIC technologies/skills (list them by name: Python, Django, React, AWS, etc.)
   - ACTUAL projects with descriptions
   - REAL achievements with numbers/metrics
   - Education degree and institution
   - Years of experience at each company

2. ANALYZE JOB REQUIREMENTS:
   - Extract company name and position title
   - Identify required skills
   - Note key responsibilities
   - Find experience requirements

3. WRITE COVER LETTER WITH THESE RULES:
   ✅ DO:
   - Use candidate's FULL NAME from resume
   - Mention SPECIFIC companies where they worked (e.g., "Book Smart Consultancy Limited", "KALRO")
   - List EXACT technologies (e.g., "Python, Django, Next.js, MySQL, MongoDB")
   - Reference ACTUAL projects (e.g., "web platform for accounting services")
   - Include REAL achievements (e.g., "reduced manual workload by automating financial processes")
   - Match SPECIFIC resume skills to job requirements
   - Use CONCRETE examples from work experience
   - Mention education degree and university name
   
   ❌ DON'T:
   - Use generic phrases like "solid foundation" or "strong background"
   - Say "various technologies" - NAME THEM
   - Say "multiple projects" - DESCRIBE THEM
   - Use vague terms - BE SPECIFIC
   - Make up information not in resume

4. STRUCTURE:
   Paragraph 1: Opening with position and company name, brief intro
   Paragraph 2-3: Match SPECIFIC resume experience to job requirements
   Paragraph 4: Education and additional qualifications
   Paragraph 5: Closing

5. TONE: ${tone}

6. LENGTH: 350-450 words

EXAMPLE OF GOOD WRITING:
"As a Fullstack Software Developer at Book Smart Consultancy Limited since June 2024, I automated financial record-keeping processes using Python and Django, reducing manual workload by 40%. I developed web platforms using Next.js for accounting and immigration services, managing MySQL and MongoDB databases."

EXAMPLE OF BAD WRITING:
"I have experience in software development with various technologies and worked on multiple projects."

NOW WRITE THE COVER LETTER:`;
  
  return prompt;
}

/**
 * Write original content using Writer API
 */
async function handleWrite(data) {
  const { context, tone, length } = data;
  
  if (!('ai' in window)) {
    throw new Error('AI APIs not available');
  }
  
  try {
    // Try dedicated Writer API if available
    if ('writer' in window.ai) {
      const writer = await window.ai.writer.create({
        tone: tone || 'neutral',
        length: length || 'medium',
        format: 'plain-text'
      });
      
      const written = await writer.write(context);
      writer.destroy();
      
      return { writtenText: written };
    } else {
      // Fallback to Prompt API
      return await writeWithPromptAPI(context, tone, length);
    }
  } catch (error) {
    console.error('[Offscreen] Writing error:', error);
    return await writeWithPromptAPI(context, tone, length);
  }
}

/**
 * Write using Prompt API as fallback
 */
async function writeWithPromptAPI(context, tone, length) {
  const toneInstructions = {
    formal: 'formal and professional',
    casual: 'casual and friendly',
    neutral: 'neutral and balanced'
  };
  
  const lengthInstructions = {
    short: 'brief (100-150 words)',
    medium: 'moderate length (200-300 words)',
    long: 'detailed (400-500 words)'
  };
  
  const toneInstruction = toneInstructions[tone] || toneInstructions.neutral;
  const lengthInstruction = lengthInstructions[length] || lengthInstructions.medium;
  
  const session = await window.ai.languageModel.create({
    systemPrompt: `You are a professional writer. Create original, engaging content in a ${toneInstruction} tone. Keep it ${lengthInstruction}.`,
    temperature: 0.7
  });
  
  const prompt = `Write original content based on this context:\n\n${context}`;
  const writtenText = await session.prompt(prompt);
  session.destroy();
  
  return { writtenText };
}

/**
 * Translate text using Translator API
 */
async function handleTranslate(data) {
  const { text, targetLanguage, sourceLanguage } = data;
  
  if (!('ai' in window)) {
    throw new Error('AI APIs not available');
  }
  
  try {
    // Try dedicated Translator API if available
    if ('translator' in window.ai) {
      const canTranslate = await window.ai.translator.canTranslate({
        sourceLanguage: sourceLanguage || 'en',
        targetLanguage: targetLanguage || 'es'
      });
      
      if (canTranslate === 'readily' || canTranslate === 'after-download') {
        const translator = await window.ai.translator.create({
          sourceLanguage: sourceLanguage || 'en',
          targetLanguage: targetLanguage || 'es'
        });
        
        const translated = await translator.translate(text);
        translator.destroy();
        
        return { translatedText: translated, language: targetLanguage };
      }
    }
    
    // Fallback to Prompt API
    return await translateWithPromptAPI(text, targetLanguage, sourceLanguage);
  } catch (error) {
    console.error('[Offscreen] Translation error:', error);
    return await translateWithPromptAPI(text, targetLanguage, sourceLanguage);
  }
}

/**
 * Translate using Prompt API as fallback
 */
async function translateWithPromptAPI(text, targetLanguage, sourceLanguage) {
  const languageNames = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi'
  };
  
  const targetLangName = languageNames[targetLanguage] || targetLanguage;
  const sourceLangName = languageNames[sourceLanguage] || 'the source language';
  
  const session = await window.ai.languageModel.create({
    systemPrompt: `You are a professional translator. Translate text from ${sourceLangName} to ${targetLangName}. Maintain the original meaning, tone, and formatting. Return only the translated text.`,
    temperature: 0.3
  });
  
  const prompt = `Translate this text to ${targetLangName}:\n\n${text}`;
  const translatedText = await session.prompt(prompt);
  session.destroy();
  
  return { translatedText, language: targetLanguage };
}

console.log('[Offscreen] Ready for AI processing');
