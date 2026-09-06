import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const LOCATION_DATA = {
  states: [
    { id: 'MH', name: 'Maharashtra' },
    { id: 'UP', name: 'Uttar Pradesh' },
    { id: 'MP', name: 'Madhya Pradesh' },
    { id: 'BR', name: 'Bihar' },
    { id: 'RJ', name: 'Rajasthan' },
  ],
  districts: {
    'MH': [{ id: 'MH_PUN', name: 'Pune' }, { id: 'MH_MUM', name: 'Mumbai' }, { id: 'MH_NAG', name: 'Nagpur' }],
    'UP': [{ id: 'UP_LKO', name: 'Lucknow' }, { id: 'UP_KAN', name: 'Kanpur' }],
    'MP': [{ id: 'MP_BHO', name: 'Bhopal' }, { id: 'MP_IND', name: 'Indore' }],
  },
  talukas: {
    'MH_PUN': [{ id: 'PUN_HAV', name: 'Haveli' }, { id: 'PUN_KHE', name: 'Khed' }, { id: 'PUN_SHI', name: 'Shirur' }]
  }
};

const LocationPicker = ({ value = {}, onChange, showVillage = false, compact = false }) => {
  const { t } = useTranslation();
  const { suggestLanguageForState, changeLanguage, currentLanguage } = useLanguage();
  
  const [states] = useState(LOCATION_DATA.states);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);

  useEffect(() => {
    if (value.state) {
      setDistricts(LOCATION_DATA.districts[value.state] || []);
    } else {
      setDistricts([]);
    }
    
    if (value.district) {
      setTalukas(LOCATION_DATA.talukas[value.district] || []);
    } else {
      setTalukas([]);
    }
  }, [value.state, value.district]);

  const handleChange = (field, val) => {
    const newValue = { ...value, [field]: val };
    
    if (field === 'state') {
      newValue.district = '';
      newValue.taluka = '';
      newValue.village = '';
      
      const suggestedLang = suggestLanguageForState(val);
      if (suggestedLang && suggestedLang !== currentLanguage) {
         changeLanguage(suggestedLang);
      }
    } else if (field === 'district') {
      newValue.taluka = '';
      newValue.village = '';
    } else if (field === 'taluka') {
      newValue.village = '';
    }
    
    onChange(newValue);
  };

  const selectClasses = `w-full px-4 py-3 text-lg bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors min-h-[48px]`;

  const containerClasses = compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 md:grid-cols-3 gap-4";

  return (
    <div className={containerClasses}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('location.state', 'State')}</label>
        <select 
          value={value.state || ''} 
          onChange={(e) => handleChange('state', e.target.value)}
          className={selectClasses}
        >
          <option value="">{t('location.selectState', 'Select State')}</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('location.district', 'District')}</label>
        <select 
          value={value.district || ''} 
          onChange={(e) => handleChange('district', e.target.value)}
          disabled={!value.state}
          className={`${selectClasses} ${!value.state ? 'bg-gray-50 opacity-75 cursor-not-allowed' : ''}`}
        >
          <option value="">{t('location.selectDistrict', 'Select District')}</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('location.taluka', 'Taluka / Tehsil')}</label>
        <select 
          value={value.taluka || ''} 
          onChange={(e) => handleChange('taluka', e.target.value)}
          disabled={!value.district}
          className={`${selectClasses} ${!value.district ? 'bg-gray-50 opacity-75 cursor-not-allowed' : ''}`}
        >
          <option value="">{t('location.selectTaluka', 'Select Taluka')}</option>
          {talukas.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {showVillage && (
        <div className={compact ? "col-span-2" : ""}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('location.village', 'Village')}</label>
          <input 
            type="text"
            value={value.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            disabled={!value.taluka}
            placeholder={t('location.enterVillage', 'Enter Village name')}
            className={`${selectClasses} ${!value.taluka ? 'bg-gray-50 opacity-75 cursor-not-allowed' : ''}`}
          />
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
