import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const ViewCounter = () => {
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track page view and get current count
    trackPageView();
    fetchViewCount();
  }, []);

  const trackPageView = async () => {
    try {
      // Check if this is a unique visitor
      const hasVisited = localStorage.getItem('ieee_sps_visited');
      const isUnique = !hasVisited;
      
      if (isUnique) {
        localStorage.setItem('ieee_sps_visited', 'true');
      }
      
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isUnique })
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const fetchViewCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/views`);
      const data = await response.json();
      setViewCount(data.total_views);
    } catch (error) {
      console.error('Error fetching view count:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <Eye className="h-4 w-4 mr-1" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-gray-400 text-sm hover:text-gray-300 transition-colors">
      <Eye className="h-4 w-4 mr-1" />
      <span>{formatNumber(viewCount)} views</span>
    </div>
  );
};

export default ViewCounter;