import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ImageUploader = ({ images = [], onChange, maxImages = 5, label }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
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
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (idToRemove) => {
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
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(img.id)}
              aria-label="Remove image"
              title="Remove image"
              className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full shadow-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-400 transition-colors gap-2 min-h-[120px]"
          >
            <Camera className="w-8 h-8" />
            <span className="text-sm font-medium">{t('upload.addPhoto', 'Add Photo')}</span>
          </button>
        )}
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
