import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderCard from '../components/orders/OrderCard';
import { Package } from 'lucide-react';

export default function Orders() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('buyer');
  const [filter, setFilter] = useState('all');

  const orders = [
    { id: '1', role: 'buyer', title: 'Organic Wheat', quantity: 50, price: 2000, total: 100000, status: 'completed', date: '2023-10-01', counterpartName: 'Ramesh Singh' },
    { id: '2', role: 'seller', title: 'Fresh Tomatoes', quantity: 100, price: 40, total: 4000, status: 'active', date: '2023-10-05', counterpartName: 'Suresh Kumar' },
  ];

  const filteredOrders = orders.filter(o => o.role === activeTab && (filter === 'all' || o.status === filter));

  return (
    <div className="min-h-screen bg-earth-50 pb-12">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('orders.title', 'My Orders')}</h1>
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm mb-6 max-w-md">
          <button onClick={() => setActiveTab('buyer')} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-lg transition-colors ${activeTab === 'buyer' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t('orders.as_buyer', 'As Buyer')}</button>
          <button onClick={() => setActiveTab('seller')} className={`flex-1 py-3 px-4 rounded-xl font-semibold text-lg transition-colors ${activeTab === 'seller' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{t('orders.as_seller', 'As Seller')}</button>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'active', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full font-medium whitespace-nowrap border transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
              {t(`orders.filters.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}
            </button>
          ))}
        </div>
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border flex flex-col items-center">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('orders.no_orders', 'No orders found')}</h3>
          </div>
        )}
      </main>
    </div>
  );
}
