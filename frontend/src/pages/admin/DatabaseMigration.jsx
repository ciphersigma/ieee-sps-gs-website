// src/pages/admin/DatabaseMigration.jsx
import React, { useState } from 'react';
import { Database, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { migration } from '../../utils/migration';

const DatabaseMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState('idle');
  const [migrationLog, setMigrationLog] = useState([]);
  const [currentDatabase, setCurrentDatabase] = useState(
    import.meta.env.VITE_USE_MONGODB === 'true' ? 'MongoDB' : 'Supabase'
  );

  const handleMigration = async () => {
    setMigrationStatus('running');
    setMigrationLog(['Starting migration process...']);

    try {
      // Initialize default research data
      const result = await migration.initializeDefaultResearchData();
      
      if (result.success) {
        setMigrationLog(prev => [...prev, 'Migration completed successfully!']);
        setMigrationStatus('completed');
      } else {
        setMigrationLog(prev => [...prev, `Migration failed: ${result.error}`]);
        setMigrationStatus('failed');
      }
    } catch (error) {
      setMigrationLog(prev => [...prev, `Migration error: ${error.message}`]);
      setMigrationStatus('failed');
    }
  };

  const toggleDatabase = () => {
    const newDb = currentDatabase === 'MongoDB' ? 'Supabase' : 'MongoDB';
    setCurrentDatabase(newDb);
    alert(`To switch to ${newDb}, update VITE_USE_MONGODB in .env.local and restart the application`);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Database className="mr-3 text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Database Migration</h1>
        </div>

        {/* Current Database Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Database</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                currentDatabase === 'MongoDB' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <span className="text-lg font-medium">{currentDatabase}</span>
            </div>
            <button
              onClick={toggleDatabase}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Switch Database
            </button>
          </div>
        </div>

        {/* Migration Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Migration Tools</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Upload className="mr-2 text-green-600" size={20} />
                <h3 className="font-medium">Initialize Research Data</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Set up default research areas, projects, and publications in MongoDB
              </p>
              <button
                onClick={handleMigration}
                disabled={migrationStatus === 'running'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {migrationStatus === 'running' ? 'Initializing...' : 'Initialize Data'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Download className="mr-2 text-blue-600" size={20} />
                <h3 className="font-medium">Export Data</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Export current database data for backup or migration
              </p>
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Migration Status */}
        {migrationStatus !== 'idle' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              {migrationStatus === 'running' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              )}
              {migrationStatus === 'completed' && (
                <CheckCircle className="mr-3 text-green-600" size={20} />
              )}
              {migrationStatus === 'failed' && (
                <AlertCircle className="mr-3 text-red-600" size={20} />
              )}
              <h2 className="text-lg font-semibold">
                Migration {migrationStatus === 'running' ? 'In Progress' : 
                         migrationStatus === 'completed' ? 'Completed' : 'Failed'}
              </h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {migrationLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-700 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Migration Instructions</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Set up MongoDB Atlas cluster and get Data API credentials</li>
            <li>2. Update MongoDB configuration in .env.local file</li>
            <li>3. Set VITE_USE_MONGODB=true to enable MongoDB</li>
            <li>4. Restart the application</li>
            <li>5. Use "Initialize Data" to set up default research content</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DatabaseMigration;