import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
];

const stateLanguageMap = {
  'MH': 'mr', // Maharashtra -> Marathi
  'UP': 'hi', // Uttar Pradesh -> Hindi
  'MP': 'hi', // Madhya Pradesh -> Hindi
  'BR': 'hi', // Bihar -> Hindi
  'RJ': 'hi', // Rajasthan -> Hindi
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const suggestLanguageForState = (stateId) => {
    const suggested = stateLanguageMap[stateId];
    if (suggested && suggested !== currentLanguage) {
      return suggested;
    }
    return null;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages: AVAILABLE_LANGUAGES, changeLanguage, suggestLanguageForState }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
