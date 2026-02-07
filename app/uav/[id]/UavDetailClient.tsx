"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { DroneCard } from '@/app/components/ui/DroneCard';
import type { TransformedDrone } from '@/app/lib/drone-utils';
import type { RelatedDrone, DroneOptionGroup } from '@/app/lib/data';
import { SITE_CONFIG } from '@/config/site';

type UavDetailClientProps = {
  drone: TransformedDrone;
  relatedDrones: RelatedDrone[];
  optionGroups: DroneOptionGroup[];
};

const getSpecValue = (specs: any[], key: string): string => {
  const spec = specs.find((s) => s.key === key);
  return spec?.value || 'N/A';
};

export function UavDetailClient({ drone, relatedDrones, optionGroups }: UavDetailClientProps) {
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

  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!optionGroups || optionGroups.length === 0) return;
    const next: Record<string, number> = {};
    optionGroups.forEach((group) => {
      const def = group.options.find((opt) => opt.isDefault) ?? group.options[0];
      if (def) next[group.code] = def.id;
    });
    setSelectedOptions(next);
  }, [optionGroups]);

  const resolvedSelections = useMemo(() => {
    if (!optionGroups || optionGroups.length === 0) return [];
    return optionGroups.map((group) => {
      const selectedId = selectedOptions[group.code];
      return (
        group.options.find((opt) => opt.id === selectedId) ??
        group.options.find((opt) => opt.isDefault) ??
        group.options[0]
      );
    });
  }, [optionGroups, selectedOptions]);

  const totalPrice = useMemo(() => {
    const base = Number(drone.price || 0);
    const add = resolvedSelections.reduce((sum, opt) => sum + (opt?.price || 0), 0);
    return base + add;
  }, [drone.price, resolvedSelections]);

  const formatDelta = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toLocaleString('uk-UA')} грн`;
  };

  const configLines = useMemo(() => {
    if (!optionGroups || optionGroups.length === 0) return [];
    return optionGroups.map((group) => {
      const selectedId = selectedOptions[group.code];
      const selected =
        group.options.find((o) => o.id === selectedId) ??
        group.options.find((o) => o.isDefault) ??
        group.options[0];

      if (!selected) return `${group.label}: -`;

      const priceText = selected.price
        ? `(${formatDelta(selected.price)})`
        : '(+0грн)';

      return `${group.label}: ${selected.label} ${priceText}`;
    });
  }, [optionGroups, selectedOptions]);

  const messageText = useMemo(() => {
    const lines = [
      `Дрон: ${drone.name || 'Без назви'}`,
      `ID: ${drone.id}`,
      `Розмір: ${drone.size || 'N/A'} дюймів`,
      `Тип зв’язку: ${drone.connection || 'N/A'}`,
      `Базова ціна: ${Number(drone.price || 0).toLocaleString('uk-UA')} грн`,
      'Конфігурація:',
      ...configLines,
      `Разом: ${totalPrice.toLocaleString('uk-UA')} грн`,
    ];
    return lines.join('\n');
  }, [drone.id, drone.name, drone.price, drone.size, drone.connection, configLines, totalPrice]);

  const whatsappMessage = useMemo(
    () => encodeURIComponent(messageText),
    [messageText]
  );

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Замовлення дрона');
    const body = encodeURIComponent(messageText);
    return `mailto:${SITE_CONFIG.contact.email}?subject=${subject}&body=${body}`;
  }, [messageText]);

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
            <div className="relative aspect-[4/3] bg-black/50 border border-white/10 tactical-clip overflow-hidden group">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage}
                    alt={drone.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover object-center"
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
                      className={`aspect-[4/3] border-2 transition-all ${
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
                {totalPrice.toLocaleString('uk-UA')} грн
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Базова ціна (без модулів*): {Number(drone.price || 0).toLocaleString('uk-UA')} грн
              </div>
            </div>

            {drone.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-aero-accent pl-4">
                {drone.description}
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

            {optionGroups && optionGroups.length > 0 && (
              <div className="bg-black/50 border border-white/10 tactical-clip p-5 mb-8">
                <h3 className="text-lg font-stencil text-white mb-4 border-b border-white/10 pb-3">
                  Конфігурація
                </h3>
                <div className="space-y-5">
                  {optionGroups.map((group) => {
                    const selectedId = selectedOptions[group.code];
                    return (
                      <div key={group.code} className="space-y-2">
                        <div className="text-xs text-gray-400 uppercase tracking-wider">
                          {group.label}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {group.options.map((opt) => {
                            const checked = selectedId === opt.id;
                            const selectedPrice =
                              group.options.find((o) => o.id === selectedId)?.price ?? 0;
                            const delta = opt.price - selectedPrice;
                            return (
                              <label
                                key={opt.id}
                                className={`flex items-center justify-between gap-2 border px-2.5 py-2 text-xs cursor-pointer transition-colors ${
                                  checked
                                    ? 'border-aero-accent bg-aero/10 text-white'
                                    : 'border-white/10 text-gray-300 hover:border-white/30'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`opt-${group.code}`}
                                    checked={checked}
                                    onChange={() =>
                                      setSelectedOptions((prev) => ({
                                        ...prev,
                                        [group.code]: opt.id,
                                      }))
                                    }
                                    className="accent-aero-accent"
                                  />
                                  <span className="leading-tight">{opt.label}</span>
                                </div>
                                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                  {formatDelta(delta)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/50 border border-white/10 tactical-clip p-6 mb-8">
          <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
            Технічні характеристики
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
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

        {drone.detailedInfo && (
          <div className="bg-black/50 border border-white/10 tactical-clip p-8 mb-12">
            <h3 className="text-xl font-stencil text-white mb-6 border-b border-white/10 pb-3">
              Детальний опис
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
              Схожі моделі
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
