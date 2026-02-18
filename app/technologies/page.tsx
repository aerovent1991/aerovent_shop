import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Технології',
  description:
    'Технології команди АЕРО ВЕНТ: Betaflight, ArduPilot, Computer Vision, Fusion 360.',
};

const TECHNOLOGIES = [
  {
    title: 'Betaflight',
    image: '/images/betafligth_img.png',
    description:
      'Контроль та стабілізація FPV‑платформ під бойові сценарії: швидка реакція, точність керування та надійність у складних умовах.',
  },
  {
    title: 'ArduPilot',
    image: '/images/ArduPilot.webp',
    description:
      'Автопілот та місійні профілі для БПЛА: маршрути, режими безпеки, автономність та інтеграція під MilTech задачі.',
  },
  {
    title: 'Computer Vision',
    image: '/images/computer_vision.jpg',
    description:
      'Розпізнавання обʼєктів і навігація в реальному часі: аналітика відео, трекінг цілей та підтримка тактичних рішень.',
  },
  {
    title: 'Fusion 360',
    image: '/images/Fusion360.png',
    description:
      'Проєктування та прототипування компонентів: міцні корпуси, оптимізована геометрія та швидкий цикл виробництва.',
  },
];

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 mt-6">
          <h1 className="text-4xl md:text-5xl font-stencil text-white mb-3">
            ТЕХНОЛОГІЇ
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Ми готові навчатись та розвиватись у всіх можливих технологіях,
            які надають перевагу українській армії на полі бою.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {TECHNOLOGIES.map((tech) => (
            <article
              key={tech.title}
              className="bg-gray-tactical/30 backdrop-blur-sm border border-white/10 tactical-clip p-6 flex flex-col"
            >
              <div className="relative w-full h-56 mb-5 border border-white/10 bg-white tactical-clip overflow-hidden">
                <Image
                  src={tech.image}
                  alt={tech.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2"
                  priority={tech.title === 'Betaflight'}
                />
              </div>
              <h2 className="text-2xl font-stencil text-white mb-2">
                {tech.title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {tech.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
