'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function PrefetchResources() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Префетч для кешування
    const prefetchAll = async () => {
      try {
        // Префетч всіх продуктів (буде в кеші React Query)
        queryClient.prefetchQuery({
          queryKey: ['products'],
          queryFn: async () => {
            const res = await fetch('/api/products?limit=50');
            return res.json();
          },
        });

        // Префетч дронів для каталогу
        queryClient.prefetchQuery({
          queryKey: ['drones'],
          queryFn: async () => {
            const res = await fetch('/api/uav?limit=50');
            return res.json();
          },
        });

        // Простий fetch для браузерного кешу (якщо потрібно)
        fetch('/api/products?limit=50');
        fetch('/api/uav?limit=50');
      } catch (error) {
        console.log('Prefetch error (not critical):', error);
      }
    };

    // Запускаємо тільки на клієнті
    prefetchAll();
  }, [queryClient]);

  return null; // Не рендерить нічого
}