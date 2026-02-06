import React from 'react';
import { HeroSlider } from './components/HeroSlider';
import { Benefits } from './components/Benefits';
import Link from "next/link";
import { SITE_CONFIG } from '../config/site';
import { getHeroProductsCached } from './lib/data';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const heroDrones = await getHeroProductsCached();

  return (
    <>
      <HeroSlider initialDrones={heroDrones} />
      <Benefits />

      {/* Additional Content Section to fill space */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-tactical-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block border border-aero/30 p-8 tactical-clip bg-white/5 backdrop-blur-sm shadow-2xl shadow-aero/10">
            <h3 className="text-3xl font-stencil text-white mb-4">
              ГОТОВІ ДО СПІВПРАЦІ?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Ми відкриті до партнерства з волонтерськими фондами та державними
              замовниками.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/uav"
                className="bg-aero hover:bg-aero-light text-white font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-aero/20">

                Перейти до каталогу
              </Link>
              <a
                href={SITE_CONFIG.social.whatsapp}
                className="bg-transparent border border-white/20 hover:border-aero-accent text-white hover:text-aero-accent font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all text-center"
                target="_blank"
                rel="noreferrer"
              >
                Отримати консультацію
              </a>
            </div>
          </div>
        </div>
      </section>
    </>);

}
