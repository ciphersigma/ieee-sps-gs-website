import React from 'react';

const AdminPageWrapper = ({ 
  title, 
  subtitle, 
  action, 
  children, 
  breadcrumbs = [] 
}) => {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="mx-2 text-gray-400">/</span>
                    )}
                    <span className={index === breadcrumbs.length - 1 
                      ? "text-gray-900 font-medium" 
                      : "text-gray-500 hover:text-gray-700"
                    }>
                      {crumb}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          {/* Title and Action */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminPageWrapper;