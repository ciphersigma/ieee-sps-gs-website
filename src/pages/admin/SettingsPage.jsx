// src/pages/admin/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Save, AlertCircle, CheckCircle, Globe, Share2, AtSign, Phone, Mail, Info } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [settings, setSettings] = useState({
    general: {
      siteTitle: '',
      siteDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: ''
    },
    social: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      github: ''
    }
  });
  
  // Fetch settings from Supabase on initial load
  useEffect(() => {
    fetchSettings();
  }, []);
  
  // Function to fetch settings from database
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'site-settings')
        .single();
        
      if (error) {
        // If no settings exist yet, this is expected
        if (error.code === 'PGRST116') {
          console.log('No settings found, will create on first save');
        } else {
          console.error('Error fetching settings:', error);
        }
      } else if (data) {
        // If we have settings data, use it
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change for all setting types
  const handleChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  // Save settings to Supabase
  const saveSettings = async () => {
    try {
      setLoading(true);
      setSaveStatus(null);
      
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 'site-settings',
          settings: settings,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setSaveStatus({ success: true, message: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ success: false, message: `Failed to save settings: ${error.message}` });
    } finally {
      setLoading(false);
      
      // Clear success message after 3 seconds
      if (saveStatus?.success) {
        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      }
    }
  };
  
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage website settings and configurations
            </p>
          </div>
          
          <button
            onClick={saveSettings}
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        
        {/* Status Message */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-md ${saveStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center">
              {saveStatus.success ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
              <p>{saveStatus.message}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('general')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 text-sm font-medium ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 text-sm font-medium ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Social Media
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Loading settings...</span>
              </div>
            )}
            
            {!loading && (
              <>
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-blue-500" />
                      General Information
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Website Title
                        </label>
                        <input
                          type="text"
                          id="siteTitle"
                          value={settings.general.siteTitle}
                          onChange={(e) => handleChange('general', 'siteTitle', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="IEEE Signal Processing Society Gujarat Chapter"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Website Description
                        </label>
                        <textarea
                          id="siteDescription"
                          value={settings.general.siteDescription}
                          onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Advancing the theory and application of signal processing..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="contactEmail"
                            value={settings.general.contactEmail}
                            onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="contact@ieee-sps-gujarat.org"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Phone
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="contactPhone"
                            value={settings.general.contactPhone}
                            onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+91 1234567890"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Info className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="address"
                            value={settings.general.address}
                            onChange={(e) => handleChange('general', 'address', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="DA-IICT, Gandhinagar, Gujarat, India"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Social Media Settings */}
                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-medium text-gray-900 flex items-center">
                      <Share2 className="mr-2 h-5 w-5 text-blue-500" />
                      Social Media Links
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="linkedin"
                            value={settings.social.linkedin}
                            onChange={(e) => handleChange('social', 'linkedin', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/company/ieee-sps-gujarat"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="twitter"
                            value={settings.social.twitter}
                            onChange={(e) => handleChange('social', 'twitter', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://twitter.com/ieee_sps_gujarat"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="facebook"
                            value={settings.social.facebook}
                            onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://facebook.com/ieeespsgujarat"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="instagram"
                            value={settings.social.instagram}
                            onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://instagram.com/ieee_sps_gujarat"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="github"
                            value={settings.social.github}
                            onChange={(e) => handleChange('social', 'github', e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://github.com/ieee-sps-gujarat"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;