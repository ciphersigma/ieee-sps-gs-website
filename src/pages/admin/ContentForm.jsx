// src/pages/admin/ContentForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle, Upload, X, Plus, Tag
} from 'lucide-react';

const ContentForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const contentTypeNames = {
    news: 'News & Updates',
    publications: 'Publications & Research',
    resources: 'Resources & Downloads',
    blog: 'Blog Posts'
  };
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    author: '',
    featured: false,
    status: 'draft',
    tags: [],
    image: null,
    file_url: '',
    content_type: type || 'news'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch content data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchContentData();
    } else {
      // Reset form for new content
      setFormData({
        ...formData,
        content_type: type || 'news'
      });
    }
  }, [isEditMode, id, type]);
  
  // Function to fetch content data for editing
  const fetchContentData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData(data);
        
        // Set image preview if available
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to fetch content data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle document upload
  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };
  
  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      ...formData,
      image: null
    });
  };
  
  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = formData.image;
      let fileUrl = formData.file_url;
      
      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `content/${type}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = data.publicUrl;
      }
      
      // Upload document if selected (for resources)
      if (documentFile && type === 'resources') {
        const fileExt = documentFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `resources/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, documentFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('files')
          .getPublicUrl(filePath);
        
        fileUrl = data.publicUrl;
      }
      
      // Prepare data for saving
      const contentData = {
        ...formData,
        image: imageUrl,
        file_url: fileUrl,
        content_type: type,
        updated_at: new Date().toISOString()
      };
      
      if (!isEditMode) {
        contentData.created_at = new Date().toISOString();
      }
      
      let result;
      
      if (isEditMode) {
        // Update existing content
        result = await supabase
          .from('content')
          .update(contentData)
          .eq('id', id);
      } else {
        // Insert new content
        result = await supabase
          .from('content')
          .insert([contentData]);
      }
      
      if (result.error) throw result.error;
      
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/admin/content/${type}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error saving content:', err);
      setError(`Failed to save content: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              to={`/admin/content/${type}`} 
              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to {contentTypeNames[type]}</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? `Edit ${type === 'news' ? 'News Item' : 
                         type === 'publications' ? 'Publication' :
                         type === 'resources' ? 'Resource' : 'Blog Post'}` : 
                        `Add New ${type === 'news' ? 'News Item' : 
                         type === 'publications' ? 'Publication' :
                         type === 'resources' ? 'Resource' : 'Blog Post'}`}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? `Update the details of an existing ${type.slice(0, -1)}` 
              : `Create a new ${type.slice(0, -1)} for IEEE SPS Gujarat Chapter`
            }
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">
                Content {isEditMode ? 'updated' : 'created'} successfully!
              </p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Content Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${type.slice(0, -1)} title`}
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a brief description..."
              ></textarea>
            </div>
            
            {/* Main Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Main Content <span className="text-red-600">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the main content..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                You can use Markdown for formatting.
              </p>
            </div>
            
            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name"
              />
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {formData.tags && formData.tags.map((tag, index) => (
                  <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  <Tag size={16} className="mr-1" />
                  Add
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to add a tag.
              </p>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image
              </label>
              
              {imagePreview ? (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-48 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload an image</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* File Upload (for resources) */}
            {type === 'resources' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleDocumentChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, XLSX, ZIP up to 10MB
                    </p>
                  </div>
                </div>
                {documentFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: {documentFile.name}
                  </div>
                )}
                {formData.file_url && !documentFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Current file: <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View file</a>
                  </div>
                )}
              </div>
            )}
            
            {/* Status & Featured Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              {type === 'news' && (
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Feature this item on the homepage
                  </label>
                </div>
              )}
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to={`/admin/content/${type}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? 'Saving...' : isEditMode ? 'Update Content' : 'Create Content'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm;