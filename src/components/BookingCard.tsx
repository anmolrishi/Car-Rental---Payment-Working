import React from 'react';
import { format } from 'date-fns';
import { Car, Calendar, DollarSign } from 'lucide-react';

interface BookingCardProps {
  booking: {
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
  };
}

export default function BookingCard({ booking }: BookingCardProps) {
  if (!booking || !booking.vehicle) {
    return null;
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusColor = statusColors[booking.status as keyof typeof statusColors] || statusColors.completed;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={booking.vehicle.image_url}
          alt={booking.vehicle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <Car className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">{booking.vehicle.name}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <div>
              <div>{format(new Date(booking.start_date), 'MMM d, yyyy')}</div>
              <div>{format(new Date(booking.end_date), 'MMM d, yyyy')}</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="h-5 w-5 mr-2" />
            <span>Total: ${booking.total_price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}