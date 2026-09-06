import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

const MyListings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'draft', label: 'Drafts' },
    { id: 'sold', label: 'Sold' },
  ];

  // Mock data
  const myListings = [
    { id: 1, title: 'Premium Sharbati Wheat', price: 2800, unit: 'Quintal', qty: 50, status: 'active', offers: 3, views: 145, img: null },
    { id: 2, title: 'Red Onions', price: 1800, unit: 'Quintal', qty: 20, status: 'active', offers: 0, views: 32, img: null },
    { id: 3, title: 'Massey Tractor', price: '4.5L', unit: 'Piece', qty: 1, status: 'sold', offers: 12, views: 500, img: null },
  ];

  const filteredListings = activeTab === 'all' ? myListings : myListings.filter(l => l.status === activeTab);

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <Link to="/create-listing" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors">
            <Plus size={20} /> Create New Listing
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
        {filteredListings.length === 0 ? (
           <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
             <Package size={64} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
             <p className="text-gray-500 mb-6">You don't have any {activeTab !== 'all' ? activeTab : ''} listings.</p>
           </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Price & Qty</th>
                    <th className="p-4 font-bold">Performance</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-earth-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-earth-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌾</div>
                          <div className="font-bold text-gray-900 text-lg">{listing.title}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-accent-600 text-lg">₹{listing.price} / {listing.unit}</div>
                        <div className="text-sm text-gray-500 font-medium">Qty: {listing.qty} {listing.unit}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm font-medium">
                          <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md inline-block w-max">{listing.offers} Offers</span>
                          <span className="text-gray-500 flex items-center gap-1"><Eye size={14}/> {listing.views} Views</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                          listing.status === 'active' ? 'bg-green-100 text-green-700' :
                          listing.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit size={20} /></button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
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
