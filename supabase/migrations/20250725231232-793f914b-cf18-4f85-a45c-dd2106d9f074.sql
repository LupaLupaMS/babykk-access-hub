-- Create users table for the BabyKK platform
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    current_tier INTEGER DEFAULT 0,
    total_invites INTEGER DEFAULT 0,
    ip_address INET,
    invited_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invite links table
CREATE TABLE public.invite_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    invite_code TEXT NOT NULL UNIQUE,
    uses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tier requirements table
CREATE TABLE public.tier_requirements (
    tier INTEGER PRIMARY KEY,
    required_invites INTEGER NOT NULL,
    price_usd INTEGER NOT NULL,
    content_description TEXT NOT NULL
);

-- Insert tier requirements
INSERT INTO public.tier_requirements (tier, required_invites, price_usd, content_description) VALUES
(1, 50, 50, '4,500+ Videos (7-14 Years)'),
(2, 100, 90, '20,000+ Videos (5-17 Years)'),
(3, 250, 120, '100,000+ Videos (5-14 Years)'),
(4, 350, 250, '190,000+ Videos (3-17 Years)'),
(5, 500, 350, '300,000+ Videos (1-17 Years)'),
(6, 600, 450, '780,000+ Videos (0-17 Years)');

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_requirements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- RLS Policies for invite_links
CREATE POLICY "Users can view their own invite links" 
ON public.invite_links 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own invite links" 
ON public.invite_links 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own invite links" 
ON public.invite_links 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- RLS Policies for tier_requirements (public read)
CREATE POLICY "Anyone can view tier requirements" 
ON public.tier_requirements 
FOR SELECT 
USING (true);

-- Function to update user tier based on invites
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
    -- Update tier based on total invites
    UPDATE public.users 
    SET current_tier = (
        SELECT COALESCE(MAX(tier), 0) 
        FROM public.tier_requirements 
        WHERE required_invites <= NEW.total_invites
    ),
    updated_at = now()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tier when invites change
CREATE TRIGGER update_tier_on_invite_change
    AFTER UPDATE OF total_invites ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_tier();

-- Function to handle new user registration and update inviter's count
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
    -- If user was invited by someone, increment their invite count
    IF NEW.invited_by IS NOT NULL THEN
        UPDATE public.users 
        SET total_invites = total_invites + 1,
            updated_at = now()
        WHERE id = NEW.invited_by;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle invite counting
CREATE TRIGGER handle_new_registration
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_registration();

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := substring(md5(random()::text), 1, 8);
        SELECT EXISTS(SELECT 1 FROM public.invite_links WHERE invite_code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to create invite link for user
CREATE OR REPLACE FUNCTION public.create_user_invite_link(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    invite_code TEXT;
    existing_link TEXT;
BEGIN
    -- Check if user already has an invite link
    SELECT il.invite_code INTO existing_link
    FROM public.invite_links il
    WHERE il.user_id = $1
    LIMIT 1;
    
    IF existing_link IS NOT NULL THEN
        RETURN existing_link;
    END IF;
    
    -- Generate new invite code
    invite_code := public.generate_invite_code();
    
    -- Insert new invite link
    INSERT INTO public.invite_links (user_id, invite_code)
    VALUES (user_id, invite_code);
    
    RETURN invite_code;
END;
$$ LANGUAGE plpgsql;

-- Create index for performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_invited_by ON public.users(invited_by);
CREATE INDEX idx_invite_links_code ON public.invite_links(invite_code);
CREATE INDEX idx_users_ip_address ON public.users(ip_address);