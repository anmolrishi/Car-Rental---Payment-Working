import { create } from 'zustand';
import { Vehicle } from '../types';
import { supabase } from '../lib/supabase';

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  getVehicle: (id: string) => Promise<Vehicle | null>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,
  fetchVehicles: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ vehicles: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch vehicles' });
    } finally {
      set({ loading: false });
    }
  },
  getVehicle: async (id: string) => {
    const { vehicles } = get();
    let vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) return null;
      vehicle = data;
    }
    
    return vehicle;
  },
}));