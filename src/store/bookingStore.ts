import { create } from 'zustand';
import { Booking } from '../types';
import { supabase } from '../lib/supabase';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  createBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Promise<{ data: Booking | null; error: any }>;
  fetchUserBookings: (userId: string) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  loading: false,
  error: null,
  createBooking: async (booking) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select('*')
        .single();

      if (error) throw error;

      set((state) => ({
        bookings: [...state.bookings, data],
        error: null,
      }));

      return { data, error: null };
    } catch (error) {
      set({ error: 'Failed to create booking' });
      return { data: null, error };
    } finally {
      set({ loading: false });
    }
  },
  fetchUserBookings: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, vehicle:vehicles(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ bookings: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch bookings' });
    } finally {
      set({ loading: false });
    }
  },
  fetchAllBookings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, vehicle:vehicles(*), user:profiles(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ bookings: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch bookings' });
    } finally {
      set({ loading: false });
    }
  },
  updateBookingStatus: async (id, status) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to update booking status' });
    } finally {
      set({ loading: false });
    }
  },
}));