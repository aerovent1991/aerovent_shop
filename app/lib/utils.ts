type Maybe<T> = T | undefined;

interface DroneInput {
  id: string;
  type: string;
  model: string;
  price: number;
  productionStatus: string;
  application: string;

  size?: number;
  operationalRange?: string;
  payload?: string;
  connection?: string;
  camera?: string;
  battery?: string;
  flightTime?: string;
  maxSpeed?: string;
  maxAltitude?: string;

  specsRange?: string;
  description?: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
  url?: string;
}

interface Characteristics {
  size?: number;
  operationalRange?: string;
  payload?: string;
  connection?: string;
  camera?: string;
  battery?: string;
  flightTime?: string;
  maxSpeed?: string;
  maxAltitude?: string;
}

interface DroneOutput {
  id: string;
  type: string;
  model: string;
  price: number;
  productionStatus: string;
  application: string;

  characteristics: Characteristics;

  specsRange?: string;
  description?: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
  url?: string;
}

function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

 function transformDrone(drone: DroneInput): DroneOutput {
  const characteristics = removeUndefined({
    size: drone.size,
    operationalRange: drone.operationalRange,
    payload: drone.payload,
    connection: drone.connection,
    camera: drone.camera,
    battery: drone.battery,
    flightTime: drone.flightTime,
    maxSpeed: drone.maxSpeed,
    maxAltitude: drone.maxAltitude,
  });

  return {
    id: drone.id,
    type: drone.type,
    model: drone.model,
    price: drone.price,
    productionStatus: drone.productionStatus,
    application: drone.application,

    characteristics,

    specsRange: drone.specsRange,
    description: drone.description,
    detailedInfo: drone.detailedInfo,
    image: drone.image,
    gallery: drone.gallery,
    url: drone.url,
  };
}
export function transformDrones(drones: DroneInput[]): DroneOutput[] {
  return drones.map(transformDrone);
}