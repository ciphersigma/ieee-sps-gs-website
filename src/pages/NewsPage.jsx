// src/pages/NewsPage.jsx
import React from 'react';
import ContentListPage from './ContentListPage';

const NewsPage = () => {
  return (
    <ContentListPage 
      contentType="news"
      title="News & Updates"
      description="Stay informed about the latest announcements, events, and activities from IEEE SPS Gujarat Chapter."
    />
  );
};

export default NewsPage;
