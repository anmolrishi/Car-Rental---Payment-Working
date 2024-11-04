import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { differenceInHours, differenceInDays } from 'date-fns';
import { Car, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useVehicleStore } from '../store/vehicleStore';
import { useBookingStore } from '../store/bookingStore';
import { createPaymentLink } from '../lib/stripe';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getVehicle } = useVehicleStore();
  const { createBooking } = useBookingStore();
  const [vehicle, setVehicle] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rentType, setRentType] = useState<'hourly' | 'daily'>('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getVehicle(id).then(setVehicle);
    }
  }, [id, getVehicle]);

  const calculatePrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(`${startDate}T${startTime || '00:00'}`);
    const end = new Date(`${endDate}T${endTime || '00:00'}`);
    
    if (rentType === 'hourly') {
      const hours = differenceInHours(end, start);
      return hours * (vehicle.price_per_day / 24);
    } else {
      const days = differenceInDays(end, start) || 1;
      return days * vehicle.price_per_day;
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select dates');
      return;
    }

    setLoading(true);
    try {
      const start = new Date(`${startDate}T${startTime || '00:00'}`);
      const end = new Date(`${endDate}T${endTime || '00:00'}`);
      const totalPrice = calculatePrice();
      const hours = differenceInHours(end, start);
      const days = differenceInDays(end, start);

      // Create pending booking
      const bookingData = {
        user_id: user.id,
        vehicle_id: vehicle.id,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        total_price: totalPrice,
        status: 'pending'
      };

      const { data: booking, error } = await createBooking(bookingData);
      
      if (error) {
        throw new Error('Failed to create booking');
      }

      if (!booking) {
        throw new Error('No booking data received');
      }

      // Store booking details in localStorage for success page
      localStorage.setItem('pendingBooking', JSON.stringify({
        bookingId: booking.id,
        vehicleId: vehicle.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice,
        rentType,
        hours: rentType === 'hourly' ? hours : undefined,
        days: rentType === 'daily' ? days : undefined,
      }));

      // Create Stripe payment link
      const paymentUrl = await createPaymentLink({
        bookingId: booking.id,
        vehicleId: vehicle.id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice,
        rentType,
        hours: rentType === 'hourly' ? hours : undefined,
        days: rentType === 'daily' ? days : undefined,
      });

      // Redirect to payment
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Image and Details */}
        <div>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.name} {vehicle.model}
            </h1>
            <p className="mt-2 text-gray-600">{vehicle.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <Car className="h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700">{vehicle.year}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="ml-2 text-gray-700">
                  ${vehicle.price_per_day}/day
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Now</h2>
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rental Type
              </label>
              <select
                value={rentType}
                onChange={(e) => setRentType(e.target.value as 'hourly' | 'daily')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {rentType === 'hourly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {rentType === 'hourly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Price:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculatePrice().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}