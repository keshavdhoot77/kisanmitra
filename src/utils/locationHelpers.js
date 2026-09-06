import { states, districts, talukas, stateLanguageMap } from '../data/locations';

export const getStateName = (stateId, lang = 'en') => {
  const state = states.find((s) => s.id === stateId);
  if (!state) return stateId;
  if (lang === 'hi' && state.nameHi) return state.nameHi;
  if (lang === 'mr' && state.nameMr) return state.nameMr;
  return state.name;
};

export const getDistrictName = (stateId, districtId, lang = 'en') => {
  const stateDistricts = districts[stateId];
  if (!stateDistricts) return districtId;
  const district = stateDistricts.find((d) => d.id === districtId);
  if (!district) return districtId;
  if (lang === 'hi' && district.nameHi) return district.nameHi;
  if (lang === 'mr' && district.nameMr) return district.nameMr;
  return district.name;
};

export const getSuggestedLanguage = (stateId) => {
  return stateLanguageMap[stateId] || 'hi'; // Default to Hindi if not mapped
};

export const formatLocation = (location) => {
  if (!location) return '';
  const parts = [];
  if (location.village) parts.push(location.village);
  if (location.taluka) parts.push(location.taluka);
  if (location.district) parts.push(getDistrictName(location.state, location.district));
  if (location.state) parts.push(getStateName(location.state));
  return parts.join(', ');
};
