import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getNotifications, markAllNotificationsRead } from '../../services/notifications';

export default function NotificationBell() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    let active = true;
    setLoading(true);
    getNotifications({ limit: 5 })
      .then(({ data }) => {
        if (!active) return;
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
        setError('');
      })
      .catch(() => {
        if (active) setError(t('notifications.load_error', 'Could not load notifications.'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isOpen, t]);

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      setError(t('notifications.update_error', 'Could not update notifications.'));
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} aria-label={t('notifications.title', 'Notifications')} className="p-2 rounded-full hover:bg-gray-100 relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
          <div className="p-4 border-b flex justify-between bg-gray-50">
            <h3 className="font-bold">{t('notifications.title', 'Notifications')}</h3>
            {unreadCount > 0 && <button onClick={markAllRead} className="text-sm text-primary-600 hover:underline">{t('notifications.mark_all_read', 'Mark all as read')}</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && <p className="p-4 text-sm text-gray-500">{t('common.loading', 'Loading…')}</p>}
            {!loading && error && <p role="alert" className="p-4 text-sm text-red-600">{error}</p>}
            {!loading && !error && notifications.length === 0 && <p className="p-4 text-sm text-gray-500">{t('notifications.empty', 'No notifications yet.')}</p>}
            {!loading && !error && notifications.map(n => (
              <div key={n._id} className={`p-4 border-b flex gap-3 ${!n.read ? 'bg-primary-50/30' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center text-primary-600"><Bell className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
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
