import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ExternalLink, CheckCircle } from "lucide-react";

interface TierContentProps {
  tier: number;
  user: any;
  tierInfo: any;
}

export const TierContent = ({ tier, user, tierInfo }: TierContentProps) => {
  const isUnlocked = user.current_tier >= tier;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Tier {tier} Content</h1>
          <Badge variant={isUnlocked ? "default" : "secondary"}>
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>
        <Button 
          onClick={() => window.open('https://t.me/babykk001', '_blank')}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Buy on Telegram
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            {isUnlocked ? (
              <CheckCircle className="w-6 h-6 text-primary" />
            ) : (
              <Lock className="w-6 h-6 text-muted-foreground" />
            )}
            <span>Tier {tier}: {tierInfo?.content_description}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isUnlocked 
              ? "You have access to this tier content" 
              : `Unlock with ${tierInfo?.price_usd} USD or ${tierInfo?.required_invites} invites`
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content Amount:</span>
                  <span className="font-medium">{tierInfo?.content_description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${tierInfo?.price_usd} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Or Invite:</span>
                  <span className="font-medium">{tierInfo?.required_invites} friends</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Invites:</span>
                  <span className="font-medium">{user.total_invites}/{tierInfo?.required_invites}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Access Options</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.open('https://t.me/babykk001', '_blank')}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy Now - ${tierInfo?.price_usd}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  or
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Invite {tierInfo?.required_invites - user.total_invites} more friends to unlock
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((user.total_invites / tierInfo?.required_invites) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.total_invites}/{tierInfo?.required_invites} invites
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isUnlocked && (
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/30">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-medium">Content Locked</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                This tier contains exclusive premium content. Purchase directly or invite {tierInfo?.required_invites} friends 
                to unlock access. Your current invite count: {user.total_invites}
              </p>
            </div>
          )}

          {isUnlocked && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-primary">Access Granted</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Congratulations! You have unlocked Tier {tier} content. 
                Visit our Telegram channel to access your exclusive content.
              </p>
              <Button 
                onClick={() => window.open('https://t.me/babykk001', '_blank')}
                className="mt-3 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Access Content on Telegram
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};