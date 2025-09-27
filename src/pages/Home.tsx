// src/pages/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeroSection,
  StatsOverviewSection,
  FeaturesSection,
  PoolSelectionSection,
  RecentTransactionsSection,
  CTASection,
  AdvancedMixSection
} from '../features/home';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showMixForm, setShowMixForm] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>('');

  const handleGetStarted = () => {
    if (user.connected) {
      setShowMixForm(true);
    } else {
      navigate('/auth');
    }
  };

  const handlePoolSelect = (poolId: string) => {
    setSelectedPool(poolId);
    if (user.connected) {
      setShowMixForm(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <HeroSection onGetStarted={handleGetStarted} />
      <StatsOverviewSection />
      <FeaturesSection />
      <PoolSelectionSection onPoolSelect={handlePoolSelect} />
      <AdvancedMixSection />
      <RecentTransactionsSection />
      <CTASection onGetStarted={handleGetStarted} />
    </>
  );
};

export default Home;