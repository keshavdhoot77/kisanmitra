import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wheat } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Wheat className="w-8 h-8 text-primary-300" />
              <span className="font-bold text-2xl tracking-tight">KisanMitra</span>
            </Link>
            <p className="text-primary-100 max-w-sm mb-6 text-lg">
              {t('footer.tagline', 'Empowering farmers with a direct marketplace, connecting local produce to the world.')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary-300">{t('footer.links', 'Quick Links')}</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-primary-100 hover:text-white transition-colors">{t('footer.about', 'About Us')}</Link></li>
              <li><Link to="/marketplace" className="text-primary-100 hover:text-white transition-colors">{t('footer.marketplace', 'Marketplace')}</Link></li>
              <li><Link to="/help" className="text-primary-100 hover:text-white transition-colors">{t('footer.help', 'Help Center')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-primary-300">{t('footer.legal', 'Legal')}</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-primary-100 hover:text-white transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link></li>
              <li><Link to="/terms" className="text-primary-100 hover:text-white transition-colors">{t('footer.terms', 'Terms of Service')}</Link></li>
              <li><Link to="/contact" className="text-primary-100 hover:text-white transition-colors">{t('footer.contact', 'Contact Us')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-200">
            © 2026 KisanMitra. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
