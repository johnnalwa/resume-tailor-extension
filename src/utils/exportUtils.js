import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Export cover letter as PDF
 * @param {string} coverLetter - The cover letter text
 * @param {string} candidateName - Candidate's name for filename
 * @param {string} jobTitle - Job title for filename
 */
export async function exportToPDF(coverLetter, candidateName = 'Candidate', jobTitle = 'Position') {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Cover Letter', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(today, 20, 35);
    
    // Add cover letter content
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(coverLetter, 170); // 170mm width for margins
    doc.text(lines, 20, 50);
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        287,
        { align: 'center' }
      );
    }
    
    // Generate filename
    const filename = `${sanitizeFilename(candidateName)}_CoverLetter_${sanitizeFilename(jobTitle)}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export cover letter as Word document (.docx)
 * @param {string} coverLetter - The cover letter text
 * @param {string} candidateName - Candidate's name for filename
 * @param {string} jobTitle - Job title for filename
 */
export async function exportToWord(coverLetter, candidateName = 'Candidate', jobTitle = 'Position') {
  try {
    // Get today's date
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Split cover letter into paragraphs
    const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());
    
    // Create document sections
    const docSections = [
      // Title
      new Paragraph({
        text: 'Cover Letter',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      }),
      
      // Date
      new Paragraph({
        children: [
          new TextRun({
            text: today,
            size: 22
          })
        ],
        spacing: {
          after: 400
        }
      }),
      
      // Cover letter paragraphs
      ...paragraphs.map(para => 
        new Paragraph({
          children: [
            new TextRun({
              text: para.trim(),
              size: 24
            })
          ],
          spacing: {
            after: 200,
            line: 360
          },
          alignment: AlignmentType.JUSTIFIED
        })
      )
    ];
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: docSections
      }]
    });
    
    // Generate filename
    const filename = `${sanitizeFilename(candidateName)}_CoverLetter_${sanitizeFilename(jobTitle)}.docx`;
    
    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to Word:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export cover letter as plain text file
 * @param {string} coverLetter - The cover letter text
 * @param {string} candidateName - Candidate's name for filename
 * @param {string} jobTitle - Job title for filename
 */
export function exportToText(coverLetter, candidateName = 'Candidate', jobTitle = 'Position') {
  try {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const content = `Cover Letter\n\n${today}\n\n${coverLetter}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const filename = `${sanitizeFilename(candidateName)}_CoverLetter_${sanitizeFilename(jobTitle)}.txt`;
    
    saveAs(blob, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to text:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Copy cover letter to clipboard
 * @param {string} coverLetter - The cover letter text
 */
export async function copyToClipboard(coverLetter) {
  try {
    await navigator.clipboard.writeText(coverLetter);
    return { success: true };
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sanitize filename by removing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
}

export default {
  exportToPDF,
  exportToWord,
  exportToText,
  copyToClipboard
};
