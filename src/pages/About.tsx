// src/pages/About.tsx
import React from 'react';
import { AboutPage as AboutContent } from '../features/about/components/AboutPage';
import { useAboutData } from '../features/about/hooks/useAboutData';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
  const { data, loading, error } = useAboutData();

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading about page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Error loading about page: {error}</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Mixton - TON Mixer</title>
        <meta name="description" content={data?.description || 'Learn about Mixton TON Mixer'} />
        <meta name="keywords" content="TON, mixer, privacy, blockchain, decentralized" />
      </Helmet>
      
      <div className="about-page-container">
        <AboutContent />
      </div>
    </>
  );
};

export default About;
