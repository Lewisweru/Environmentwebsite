import React from 'react';
import { Hero } from './components/Hero';
import { ImpactStats } from './components/ImpactStats';
import { DonationSection } from './components/DonationSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Hero />
      <ImpactStats />
      <DonationSection />
      <Footer />
    </div>
  );
}

export default App;