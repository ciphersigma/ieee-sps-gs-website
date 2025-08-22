// src/components/home/StatsSection.jsx
import React from 'react';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '850+',
      label: 'Active Members',
    },
    {
      icon: Calendar,
      value: '24',
      label: 'Events This Year',
    },
    {
      icon: FileText,
      value: '156',
      label: 'Research Papers',
    },
    {
      icon: TrendingUp,
      value: '12.5K',
      label: 'Site Visits',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-8 text-center transition-transform hover:transform hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="h-10 w-10 text-ieee-blue" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;