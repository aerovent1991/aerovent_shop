"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NrkPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-400 hover:text-aero-accent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Повернутись назад
        </button>

        <div className="bg-gray-tactical/30 border border-white/10 tactical-clip p-8">
          <h1 className="text-4xl md:text-5xl font-stencil text-white mb-4">
            НРК
          </h1>
          <p className="text-gray-300 leading-relaxed">
            НРК в розробці. Ми повідомимо, коли напрямок буде доступний до
            замовлення.
          </p>
        </div>
      </div>
    </div>
  );
}
