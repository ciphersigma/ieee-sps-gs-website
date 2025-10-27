// src/pages/admin/ResearchForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { db } from '../../services/database';

const ResearchForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  // Form configurations for different types
  const formConfigs = {
    areas: {
      title: 'Research Area',
      table: 'research_areas',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g., Brain, Zap, Radio' },
        { name: 'color', label: 'Color Gradient', type: 'text', placeholder: 'e.g., from-blue-500 to-purple-600' },
        { name: 'projects_count', label: 'Projects Count', type: 'number', min: 0 },
        { name: 'publications_count', label: 'Publications Count', type: 'number', min: 0 }
      ]
    },
    projects: {
      title: 'Research Project',
      table: 'research_projects',
      fields: [
        { name: 'title', label: 'Project Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'research_area', label: 'Research Area', type: 'text', required: true },
        { name: 'institution', label: 'Institution', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['ongoing', 'completed'], required: true },
        { name: 'funding', label: 'Funding Agency', type: 'text' },
        { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 2023-2025' },
        { name: 'featured', label: 'Featured Project', type: 'checkbox' }
      ]
    },
    publications: {
      title: 'Publication',
      table: 'research_publications',
      fields: [
        { name: 'title', label: 'Publication Title', type: 'text', required: true },
        { name: 'authors', label: 'Authors', type: 'text', required: true },
        { name: 'journal', label: 'Journal/Conference', type: 'text', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: new Date().getFullYear() + 1 },
        { name: 'type', label: 'Type', type: 'select', options: ['journal', 'conference'], required: true },
        { name: 'citations', label: 'Citations', type: 'number', min: 0 },
        { name: 'doi', label: 'DOI', type: 'text' },
        { name: 'url', label: 'URL', type: 'url' },
        { name: 'featured', label: 'Featured Publication', type: 'checkbox' }
      ]
    }
  };

  const config = formConfigs[type];

  useEffect(() => {
    if (isEdit) {
      fetchData();
    } else {
      // Initialize form with default values
      const defaultData = {};
      config.fields.forEach(field => {
        if (field.type === 'checkbox') {
          defaultData[field.name] = false;
        } else if (field.type === 'number') {
          defaultData[field.name] = field.min || 0;
        } else {
          defaultData[field.name] = '';
        }
      });
      setFormData(defaultData);
    }
  }, [isEdit, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let result;
      
      if (type === 'areas') {
        const { data } = await db.getResearchAreas();
        result = { data: data?.find(item => item.id === id) };
      } else if (type === 'projects') {
        const { data } = await db.getResearchProjects();
        result = { data: data?.find(item => item.id === id) };
      } else if (type === 'publications') {
        const { data } = await db.getResearchPublications();
        result = { data: data?.find(item => item.id === id) };
      }

      if (result?.error) throw result.error;
      setFormData(result?.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const dataToSave = { ...formData };
      
      // Remove empty strings and convert numbers
      config.fields.forEach(field => {
        if (field.type === 'number' && dataToSave[field.name] === '') {
          dataToSave[field.name] = null;
        }
        if (field.type === 'checkbox') {
          dataToSave[field.name] = Boolean(dataToSave[field.name]);
        }
      });

      let result;
      if (isEdit) {
        if (type === 'areas') {
          result = await db.updateResearchArea(id, dataToSave);
        } else if (type === 'projects') {
          result = await db.updateResearchProject(id, dataToSave);
        } else if (type === 'publications') {
          result = await db.updateResearchPublication(id, dataToSave);
        }
      } else {
        if (type === 'areas') {
          result = await db.createResearchArea(dataToSave);
        } else if (type === 'projects') {
          result = await db.createResearchProject(dataToSave);
        } else if (type === 'publications') {
          result = await db.createResearchPublication(dataToSave);
        }
      }

      if (result?.error) throw result.error;

      navigate('/admin/research');
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error.message || 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!config) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invalid form type: {type}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/research')}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit' : 'Add'} {config.title}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Mark as featured
                    </span>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/research')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResearchForm;