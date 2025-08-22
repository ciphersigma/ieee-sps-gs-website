// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Menu, X, ChevronDown, ChevronRight,
  Calendar, Briefcase, GraduationCap, Award, 
  FileText, Camera, Home, BookOpen, Mail, Users
} from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();
  const menuRef = useRef(null);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu animation timing
  useEffect(() => {
    let timeoutId;
    if (hamburgerOpen) {
      // Small delay to ensure the menu is in the DOM before animating
      timeoutId = setTimeout(() => {
        setMenuVisible(true);
      }, 10);
    }
    return () => clearTimeout(timeoutId);
  }, [hamburgerOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeHamburgerMenu();
      }
    };

    if (hamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hamburgerOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (hamburgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hamburgerOpen]);

  // Open hamburger menu with animation
  const openHamburgerMenu = () => {
    setHamburgerOpen(true);
    // setMenuVisible(true) will be handled by the useEffect
  };

  // Close hamburger menu with animation
  const closeHamburgerMenu = () => {
    setMenuVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setHamburgerOpen(false);
    }, 300); // Match this to your animation duration
  };

  // Toggle dropdown in hamburger menu
  const toggleDropdown = (key) => {
    setDropdownOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Navigation items
  const mainNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Research', href: '/research', icon: BookOpen },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Mail }
  ];

  // Hamburger menu sections
  const hamburgerSections = [
    {
      title: 'Main',
      items: mainNavigation
    },
    {
      title: 'Committee',
      key: 'committee',
      icon: Users,
      items: [
        { name: 'Executive Committee', href: '/committee/executive' },
        { name: 'Past Committee', href: '/committee/past' },
        { name: 'Former Chair', href: '/committee/former-chair' }
      ]
    },
    {
      title: 'Events',
      key: 'events',
      icon: Calendar,
      items: [
        { name: 'Upcoming Events', href: '/events' },
        { name: 'Past Events', href: '/events/past' },
        { name: 'Workshops', href: '/events/workshops' },
        { name: 'Conferences', href: '/events/conferences' }
      ]
    },
    {
      title: 'Opportunities',
      key: 'opportunities',
      icon: Briefcase,
      items: [
        { name: 'Jobs', href: '/opportunities/jobs' },
        { name: 'Internships', href: '/opportunities/internships' },
        { name: 'Research Collaborations', href: '/opportunities/research' }
      ]
    },
    {
      title: 'Student Corner',
      key: 'student',
      icon: GraduationCap,
      items: [
        { name: 'Student Chapters', href: '/student/chapters' },
        { name: 'Projects', href: '/student/projects' },
        { name: 'Resources', href: '/student/resources' }
      ]
    },
    {
      title: 'Other',
      items: [
        { name: 'Awards', href: '/awards', icon: Award },
        { name: 'Newsletter', href: '/newsletter', icon: FileText },
        { name: 'Photo Gallery', href: '/gallery', icon: Camera }
      ]
    }
  ];

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Hamburger menu component as a separate component that will be rendered using createPortal
  const HamburgerMenu = () => (
    <div 
      className="fixed inset-0 transition-opacity duration-300 ease-in-out"
      style={{ 
        zIndex: 99999,
        opacity: menuVisible ? 1 : 0
      }}
    >
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{ opacity: menuVisible ? 0.5 : 0 }}
        onClick={closeHamburgerMenu}
      ></div>
      
      {/* Menu Panel */}
      <div 
        ref={menuRef}
        className="absolute top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out"
        style={{ transform: menuVisible ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src="/assets/images/ieee-sps-logo.png" 
              alt="IEEE SPS Gujarat Chapter" 
              className="h-10 w-auto mr-2"
            />
            <h2 className="text-lg font-bold text-gray-900">IEEE SPS Gujarat</h2>
          </div>
          <button
            onClick={closeHamburgerMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Menu Content */}
        <div className="py-4">
          {hamburgerSections.map((section, idx) => (
            <div key={idx} className="mb-4">
              {section.title && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              
              <div className="space-y-1">
                {section.key ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(section.key)}
                      className={`flex justify-between items-center w-full px-4 py-2 text-left text-base font-medium transition-colors duration-200 ${
                        dropdownOpen[section.key]
                          ? 'text-ieee-green bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-ieee-blue'
                      }`}
                    >
                      <div className="flex items-center">
                        {section.icon && <section.icon className="mr-3 h-5 w-5" />}
                        <span>{section.title}</span>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-transform duration-300 ease-in-out ${dropdownOpen[section.key] ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {/* Dropdown Items with Height Animation */}
                    <div 
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ 
                        maxHeight: dropdownOpen[section.key] ? '500px' : '0',
                        opacity: dropdownOpen[section.key] ? 1 : 0
                      }}
                    >
                      <div className="pl-10 pr-4 py-1 space-y-1">
                        {section.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            to={item.href}
                            className={`block py-2 text-sm font-medium transition-colors duration-200 ${
                              isActive(item.href)
                                ? 'text-ieee-green'
                                : 'text-gray-600 hover:text-ieee-blue'
                            }`}
                            onClick={closeHamburgerMenu}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  section.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-ieee-green bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-ieee-blue'
                      }`}
                      onClick={closeHamburgerMenu}
                    >
                      {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                      <span>{item.name}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Menu Footer */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/join"
            className="block w-full text-center py-2 px-4 bg-ieee-green text-white rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium"
            onClick={closeHamburgerMenu}
          >
            Join IEEE SPS Gujarat
          </Link>
          
          <div className="mt-6 flex justify-center space-x-6">
            <a 
              href="https://linkedin.com/company/ieee-sps-gujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-ieee-blue transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a 
              href="https://twitter.com/ieeeSpsgujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-ieee-blue transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a 
              href="https://instagram.com/ieee_sps_gujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-ieee-blue transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
              src="src/assets/images/ieee-sps-logo.png" 
              alt="IEEE SPS Gujarat Chapter" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'border-ieee-green text-ieee-green'
                    : 'border-transparent text-gray-700 hover:text-ieee-blue hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Committee Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('desktop-committee')}
                className={`px-2 py-1 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center ${
                  isActive('/committee') || dropdownOpen['desktop-committee']
                    ? 'border-ieee-green text-ieee-green'
                    : 'border-transparent text-gray-700 hover:text-ieee-blue hover:border-gray-300'
                }`}
              >
                Committee
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ease-in-out ${dropdownOpen['desktop-committee'] ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen['desktop-committee'] && (
                <div className="absolute z-[200] left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-2 border border-gray-200 animate-fade-in">
                  {hamburgerSections.find(s => s.key === 'committee').items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-ieee-green bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-ieee-blue'
                      }`}
                      onClick={() => toggleDropdown('desktop-committee')}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Join SPS Button */}
            <Link
              to="/join"
              className="ml-4 px-4 py-2 rounded-md bg-ieee-green text-white hover:bg-primary-600 transition-colors duration-200 text-sm font-medium"
            >
              Join SPS
            </Link>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={openHamburgerMenu}
              className="ml-2 p-2 rounded-md text-gray-600 hover:text-ieee-blue hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link
              to="/join"
              className="mr-2 px-4 py-2 rounded-md bg-ieee-green text-white hover:bg-primary-600 transition-colors duration-200 text-sm font-medium"
            >
              Join
            </Link>
            <button
              onClick={openHamburgerMenu}
              className="p-2 rounded-md text-gray-600 hover:text-ieee-blue hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>

      {/* Render Hamburger Menu using createPortal */}
      {hamburgerOpen && createPortal(<HamburgerMenu />, document.body)}
    </header>
  );
};

export default Header;