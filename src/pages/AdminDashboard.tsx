import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { useVehicleStore } from '../store/vehicleStore';
import AdminBookingCard from '../components/AdminBookingCard';
import { Booking } from '../types';

export default function AdminDashboard() {
  const { bookings, loading, fetchAllBookings } = useBookingStore();
  const [filter, setFilter] = useState<Booking['status']>('pending');

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const filteredBookings = bookings.filter(
    (booking) => filter === 'all' || booking.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Booking['status'])}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <AdminBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}