import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-4">© {new Date().getFullYear()} Clean Rivers Initiative. All rights reserved.</p>
        <p className="text-sm">Together we can make a difference.</p>
      </div>
    </footer>
  );
}