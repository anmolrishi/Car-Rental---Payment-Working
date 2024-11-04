import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-2 text-gray-600">
          Your booking will be confirmed shortly. You will receive a confirmation email once processed.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}