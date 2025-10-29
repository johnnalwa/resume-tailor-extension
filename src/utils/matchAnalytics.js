/**
 * Enhanced Match Analytics
 * Advanced algorithm for calculating resume-job match score
 */

/**
 * Calculate comprehensive match score
 * @param {string} resume - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {Object} Detailed match analysis
 */
export function calculateEnhancedMatchScore(resume, jobDescription) {
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Extract components
  const skills = extractSkills(jobLower);
  const requirements = extractRequirements(jobLower);
  const keywords = extractKeywords(jobLower);
  const experienceLevel = detectExperienceLevel(jobLower);
  
  // Calculate individual scores
  const skillsScore = calculateSkillsMatch(resumeLower, skills);
  const requirementsScore = calculateRequirementsMatch(resumeLower, requirements);
  const keywordsScore = calculateKeywordsMatch(resumeLower, keywords);
  const experienceScore = calculateExperienceMatch(resumeLower, experienceLevel);
  
  // Weighted overall score
  const overallScore = Math.round(
    skillsScore * 0.40 +
    requirementsScore * 0.30 +
    keywordsScore * 0.20 +
    experienceScore * 0.10
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    skillsScore,
    requirementsScore,
    keywordsScore,
    experienceScore,
    skills,
    requirements,
    resumeLower
  });
  
  return {
    overallScore,
    breakdown: {
      skills: { score: skillsScore, weight: '40%' },
      requirements: { score: requirementsScore, weight: '30%' },
      keywords: { score: keywordsScore, weight: '20%' },
      experience: { score: experienceScore, weight: '10%' }
    },
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    matchedRequirements: requirements.matched,
    missingRequirements: requirements.missing,
    recommendations,
    experienceLevel
  };
}

/**
 * Extract technical and soft skills from job description
 */
function extractSkills(jobText) {
  const technicalSkills = [
    // Programming Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript',
    // Frameworks & Libraries
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', '.net',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'dynamodb',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'terraform', 'ansible',
    // Tools & Methodologies
    'git', 'agile', 'scrum', 'jira', 'ci/cd', 'rest api', 'graphql', 'microservices',
    // Data & AI
    'machine learning', 'data analysis', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'tableau', 'power bi',
    // Mobile
    'ios', 'android', 'react native', 'flutter', 'xamarin',
    // Web
    'html', 'css', 'sass', 'webpack', 'babel', 'responsive design', 'ui/ux'
  ];
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'time management', 'adaptability', 'creativity', 'collaboration',
    'analytical', 'detail-oriented', 'self-motivated', 'initiative', 'mentoring'
  ];
  
  const allSkills = [...technicalSkills, ...softSkills];
  const foundSkills = allSkills.filter(skill => jobText.includes(skill));
  
  return {
    all: foundSkills,
    matched: [],
    missing: []
  };
}

/**
 * Calculate skills match score
 */
function calculateSkillsMatch(resume, skills) {
  if (skills.all.length === 0) return 100;
  
  let matched = 0;
  skills.matched = [];
  skills.missing = [];
  
  skills.all.forEach(skill => {
    if (resume.includes(skill)) {
      matched++;
      skills.matched.push(skill);
    } else {
      skills.missing.push(skill);
    }
  });
  
  return Math.round((matched / skills.all.length) * 100);
}

/**
 * Extract requirements from job description
 */
function extractRequirements(jobText) {
  const requirementPatterns = [
    /(?:required|must have|essential).*?(?:\n|$)/gi,
    /(?:\d+\+?\s*years?).*?experience/gi,
    /(?:bachelor|master|phd|degree).*?(?:\n|$)/gi
  ];
  
  const requirements = [];
  requirementPatterns.forEach(pattern => {
    const matches = jobText.match(pattern);
    if (matches) {
      requirements.push(...matches);
    }
  });
  
  return {
    all: requirements.map(r => r.trim().toLowerCase()),
    matched: [],
    missing: []
  };
}

/**
 * Calculate requirements match score
 */
function calculateRequirementsMatch(resume, requirements) {
  if (requirements.all.length === 0) return 100;
  
  let matched = 0;
  requirements.matched = [];
  requirements.missing = [];
  
  requirements.all.forEach(req => {
    // Check if key terms from requirement appear in resume
    const keyTerms = req.split(/\s+/).filter(word => word.length > 3);
    const hasMatch = keyTerms.some(term => resume.includes(term));
    
    if (hasMatch) {
      matched++;
      requirements.matched.push(req);
    } else {
      requirements.missing.push(req);
    }
  });
  
  return Math.round((matched / requirements.all.length) * 100);
}

/**
 * Extract important keywords
 */
function extractKeywords(jobText) {
  const commonKeywords = [
    'develop', 'design', 'implement', 'maintain', 'optimize', 'test', 'deploy',
    'collaborate', 'manage', 'lead', 'analyze', 'create', 'build', 'improve',
    'troubleshoot', 'debug', 'document', 'review', 'mentor', 'train'
  ];
  
  return commonKeywords.filter(keyword => jobText.includes(keyword));
}

/**
 * Calculate keywords match score
 */
function calculateKeywordsMatch(resume, keywords) {
  if (keywords.length === 0) return 100;
  
  const matched = keywords.filter(keyword => resume.includes(keyword));
  return Math.round((matched.length / keywords.length) * 100);
}

/**
 * Detect experience level from job description
 */
function detectExperienceLevel(jobText) {
  const patterns = {
    entry: /(?:entry|junior|graduate|0-2 years)/i,
    mid: /(?:mid|intermediate|2-5 years|3-7 years)/i,
    senior: /(?:senior|lead|principal|staff|5\+ years|7\+ years|10\+ years)/i,
    executive: /(?:director|vp|chief|head of|c-level)/i
  };
  
  for (const [level, pattern] of Object.entries(patterns)) {
    if (pattern.test(jobText)) {
      return level;
    }
  }
  
  return 'mid'; // default
}

/**
 * Calculate experience match score
 */
function calculateExperienceMatch(resume, requiredLevel) {
  const resumeLevel = detectExperienceLevel(resume);
  
  const levelHierarchy = {
    entry: 1,
    mid: 2,
    senior: 3,
    executive: 4
  };
  
  const requiredRank = levelHierarchy[requiredLevel] || 2;
  const resumeRank = levelHierarchy[resumeLevel] || 2;
  
  // Perfect match
  if (resumeRank === requiredRank) return 100;
  
  // One level difference
  if (Math.abs(resumeRank - requiredRank) === 1) return 75;
  
  // Two levels difference
  if (Math.abs(resumeRank - requiredRank) === 2) return 50;
  
  // More than two levels
  return 25;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations({ skillsScore, requirementsScore, keywordsScore, experienceScore, skills, requirements, resumeLower }) {
  const recommendations = [];
  
  // Skills recommendations
  if (skillsScore < 70 && skills.missing.length > 0) {
    const topMissing = skills.missing.slice(0, 3);
    recommendations.push({
      type: 'skills',
      priority: 'high',
      message: `Highlight these skills in your cover letter: ${topMissing.join(', ')}`,
      action: 'Emphasize transferable skills or willingness to learn'
    });
  }
  
  // Requirements recommendations
  if (requirementsScore < 70 && requirements.missing.length > 0) {
    recommendations.push({
      type: 'requirements',
      priority: 'high',
      message: 'Address missing requirements in your cover letter',
      action: 'Explain how your experience relates to the requirements'
    });
  }
  
  // Keywords recommendations
  if (keywordsScore < 60) {
    recommendations.push({
      type: 'keywords',
      priority: 'medium',
      message: 'Use more action verbs from the job description',
      action: 'Mirror the language used in the job posting'
    });
  }
  
  // Experience recommendations
  if (experienceScore < 75) {
    recommendations.push({
      type: 'experience',
      priority: 'medium',
      message: 'Emphasize relevant experience and achievements',
      action: 'Quantify your accomplishments with specific metrics'
    });
  }
  
  // Positive reinforcement
  if (skillsScore >= 80) {
    recommendations.push({
      type: 'strength',
      priority: 'low',
      message: 'Strong skills match! Highlight these prominently',
      action: 'Lead with your matching technical skills'
    });
  }
  
  return recommendations;
}

/**
 * Simple match score (backward compatibility)
 */
export function calculateSimpleMatchScore(resume, jobDescription) {
  const result = calculateEnhancedMatchScore(resume, jobDescription);
  return result.overallScore;
}

export default {
  calculateEnhancedMatchScore,
  calculateSimpleMatchScore
};
