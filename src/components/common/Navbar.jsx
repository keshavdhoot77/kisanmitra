import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wheat, Menu, X, Bell, User, LogOut, Package, ShoppingCart, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.marketplace', 'Marketplace'), path: '/marketplace' },
    ...(isAuthenticated ? [{ name: t('nav.dashboard', 'Dashboard'), path: '/dashboard' }] : []),
  ];

  const userMenuLinks = [
    { name: t('userMenu.profile', 'Profile'), path: '/profile', icon: User },
    { name: t('userMenu.myListings', 'My Listings'), path: '/my-listings', icon: Package },
    { name: t('userMenu.orders', 'Orders'), path: '/orders', icon: ShoppingCart },
    { name: t('userMenu.chat', 'Chat'), path: '/chat', icon: MessageCircle },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Wheat className="w-8 h-8 text-primary-600" />
            <span className="font-bold text-xl text-primary-600 tracking-tight">KisanMitra</span>
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium py-5 border-b-2 transition-colors ${
                  isActive(link.path)
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors relative min-h-[48px] min-w-[48px] flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full"></span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 border-2 border-transparent hover:border-primary-100 rounded-full transition-all min-h-[48px] min-w-[48px]"
                  >
                    <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 mb-2">
                          <p className="text-sm text-gray-500">{t('common.welcome', 'Welcome')},</p>
                          <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        </div>
                        {userMenuLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                              <Icon className="w-5 h-5" />
                              <span>{link.name}</span>
                            </Link>
                          );
                        })}
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>{t('auth.logout', 'Logout')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t('auth.login', 'Login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">{t('auth.register', 'Register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-4/5 max-w-sm h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-xl text-primary-600">KisanMitra</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors min-h-[48px] flex items-center ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="my-4 border-t border-gray-100"></div>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm text-gray-500">{t('common.account', 'Account')}</p>
                  </div>
                  {userMenuLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors min-h-[48px]"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-2 min-h-[48px] w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('auth.logout', 'Logout')}</span>
                  </button>
                </>
              ) : (
                <div className="mt-auto p-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button variant="secondary" fullWidth>{t('auth.login', 'Login')}</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button variant="primary" fullWidth>{t('auth.register', 'Register')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
