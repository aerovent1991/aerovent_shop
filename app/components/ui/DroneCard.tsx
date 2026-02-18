"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Battery, Gauge, Weight, Crosshair } from 'lucide-react';

interface DroneCardProps {
  drone: {
    id: string;
    model: string;
    price: number;
    size: number;
    application: string;
    connection: string;
    specsRange?: string;
    flightTime?: string;
    payload?: string;
    camera?: string;
    image?: string;
  };
}

export function DroneCard({ drone }: DroneCardProps) {
  const getApplicationLabel = (app: string) => {
    switch(app) {
      case 'kamikaze': return 'Камікадзе';
      case 'recon': return 'Розвідник';
      case 'bomber': return 'Бомбер';
      case 'relay': return 'Ретранслятор';
      case 'antiaircraft': return 'Зенітний';
      default: return app.toUpperCase();
    }
  };

  const getConnectionLabel = (conn: string) => {
    switch(conn) {
      case 'fiber': return 'FIBER';
      case 'radio': return 'RADIO';
      case 'satellite': return 'SATELLITE';
      default: return conn.toUpperCase();
    }
  };

  return (
    <Link href={`/uav/${drone.id}`} className="group block h-full">
      <div className="bg-gray-tactical/30 backdrop-blur-sm border border-white/10 tactical-clip h-full flex flex-col transition-all duration-300 hover:border-aero-accent/50 hover:bg-gray-tactical/50 hover:-translate-y-1 relative overflow-hidden">
        <div className="relative h-48 bg-white overflow-hidden border-b border-white/5 group-hover:border-aero-accent/20 transition-colors">
          {drone.image ? (
            <div className="relative w-full h-full">
              <Image
                src={drone.image}
                alt={drone.model}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl font-stencil text-white/20 group-hover:text-aero-accent/40 transition-colors">
                  {drone.size}"
                </span>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {drone.connection && (
              <span className="bg-aero-accent text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                {getConnectionLabel(drone.connection)}
              </span>
            )}
            {drone.application && (
              <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider border border-white/30">
                {getApplicationLabel(drone.application)}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-stencil text-white group-hover:text-aero-accent transition-colors line-clamp-1">
              {drone.model}
            </h3>
          </div>

          <div className="text-2xl font-bold text-white mb-4 font-mono">
            {drone.price.toLocaleString()} грн
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-gray-400">
            <div className="flex flex-col items-center p-2 bg-white/5 rounded border border-white/5">
              <Crosshair className="w-4 h-4 mb-1 text-aero-accent" />
              <span>{drone.specsRange || 'N/A'} км</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded border border-white/5">
              <Gauge className="w-4 h-4 mb-1 text-aero-accent" />
              <span>{drone.flightTime || 'N/A'} хв</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white/5 rounded border border-white/5">
              <Weight className="w-4 h-4 mb-1 text-aero-accent" />
              <span>{drone.payload || 'N/A'} кг</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Розмір: {drone.size || 'N/A'} дюймів
            </span>
            <span className="flex items-center text-aero-accent text-sm font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              Переглянути <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 group-hover:border-aero-accent transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10 group-hover:border-aero-accent transition-colors"></div>
      </div>
    </Link>
  );
}
