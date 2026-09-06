import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function OrderCard({ order }) {
  const { t } = useTranslation();
  const statusColors = { active: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <Link to={`/orders/${order.id}`} className="block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-4 relative overflow-hidden transition-all">
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${order.status === 'completed' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'}`} />
      <div className="pl-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900">{order.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status]}`}>
            {t(`orders.status.${order.status}`)}
          </span>
        </div>
        <p className="text-gray-600 mb-2">{order.quantity} {order.unit || 'KG'} × ₹{order.price}</p>
        <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-2">
          <div>
            <p className="text-xs text-gray-500">{order.role === 'buyer' ? t('orders.seller') : t('orders.buyer')}</p>
            <p className="font-medium text-gray-900">{order.counterpartName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('orders.total')}</p>
            <p className="text-xl font-bold text-accent-600">₹{order.total}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
