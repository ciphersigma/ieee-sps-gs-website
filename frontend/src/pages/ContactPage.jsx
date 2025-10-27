// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ submitted: false, error: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend or email service
    console.log('Form submitted:', formData);
    
    // Simulate successful submission
    setFormStatus({ submitted: true, error: false });
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus({ submitted: false, error: false });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching other pages */}
      <section className="bg-gradient-to-r from-primary-500 to-blue-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '25px 25px'
          }}></div>
          
          {/* Signal waves */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path 
              d="M0,100 C100,60 200,140 300,100 C400,60 500,140 600,100 C700,60 800,140 900,100 C1000,60 1100,140 1200,100" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.2)" 
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl">
              Get in touch with the IEEE Signal Processing Society Gujarat Chapter.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Back Button - Styled exactly as in your Committee page */}
          <div className="mb-10">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-500 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary-500/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Our Address</h3>
                    <p className="text-gray-600">
                      IEEE Gujarat Section Office<br />
                      <br />
                      Gujarat, India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-500/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-600">
                      <a href="mailto:sps.gujarat@ieee.org" className="hover:text-primary-600">sps.gujarat@ieee.org</a><br />
                      <a href="mailto:chair.sps.gujarat@ieee.org" className="hover:text-primary-600">chair.sps.gujarat@ieee.org</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-500/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600">
                      +91 79 2630 2887<br />
                      <span className="text-sm">(Office Hours: 10:00 AM - 5:00 PM IST)</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Find Us</h3>
                <div className="bg-gray-200 h-64 rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6440478739!2d72.5428433!3d23.0377774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84e8f8295a89%3A0xbbc57db3ec7876e3!2sL.%20D.%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1684342522257!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                Send Us a Message
              </h2>
              
              {formStatus.submitted ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
                    >
                      <span>Send Message</span>
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                <p className="text-gray-600 mb-4">
                  Follow us on social media for the latest updates, events, and news from IEEE SPS Gujarat Chapter.
                </p>
                
                <div className="flex space-x-4">
                  <a 
                    href="https://www.linkedin.com/company/ieee-sps-gujarat-section" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#0077b5] text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://twitter.com/IEEESPS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1DA1F2] text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://www.facebook.com/IEEESPS" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  
                  <a 
                    href="https://www.instagram.com/ieeesps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
