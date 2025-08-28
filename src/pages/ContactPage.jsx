// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Send, ExternalLink
} from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Same as About page */}
      <section className="bg-gradient-to-r from-[#8DC63F] to-[#0077B5] text-white py-16 relative overflow-hidden">
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Get in touch with the IEEE Signal Processing Society Gujarat Chapter
          </p>
        </div>
      </section>
      
      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get In Touch</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0077B5]/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-[#0077B5]" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Our Address</h3>
                <p className="text-gray-700">
                  IEEE Gujarat Section Office<br />
                  L.D. College of Engineering Campus<br />
                  Navrangpura, Ahmedabad 380015<br />
                  Gujarat, India
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0077B5]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-[#0077B5]" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Email Us</h3>
                <p className="text-gray-700">
                  <a href="mailto:sps.gujarat@ieee.org" className="text-[#0077B5] hover:underline">sps.gujarat@ieee.org</a><br />
                  <a href="mailto:chair.sps.gujarat@ieee.org" className="text-[#0077B5] hover:underline">chair.sps.gujarat@ieee.org</a>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#0077B5]/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-[#0077B5]" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Call Us</h3>
                <p className="text-gray-700">
                  +91 79 2630 2887<br />
                  <span className="text-sm">(Office Hours: 10:00 AM - 5:00 PM IST)</span>
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {formStatus.submitted ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-2">Thank you for your message!</h3>
                  <p>We've received your inquiry and will get back to you as soon as possible.</p>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0077B5] focus:border-[#0077B5]"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0077B5] focus:border-[#0077B5]"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0077B5] focus:border-[#0077B5]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#0077B5] focus:border-[#0077B5]"
                    ></textarea>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 rounded-lg font-medium bg-[#0077B5] text-white hover:bg-blue-700 transition-colors"
                    >
                      <span>Send Message</span>
                      <Send size={16} className="ml-2" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
            
            <div className="bg-gray-100 rounded-xl overflow-hidden h-96 shadow-md">
              {/* Placeholder for Google Map - You can replace this with actual Google Maps embed */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-600">
                  Google Map will be displayed here. <br />
                  <a 
                    href="https://maps.google.com/?q=L.D.+College+of+Engineering+Ahmedabad" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0077B5] hover:underline inline-flex items-center mt-2"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </p>
              </div>
              
              {/* Uncomment and customize this code to add an actual Google Map
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9228143024354!2d72.54487997483255!3d23.02923307760161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84da5db9339b%3A0xf1b27ec9a6a32a74!2sL.D.%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1692803045595!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Media Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Connect With Us</h2>
            
            <div className="flex justify-center space-x-6">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/ieee-sps-gujarat-section"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:bg-[#0077B5]/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              
              {/* Twitter/X */}
              <a 
                href="https://twitter.com/IEEESPS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/IEEESPS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#1877F2]/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/ieeesps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
            
            <p className="mt-8 text-gray-600">
              Follow us on social media for the latest updates, events, and news from IEEE SPS Gujarat.
            </p>
          </div>
        </div>
      </section>
      
      {/* Join Us CTA - Same as About page */}
      <section className="bg-gradient-to-r from-[#8DC63F] via-[#3FA697] to-[#0077B5] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join IEEE SPS Gujarat
            </h2>
            
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Become a part of our vibrant community and contribute to the advancement of 
              signal processing in Gujarat. Enjoy exclusive benefits, networking opportunities, 
              and access to valuable resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/join" 
                className="bg-white text-[#0077B5] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Become a Member
              </Link>
              
              <Link 
                to="/join#benefits" 
                className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Learn About Benefits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;