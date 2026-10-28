import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminStats from '../components/admin/AdminStats';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { getAdminStats } from '../services/admin';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { getAdminStats().then(({ data }) => setStats(data.data)).catch(() => setError(t('admin.loadError', 'Could not load admin statistics.'))); }, [t]);
  const cards = stats ? [
    { label: t('admin.total_users', 'Total Users'), value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
    { label: t('admin.total_listings', 'Total Listings'), value: stats.totalListings.toLocaleString(), icon: Package, color: 'green' },
    { label: t('admin.active_orders', 'Active Orders'), value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'orange' },
    { label: t('admin.revenue', 'Completed Order Value'), value: `₹${Number(stats.revenue).toLocaleString()}`, icon: TrendingUp, color: 'purple' },
  ] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto"><h1 className="text-3xl font-bold text-gray-900 mb-8">{t('admin.dashboard', 'Admin Dashboard')}</h1>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {stats ? <><AdminStats stats={cards}/><div className="bg-white rounded-2xl shadow-sm border p-6 mt-8"><h2 className="text-xl font-bold mb-2">{t('admin.marketplaceStatus', 'Marketplace status')}</h2><p>{t('admin.marketplaceStatusSummary', '{{active}} active listings out of {{total}} total.', { active: stats.activeListings, total: stats.totalListings })}</p></div></> : !error && <p>{t('admin.loadingStatistics', 'Loading statistics…')}</p>}
    </div>
  );
}
