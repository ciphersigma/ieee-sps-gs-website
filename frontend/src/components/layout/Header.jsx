// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Menu, X, ChevronDown, ChevronRight,
  Calendar, Briefcase, GraduationCap, Award, 
  FileText, Camera, Home, BookOpen, Mail, Users
} from 'lucide-react';
import ImgLogo from "./../../assets/images/ieee-sps-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();
  const menuRef = useRef(null);
  
  // Handle scroll effect with precise scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Store exact scroll position for opacity calculations
      setScrollY(window.scrollY);
      
      // Simple boolean for class toggling
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate header opacity based on scroll position
  const getHeaderOpacity = () => {
    // Start with solid, fade to translucent between 20px and 200px of scroll
    const minScroll = 20;
    const maxScroll = 200;
    
    if (scrollY <= minScroll) return 1; // Fully opaque at top
    if (scrollY >= maxScroll) return 0.85; // 85% opacity when scrolled down
    
    // Linear interpolation between 1 and 0.85
    const scrollRange = maxScroll - minScroll;
    const scrollProgress = (scrollY - minScroll) / scrollRange;
    return 1 - (scrollProgress * 0.15); // Gradually reduce from 1 to 0.85
  };

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
    
    // Add a class to the body for potential global styling during menu open
    document.body.classList.add('menu-open');
  };

  // Close hamburger menu with animation
  const closeHamburgerMenu = () => {
    setMenuVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setHamburgerOpen(false);
      document.body.classList.remove('menu-open');
    }, 400); // Increased duration for smoother exit
  };

  // Toggle dropdown in hamburger menu with staggered animation for child items
  const toggleDropdown = (key) => {
    // Close any other open dropdowns for cleaner UX
    if (!dropdownOpen[key]) {
      const newDropdowns = {};
      Object.keys(dropdownOpen).forEach(k => {
        newDropdowns[k] = k === key;
      });
      newDropdowns[key] = true;
      setDropdownOpen(newDropdowns);
    } else {
      setDropdownOpen(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  // Navigation items
  const mainNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Research', href: '/research', icon: BookOpen },
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
        { name: 'Former Chair', href: '/committee/former-chair' },
        { name: 'Section Chapter Representatives', href: '/committee/SCR-Team' }
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
      className="fixed inset-0 transition-all duration-500 ease-in-out"
      style={{ 
        zIndex: 99999,
        opacity: menuVisible ? 1 : 0,
        visibility: menuVisible ? 'visible' : 'hidden',
      }}
    >
      {/* Backdrop with blur effect for modern look */}
      <div 
        className="absolute inset-0 bg-black transition-all duration-500 ease-in-out backdrop-blur-sm"
        style={{ 
          opacity: menuVisible ? 0.5 : 0,
        }}
        onClick={closeHamburgerMenu}
      ></div>
      
      {/* Menu Panel with smooth sliding animation */}
      <div 
        ref={menuRef}
        className="absolute top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white shadow-2xl overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          transform: menuVisible ? 'translateX(0)' : 'translateX(100%)',
          opacity: menuVisible ? 1 : 0.5,
          boxShadow: menuVisible ? '-10px 0 30px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {/* Menu Header with subtle animation */}
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200"
          style={{
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.1s'
          }}
        >
          <div className="flex items-center">
            <img 
              src={ImgLogo}
              alt="IEEE SPS Gujarat Chapter" 
              className="h-10 w-auto mr-2"
            />
            <h2 className="text-lg font-bold text-gray-900">IEEE SPS Gujarat</h2>
          </div>
          <button
            onClick={closeHamburgerMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Menu Content with staggered animations for each section */}
        <div className="py-4">
          {hamburgerSections.map((section, idx) => (
            <div 
              key={idx} 
              className="mb-4"
              style={{
                opacity: menuVisible ? 1 : 0,
                transform: menuVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: `${0.1 + idx * 0.05}s`
              }}
            >
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
                      className={`flex justify-between items-center w-full px-4 py-2 text-left text-base font-medium transition-all duration-300 ${
                        dropdownOpen[section.key]
                          ? 'text-primary-500 bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                    >
                      <div className="flex items-center">
                        {section.icon && <section.icon className="mr-3 h-5 w-5" />}
                        <span>{section.title}</span>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                          dropdownOpen[section.key] ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown Items with improved height animation and staggered children */}
                    <div 
                      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ 
                        maxHeight: dropdownOpen[section.key] ? `${section.items.length * 40 + 20}px` : '0',
                        opacity: dropdownOpen[section.key] ? 1 : 0,
                      }}
                    >
                      <div className="pl-10 pr-4 py-1 space-y-1">
                        {section.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            to={item.href}
                            className={`block py-2 text-sm font-medium transition-all duration-300 ${
                              isActive(item.href)
                                ? 'text-primary-500'
                                : 'text-gray-600 hover:text-primary-600'
                            }`}
                            onClick={closeHamburgerMenu}
                            style={{
                              opacity: dropdownOpen[section.key] ? 1 : 0,
                              transform: dropdownOpen[section.key] ? 'translateX(0)' : 'translateX(-10px)',
                              transition: 'opacity 0.3s ease, transform 0.3s ease',
                              transitionDelay: `${0.1 + itemIdx * 0.05}s`
                            }}
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
                      className={`flex items-center px-4 py-2 text-base font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-primary-500 bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                      onClick={closeHamburgerMenu}
                      style={{
                        opacity: menuVisible ? 1 : 0,
                        transform: menuVisible ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        transitionDelay: `${0.2 + idx * 0.05 + itemIdx * 0.03}s`
                      }}
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
        
        {/* Menu Footer with button animation */}
        <div 
          className="border-t border-gray-200 p-4"
          style={{
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            transitionDelay: '0.3s'
          }}
        >
          <Link
            to="/join"
            className="block w-full text-center py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 font-medium"
            onClick={closeHamburgerMenu}
          >
            Join IEEE SPS Gujarat
          </Link>
          
          <div className="mt-6 flex justify-center space-x-6">
            <a 
              href="https://linkedin.com/company/ieee-sps-gujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a 
              href="https://twitter.com/ieeeSpsgujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a 
              href="https://instagram.com/ieee_sps_gujarat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 transition-all duration-300 transform hover:scale-110"
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
    <header 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? 'shadow-md backdrop-blur-md' : ''
      }`}
      style={{
        backgroundColor: scrolled 
          ? `rgba(255, 255, 255, ${getHeaderOpacity()})` 
          : 'rgba(255, 255, 255, 1)',
        borderBottom: scrolled ? '1px solid rgba(229, 231, 235, 0.8)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
              src={ImgLogo}
              alt="IEEE SPS Gujarat Chapter" 
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Committee Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('desktop-committee')}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  isActive('/committee') || dropdownOpen['desktop-committee']
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Committee
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${dropdownOpen['desktop-committee'] ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen['desktop-committee'] && (
                <div className="absolute z-[200] left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  {hamburgerSections.find(s => s.key === 'committee').items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                      }`}
                      onClick={() => toggleDropdown('desktop-committee')}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              to="/join"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Join IEEE SPS
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={openHamburgerMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          
          /* Add some global styles for enhanced menu experience */
          body.menu-open {
            position: relative;
          }
          
          /* Improve transitions for buttons */
          button, a {
            transition-property: color, background-color, border-color, transform, scale, opacity;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
          }
          
          /* Enhance hover effects */
          .hover\\:scale-105:hover {
            transform: scale(1.05);
          }
          
          .hover\\:scale-110:hover {
            transform: scale(1.1);
          }
        `
      }} />

      {/* Render Hamburger Menu using createPortal */}
      {hamburgerOpen && createPortal(<HamburgerMenu />, document.body)}
    </header>
  );
};

export default Header;