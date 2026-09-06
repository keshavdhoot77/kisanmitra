import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ArrowRight, ArrowLeft, Upload, MapPin } from 'lucide-react';
import PriceReferenceWidget from '../components/dashboard/PriceReferenceWidget';

const CreateListing = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    type: 'sell',
    quantity: '',
    unit: 'Quintal',
    price: '',
    negotiable: true,
    variety: '',
    harvestDate: '',
    grade: 'A',
    organic: false,
    location: '',
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.selectCategory')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['grains', 'vegetables', 'fruits', 'machinery'].map(cat => (
                <div 
                  key={cat}
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.category === cat ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300 bg-white'}`}
                >
                  <div className="text-4xl mb-2">{cat === 'grains' ? '🌾' : cat === 'vegetables' ? '🧅' : cat === 'fruits' ? '🍎' : '🚜'}</div>
                  <div className="font-bold text-gray-800">{t(`categories.${cat}`)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.productDetails')}</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.title')}</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="e.g. Premium Sharbati Wheat" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.description')}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder={t('createListing.descPlaceholder')} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.quantity')}</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.unit')}</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none bg-white">
                  <option value="KG">KG</option>
                  <option value="Quintal">Quintal</option>
                  <option value="Ton">Ton</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.pricing')}</h2>
            
            {formData.category && (
              <PriceReferenceWidget category={formData.category} location={formData.location || 'Maharashtra'} currentPrice={formData.price} />
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('createListing.expectedPrice')} (₹/{formData.unit})</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none text-accent-600" placeholder="0" />
            </div>

            <label className="flex items-center gap-3 p-4 bg-earth-50 rounded-xl cursor-pointer border border-earth-200">
              <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="w-6 h-6 text-primary-600 rounded focus:ring-primary-500" />
              <span className="font-bold text-gray-800 text-lg">{t('createListing.priceNegotiable')}</span>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-2xl font-bold text-gray-900">{t('createListing.qualityMedia')}</h2>
             
             <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
               <Upload size={48} className="mx-auto text-gray-400 mb-4" />
               <p className="text-lg font-bold text-gray-700 mb-2">Upload Photos</p>
               <p className="text-gray-500">Add up to 5 clear photos of your product</p>
             </div>

             <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.variety')}</label>
                  <input name="variety" value={formData.variety} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.grade')}</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none bg-white">
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                  </select>
                </div>
             </div>
          </div>
        );
      case 5:
        return (
           <div className="space-y-6 animate-in fade-in">
             <h2 className="text-2xl font-bold text-gray-900">Location & Publishing</h2>
             
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="location" value={formData.location} onChange={handleChange} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="e.g. Kolhapur, Maharashtra" />
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mt-8">
              <h3 className="font-bold text-lg text-primary-900 mb-2">Ready to publish?</h3>
              <p className="text-primary-700 mb-6">Your listing will be visible to thousands of buyers on KisanMitra.</p>
              
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-4 font-bold text-xl transition-colors shadow-lg">
                Publish Listing
              </button>
            </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps - 1)].map((_, i) => (
              <div key={i} className={`flex-1 h-3 rounded-full mx-1 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          <div className="text-center font-bold text-gray-500 text-sm">Step {step} of {totalSteps - 1}</div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 min-h-[500px] flex flex-col">
          <div className="flex-grow">
            {renderStep()}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft size={20} /> Back
              </button>
            ) : <div></div>}
            
            {step < totalSteps - 1 && (
              <button onClick={nextStep} disabled={step === 1 && !formData.category} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-8 py-3 font-bold transition-colors">
                Next <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
