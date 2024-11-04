import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';
import { Calendar, DollarSign } from 'lucide-react';

interface Props {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={vehicle.image_url}
        alt={`${vehicle.name} ${vehicle.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {vehicle.name} {vehicle.model}
        </h3>
        <p className="text-sm text-gray-500">Year: {vehicle.year}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="ml-1 font-semibold">${vehicle.price_per_day}/day</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="ml-1">{vehicle.available ? 'Available' : 'Booked'}</span>
          </div>
        </div>
        
        <Link
          to={`/vehicle/${vehicle.id}`}
          className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}