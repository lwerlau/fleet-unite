-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
-- Note: Supabase automatically creates auth.users, we'll reference it
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  mileage NUMERIC(10, 2),
  hours NUMERIC(10, 2),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create maintenance_events table
CREATE TABLE IF NOT EXISTS public.maintenance_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  cost NUMERIC(10, 2),
  mileage_at_service NUMERIC(10, 2),
  hours_at_service NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create maintenance_schedules table
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  interval_type TEXT NOT NULL CHECK (interval_type IN ('mileage', 'hours', 'days')),
  interval_value NUMERIC(10, 2) NOT NULL,
  last_service_date DATE,
  last_service_mileage NUMERIC(10, 2),
  last_service_hours NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON public.equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_events_equipment_id ON public.maintenance_events(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_events_date ON public.maintenance_events(date);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_equipment_id ON public.maintenance_schedules(equipment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for equipment table
CREATE POLICY "Users can view own equipment"
  ON public.equipment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
  ON public.equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
  ON public.equipment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
  ON public.equipment FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for maintenance_events table
CREATE POLICY "Users can view own maintenance events"
  ON public.maintenance_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_events.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own maintenance events"
  ON public.maintenance_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_events.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own maintenance events"
  ON public.maintenance_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_events.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own maintenance events"
  ON public.maintenance_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_events.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

-- RLS Policies for maintenance_schedules table
CREATE POLICY "Users can view own maintenance schedules"
  ON public.maintenance_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_schedules.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own maintenance schedules"
  ON public.maintenance_schedules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_schedules.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own maintenance schedules"
  ON public.maintenance_schedules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_schedules.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own maintenance schedules"
  ON public.maintenance_schedules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment
      WHERE equipment.id = maintenance_schedules.equipment_id
      AND equipment.user_id = auth.uid()
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_events_updated_at BEFORE UPDATE ON public.maintenance_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON public.maintenance_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


