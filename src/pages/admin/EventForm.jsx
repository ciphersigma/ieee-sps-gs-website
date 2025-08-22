// components/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Upload, X, Link as LinkIcon, Tag, AlertTriangle } from 'lucide-react';
import { createEvent, updateEvent, getEventById } from '../../services/eventService';
import { uploadEventPoster, checkStorageAccess } from '../../services/storageService';
import { STORAGE_BUCKET } from '../../services/storageService';
import { supabase } from '../../services/supabase';

const EVENT_TYPES = [
  'Workshop',
  'Lecture',
  'Competition',
  'Conference',
  'Webinar',
  'Seminar',
  'Other'
];

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing events
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    event_type: 'Workshop',
    registration_url: '',
    is_featured: false,
    status: 'upcoming'
  });
  
  // UI state
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [storageStatus, setStorageStatus] = useState({ checking: true, error: null, details: null });
  const [successMessage, setSuccessMessage] = useState('');
  
  // Check storage access
  useEffect(() => {
    const checkStorage = async () => {
      setStorageStatus({ checking: true, error: null, details: null });
      const { exists, error, details } = await checkStorageAccess();
      
      if (error) {
        console.error('Storage access error:', error);
      }
      
      setStorageStatus({ 
        checking: false, 
        error: error ? error.message : null,
        details: details
      });
    };
    
    checkStorage();
  }, []);
  
  // Load existing event data if in edit mode
  useEffect(() => {
    const loadEvent = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const { data, error } = await getEventById(id);
          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              event_date: data.event_date || data.date || '',
              event_time: data.event_time || data.time || '',
              location: data.location || '',
              event_type: data.event_type || data.type || 'Workshop',
              registration_url: data.registration_url || '',
              is_featured: data.featured || false,
              status: data.status || 'upcoming'
            });
            
            if (data.image_url) {
              setPosterPreview(data.image_url);
            } else if (data.image) {
              setPosterPreview(data.image);
            }
          }
        } catch (err) {
          console.error('Error loading event:', err);
          setError('Failed to load event details');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadEvent();
  }, [id, isEditMode]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle poster file selection
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, WebP, or GIF image');
      return;
    }
    
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }
    
    setPosterFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPosterPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove poster preview
  const handleRemovePoster = () => {
    setPosterFile(null);
    
    // If we're editing and there was an existing poster, keep it
    if (isEditMode && (formData.image_url || formData.image)) {
      setPosterPreview(formData.image_url || formData.image);
    } else {
      setPosterPreview('');
    }
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.event_date) {
      setError('Date is required');
      return false;
    }
    
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    
    if (formData.registration_url && !isValidUrl(formData.registration_url)) {
      setError('Please enter a valid registration URL');
      return false;
    }
    
    return true;
  };
  
  // Check if URL is valid
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Test storage upload (debug function)
  const testStorageUpload = async () => {
    if (!posterFile) {
      setError('Please select a file first');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // First, check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        throw new Error('Authentication required: ' + (authError ? authError.message : 'No active session'));
      }
      
      console.log('Authenticated as:', session.user.email);
      
      // Test the upload
      const { url, error: uploadError } = await uploadEventPoster(posterFile);
      
      if (uploadError) {
        throw new Error('Upload failed: ' + uploadError.message);
      }
      
      setSuccessMessage(`Test upload successful! URL: ${url}`);
      console.log('Upload success, URL:', url);
      
    } catch (err) {
      console.error('Test upload error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  setError('');
  
  try {
    // First, make sure we have a date value
    if (!formData.event_date) {
      throw new Error('Date is required');
    }
    
    // Try to upload the poster if provided
    let imageUrl = null;
    if (posterFile) {
      const { url, error: uploadError } = await uploadEventPoster(posterFile);
      
      if (uploadError) {
        throw new Error(`Failed to upload poster: ${uploadError.message}`);
      }
      
      imageUrl = url;
    }
    
    // Create a database-compatible object with explicit date values
    const eventData = {
      title: formData.title,
      description: formData.description,
      // Ensure date is set (required field)
      date: formData.event_date,
      time: formData.event_time, 
      location: formData.location,
      type: formData.event_type,
      featured: formData.is_featured,
      // Images
      image: imageUrl,
      image_url: imageUrl,
      poster_url: imageUrl,
      // Other fields
      current_participants: 0,
      event_date: formData.event_date, // Also set event_date
      event_time: formData.event_time,
      event_type: formData.event_type,
      registration_url: formData.registration_url
    };
    
    console.log('Event data to submit:', eventData);
    
    // Direct Supabase call to avoid any issues
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
    
    // Success! Show message and redirect
    setSuccessMessage(`Event successfully created!`);
    setTimeout(() => {
      navigate('/admin/events');
    }, 1500);
    
  } catch (err) {
    console.error('Error saving event:', err);
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Event' : 'Create New Event'}
      </h1>
      
      {/* Storage Status Message */}
      {storageStatus.checking ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Checking storage access...</p>
            </div>
          </div>
        </div>
      ) : storageStatus.error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Storage Access Issue</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{storageStatus.error}</p>
                {storageStatus.details && (
                  <p className="mt-1 text-xs">{storageStatus.details}</p>
                )}
                <div className="mt-3">
                  <p className="font-medium">Make sure:</p>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    <li>The '{STORAGE_BUCKET}' bucket exists in your Supabase project</li>
                    <li>You've set the proper access policies for the bucket</li>
                    <li>You are signed in to your Supabase account</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Storage is accessible. {storageStatus.details}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter event title"
            required
          />
        </div>
        
        {/* Date and Time */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="event_time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <input
                type="time"
                id="event_time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter event location"
              required
            />
          </div>
        </div>
        
        {/* Event Type */}
        <div>
          <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={16} className="text-gray-400" />
            </div>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Registration URL */}
        <div>
          <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700">
            Registration Link
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="url"
              id="registration_url"
              name="registration_url"
              value={formData.registration_url}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://..."
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Link to external registration page (optional)
          </p>
        </div>
        
        {/* Featured Checkbox */}
        <div>
          <div className="flex items-center">
            <input
              id="is_featured"
              name="is_featured"
              type="checkbox"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Feature this event on homepage
            </label>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter event description"
          />
        </div>
        
        {/* Event Poster */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Poster
          </label>
          
          <div className="flex items-center space-x-6">
            {/* Poster Preview */}
            {posterPreview && (
              <div className="relative">
                <div className="h-60 w-44 rounded-md overflow-hidden border border-gray-300">
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemovePoster}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  aria-label="Remove poster"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {/* Upload Button */}
            <div className="flex flex-col items-start">
              <label
                htmlFor="posterUpload"
                className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium 
                  ${isSubmitting
                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  }`}
              >
                <Upload size={16} className="mr-2" />
                {isSubmitting ? 'Uploading...' : 'Upload Poster'}
                <input
                  id="posterUpload"
                  name="posterUpload"
                  type="file"
                  className="sr-only"
                  onChange={handlePosterChange}
                  disabled={isSubmitting}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
              </label>
              
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP, or GIF. Max 5MB.
              </p>
              
              {/* Debug section */}
              <div className="mt-4 border-t pt-4 w-full">
                <button
                  type="button"
                  onClick={testStorageUpload}
                  disabled={isSubmitting || !posterFile}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
                >
                  Test Upload Only
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Use this button to test storage upload without creating an event
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Saving...' 
              : isEditMode 
                ? 'Update Event' 
                : 'Create Event'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;