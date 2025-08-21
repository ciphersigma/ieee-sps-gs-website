// components/contact/ContactForm.jsx
import React, { useState } from 'react';
import { Mail, Phone, User, Building, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';
import emailjs from 'emailjs-com';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Save to Supabase
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            organization: formData.organization || null,
            subject: formData.subject || 'General Inquiry',
            message: formData.message,
            status: 'unread'
          }
        ]);

      if (dbError) {
        throw new Error('Database error: ' + dbError.message);
      }

      // Send email notification using EmailJS
      try {
        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            organization: formData.organization,
            subject: formData.subject || 'General Inquiry',
            message: formData.message,
            to_email: process.env.REACT_APP_CONTACT_EMAIL
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't throw here as the main submission was successful
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field component
  const InputField = ({ icon: Icon, label, name, type = 'text', required = false, rows = null }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        {rows ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={formData[name]}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
              errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
              errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={`Enter your ${label.toLowerCase()}`}
          />
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Get in Touch
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Message sent successfully!</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Thank you for your message. We'll get back to you soon.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Message failed to send</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              There was an error sending your message. Please try again or contact us directly.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            icon={User}
            label="Full Name"
            name="name"
            required
          />
          <InputField
            icon={Mail}
            label="Email Address"
            name="email"
            type="email"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InputField
            icon={Phone}
            label="Phone Number"
            name="phone"
            type="tel"
          />
          <InputField
            icon={Building}
            label="Organization"
            name="organization"
          />
        </div>

        <InputField
          icon={Mail}
          label="Subject"
          name="subject"
        />

        <InputField
          icon={Mail}
          label="Message"
          name="message"
          rows={5}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              contact@ieee-sps-gujarat.org
            </p>
          </div>
          <div>
            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              +91 98765 43210
            </p>
          </div>
          <div>
            <Building className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Office</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Gujarat University
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;