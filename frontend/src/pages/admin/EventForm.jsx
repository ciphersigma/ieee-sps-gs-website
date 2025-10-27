// src/pages/admin/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Tag, Upload, Trash2, AlertTriangle, 
  ArrowLeft, Save, ExternalLink, X, Info 
} from 'lucide-react';
import { eventsAPI, api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Workshop',
    status: 'upcoming',
    featured: false,
    max_participants: '',
    registration_url: '',
    contact_email: '',
    image_url: '',
    branch: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [isEditMode, id]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      console.log('Fetching event with ID:', id);
      const response = await api.getEventById(id);
      console.log('API response:', response);
      const eventData = response;
      
      // Convert event_date to date and time fields
      if (eventData.event_date) {
        const eventDate = new Date(eventData.event_date);
        eventData.date = eventDate.toISOString().split('T')[0];
        eventData.time = eventDate.toTimeString().split(' ')[0].substring(0, 5);
      } else {
        eventData.date = '';
        eventData.time = '';
      }
      
      console.log('Processed event data:', eventData);
      setFormData({
        title: eventData.title || '',
        description: eventData.description || '',
        date: eventData.date || '',
        time: eventData.time || '',
        location: eventData.location || '',
        type: eventData.type || 'Workshop',
        status: eventData.status || 'upcoming',
        featured: eventData.featured || false,
        max_participants: eventData.max_participants || '',
        registration_url: eventData.registration_url || '',
        contact_email: eventData.contact_email || '',
        image_url: eventData.image_url || '',
        branch: eventData.branch || (isSuperAdmin() ? '' : user.branch)
      });
      
      if (eventData.image_url) {
        setImagePreview(eventData.image_url);
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to fetch event data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Transform data to match backend schema
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: formData.date + (formData.time ? `T${formData.time}:00` : 'T00:00:00'),
        location: formData.location,
        status: formData.status,
        registration_url: formData.registration_url,
        image_url: formData.image_url,
        branch: formData.branch
      };

      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (eventData[key]) {
          submitData.append(key, eventData[key]);
        }
      });
      
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      const apiCall = isEditMode 
        ? () => fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/events/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
            },
            body: submitData
          })
        : () => fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/events`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
            },
            body: submitData
          });

      const response = await apiCall();
      if (!response.ok) {
        throw new Error('Failed to save event');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);

    } catch (err) {
      console.error('Error saving event:', err);
      setError(`Failed to save event: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <Link 
            to="/admin/events" 
            className="text-blue-600 hover:text-blue-800 inline-flex items-center mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Events
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
            <p className="text-green-700">
              Event {isEditMode ? 'updated' : 'created'} successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Conference">Conference</option>
                  <option value="Competition">Competition</option>
                  <option value="Webinar">Webinar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration URL
              </label>
              <input
                type="url"
                name="registration_url"
                value={formData.registration_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {isSuperAdmin() ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch *
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  <option value="Gujarat University">Gujarat University</option>
                  <option value="NIT Surat">NIT Surat</option>
                  <option value="IIT Gandhinagar">IIT Gandhinagar</option>
                  <option value="DA-IICT Gandhinagar">DA-IICT Gandhinagar</option>
                  <option value="SVNIT Surat">SVNIT Surat</option>
                  <option value="Nirma University">Nirma University</option>
                  <option value="Pandit Deendayal Energy University">Pandit Deendayal Energy University</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={user.branch}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                />
                <input type="hidden" name="branch" value={user.branch} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Poster
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Event poster preview" 
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Click to upload poster
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Feature this event on homepage
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to="/admin/events"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;