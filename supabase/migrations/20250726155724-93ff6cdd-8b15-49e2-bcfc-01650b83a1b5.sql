-- Fix RLS policies for users table - correct version
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Allow registration with invite code" ON users;

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

-- Enable anonymous sign-ups by allowing unauthenticated inserts
-- This is needed for the registration process to work
CREATE POLICY "Allow anonymous registration"
ON users FOR INSERT
WITH CHECK (true);