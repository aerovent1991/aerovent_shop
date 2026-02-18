"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { EwsCard } from '@/app/components/ui/EwsCard';
import type { EWS } from '@/app/data/interface';
import { SITE_CONFIG } from '@/config/site';

type EwsDetailClientProps = {
  ews: EWS;
  similar: EWS[];
};

export function EwsDetailClient({ ews, similar }: EwsDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallery = ews.gallery ?? [];

  const nextImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentImage = gallery[currentImageIndex] || ews.image;

  const statusLabel =
    ews.productionStatus === 'inProduction'
      ? 'В наявності'
      : ews.productionStatus === 'madeToOrder'
      ? 'Під замовлення'
      : 'Знятий з виробництва';

  const messageText = useMemo(() => {
    const lines = [
      `РЕБ: ${ews.model || 'Без назви'}`,
      `ID: ${ews.id}`,
      `Статус: ${statusLabel}`,
      `Ціна: ${ews.price.toLocaleString('uk-UA')} грн`,
    ];
    return lines.join('\n');
  }, [ews.id, ews.model, ews.price, statusLabel]);

  const whatsappMessage = useMemo(
    () => encodeURIComponent(messageText),
    [messageText]
  );

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Замовлення РЕБ');
    const body = encodeURIComponent(messageText);
    return `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  }, [messageText]);


  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/electronic_warfare_systems"
          className="inline-flex items-center text-gray-400 hover:text-aero-accent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          До каталогу РЕБ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] bg-white border border-white/10 tactical-clip overflow-hidden group">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage}
                    alt={ews.model}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-contain object-center p-3"
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
                        {gallery.map((_: string, index: number) => (
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
                    <span className="text-6xl font-stencil text-white/10">EWS</span>
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
                    className={`aspect-[4/3] border-2 bg-white transition-all ${
                      index === currentImageIndex
                        ? 'border-aero-accent bg-aero/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${ews.model} - вид ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-contain p-1"
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
                {ews.model}
              </h1>
              <div className="text-3xl font-mono text-green-400">
                {ews.price.toLocaleString('uk-UA')} грн
              </div>
            </div>

            {ews.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-aero-accent pl-4">
                {ews.description}
              </p>
            )}

            <div className="space-y-3 mb-8">
              <a
                href={`${SITE_CONFIG.social.whatsapp}?text=${whatsappMessage}`}
                className="w-full bg-aero hover:bg-aero-light text-white font-bold py-4 px-8 tactical-clip uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg shadow-aero/20 text-lg flex items-center justify-center"
                target="_blank"
                rel="noreferrer"
              >
                <Target className="w-5 h-5 mr-2" />
                Замовити у WhatsApp
              </a>
              <a
                href={mailtoHref}
                className="w-full bg-transparent border border-white/20 hover:border-aero-accent text-white hover:text-aero-accent font-bold py-4 px-8 tactical-clip uppercase tracking-wider transition-all text-lg flex items-center justify-center"
              >
                Замовити через Email
              </a>
            </div>

            <p className="text-xs text-center text-gray-500 mb-8">
              * Для замовлення напишіть нам повідомлення або зателефонуйте
            </p>
          </div>
        </div>

        {ews.detailedInfo && (
          <div className="bg-black/50 border border-white/10 tactical-clip p-8 mb-12">
            <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
              Детальний опис
            </h3>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: ews.detailedInfo }}
            />
          </div>
        )}

        {similar.length > 0 && (
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-3xl font-stencil text-white mb-8">
              Схожі системи
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((item) => (
                <EwsCard key={item.id} ews={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
