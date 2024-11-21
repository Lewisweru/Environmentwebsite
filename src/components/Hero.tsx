import React from 'react';

export function Hero() {
  return (
    <header className="relative h-[60vh] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80"
        alt="River pollution"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Clean Rivers, Better Future</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">Join our mission to remove plastics from rivers and protect our water ecosystems</p>
        </div>
      </div>
    </header>
  );
}