import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = 2;
  const notifications = [
    { id: 1, title: 'New Offer Received', message: 'Ramesh offered ₹2000 for Wheat.', time: '5m ago', read: false },
    { id: 2, title: 'Order Dispatched', message: 'Your order #123 is on the way.', time: '1h ago', read: false },
    { id: 3, title: 'Welcome', message: 'Complete your profile.', time: '1d ago', read: true }
  ];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Notifications" className="p-2 rounded-full hover:bg-gray-100 relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
          <div className="p-4 border-b flex justify-between bg-gray-50">
            <h3 className="font-bold">{t('notifications.title', 'Notifications')}</h3>
            <button className="text-sm text-primary-600 hover:underline">{t('notifications.mark_all_read', 'Mark all as read')}</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`p-4 border-b flex gap-3 ${!n.read ? 'bg-primary-50/30' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-600"><Bell className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>}
              </div>
            ))}
          </div>
          <div className="p-3 text-center bg-gray-50 border-t">
            <Link to="/notifications" className="text-sm text-primary-600 font-semibold hover:underline">{t('notifications.see_all', 'See all notifications')}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
