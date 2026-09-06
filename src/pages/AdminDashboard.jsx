import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../components/admin/AdminLayout';
import AdminStats from '../components/admin/AdminStats';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const stats = [
    { label: t('admin.total_users'), value: '1,245', change: '+12%', icon: Users, color: 'blue' },
    { label: t('admin.total_listings'), value: '4,890', change: '+5%', icon: Package, color: 'green' },
    { label: t('admin.active_orders'), value: '342', change: '+18%', icon: ShoppingCart, color: 'orange' },
    { label: t('admin.revenue'), value: '₹1.2M', change: '+8%', icon: TrendingUp, color: 'purple' }
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('admin.dashboard')}</h1>
        <AdminStats stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">{t('admin.recent_activity')}</h2>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Users className="w-5 h-5 text-gray-500" /></div>
                  <div><p className="text-sm font-medium">New user registered</p><p className="text-xs text-gray-500">2 minutes ago</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">{t('admin.quick_actions')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary-50 text-primary-700 rounded-xl font-semibold">{t('admin.manage_users')}</button>
              <button className="p-4 bg-accent-50 text-accent-700 rounded-xl font-semibold">{t('admin.manage_listings')}</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
