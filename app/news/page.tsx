import React from 'react';
// import { NEWS_FEED } from '@/app/data/news';

export const revalidate = 3600;

type WarStatsResponse = {
  message: string;
  data: {
    date: string;
    day: number;
    resource: string;
    war_status: { code: number; alias: string };
    stats: Record<string, number>;
    increase: Record<string, number>;
  };
};

const STAT_LABELS: Record<string, string> = {
  personnel_units: 'Особовий склад',
  tanks: 'Танки',
  armoured_fighting_vehicles: 'ББМ',
  artillery_systems: 'Арт. системи',
  mlrs: 'РСЗВ',
  aa_warfare_systems: 'ППО',
  planes: 'Літаки',
  helicopters: 'Гелікоптери',
  vehicles_fuel_tanks: 'Автотехніка/цистерни',
  warships_cutters: 'Кораблі/катери',
  cruise_missiles: 'Крилаті ракети',
  uav_systems: 'БПЛА',
  special_military_equip: 'Спец. техніка',
  atgm_srbm_systems: 'Ракетні комплекси',
  submarines: 'Підводні човни',
};

export default async function NewsPage() {
  let data: WarStatsResponse['data'] | null = null;
  let error: string | null = null;

  try {
    const res = await fetch('https://russianwarship.rip/api/v2/statistics/latest', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    const json = (await res.json()) as WarStatsResponse;
    data = json?.data ?? null;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none fixed"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-stencil text-white mb-3">
            НОВИНИ
          </h1>
          <p className="text-gray-400">
            Втрати ворога до яких ми маємо пряму причетність.
          </p>
        </div>

        <section className="bg-gray-tactical/30 border border-white/10 tactical-clip p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Останні дані</p>
              {data?.date && (
                <time dateTime={data.date} className="text-white">
                  Дата: {data.date} (день {data.day})
                </time>
              )}
            </div>
            {data?.resource && (
              <a
                href={data.resource}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-aero-accent transition-colors"
              >
                Джерело
              </a>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              Не вдалося завантажити дані: {error}
            </p>
          )}

          {data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(STAT_LABELS).map(([key, label]) => {
                const value = data.stats?.[key];
                const inc = data.increase?.[key];
                if (value == null) return null;
                return (
                  <div
                    key={key}
                    className="bg-black/40 border border-white/10 p-4 tactical-clip"
                  >
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className="text-xl text-white font-mono">
                      {value.toLocaleString('uk-UA')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof inc === 'number' ? `+${inc}` : '+0'} за добу
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/*
        <div className="space-y-10">
          {NEWS_FEED.map((group) => (
            <section key={group.date} className="bg-gray-tactical/30 border border-white/10 tactical-clip p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <time
                    dateTime={group.date}
                    className="text-sm text-gray-400 uppercase tracking-wider"
                  >
                    {group.label}
                  </time>
                </div>
                <span className="text-xs text-gray-500">
                  {group.items.length} РЅРѕРІРёРЅРё
                </span>
              </div>

              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li
                    key={`${group.date}-${item.time}-${item.title}`}
                    className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
                  >
                    <article className="flex flex-col md:flex-row gap-3 md:gap-6">
                      <time className="text-sm text-gray-400 md:w-20 shrink-0">
                        {item.time}
                      </time>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-aero-accent transition-colors leading-snug"
                      >
                        {item.title}
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        */}
      </div>
    </div>
  );
}
