// src/pages/NewsDetailPage.jsx
import React from 'react';
import ContentDetailPage from './ContentDetailPage';

const NewsDetailPage = () => {
  return (
    <ContentDetailPage 
      contentType="news"
      listPagePath="/news"
    />
  );
};

export default NewsDetailPage;