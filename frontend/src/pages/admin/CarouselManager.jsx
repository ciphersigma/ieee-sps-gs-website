// src/pages/admin/CarouselManager.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, 
  Loader, AlertCircle, CheckCircle, Image as ImageIcon 
} from 'lucide-react';

const CarouselManager = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all carousel images
  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      const data = await api.getCarouselImages();
      setCarouselImages(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      setError('Failed to load carousel images');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCarouselImages();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      // Upload to Cloudinary via backend
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', '');
      formData.append('description', file.name);
      formData.append('order', carouselImages.length + 1);
      formData.append('is_active', true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/carousel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
          },
          body: formData
        });

        if (response.ok) {
          await fetchCarouselImages();
          setSuccessMessage('Image uploaded to Cloudinary successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        setUploadError('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      setUploadError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Delete an image
  const deleteImage = async (id, storageUrl) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/carousel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
        }
      });

      if (response.ok) {
        await fetchCarouselImages(); // Refresh the list
        setSuccessMessage('Image deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      setError('Failed to delete image');
    }
  };

  // Move image up or down in order
  const moveImage = async (id, currentOrder, direction) => {
    try {
      const images = [...carouselImages];
      const currentIndex = images.findIndex(img => img._id === id);
      
      if (direction === 'up' && currentIndex > 0) {
        [images[currentIndex], images[currentIndex - 1]] = [images[currentIndex - 1], images[currentIndex]];
      } else if (direction === 'down' && currentIndex < images.length - 1) {
        [images[currentIndex], images[currentIndex + 1]] = [images[currentIndex + 1], images[currentIndex]];
      }
      
      setCarouselImages(images);
    } catch (error) {
      setError('Failed to reorder images');
    }
  };

  // Update image caption or alt text
  const updateImageText = async (id, field, value) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/carousel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
        },
        body: JSON.stringify({ [field]: value })
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setCarouselImages(prev => 
          prev.map(img => 
            img._id === id ? { ...img, [field]: value } : img
          )
        );
      } else {
        throw new Error('Failed to update image');
      }
    } catch (error) {
      setError('Failed to update image text');
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2">Loading carousel images...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Manage Carousel Images</h1>
        
        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button 
              className="ml-auto text-sm underline" 
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Upload section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Add New Carousel Image</h2>
          
          <div className="flex items-center">
            <label className="relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <Plus className="h-5 w-5 mr-2" />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            <span className="ml-4 text-sm text-gray-500">
              JPG, PNG or WebP, max 5MB
            </span>
          </div>
          
          {/* Upload error */}
          {uploadError && (
            <div className="mt-2 text-sm text-red-600">
              {uploadError}
              <button 
                className="ml-2 underline" 
                onClick={() => setUploadError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
        
        {/* Images list */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Carousel Images ({carouselImages.length})</h2>
          </div>
          
          {carouselImages.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <ImageIcon className="h-12 w-12 mb-4" />
              <p>No carousel images yet</p>
              <p className="text-sm mt-1">Upload images to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {carouselImages.map((image, index) => (
                <li key={image._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image preview */}
                    <div className="w-full md:w-1/4">
                      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={image.description || 'Carousel image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Image details */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 gap-3">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={image.title || ''}
                            onBlur={(e) => updateImageText(image._id, 'title', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          />
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={image.description || ''}
                            onBlur={(e) => updateImageText(image._id, 'description', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex md:flex-col justify-end gap-2">
                      {/* Move up */}
                      <button
                        onClick={() => moveImage(image._id, image.display_order, 'up')}
                        disabled={index === 0}
                        className={`p-2 rounded-full ${
                          index === 0 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-label="Move up"
                      >
                        <ArrowUp size={20} />
                      </button>
                      
                      {/* Move down */}
                      <button
                        onClick={() => moveImage(image._id, image.display_order, 'down')}
                        disabled={index === carouselImages.length - 1}
                        className={`p-2 rounded-full ${
                          index === carouselImages.length - 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-label="Move down"
                      >
                        <ArrowDown size={20} />
                      </button>
                      
                      {/* Delete */}
                      <button
                        onClick={() => deleteImage(image._id, image.image_url)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50"
                        aria-label="Delete image"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselManager;