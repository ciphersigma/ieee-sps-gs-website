// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import AboutSection from '../components/home/AboutSection';
import EventsSection from '../components/home/EventsSection';
import TeamSection from '../components/home/TeamSection';
import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <StatsSection />
      <AboutSection />
      <EventsSection />
      <TeamSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;