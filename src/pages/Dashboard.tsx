import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import BookingCard from '../components/BookingCard';
import { CalendarRange } from 'lucide-react';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  vehicle: {
    id: string;
    name: string;
    image_url: string;
    price_per_day: number;
  };
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            vehicle:vehicles(*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="flex items-center text-gray-600">
          <CalendarRange className="h-5 w-5 mr-2" />
          <span>Your rental history</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">When you rent a vehicle, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}