import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyListings, deleteListing, updateListing } from '../services/listings';
import { toMediaUrl } from '../services/api';

const MyListings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadListings = async () => {
    setLoading(true);
    try {
      const { data } = await getMyListings();
      setMyListings((data.data || []).map((listing) => ({ ...listing, id: listing._id, qty: listing.quantity })));
      setError('');
    } catch (e) { setError(e.response?.data?.message || t('listing.loadMineError', 'Could not load your listings.')); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadListings(); }, []);

  const tabs = [
    { id: 'all', label: t('common.all', 'All') },
    { id: 'active', label: t('listing.status.active', 'Active') },
    { id: 'draft', label: t('listing.status.draft', 'Drafts') },
    { id: 'sold', label: t('listing.status.sold', 'Sold') },
  ];

  const handleDelete = async (listing) => {
    if (!window.confirm(t('listing.confirmDelete', 'Delete “{{title}}”?', { title: listing.title }))) return;
    try { await deleteListing(listing.id); toast.success(t('listing.deleted', 'Listing deleted')); await loadListings(); }
    catch (e) { toast.error(e.response?.data?.message || t('listing.deleteError', 'Could not delete listing')); }
  };
  const handleEdit = async (listing) => {
    const title = window.prompt(t('listing.title', 'Listing title'), listing.title);
    if (title === null) return;
    const price = window.prompt(t('listing.pricePerUnit', 'Price per unit'), String(listing.price));
    if (price === null) return;
    const quantity = window.prompt(t('listing.availableQuantity', 'Available quantity'), String(listing.quantity));
    if (quantity === null) return;
    try {
      await updateListing(listing.id, { title: title.trim(), price: Number(price), quantity: Number(quantity) });
      toast.success(t('listing.updated', 'Listing updated'));
      await loadListings();
    } catch (e) { toast.error(e.response?.data?.message || t('listing.updateError', 'Could not update listing')); }
  };

  const filteredListings = activeTab === 'all' ? myListings : myListings.filter(l => l.status === activeTab);

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.myListings', 'My Listings')}</h1>
          <Link to="/create-listing" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors">
            <Plus size={20} /> {t('listing.createListing', 'Create New Listing')}
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listings List */}
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {loading ? <div className="rounded-3xl bg-white p-12 text-center">{t('listing.loadingMine', 'Loading your listings…')}</div> : filteredListings.length === 0 ? (
           <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
             <Package size={64} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">{t('common.noListingsFound', 'No listings found')}</h3>
             <p className="text-gray-500 mb-6">{t('listing.noMine', 'You don’t have any listings.')}</p>
           </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">{t('listing.product', 'Product')}</th>
                    <th className="p-4 font-bold">{t('listing.priceAndQuantity', 'Price & quantity')}</th>
                    <th className="p-4 font-bold">{t('admin.performance', 'Performance')}</th>
                    <th className="p-4 font-bold">{t('common.status', 'Status')}</th>
                    <th className="p-4 font-bold text-right">{t('common.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-earth-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-earth-100 rounded-xl overflow-hidden flex items-center justify-center text-2xl flex-shrink-0">{listing.images?.[0] ? <img src={toMediaUrl(listing.images[0])} alt="" className="w-full h-full object-cover" /> : '🌾'}</div>
                          <div className="font-bold text-gray-900 text-lg">{listing.title}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-accent-600 text-lg">₹{listing.price} / {listing.unit}</div>
                        <div className="text-sm text-gray-500 font-medium">{t('common.quantityShort', 'Qty')}: {listing.qty} {t(`units.${listing.unit?.toLowerCase()}`, listing.unit)}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm font-medium">
                          <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md inline-block w-max">{listing.offersCount || 0} {t('common.offers', 'Offers')}</span>
                          <span className="text-gray-500 flex items-center gap-1"><Eye size={14}/> {listing.views} {t('listing.views', 'Views')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                          listing.status === 'active' ? 'bg-green-100 text-green-700' :
                          listing.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {t(`listing.status.${listing.status}`, listing.status)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(listing)} title={t('common.edit', 'Edit')} aria-label={t('common.edit', 'Edit')} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit size={20} /></button>
                          <Link to={`/listing/${listing.id}`} title={t('common.view', 'View')} aria-label={t('common.view', 'View')} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Eye size={20} /></Link>
                          <button onClick={() => handleDelete(listing)} title={t('common.delete', 'Delete')} aria-label={t('common.delete', 'Delete')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
