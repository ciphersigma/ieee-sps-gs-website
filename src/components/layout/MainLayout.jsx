// src/components/layout/MainLayout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer'; // Assuming you have a Footer component

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow pt-20 relative z-0"> {/* Explicit z-index of 0 */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;