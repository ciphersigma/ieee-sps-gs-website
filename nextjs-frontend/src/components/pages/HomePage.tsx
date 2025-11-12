'use client';

import React from 'react';
import Hero from '../home/Hero';
import ImageCarousel from '../home/ImageCarousel';
import AboutSection from '../home/AboutSection';
import EventsSection from '../home/EventsSection';
import TeamSection from '../home/TeamSection';

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