/**
 * Chrome Built-in AI Service
 * Utilizes Chrome's Prompt API, Summarizer API, and Proofreader API
 * for client-side, privacy-preserving AI operations
 */

/**
 * Check if Chrome Built-in AI is available
 * @returns {Promise<Object>} Availability status for each API
 */
export async function checkAIAvailability() {
  const availability = {
    prompt: false,
    summarizer: false,
    proofreader: false,
    translator: false
  };

  try {
    // Check Prompt API
    if ('ai' in window && 'languageModel' in window.ai) {
      const promptCapabilities = await window.ai.languageModel.capabilities();
      availability.prompt = promptCapabilities.available === 'readily';
    }

    // Check Summarizer API
    if ('ai' in window && 'summarizer' in window.ai) {
      const summarizerCapabilities = await window.ai.summarizer.capabilities();
      availability.summarizer = summarizerCapabilities.available === 'readily';
    }

    // Check Proofreader API (if available)
    if ('ai' in window && 'proofreader' in window.ai) {
      availability.proofreader = true;
    }

    // Check Translator API (for future use)
    if ('ai' in window && 'translator' in window.ai) {
      availability.translator = true;
    }
  } catch (error) {
    console.error('Error checking AI availability:', error);
  }

  return availability;
}

/**
 * Summarize job description using Chrome's Summarizer API
 * @param {string} jobDescription - Full job description text
 * @param {Object} options - Summarization options
 * @returns {Promise<string>} Summarized text
 */
export async function summarizeJobDescription(jobDescription, options = {}) {
  try {
    if (!('ai' in window) || !('summarizer' in window.ai)) {
      throw new Error('Summarizer API not available');
    }

    const summarizer = await window.ai.summarizer.create({
      type: options.type || 'key-points',
      format: options.format || 'plain-text',
      length: options.length || 'medium'
    });

    const summary = await summarizer.summarize(jobDescription);
    
    // Clean up
    summarizer.destroy();
    
    return summary;
  } catch (error) {
    console.error('Error summarizing job description:', error);
    // Fallback: return first 500 characters
    return jobDescription.substring(0, 500) + '...';
  }
}

/**
 * Generate cover letter using Chrome's Prompt API
 * @param {Object} params - Generation parameters
 * @param {string} params.jobDescription - Job description or summary
 * @param {string} params.resume - User's resume content
 * @param {string} params.tone - Desired tone (formal/friendly)
 * @param {Object} params.userProfile - User profile data
 * @returns {Promise<string>} Generated cover letter
 */
export async function generateCoverLetterWithPromptAPI({ 
  jobDescription, 
  resume, 
  tone = 'professional',
  userProfile = {}
}) {
  try {
    if (!('ai' in window) || !('languageModel' in window.ai)) {
      throw new Error('Prompt API not available');
    }

    const session = await window.ai.languageModel.create({
      systemPrompt: buildSystemPrompt(tone),
      temperature: 0.7,
      topK: 40
    });

    const userPrompt = buildUserPrompt({
      jobDescription,
      resume,
      userProfile,
      tone
    });

    const coverLetter = await session.prompt(userPrompt);
    
    // Clean up session
    session.destroy();
    
    return coverLetter;
  } catch (error) {
    console.error('Error generating cover letter with Prompt API:', error);
    throw error;
  }
}

/**
 * Stream cover letter generation for better UX
 * @param {Object} params - Generation parameters
 * @param {Function} onChunk - Callback for each text chunk
 * @returns {Promise<string>} Complete generated text
 */
export async function streamCoverLetterGeneration(params, onChunk) {
  try {
    if (!('ai' in window) || !('languageModel' in window.ai)) {
      throw new Error('Prompt API not available');
    }

    const session = await window.ai.languageModel.create({
      systemPrompt: buildSystemPrompt(params.tone),
      temperature: 0.7,
      topK: 40
    });

    const userPrompt = buildUserPrompt(params);
    let fullText = '';

    const stream = await session.promptStreaming(userPrompt);
    
    for await (const chunk of stream) {
      fullText = chunk;
      if (onChunk) {
        onChunk(chunk);
      }
    }
    
    session.destroy();
    return fullText;
  } catch (error) {
    console.error('Error streaming cover letter:', error);
    throw error;
  }
}

/**
 * Proofread and correct cover letter using Proofreader API
 * @param {string} text - Text to proofread
 * @returns {Promise<Object>} Corrected text and suggestions
 */
export async function proofreadCoverLetter(text) {
  try {
    // Note: Proofreader API might not be available yet in all Chrome versions
    if (!('ai' in window) || !('proofreader' in window.ai)) {
      console.warn('Proofreader API not available, returning original text');
      return { correctedText: text, suggestions: [] };
    }

    const proofreader = await window.ai.proofreader.create();
    const result = await proofreader.proofread(text);
    
    proofreader.destroy();
    
    return {
      correctedText: result.correctedText || text,
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Error proofreading:', error);
    return { correctedText: text, suggestions: [] };
  }
}

/**
 * Build system prompt based on tone
 * @param {string} tone - Desired tone
 * @returns {string} System prompt
 */
function buildSystemPrompt(tone) {
  const toneInstructions = {
    professional: 'You are a professional cover letter writer. Write in a formal, business-appropriate tone. Use professional language and maintain a respectful, competent demeanor. Focus on achievements and qualifications.',
    
    enthusiastic: 'You are an enthusiastic cover letter writer. Write with energy and genuine passion about the opportunity. Show excitement while remaining professional. Use dynamic language that conveys eagerness.',
    
    confident: 'You are a confident cover letter writer. Write assertively and self-assuredly. Emphasize strengths and accomplishments with conviction. Use strong, decisive language without being arrogant.',
    
    friendly: 'You are a friendly cover letter writer. Write in a warm, approachable tone. Be personable while maintaining professionalism. Use conversational yet respectful language.',
    
    creative: 'You are a creative cover letter writer. Write with an innovative and expressive style. Use engaging language that stands out. Be original while staying professional.',
    
    concise: 'You are a concise cover letter writer. Write briefly and to the point. Keep sentences short and focus on key qualifications. Eliminate unnecessary words while maintaining impact.'
  };

  const basePrompt = `${toneInstructions[tone] || toneInstructions.professional}

Your task is to generate a tailored cover letter that:
1. Highlights relevant skills and experiences from the resume that match the job requirements
2. Demonstrates understanding of the company and role
3. Shows enthusiasm and fit for the position
4. Maintains appropriate length (250-400 words)
5. Follows proper cover letter structure (opening, body, closing)
6. Uses specific examples when possible
7. Avoids generic phrases and clichés

Format the cover letter professionally with proper paragraphs.`;

  return basePrompt;
}

/**
 * Build user prompt with context
 * @param {Object} params - Prompt parameters
 * @returns {string} User prompt
 */
function buildUserPrompt({ jobDescription, resume, userProfile, tone }) {
  const name = userProfile?.name || '[Your Name]';
  const skills = userProfile?.skills?.join(', ') || '';
  
  let prompt = `Generate a ${tone} cover letter for the following job opportunity.\n\n`;
  
  prompt += `JOB DESCRIPTION:\n${jobDescription}\n\n`;
  
  if (resume) {
    prompt += `CANDIDATE RESUME/PROFILE:\n${resume}\n\n`;
  }
  
  if (skills) {
    prompt += `KEY SKILLS: ${skills}\n\n`;
  }
  
  prompt += `Please write a compelling cover letter that matches the candidate's qualifications to the job requirements. `;
  prompt += `Start with a strong opening, highlight 2-3 relevant experiences or skills in the body, and close with enthusiasm for the opportunity. `;
  prompt += `Use the candidate's name "${name}" if provided, otherwise use placeholders.`;
  
  return prompt;
}

/**
 * Extract key requirements from job description
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Extracted requirements
 */
export async function extractJobRequirements(jobDescription) {
  try {
    if (!('ai' in window) || !('languageModel' in window.ai)) {
      return extractRequirementsBasic(jobDescription);
    }

    const session = await window.ai.languageModel.create({
      systemPrompt: 'You are an expert at analyzing job descriptions. Extract key information in a structured format.',
      temperature: 0.3
    });

    const prompt = `Analyze this job description and extract:
1. Required skills (list)
2. Experience level (entry/mid/senior)
3. Key responsibilities (top 3)
4. Company culture indicators

Job Description:
${jobDescription}

Provide a concise, structured response.`;

    const analysis = await session.prompt(prompt);
    session.destroy();
    
    return parseJobAnalysis(analysis);
  } catch (error) {
    console.error('Error extracting job requirements:', error);
    return extractRequirementsBasic(jobDescription);
  }
}

/**
 * Basic job requirements extraction (fallback)
 * @param {string} jobDescription - Job description text
 * @returns {Object} Basic requirements
 */
function extractRequirementsBasic(jobDescription) {
  const lowerDesc = jobDescription.toLowerCase();
  
  // Detect experience level
  let experienceLevel = 'mid';
  if (lowerDesc.includes('senior') || lowerDesc.includes('lead') || lowerDesc.includes('principal')) {
    experienceLevel = 'senior';
  } else if (lowerDesc.includes('junior') || lowerDesc.includes('entry') || lowerDesc.includes('graduate')) {
    experienceLevel = 'entry';
  }
  
  // Extract common skills
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS',
    'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum', 'TypeScript',
    'Machine Learning', 'Data Analysis', 'Project Management',
    'Communication', 'Leadership', 'Problem Solving'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    lowerDesc.includes(skill.toLowerCase())
  );
  
  return {
    skills: foundSkills,
    experienceLevel,
    keyResponsibilities: [],
    culture: []
  };
}

/**
 * Parse AI-generated job analysis
 * @param {string} analysis - AI analysis text
 * @returns {Object} Parsed analysis
 */
function parseJobAnalysis(analysis) {
  // Simple parsing - in production, you'd want more robust parsing
  return {
    skills: [],
    experienceLevel: 'mid',
    keyResponsibilities: [],
    culture: [],
    rawAnalysis: analysis
  };
}

/**
 * Calculate match score between resume and job description
 * @param {string} resume - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {Promise<number>} Match score (0-100)
 */
export async function calculateMatchScore(resume, jobDescription) {
  try {
    const jobReqs = await extractJobRequirements(jobDescription);
    const resumeLower = resume.toLowerCase();
    
    let matchedSkills = 0;
    const totalSkills = jobReqs.skills.length || 1;
    
    jobReqs.skills.forEach(skill => {
      if (resumeLower.includes(skill.toLowerCase())) {
        matchedSkills++;
      }
    });
    
    return Math.round((matchedSkills / totalSkills) * 100);
  } catch (error) {
    console.error('Error calculating match score:', error);
    return 0;
  }
}

export default {
  checkAIAvailability,
  summarizeJobDescription,
  generateCoverLetterWithPromptAPI,
  streamCoverLetterGeneration,
  proofreadCoverLetter,
  extractJobRequirements,
  calculateMatchScore
};
