"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Loader2
} from 'lucide-react';
import { BatteryCard } from '@/app/components/ui/BatteryCard';
import { FilterCheckbox } from '@/app/components/ui/FilterCheckbox';

interface Battery {
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
}

interface FiltersData {
  manufacturers: string[];
  batteryTypes: string[];
  configurations: string[];
  priceRange: { min: number; max: number };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BatteriesCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [items, setItems] = useState<Battery[]>([]);
  const [filtered, setFiltered] = useState<Battery[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersData, setFiltersData] = useState<FiltersData>({
    manufacturers: [],
    batteryTypes: [],
    configurations: [],
    priceRange: { min: 0, max: 100000 }
  });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  const fetchBatteries = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (searchQuery) params.append('search', searchQuery);
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());

      if (selectedManufacturers.length > 0) {
        params.append('manufacturer', selectedManufacturers.join(','));
      }
      if (selectedTypes.length > 0) {
        params.append('batteryType', selectedTypes.join(','));
      }
      if (selectedConfigurations.length > 0) {
        params.append('configuration', selectedConfigurations.join(','));
      }

      const response = await fetch(`/api/batteries?${params}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
        setPagination(data.pagination);

        if (isInitialMount.current) {
          setFiltersData(data.filters);
          setPriceRange([data.filters.priceRange.min, data.filters.priceRange.max]);
          isInitialMount.current = false;
        }
      }
    } catch (error) {
      console.error('Помилка завантаження акумуляторів:', error);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    priceRange,
    selectedManufacturers,
    selectedTypes,
    selectedConfigurations
  ]);

  const applySort = useCallback((list: Battery[] = items) => {
    let sorted = [...list];
    if (sortOrder === 'asc') sorted.sort((a, b) => a.price - b.price);
    if (sortOrder === 'desc') sorted.sort((a, b) => b.price - a.price);
    setFiltered(sorted);
  }, [sortOrder, items]);

  useEffect(() => {
    fetchBatteries(1);
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchBatteries(1);
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery, priceRange, selectedManufacturers, selectedTypes, selectedConfigurations]);

  useEffect(() => {
    applySort();
  }, [sortOrder, items]);

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedManufacturers([]);
    setSelectedTypes([]);
    setSelectedConfigurations([]);
    setSortOrder(null);
    setPriceRange([filtersData.priceRange.min, filtersData.priceRange.max]);
    fetchBatteries(1);
  };

  const changePage = (page: number) => {
    fetchBatteries(page);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-stencil text-white mb-2">
              АКУМУЛЯТОРИ
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
              <button
                className="md:hidden p-2 border border-white/10 text-aero-accent"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {isMobileFiltersOpen && (
            <button
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
              aria-label="Закрити фільтри"
            />
          )}
          <aside
            className={`
              lg:w-72 flex-shrink-0
              fixed lg:static inset-y-0 left-0 w-[85%] max-w-sm z-40 bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
              transform transition-transform duration-300 ease-in-out
              ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              p-6 lg:p-0 overflow-y-auto lg:overflow-visible
            `}
          >
            <div className="flex justify-between items-center lg:hidden mb-6">
              <h2 className="text-xl font-stencil text-white">ФІЛЬТРИ</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-8 lg:sticky lg:top-28">
              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Ціна (грн)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Від</label>
                      <input
                        type="number"
                        min={filtersData.priceRange.min}
                        max={filtersData.priceRange.max}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || filtersData.priceRange.min, priceRange[1]])}
                        className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">До</label>
                      <input
                        type="number"
                        min={filtersData.priceRange.min}
                        max={filtersData.priceRange.max}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || filtersData.priceRange.max])}
                        className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="px-2">
                    <input
                      type="range"
                      min={filtersData.priceRange.min}
                      max={filtersData.priceRange.max}
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-aero-accent"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{filtersData.priceRange.min} грн</span>
                      <span>{filtersData.priceRange.max} грн</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Виробник
                </h3>
                <div className="space-y-3">
                  {filtersData.manufacturers.map((item) => (
                    <FilterCheckbox
                      key={item}
                      label={item}
                      checked={selectedManufacturers.includes(item)}
                      onChange={() => toggle(item, selectedManufacturers, setSelectedManufacturers)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Тип акумулятора
                </h3>
                <div className="space-y-3">
                  {filtersData.batteryTypes.map((item) => (
                    <FilterCheckbox
                      key={item}
                      label={item}
                      checked={selectedTypes.includes(item)}
                      onChange={() => toggle(item, selectedTypes, setSelectedTypes)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Конфігурація
                </h3>
                <div className="space-y-3">
                  {filtersData.configurations.map((item) => (
                    <FilterCheckbox
                      key={item}
                      label={item}
                      checked={selectedConfigurations.includes(item)}
                      onChange={() => toggle(item, selectedConfigurations, setSelectedConfigurations)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetFilters}
                  className="w-full py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors text-sm uppercase tracking-wider"
                >
                  Скинути фільтри
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-aero-accent animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((battery) => (
                    <BatteryCard key={battery.id} battery={battery} />
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
      </div>
    </div>
  );
}
