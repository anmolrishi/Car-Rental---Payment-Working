import React from 'react';
import { Calendar, DollarSign, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Booking } from '../types';
import { useBookingStore } from '../store/bookingStore';

interface Props {
  booking: Booking & {
    vehicle: {
      name: string;
      model: string;
      image_url: string;
    };
    user: {
      email: string;
    };
  };
}

export default function AdminBookingCard({ booking }: Props) {
  const { updateBookingStatus } = useBookingStore();

  const handleStatusUpdate = async (status: Booking['status']) => {
    try {
      await updateBookingStatus(booking.id, status);
      toast.success('Booking status updated successfully');
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.vehicle.name} {booking.vehicle.model}
            </h3>
            <div className="mt-2 flex items-center text-gray-700">
              <User className="h-5 w-5 text-blue-600" />
              <span className="ml-2">{booking.user.email}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[booking.status]
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="ml-2">
              {new Date(booking.start_date).toLocaleDateString()} -{' '}
              {new Date(booking.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="ml-2">Total: ${booking.total_price}</span>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate('confirmed')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}