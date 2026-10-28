import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MapPin, Wheat, Carrot, Apple, Bean, CookingPot, Sprout, Tractor, Package } from 'lucide-react';
import PriceReferenceWidget from '../components/dashboard/PriceReferenceWidget';
import { createListing, uploadImages } from '../services/listings';
import ImageUploader from '../components/common/ImageUploader';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreateListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const categoryIcons = {
    grains: Wheat,
    vegetables: Carrot,
    fruits: Apple,
    pulses: Bean,
    spices: CookingPot,
    seeds: Sprout,
    machinery: Tractor,
    others: Package,
  };
  
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
    location: user?.location?.district ? `${user.location.district}, ${user.location.state || ''}` : '',
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

  const publishListing = async () => {
    if (!formData.title.trim() || Number(formData.quantity) <= 0 || Number(formData.price) <= 0) {
      toast.error(t('createListing.requiredFields', 'Add a title, quantity, and price before publishing.'));
      setStep(2);
      return;
    }
    const categoryMap = {
      grains: ['agricultural-produce', 'cereals'], vegetables: ['agricultural-produce', 'vegetables'],
      fruits: ['agricultural-produce', 'fruits'], pulses: ['agricultural-produce', 'pulses'],
      spices: ['agricultural-produce', 'spices'], seeds: ['agri-inputs', 'seeds'],
      machinery: ['machinery', ''], others: ['materials', 'other'],
    };
    const [category, subCategory] = categoryMap[formData.category] || categoryMap.others;
    const parts = formData.location.split(',').map((part) => part.trim()).filter(Boolean);
    const location = parts.length ? { district: parts[0], state: parts[1] || user?.location?.state || '' } : (user?.location || {});
    setSaving(true);
    try {
      let imageUrls = [];
      const imageFiles = images.map((image) => image.file).filter(Boolean);
      if (imageFiles.length) {
        const uploadData = new FormData();
        imageFiles.forEach((file) => uploadData.append('images', file));
        const uploaded = await uploadImages(uploadData);
        imageUrls = uploaded.data.data.urls;
      }
      await createListing({
        title: formData.title.trim(), description: formData.description, category, subCategory,
        transactionType: formData.type, quantity: Number(formData.quantity), unit: formData.unit,
        price: Number(formData.price), negotiable: formData.negotiable, variety: formData.variety,
        harvestDate: formData.harvestDate, grade: formData.grade, organic: formData.organic, location, images: imageUrls,
      });
      toast.success(t('createListing.published', 'Listing published successfully.'));
      navigate('/my-listings');
    } catch (error) { toast.error(error.response?.data?.message || t('createListing.publishError', 'Could not publish listing.')); }
    finally { setSaving(false); }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.selectCategory', 'Select Category')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['grains', 'vegetables', 'fruits', 'pulses', 'spices', 'seeds', 'machinery', 'others'].map((cat) => {
                const CategoryIcon = categoryIcons[cat] || Package;
                return (
                  <div
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.category === cat ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300 bg-white'}`}
                  >
                    <div className="flex justify-center mb-2 text-primary-700"><CategoryIcon size={36} strokeWidth={1.8} /></div>
                    <div className="font-bold text-gray-800">{t(`categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1))}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.productDetails', 'Product Details')}</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.title', 'Title')}</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder={t('createListing.titlePlaceholder', 'e.g. Premium Sharbati Wheat')} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.description', 'Description')}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder={t('createListing.descPlaceholder', 'Describe the quality, harvest condition, packaging etc.')} />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.quantity', 'Quantity')}</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.unit', 'Unit')}</label>
                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none bg-white">
                  <option value="KG">{t('units.kg', 'KG')}</option>
                  <option value="Quintal">{t('units.quintal', 'Quintal')}</option>
                  <option value="Ton">{t('units.ton', 'Ton')}</option>
                  <option value="Piece">{t('units.piece', 'Piece')}</option>
                  <option value="Day">{t('units.day', 'Day')}</option>
                  <option value="Acre">{t('units.acre', 'Acre')}</option>
                  <option value="Hour">{t('units.hour', 'Hour')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.listingType', 'Listing type')}</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                <option value="sell">{t('listing.sell', 'Sell')}</option><option value="buy">{t('listing.buy', 'Buy')}</option><option value="rent">{t('listing.rent', 'Rent')}</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-900">{t('createListing.pricing', 'Pricing')}</h2>
            
            {formData.category && (
              <PriceReferenceWidget category={formData.category} location={[user?.location?.state, user?.location?.district].filter(Boolean).join(',')} currentPrice={formData.price} unit={formData.unit} commodity={formData.title} />
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('createListing.expectedPrice', 'Expected Price')} (₹/{formData.unit})</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none text-accent-600" placeholder="0" />
            </div>

            <label className="flex items-center gap-3 p-4 bg-earth-50 rounded-xl cursor-pointer border border-earth-200">
              <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="w-6 h-6 text-primary-600 rounded focus:ring-primary-500" />
              <span className="font-bold text-gray-800 text-lg">{t('createListing.priceNegotiable', 'Price is negotiable')}</span>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-2xl font-bold text-gray-900">{t('createListing.qualityMedia', 'Quality & Media')}</h2>
             
             <ImageUploader images={images} onChange={setImages} maxImages={5} label={t('createListing.productPhotos', 'Product Photos')} />

             <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.variety')}</label>
                  <input name="variety" value={formData.variety} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('listing.grade')}</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none bg-white">
                    <option value="A">{t('listing.gradeA', 'Grade A (Premium)')}</option>
                    <option value="B">{t('listing.gradeB', 'Grade B (Standard)')}</option>
                  </select>
                </div>
             </div>
          </div>
        );
      case 5:
        return (
           <div className="space-y-6 animate-in fade-in">
             <h2 className="text-2xl font-bold text-gray-900">{t('createListing.locationPublishing', 'Location & Publishing')}</h2>
             
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('common.location', 'Location')}</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="location" value={formData.location} onChange={handleChange} className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder={t('createListing.locationPlaceholder', 'e.g. Kolhapur, Maharashtra')} />
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mt-8">
              <h3 className="font-bold text-lg text-primary-900 mb-2">{t('createListing.readyToPublish', 'Ready to publish?')}</h3>
              <p className="text-primary-700 mb-6">{t('createListing.publishDescription', 'Your listing will be visible to buyers on KisanMitra.')}</p>
              
              <button type="button" onClick={publishListing} disabled={saving} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl px-6 py-4 font-bold text-xl transition-colors shadow-lg">
                {saving ? t('createListing.publishing', 'Publishing…') : t('listing.publish', 'Publish Listing')}
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
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className={`flex-1 h-3 rounded-full mx-1 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          <div className="text-center font-bold text-gray-500 text-sm">{t('common.stepOf', 'Step {{step}} of {{total}}', { step, total: totalSteps })}</div>
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
                <ArrowLeft size={20} /> {t('common.back', 'Back')}
              </button>
            ) : <div></div>}
            
            {step < totalSteps && (
              <button onClick={nextStep} disabled={step === 1 && !formData.category} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-8 py-3 font-bold transition-colors">
                {t('common.next', 'Next')} <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
