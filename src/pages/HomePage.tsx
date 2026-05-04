import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PopularProceduresSection from '../components/home/PopularProceduresSection';
import ExperiencesSection from '../components/home/ExperiencesSection';
import CategoriesSection from '../components/home/CategoriesSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <PopularProceduresSection />
      <ExperiencesSection />
      <CategoriesSection />
    </>
  );
};

export default HomePage;