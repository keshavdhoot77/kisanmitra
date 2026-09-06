import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OrderTimeline from '../components/orders/OrderTimeline';
import ReviewForm from '../components/reviews/ReviewForm';
import { MessageCircle, MapPin, Phone, User } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [showCancel, setShowCancel] = useState(false);

  const order = {
    id: id || 'ORD-123', status: 'dispatched', role: 'buyer', date: '2023-10-15',
    product: { title: 'Premium Basmati Rice', quantity: 100, unit: 'KG', price: 80, image: 'https://placehold.co/100' },
    total: 8000, counterpart: { id: 'U2', name: 'Kisan Ram', phone: '+91 9876543210', address: 'Village XYZ, Punjab' },
    timeline: [{ status: 'created', timestamp: '2023-10-15 10:00 AM' }, { status: 'confirmed', timestamp: '2023-10-15 11:30 AM' }, { status: 'dispatched', timestamp: '2023-10-16 09:00 AM' }]
  };

  return (
    <div className="min-h-screen bg-earth-50 pb-12">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('orders.order_id')}: {order.id}</h1>
            <p className="text-gray-500">{t('orders.placed_on')} {order.date}</p>
          </div>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold uppercase">{t(`orders.status.${order.status}`)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border"><h2 className="text-lg font-bold mb-6">{t('orders.tracking')}</h2><OrderTimeline history={order.timeline} currentStatus={order.status} /></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex gap-4">
              <img src={order.product.image} alt="product" className="w-20 h-20 rounded-xl" />
              <div className="flex-1"><h3 className="font-bold text-lg">{order.product.title}</h3><p className="text-gray-600">{order.product.quantity} {order.product.unit} × ₹{order.product.price}</p></div>
              <div className="text-right"><p className="text-sm">{t('orders.total')}</p><p className="text-2xl font-bold text-accent-600">₹{order.total}</p></div>
            </div>
            {order.status === 'completed' && <div className="bg-white p-6 rounded-2xl shadow-sm border"><ReviewForm orderId={order.id} reviewedUserId={order.counterpart.id} onSubmit={() => {}} /></div>}
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-bold mb-4">{order.role === 'buyer' ? t('orders.seller_info') : t('orders.buyer_info')}</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex gap-3"><User className="w-5 h-5 text-gray-400" /><span>{order.counterpart.name}</span></div>
                <div className="flex gap-3"><Phone className="w-5 h-5 text-gray-400" /><span>{order.counterpart.phone}</span></div>
                <div className="flex gap-3"><MapPin className="w-5 h-5 text-gray-400" /><span>{order.counterpart.address}</span></div>
                <Link to={`/chat/${order.id}`} className="w-full flex justify-center gap-2 mt-4 bg-primary-50 text-primary-700 py-3 rounded-xl font-semibold"><MessageCircle className="w-5 h-5" /> {t('orders.message')}</Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-3">
              <h2 className="text-lg font-bold">{t('common.actions')}</h2>
              {order.role === 'seller' && order.status === 'confirmed' && <button className="w-full bg-primary-600 text-white py-3 rounded-xl">{t('orders.mark_dispatched')}</button>}
              {order.role === 'buyer' && order.status === 'dispatched' && <button className="w-full bg-green-600 text-white py-3 rounded-xl">{t('orders.confirm_receipt')}</button>}
              {['created', 'confirmed'].includes(order.status) && <button onClick={() => setShowCancel(true)} className="w-full border-2 border-red-100 text-red-600 py-3 rounded-xl">{t('orders.cancel_order')}</button>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
