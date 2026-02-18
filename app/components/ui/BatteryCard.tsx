"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface BatteryCardProps {
  battery: {
    id: string;
    model: string;
    price: number;
    manufacturer: string;
    batteryType: string;
    configuration: string;
    image?: string;
    description: string;
  };
}

export function BatteryCard({ battery }: BatteryCardProps) {
  return (
    <Link href={`/batteries/${battery.id}`} className="group block h-full">
      <div className="bg-gray-tactical/30 backdrop-blur-sm border border-white/10 tactical-clip h-full flex flex-col transition-all duration-300 hover:border-aero-accent/50 hover:bg-gray-tactical/50 hover:-translate-y-1 relative overflow-hidden">
        <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-white/5 group-hover:border-aero-accent/20 transition-colors">
          {battery.image ? (
            <div className="relative w-full h-full">
              <Image
                src={battery.image}
                alt={battery.model}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-stencil text-white/20">BAT</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-stencil text-white group-hover:text-aero-accent transition-colors line-clamp-1">
            {battery.model}
          </h3>
          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {battery.price.toLocaleString()} грн
          </div>
          <p className="text-sm text-gray-400 mt-3 line-clamp-3">
            {battery.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {battery.manufacturer} • {battery.batteryType} • {battery.configuration}
            </span>
            <span className="flex items-center text-aero-accent text-sm font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              Переглянути <ChevronRight className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
