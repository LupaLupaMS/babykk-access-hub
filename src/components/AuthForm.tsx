import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  onAuthSuccess: (user: any) => void;
  inviteCode?: string;
}

export const AuthForm = ({ onAuthSuccess, inviteCode }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const { toast } = useToast();

  // Generate simple math question only once
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setMathQuestion({ num1, num2, answer: num1 + num2 });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(mathAnswer) !== mathQuestion.answer) {
      toast({
        title: "Error",
        description: "Incorrect math answer. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIP = ipData.ip;

      // Check if IP already has an account
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('ip_address', userIP)
        .single();

      if (existingUser) {
        toast({
          title: "Registration Error",
          description: "An account already exists from this IP address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if username exists
      const { data: usernameCheck } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (usernameCheck) {
        toast({
          title: "Registration Error",
          description: "Username already exists. Please choose another.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Find inviter if invite code provided
      let inviterId = null;
      if (inviteCode) {
        const { data: inviteLink } = await supabase
          .from('invite_links')
          .select('user_id')
          .eq('invite_code', inviteCode)
          .single();

        if (inviteLink) {
          inviterId = inviteLink.user_id;
        }
      }

      // Hash password (in production, use proper bcrypt)
      const passwordHash = btoa(password); // Simple base64 for demo

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          password_hash: passwordHash,
          ip_address: userIP,
          invited_by: inviterId,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Registration Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create invite link for new user
        await supabase.rpc('create_user_invite_link', { user_id: newUser.id });
        
        toast({
          title: "Success!",
          description: "Account created successfully!",
        });
        onAuthSuccess(newUser);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <Card className="w-full max-w-md border-border/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            BabyKK
          </CardTitle>
          <p className="text-muted-foreground">Create your account to access premium content</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="bg-secondary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="math">Security Check: What is {mathQuestion.num1} + {mathQuestion.num2}?</Label>
              <Input
                id="math"
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Enter answer"
                required
                className="bg-secondary/50"
              />
            </div>

            {inviteCode && (
              <div className="text-sm text-muted-foreground text-center">
                Using invite code: <span className="text-primary font-mono">{inviteCode}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};