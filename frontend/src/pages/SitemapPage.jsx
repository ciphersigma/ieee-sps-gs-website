// src/pages/SitemapPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, FileText, Mail, Award, Camera, Briefcase, GraduationCap } from 'lucide-react';

const SitemapPage = () => {
  const siteStructure = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Research', path: '/research' },
        { name: 'Contact', path: '/contact' },
        { name: 'News', path: '/news' }
      ]
    },
    {
      title: 'Events',
      icon: Calendar,
      links: [
        { name: 'All Events', path: '/events' },
        { name: 'Upcoming Events', path: '/events?filter=upcoming' },
        { name: 'Past Events', path: '/events?filter=past' }
      ]
    },
    {
      title: 'Committee',
      icon: Users,
      links: [
        { name: 'Executive Committee', path: '/committee/executive' },
        { name: 'Past Committee', path: '/committee/past' },
        { name: 'Former Chair', path: '/committee/former-chair' },
        { name: 'Section Chapter Representatives', path: '/committee/SCR-Team' }
      ]
    },
    {
      title: 'Opportunities',
      icon: Briefcase,
      links: [
        { name: 'Conference Grant Scheme', path: '/opportunities/conference-grant' },
        { name: 'Jobs', path: '/opportunities/jobs' },
        { name: 'Internships', path: '/opportunities/internships' },
        { name: 'Research Collaborations', path: '/opportunities/research' }
      ]
    },
    {
      title: 'Student Corner',
      icon: GraduationCap,
      links: [
        { name: 'Student Chapters', path: '/student/chapters' },
        { name: 'Projects', path: '/student/projects' },
        { name: 'Resources', path: '/student/resources' }
      ]
    },
    {
      title: 'Other',
      icon: FileText,
      links: [
        { name: 'Awards', path: '/awards' },
        { name: 'Newsletter', path: '/newsletter' },
        { name: 'Photo Gallery', path: '/gallery' },
        { name: 'Join IEEE SPS Gujarat', path: '/join' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Navigate through all pages and sections of IEEE SPS Gujarat Chapter website
          </p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.path}
                          className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm block py-1"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Website Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-600">Main Sections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-gray-600">Committee Pages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Mobile Friendly</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? 
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SitemapPage;