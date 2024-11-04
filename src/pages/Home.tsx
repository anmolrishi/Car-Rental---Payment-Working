import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Star, Shield, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';

const testimonials = [
  {
    text: "My JamRock experience was nothing short of incredible. The pristine car and impeccable service made my trip unforgettable. I'll be back for more.",
    author: "Aleea Thompson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
  },
  {
    text: "Outstanding service and premium vehicles. Made my business trip so much more comfortable and stylish.",
    author: "James Wilson",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
  }
];

export default function Home() {
  const { vehicles, fetchVehicles } = useVehicleStore();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-r from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl font-bold tracking-tight text-gray-900">
                  Your Journey,<br />
                  Your Car,<br />
                  Your Way
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Experience the ultimate freedom of choice with JamRock - tailor your adventure by
                  choosing from our premium fleet of vehicles.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" alt="User" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12.5K+ People</p>
                  <p className="text-gray-600">trust our services</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 right-12 bg-white rounded-xl shadow-lg p-4 z-10">
                <p className="font-semibold text-2xl">50+</p>
                <p className="text-gray-600">Car Types<br />Available</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80"
                alt="Luxury Car"
                className="rounded-2xl w-full object-cover"
              />
              <div className="absolute -bottom-6 right-12 flex space-x-2">
                {['Sedan', 'Sports', 'SUV', 'Coupe', 'Convertible'].map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 bg-white rounded-full text-sm shadow-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impressive Fleet</h2>
            <p className="text-gray-600">Choose from our selection of premium vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{vehicle.name} {vehicle.model}</h3>
                  <p className="text-gray-600 mb-4">Starting at</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold">${vehicle.price_per_day}/day</p>
                    <Link
                      to={`/vehicle/${vehicle.id}`}
                      className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-r from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose JamRock?</h2>
              <p className="text-gray-600 mb-8">
                Join our satisfied customers who trust us for their journeys.
                We serve with values that you can feel directly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Quality & Variety', 'Easy Booking', 'Affordable Rates', '24/7 Support'].map((feature) => (
                  <div key={feature} className="bg-white rounded-xl p-4 shadow-md">
                    <p className="font-semibold">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80"
                alt="Luxury Car"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-red-500 font-semibold mb-8">WHAT OUR CUSTOMERS SAY</h2>
          <div className="relative">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-4xl font-medium mb-8">{testimonials[currentTestimonial].text}</p>
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].author}
                  className="w-16 h-16 rounded-full"
                />
                <p className="text-xl text-gray-600">{testimonials[currentTestimonial].author}</p>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}