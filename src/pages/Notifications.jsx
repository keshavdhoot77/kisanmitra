import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notifications';

export default function Notifications() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await getNotifications();
      setItems(response.data.data.notifications || []);
      setError('');
    } catch (_error) {
      setError(t('notifications.load_error', 'Could not load notifications.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((current) => current.map((item) => item._id === id ? { ...item, read: true } : item));
    } catch (_error) {
      setError(t('notifications.update_error', 'Could not update this notification.'));
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((current) => current.map((item) => ({ ...item, read: true })));
    } catch (_error) {
      setError(t('notifications.update_error', 'Could not update notifications.'));
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('notifications.title', 'Notifications')}</h1>
        <button onClick={markAllRead} disabled={!items.some((item) => !item.read)} className="text-primary-700 font-semibold disabled:opacity-50">
          {t('notifications.mark_all_read', 'Mark all as read')}
        </button>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="text-gray-500">{t('common.loading', 'Loading...')}</p> : (
        <div className="bg-white rounded-2xl border divide-y">
          {items.length === 0 ? <p className="p-8 text-center text-gray-500">{t('notifications.empty', 'You have no notifications.')}</p> : items.map((item) => (
            <article key={item._id} className={`p-5 ${item.read ? '' : 'bg-primary-50/40'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">{item.title}</h2>
                  <p className="text-gray-700 mt-1">{item.message}</p>
                  <time className="text-sm text-gray-500 mt-2 block" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
                </div>
                {!item.read && <button onClick={() => markRead(item._id)} className="text-sm text-primary-700 font-semibold whitespace-nowrap">{t('notifications.mark_read', 'Mark read')}</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
