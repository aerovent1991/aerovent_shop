"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { ChevronLeft, ChevronRight, Crosshair } from 'lucide-react';
import { 
  getGradientByApplication, 
  getApplicationText,
  formatSpecValue,
  type TransformedDrone 
} from '@/app/lib/drone-utils';

type HeroSliderProps = {
  initialDrones: TransformedDrone[];
};

export function HeroSlider({ initialDrones }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [drones] = useState<TransformedDrone[]>(initialDrones);

  const nextSlide = () => {
    if (isAnimating || drones.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % drones.length);
  };

  const prevSlide = () => {
    if (isAnimating || drones.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + drones.length) % drones.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (drones.length > 0) {
      const interval = setInterval(nextSlide, 7000);
      return () => clearInterval(interval);
    }
  }, [drones]);

  if (drones.length === 0) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-black pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Немає доступних дронів</div>
      </section>
    );
  }

  const currentDrone = drones[currentIndex];
  const detailPath =
    currentDrone.type === 'drone'
      ? `/uav/${currentDrone.id}`
      : `/electronic_warfare_systems/${currentDrone.id}`;
  const keySpecs = currentDrone.specs.slice(0, 4);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black pt-20">
      <div className="absolute inset-0 bg-tactical-grid opacity-30"></div>
      
      <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-b ${getGradientByApplication(currentDrone.application)} pointer-events-none transition-all duration-700`}></div>

      <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Основний контент */}
        <div className="flex flex-col lg:flex-row items-center justify-between h-full pt-10 lg:pt-20">
          
          {/* Текстова частина */}
          <div className="w-full lg:w-2/5 z-10 mb-8 lg:mb-0">
            {/* Application Badge */}
            <div className="flex items-center mb-4">
              <div className={`w-8 h-[2px] ${currentDrone.application === 'kamikaze' ? 'bg-red-500' : currentDrone.application === 'recon' ? 'bg-blue-500' : 'bg-aero-accent'} mr-3`}></div>
              <span className="text-aero-accent font-mono text-sm md:text-base tracking-[0.2em]">
                {getApplicationText(currentDrone.application)}
              </span>
            </div>

            {/* Drone Name */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-stencil text-white mb-3 tracking-tight ${
              currentDrone.type === 'detector' ? 'lg:text-6xl' : ''
            }`}>
              {currentDrone.name}
            </h1>

            {/* Price */}
            <div className="mb-4 lg:mb-6">
              <span className="text-2xl md:text-3xl font-bold text-green-400">
                {currentDrone.price.toLocaleString()} грн
              </span>
            </div>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide mb-8 lg:mb-10 max-w-xl">
              {currentDrone.tagline}
            </p>

            {/* Характеристики на десктопі */}
            {currentDrone.type !== 'detector' && (
              <div className="hidden lg:block">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 md:p-5 tactical-clip max-w-lg">
                  {/* Для дронів - характеристики */}
                  {currentDrone.type === 'drone' && keySpecs.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {keySpecs.map((spec) => (
                        <div 
                          key={spec.key} 
                          className="flex flex-col p-3 bg-black/50 border border-white/10 rounded-lg min-h-[85px] hover:bg-black/60 transition-colors"
                        >
                          <div className="flex items-start mb-2">
                            <span className="text-aero-accent mr-2 text-lg flex-shrink-0 mt-0.5">
                              {spec.icon}
                            </span>
                            <span className="text-xs text-gray-300 uppercase tracking-wider leading-tight flex-1 font-medium line-clamp-2">
                              {spec.label}
                            </span>
                          </div>
                          <div className="mt-auto">
                            <span className="text-lg md:text-xl font-bold text-white font-mono">
                              {formatSpecValue(spec.value, spec.unit)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : 
                currentDrone.type === 'ews' && currentDrone.detailedInfo ? (
                  <div className="max-h-[160px] overflow-y-auto pr-2">
                    <div
                      className="text-gray-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentDrone.detailedInfo }}
                    />
                  </div>
                ) : 
                (currentDrone.type === 'ews' || currentDrone.type === 'detector') && currentDrone.description ? (
                  <div className="max-h-[160px] overflow-y-auto pr-2">
                    <div
                      className="text-gray-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentDrone.description }}
                    />
                  </div>
                  ) : (
                    <div className="text-center py-5">
                      <p className="text-gray-400">Ключові характеристики не вказані</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки на десктопі */}
            <div className="hidden lg:block mt-8">
              <a 
                href={detailPath}
                className="w-full max-w-[520px] bg-aero hover:bg-aero-light text-white font-bold py-[13px] px-10 tactical-clip uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-aero/20 flex items-center justify-center"
              >
                <Crosshair className="mr-2 h-5 w-5" />
                Детальніше
              </a>
            </div>
          </div>

          {/* Зображення дрона */}
          <div className="w-full lg:w-3/5 flex justify-center lg:justify-end relative z-0 mb-8 lg:mb-0">
            <div className="relative w-[280px] sm:w-[350px] md:w-[450px] lg:w-[600px] aspect-[4/3] border border-white/10 bg-white/5 backdrop-blur-sm tactical-clip">
              {currentDrone.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={currentDrone.image}
                    alt={currentDrone.name}
                    fill
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 450px, 600px"
                    className="object-cover object-center opacity-90"
                    priority
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-center p-8">
                  <div className="text-4xl mb-4">✈️</div>
                  <p>Зображення дрона</p>
                </div>
              )}

              {/* Crosshair Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-aero-accent/30"></div>
                <div className="h-full w-[1px] bg-aero-accent/30 absolute"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 border border-aero-accent/50 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Характеристики та кнопки на мобільних */}
          <div className="w-full lg:hidden mt-18">
            {currentDrone.type !== 'detector' && (
              <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 md:p-5 tactical-clip mb-6">
                {/* Для дронів - характеристики */}
                {currentDrone.type === 'drone' && keySpecs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {keySpecs.map((spec) => (
                      <div 
                        key={spec.key} 
                        className="flex flex-col p-3 bg-black/50 border border-white/10 rounded-lg min-h-[85px] hover:bg-black/60 transition-colors"
                      >
                        <div className="flex items-start mb-2">
                          <span className="text-aero-accent mr-2 text-lg flex-shrink-0 mt-0.5">
                            {spec.icon}
                          </span>
                          <span className="text-xs text-gray-300 uppercase tracking-wider leading-tight flex-1 font-medium line-clamp-2">
                            {spec.label}
                          </span>
                        </div>
                        <div className="mt-auto">
                          <span className="text-lg md:text-xl font-bold text-white font-mono">
                            {formatSpecValue(spec.value, spec.unit)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : 
                currentDrone.type === 'ews' && currentDrone.detailedInfo ? (
                <div className="max-h-[120px] overflow-y-auto">
                  <div
                    className="text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentDrone.detailedInfo }}
                  />
                </div>
              ) : 
              (currentDrone.type === 'ews' || currentDrone.type === 'detector') && currentDrone.description ? (
                <div className="max-h-[120px] overflow-y-auto">
                  <div
                    className="text-gray-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentDrone.description }}
                  />
                </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-gray-400">Ключові характеристики не вказані</p>
                  </div>
                )}
              </div>
            )}

            {/* Кнопки на мобільних з відступом */}
            <div className="mt-20">
              <a 
                href={detailPath}
                className="w-full bg-aero hover:bg-aero-light text-white font-bold py-[13px] px-6 tactical-clip uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-aero/20 flex items-center justify-center text-sm"
              >
                <Crosshair className="mr-2 h-4 w-4" />
                Детальніше
              </a>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-10 right-4 md:right-10 flex items-center space-x-6 z-20 mb-4">
          <div className="hidden sm:flex space-x-2">
            {drones.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-aero-accent' 
                    : 'w-4 bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Номер слайду */}
      <div className="absolute bottom-4 left-4 text-gray-500 font-mono text-sm mb-10">
        {currentIndex + 1} / {drones.length}
      </div>
    </section>
  );
}





// "use client";
// import React, { useEffect, useState } from 'react';
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, Crosshair, Zap } from 'lucide-react';
// import { 
//   transformDronesArray, 
//   getGradientByApplication, 
//   getApplicationText,
//   formatSpecValue,
//   getGridColsClass,
//   getFirstNSpecs,
//   type TransformedDrone 
// } from '@/app/lib/drone-utils';

// export function HeroSlider() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [drones, setDrones] = useState<TransformedDrone[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDrones();
//   }, []);

//   const fetchDrones = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/products?limit=8&type=drone');
//       const data = await response.json();
      
//       if (data.success && data.data) {
//         const transformedDrones = transformDronesArray(data.data);
//         setDrones(transformedDrones);
//       }
//     } catch (err) {
//       console.error('Помилка завантаження дронів:', err);
//       setDrones([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextSlide = () => {
//     if (isAnimating || drones.length === 0) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev + 1) % drones.length);
//   };

//   const prevSlide = () => {
//     if (isAnimating || drones.length === 0) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev - 1 + drones.length) % drones.length);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => setIsAnimating(false), 500);
//     return () => clearTimeout(timer);
//   }, [currentIndex]);

//   useEffect(() => {
//     if (drones.length > 0) {
//       const interval = setInterval(nextSlide, 7000);
//       return () => clearInterval(interval);
//     }
//   }, [drones]);

//   if (loading) {
//     return (
//       <section className="relative h-screen w-full overflow-hidden bg-black pt-20 flex items-center justify-center">
//         <div className="text-white text-xl">Завантаження дронів...</div>
//       </section>
//     );
//   }

//   if (drones.length === 0) {
//     return (
//       <section className="relative h-screen w-full overflow-hidden bg-black pt-20 flex items-center justify-center">
//         <div className="text-white text-xl">Немає доступних дронів</div>
//       </section>
//     );
//   }

//   const currentDrone = drones[currentIndex];
  
//   // Беремо перші 3 характеристики (можна змінити на 2, 4, etc.)
//   const keySpecs = getFirstNSpecs(currentDrone, 4);
//   const gridColsClass = getGridColsClass(keySpecs.length);

//   return (
//     <section className="relative h-screen w-full overflow-hidden bg-black pt-20">
//       <div className="absolute inset-0 bg-tactical-grid opacity-30"></div>
      
//       <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-b ${getGradientByApplication(currentDrone.application)} pointer-events-none transition-all duration-700`}></div>

//       <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
//         {/* Drone Image */}
//         <div className="absolute inset-0 flex items-center justify-center md:justify-end opacity-60 pointer-events-none">
//           <div className={`w-full md:w-2/3 h-2/3 bg-gradient-to-br ${getGradientByApplication(currentDrone.application)} rounded-3xl blur-3xl transform transition-all duration-700 ease-in-out scale-90 md:translate-x-20`}></div>
          
//           <div className="absolute right-0 md:right-20 w-[300px] h-[300px] md:w-[600px] md:h-[400px] border border-white/10 bg-white/5 backdrop-blur-sm tactical-clip flex items-center justify-center transition-all duration-500 shadow-2xl shadow-aero/20">
//             {currentDrone.image ? (
//               <div className="relative w-full h-full">
//                 <Image
//                   src={currentDrone.image}
//                   alt={currentDrone.name}
//                   fill
//                   sizes="(max-width: 768px) 300px, 600px"
//                   className="object-contain opacity-90"
//                   priority
//                   draggable={false}
//                 />
//               </div>
//             ) : (
//               <div className="text-gray-400 text-center p-8">
//                 <div className="text-4xl mb-4">✈️</div>
//                 <p>Зображення дрона</p>
//               </div>
//             )}

//             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//               <div className="w-full h-[1px] bg-aero-accent/30"></div>
//               <div className="h-full w-[1px] bg-aero-accent/30 absolute"></div>
//               <div className="w-20 h-20 border border-aero-accent/50 rounded-full"></div>
//             </div>
//           </div>
//         </div>

//         {/* Text Content */}
//         <div className="relative z-10 max-w-2xl">
//           {/* Application Badge */}
//           <div className="flex items-center mb-4">
//             <div className={`w-8 h-[2px] ${currentDrone.application === 'kamikaze' ? 'bg-red-500' : currentDrone.application === 'recon' ? 'bg-blue-500' : 'bg-aero-accent'} mr-3`}></div>
//             <span className="text-aero-accent font-mono text-sm md:text-base tracking-[0.2em]">
//               {getApplicationText(currentDrone.application)}
//             </span>
//           </div>

//           {/* Drone Name */}
//           <h1 className="text-5xl md:text-7xl font-stencil text-white mb-3 tracking-tight">
//             {currentDrone.name}
//           </h1>

//           {/* Price */}
//           <div className="mb-4">
//             <span className="text-2xl md:text-3xl font-bold text-green-400">
//               ${currentDrone.price.toLocaleString()}
//             </span>
//           </div>

//           {/* Tagline */}
//           <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide mb-6 max-w-2xl">
//             {currentDrone.tagline}
//           </p>

//          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 md:p-5 tactical-clip max-w-2xl">
//   {keySpecs.length > 0 ? (
//     <div className="grid grid-cols-2 gap-3 md:gap-4">
//       {keySpecs.map((spec) => (
//         <div 
//           key={spec.key} 
//           className="flex flex-col p-3 bg-black/50 border border-white/10 rounded-lg min-h-[85px] hover:bg-black/60 transition-colors group"
//         >
//           {/* Іконка та назва */}
//           <div className="flex items-start mb-2">
//             <span className="text-aero-accent mr-2 text-lg flex-shrink-0 mt-0.5">
//               {spec.icon}
//             </span>
//             <span className="text-xs text-gray-300 uppercase tracking-wider leading-tight flex-1 font-medium line-clamp-2">
//               {spec.label}
//             </span>
//           </div>
          
//           {/* Значення */}
//           <div className="mt-auto">
//             <span className="text-lg md:text-xl font-bold text-white font-mono">
//               {formatSpecValue(spec.value, spec.unit)}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   ) : (
//     <div className="text-center py-5">
//       <p className="text-gray-400">Ключові характеристики не вказані</p>
//     </div>
//   )}
// </div>

//           {/* Buttons */}
//           <div className="mt-8 flex space-x-4">
//             <a 
//               href={currentDrone.url || `/drones/${currentDrone.id}`}
//               className="bg-aero hover:bg-aero-light text-white font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-aero/20 flex items-center">
//               <Crosshair className="mr-2 h-5 w-5" />
//               Детальніше
//             </a>
//             <button className="bg-transparent border border-white/30 hover:border-aero-accent text-white hover:text-aero-accent font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all flex items-center">
//               <Zap className="mr-2 h-5 w-5" />
//               Замовити
//             </button>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="absolute bottom-10 right-4 md:right-10 flex items-center space-x-6 z-20">
//           <div className="flex space-x-2">
//             {drones.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentIndex(idx)}
//                 className={`h-1.5 transition-all duration-300 ${
//                   idx === currentIndex 
//                     ? 'w-8 bg-aero-accent' 
//                     : 'w-4 bg-gray-600 hover:bg-gray-400'
//                 }`}
//                 aria-label={`Go to slide ${idx + 1}`}
//               />
//             ))}
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={prevSlide}
//               className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50">
//               <ChevronLeft className="h-6 w-6" />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50">
//               <ChevronRight className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="absolute bottom-4 left-4 text-gray-500 font-mono text-sm">
//         {currentIndex + 1} / {drones.length}
//       </div>
//     </section>
//   );
// }




// "use client";
// import React, { use, useEffect, useState } from 'react';
// import Image from "next/image";
// // import fpv_img from '../../public/images/image_fpv.png';
// const fpv_img = 'https://res.cloudinary.com/dd-com/image/upload/v1769967452/%D0%B0%D0%BB%D1%8E%D0%BC%D1%96%D0%BD%D1%8C2_bdphsq.jpg';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Crosshair,
//   Battery,
//   Wifi,
//   Gauge } from
// 'lucide-react';
// type DroneModel = {
//   id: string;
//   name: string;
//   tagline: string;
//   specs: {
//     range: string;
//     flightTime: string;
//     speed?: string;
//     payload?: string;
//     height?: string;
//     camera?: string;
//   };
//   img?: string; /// img?:string; ---
//   imageGradient: string;
// };
// const drones: DroneModel[] = [
// {
//   id: '7m',
//   name: 'Камікадзе-7 дюймів',
//   tagline: 'НЕПОМІТНИЙ ТА СМЕРТЕЛЬНИЙ',
//   specs: {
//     range: '12 КМ',
//     flightTime: '12 хв',
//     camera: 'АНАЛОГОВА',
//     payload: '1.6 КГ'
//   },
//   img:fpv_img,
//   imageGradient: 'from-aero'
// },
// {
//     id: '8m',
//     name: 'Камікадзе – 8 дюймів',
//     tagline: 'ЗБАЛАНСОВАНА ДАЛЬНІСТЬ ТА ПОТУЖНІСТЬ',
//     specs: {
//       range: '15 КМ',
//       flightTime: '15 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '1.6 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-orange'
//   },
//  {
//     id: '10m',
//     name: 'Камікадзе – 10 дюймів',
//     tagline: 'ВИСОКА ДАЛЬНІСТЬ ТА СТАБІЛЬНІСТЬ',
//     specs: {
//       range: '20 КМ',
//       flightTime: '18 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '2.0 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-olive'
//   },
//   {
//     id: '12m',
//     name: 'Камікадзе – 12 дюймів',
//     tagline: 'ВАЖКИЙ УДАРНИЙ КЛАС',
//     specs: {
//       range: '25 КМ',
//       flightTime: '22 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '2.5 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-aero'
//   },
//   {
//     id: '13m',
//     name: 'Камікадзе – 13 дюймів',
//     tagline: 'МАКСИМАЛЬНЕ КОРИСНЕ НАВАНТАЖЕННЯ',
//     specs: {
//       range: '30 КМ',
//       flightTime: '25 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '3.2 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-orange'
//   },
//   {
//     id: '15m',
//     name: 'Камікадзе – 15 дюймів',
//     tagline: 'ДАЛЬНІЙ РАДІУС ТА ВИСОКА НАДІЙНІСТЬ',
//     specs: {
//       range: '35 КМ',
//       flightTime: '30 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '4.5 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-olive'
//   },
//   {
//     id: 'fiber-10',
//     name: 'Камікадзе – 10 дюймів (Оптоволоконний)',
//     tagline: 'НЕЗАЛЕЖНИЙ ВІД РЕБ',
//     specs: {
//       range: '10 КМ ',
//       flightTime: '15 хв',
//       camera: 'АНАЛОГОВА / ЦИФРОВА',
//       payload: '1.3 КГ'
//     },
//     img:fpv_img,
//     imageGradient: 'from-aero'
//   }];

// export function HeroSlider() {

  
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const nextSlide = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev + 1) % drones.length);
//   };
//   const prevSlide = () => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setCurrentIndex((prev) => (prev - 1 + drones.length) % drones.length);
//   };
//   useEffect(() => {
//     const timer = setTimeout(() => setIsAnimating(false), 500);
//     return () => clearTimeout(timer);
//   }, [currentIndex]);
//   useEffect(() => {
//     const interval = setInterval(nextSlide, 5000);
//     return () => clearInterval(interval);
//   }, []);
//   const currentDrone = drones[currentIndex];
//   return (
//     <section className="relative h-screen w-full overflow-hidden bg-black pt-20">
//       {/* Background Grid */}
//       <div className="absolute inset-0 bg-tactical-grid opacity-30"></div>

//       {/* Ambient Blue Glow */}
//       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-aero/10 to-transparent pointer-events-none"></div>

//       {/* Main Content Area */}
//       <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
//         {/* Drone Visual Placeholder */}
//         <div className="absolute inset-0 flex items-center justify-center md:justify-end opacity-60 pointer-events-none">
//           <div
//             className={`w-full md:w-2/3 h-2/3 bg-gradient-to-br ${currentDrone.imageGradient} rounded-3xl blur-3xl transform transition-all duration-700 ease-in-out scale-90 md:translate-x-20`}>
//           </div>
//           {/* Abstract Drone Shape using CSS borders/gradients as placeholder */}
//           <div className="absolute right-0 md:right-20 w-[300px] h-[300px] md:w-[600px] md:h-[400px] border border-white/10 bg-white/5 backdrop-blur-sm tactical-clip flex items-center justify-center transition-all duration-500 shadow-2xl shadow-aero/20">
            
//             {true && (
//           <Image
//             src={fpv_img}
//             alt={currentDrone.name}
//             className="mb-48 md:mb-0 max-w-full max-h-full object-contain opacity-90 "
//             draggable={false}
//             fill
            
//              />
//               )}

//             {/* Crosshair Overlay */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-full h-[1px] bg-aero-accent/30"></div>
//               <div className="h-full w-[1px] bg-aero-accent/30 absolute"></div>
//               <div className="w-20 h-20 border border-aero-accent/50 rounded-full"></div>
//             </div>
//           </div>
//         </div>

//         {/* Text Content */}
//         <div className="relative z-10 max-w-3xl">
//           <div className="overflow-hidden">
//             <h2 className="text-aero-accent font-mono text-sm md:text-base mb-2 tracking-[0.2em] flex items-center animate-fade-in">
//               <span className="w-8 h-[2px] bg-aero-accent mr-3"></span>
//               МОДЕЛЬ {currentDrone.id.toUpperCase()}
//             </h2>
//             <h1
//               key={`title-${currentIndex}`}
//               className="text-5xl md:text-8xl font-stencil text-white mb-4 tracking-tight animate-slide-up">

//               {currentDrone.name}
//             </h1>
//             <p
//               key={`tag-${currentIndex}`}
//               className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-8 animate-fade-in-delay">

//               {currentDrone.tagline}
//             </p>
//           </div>

//           {/* Specs Panel */}
//           <div
//             key={`specs-${currentIndex}`}
//             className=" bg-black/80 backdrop-blur-md border border-white/10 p-6 md:p-8 tactical-clip max-w-xl animate-fade-in-up ">

//             <div className="grid grid-cols-3 gap-6">
//               {Object.entries(currentDrone.specs).map(([key, value], idx) =>
//               <div
//                 key={key}
//                 className="flex flex-col border-l-2 border-aero/50 pl-4">

//                   <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//                     {key === 'range' ?
//                   'Дальність' :
//                   key === 'flightTime' ?
//                   'Час польоту' :
//                   key === 'speed' ?
//                   'Швидкість' :
//                   key === 'payload' ?
//                   'Корисне навантаження' :
//                   key === 'height' ?
//                   'Висота' :
//                   'Камера'}
//                   </span>
//                   <span className="text-lg md:text-xl font-bold text-white font-mono">
//                     {value}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className=" mt-8 flex space-x-4">
//             <button className="bg-aero hover:bg-aero-light text-white font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-aero/20">
//               Детальніше
//             </button>
//             <button className="bg-transparent border border-white/30 hover:border-aero-accent text-white hover:text-aero-accent font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all">
//               Замовити
//             </button>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className=" absolute bottom-10 right-4 md:right-10 flex items-center space-x-6 z-20">
//           <div className="flex space-x-2">
//             {drones.map((_, idx) =>
//             <button
//               key={idx}
//               onClick={() => setCurrentIndex(idx)}
//               className={`h-1.5 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-aero-accent' : 'w-4 bg-gray-600 hover:bg-gray-400'}`}
//               aria-label={`Go to slide ${idx + 1}`} />

//             )}
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={prevSlide}
//               className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50">

//               <ChevronLeft className="h-6 w-6" />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="p-2 border border-white/20 hover:border-aero-accent hover:text-aero-accent text-white transition-colors tactical-clip-sm bg-black/50">

//               <ChevronRight className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Decorative Corner Elements */}
//       <div className="absolute top-24 left-4 w-4 h-4 border-t-2 border-l-2 border-aero-accent/50"></div>
//       <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-aero-accent/50"></div>
//     </section>);

// }
