"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { EWS } from '@/app/data/interface';

interface EwsCardProps {
  ews: EWS;
}

export function EwsCard({ ews }: EwsCardProps) {
  return (
    <Link href={`/electronic_warfare_systems/${ews.id}`} className="group block h-full">
      <div className="bg-gray-tactical/30 backdrop-blur-sm border border-white/10 tactical-clip h-full flex flex-col transition-all duration-300 hover:border-aero-accent/50 hover:bg-gray-tactical/50 hover:-translate-y-1 relative overflow-hidden">
        <div className="relative aspect-[4/3] bg-black/50 overflow-hidden border-b border-white/5 group-hover:border-aero-accent/20 transition-colors">
          {ews.image ? (
            <div className="relative w-full h-full">
              <Image
                src={ews.image}
                alt={ews.model}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl font-stencil text-white/20 group-hover:text-aero-accent/40 transition-colors">
                  EWS
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-stencil text-white group-hover:text-aero-accent transition-colors line-clamp-1">
            {ews.model}
          </h3>

          <div className="text-2xl font-bold text-white mt-2 font-mono">
            {ews.price.toLocaleString()} грн
          </div>

          <p className="text-sm text-gray-400 mt-3 line-clamp-3">
            {ews.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Статус: {ews.productionStatus === 'inProduction'
                ? 'В наявності'
                : ews.productionStatus === 'madeToOrder'
                ? 'Під замовлення'
                : 'Знятий з виробництва'}
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
