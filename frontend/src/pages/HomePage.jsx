// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/home/Hero';
import ImageCarousel from '../components/home/ImageCarousel';
import AboutSection from '../components/home/AboutSection';
import EventsSection from '../components/home/EventsSection';
import TeamSection from '../components/home/TeamSection';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <ImageCarousel />
      <AboutSection />
      <EventsSection />
      <TeamSection />
    </main>
  );
};

export default HomePage;
