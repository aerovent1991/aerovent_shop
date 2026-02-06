"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { DroneCard } from '@/app/components/ui/DroneCard';
import type { TransformedDrone } from '@/app/lib/drone-utils';
import type { RelatedDrone } from '@/app/lib/data';
import { SITE_CONFIG } from '@/config/site';

type UavDetailClientProps = {
  drone: TransformedDrone;
  relatedDrones: RelatedDrone[];
};

const getSpecValue = (specs: any[], key: string): string => {
  const spec = specs.find((s) => s.key === key);
  return spec?.value || 'N/A';
};

export function UavDetailClient({ drone, relatedDrones }: UavDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallery = drone.gallery ?? [];

  const nextImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentImage = gallery[currentImageIndex] || drone.image;
  const allSpecs = drone.specs || [];


  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/uav"
          className="inline-flex items-center text-gray-400 hover:text-aero-accent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          До каталогу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="relative aspect-square bg-black/50 border border-white/10 tactical-clip overflow-hidden group">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage}
                    alt={drone.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-contain p-8"
                    priority
                  />

                  {gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 border border-white/20 text-white hover:bg-black/70 transition-colors z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {gallery.map((_: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? 'bg-aero-accent w-4'
                                : 'bg-white/40 hover:bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center">
                    <span className="text-8xl font-stencil text-white/10">
                      {getSpecValue(allSpecs, 'size') || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-aero-accent bg-aero/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${drone.name} - вид ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-stencil text-white mb-4">
                {drone.name || 'Назва не вказана'}
              </h1>
              <div className="text-3xl font-mono text-green-400">
                {drone.price ? drone.price.toLocaleString() : '0'} грн
              </div>
            </div>

            {drone.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-aero-accent pl-4">
                {drone.description}
              </p>
            )}

            <a
              href={SITE_CONFIG.social.whatsapp}
              className="w-full bg-aero hover:bg-aero-light text-white font-bold py-4 px-8 tactical-clip uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-aero/20 text-lg flex items-center justify-center mb-8"
              target="_blank"
              rel="noreferrer"
            >
              <Target className="w-5 h-5 mr-2" />
              ЗАМОВИТИ ЦЕЙ КОМПЛЕКС
            </a>

            <p className="text-xs text-center text-gray-500 mb-8">
              * Для замовлення напишіть нам повідомлення або зателефонуйте
            </p>

            <div className="bg-black/50 border border-white/10 tactical-clip p-6 mb-8">
              <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
                ТЕХНІЧНІ ХАРАКТЕРИСТИКИ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {allSpecs.map((spec: any) => (
                  <div key={spec.key} className="flex items-start space-x-3">
                    <span className="text-aero-accent mt-0.5">{spec.icon || '•'}</span>
                    <div className="flex-1 border-b border-white/5 pb-3">
                      <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                        {spec.label || 'Назва'}
                      </div>
                      <div className="text-lg font-bold text-white font-mono">
                        {spec.value || 'N/A'} {spec.unit || ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {drone.detailedInfo && (
          <div className="bg-black/50 border border-white/10 tactical-clip p-8 mb-12">
            <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
              ДЕТАЛЬНИЙ ОПИС
            </h3>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: drone.detailedInfo }}
            />
          </div>
        )}

        {relatedDrones.length > 0 && (
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-3xl font-stencil text-white mb-8">
              СХОЖІ МОДЕЛІ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDrones.map((relatedDrone) => (
                <DroneCard key={relatedDrone.id} drone={relatedDrone} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
