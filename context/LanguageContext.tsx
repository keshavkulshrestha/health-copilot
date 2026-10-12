'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  brand_name: { en: 'kashigha Health AI', hi: 'काशीघा हेल्थ एआई' },
  tagline: { en: 'Your Personal Health Copilot', hi: 'आपका व्यक्तिगत स्वास्थ्य कॉपायलट' },
  nav_dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  nav_upload: { en: 'Upload Report', hi: 'रिपोर्ट अपलोड करें' },
  nav_documents: { en: 'Health Records', hi: 'स्वास्थ्य रिकॉर्ड्स' },
  nav_chat: { en: 'AI Consultation', hi: 'एआई परामर्श' },
  nav_settings: { en: 'Settings', hi: 'सेटिंग्स' },
  dash_welcome: { en: 'Welcome back', hi: 'स्वागत है' },
  dash_subtitle: {
    en: 'Your clinical vitals, lab reports, and AI diagnostic insights in one secure place.',
    hi: 'आपकी नैदानिक रिपोर्ट, लैब परीक्षण और एआई स्वास्थ्य विश्लेषण एक सुरक्षित स्थान पर।',
  },
  dash_disclaimer_title: { en: 'Clinical Guidance Disclaimer', hi: 'चिकित्सीय मार्गदर्शन अस्वीकरण' },
  dash_disclaimer_desc: {
    en: 'kashigha Health AI provides informational clinical guidance. Always consult a licensed medical professional.',
    hi: 'काशीघा हेल्थ एआई केवल सूचनात्मक नैदानिक मार्गदर्शन प्रदान करता है। हमेशा प्रमाणित चिकित्सक से परामर्श लें।',
  },
  dash_emergency: {
    en: 'In medical emergencies, call 112 / 911 immediately.',
    hi: 'चिकित्सा आपात स्थिति में तुरंत 112 डायल करें।',
  },
  dash_total_reports: { en: 'Total Records', hi: 'कुल रिकॉर्ड्स' },
  dash_flagged_markers: { en: 'Flagged Markers', hi: 'चिह्नित पैरामीटर' },
  dash_processing: { en: 'Analyzing', hi: 'विश्लेषण जारी' },
  dash_consultations: { en: 'AI Consultations', hi: 'एआई परामर्श सत्र' },
  dash_quick_actions: { en: 'Quick Actions', hi: 'त्वरित कार्य' },
  dash_action_upload: { en: 'Upload Medical Report', hi: 'मेडिकल रिपोर्ट अपलोड करें' },
  dash_action_chat: { en: 'Ask AI Health Copilot', hi: 'एआई हेल्थ कॉपायलट से पूछें' },
  dash_action_library: { en: 'View All Records', hi: 'सभी रिकॉर्ड्स देखें' },
  dash_recent_reports: { en: 'Recent Medical Reports', hi: 'हाल की मेडिकल रिपोर्टें' },
  dash_no_reports: { en: 'No medical records uploaded yet.', hi: 'अभी तक कोई रिकॉर्ड अपलोड नहीं किया गया।' },
  dash_upload_first: { en: 'Upload Your First Report', hi: 'अपनी पहली रिपोर्ट अपलोड करें' },
  upload_title: { en: 'Upload Medical Record', hi: 'मेडिकल रिकॉर्ड अपलोड करें' },
  upload_subtitle: {
    en: 'Upload laboratory blood tests, prescriptions, or discharge summaries for instant AI synthesis.',
    hi: 'तत्काल एआई विश्लेषण हेतु लैब रिपोर्ट, नुस्खे या डिस्चार्ज सारांश अपलोड करें।',
  },
  upload_drag_drop: { en: 'Drag and drop your report here, or', hi: 'अपनी रिपोर्ट यहाँ खींचें या' },
  upload_browse: { en: 'browse files', hi: 'फ़ाइल चुनें' },
  upload_limits: { en: 'Supports PDF, JPG, PNG up to 25MB', hi: 'पीडीएफ, जेपीजी, पीएनजी समर्थित (अधिकतम 25MB)' },
  upload_btn_submit: { en: 'Upload & Synthesize with Gemini', hi: 'अपलोड करें और जेमिनी से विश्लेषण करें' },
  uploading: { en: 'Synthesizing with Clinical AI...', hi: 'एआई द्वारा विश्लेषण किया जा रहा है...' },
  upload_pipeline_title: { en: 'Real-Time Clinical Processing Pipeline', hi: 'रीयल-टाइम क्लिनिकल प्रोसेसिंग पाइपलाइन' },
  upload_status_completed: { en: 'Analysis Complete & Verified', hi: 'विश्लेषण पूर्ण एवं सत्यापित' },
  upload_view_summary: { en: 'View Full Report', hi: 'पूर्ण रिपोर्ट देखें' },
  summary_title: { en: 'Medical Report Synthesis', hi: 'मेडिकल रिपोर्ट सारांश' },
  summary_key_findings: { en: 'Key Clinical Findings', hi: 'मुख्य नैदानिक निष्कर्ष' },
  summary_lab_values: { en: 'Extracted Biomarkers & Lab Values', hi: 'निष्कर्षित बायोमार्कर एवं परीक्षण परिणाम' },
  summary_medicines: { en: 'Prescribed Medications', hi: 'निर्धारित दवाएं' },
  summary_lifestyle: { en: 'Dietary & Lifestyle Recommendations', hi: 'आहार एवं जीवनशैली सुझाव' },
  summary_doctor_questions: { en: 'Recommended Questions for Your Doctor', hi: 'डॉक्टर से पूछने योग्य प्रश्न' },
  chat_title: { en: 'AI Health Copilot Consultation', hi: 'एआई हेल्थ कॉपायलट परामर्श' },
  chat_disclaimer: {
    en: 'AI provides educational clarity grounded strictly in your medical records.',
    hi: 'एआई केवल आपके रिकॉर्ड के आधार पर शैक्षणिक स्पष्टीकरण प्रदान करता है।',
  },
  chat_thinking: { en: 'Compounding clinical response...', hi: 'क्लिनिकल उत्तर तैयार किया जा रहा है...' },
  chat_input_placeholder: {
    en: 'Ask a question about your report in English or हिंदी...',
    hi: 'अपनी रिपोर्ट के बारे में अंग्रेजी या हिंदी में प्रश्न पूछें...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medimind_lang') as Language;
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      }
    } catch (e) {
      // safe fallback on SSR
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('medimind_lang', lang);
    } catch (e) {
      // safe fallback
    }
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
