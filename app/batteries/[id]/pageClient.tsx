"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { BatteryCard } from '@/app/components/ui/BatteryCard';
import { SITE_CONFIG } from '@/config/site';

type Battery = {
  id: string;
  model: string;
  price: number;
  manufacturer: string;
  batteryType: string;
  configuration: string;
  fullConfiguration: string;
  capacity: number;
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
};

type Props = {
  battery: Battery;
  similar: Battery[];
};

export function BatteryDetailClient({ battery, similar }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const gallery = battery.gallery ?? [];
  const currentImage = gallery[currentImageIndex] || battery.image;

  const nextImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const messageText = useMemo(() => {
    const lines = [
      `Акумулятор: ${battery.model || 'Без назви'}`,
      `ID: ${battery.id}`,
      `Виробник: ${battery.manufacturer}`,
      `Тип: ${battery.batteryType}`,
      `Конфігурація: ${battery.configuration}`,
      `Повна конфігурація: ${battery.fullConfiguration}`,
      `Ємність: ${battery.capacity} мА·г`,
      `Ціна: ${battery.price.toLocaleString('uk-UA')} грн`,
    ];
    return lines.join('\n');
  }, [
    battery.id,
    battery.model,
    battery.manufacturer,
    battery.batteryType,
    battery.configuration,
    battery.fullConfiguration,
    battery.capacity,
    battery.price,
  ]);

  const whatsappMessage = useMemo(
    () => encodeURIComponent(messageText),
    [messageText]
  );

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Замовлення акумулятора');
    const body = encodeURIComponent(messageText);
    return `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  }, [messageText]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/batteries"
          className="inline-flex items-center text-gray-400 hover:text-aero-accent mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          До каталогу акумуляторів
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] bg-white border border-white/10 tactical-clip overflow-hidden group">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage}
                    alt={battery.model}
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
                    <span className="text-6xl font-stencil text-white/10">BAT</span>
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
                        alt={`${battery.model} - вид ${index + 1}`}
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
                {battery.model}
              </h1>
              <div className="text-3xl font-mono text-green-400">
                {battery.price.toLocaleString('uk-UA')} грн
              </div>
            </div>

            {battery.description && (
              <div
                className="text-gray-300 text-lg leading-relaxed mb-6 border-l-2 border-aero-accent pl-4"
                dangerouslySetInnerHTML={{ __html: battery.description }}
              />
            )}

            <div className="bg-black/50 border border-white/10 tactical-clip p-5 mb-8">
              <h3 className="text-lg font-stencil text-white mb-4 border-b border-white/10 pb-2">
                Характеристики
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Виробник</span>
                  <span className="text-white font-mono">{battery.manufacturer}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Тип</span>
                  <span className="text-white font-mono">{battery.batteryType}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Конфігурація</span>
                  <span className="text-white font-mono">{battery.configuration}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Повна конфігурація</span>
                  <span className="text-white font-mono">{battery.fullConfiguration}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Ємність</span>
                  <span className="text-white font-mono">{battery.capacity} мА·г</span>
                </div>
              </div>
            </div>

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

        {battery.detailedInfo && (
          <div className="bg-black/50 border border-white/10 tactical-clip p-8 mb-12">
            <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
              Детальний опис
            </h3>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: battery.detailedInfo }}
            />
          </div>
        )}

        {similar.length > 0 && (
          <div className="border-t border-white/10 pt-12">
            <h2 className="text-3xl font-stencil text-white mb-8">
              Схожі акумулятори
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((item) => (
                <BatteryCard key={item.id} battery={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
