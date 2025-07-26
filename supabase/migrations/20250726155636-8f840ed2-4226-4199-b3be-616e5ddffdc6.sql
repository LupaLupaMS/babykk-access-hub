-- Fix RLS policies for users table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create proper RLS policies for users table
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Also check if we need to allow anonymous users during registration
CREATE POLICY "Allow registration with invite code" 
ON users FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated OR if invite_code is provided
  auth.uid() = id OR invite_code IS NOT NULL
);