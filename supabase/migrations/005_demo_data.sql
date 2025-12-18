-- Demo Data Script for Fleet Unite
-- Run this in Supabase SQL Editor after creating your account
-- 
-- Instructions:
-- 1. Sign up in the app and log in
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Copy your user ID (UUID)
-- 4. Replace 'YOUR_USER_ID_HERE' below with your actual user ID
-- 5. Run this SQL in Supabase SQL Editor

-- ============================================
-- DEMO DATA FOR FLEET UNITE
-- ============================================

-- Replace this with your actual user ID
-- DO $$
-- DECLARE
--     v_user_id UUID;
-- BEGIN
--     -- Get your user ID (replace with your actual UUID)
--     v_user_id := 'YOUR_USER_ID_HERE';
--     
--     -- Insert Demo Equipment
--     INSERT INTO public.equipment (user_id, name, type, mileage, hours, purchase_date, notes)
--     VALUES
--         -- Trucks/Vehicles
--         (v_user_id, 'Ford F-150', 'Truck', 120000, NULL, '2018-06-15', 'Main work truck for hauling and daily operations. Reliable and well-maintained.'),
--         (v_user_id, 'Chevy Silverado 2500', 'Truck', 52000, NULL, '2018-06-01', 'Heavy hauling truck. Used for equipment transport and large loads.'),
--         
--         -- Tractors/Farm Equipment
--         (v_user_id, 'John Deere 5075E', 'Tractor', NULL, 1200, '2020-03-20', 'Primary tractor for field work and heavy lifting. Main workhorse.'),
--         (v_user_id, 'Kubota BX2380', 'Tractor', 850, 320, '2021-08-05', 'Compact tractor for small tasks and mowing. Very versatile.'),
--         
--         -- Heavy Equipment
--         (v_user_id, 'Bobcat E35', 'Excavator', NULL, 890, '2019-11-10', 'Used for excavation and earthmoving projects. Excellent condition.'),
--         
--         -- Utility Vehicles
--         (v_user_id, 'Honda Pioneer 1000', 'Utility Vehicle', 3500, 280, '2022-02-14', 'Utility vehicle for farm operations. Great for rough terrain.'),
--         (v_user_id, 'John Deere Gator', 'Utility Vehicle', 2800, 220, '2021-09-15', 'Farm utility vehicle. Used daily for various tasks.'),
--         
--         -- Small Equipment
--         (v_user_id, 'Stihl MS 271', 'Chainsaw', NULL, 120, '2021-05-10', 'Firewood operations chainsaw. Well maintained.'),
--         (v_user_id, 'Woods BB72X', 'Mower', NULL, 180, '2020-07-01', 'Brush mowing attachment. Used seasonally.'),
--         
--         -- Trailer
--         (v_user_id, '16ft Utility Trailer', 'Trailer', NULL, NULL, '2019-11-10', 'Equipment transport trailer. Heavy duty.')
--     ON CONFLICT DO NOTHING;
--     
--     -- Get equipment IDs for maintenance data
--     -- Note: This assumes the equipment was just inserted above
--     -- If equipment already exists, you'll need to manually get the IDs
--     
-- END $$;

-- Alternative: Manual Insert (Easier)
-- Step 1: Get your user ID from Authentication → Users
-- Step 2: Replace YOUR_USER_ID below
-- Step 3: Run this SQL

-- INSERT INTO public.equipment (user_id, name, type, mileage, hours, purchase_date, notes)
-- VALUES
--     ('YOUR_USER_ID', 'Ford F-150', 'Truck', 120000, NULL, '2018-06-15', 'Main work truck'),
--     ('YOUR_USER_ID', 'John Deere 5075E', 'Tractor', NULL, 1200, '2020-03-20', 'Primary tractor'),
--     ('YOUR_USER_ID', 'Bobcat E35', 'Excavator', NULL, 890, '2019-11-10', 'Excavation work'),
--     ('YOUR_USER_ID', 'Honda Pioneer 1000', 'Utility Vehicle', 3500, 280, '2022-02-14', 'Farm utility vehicle');

-- Then get the equipment IDs and insert maintenance:

-- INSERT INTO public.maintenance_events (equipment_id, maintenance_type, date, cost, mileage_at_service, hours_at_service, notes)
-- VALUES
--     ('EQUIPMENT_ID_1', 'Oil Change', CURRENT_DATE - INTERVAL '30 days', 75.00, 115000, NULL, 'Standard oil and filter change'),
--     ('EQUIPMENT_ID_1', 'Tire Rotation', CURRENT_DATE - INTERVAL '60 days', 60.00, 112000, NULL, 'Rotated all four tires'),
--     ('EQUIPMENT_ID_1', 'Brake Service', CURRENT_DATE - INTERVAL '90 days', 320.00, 110000, NULL, 'Replaced brake pads and rotors');


