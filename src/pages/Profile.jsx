import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Edit, Star, Package, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import VerificationBadge from '../components/profile/VerificationBadge';
import ListingGrid from '../components/listings/ListingGrid';
import ReviewCard from '../components/reviews/ReviewCard';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/auth';
import { getMyListings } from '../services/listings';
import { getUserReviews } from '../services/reviews';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyListings().then(({ data }) => setListings(data.data || [])).catch(() => setListings([]));
    if (user?._id) getUserReviews(user._id).then(({ data }) => setReviews(data.data || [])).catch(() => setReviews([]));
  }, [user?._id]);

  const editProfile = async () => {
    const name = window.prompt(t('common.yourName', 'Your name'), user?.name || '');
    if (name === null) return;
    const bio = window.prompt(t('profile.aboutYou', 'About you'), user?.bio || '');
    if (bio === null) return;
    setSaving(true);
    try {
      const { data } = await updateProfile({ name: name.trim(), bio });
      updateUser(data.data);
      toast.success(t('profile.updated', 'Profile updated.'));
    } catch { toast.error(t('profile.updateError', 'Could not update profile.')); }
    finally { setSaving(false); }
  };

  if (!user) return null;
  const location = user.location || {};
  const profileLocation = [location.village, location.district, location.state].filter(Boolean).join(', ') || t('location.notSet', 'Location not set');
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : 'en-IN';
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale) : '—';
  const cards = listings.map((listing) => ({ ...listing, id: listing._id, imageUrl: listing.images?.[0], location: [listing.location?.district, listing.location?.state].filter(Boolean).join(', '), categorySlug: listing.subCategory || listing.category }));

  return (
    <div className="min-h-screen bg-earth-50 py-8 px-4"><div className="max-w-5xl mx-auto space-y-6">
      <section className="bg-white rounded-3xl shadow-sm border overflow-hidden"><div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"/><div className="px-6 sm:px-10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-14 mb-6 gap-4"><div className="flex items-end gap-5"><div className="w-24 h-24 rounded-full bg-primary-100 border-4 border-white shadow flex items-center justify-center text-3xl font-bold text-primary-700">{user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover"/> : user.name?.[0]}</div><div className="pb-2"><h1 className="text-3xl font-bold text-gray-900">{user.name}</h1><span className="inline-block bg-earth-100 text-earth-800 px-3 py-1 rounded-full text-sm font-semibold mt-1">{t(`userTypes.${user.userType?.toLowerCase()}`, user.userType || t('common.member', 'Member'))}</span></div></div><button disabled={saving} onClick={editProfile} className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-2 font-semibold flex items-center gap-2 disabled:opacity-50"><Edit className="w-4 h-4"/>{saving ? t('common.saving', 'Saving…') : t('profile.edit', 'Edit Profile')}</button></div>
        <div className="grid md:grid-cols-3 gap-8"><div className="md:col-span-2 space-y-5"><div><h2 className="text-lg font-bold mb-2">{t('profile.about', 'About Me')}</h2><p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{user.bio || t('profile.emptyBioHint', 'Tell buyers a little about yourself by editing your profile.')}</p></div><div className="flex flex-wrap gap-4 text-sm text-gray-600"><span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"><MapPin className="w-4 h-4 text-primary-600"/>{profileLocation}</span><span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"><Calendar className="w-4 h-4 text-primary-600"/>{t('profile.memberSince', 'Member since')} {memberSince}</span></div><div className="flex gap-3"><VerificationBadge type="phone" verified={user.verifiedPhone}/><VerificationBadge type="identity" verified={user.verifiedIdentity}/></div></div>
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 space-y-4"><h2 className="font-bold text-primary-900">{t('profile.stats', 'Activity Stats')}</h2><div className="flex justify-between"><span><Package className="inline w-4 mr-2"/>{t('profile.activeListings', 'Active listings')}</span><b>{listings.filter((item) => item.status === 'active').length}</b></div><div className="flex justify-between"><span><Star className="inline w-4 mr-2"/>{t('profile.rating', 'Rating')}</span><b>{user.rating || 0} ({user.ratingsCount || 0})</b></div><div className="flex justify-between"><span><MessageCircle className="inline w-4 mr-2"/>{t('profile.completedTrades', 'Completed trades')}</span><b>{user.transactionsCount || 0}</b></div></div>
        </div>
      </div></section>
      <section className="bg-white rounded-3xl border overflow-hidden"><div className="flex border-b"><button onClick={() => setActiveTab('listings')} className={`flex-1 py-4 font-bold ${activeTab === 'listings' ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500'}`}>{t('profile.myListings', 'My listings')}</button><button onClick={() => setActiveTab('reviews')} className={`flex-1 py-4 font-bold ${activeTab === 'reviews' ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500'}`}>{t('profile.myReviews', 'My reviews')}</button></div><div className="p-6">{activeTab === 'listings' ? cards.length ? <ListingGrid listings={cards}/> : <div className="text-center py-10 text-gray-500">{t('dashboard.noActiveListings', 'No active listings yet.')} <Link className="text-primary-700" to="/create-listing">{t('common.createOne', 'Create one')}</Link>.</div> : reviews.length ? reviews.map((review) => <ReviewCard key={review._id} review={{ ...review, authorName: review.reviewer?.name || t('common.user', 'User'), date: new Date(review.createdAt).toLocaleDateString(locale) }}/>) : <p className="text-center py-10 text-gray-500">{t('profile.noReviewsReceived', 'No reviews received yet.')}</p>}</div></section>
    </div></div>
  );
};

export default Profile;
