-- Create profiles table for user roles
create table profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  role text not null check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create vehicles table
create table vehicles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  model text not null,
  year integer not null,
  price_per_day decimal not null,
  image_url text not null,
  available boolean default true,
  description text not null,
  features text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  total_price decimal not null,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample vehicles
insert into vehicles (name, model, year, price_per_day, image_url, description, features) values
(
  'Tesla',
  'Model S',
  2023,
  299.99,
  'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80',
  'Experience luxury and innovation with our Tesla Model S. This all-electric vehicle combines exceptional performance with cutting-edge technology.',
  ARRAY['Autopilot', 'Premium Sound System', 'All-Electric', 'Supercharging', 'Premium Interior']
),
(
  'Mercedes-Benz',
  'S-Class',
  2023,
  399.99,
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80',
  'The Mercedes-Benz S-Class represents the pinnacle of luxury motoring, offering unmatched comfort and sophistication.',
  ARRAY['Leather Interior', 'Massage Seats', 'Premium Sound', 'Advanced Safety', 'Digital Cockpit']
),
(
  'Porsche',
  '911 Carrera',
  2023,
  499.99,
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80',
  'The iconic Porsche 911 Carrera delivers an exhilarating driving experience with its perfect blend of performance and luxury.',
  ARRAY['Sport Chrono Package', 'Premium Sound', 'Sport Seats', 'Carbon Fiber Trim', 'Launch Control']
);

-- Create RLS policies
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table bookings enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Vehicles policies
create policy "Vehicles are viewable by everyone"
  on vehicles for select
  using (true);

create policy "Only admins can modify vehicles"
  on vehicles for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Bookings policies
create policy "Users can view own bookings"
  on bookings for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Users can create own bookings"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on bookings for update
  using (
    auth.uid() = user_id or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );