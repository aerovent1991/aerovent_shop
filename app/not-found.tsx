import Link from "next/link";
import { ArrowLeft, Crosshair } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-aero/20 via-blue-800/10 to-transparent pointer-events-none" />

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full tactical-clip border border-white/10 bg-black/75 p-8 backdrop-blur-md sm:p-10">
          <div className="mb-4 flex items-center gap-3 text-aero-accent">
            <Crosshair className="h-5 w-5" />
            <span className="font-mono text-xs tracking-[0.2em] sm:text-sm">SYSTEM RESPONSE</span>
          </div>

          <p className="mb-2 font-mono text-sm text-gray-400 sm:text-base">ERROR CODE</p>
          <h1 className="mb-4 text-6xl font-stencil leading-none text-white sm:text-7xl">404</h1>

          <p className="mb-2 text-xl font-semibold text-white sm:text-2xl">Сторінку не знайдено</p>
          <p className="mb-8 max-w-2xl text-sm text-gray-300 sm:text-base">
            Можливо, посилання застаріло або сторінку було переміщено. Поверніться на головну та продовжіть навігацію.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-aero px-6 py-3 font-bold uppercase tracking-wider text-white tactical-clip transition-all hover:scale-105 hover:bg-aero-light"
          >
            <ArrowLeft className="h-4 w-4" />
            На головну
          </Link>
        </div>
      </div>
    </section>
  );
}
