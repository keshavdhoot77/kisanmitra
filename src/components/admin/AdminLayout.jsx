import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Users, Package, ShoppingCart, List, BarChart3 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { t } = useTranslation();
  const navItems = [
    { to: '/admin', icon: Home, label: t('admin.dashboard', 'Dashboard') },
    { to: '/admin/users', icon: Users, label: t('admin.users', 'Users') },
    { to: '/admin/listings', icon: Package, label: t('admin.listings', 'Listings') },
    { to: '/admin/orders', icon: ShoppingCart, label: t('admin.orders', 'Orders') },
    { to: '/admin/categories', icon: List, label: t('admin.categories', 'Categories') },
    { to: '/admin/reports', icon: BarChart3, label: t('admin.reports', 'Reports') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6"><h2 className="text-2xl font-bold text-primary-700">KisanMitra Admin</h2></div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
        {navItems.slice(0, 5).map(item => (
          <NavLink key={item.to} to={item.to} end className={({ isActive }) => `p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-500'}`}>
            <item.icon className="w-6 h-6" /><span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
