// src/components/home/StatsSection.jsx
import React from 'react';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const quickStats = [
    { label: "Active Members", value: "850+", icon: Users },
    { label: "Events This Year", value: "24", icon: Calendar },
    { label: "Research Papers", value: "156", icon: FileText },
    { label: "Site Visits", value: "12.5K", icon: TrendingUp }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <Icon 
                  className="mx-auto mb-3 text-blue-600 dark:text-blue-400" 
                  size={32}
                />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
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