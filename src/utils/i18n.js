import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      appName: 'Resume Tailor',
      
      // Tabs
      resumeTab: 'Resume',
      generateTab: 'Generate',
      settingsTab: 'Settings',
      resultTab: 'Result',
      
      // Banner
      bannerTitle: 'AI Cover Letters in 30 Seconds',
      private: 'Private',
      offline: 'Offline',
      languages: '12 Languages',
      poweredBy: 'Chrome Built-in AI',
      
      // How to Use
      howToUse: 'How to Use',
      step1: 'Upload Your Resume',
      step1Desc: 'Click below to upload your resume in PDF, DOCX, or DOC format.',
      step2: 'Configure Settings',
      step2Desc: 'Go to the Settings tab to choose your AI provider and tone preference.',
      step3: 'Generate Cover Letter',
      step3Desc: 'Navigate to the Generate tab, paste a job description, and click generate.',
      step4: 'Quick Access',
      step4Desc: 'Right-click on any job posting and select "Generate Cover Letter" from the context menu.',
      tip: 'Tip',
      tipText: 'Chrome Built-in AI works completely offline and keeps your data 100% private!',
      
      // Upload Section
      uploadTitle: 'Upload Resume',
      uploadDesc: 'Upload your resume or enter your information manually',
      
      // Settings
      languageSettings: 'Language Settings',
      languageDesc: 'Customize language preferences for the extension',
      interfaceLanguage: 'Interface Language',
      interfaceLanguageDesc: 'Change the language of menus, buttons, and messages.',
      interfaceLanguageNote: 'Note: Changes take effect immediately.',
      coverLetterLanguage: 'Cover Letter Language',
      coverLetterLanguageDesc: 'Cover letters will be generated in',
      coverLetterLanguageHelp: 'Perfect for applying to international positions or companies in different regions.',
      
      tonePreference: 'Tone Preference',
      tonePreferenceDesc: 'Select the writing style for your cover letters',
      
      aiProvider: 'AI Provider',
      aiProviderDesc: 'Choose your AI provider for cover letter generation',
      aiProviderHelp: 'Chrome Built-in AI is 100% private and works offline',
      
      // Generate
      jobDescription: 'Job Description',
      jobDescPlaceholder: 'Paste the job description here or extract it from the current page...',
      extractFromPage: 'Extract from Current Page',
      generateButton: 'Generate Cover Letter',
      generating: 'Generating with Gemini Nano...',
      warningNoResume: 'Please upload your resume in the Setup tab first',
      
      // Toast messages
      languageChanged: 'Interface language changed to',
      coverLetterLanguageChanged: 'Cover letter language changed to'
    }
  },
  es: {
    translation: {
      appName: 'Resume Tailor',
      resumeTab: 'Currículum',
      generateTab: 'Generar',
      settingsTab: 'Ajustes',
      resultTab: 'Resultado',
      bannerTitle: 'Cartas de Presentación con IA en 30 Segundos',
      private: 'Privado',
      offline: 'Sin conexión',
      languages: '12 Idiomas',
      poweredBy: 'Chrome Built-in AI',
      howToUse: 'Cómo Usar',
      uploadTitle: 'Subir Currículum',
      languageSettings: 'Configuración de Idioma',
      tonePreference: 'Preferencia de Tono',
      aiProvider: 'Proveedor de IA',
      jobDescription: 'Descripción del Trabajo',
      generateButton: 'Generar Carta de Presentación'
    }
  },
  fr: {
    translation: {
      appName: 'Resume Tailor',
      resumeTab: 'CV',
      generateTab: 'Générer',
      settingsTab: 'Paramètres',
      resultTab: 'Résultat',
      bannerTitle: 'Lettres de Motivation IA en 30 Secondes',
      private: 'Privé',
      offline: 'Hors ligne',
      languages: '12 Langues',
      poweredBy: 'Chrome Built-in AI'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
