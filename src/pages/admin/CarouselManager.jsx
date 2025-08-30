// src/pages/admin/CarouselManager.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
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
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_carousel', true)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      
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
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type and size
      const fileExt = file.name.split('.').pop();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(fileExt.toLowerCase())) {
        setUploadError('Invalid file type. Please upload JPG, PNG or WebP images.');
        return;
      }
      
      if (file.size > maxSize) {
        setUploadError('File too large. Maximum size is 5MB.');
        return;
      }
      
      setUploading(true);
      setUploadError(null);
      
      // Check authentication status
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Authentication status:", user ? "Authenticated" : "Not authenticated");
      
      // Create a unique file name
      const fileName = `carousel_${Date.now()}.${fileExt}`;
      const filePath = `carousel/${fileName}`;
      
      console.log("About to upload to storage...");
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
        
      console.log("Storage upload result:", uploadError ? "Error" : "Success");
      if (uploadError) throw uploadError;
      
      console.log("Getting public URL...");
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Determine the next display order
      const maxOrder = carouselImages.length > 0 
        ? Math.max(...carouselImages.map(img => img.display_order))
        : 0;
      
      console.log("About to insert into gallery table...");
      // Add to gallery table
      const { data: galleryData, error: insertError } = await supabase
        .from('gallery')
        .insert([
          {
            image_url: publicUrl,
            alt_text: 'Carousel image',
            caption: 'Carousel image',
            is_carousel: true,
            display_order: maxOrder + 1
          }
        ]);
        
      console.log("Gallery insert result:", insertError ? "Error" : "Success");
      if (insertError) {
        console.error("Gallery error details:", insertError);
        throw insertError;
      }
      
      // Show success message and refresh
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh the list
      fetchCarouselImages();
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Delete an image
  const deleteImage = async (id, storageUrl) => {
    try {
      if (!confirm('Are you sure you want to delete this image?')) return;
      
      // Delete from gallery table
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // Try to delete from storage if possible
      // Extract the path from the URL
      const url = new URL(storageUrl);
      const pathMatch = url.pathname.match(/\/object\/public\/media\/(.+)/);
      
      if (pathMatch && pathMatch[1]) {
        const storagePath = decodeURIComponent(pathMatch[1]);
        await supabase.storage
          .from('media')
          .remove([storagePath]);
      }
      
      // Show success and refresh
      setSuccessMessage('Image deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchCarouselImages();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete image');
    }
  };

  // Move image up or down in order
  const moveImage = async (id, currentOrder, direction) => {
    try {
      // Find adjacent image
      const adjacentImage = carouselImages.find(img => {
        return direction === 'up' 
          ? img.display_order === currentOrder - 1
          : img.display_order === currentOrder + 1;
      });
      
      if (!adjacentImage) return;
      
      // Update both images
      const { error: updateError } = await supabase
        .from('gallery')
        .update({ display_order: currentOrder })
        .eq('id', adjacentImage.id);
        
      if (updateError) throw updateError;
      
      const { error: updateError2 } = await supabase
        .from('gallery')
        .update({ display_order: adjacentImage.display_order })
        .eq('id', id);
        
      if (updateError2) throw updateError2;
      
      // Refresh
      fetchCarouselImages();
    } catch (err) {
      console.error('Reorder error:', err);
      setError('Failed to reorder images');
    }
  };

  // Update image caption or alt text - improved version
  const updateImageText = async (id, field, value) => {
    try {
      // Find the image in the local state
      const imageIndex = carouselImages.findIndex(img => img.id === id);
      if (imageIndex === -1) return;
      
      // Optimistically update the UI first
      const updatedImages = [...carouselImages];
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        [field]: value
      };
      setCarouselImages(updatedImages);
      
      // Then update the database
      const { error } = await supabase
        .from('gallery')
        .update({ 
          [field]: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Show a brief success message
      setSuccessMessage(`Updated ${field} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(`Failed to update ${field}`);
      
      // Revert the local change in case of error
      fetchCarouselImages();
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
                <li key={image.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image preview */}
                    <div className="w-full md:w-1/4">
                      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || 'Carousel image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Image details */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 gap-3">
                        {/* Caption */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Caption
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={image.caption || ''}
                            onBlur={(e) => updateImageText(image.id, 'caption', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          />
                        </div>
                        
                        {/* Alt text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={image.alt_text || ''}
                            onBlur={(e) => updateImageText(image.id, 'alt_text', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex md:flex-col justify-end gap-2">
                      {/* Move up */}
                      <button
                        onClick={() => moveImage(image.id, image.display_order, 'up')}
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
                        onClick={() => moveImage(image.id, image.display_order, 'down')}
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
                        onClick={() => deleteImage(image.id, image.image_url)}
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