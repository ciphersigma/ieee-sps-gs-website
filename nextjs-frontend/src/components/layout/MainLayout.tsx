'use client';

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow pt-20 relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;