// src/pages/admin/ResearchManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter,
  Brain, BookOpen, Award, BarChart3
} from 'lucide-react';
import { db } from '../../services/database';

const ResearchManagement = () => {
  const [activeTab, setActiveTab] = useState('areas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [researchAreas, setResearchAreas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [stats, setStats] = useState({});

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [areasResult, projectsResult, publicationsResult, statsResult] = await Promise.all([
        db.getResearchAreas(),
        db.getResearchProjects(),
        db.getResearchPublications(),
        db.getResearchStats()
      ]);

      setResearchAreas(areasResult.data || []);
      setProjects(projectsResult.data || []);
      setPublications(publicationsResult.data || []);
      setStats(statsResult.data || {});
    } catch (error) {
      console.error('Error fetching research data:', error);
      setError('Failed to load research data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      let result;
      if (table === 'research_areas') {
        result = await db.deleteResearchArea(id);
      } else if (table === 'research_projects') {
        result = await db.deleteResearchProject(id);
      } else if (table === 'research_publications') {
        result = await db.deleteResearchPublication(id);
      }
      
      if (result?.error) throw result.error;
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const tabs = [
    { id: 'areas', label: 'Research Areas', icon: Brain, count: researchAreas.length },
    { id: 'projects', label: 'Projects', icon: BookOpen, count: projects.length },
    { id: 'publications', label: 'Publications', icon: Award, count: publications.length },
    { id: 'stats', label: 'Statistics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Research Management</h1>
        <div className="flex space-x-2">
          <Link
            to="/admin/research/areas/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Research Area
          </Link>
          <Link
            to="/admin/research/projects/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      {activeTab !== 'stats' && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
            />
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'areas' && (
        <ResearchAreasTab 
          areas={researchAreas.filter(area => 
            area.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            area.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={(id) => handleDelete(TABLES.RESEARCH_AREAS, id)}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab 
          projects={projects.filter(project => 
            project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={(id) => handleDelete(TABLES.RESEARCH_PROJECTS, id)}
        />
      )}

      {activeTab === 'publications' && (
        <PublicationsTab 
          publications={publications.filter(pub => 
            pub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.authors?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={(id) => handleDelete(TABLES.RESEARCH_PUBLICATIONS, id)}
        />
      )}

      {activeTab === 'stats' && (
        <StatsTab stats={stats} />
      )}
    </div>
  );
};

// Research Areas Tab Component
const ResearchAreasTab = ({ areas, onDelete }) => (
  <div className="grid gap-4">
    {areas.map((area) => (
      <div key={area.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.title}</h3>
            <p className="text-gray-600 mb-3">{area.description}</p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>{area.projects_count || 0} Projects</span>
              <span>{area.publications_count || 0} Publications</span>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/admin/research/areas/edit/${area.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(area.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
    {areas.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        No research areas found. <Link to="/admin/research/areas/new" className="text-blue-600">Add one now</Link>
      </div>
    )}
  </div>
);

// Projects Tab Component
const ProjectsTab = ({ projects, onDelete }) => (
  <div className="grid gap-4">
    {projects.map((project) => (
      <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'ongoing' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div><span className="font-medium">Institution:</span> {project.institution}</div>
              <div><span className="font-medium">Duration:</span> {project.duration}</div>
              <div><span className="font-medium">Funding:</span> {project.funding}</div>
              <div><span className="font-medium">Area:</span> {project.research_area}</div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/admin/research/projects/edit/${project.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
    {projects.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        No projects found. <Link to="/admin/research/projects/new" className="text-blue-600">Add one now</Link>
      </div>
    )}
  </div>
);

// Publications Tab Component
const PublicationsTab = ({ publications, onDelete }) => (
  <div className="grid gap-4">
    {publications.map((pub) => (
      <div key={pub.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h3>
            <p className="text-gray-600 mb-2">{pub.authors}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <span className="font-medium text-blue-600">{pub.journal}</span>
              <span>{pub.year}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                pub.type === 'journal' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {pub.type}
              </span>
              <span>{pub.citations || 0} citations</span>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/admin/research/publications/edit/${pub.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(pub.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
    {publications.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        No publications found. <Link to="/admin/research/publications/new" className="text-blue-600">Add one now</Link>
      </div>
    )}
  </div>
);

// Stats Tab Component
const StatsTab = ({ stats }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
      <div className="text-3xl font-bold mb-2">{stats.total_projects || 0}</div>
      <div className="text-sm opacity-90">Total Projects</div>
    </div>
    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6">
      <div className="text-3xl font-bold mb-2">{stats.total_publications || 0}</div>
      <div className="text-sm opacity-90">Publications</div>
    </div>
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
      <div className="text-3xl font-bold mb-2">{stats.total_collaborations || 0}</div>
      <div className="text-sm opacity-90">Collaborations</div>
    </div>
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
      <div className="text-3xl font-bold mb-2">{stats.total_awards || 0}</div>
      <div className="text-sm opacity-90">Awards</div>
    </div>
  </div>
);

export default ResearchManagement;