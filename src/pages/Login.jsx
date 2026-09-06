import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock auth for now
      // await login(formData.email, formData.password);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating network request
      
      toast.success(t('login.success', 'Logged in successfully!'));
      const returnUrl = searchParams.get('returnUrl') || '/dashboard';
      navigate(returnUrl);
    } catch (error) {
      toast.error(t('login.error', 'Invalid email or password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        <div className="bg-primary-600 p-8 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl mb-4">🌾</span>
            <h1 className="text-3xl font-bold mb-2">KisanMitra</h1>
            <p className="text-primary-100">{t('login.welcome', 'Welcome Back')}</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {t('common.email', 'Email Address')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('login.emailPlaceholder', 'Enter your email')}
                  className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex justify-between text-sm font-semibold text-gray-700">
                <span>{t('common.password', 'Password')}</span>
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('login.forgotPassword', 'Forgot Password?')}
                </Link>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('login.passwordPlaceholder', 'Enter your password')}
                  className="w-full pl-12 pr-12 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-4 font-semibold text-lg transition-colors min-h-[48px] shadow-sm hover:shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {t('common.loading', 'Loading...')}
                </>
              ) : (
                t('login.submit', 'Login')
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            {t('login.noAccount', "Don't have an account?")}{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">
              {t('login.registerLink', 'Register')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
