-- Disable RLS temporarily to allow registration
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable anonymous user registration" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Create a simple policy that allows all operations for registration
CREATE POLICY "Allow registration and access" 
ON public.users 
FOR ALL 
USING (true) 
WITH CHECK (true);