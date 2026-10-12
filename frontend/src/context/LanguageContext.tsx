import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Brand & Nav
  brand_name: { en: 'MediMind AI', hi: 'मेडीमाइंड एआई' },
  brand_tagline: { en: 'Your Personal Health Assistant', hi: 'आपका व्यक्तिगत स्वास्थ्य सहायक' },
  nav_dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  nav_upload: { en: 'Upload Report', hi: 'रिपोर्ट अपलोड' },
  nav_documents: { en: 'My Documents', hi: 'मेरे दस्तावेज़' },
  nav_chat: { en: 'AI Health Chat', hi: 'एआई स्वास्थ्य चैट' },
  nav_settings: { en: 'Settings', hi: 'सेटिंग्स' },
  nav_logout: { en: 'Sign Out', hi: 'साइन आउट' },

  // Dashboard
  dash_welcome: { en: 'Welcome back', hi: 'वापसी पर स्वागत है' },
  dash_subtitle: { en: 'Here is your unified health overview and clinical insights.', hi: 'यहाँ आपका स्वास्थ्य सारांश और नैदानिक अंतर्दृष्टि है।' },
  dash_total_reports: { en: 'Total Reports', hi: 'कुल रिपोर्ट्स' },
  dash_flagged_markers: { en: 'Biomarkers Flagged', hi: 'चिह्नित बायोमार्कर्स' },
  dash_processing: { en: 'Processing', hi: 'प्रक्रियाधीन' },
  dash_consultations: { en: 'AI Consultations', hi: 'परामर्श सत्र' },
  dash_quick_actions: { en: 'Quick Actions', hi: 'त्वरित क्रियाएं' },
  dash_action_upload: { en: 'Upload Medical Report', hi: 'मेडिकल रिपोर्ट अपलोड करें' },
  dash_action_chat: { en: 'Consult AI Assistant', hi: 'एआई सहायक से पूछें' },
  dash_action_library: { en: 'View All Reports', hi: 'सभी रिपोर्ट्स देखें' },
  dash_recent_reports: { en: 'Recent Medical Reports', hi: 'हाल की मेडिकल रिपोर्ट्स' },
  dash_no_reports: { en: 'No medical reports uploaded yet.', hi: 'अभी तक कोई रिपोर्ट अपलोड नहीं की गई है।' },
  dash_upload_first: { en: 'Upload Your First Report', hi: 'अपनी पहली रिपोर्ट अपलोड करें' },
  dash_disclaimer_title: { en: 'Informational Health Notice', hi: 'सूचनात्मक स्वास्थ्य सूचना' },
  dash_disclaimer_desc: { en: 'MediMind AI provides educational explanations, not medical diagnosis or prescription. Always consult a licensed physician for clinical decisions.', hi: 'मेडीमाइंड एआई केवल शैक्षणिक स्पष्टीकरण प्रदान करता है, कोई चिकित्सकीय निदान या नुस्खा नहीं। नैदानिक निर्णयों के लिए हमेशा डॉक्टर से परामर्श लें।' },
  dash_emergency: { en: 'Emergency? In severe distress, call local emergency services immediately.', hi: 'आपातकालीन स्थिति? गंभीर स्थिति में तुरंत आपातकालीन नंबर पर संपर्क करें।' },

  // Upload
  upload_title: { en: 'Upload Medical Document', hi: 'मेडिकल दस्तावेज़ अपलोड करें' },
  upload_subtitle: { en: 'Securely upload your lab results, prescriptions, or clinical notes for instant AI extraction.', hi: 'त्वरित एआई विश्लेषण के लिए अपनी लैब रिपोर्ट, पर्चे या दस्तावेज़ सुरक्षित अपलोड करें।' },
  upload_drag_drop: { en: 'Drag and drop your medical file here, or', hi: 'अपनी मेडिकल फाइल यहाँ खींचें और छोड़ें, या' },
  upload_browse: { en: 'browse files', hi: 'फाइल चुनें' },
  upload_limits: { en: 'Supported formats: PDF, JPG, JPEG, PNG (Max 25 MB)', hi: 'समर्थित प्रारूप: PDF, JPG, JPEG, PNG (अधिकतम 25 MB)' },
  upload_btn_select: { en: 'Select File', hi: 'फाइल चुनें' },
  upload_btn_submit: { en: 'Analyze Document', hi: 'दस्तावेज़ का विश्लेषण करें' },
  uploading: { en: 'Uploading file securely...', hi: 'फाइल सुरक्षित रूप से अपलोड हो रही है...' },
  upload_pipeline_title: { en: 'AI Extraction Pipeline', hi: 'एआई निष्कर्षण पाइपलाइन' },
  upload_step_1: { en: 'Encrypted storage validation', hi: 'सुरक्षित स्टोरेज सत्यापन' },
  upload_step_2: { en: 'OCR & PDF text extraction', hi: 'ओसीआर और पीडीएफ टेक्स्ट निष्कर्षण' },
  upload_step_3: { en: 'Gemini clinical parameter analysis', hi: 'जेमिनी क्लिनिकल पैरामीटर विश्लेषण' },
  upload_step_4: { en: 'Structured summary ready', hi: 'संरचित सारांश तैयार' },
  upload_status_completed: { en: 'Analysis Complete!', hi: 'विश्लेषण पूरा हुआ!' },
  upload_view_summary: { en: 'View AI Summary', hi: 'एआई सारांश देखें' },
  upload_retry: { en: 'Retry Processing', hi: 'पुनः प्रयास करें' },

  // Documents Library
  doc_title: { en: 'Medical Documents Library', hi: 'मेडिकल दस्तावेज़ लाइब्रेरी' },
  doc_subtitle: { en: 'All your organized records with verified extraction and clinical summaries.', hi: 'सत्यापित निष्कर्षों और सारांशों के साथ आपके सभी स्वास्थ्य रिकॉर्ड।' },
  doc_search_placeholder: { en: 'Search by report name, biomarker, or notes...', hi: 'रिपोर्ट नाम, बायोमार्कर या नोट्स से खोजें...' },
  doc_filter_all: { en: 'All Documents', hi: 'सभी दस्तावेज़' },
  doc_filter_lab: { en: 'Lab Reports', hi: 'लैब रिपोर्ट्स' },
  doc_filter_rx: { en: 'Prescriptions', hi: 'पर्चे (Rx)' },
  doc_filter_discharge: { en: 'Discharge Summaries', hi: 'डिस्चार्ज सारांश' },
  doc_sort_newest: { en: 'Newest First', hi: 'नवीनतम पहले' },
  doc_sort_oldest: { en: 'Oldest First', hi: 'पुरातन पहले' },
  doc_sort_name: { en: 'Name (A-Z)', hi: 'नाम (A-Z)' },
  doc_btn_summary: { en: 'AI Summary', hi: 'एआई सारांश' },
  doc_btn_preview: { en: 'Preview', hi: 'पूर्वावलोकन' },
  doc_btn_delete: { en: 'Delete', hi: 'हटाएं' },
  doc_delete_confirm_title: { en: 'Delete Medical Document?', hi: 'क्या दस्तावेज़ हटाना चाहते हैं?' },
  doc_delete_confirm_desc: { en: 'This will permanently remove the uploaded file and all AI clinical insights. This action cannot be undone.', hi: 'यह अपलोड की गई फाइल और सभी संबंधित एआई निष्कर्षों को स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।' },
  doc_confirm_yes: { en: 'Yes, Delete', hi: 'हाँ, हटाएं' },
  doc_confirm_cancel: { en: 'Cancel', hi: 'रद्द करें' },

  // Summary
  sum_title: { en: 'AI Medical Report Summary', hi: 'एआई मेडिकल रिपोर्ट सारांश' },
  sum_executive: { en: 'Executive Patient Summary', hi: 'मुख्य रोगी सारांश' },
  sum_key_findings: { en: 'Key Clinical Findings', hi: 'मुख्य नैदानिक निष्कर्ष' },
  sum_lab_table: { en: 'Identified Biomarkers & Test Values', hi: 'पहचाने गए बायोमार्कर्स और जांच मान' },
  sum_col_test: { en: 'Test / Biomarker', hi: 'जांच / बायोमार्कर' },
  sum_col_value: { en: 'Result Value', hi: 'प्राप्त मान' },
  sum_col_range: { en: 'Reference Range', hi: 'संदर्भ सीमा' },
  sum_col_status: { en: 'Clinical Status', hi: 'स्थिति' },
  sum_recommendations: { en: 'Recommendations & Care Tips', hi: 'सिफारिशें और देखभाल के सुझाव' },
  sum_doctor_questions: { en: 'Questions to Ask Your Doctor', hi: 'डॉक्टर से पूछने योग्य प्रश्न' },
  sum_citations: { en: 'Source Document Excerpts & Citations', hi: 'मूल दस्तावेज़ के अंश' },
  sum_switch_lang: { en: 'Translate to Hindi', hi: 'अंग्रेजी में देखें (English)' },
  sum_regenerate: { en: 'Regenerate Analysis', hi: 'पुनः विश्लेषण करें' },
  sum_open_chat: { en: 'Discuss in Health Chat', hi: 'स्वास्थ्य चैट में चर्चा करें' },

  // Status Badges
  status_normal: { en: 'Normal', hi: 'सामान्य' },
  status_low: { en: 'Low', hi: 'कम' },
  status_high: { en: 'High', hi: 'अधिक' },
  status_critical: { en: 'Attention', hi: 'ध्यान दें' },
  status_completed: { en: 'Completed', hi: 'सम्पन्न' },
  status_processing: { en: 'Processing', hi: 'प्रक्रियाधीन' },
  status_failed: { en: 'Failed', hi: 'विफल' },
  status_uploaded: { en: 'Uploaded', hi: 'अपलोड हुआ' },

  // Chat
  chat_title: { en: 'MediMind AI Clinical Chatbot', hi: 'मेडीमाइंड एआई क्लिनिकल चैटबॉट' },
  chat_subtitle: { en: 'Grounded conversation with your uploaded medical documents.', hi: 'आपके अपलोड किए गए दस्तावेज़ों पर आधारित संवाद।' },
  chat_new_consultation: { en: 'New Consultation', hi: 'नया परामर्श' },
  chat_attach_document: { en: 'Attach Medical Document', hi: 'मेडिकल दस्तावेज़ जोड़ें' },
  chat_no_document: { en: 'No document attached (General Mode)', hi: 'कोई दस्तावेज़ संलग्न नहीं (सामान्य मोड)' },
  chat_input_placeholder: { en: 'Ask a question about your symptoms, report, or medications...', hi: 'अपने लक्षणों, रिपोर्ट या स्वास्थ्य के बारे में पूछें...' },
  chat_grounded_badge: { en: 'Grounded in Report', hi: 'रिपोर्ट पर आधारित' },
  chat_thinking: { en: 'MediMind is reviewing medical guidelines...', hi: 'मेडीमाइंड चिकित्सा दिशानिर्देशों की समीक्षा कर रहा है...' },
  chat_disclaimer: { en: 'Informational only. In an emergency, please contact a hospital immediately.', hi: 'केवल सूचनात्मक। आपातकाल में तुरंत अस्पताल से संपर्क करें।' },

  // Settings & Profile
  settings_title: { en: 'Account & Clinical Preferences', hi: 'खाता और नैदानिक प्राथमिकताएं' },
  settings_profile_info: { en: 'Personal Health Profile', hi: 'व्यक्तिगत स्वास्थ्य प्रोफ़ाइल' },
  settings_name: { en: 'Full Name', hi: 'पूरा नाम' },
  settings_email: { en: 'Email Address', hi: 'ईमेल पता' },
  settings_age: { en: 'Age', hi: 'आयु' },
  settings_gender: { en: 'Gender', hi: 'लिंग' },
  settings_blood_group: { en: 'Blood Group', hi: 'रक्त समूह' },
  settings_save: { en: 'Save Profile Changes', hi: 'प्रोफ़ाइल सहेजें' },
  settings_pref_title: { en: 'System Preferences', hi: 'सिस्टम प्राथमिकताएं' },
  settings_lang_label: { en: 'Preferred Response Language', hi: 'पसंदीदा प्रतिक्रिया भाषा' },
  settings_theme_label: { en: 'Color Theme', hi: 'रंग थीम' },
  settings_theme_light: { en: 'Light Mode', hi: 'लाइट मोड' },
  settings_theme_dark: { en: 'Dark Mode', hi: 'डार्क मोड' },
  settings_danger_zone: { en: 'Danger Zone', hi: 'महत्वपूर्ण कार्रवाई' },
  settings_delete_account: { en: 'Delete Account & All Medical Data', hi: 'खाता और सभी मेडिकल डेटा हटाएं' },
  settings_delete_warning: { en: 'Once deleted, all uploaded reports, OCR extractions, and consultation histories are permanently wiped.', hi: 'एक बार हटाने के बाद, सभी रिपोर्ट, ओसीआर डेटा और चैट हमेशा के लिए मिट जाएंगे।' },

  // Auth
  auth_login_title: { en: 'Sign in to MediMind AI', hi: 'मेडीमाइंड एआई में साइन इन करें' },
  auth_login_sub: { en: 'Access your private health records and AI assistant.', hi: 'अपने निजी स्वास्थ्य रिकॉर्ड और एआई सहायक तक पहुंचें।' },
  auth_register_title: { en: 'Create Your Health Account', hi: 'अपना स्वास्थ्य खाता बनाएं' },
  auth_register_sub: { en: 'Join MediMind AI for smart medical report clarification.', hi: 'स्मार्ट मेडिकल रिपोर्ट विश्लेषण के लिए मेडीमाइंड से जुड़ें।' },
  auth_password: { en: 'Password', hi: 'पासवर्ड' },
  auth_login_btn: { en: 'Sign In', hi: 'साइन इन करें' },
  auth_register_btn: { en: 'Create Free Account', hi: 'मुफ्त खाता बनाएं' },
  auth_no_account: { en: "Don't have an account?", hi: 'क्या आपके पास खाता नहीं है?' },
  auth_have_account: { en: 'Already have an account?', hi: 'पहले से खाता है?' },
  auth_sign_up_link: { en: 'Register here', hi: 'यहाँ पंजीकरण करें' },
  auth_sign_in_link: { en: 'Sign in here', hi: 'यहाँ साइन इन करें' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('medimind_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medimind_lang', lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
