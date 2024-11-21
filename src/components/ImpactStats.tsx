import React from 'react';
import { Waves, Fish, TreePine } from 'lucide-react';

const stats = [
  { icon: Waves, value: '15,000 kg', label: 'Plastic removed this year' },
  { icon: Fish, value: '50+', label: 'River ecosystems protected' },
  { icon: TreePine, value: '100,000+', label: 'Lives impacted' },
];

export function ImpactStats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <stat.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}