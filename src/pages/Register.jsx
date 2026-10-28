import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LocationPicker from '../components/common/LocationPicker';

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    userType: 'buyer',
    state: '', district: '', taluka: '',
    language: currentLanguage || i18n.resolvedLanguage || 'en',
    terms: false
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    // Validation
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        toast.error(t('register.fillAllFields', 'Please fill all fields'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('register.passwordMismatch', 'Passwords do not match'));
        return;
      }
    } else if (step === 2) {
      if (!formData.state) {
        toast.error(t('register.selectLocation', 'Please select your location'));
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.terms) {
      toast.error(t('register.acceptTerms', 'Please accept the terms and conditions'));
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType,
        preferredLanguage: formData.language,
        location: {
          state: ({ MH: 'Maharashtra', UP: 'Uttar Pradesh', MP: 'Madhya Pradesh', BR: 'Bihar', RJ: 'Rajasthan' })[formData.state] || formData.state,
          district: ({ MH_PUN: 'Pune', MH_MUM: 'Mumbai', MH_NAG: 'Nagpur', UP_LKO: 'Lucknow', UP_KAN: 'Kanpur', MP_BHO: 'Bhopal', MP_IND: 'Indore' })[formData.district] || formData.district,
          taluka: formData.taluka
        }
      });
      toast.success(t('register.success', 'Account created successfully!'));
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || t('register.error', 'Failed to create account. Please try again.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Progress Header */}
        <div className="bg-primary-50 p-6 border-b border-primary-100">
          <div className="flex justify-between items-center max-w-lg mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
            <div className={`absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -translate-y-1/2 transition-all duration-300`} style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
            
            {Array.from({ length: totalSteps }, (_, index) => index + 1).map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} shadow-sm transition-colors duration-300`}>
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <h2 className="text-center text-xl font-bold text-gray-900 mt-6">
            {step === 1 && t('register.step1Title', 'Basic Information')}
            {step === 2 && t('register.step3Title', 'Your Location')}
            {step === 3 && t('register.step4Title', 'Preferences & Review')}
          </h2>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder={t('common.fullName', 'Full Name')} value={formData.name} onChange={e => updateForm('name', e.target.value)} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" placeholder={t('common.email', 'Email Address')} value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors" />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="tel" placeholder={t('common.phone', 'Phone Number')} value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="password" placeholder={t('common.password', 'Password')} value={formData.password} onChange={e => updateForm('password', e.target.value)} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="password" placeholder={t('register.confirmPassword', 'Confirm Password')} value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors" />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <LocationPicker value={{ state: formData.state, district: formData.district, taluka: formData.taluka }} onChange={(location) => setFormData((previous) => ({ ...previous, state: location.state, district: location.district, taluka: location.taluka }))} />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('register.languagePreference', 'Language Preference')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'en', label: 'English', flag: '🇬🇧' },
                    { id: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                    { id: 'mr', label: 'मराठी', flag: '🇮🇳' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => { updateForm('language', lang.id); changeLanguage(lang.id); }}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.language === lang.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="font-semibold">{lang.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-earth-50 p-6 rounded-2xl border border-earth-100 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">{t('register.review', 'Review Details')}</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-gray-500">{t('common.name', 'Name')}:</span>
                  <span className="font-medium">{formData.name}</span>
                  
                  <span className="text-gray-500">{t('common.email', 'Email')}:</span>
                  <span className="font-medium">{formData.email}</span>
                  
                  <span className="text-gray-500">{t('common.location', 'Location')}:</span>
                  <span className="font-medium">{formData.district}, {formData.state}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={formData.terms}
                  onChange={e => updateForm('terms', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-gray-600 text-sm">
                  {t('register.termsText', 'I agree to the Terms of Service and Privacy Policy. I confirm that the information provided is accurate.')}
                </label>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> {t('common.back', 'Back')}
            </button>
          ) : (
            <div className="text-sm text-gray-500">
              {t('register.haveAccount', 'Already have an account?')} <Link to="/login" className="text-primary-600 font-bold hover:underline">{t('common.login', 'Login')}</Link>
            </div>
          )}

          {step < totalSteps ? (
            <button 
              onClick={handleNext}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              {t('common.next', 'Next')} <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent-600 hover:bg-accent-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? t('common.loading', 'Processing...') : t('register.createAccount', 'Create Account')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Register;
