import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

// Set up PDF.js worker - use local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

/**
 * Parse resume from various file formats
 * @param {File} file - The resume file
 * @returns {Promise<Object>} Parsed resume data
 */
export async function parseResume(file) {
  const fileType = file.type;
  let rawText = '';
  
  try {
    // Extract text based on file type
    if (fileType === 'application/pdf') {
      rawText = await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      rawText = await parseDOCX(file);
    } else if (fileType === 'application/msword') {
      rawText = await parseDOC(file);
    } else if (fileType.startsWith('image/')) {
      rawText = await parseImage(file);
    } else {
      // Plain text
      rawText = await readAsText(file);
    }
    
    return {
      rawText,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      parsedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error(`Failed to parse ${file.name}: ${error.message}`);
  }
}

/**
 * Parse PDF file using PDF.js
 */
async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

/**
 * Parse DOCX file
 */
async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse DOC file (legacy Word format)
 */
async function parseDOC(file) {
  // For legacy .doc files, try to read as text
  // Note: This is limited, consider using a backend service for better parsing
  return await readAsText(file);
}

/**
 * Parse image file using OCR
 */
async function parseImage(file) {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m)
  });
  return text;
}

/**
 * Read file as plain text
 */
function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Analyze resume with AI to extract structured data
 * @param {string} rawText - Raw resume text
 * @returns {Promise<Object>} Structured resume data
 */
export async function analyzeResumeWithAI(rawText) {
  const prompt = `You are a professional resume parser. Extract ALL information from this resume into structured JSON.

=== RESUME TEXT ===
${rawText}

=== EXTRACTION RULES ===

1. PERSONAL INFORMATION:
   - Extract FULL NAME (first and last name)
   - Extract EMAIL ADDRESS (look for @ symbol)
   - Extract PHONE NUMBER (any format)
   - Extract LOCATION (city, state/country)

2. WORK EXPERIENCE:
   - Find ALL job positions (look for job titles, company names, dates)
   - For EACH job, extract:
     * Job title (e.g., "Software Developer", "Senior Engineer")
     * Company name (e.g., "Google", "Microsoft")
     * Duration (e.g., "June 2020 - Present", "2018-2020")
     * Description (what they did, achievements, responsibilities)
   - List from MOST RECENT to OLDEST

3. EDUCATION:
   - Find ALL degrees/education
   - For EACH degree, extract:
     * Degree name (e.g., "Bachelor of Science in Computer Science")
     * Institution name (university/college)
     * Year (graduation year or attendance period)

4. SKILLS:
   - Extract ALL technical skills, programming languages, tools
   - Look for: Python, Java, JavaScript, React, AWS, Docker, etc.
   - Return as array of individual skills

5. PROJECTS:
   - Find personal/professional projects
   - Extract project name and description

6. CERTIFICATIONS:
   - Find any certifications, licenses, awards
   - Return as array

=== OUTPUT FORMAT ===
Return ONLY valid JSON with this EXACT structure (no extra text):

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "summary": "Brief professional summary if available",
  "experience": [
    {
      "title": "Senior Software Developer",
      "company": "Tech Corp",
      "duration": "June 2020 - Present",
      "description": "Led development of web applications using React and Node.js. Improved performance by 40%."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "MIT",
      "year": "2020"
    }
  ],
  "skills": ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker"],
  "certifications": ["AWS Certified Developer"],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Built full-stack e-commerce site with payment integration"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, nothing else.`;

  try {
    // Try Chrome Built-in AI first
    if ('ai' in window && 'languageModel' in window.ai) {
      const session = await window.ai.languageModel.create({
        systemPrompt: 'You are a resume parser. Extract structured data from resumes and return only valid JSON.',
        temperature: 0.3
      });
      
      const response = await session.prompt(prompt);
      session.destroy();
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    // Fallback: Return basic structure
    return extractBasicInfo(rawText);
  } catch (error) {
    console.error('AI analysis failed:', error);
    return extractBasicInfo(rawText);
  }
}

/**
 * Extract basic info without AI (fallback)
 */
function extractBasicInfo(text) {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  
  const email = emails[0] || '';
  const phone = phones[0] || '';
  
  // Extract name (usually first line or line with name-like pattern)
  const lines = text.split('\n').filter(l => l.trim());
  let fullName = '';
  for (let line of lines.slice(0, 5)) {
    // Look for a line that looks like a name (2-4 words, capitalized, no special chars)
    if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line.trim()) && line.length < 50) {
      fullName = line.trim();
      break;
    }
  }
  if (!fullName) fullName = lines[0]?.trim() || '';
  
  // Extract location (look for city, state/country patterns)
  const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z]{2,}|[A-Z][a-z]+,\s*[A-Z][a-z]+)/);
  const location = locationMatch ? locationMatch[0] : '';
  
  // Extract skills (expanded list)
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux',
    'HTML', 'CSS', 'TypeScript', 'GraphQL', 'REST', 'API'
  ];
  const skills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  // Try to extract experience (look for company/job patterns)
  const experience = [];
  const expRegex = /(Software|Developer|Engineer|Manager|Analyst|Designer|Consultant)/gi;
  const expMatches = text.match(expRegex);
  if (expMatches && expMatches.length > 0) {
    // Found job titles, try to extract basic info
    const textLower = text.toLowerCase();
    if (textLower.includes('experience') || textLower.includes('employment')) {
      experience.push({
        title: expMatches[0] || 'Position',
        company: 'Company',
        duration: '',
        description: 'See resume for details'
      });
    }
  }
  
  // Try to extract education
  const education = [];
  const degreeRegex = /(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Diploma|Certificate)/gi;
  const degreeMatches = text.match(degreeRegex);
  if (degreeMatches && degreeMatches.length > 0) {
    education.push({
      degree: degreeMatches[0] + ' Degree',
      institution: 'University',
      year: ''
    });
  }
  
  return {
    fullName,
    email,
    phone,
    location,
    summary: 'Professional with experience in software development',
    experience,
    education,
    skills,
    certifications: [],
    projects: [],
    rawText: text
  };
}

export default {
  parseResume,
  analyzeResumeWithAI
};
