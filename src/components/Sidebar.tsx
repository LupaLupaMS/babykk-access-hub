import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Eye, 
  ShoppingCart, 
  Lock,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: any;
  tierRequirements: any[];
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ user, tierRequirements, currentView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "free-preview", label: "Free Preview", icon: Eye },
    { id: "buy", label: "Buy", icon: ShoppingCart, external: true, url: "https://t.me/babykk001" },
  ];

  const tierItems = tierRequirements.map(tier => ({
    id: `tier-${tier.tier}`,
    label: `Tier ${tier.tier}`,
    tier: tier.tier,
    content: tier.content_description,
    price: tier.price_usd,
    requiredInvites: tier.required_invites,
    unlocked: user.current_tier >= tier.tier
  }));

  const handleMenuClick = (item: any) => {
    if (item.external) {
      window.open(item.url, '_blank');
    } else {
      onViewChange(item.id);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full w-80 bg-card border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              BabyKK
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Premium Access Hub</p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-border/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User ID:</span>
                <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Tier:</span>
                <Badge variant={user.current_tier > 0 ? "default" : "secondary"}>
                  Tier {user.current_tier}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Invites:</span>
                <Badge variant="outline">{user.total_invites}</Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* Main Menu Items */}
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              ))}

              <Separator className="my-4" />

              {/* Tier Items */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">
                  Content Tiers
                </h3>
                {tierItems.map((tier) => (
                  <Button
                    key={tier.id}
                    variant={currentView === tier.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-auto p-3",
                      !tier.unlocked && "opacity-60"
                    )}
                    onClick={() => onViewChange(tier.id)}
                  >
                    <div className="flex items-start w-full">
                      <div className="mr-3 mt-0.5">
                        {tier.unlocked ? (
                          <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{tier.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${tier.price} or {tier.requiredInvites} invites
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};