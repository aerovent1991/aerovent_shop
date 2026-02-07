"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Loader2
} from 'lucide-react';
import { DroneCard } from '../components/ui/DroneCard';
import { FilterCheckbox } from '../components/ui/FilterCheckbox';

// Типи для даних з API
interface Drone {
  id: string;
  model: string;
  price: number;
  productionStatus: string;
  size: number;
  application: string;
  connection: string;
  specsRange?: string;
  flightTime?: string;
  maxSpeed?: string;
  payload?: string;
  camera?: string;
  maxAltitude?: string;
  operationalRange?: string;
  battery?: string;
  description?: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
  createdAt: string;
}

interface FiltersData {
  applications: string[];
  connections: string[];
  priceRange: { min: number; max: number };
  sizeRange: { min: number; max: number };
  productionStatuses: string[];
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function UAVCatalog() {
  // Стани для фільтрів
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['inProduction']);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Стани для даних
  const [drones, setDrones] = useState<Drone[]>([]);
  const [filteredDrones, setFilteredDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersData, setFiltersData] = useState<FiltersData>({
    applications: [],
    connections: [],
    priceRange: { min: 0, max: 100000 },
    sizeRange: { min: 0, max: 1000 },
    productionStatuses: []
  });
  
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const isInitialMount = useRef(true);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); // Виправлено тип

  // Основна функція завантаження даних
  const fetchDrones = useCallback(async (page: number = 1, applyFilters: boolean = false) => {
    try {
      setLoading(true);
      
      // Побудова query параметрів для API
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      // Пошук
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // Статуси
      if (selectedStatuses.length > 0) {
        params.append('productionStatus', selectedStatuses.join(','));
      }

      // Якщо треба застосувати фільтри на сервері
      if (applyFilters) {
        // Ціна
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());

        // Застосування
        if (selectedApplications.length > 0) {
          params.append('application', selectedApplications.join(','));
        }

        // Зв'язок
        if (selectedConnections.length > 0) {
          params.append('connection', selectedConnections.join(','));
        }

        // Розмір
        if (selectedSizes.length > 0) {
          params.append('minSize', Math.min(...selectedSizes).toString());
          params.append('maxSize', Math.max(...selectedSizes).toString());
        }
      }

      console.log('Запит до API з параметрами:', Object.fromEntries(params));

      const response = await fetch(`/api/uav?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const dronesData = data.data;
        
        // Зберігаємо всі дрони
        setDrones(dronesData);
        setPagination(data.pagination);
        
        // Оновлюємо доступні фільтри при першому завантаженні
        if (isInitialMount.current) {
          setFiltersData(data.filters);
          // Встановлюємо повний діапазон цін
          setPriceRange([data.filters.priceRange.min, data.filters.priceRange.max]);
          isInitialMount.current = false;
        }
        
        // Застосовуємо клієнтські фільтри
        applyClientFilters(dronesData);
      }
    } catch (error) {
      console.error('Помилка завантаження дронів:', error);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    priceRange,
    selectedApplications,
    selectedConnections,
    selectedStatuses,
    selectedSizes
  ]);

  // Функція клієнтської фільтрації
  const applyClientFilters = useCallback((dronesList: Drone[] = drones) => {
    let filtered = [...dronesList];

    // Фільтр за розміром
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(drone => selectedSizes.includes(drone.size));
    }

    // Фільтр за застосуванням
    if (selectedApplications.length > 0) {
      filtered = filtered.filter(drone => selectedApplications.includes(drone.application));
    }

    // Фільтр за зв'язком
    if (selectedConnections.length > 0) {
      filtered = filtered.filter(drone => selectedConnections.includes(drone.connection));
    }

    // Фільтр за ціною
    filtered = filtered.filter(drone => 
      drone.price >= priceRange[0] && drone.price <= priceRange[1]
    );

    // Сортування
    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredDrones(filtered);
  }, [selectedSizes, selectedApplications, selectedConnections, priceRange, sortOrder, drones]);

  // Початкове завантаження
  useEffect(() => {
    fetchDrones(1, false);
  }, []);

  // Дебаунс для пошуку та статусів (відправляємо на сервер)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchDrones(1, false);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery, selectedStatuses]);

  // Ефект для клієнтських фільтрів
  useEffect(() => {
    if (isInitialMount.current) return;
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      applyClientFilters();
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [
    selectedSizes,
    selectedApplications,
    selectedConnections,
    priceRange,
    sortOrder
  ]);

  // Обробники фільтрів
  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleConnection = (conn: string) => {
    setSelectedConnections((prev) => {
      if (prev.includes(conn)) {
        return prev.filter((c) => c !== conn);
      } else {
        return [...prev, conn];
      }
    });
  };

  const toggleApplication = (app: string) => {
    setSelectedApplications((prev) => {
      if (prev.includes(app)) {
        return prev.filter((a) => a !== app);
      } else {
        return [...prev, app];
      }
    });
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const handleMinPriceChange = (value: number) => {
    const minValue = Math.max(filtersData.priceRange.min, value);
    const maxValue = Math.max(minValue, priceRange[1]);
    setPriceRange([minValue, maxValue]);
  };

  const handleMaxPriceChange = (value: number) => {
    const maxValue = Math.min(filtersData.priceRange.max, value);
    const minValue = Math.min(priceRange[0], maxValue);
    setPriceRange([minValue, maxValue]);
  };

  const handleSliderChange = (value: number) => {
    setPriceRange([priceRange[0], value]);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([filtersData.priceRange.min, filtersData.priceRange.max]);
    setSelectedSizes([]);
    setSelectedConnections([]);
    setSelectedApplications([]);
    setSelectedStatuses(['inProduction']);
    setSortOrder(null);
    fetchDrones(1, false);
  };

  const applyAllFilters = () => {
    fetchDrones(1, true);
  };

  const changePage = (page: number) => {
    fetchDrones(page, true); // Завжди з фільтрами
  };

  // Отримуємо унікальні розміри з даних
  const sizeOptions = Array.from(
    new Map(
      drones
        .filter(d => d.size)
        .map(d => [d.size, drones.filter(d2 => d2.size === d.size).length])
    ).entries()
  ).sort((a, b) => a[0] - b[0]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-stencil text-white mb-2">
              КАТАЛОГ БПЛА
            </h1>
            <p className="text-gray-400">
              Знайдено:{' '}
              <span className="text-aero-accent font-mono">
                {loading ? '...' : filteredDrones.length}
              </span>{' '}
              дронів
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <input
                type="text"
                placeholder="Пошук за назвою..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-aero-accent transition-colors"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newSort = sortOrder === 'asc' ? null : 'asc';
                  setSortOrder(newSort);
                }}
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
                onClick={() => {
                  const newSort = sortOrder === 'desc' ? null : 'desc';
                  setSortOrder(newSort);
                }}
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
          {/* Sidebar Filters */}
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
              {/* Price Filter - ВИПРАВЛЕНО */}
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
                        onChange={(e) => handleMinPriceChange(parseInt(e.target.value) || filtersData.priceRange.min)}
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
                        onChange={(e) => handleMaxPriceChange(parseInt(e.target.value) || filtersData.priceRange.max)}
                        className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <input
                      type="range"
                      min={filtersData.priceRange.min}
                      max={filtersData.priceRange.max}
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-aero-accent"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{filtersData.priceRange.min} грн</span>
                      <span>{filtersData.priceRange.max} грн</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Розмір (Дюйми)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sizeOptions.map(([size, count]) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`
                        text-xs py-2 px-3 border transition-all
                        ${
                          selectedSizes.includes(size)
                            ? 'bg-aero-accent text-black border-aero-accent font-bold'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                        }
                      `}
                    >
                      {size}" <span className="opacity-50 ml-1">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection Filter */}
              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Тип зв'язку
                </h3>
                <div className="space-y-3">
                  <FilterCheckbox
                    label="Радіозв'язок"
                    checked={selectedConnections.includes('radio')}
                    onChange={() => toggleConnection('radio')}
                  />
                  <FilterCheckbox
                    label="Оптоволокно"
                    checked={selectedConnections.includes('fiber')}
                    onChange={() => toggleConnection('fiber')}
                  />
                  <FilterCheckbox
                    label="Супутик"
                    checked={selectedConnections.includes('satellite')}
                    onChange={() => toggleConnection('satellite')}
                  />
                  <FilterCheckbox
                    label="Змішаний"
                    checked={selectedConnections.includes('mixed')}
                    onChange={() => toggleConnection('mixed')}
                  />
                </div>
              </div>

              {/* Application Filter */}
              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Застосування
                </h3>
                <div className="space-y-3">
                  <FilterCheckbox
                    label="Розвідник"
                    checked={selectedApplications.includes('recon')}
                    onChange={() => toggleApplication('recon')}
                  />
                  <FilterCheckbox
                    label="Камікадзе"
                    checked={selectedApplications.includes('kamikaze')}
                    onChange={() => toggleApplication('kamikaze')}
                  />
                  <FilterCheckbox
                    label="Ретранслятор"
                    checked={selectedApplications.includes('relay')}
                    onChange={() => toggleApplication('relay')}
                  />
                  <FilterCheckbox
                    label="Зенітний"
                    checked={selectedApplications.includes('antiaircraft')}
                    onChange={() => toggleApplication('antiaircraft')}
                  />
                  <FilterCheckbox
                    label="Бомбер"
                    checked={selectedApplications.includes('bomber')}
                    onChange={() => toggleApplication('bomber')}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  Статус
                </h3>
                <div className="space-y-3">
                  <FilterCheckbox
                    label="В наявності"
                    checked={selectedStatuses.includes('inProduction')}
                    onChange={() => toggleStatus('inProduction')}
                  />
                  <FilterCheckbox
                    label="Під замовлення"
                    checked={selectedStatuses.includes('madeToOrder')}
                    onChange={() => toggleStatus('madeToOrder')}
                  />
                  <FilterCheckbox
                    label="Знятий з виробництва"
                    checked={selectedStatuses.includes('discontinued')}
                    onChange={() => toggleStatus('discontinued')}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {/* <button
                  onClick={applyAllFilters}
                  className="w-full py-3 bg-aero hover:bg-aero-light text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Застосувати всі фільтри
                </button> */}
                <button
                  onClick={resetFilters}
                  className="w-full py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors text-sm uppercase tracking-wider"
                >
                  Скинути фільтри
                </button>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-aero-accent animate-spin" />
              </div>
            ) : filteredDrones.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDrones.map((drone) => (
                    <DroneCard key={drone.id} drone={drone} />
                  ))}
                </div>
                
                {/* Пагінація */}
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
                <button
                  onClick={resetFilters}
                  className="text-aero-accent hover:underline"
                >
                  Скинути всі фільтри
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React, { useMemo, useState } from 'react';
// import {
//   Search,
//   SlidersHorizontal,
//   X,
//   ArrowDownWideNarrow,
//   ArrowUpWideNarrow
// } from 'lucide-react';
// import { drones, Drone } from '../data/drones';
// import { DroneCard } from '../components/ui/DroneCard';
// import { FilterCheckbox } from '../components/ui/FilterCheckbox';

// export default function UAVCatalog() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
//   const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
//   const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
//   const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
//   const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

//   // Extract unique sizes and count them
//   const sizeOptions = useMemo(() => {
//     const sizes = new Map<number, number>();
//     drones.forEach((d) => {
//       sizes.set(d.size, (sizes.get(d.size) || 0) + 1);
//     });
//     return Array.from(sizes.entries()).sort((a, b) => a[0] - b[0]);
//   }, []);

//   // Filter drones
//   const filteredDrones = useMemo(() => {
//     return drones.filter((drone) => {
//       // Search
//       if (
//         searchQuery &&
//         !drone.name.toLowerCase().includes(searchQuery.toLowerCase())
//       ) {
//         return false;
//       }

//       // Price
//       if (drone.price < priceRange[0] || drone.price > priceRange[1]) {
//         return false;
//       }

//       // Size
//       if (selectedSizes.length > 0 && !selectedSizes.includes(drone.size)) {
//         return false;
//       }

//       // Connection
//       if (selectedConnections.length > 0) {
//         const matchesFiber =
//           selectedConnections.includes('fiber') && 
//           (drone.connection === 'fiber' || drone.connection === 'both');
//         const matchesRadio =
//           selectedConnections.includes('radio') && 
//           (drone.connection === 'radio' || drone.connection === 'both');
//         if (!matchesFiber && !matchesRadio) return false;
//       }

//       // Application
//       if (selectedApplications.length > 0) {
//         const hasSelectedApp = selectedApplications.some((app) =>
//           drone.application.includes(app as any)
//         );
//         if (!hasSelectedApp) return false;
//       }

//       return true;
//     }).sort((a, b) => {
//       if (sortOrder === 'asc') return a.price - b.price;
//       if (sortOrder === 'desc') return b.price - a.price;
//       return 0;
//     });
//   }, [
//     searchQuery,
//     priceRange,
//     selectedSizes,
//     selectedConnections,
//     selectedApplications,
//     sortOrder
//   ]);

//   const toggleSize = (size: number) => {
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//     );
//   };

//   const toggleConnection = (conn: string) => {
//     setSelectedConnections((prev) =>
//       prev.includes(conn) ? prev.filter((c) => c !== conn) : [...prev, conn]
//     );
//   };

//   const toggleApplication = (app: string) => {
//     setSelectedApplications((prev) =>
//       prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
//     );
//   };

//   const resetFilters = () => {
//     setPriceRange([0, 100000]);
//     setSelectedSizes([]);
//     setSelectedConnections([]);
//     setSelectedApplications([]);
//     setSearchQuery('');
//     setSortOrder(null);
//   };

//   return (
//     <div className="min-h-screen bg-black pt-24 pb-12">
//       <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-4xl font-stencil text-white mb-2">
//               КАТАЛОГ БПЛА
//             </h1>
//             <p className="text-gray-400">
//               Знайдено:{' '}
//               <span className="text-aero-accent font-mono">
//                 {filteredDrones.length}
//               </span>{' '}
//               дронів
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
//             <div className="relative flex-grow sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Пошук за назвою..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-aero-accent transition-colors"
//               />
//               <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setSortOrder('asc')}
//                 className={`p-2 border ${
//                   sortOrder === 'asc'
//                     ? 'border-aero-accent bg-aero/20 text-white'
//                     : 'border-white/10 text-gray-400 hover:text-white'
//                 } transition-colors`}
//                 title="Спочатку дешевші"
//               >
//                 <ArrowDownWideNarrow className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setSortOrder('desc')}
//                 className={`p-2 border ${
//                   sortOrder === 'desc'
//                     ? 'border-aero-accent bg-aero/20 text-white'
//                     : 'border-white/10 text-gray-400 hover:text-white'
//                 } transition-colors`}
//                 title="Спочатку дорожчі"
//               >
//                 <ArrowUpWideNarrow className="w-5 h-5" />
//               </button>
//               <button
//                 className="md:hidden p-2 border border-white/10 text-aero-accent"
//                 onClick={() => setIsMobileFiltersOpen(true)}
//               >
//                 <SlidersHorizontal className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar Filters */}
//           <aside
//             className={`
//             lg:w-72 flex-shrink-0 
//             fixed lg:static inset-0 z-40 bg-black/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none
//             transform transition-transform duration-300 ease-in-out
//             ${
//               isMobileFiltersOpen
//                 ? 'translate-x-0'
//                 : '-translate-x-full lg:translate-x-0'
//             }
//             p-6 lg:p-0 overflow-y-auto lg:overflow-visible
//           `}
//           >
//             <div className="flex justify-between items-center lg:hidden mb-6">
//               <h2 className="text-xl font-stencil text-white">ФІЛЬТРИ</h2>
//               <button onClick={() => setIsMobileFiltersOpen(false)}>
//                 <X className="w-6 h-6 text-gray-400" />
//               </button>
//             </div>

//             <div className="space-y-8 lg:sticky lg:top-28">
//               {/* Price Filter */}
//               <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
//                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
//                   Ціна (ГРН)
//                 </h3>
//                 <div className="px-2">
//                   <input
//                     type="range"
//                     min="0"
//                     max="100000"
//                     step="1000"
//                     value={priceRange[1]}
//                     onChange={(e) =>
//                       setPriceRange([priceRange[0], parseInt(e.target.value)])
//                     }
//                     className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-aero-accent mb-4"
//                   />
//                   <div className="flex justify-between text-sm font-mono text-gray-400">
//                     <span>{priceRange[0]}</span>
//                     <span className="text-white">{priceRange[1]}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Size Filter */}
//               <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
//                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
//                   Розмір (Дюйми)
//                 </h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   {sizeOptions.map(([size, count]) => (
//                     <button
//                       key={size}
//                       onClick={() => toggleSize(size)}
//                       className={`
//                         text-xs py-2 px-3 border transition-all
//                         ${
//                           selectedSizes.includes(size)
//                             ? 'bg-aero-accent text-black border-aero-accent font-bold'
//                             : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
//                         }
//                       `}
//                     >
//                       {size}" <span className="opacity-50 ml-1">({count})</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Connection Filter */}
//               <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
//                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
//                   Тип зв'язку
//                 </h3>
//                 <div className="space-y-3">
//                   <FilterCheckbox
//                     label="Оптоволокно"
//                     checked={selectedConnections.includes('fiber')}
//                     onChange={() => toggleConnection('fiber')}
//                   />
//                   <FilterCheckbox
//                     label="Радіозв'язок"
//                     checked={selectedConnections.includes('radio')}
//                     onChange={() => toggleConnection('radio')}
//                   />
//                 </div>
//               </div>

//               {/* Application Filter */}
//               <div className="bg-gray-tactical/20 border border-white/5 p-5 tactical-clip">
//                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
//                   Застосування
//                 </h3>
//                 <div className="space-y-3">
//                   <FilterCheckbox
//                     label="Камікадзе"
//                     checked={selectedApplications.includes('kamikaze')}
//                     onChange={() => toggleApplication('kamikaze')}
//                   />
//                   <FilterCheckbox
//                     label="Бомбер"
//                     checked={selectedApplications.includes('bomber')}
//                     onChange={() => toggleApplication('bomber')}
//                   />
//                   <FilterCheckbox
//                     label="Ретранслятор"
//                     checked={selectedApplications.includes('relay')}
//                     onChange={() => toggleApplication('relay')}
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={resetFilters}
//                 className="w-full py-3 border border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors text-sm uppercase tracking-wider"
//               >
//                 Скинути фільтри
//               </button>
//             </div>
//           </aside>

//           {/* Main Grid */}
//           <div className="flex-1">
//             {filteredDrones.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filteredDrones.map((drone) => (
//                   <DroneCard key={drone.id} drone={drone} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-20 border border-white/5 bg-white/5 tactical-clip">
//                 <p className="text-xl text-gray-400 mb-4">
//                   За вашим запитом нічого не знайдено
//                 </p>
//                 <button
//                   onClick={resetFilters}
//                   className="text-aero-accent hover:underline"
//                 >
//                   Скинути всі фільтри
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
