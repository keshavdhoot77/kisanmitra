import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Star, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import VerificationBadge from './VerificationBadge';
import ListingGrid from '../listings/ListingGrid';
import ReviewCard from '../reviews/ReviewCard';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage } from '../../services/chat';

export default function UserProfile({ user }) {
  const { t, i18n } = useTranslation();
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [startingChat, setStartingChat] = useState(false);
  const location = user.location || {};
  const locationText = [location.village, location.district, location.state].filter(Boolean).join(', ') || t('location.notSet', 'Location not set');
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
  const cards = (user.listings || []).map((listing) => ({ ...listing, id: listing._id, imageUrl: listing.images?.[0], location: [listing.location?.district, listing.location?.state].filter(Boolean).join(', '), categorySlug: listing.subCategory || listing.category }));

  const contactUser = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (String(currentUser?._id) === String(user._id)) return;
    setStartingChat(true);
    try {
      const { data } = await sendMessage({ recipientId: user._id, text: `Hello, I found your profile on KisanMitra and would like to connect.` });
      navigate(`/chat/${data.data.conversation}`);
    } catch { toast.error(t('chat.start_error', 'Could not start a conversation.')); }
    finally { setStartingChat(false); }
  };

  return <div className="bg-earth-50 py-8 px-4"><div className="max-w-5xl mx-auto space-y-6">
    <section className="bg-white rounded-3xl border overflow-hidden"><div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"/><div className="px-6 sm:px-10 pb-8"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-14 mb-6 gap-4"><div className="flex items-end gap-5"><div className="w-24 h-24 rounded-full bg-primary-100 border-4 border-white shadow flex items-center justify-center text-3xl font-bold text-primary-700">{user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover"/> : user.name?.[0]}</div><div className="pb-2"><h1 className="text-3xl font-bold">{user.name}</h1><span className="inline-block bg-earth-100 text-earth-800 px-3 py-1 rounded-full text-sm font-semibold mt-1">{t(`userTypes.${user.userType?.toLowerCase()}`, user.userType || t('common.member', 'Member'))}</span></div></div><button disabled={startingChat || String(currentUser?._id) === String(user._id)} onClick={contactUser} className="bg-accent-600 text-white rounded-xl px-6 py-3 font-semibold flex gap-2 items-center disabled:opacity-50"><MessageCircle className="w-5 h-5"/>{startingChat ? t('common.opening', 'Opening…') : t('profile.contact', 'Contact User')}</button></div>
    <div className="grid md:grid-cols-3 gap-8"><div className="md:col-span-2 space-y-5"><div><h2 className="text-lg font-bold mb-2">{t('profile.about', 'About')}</h2><p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{user.bio || t('profile.noBio', 'No bio has been added.')}</p></div><div className="flex flex-wrap gap-4 text-sm text-gray-600"><span className="flex gap-2 bg-gray-50 px-3 py-2 rounded-lg"><MapPin className="w-4 h-4 text-primary-600"/>{locationText}</span><span className="flex gap-2 bg-gray-50 px-3 py-2 rounded-lg"><Calendar className="w-4 h-4 text-primary-600"/>{t('profile.memberSince', 'Member since')} {user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale) : '—'}</span></div><div className="flex gap-3"><VerificationBadge type="phone" verified={user.verifiedPhone}/><VerificationBadge type="identity" verified={user.verifiedIdentity}/></div></div>
    <div className="bg-gray-50 rounded-2xl p-6 border space-y-4"><h2 className="font-bold">{t('profile.stats', 'Activity Stats')}</h2><div className="flex justify-between">{t('profile.activeListings', 'Active listings')} <b>{user.listingCount || 0}</b></div><div className="flex justify-between"><span><Star className="inline w-4"/> {t('profile.rating', 'Rating')}</span><b>{user.rating || 0} ({user.ratingsCount || 0})</b></div><div className="flex justify-between">{t('profile.completedTrades', 'Completed trades')} <b>{user.transactionsCount || 0}</b></div></div></div></div></section>
    <section className="bg-white rounded-3xl border overflow-hidden"><div className="flex border-b"><button onClick={() => setActiveTab('listings')} className={`flex-1 py-4 font-bold ${activeTab === 'listings' ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500'}`}>{t('profile.publicListings', 'Public Listings')}</button><button onClick={() => setActiveTab('reviews')} className={`flex-1 py-4 font-bold ${activeTab === 'reviews' ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500'}`}>{t('profile.reviewsReceived', 'Reviews')}</button></div><div className="p-6">{activeTab === 'listings' ? cards.length ? <ListingGrid listings={cards}/> : <p className="text-center py-10 text-gray-500">{t('profile.noPublicListings', 'User has no active public listings.')}</p> : user.reviews?.length ? user.reviews.map((review) => <ReviewCard key={review._id} review={{ ...review, authorName: review.reviewer?.name || t('common.user', 'User'), date: new Date(review.createdAt).toLocaleDateString(locale) }}/>) : <p className="text-center py-10 text-gray-500">{t('profile.noReviewsReceived', 'No reviews received yet.')}</p>}</div></section>
  </div></div>;
}
