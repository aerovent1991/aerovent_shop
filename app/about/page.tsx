import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gray-tactical/30 border border-white/10 tactical-clip p-10 text-center">
          <h1 className="text-5xl md:text-7xl font-stencil text-white tracking-widest">
            АЕРО ВЕНТ
          </h1>
        </div>
      </div>
    </div>
  );
}
