// src/components/layout/NavigationBar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const NavigationBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const location = useLocation();

  // Toggle dropdown menus
  const toggleDropdown = (key) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: false }), {}), // Close all dropdowns
      [key]: !prev[key] // Toggle the clicked one
    }));
  };

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation structure with dropdowns
  const navigationItems = [
    {
      name: 'Events',
      key: 'events',
      children: [
        { name: 'Upcoming Events', href: '/events' },
        { name: 'Past Events', href: '/events/past' },
        { name: 'Workshops', href: '/events/workshops' },
        { name: 'Conferences', href: '/events/conferences' }
      ]
    },
    {
      name: 'Opportunities',
      key: 'opportunities',
      children: [
        { name: 'Jobs', href: '/opportunities/jobs' },
        { name: 'Internships', href: '/opportunities/internships' },
        { name: 'Research Collaborations', href: '/opportunities/research' }
      ]
    },
    {
      name: 'Student Corner',
      key: 'student',
      children: [
        { name: 'Student Chapters', href: '/student/chapters' },
        { name: 'Projects', href: '/student/projects' },
        { name: 'Resources', href: '/student/resources' }
      ]
    },
    { name: 'Awards', href: '/awards' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Photo Gallery', href: '/gallery' }
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8 h-12">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative inline-block text-left">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`flex items-center text-sm font-medium px-1 py-3 transition-colors ${
                      dropdownOpen[item.key] ? 
                        'text-ieee-green' : 
                        'text-gray-700 hover:text-ieee-blue'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen[item.key] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown menu */}
                  {dropdownOpen[item.key] && (
                    <div className="absolute z-10 left-0 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-4 py-2 text-sm ${
                              isActive(child.href) ? 'bg-gray-100 text-ieee-green' : 'text-gray-700 hover:bg-gray-50 hover:text-ieee-blue'
                            }`}
                            onClick={() => toggleDropdown(item.key)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`inline-flex items-center text-sm font-medium px-3 py-3 transition-colors ${
                    isActive(item.href) ? 
                      'text-ieee-green' : 
                      'text-gray-700 hover:text-ieee-blue'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;