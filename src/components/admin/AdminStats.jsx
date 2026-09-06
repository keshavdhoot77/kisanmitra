import React from 'react';

export default function AdminStats({ stats }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colorMap[stat.color]}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stat.change}</span>
          </div>
          <p className="text-gray-500 font-medium mb-1">{stat.label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
