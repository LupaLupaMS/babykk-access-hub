import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  user: any;
  tierRequirements: any[];
  onUserUpdate: (user: any) => void;
}

export const Dashboard = ({ user, tierRequirements, onUserUpdate }: DashboardProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const nextTier = tierRequirements.find(tier => tier.tier === user.current_tier + 1);
  const currentTierInfo = tierRequirements.find(tier => tier.tier === user.current_tier);

  useEffect(() => {
    fetchInviteLink();
  }, [user.id]);

  const fetchInviteLink = async () => {
    try {
      const { data } = await supabase
        .from('invite_links')
        .select('invite_code')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setInviteLink(`https://www.babykk.shop/?invite=${data.invite_code}`);
      }
    } catch (error) {
      console.error('Error fetching invite link:', error);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Welcome, {user.username}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Badge variant="secondary">{user.total_invites}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{user.total_invites}</div>
            <p className="text-xs text-muted-foreground">
              People you've successfully invited
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Badge variant={user.current_tier > 0 ? "default" : "secondary"}>
              Tier {user.current_tier}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Tier {user.current_tier}</div>
            <p className="text-xs text-muted-foreground">
              {currentTierInfo ? currentTierInfo.content_description : "Free tier access"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Tier</CardTitle>
            {nextTier && (
              <Badge variant="outline">Tier {nextTier.tier}</Badge>
            )}
          </CardHeader>
          <CardContent>
            {nextTier ? (
              <>
                <div className="text-2xl font-bold text-primary">
                  {nextTier.required_invites - user.total_invites} more
                </div>
                <p className="text-xs text-muted-foreground">
                  invites needed for Tier {nextTier.tier}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">Max Tier</div>
                <p className="text-xs text-muted-foreground">
                  You've reached the highest tier!
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Badge variant="outline">
              {nextTier ? `${Math.round((user.total_invites / nextTier.required_invites) * 100)}%` : "100%"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                style={{
                  width: nextTier 
                    ? `${Math.min((user.total_invites / nextTier.required_invites) * 100, 100)}%`
                    : "100%"
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {nextTier ? `${user.total_invites}/${nextTier.required_invites} invites` : "Complete"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Your Invite Link</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share this link to earn invites and unlock higher tiers
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              value={inviteLink}
              readOnly
              className="bg-secondary/50 font-mono text-sm"
            />
            <Button 
              onClick={copyInviteLink}
              variant="outline"
              className="min-w-[100px]"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progress Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your progress through each tier level
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tierRequirements.map((tier) => (
              <div key={tier.tier} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.current_tier >= tier.tier 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {tier.tier}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Tier {tier.tier}</div>
                  <div className="text-sm text-muted-foreground">
                    {tier.content_description} - ${tier.price_usd} or {tier.required_invites} invites
                  </div>
                </div>
                <Badge variant={user.current_tier >= tier.tier ? "default" : "secondary"}>
                  {user.current_tier >= tier.tier ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};