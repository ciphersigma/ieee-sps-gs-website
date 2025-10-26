// src/components/home/ContactSection.jsx
import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Mail, Phone, MapPin, Send, Linkedin, Twitter, Facebook, 
  Instagram, CheckCircle, AlertCircle 
} from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setFormStatus(null);
      
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill out all required fields');
      }
      
      // Submit to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);
      
      if (error) throw error;
      
      // Success
      setFormStatus({
        type: 'success',
        message: 'Your message has been sent! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormStatus({
        type: 'error',
        message: err.message || 'Failed to send message. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Contact Us
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with the IEEE Signal Processing Society Gujarat Chapter
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <a 
                      href="mailto:contact@ieee-sps-gujarat.org" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      contact@ieee-sps-gujarat.org
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <a 
                      href="tel:+919586356174" 
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      +91 95863 56174
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">
                      Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.linkedin.com/company/ieee-sps-gujarat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://twitter.com/ieee_sps_gujarat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://facebook.com/ieeespsgujarat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="https://instagram.com/ieee_sps_gujarat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Send Us a Message
              </h3>
              
              {/* Form Status */}
              {formStatus && (
                <div className={`mb-6 p-4 rounded-md ${
                  formStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {formStatus.type === 'success' ? 
                      <CheckCircle className="h-5 w-5 mr-2" /> : 
                      <AlertCircle className="h-5 w-5 mr-2" />
                    }
                    <p>{formStatus.message}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="How can we help you?"
                  />
                </div>
                
                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
