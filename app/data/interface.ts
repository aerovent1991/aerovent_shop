export type DroneApplication = 
  | 'kamikaze'        // Камікадзе/ударний
  | 'bomber'          // Бомбардувальник
  | 'relay'           // Ретранслятор
  | 'recon'           // Розвідувальний
  | 'antiaircraft';   // Зенітний

export interface Drone {
  id: string;
  model: string;
  price: number;
  productionStatus: 'inProduction' | 'discontinued' | 'madeToOrder';
  size: number;
  application:| 'kamikaze'| 'bomber'| 'relay'| 'recon'| 'antiaircraft';
  connection: 'fiber' | 'radio' | 'satellite' | 'mixed';
  specs: {
    range: string;
    flightTime: string;
    maxSpeed: string;
    payload: string;
    camera: string;
    maxAltitude?: string;
    operationalRange?: string;
    battery?: string;
  };
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
}


export interface EWS {
  id: string;
  model: string;
  price: number;
  productionStatus: 'inProduction' | 'discontinued' | 'madeToOrder';
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
}

