import React from 'react';
import { Crosshair, ShieldCheck, Flag, Users, Wrench, Zap } from 'lucide-react';
export function Benefits() {
  const benefits = [
  {
    icon: <Users className="h-10 w-10 text-aero-accent" strokeWidth={1.5} />,
    title: 'КЛІЄНТООРІЄНТОВАНІСТЬ',
    description:
    'Ми прагнемо забезпечити всі потреби клієнтів, готові до важких задач та нестандартних рішень для досягнення мети.',
    number: '01'
  },
  {
    icon:
    <ShieldCheck className="h-10 w-10 text-aero-accent" strokeWidth={1.5} />,

    title: 'НАДІЙНІСТЬ',
    description:
    'Наші системи працюють стабільно навіть у найскладніших умовах радіоелектронної боротьби.',
    number: '02'
  },
  {
    icon: <Wrench className="h-10 w-10 text-aero-accent" strokeWidth={1.5} />,
    title: 'ПІДТРИМКА ПРОДУКТІВ',
    description:
    'Оперативний сервіс, постійна модернізація під потреби фронту та цілодобова технічна підтримка користувачів.',
    number: '03'
  }];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-tactical-grid opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>

      {/* Blue Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aero/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-aero-accent font-mono text-sm tracking-[0.3em] uppercase mb-2 block">
            Наші цінності
          </span>
          <h2 className="text-4xl md:text-5xl font-stencil text-white mb-4">
            ЧОМУ ОБИРАЮТЬ НАС
          </h2>
          <div className="w-24 h-1 bg-aero mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) =>
          <div
            key={idx}
            className="group relative bg-gray-tactical/30 backdrop-blur-sm border border-white/5 p-8 tactical-clip hover:bg-gray-tactical/50 transition-all duration-300 hover:-translate-y-2 hover:border-aero/30">

              {/* Card Number */}
              <div className="absolute top-4 right-4 text-4xl font-stencil text-white/5 group-hover:text-aero/20 transition-colors">
                {benefit.number}
              </div>

              {/* Icon Container */}
              <div className="mb-6 inline-block p-4 bg-aero/10 rounded-sm border border-white/10 group-hover:border-aero-accent/50 transition-colors">
                {benefit.icon}
              </div>

              <h3 className="text-2xl font-stencil text-white mb-4 group-hover:text-aero-accent transition-colors">
                {benefit.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {benefit.description}
              </p>

              {/* Corner Accents */}
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 group-hover:border-aero-accent/50 transition-colors"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-aero-accent/50 transition-colors"></div>
            </div>
          )}
        </div>
      </div>
    </section>);

}