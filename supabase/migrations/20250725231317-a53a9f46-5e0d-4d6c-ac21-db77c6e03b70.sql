-- Fix security definer functions with proper search path
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_user_invite_link(user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;