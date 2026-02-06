"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Search,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Loader2
} from 'lucide-react';
import { DetectorCard } from '@/app/components/ui/DetectorCard';
import type { Metadata } from 'next';

interface Detector {
  id: string;
  model: string;
  price: number;
  productionStatus: string;
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function DroneDetectorsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Detector[]>([]);
  const [filtered, setFiltered] = useState<Detector[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchDetectors = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/drone_detectors?${params}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Помилка завантаження детекторів:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const applySort = useCallback((list: Detector[] = items) => {
    let sorted = [...list];
    if (sortOrder === 'asc') sorted.sort((a, b) => a.price - b.price);
    if (sortOrder === 'desc') sorted.sort((a, b) => b.price - a.price);
    setFiltered(sorted);
  }, [sortOrder, items]);

  useEffect(() => {
    fetchDetectors(1);
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchDetectors(1);
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    applySort();
  }, [sortOrder, items]);

  const changePage = (page: number) => {
    fetchDetectors(page);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-stencil text-white mb-2">
              ДЕТЕКТОРИ ДРОНІВ
            </h1>
            <p className="text-gray-400">
              Знайдено:{' '}
              <span className="text-aero-accent font-mono">
                {loading ? '...' : filtered.length}
              </span>{' '}
              позицій
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <input
                type="text"
                placeholder="Пошук за назвою..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-aero-accent transition-colors"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
                className={`p-2 border ${
                  sortOrder === 'asc'
                    ? 'border-aero-accent bg-aero/20 text-white'
                    : 'border-white/10 text-gray-400 hover:text-white'
                } transition-colors`}
                title="Спочатку дешевші"
              >
                <ArrowDownWideNarrow className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
                className={`p-2 border ${
                  sortOrder === 'desc'
                    ? 'border-aero-accent bg-aero/20 text-white'
                    : 'border-white/10 text-gray-400 hover:text-white'
                } transition-colors`}
                title="Спочатку дорожчі"
              >
                <ArrowUpWideNarrow className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-aero-accent animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((detector) => (
                <DetectorCard key={detector.id} detector={detector} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Попередня
                </button>

                <div className="flex space-x-1">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => changePage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center border ${
                        pagination.page === i + 1
                          ? 'border-aero-accent bg-aero/20 text-white'
                          : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Наступна
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border border-white/5 bg-white/5 tactical-clip">
            <p className="text-xl text-gray-400 mb-4">
              За вашим запитом нічого не знайдено
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
