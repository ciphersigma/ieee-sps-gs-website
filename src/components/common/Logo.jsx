// src/components/common/Logo.jsx
import React from 'react';
// Import the logo image (update the path if needed)
import spsLogo from '../../assets/images/ieee-sps-logo.png'; 

const Logo = ({ size = 'md' }) => {
  // Increased size classes for larger logo
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20'
  };

  return (
    <div className="flex items-center">
      {/* Enlarged logo image without any text */}
      <img 
        src={spsLogo} 
        alt="IEEE Signal Processing Society Gujarat Section" 
        className={`${sizeClasses[size]} w-auto`} 
      />
    </div>
  );
};

export default Logo;