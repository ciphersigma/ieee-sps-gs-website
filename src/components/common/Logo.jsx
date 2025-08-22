// src/components/common/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// You'll need to add your logo image to the public/assets directory
// For example: public/assets/images/ieee-sps-logo.png

const Logo = ({ variant = 'default', size = 'md' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <Link to="/" className="flex items-center">
      <img 
        src="src/assets/images/ieee-sps-logo.png" 
        alt="IEEE Signal Processing Society Gujarat Chapter" 
        className={`${currentSize} w-auto`}
      />
    </Link>
  );
};

export default Logo;