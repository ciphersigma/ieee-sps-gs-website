import React from 'react';
import AdminPageWrapper from './AdminPageWrapper';

const PlaceholderPage = ({ title, description }) => {
  return (
    <AdminPageWrapper
      title={title || 'Page Under Development'}
      subtitle={description || 'This feature is currently being developed'}
    >
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title || 'Coming Soon'}
        </h2>
        <p className="text-gray-600">
          {description || 'This feature is currently under development and will be available soon.'}
        </p>
      </div>
    </AdminPageWrapper>
  );
};

export default PlaceholderPage;