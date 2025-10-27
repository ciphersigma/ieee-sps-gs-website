// src/components/common/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/ieee-sps-logo.png'; // Import the image directly

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
        src={logoImage} // Use the imported image
        alt="IEEE Signal Processing Society Gujarat Chapter" 
        className={`${currentSize} w-auto`}
      />
    </Link>
  );
};

export default Logo;