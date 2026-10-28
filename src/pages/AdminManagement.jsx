import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { getAdminListings, getAdminUsers, updateAdminListing, updateAdminUser } from '../services/admin';

export default function AdminManagement() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isUsers = pathname.endsWith('/users');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = isUsers ? await getAdminUsers({ search, limit: 100 }) : await getAdminListings({ limit: 100 });
      const rows = response.data.data;
      setItems(isUsers ? rows.users || [] : rows.listings || []);
      setError('');
    } catch { setError(t('admin.loadError', 'Could not load this information.')); }
    finally { setLoading(false); }
  };
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [isUsers, search, t]);

  const changeUser = async (user) => {
    const suspended = !user.suspended;
    try { await updateAdminUser(user._id, { suspended }); toast.success(t(suspended ? 'admin.userSuspended' : 'admin.userReactivated', suspended ? 'User suspended.' : 'User reactivated.')); await load(); }
    catch { toast.error(t('admin.updateUserError', 'Could not update user.')); }
  };
  const changeListing = async (listing, status) => {
    try { await updateAdminListing(listing._id, status); toast.success(t('admin.listingStatusUpdated', 'Listing status updated.')); await load(); }
    catch { toast.error(t('admin.updateListingError', 'Could not update listing.')); }
  };

  const headings = isUsers
    ? [t('common.user', 'User'), t('common.type', 'Type'), t('common.joined', 'Joined'), t('common.status', 'Status'), t('common.action', 'Action')]
    : [t('listing.listing', 'Listing'), t('orders.seller', 'Seller'), t('common.price', 'Price'), t('common.status', 'Status'), t('common.action', 'Action')];
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
  const statusText = (status) => t(`listing.status.${status}`, status.replaceAll('_', ' '));

  return <div className="p-6 max-w-7xl mx-auto"><h1 className="text-3xl font-bold mb-6">{t('admin.manage', 'Manage')} {isUsers ? t('admin.users', 'Users') : t('admin.listings', 'Listings')}</h1>
    {isUsers && <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchUsers', 'Search by name or email')} className="w-full max-w-md p-3 border rounded-xl mb-4"/>}
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {loading ? <p className="p-6">{t('common.loading', 'Loading…')}</p> : <div className="bg-white rounded-2xl border overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-50"><tr>{headings.map((heading) => <th key={heading} className="p-4">{heading}</th>)}</tr></thead><tbody className="divide-y">{items.map((item) => <tr key={item._id}>{isUsers ? <><td className="p-4"><div className="font-semibold">{item.name}</div><div className="text-sm text-gray-500">{item.email}</div></td><td className="p-4">{t(`userTypes.${item.userType}`, item.userType)}</td><td className="p-4">{item.createdAt ? new Date(item.createdAt).toLocaleDateString(locale) : '—'}</td><td className="p-4">{item.suspended ? t('admin.suspended', 'Suspended') : t('admin.active', 'Active')}</td><td className="p-4"><button onClick={() => changeUser(item)} className="px-3 py-2 rounded-lg border">{item.suspended ? t('admin.reactivate', 'Reactivate') : t('admin.suspendUser', 'Suspend')}</button></td></> : <><td className="p-4"><div className="font-semibold">{item.title}</div><div className="text-sm text-gray-500">{t(`categories.${item.category}`, item.category)}</div></td><td className="p-4">{item.seller?.name || '—'}</td><td className="p-4">₹{item.price} / {t(`units.${item.unit?.toLowerCase()}`, item.unit)}</td><td className="p-4">{statusText(item.status)}</td><td className="p-4"><select value={item.status} onChange={(e) => changeListing(item, e.target.value)} className="border rounded-lg p-2"><option value="active">{t('admin.active', 'Active')}</option><option value="suspended">{t('admin.suspended', 'Suspended')}</option><option value="pending_approval">{t('admin.pendingApproval', 'Pending approval')}</option><option value="expired">{t('listing.expired', 'Expired')}</option></select></td></>}</tr>)}</tbody></table>{items.length === 0 && <p className="p-8 text-center text-gray-500">{t(isUsers ? 'admin.noUsers' : 'admin.noListings', isUsers ? 'No users found.' : 'No listings found.')}</p>}</div>}
  </div>;
}
