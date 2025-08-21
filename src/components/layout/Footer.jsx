// src/components/layout/Footer.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import Logo from '../common/Logo';

const Footer = () => {
  const footerLinks = {
    'Quick Links': ['About', 'Events', 'Research', 'Contact'],
    'Resources': ['Research Papers', 'Technical Reports', 'Career Guide', 'Newsletters'],
    'Connect': ['LinkedIn', 'Twitter', 'GitHub', 'Newsletter']
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <Logo size="lg" />
            <p className="text-gray-400 mt-4 max-w-md">
              Advancing signal processing research and education in Gujarat through innovation, collaboration, and professional development.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-gray-100">{title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors flex items-center space-x-1">
                      <ChevronRight size={14} />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 IEEE Signal Processing Society Gujarat Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;