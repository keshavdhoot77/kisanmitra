import React from 'react';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';

const Dashboard = () => {
  // Mock user data. In real app, fetch from auth context
  const user = {
    name: 'Ramesh Patil',
    role: 'farmer'
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <FarmerDashboard user={user} />
    </div>
  );
};

export default Dashboard;
