// src/components/common/SimpleViewCounter.jsx
import React from 'react';
import { Eye } from 'lucide-react';

const SimpleViewCounter = () => {
  // Static counter for demo
  const count = 1247;
  
  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <Eye size={16} />
      <span>{count.toLocaleString()} site visits</span>
    </div>
  );
};

export default SimpleViewCounter;