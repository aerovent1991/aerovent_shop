import { create } from 'zustand';

interface Drone {
  id: string;
  // ... поля дрона
}

interface DronesStore {
  drones: Drone[];
  isLoading: boolean;
  error: string | null;
  fetchDrones: () => Promise<void>;
  getDroneById: (id: string) => Drone | undefined;
  updateDrone: (id: string, data: Partial<Drone>) => void;
}

export const useDronesStore = create<DronesStore>((set, get) => ({
  drones: [],
  isLoading: false,
  error: null,
  
  fetchDrones: async () => {
    const { drones } = get();
    if (drones.length > 0) return; // Якщо вже завантажені
    
    set({ isLoading: true });
    try {
      const response = await fetch('/api/uav?limit=100');
      const data = await response.json();
      set({ drones: data.data, isLoading: false });
    } catch (error) {
      set({ error: 'Помилка завантаження', isLoading: false });
    }
  },
  
  getDroneById: (id) => {
    return get().drones.find(d => d.id === id);
  },
  
  updateDrone: (id, data) => {
    set(state => ({
      drones: state.drones.map(d => 
        d.id === id ? { ...d, ...data } : d
      )
    }));
  }
}));