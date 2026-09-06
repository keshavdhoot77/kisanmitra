import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Marketplace = lazy(() => import('./pages/Marketplace.jsx'));
const CategoryListings = lazy(() => import('./pages/CategoryListings.jsx'));
const ListingDetail = lazy(() => import('./pages/ListingDetail.jsx'));
const CreateListing = lazy(() => import('./pages/CreateListing.jsx'));
const MyListings = lazy(() => import('./pages/MyListings.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const PublicProfile = lazy(() => import('./pages/PublicProfile.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const OrderDetail = lazy(() => import('./pages/OrderDetail.jsx'));
const Chat = lazy(() => import('./pages/Chat.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <Toaster position="top-center" />
            <div className="flex flex-col min-h-screen bg-earth-50">
              <Navbar />
              <div className="flex-1">
                <Suspense fallback={<div className="flex h-64 items-center justify-center text-xl text-primary-600">Loading...</div>}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/marketplace/:category" element={<CategoryListings />} />
                    <Route path="/listing/:id" element={<ListingDetail />} />
                    <Route path="/profile/:id" element={<PublicProfile />} />

                    {/* Protected Routes */}
                    <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
                    <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    <Route path="/chat/:conversationId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
