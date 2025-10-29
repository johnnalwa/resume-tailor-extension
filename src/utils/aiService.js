import browser from 'webextension-polyfill';

/**
 * Generate a cover letter using AI
 * @param {Object} params - Generation parameters
 * @param {string} params.jobDescription - The job description
 * @param {string} params.resume - The resume content
 * @param {string} params.tone - The desired tone
 * @param {string} params.apiKey - OpenAI API key
 * @returns {Promise<Object>} Result object with success status and cover letter or error
 */
export async function generateCoverLetter({ jobDescription, resume, tone, apiKey }) {
  try {
    // Send message to background script to handle the API call
    const response = await browser.runtime.sendMessage({
      type: 'GENERATE_COVER_LETTER',
      data: {
        jobDescription,
        resume: typeof resume === 'object' ? resume.content : resume,
        tone,
        apiKey
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate cover letter'
    };
  }
}

/**
 * Generate a cover letter using Gemini API (Google AI)
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Result object
 */
export async function generateWithGemini({ jobDescription, resume, tone, apiKey }) {
  try {
    const toneInstructions = getToneInstructions(tone);
    
    const prompt = `You are a professional cover letter writer. ${toneInstructions}

Resume:
${resume}

Job Description:
${jobDescription}

Please write a tailored, professional cover letter in a ${tone} tone that:
1. Highlights relevant skills and experiences from the resume
2. Matches the job requirements
3. Is well-structured with proper paragraphs
4. Is approximately 300-400 words

Generate only the cover letter content, no additional commentary.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          maxOutputTokens: 1024,
          topP: 0.8,
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
    
    const coverLetter = result.candidates[0].content.parts[0].text;

    return {
      success: true,
      coverLetter
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate cover letter with Gemini'
    };
  }
}

/**
 * Get tone-specific instructions for the AI
 * @param {string} tone - The desired tone
 * @returns {string} Instructions for the AI
 */
function getToneInstructions(tone) {
  const instructions = {
    professional: 'Write in a formal, business-appropriate tone. Use professional language and maintain a respectful, competent demeanor.',
    enthusiastic: 'Write with energy and passion. Show genuine excitement about the opportunity while remaining professional.',
    confident: 'Write assertively and self-assuredly. Emphasize strengths and accomplishments with conviction.',
    friendly: 'Write in a warm, approachable tone. Be personable while maintaining professionalism.',
    creative: 'Write with an innovative and expressive style. Use engaging language that stands out.',
    concise: 'Write briefly and to the point. Keep sentences short and focus on key qualifications.'
  };

  return instructions[tone] || instructions.professional;
}

/**
 * Validate API key format
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} Whether the API key is valid
 */
export function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Gemini API keys typically start with 'AIza'
  // Also accept other formats for flexibility
  return apiKey.length > 20;
}

/**
 * Extract key skills from resume
 * @param {string} resume - The resume content
 * @returns {Array<string>} List of skills
 */
export function extractSkills(resume) {
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
    'Machine Learning', 'Data Analysis', 'Project Management',
    'Communication', 'Leadership', 'Problem Solving'
  ];

  const foundSkills = [];
  const lowerResume = resume.toLowerCase();

  skillKeywords.forEach(skill => {
    if (lowerResume.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

/**
 * Analyze job description for key requirements
 * @param {string} jobDescription - The job description
 * @returns {Object} Analysis results
 */
export function analyzeJobDescription(jobDescription) {
  const analysis = {
    requiredSkills: [],
    experienceLevel: 'mid',
    keywords: []
  };

  const lowerDesc = jobDescription.toLowerCase();

  // Detect experience level
  if (lowerDesc.includes('senior') || lowerDesc.includes('lead')) {
    analysis.experienceLevel = 'senior';
  } else if (lowerDesc.includes('junior') || lowerDesc.includes('entry')) {
    analysis.experienceLevel = 'junior';
  }

  // Extract common keywords
  const commonKeywords = [
    'required', 'must have', 'experience with', 'proficient in',
    'knowledge of', 'familiar with', 'expertise in'
  ];

  commonKeywords.forEach(keyword => {
    if (lowerDesc.includes(keyword)) {
      analysis.keywords.push(keyword);
    }
  });

  return analysis;
}

export default {
  generateCoverLetter,
  generateWithGemini,
  validateApiKey,
  extractSkills,
  analyzeJobDescription
};
