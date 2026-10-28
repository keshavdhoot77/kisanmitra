import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ImageUploader = ({ images = [], onChange, maxImages = 5, label }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const addFiles = (files) => {
    if (!files.length) return;
    if (images.length + files.length > maxImages) {
      alert(t('upload.maxLimit', `You can only upload up to ${maxImages} images`, { limit: maxImages }));
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 9)
    }));

    onChange([...images, ...newImages]);
  };

  const handleFileChange = (e) => {
    addFiles(Array.from(e.target.files || []));
    // reset input
    e.target.value = '';
  };

  const removeImage = (idToRemove) => {
    const removedImage = images.find((img) => img.id === idToRemove);
    if (removedImage?.preview?.startsWith('blob:')) URL.revokeObjectURL(removedImage.preview);
    const updatedImages = images.filter(img => img.id !== idToRemove);
    onChange(updatedImages);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} ({images.length}/{maxImages})
        </label>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group">
            <img 
              src={img.preview || img.url} 
              alt={t('common.preview', 'Preview')} 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(img.id)}
              aria-label={t('common.removeImage', 'Remove image')}
              title={t('common.removeImage', 'Remove image')}
              className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full shadow-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        
      </div>

      {images.length < maxImages && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {t('upload.takePhoto', 'Take a product photo')}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('upload.choosePhoto', 'Choose from device')}
          </button>
        </div>
      )}

      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
