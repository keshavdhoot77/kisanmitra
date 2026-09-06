import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = (languages && languages.find(l => l.code === currentLanguage)) || {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-primary-50 text-gray-800 hover:text-primary-700 hover:border-primary-300 transition-all font-medium shadow-sm min-h-[44px]"
      >
        <Globe className="w-4 h-4 text-primary-600" />
        <span className="text-base leading-none">{currentLangObj.flag}</span>
        <span className="font-semibold text-sm">{currentLangObj.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Select Language / भाषा निवडा
          </div>
          {(languages || []).map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 hover:bg-primary-50 flex items-center justify-between transition-colors ${
                currentLanguage === lang.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="text-sm leading-tight">{lang.nativeName}</div>
                  <div className="text-xs text-gray-400">{lang.name}</div>
                </div>
              </div>
              {currentLanguage === lang.code && (
                <span className="w-2 h-2 rounded-full bg-primary-600"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
