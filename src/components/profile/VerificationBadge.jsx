import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, ShieldAlert } from 'lucide-react';

const VerificationBadge = ({ type, verified }) => {
  const { t } = useTranslation();

  const getLabel = () => {
    switch (type) {
      case 'phone':
        return t('verification.phone', 'Phone');
      case 'identity':
        return t('verification.identity', 'Identity');
      case 'business':
        return t('verification.business', 'Business');
      default:
        return t('verification.unknown', 'Verification');
    }
  };

  const label = getLabel();

  if (verified) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
        <Shield className="w-4 h-4 fill-green-100 text-green-600" />
        <span>✓ {label} {t('verification.verified', 'Verified')}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-sm font-medium group relative">
      <ShieldAlert className="w-4 h-4 text-gray-400" />
      <span>{label} {t('verification.notVerified', 'Not Verified')}</span>
      {type === 'identity' && (
        <a href="/verify" className="ml-1 text-primary-600 hover:underline hidden group-hover:inline">
          {t('verification.verifyNow', 'Verify Now')}
        </a>
      )}
    </div>
  );
};

export default VerificationBadge;
