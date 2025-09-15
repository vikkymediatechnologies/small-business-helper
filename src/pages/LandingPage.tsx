import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Benefits from '../components/landing/Benefits';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;