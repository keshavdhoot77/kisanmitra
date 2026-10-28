import React from 'react';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-earth-50">
      <FarmerDashboard user={user} />
    </div>
  );
};

export default Dashboard;
