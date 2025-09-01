// src/pages/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Tag, Upload, Trash2, AlertTriangle,
  ArrowLeft, Save, ExternalLink, X, Info
} from 'lucide-react';
import { supabase, TABLES } from '../../services/supabase';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
    // Don't include fields that might not exist yet
  });
  
  // Schema state - track available columns
  const [availableColumns, setAvailableColumns] = useState({
    location_details: false,
    event_type: false,
    registration_required: false,
    registration_url: false,
    max_capacity: false,
    featured: false
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bucketError, setBucketError] = useState(null);
  const [availableBuckets, setAvailableBuckets] = useState([]);
  const [schemaLoaded, setSchemaLoaded] = useState(false);
  
  // Event types
  const eventTypes = [
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Lecture', label: 'Lecture' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Meeting', label: 'Meeting' }
  ];
  
  // Check database schema
  useEffect(() => {
    const checkSchema = async () => {
      try {
        // Get a single event to check schema
        const { data, error } = await supabase
          .from(TABLES.EVENTS)
          .select('*')
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Schema check error:', error);
          return;
        }
        
        // Check which columns exist
        const columns = data ? Object.keys(data) : [];
        const newAvailableColumns = { ...availableColumns };
        
        // Update available columns based on schema
        Object.keys(availableColumns).forEach(col => {
          newAvailableColumns[col] = columns.includes(col);
        });
        
        setAvailableColumns(newAvailableColumns);
        
        // Update formData to include only available columns
        setFormData(prev => {
          const newFormData = { ...prev };
          Object.keys(newAvailableColumns).forEach(col => {
            if (newAvailableColumns[col]) {
              // Initialize with default values
              if (col === 'registration_required' || col === 'featured') {
                newFormData[col] = false;
              } else if (col === 'max_capacity') {
                newFormData[col] = '';
              } else {
                newFormData[col] = '';
              }
            }
          });
          return newFormData;
        });
        
        setSchemaLoaded(true);
      } catch (err) {
        console.error('Error checking schema:', err);
      }
    };
    
    checkSchema();
  }, []);
  
  // Fetch event data for edit mode
  useEffect(() => {
    if (!isEditMode || !schemaLoaded) return;
    
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from(TABLES.EVENTS)
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Event not found');
          return;
        }
        
        // Update form data with all available fields
        const newFormData = {
          title: data.title || '',
          event_date: data.event_date || '',
          event_time: data.event_time || '',
          location: data.location || '',
          description: data.description || '',
        };
        
        // Add optional fields if they exist in schema
        Object.keys(availableColumns).forEach(col => {
          if (availableColumns[col] && data[col] !== undefined) {
            newFormData[col] = data[col];
          }
        });
        
        setFormData(newFormData);
        
        if (data.image_url) {
          setPosterPreview(data.image_url);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };
    
    // Check available storage buckets
    const checkStorageBuckets = async () => {
      try {
        const { data: bucketList, error: bucketError } = await supabase
          .storage
          .listBuckets();
          
        if (bucketError) throw bucketError;
        
        setAvailableBuckets(bucketList.map(bucket => bucket.name));
        
        // Check if media bucket exists, if not, try to create it
        if (!bucketList.some(bucket => bucket.name === 'media')) {
          setBucketError('Media bucket not found. Using "media" bucket instead of "events".');
          
          // Try to create media bucket if possible
          try {
            await supabase.storage.createBucket('media', {
              public: true
            });
            setAvailableBuckets(prev => [...prev, 'media']);
            setBucketError('Created "media" bucket for storing event images.');
          } catch (createError) {
            console.error('Could not create media bucket:', createError);
          }
        }
      } catch (err) {
        console.error('Error checking storage buckets:', err);
        setBucketError('Could not access storage buckets. Check Supabase permissions.');
      }
    };
    
    fetchEventData();
    checkStorageBuckets();
  }, [id, isEditMode, schemaLoaded, availableColumns]);
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    if (isEditMode && formData.image_url) {
      setPosterPreview(formData.image_url);
    } else {
      setPosterPreview('');
    }
  };
  
  // Upload poster to storage
  const uploadPoster = async () => {
    if (!posterFile) return null;
    
    try {
      // Use media bucket instead of events bucket
      const bucketName = 'media';
      const folderPath = 'events';
      
      // Create a unique file name
      const fileExt = posterFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, posterFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (err) {
      console.error('Error uploading poster:', err);
      throw new Error('Failed to upload event poster');
    }
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Form validation
    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }
    
    if (!formData.event_date) {
      setError('Event date is required');
      return;
    }
    
    if (!formData.location.trim()) {
      setError('Event location is required');
      return;
    }
    
    if (availableColumns.registration_required && 
        formData.registration_required && 
        availableColumns.registration_url && 
        !formData.registration_url) {
      setError('Registration URL is required when registration is enabled');
      return;
    }
    
    try {
      setSavingForm(true);
      
      // Handle poster upload if there's a new file
      let imageUrl = formData.image_url;
      if (posterFile) {
        imageUrl = await uploadPoster();
      }
      
      const eventData = {
        ...formData,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      };
      
      if (isEditMode) {
        // Update existing event
        const { error } = await supabase
          .from(TABLES.EVENTS)
          .update(eventData)
          .eq('id', id);
          
        if (error) throw error;
        
        setSuccessMessage('Event updated successfully!');
      } else {
        // Create new event
        eventData.created_at = new Date().toISOString();
        
        const { error } = await supabase
          .from(TABLES.EVENTS)
          .insert([eventData]);
          
        if (error) throw error;
        
        setSuccessMessage('Event created successfully!');
        
        // Reset form for new event
        const resetFormData = {
          title: '',
          event_date: '',
          event_time: '',
          location: '',
          description: '',
        };
        
        // Add optional fields if they exist
        Object.keys(availableColumns).forEach(col => {
          if (availableColumns[col]) {
            if (col === 'registration_required' || col === 'featured') {
              resetFormData[col] = false;
            } else if (col === 'max_capacity') {
              resetFormData[col] = '';
            } else {
              resetFormData[col] = '';
            }
          }
        });
        
        setFormData(resetFormData);
        setPosterFile(null);
        setPosterPreview('');
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setSavingForm(false);
    }
  };

  if (!schemaLoaded) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-[#0077B5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-gray-600">Loading form and checking database schema...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link 
          to="/admin/events" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        
        {/* Schema Warning */}
        {Object.values(availableColumns).some(exists => !exists) && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Database Schema Warning</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p className="mb-2">Some columns are missing in your database schema:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    {Object.entries(availableColumns).map(([column, exists]) => (
                      !exists && <li key={column}>{column}</li>
                    ))}
                  </ul>
                  <p className="mt-3">Run the following SQL to add missing columns:</p>
                  <pre className="mt-2 bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
                    {`ALTER TABLE events
ADD COLUMN IF NOT EXISTS location_details TEXT,
ADD COLUMN IF NOT EXISTS event_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS registration_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bucket Error Alert */}
        {bucketError && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Storage Access Issue</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p className="mb-2">{bucketError}</p>
                  <p className="font-medium">Available buckets:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 mb-2">
                    {availableBuckets.length > 0 ? (
                      availableBuckets.map(bucket => (
                        <li key={bucket}>{bucket}</li>
                      ))
                    ) : (
                      <li>No buckets found</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Event Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Event Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                placeholder="Enter event title"
                required
              />
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>
            
            {/* Location Details - Only show if available in schema */}
            {availableColumns.location_details && (
              <div className="mb-6">
                <label htmlFor="location_details" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Details
                </label>
                <textarea
                  id="location_details"
                  value={formData.location_details || ''}
                  onChange={(e) => handleInputChange('location_details', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                  placeholder="Additional location information (building, room, etc.)"
                />
              </div>
            )}
            
            {/* Event Type - Only show if available in schema */}
            {availableColumns.event_type && (
              <div className="mb-6">
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="event_type"
                    value={formData.event_type || ''}
                    onChange={(e) => handleInputChange('event_type', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5] appearance-none"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* Event Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Poster
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {posterPreview ? (
                    <div className="relative">
                      <img 
                        src={posterPreview} 
                        alt="Event poster preview" 
                        className="mx-auto h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePoster}
                        className="absolute top-0 right-0 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="poster-upload"
                          className="relative cursor-pointer rounded-md font-medium text-[#0077B5] hover:text-[#0077B5] focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="poster-upload"
                            name="poster-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handlePosterChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-start">
                <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                Using the "media" bucket to store images. Make sure this bucket exists in your Supabase project.
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                placeholder="Enter event description"
              />
            </div>
            
            {/* Registration - Only show if available in schema */}
            {availableColumns.registration_required && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="registration_required"
                    type="checkbox"
                    checked={formData.registration_required || false}
                    onChange={(e) => handleInputChange('registration_required', e.target.checked)}
                    className="h-4 w-4 text-[#0077B5] focus:ring-[#0077B5] border-gray-300 rounded"
                  />
                  <label htmlFor="registration_required" className="ml-2 block text-sm text-gray-700">
                    Registration Required
                  </label>
                </div>
                
                {formData.registration_required && availableColumns.registration_url && (
                  <div className="mt-3">
                    <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700 mb-1">
                      Registration URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="registration_url"
                        type="url"
                        value={formData.registration_url || ''}
                        onChange={(e) => handleInputChange('registration_url', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                        placeholder="https://"
                        required={formData.registration_required}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Max Capacity - Only show if available in schema */}
            {availableColumns.max_capacity && (
              <div className="mb-6">
                <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Capacity
                </label>
                <input
                  id="max_capacity"
                  type="number"
                  min="0"
                  value={formData.max_capacity || ''}
                  onChange={(e) => handleInputChange('max_capacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0077B5] focus:border-[#0077B5]"
                  placeholder="Leave empty for unlimited"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for unlimited capacity
                </p>
              </div>
            )}
            
            {/* Featured Event - Only show if available in schema */}
            {availableColumns.featured && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-[#0077B5] focus:ring-[#0077B5] border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Event (highlighted on homepage)
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
            <Link
              to="/admin/events"
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={savingForm}
              className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0077B5] hover:bg-[#00588a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B5] ${
                savingForm ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {savingForm ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;