export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  price_per_day: number;
  image_url: string;
  available: boolean;
  description: string;
  features: string[];
}

export interface Booking {
  id: string;
  user_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}