-- Seed data for demo/development
-- This will be populated after user creation
-- You can run this manually or create a seed script

-- Example equipment types (for reference, not a table)
-- Types: 'Tractor', 'Truck', 'Harvester', 'Mower', 'Chainsaw', 'ATV', 'Trailer', 'Other'

-- Note: This seed data should be inserted after a user is created
-- For now, this is a template you can use to populate your account

/*
-- Example: Insert equipment for a user (replace USER_ID_HERE with actual user ID)
INSERT INTO public.equipment (user_id, name, type, mileage, hours, purchase_date, notes)
VALUES
  ('USER_ID_HERE', 'John Deere 5075E', 'Tractor', 1250, 450, '2020-06-15', 'Main workhorse for field operations'),
  ('USER_ID_HERE', 'Ford F-250', 'Truck', 45000, NULL, '2019-03-20', 'Daily driver and hauling'),
  ('USER_ID_HERE', 'Stihl MS 271', 'Chainsaw', NULL, 120, '2021-05-10', 'Firewood operations'),
  ('USER_ID_HERE', 'Kubota BX2380', 'Tractor', 850, 320, '2021-08-05', 'Small tasks and mowing'),
  ('USER_ID_HERE', 'Honda Pioneer 1000', 'ATV', 3500, 280, '2022-02-14', 'Utility vehicle'),
  ('USER_ID_HERE', 'Woods BB72X', 'Mower', NULL, 180, '2020-07-01', 'Brush mowing attachment'),
  ('USER_ID_HERE', '16ft Utility Trailer', 'Trailer', NULL, NULL, '2019-11-10', 'Equipment transport'),
  ('USER_ID_HERE', 'Stihl FS 131', 'Chainsaw', NULL, 95, '2022-04-20', 'Brush cutting'),
  ('USER_ID_HERE', 'John Deere Gator', 'ATV', 2800, 220, '2021-09-15', 'Farm utility vehicle'),
  ('USER_ID_HERE', 'Chevy Silverado 2500', 'Truck', 52000, NULL, '2018-06-01', 'Heavy hauling truck');

-- Example: Insert maintenance schedules
INSERT INTO public.maintenance_schedules (equipment_id, type, interval_type, interval_value, last_service_date, last_service_mileage, last_service_hours)
SELECT 
  e.id,
  'Oil Change',
  'hours',
  50,
  '2024-01-15',
  NULL,
  400
FROM public.equipment e
WHERE e.name = 'John Deere 5075E';

INSERT INTO public.maintenance_schedules (equipment_id, type, interval_type, interval_value, last_service_date, last_service_mileage, last_service_hours)
SELECT 
  e.id,
  'Oil Change',
  'mileage',
  5000,
  '2024-01-10',
  44500,
  NULL
FROM public.equipment e
WHERE e.name = 'Ford F-250';

-- Example: Insert maintenance events
INSERT INTO public.maintenance_events (equipment_id, type, date, cost, mileage_at_service, hours_at_service, notes)
SELECT 
  e.id,
  'Oil Change',
  '2024-01-15',
  45.00,
  NULL,
  400,
  'Standard oil and filter change'
FROM public.equipment e
WHERE e.name = 'John Deere 5075E';

INSERT INTO public.maintenance_events (equipment_id, type, date, cost, mileage_at_service, hours_at_service, notes)
SELECT 
  e.id,
  'Tire Replacement',
  '2024-01-20',
  850.00,
  45000,
  NULL,
  'Replaced all 4 tires'
FROM public.equipment e
WHERE e.name = 'Ford F-250';
*/

