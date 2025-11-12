'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  // Size classes
  const sizeClasses = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <Link href="/" className="flex items-center">
      <Image 
        src="/assets/images/ieee-sps-logo.png"
        alt="IEEE Signal Processing Society Gujarat Chapter" 
        width={currentSize}
        height={currentSize}
        className="w-auto"
      />
    </Link>
  );
};

export default Logo;