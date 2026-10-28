import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Shield, Star, Share2, AlertTriangle, Package, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PriceReferenceWidget from '../components/dashboard/PriceReferenceWidget';
import { useAuth } from '../contexts/AuthContext';
import { getListing } from '../services/listings';
import { createOffer, getOffersForListing, getMyOffers, acceptOffer, rejectOffer, counterOffer, acceptCounterOffer } from '../services/offers';
import { sendMessage } from '../services/chat';
import { toMediaUrl } from '../services/api';

const ListingDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isOwner = Boolean(listing && user && String(listing.seller?._id || listing.seller) === String(user._id));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getListing(id);
      setListing(data.data);
      setOfferPrice(String(data.data.price));
    } catch (error) { toast.error(error.response?.data?.message || t('listing.loadError', 'Could not load listing.')); }
    finally { setLoading(false); }
  }, [id, t]);

  const loadOffers = useCallback(async () => {
    if (!listing || !isAuthenticated) return;
    try {
      if (isOwner) { const { data } = await getOffersForListing(id); setOffers(data.data || []); }
      else { const { data } = await getMyOffers(); setOffers((data.data || []).filter((offer) => String(offer.listing?._id || offer.listing) === String(id))); }
    }
    catch (error) { toast.error(error.response?.data?.message || t('offers.loadError', 'Could not load offers.')); }
  }, [id, listing, isOwner, isAuthenticated, t]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadOffers(); }, [loadOffers]);

  const submitOffer = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    setSubmitting(true);
    try {
      await createOffer({ listing: id, price: Number(offerPrice), quantity: Number(offerQuantity), unit: listing.unit });
      toast.success(t('offers.sent', 'Your offer was sent to the seller.'));
      setOfferQuantity('');
    } catch (error) { toast.error(error.response?.data?.message || t('offers.submitError', 'Could not submit offer.')); }
    finally { setSubmitting(false); }
  };

  const contactSeller = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const { data } = await sendMessage({ recipientId: listing.seller._id, listingId: listing._id, text: `Hello, I’m interested in your listing: ${listing.title}` });
      const conversationId = data.data?.conversation?._id || data.data?.conversationId || data.data?._id;
      if (conversationId) navigate(`/chat/${conversationId}`);
      else navigate('/chat');
    } catch (error) { toast.error(error.response?.data?.message || t('chat.start_error', 'Could not start a conversation.')); }
  };

  const runOfferAction = async (action, offer) => {
    try {
      if (action === 'accept') await acceptOffer(offer._id);
      if (action === 'reject') await rejectOffer(offer._id);
      if (action === 'counter') {
        const price = window.prompt(t('offers.counterPricePrompt', 'Counter price per unit'), String(offer.price));
        if (price === null) return;
        await counterOffer(offer._id, { price: Number(price), quantity: offer.quantity });
      }
      toast.success(action === 'accept' ? t('offers.acceptedOrderCreated', 'Offer accepted and order created.') : t(`offers.action.${action}`, `Offer ${action}ed.`));
      await loadOffers();
      if (action === 'accept') await load();
    } catch (error) { toast.error(error.response?.data?.message || t(`offers.actionError.${action}`, `Could not ${action} offer.`)); }
  };

  if (loading) return <div className="min-h-[50vh] grid place-items-center text-primary-700">{t('listing.loading', 'Loading listing…')}</div>;
  if (!listing) return <div className="min-h-[50vh] grid place-items-center">{t('listing.notFound', 'Listing not found.')}</div>;
  const seller = listing.seller || {};
  const location = listing.location || {};
  const locationText = [location.village, location.taluka, location.district, location.state].filter(Boolean).join(', ') || 'Location not provided';

  return (
    <div className="min-h-screen bg-earth-50 py-8"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6"><p className="text-sm text-gray-500"><Link to="/marketplace">{t('nav.marketplace', 'Marketplace')}</Link> / {t(`categories.${listing.category}`, listing.category)} / <span className="text-gray-900">{listing.title}</span></p><button onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border"><Share2 size={18} /> {t('common.share', 'Share')}</button></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-3xl border"><div className="aspect-video bg-earth-100 rounded-2xl overflow-hidden flex items-center justify-center">{listing.images?.[0] ? <img src={toMediaUrl(listing.images[0])} alt={listing.title} className="w-full h-full object-cover" /> : <span className="text-6xl">🌾</span>}</div></div>
          <section className="bg-white p-6 sm:p-8 rounded-3xl border">
            <div className="flex gap-2 mb-3"><span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold uppercase">{t(`listing.${listing.transactionType}`, listing.transactionType)}</span>{listing.organic && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">{t('listing.organic', 'Organic')}</span>}</div>
            <h1 className="text-3xl font-bold mb-5">{listing.title}</h1>
            <div className="flex flex-wrap items-end gap-5 mb-6 pb-6 border-b"><div><div className="text-4xl font-black text-accent-600">₹{listing.price}</div><div className="text-gray-500">{t('common.per', 'per')} {t(`units.${listing.unit?.toLowerCase()}`, listing.unit)}</div></div><div className="bg-earth-50 px-4 py-2 rounded-xl"><div className="text-sm text-gray-500">{t('listing.availableQuantity', 'Available quantity')}</div><div className="text-xl font-bold">{listing.quantity} {t(`units.${listing.unit?.toLowerCase()}`, listing.unit)}</div></div></div>
            <div className="flex gap-2 text-gray-600 mb-6"><MapPin className="text-primary-600" />{locationText}</div>
            <h2 className="text-xl font-bold mb-2">{t('listing.description', 'Description')}</h2><p className="text-gray-700 whitespace-pre-line">{listing.description || t('listing.noDescription', 'No description provided.')}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">{[[t('listing.variety', 'Variety'), listing.variety], [t('listing.harvestDate', 'Harvest date'), listing.harvestDate], [t('listing.grade', 'Grade'), listing.grade], [t('listing.views', 'Views'), listing.views]].filter(([, value]) => value !== undefined && value !== '').map(([label, value]) => <div key={label} className="bg-earth-50 p-4 rounded-xl"><div className="text-sm text-gray-500">{label}</div><div className="font-semibold">{value}</div></div>)}</div>
          </section>
          {isAuthenticated && offers.length > 0 && <section className="bg-white p-6 rounded-3xl border"><h2 className="text-xl font-bold mb-4">{isOwner ? t('offers.received_count', 'Offers Received ({{count}})', { count: offers.length }) : t('offers.yourOffers', 'Your offers on this listing')}</h2><div className="space-y-3">{offers.map((offer) => <div key={offer._id} className="flex flex-wrap items-center justify-between gap-3 border rounded-xl p-4"><div><div className="font-semibold">{isOwner ? offer.buyer?.name || t('offers.buyer', 'Buyer') : t('offers.yourOffer', 'Your offer')} · ₹{offer.price}/{t(`units.${offer.unit?.toLowerCase()}`, offer.unit)} · {offer.quantity} {t(`units.${offer.unit?.toLowerCase()}`, offer.unit)}</div><div className="text-sm text-gray-500">{t(`offers.${offer.status}`, offer.status)}{offer.counterOffer?.price ? ` · ${t('offers.counter', 'Counter')} ₹${offer.counterOffer.price} ${t('common.for', 'for')} ${offer.counterOffer.quantity} ${t(`units.${offer.unit?.toLowerCase()}`, offer.unit)}` : ''}</div></div>{isOwner && offer.status === 'pending' && <div className="flex gap-2"><button onClick={() => runOfferAction('accept', offer)} className="px-3 py-2 rounded-lg bg-green-600 text-white">{t('offers.accept', 'Accept')}</button><button onClick={() => runOfferAction('counter', offer)} className="px-3 py-2 rounded-lg bg-primary-600 text-white">{t('offers.counter', 'Counter')}</button><button onClick={() => runOfferAction('reject', offer)} className="px-3 py-2 rounded-lg border text-red-600">{t('offers.reject', 'Reject')}</button></div>}{!isOwner && offer.status === 'countered' && <button onClick={() => acceptCounterOffer(offer._id).then(() => { toast.success(t('offers.counterAccepted', 'Counter accepted; order created.')); loadOffers(); load(); }).catch(() => toast.error(t('offers.acceptCounterError', 'Could not accept counter offer.')))} className="px-3 py-2 rounded-lg bg-primary-600 text-white">{t('offers.acceptCounter', 'Accept counter')}</button>}</div>)}</div></section>}
        </div>
        <aside className="space-y-6">
          <PriceReferenceWidget category={listing.category} location={[location.state, location.district].filter(Boolean).join(',')} currentPrice={listing.price} unit={listing.unit} commodity={listing.title} />
          <section className="bg-white p-6 rounded-3xl border"><h2 className="font-bold mb-4">{t('listing.sellerInformation', 'Seller information')}</h2><div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">{seller.name?.[0] || '?'}</div><div><div className="font-semibold flex items-center gap-1">{seller.name || t('orders.seller', 'Seller')}{seller.verifiedIdentity && <Shield size={15} className="text-green-600" />}</div><div className="flex items-center gap-1 text-sm text-gray-500"><Star size={14} className="text-yellow-500" />{seller.rating || t('profile.newSeller', 'New seller')}</div></div></div><button onClick={contactSeller} disabled={isOwner} className="w-full border-2 border-primary-600 text-primary-700 rounded-xl px-4 py-3 font-bold disabled:opacity-50"><MessageCircle className="inline mr-2" size={18} />{t('listing.contactSeller', 'Contact Seller')}</button></section>
          {!isOwner && listing.status === 'active' && <form onSubmit={submitOffer} className="bg-white p-6 rounded-3xl border border-t-4 border-t-accent-500"><h2 className="text-xl font-bold mb-2">{t('offers.make_an_offer', 'Make an offer')}</h2><label className="block text-sm font-semibold mb-1">{t('common.quantity', 'Quantity')} ({t(`units.${listing.unit?.toLowerCase()}`, listing.unit)})</label><input required min="0.01" max={listing.quantity} step="any" type="number" value={offerQuantity} onChange={(e) => setOfferQuantity(e.target.value)} className="w-full mb-3 border rounded-xl p-3"/><label className="block text-sm font-semibold mb-1">{t('common.per', 'Price per')} {t(`units.${listing.unit?.toLowerCase()}`, listing.unit)} (₹)</label><input required min="0.01" step="any" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="w-full mb-4 border rounded-xl p-3"/><button disabled={submitting} className="w-full rounded-xl p-3 font-bold bg-accent-600 text-white disabled:opacity-50">{submitting ? t('offers.sending', 'Sending…') : t('offers.submit_offer', 'Submit Offer')}</button></form>}
        </aside>
      </div>
    </div></div>
  );
};

export default ListingDetail;
