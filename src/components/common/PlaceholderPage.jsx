import React from 'react';

const PlaceholderPage = ({ title, description = "Content coming soon..." }) => (
  <div className="container mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-8">{title}</h1>
    <p>{description}</p>
  </div>
);

export default PlaceholderPage;