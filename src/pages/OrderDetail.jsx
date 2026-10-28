import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import OrderTimeline from '../components/orders/OrderTimeline';
import ReviewForm from '../components/reviews/ReviewForm';
import { MessageCircle, MapPin, Phone, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getOrder, updateOrderStatus, cancelOrder } from '../services/orders';
import { createReview } from '../services/reviews';
import { sendMessage } from '../services/chat';
import { toMediaUrl } from '../services/api';

export default function OrderDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadOrder = useCallback(async () => {
    try { const { data } = await getOrder(id); setOrder(data.data); }
    catch { toast.error(t('orders.loadError', 'Could not load order.')); }
    finally { setLoading(false); }
  }, [id, t]);
  useEffect(() => { loadOrder(); }, [loadOrder]);

  const updateStatus = async (status) => {
    setBusy(true);
    try { await updateOrderStatus(id, { status }); toast.success(t('orders.statusUpdated', 'Order status updated.')); await loadOrder(); }
    catch { toast.error(t('orders.updateError', 'Could not update order.')); }
    finally { setBusy(false); }
  };
  const doCancel = async () => {
    const reason = window.prompt(t('orders.cancelReasonOptional', 'Reason for cancellation (optional)')) || '';
    setBusy(true);
    try { await cancelOrder(id, { reason }); toast.success(t('orders.cancelledSuccess', 'Order cancelled.')); await loadOrder(); }
    catch { toast.error(t('orders.cancelError', 'Could not cancel order.')); }
    finally { setBusy(false); }
  };
  const messageOtherParty = async () => {
    const isBuyer = String(order.buyer?._id) === String(user?._id);
    const other = isBuyer ? order.seller : order.buyer;
    try {
      const { data } = await sendMessage({ recipientId: other._id, listingId: order.listing?._id, text: t('orders.messageAboutOrder', 'Hello, I’m contacting you about order {{orderNumber}}.', { orderNumber: order.orderNumber }) });
      navigate(`/chat/${data.data.conversation}`);
    } catch { toast.error(t('chat.start_error', 'Could not start a conversation.')); }
  };
  const submitReview = async ({ rating, comment, reviewedUserId }) => {
    try { await createReview({ targetUser: reviewedUserId, order: id, rating, comment }); toast.success(t('reviews.submitted', 'Review submitted.')); }
    catch { toast.error(t('reviews.submitError', 'Could not submit review.')); }
  };

  if (loading) return <div className="p-12 text-center">{t('orders.loading', 'Loading order…')}</div>;
  if (!order) return <div className="p-12 text-center">{t('orders.notFound', 'Order not found.')} <Link to="/orders" className="text-primary-700">{t('orders.backToOrders', 'Back to orders')}</Link></div>;
  const isBuyer = String(order.buyer?._id) === String(user?._id);
  const other = isBuyer ? order.seller : order.buyer;
  const location = other?.location || {};
  const address = [location.village, location.taluka, location.district, location.state].filter(Boolean).join(', ') || 'Location not provided';
  const history = (order.statusHistory || []).map((item) => ({ ...item, timestamp: new Date(item.timestamp).toLocaleString() }));

  return (
    <div className="min-h-screen bg-earth-50 pb-12"><main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">{t('orders.order_id', 'Order')}: {order.orderNumber}</h1><p className="text-gray-500">{t('orders.placed', 'Placed')} {new Date(order.createdAt).toLocaleString(locale)}</p></div><span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-bold uppercase">{t(`orders.${order.status}`, order.status)}</span></div>
      <div className="grid md:grid-cols-3 gap-6"><div className="md:col-span-2 space-y-6">
        <section className="bg-white p-6 rounded-2xl border"><h2 className="text-lg font-bold mb-6">{t('orders.tracking', 'Order Tracking')}</h2><OrderTimeline history={history} currentStatus={order.status}/>{order.status === 'cancelled' && order.cancellationReason && <p className="mt-4 text-red-700">{order.cancellationReason}</p>}</section>
        <section className="bg-white p-6 rounded-2xl border flex gap-4"><div className="w-20 h-20 rounded-xl bg-earth-100 overflow-hidden grid place-items-center">{order.listing?.images?.[0] ? <img src={toMediaUrl(order.listing.images[0])} alt="" className="w-full h-full object-cover"/> : '🌾'}</div><div className="flex-1"><h3 className="font-bold text-lg">{order.listing?.title || t('listing.unavailable', 'Listing unavailable')}</h3><p className="text-gray-600">{order.quantity} {t(`units.${order.unit?.toLowerCase()}`, order.unit)} × ₹{order.agreedPrice}</p></div><div className="text-right"><p className="text-sm">{t('orders.totalAmount', 'Total amount')}</p><p className="text-2xl font-bold text-accent-600">₹{order.totalAmount}</p></div></section>
        {order.status === 'completed' && <section className="bg-white p-6 rounded-2xl border"><ReviewForm orderId={id} reviewedUserId={other?._id} onSubmit={submitReview}/></section>}
        </div><aside className="space-y-6"><section className="bg-white p-6 rounded-2xl border"><h2 className="text-lg font-bold mb-4">{isBuyer ? t('orders.seller', 'Seller') : t('orders.buyer', 'Buyer')} {t('common.information', 'Information')}</h2><div className="space-y-4 text-gray-700"><div className="flex gap-3"><User className="w-5 h-5 text-gray-400"/>{other?.name}</div>{other?.phone && <div className="flex gap-3"><Phone className="w-5 h-5 text-gray-400"/>{other.phone}</div>}<div className="flex gap-3"><MapPin className="w-5 h-5 text-gray-400"/>{address}</div><button onClick={messageOtherParty} className="w-full flex justify-center gap-2 mt-4 bg-primary-50 text-primary-700 hover:bg-primary-100 py-3 rounded-xl font-semibold"><MessageCircle className="w-5 h-5"/>{t('chat.send_message', 'Send Message')}</button></div></section>
        <section className="bg-white p-6 rounded-2xl border space-y-3"><h2 className="text-lg font-bold">{t('common.actions', 'Actions')}</h2>{order.status === 'created' && !isBuyer && <button disabled={busy} onClick={() => updateStatus('confirmed')} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50">{t('orders.confirmOrder', 'Confirm order')}</button>}{order.status === 'confirmed' && !isBuyer && <button disabled={busy} onClick={() => updateStatus('dispatched')} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50">{t('orders.markDispatched', 'Mark as dispatched')}</button>}{order.status === 'dispatched' && isBuyer && <button disabled={busy} onClick={() => updateStatus('delivered')} className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50">{t('orders.confirmDelivery', 'Confirm delivery')}</button>}{order.status === 'delivered' && isBuyer && <button disabled={busy} onClick={() => updateStatus('completed')} className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50">{t('orders.completeOrder', 'Complete order')}</button>}{['created', 'confirmed'].includes(order.status) && <button disabled={busy} onClick={doCancel} className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-xl disabled:opacity-50">{t('orders.cancelOrder', 'Cancel order')}</button>}</section></aside></div>
    </main></div>
  );
}
