// Типи для даних з БД
export type DroneFromDB = {
  id: string;
  type: string;
  model: string;
  price: number;
  productionStatus: string;
  size?: string | number;
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
  url?: string;
};

// Трансформований дрон з впорядкованими характеристиками
export type TransformedDrone = {
  id: string;
  name: string;
  type: string;
  price: number;
  productionStatus: string;
  application: string;
  connection: string;
  size?: string;
  description?: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
  url?: string;
  tagline?: string;
  
  // ВСІ характеристики в правильному порядку
  specs: Array<{
    key: string;
    label: string;
    value: string;
    icon: string;
    unit?: string;
    priority: number;
  }>;
};

// Конфігурація характеристик (порядок та пріоритети)
const SPECS_CONFIG = [
  // НАЙВАЖЛИВІШІ - завжди перші
 
  {
    key: 'specsRange',
    label: 'ТАКТИЧНИЙ РАДІУС',
    icon: '🎯',
    priority: 0,
    getValue: (drone: DroneFromDB) => drone.specsRange,
    unit: 'км'
  },
  {
    key: 'payload',
    label: 'КОРИСНЕ НАВАНТАЖЕННЯ',
    icon: '⚡',
    priority: 1,
    getValue: (drone: DroneFromDB) => drone.payload,
    unit: 'кг'
  },
  {
    key: 'connection',
    label: 'ТИП ЗВ\'ЯЗКУ',
    icon: getConnectionIcon,
    priority: 2,
    getValue: (drone: DroneFromDB) => drone.connection
  },
  {
    key: 'camera',
    label: 'КАМЕРА',
    icon: '📷',
    priority: 3,
    getValue: (drone: DroneFromDB) => drone.camera
  },
  
  // ДРУГОРЯДНІ - додаткові характеристики
  {
    key: 'flightTime',
    label: 'ЧАС ПОЛЬОТУ',
    icon: '⏱️',
    priority: 4,
    getValue: (drone: DroneFromDB) => drone.flightTime,
    unit: 'хв'
  },
  {
    key: 'maxSpeed',
    label: 'МАКС. ШВИДКІСТЬ',
    icon: '🚀',
    priority: 5,
    getValue: (drone: DroneFromDB) => drone.maxSpeed,
    unit: 'км/год'
  },
  {
    key: 'maxAltitude',
    label: 'МАКС. ВИСОТА',
    icon: '📈',
    priority: 6,
    getValue: (drone: DroneFromDB) => drone.maxAltitude,
    unit: 'м'
  },
  {
    key: 'operationalRange',
    label: 'ОПЕРАЦІЙНА ДАЛЬНІСТЬ',
    icon: '🛰️',
    priority: 7,
    getValue: (drone: DroneFromDB) => drone.operationalRange,
    unit: 'км'
  },
  {
    key: 'battery',
    label: 'АКУМУЛЯТОР',
    icon: '🔋',
    priority: 8,
    getValue: (drone: DroneFromDB) => drone.battery
  },
  {
    key: 'size',
    label: 'РОЗМІР',
    icon: '📏',
    priority: 9,
    getValue: (drone: DroneFromDB) => drone.size?.toString()
  },
  {
    key: 'application',
    label: 'ПРИЗНАЧЕННЯ',
    icon: '🎯',
    priority: 10,
    getValue: (drone: DroneFromDB) => drone.application
  }
];

// Функція для отримання іконки зв'язку
function getConnectionIcon(connection?: string): string {
  switch(connection) {
    case 'radio': return '📻';
    case 'fiber': return '🔗';
    case 'satellite': return '🛰️';
    default: return '📡';
  }
}

// Функція для отримання градієнту
export function getGradientByApplication(application: string): string {
  switch(application) {
    case 'kamikaze': return 'from-red-900/30 via-red-700/20 to-transparent';
    case 'recon': return 'from-blue-900/30 via-blue-700/20 to-transparent';
    case 'bomber': return 'from-orange-900/30 via-orange-700/20 to-transparent';
    case 'relay': return 'from-green-900/30 via-green-700/20 to-transparent';
    case 'antiaircraft': return 'from-purple-900/30 via-purple-700/20 to-transparent';
    case 'detector': return 'from-emerald-900/30 via-emerald-700/20 to-transparent';
    default: return 'from-aero/30 via-blue-600/20 to-transparent';
  }
}

// Функція для отримання тексту категорії
export function getApplicationText(application: string): string {
  switch(application) {
    case 'kamikaze': return 'КАМІКАДЗЕ';
    case 'recon': return 'РОЗВІДУВАЛЬНИЙ';
    case 'bomber': return 'БОМБАРДУВАЛЬНИК';
    case 'relay': return 'РЕТРАНСЛЯТОР';
    case 'antiaircraft': return 'ЗЕНІТНИЙ';
    case 'detector': return 'ДЕТЕКТОР';
    default: return application.toUpperCase();
  }
}

// Головна функція трансформації
export function transformDroneData(drone: DroneFromDB): TransformedDrone {
  // Генеруємо всі характеристики в правильному порядку
  const specs = SPECS_CONFIG.map(config => {
    const value = config.getValue(drone);
    const icon = typeof config.icon === 'function' 
      ? config.icon(config.getValue(drone) as string)
      : config.icon;
    
    return {
      key: config.key,
      label: config.label,
      value: value || '',
      icon,
      unit: config.unit,
      priority: config.priority
    };
  }).filter(spec => spec.value && spec.value !== '' && spec.value !== 'N/A'); // Фільтруємо пусті

  return {
    id: drone.id,
    name: drone.model || 'Без назви',
    type: drone.type || 'drone',
    price: drone.price || 0,
    productionStatus: drone.productionStatus || 'inProduction',
    application: drone.application || 'recon',
    connection: drone.connection || 'radio',
    size: drone.size?.toString(),
    description: drone.description,
    detailedInfo: drone.detailedInfo,
    image: drone.image,
    gallery: drone.gallery,
    url: drone.url,
    
    tagline: drone.description && drone.description.length > 80 
      ? drone.description.substring(0, 80) + '...' 
      : drone.description || 'Високоефективний FPV дрон',
    
    // Всі характеристики в правильному порядку
    specs
  };
}

// Функція для трансформації масиву дронів
export function transformDronesArray(drones: DroneFromDB[]): TransformedDrone[] {
  return drones.map(drone => transformDroneData(drone));
}

// Утиліта для отримання перших N характеристик (найважливіших)
export function getFirstNSpecs(drone: TransformedDrone, count: number = 4) {
  return drone.specs.slice(0, count);
}

// Функція для форматування значень
export function formatSpecValue(value: string, unit?: string): string {
  if (!value || value === '') return 'N/A';
  return unit ? `${value} ${unit}` : value;
}

// Допоміжна функція для grid класів
export function getGridColsClass(count: number): string {
  if (count <= 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2 md:grid-cols-4';
}
