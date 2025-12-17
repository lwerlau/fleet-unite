-- Seed Demo Data for Testing
-- Run this AFTER creating your account and getting your user_id
-- 
-- To use this:
-- 1. Sign up in the app
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Copy your user ID (UUID)
-- 4. Replace 'YOUR_USER_ID_HERE' below with your actual user ID
-- 5. Run this SQL in Supabase SQL Editor

-- Example: Replace this with your actual user ID
-- INSERT INTO public.equipment (user_id, name, type, mileage, hours, purchase_date, notes)
-- VALUES
--   ('YOUR_USER_ID_HERE', 'Ford F-150', 'Truck', 120000, NULL, '2018-06-15', 'Main work truck for hauling and daily operations'),
--   ('YOUR_USER_ID_HERE', 'John Deere 5075E', 'Tractor', NULL, 1200, '2020-03-20', 'Primary tractor for field work and heavy lifting'),
--   ('YOUR_USER_ID_HERE', 'Bobcat E35', 'Excavator', NULL, 890, '2019-11-10', 'Used for excavation and earthmoving projects'),
--   ('YOUR_USER_ID_HERE', 'Kubota RTV-X1140', 'Utility Vehicle', 2500, NULL, '2021-05-14', 'Utility vehicle for farm operations and material transport');

-- Alternative: Use this function to insert demo data for the currently authenticated user
-- (Run this from the app context, not SQL Editor)

/*
-- For SQL Editor, use this pattern:
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get the first user (or replace with specific user ID)
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    -- Insert demo equipment
    INSERT INTO public.equipment (user_id, name, type, mileage, hours, purchase_date, notes)
    VALUES
        (v_user_id, 'Ford F-150', 'Truck', 120000, NULL, '2018-06-15', 'Main work truck for hauling and daily operations'),
        (v_user_id, 'John Deere 5075E', 'Tractor', NULL, 1200, '2020-03-20', 'Primary tractor for field work and heavy lifting'),
        (v_user_id, 'Bobcat E35', 'Excavator', NULL, 890, '2019-11-10', 'Used for excavation and earthmoving projects'),
        (v_user_id, 'Kubota RTV-X1140', 'Utility Vehicle', 2500, NULL, '2021-05-14', 'Utility vehicle for farm operations and material transport')
    ON CONFLICT DO NOTHING;
END $$;
*/

