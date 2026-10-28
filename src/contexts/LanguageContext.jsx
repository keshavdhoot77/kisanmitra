import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { updateProfile } from '../services/auth';

const LanguageContext = createContext();

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
];

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('language', currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, i18n]);

  const changeLanguage = useCallback((langCode, { persist = true } = {}) => {
    if (!AVAILABLE_LANGUAGES.some((language) => language.code === langCode)) return;
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    if (persist) {
      localStorage.setItem('language-manual', 'true');
      if (localStorage.getItem('token')) {
        updateProfile({ preferredLanguage: langCode }).catch(() => {});
      }
    }
  }, [i18n]);

  const contextValue = useMemo(() => ({ currentLanguage, languages: AVAILABLE_LANGUAGES, changeLanguage }), [currentLanguage, changeLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
