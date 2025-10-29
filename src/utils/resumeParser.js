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
  const prompt = `Analyze this resume and extract structured information in JSON format.

RESUME TEXT:
${rawText}

Extract and return ONLY a JSON object with this exact structure:
{
  "fullName": "candidate's full name",
  "email": "email address",
  "phone": "phone number",
  "location": "city, country",
  "summary": "professional summary or objective",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "dates",
      "description": "what they did"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "year": "graduation year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "certifications": ["cert1", "cert2"],
  "projects": [
    {
      "name": "project name",
      "description": "what it does"
    }
  ]
}

Return ONLY valid JSON, no additional text.`;

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
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
  
  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  
  // Extract name (usually first line)
  const lines = text.split('\n').filter(l => l.trim());
  const fullName = lines[0]?.trim() || '';
  
  // Extract skills (common keywords)
  const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'];
  const skills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return {
    fullName,
    email,
    phone,
    location: '',
    summary: '',
    experience: [],
    education: [],
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
