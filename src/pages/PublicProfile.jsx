import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import UserProfile from '../components/profile/UserProfile';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getUserById } from '../services/auth';

export default function PublicProfile() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.data?.user || response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('common.error', 'Error')}</h2>
        <p className="text-gray-500 mb-6">{error || 'User not found'}</p>
        <Link to="/marketplace" className="btn-primary">
          <ArrowLeft className="w-5 h-5" />
          {t('common.back', 'Back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="w-5 h-5" />
        {t('common.back', 'Back')}
      </Link>
      <UserProfile user={user} />
    </div>
  );
}
