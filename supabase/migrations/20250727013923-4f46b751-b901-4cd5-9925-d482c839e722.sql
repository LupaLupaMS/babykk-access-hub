-- Fix RLS policies for user registration
-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow anonymous registration" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create new policies that allow proper registration and access
CREATE POLICY "Enable anonymous user registration" 
ON public.users 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);