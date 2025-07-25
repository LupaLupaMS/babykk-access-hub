import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { FreePreview } from "@/components/FreePreview";
import { TierContent } from "@/components/TierContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState(null);
  const [tierRequirements, setTierRequirements] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check for invite code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('invite');
    if (invite) {
      setInviteCode(invite);
    }

    // Fetch tier requirements
    fetchTierRequirements();
  }, []);

  const fetchTierRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('tier_requirements')
        .select('*')
        .order('tier');

      if (error) throw error;
      setTierRequirements(data || []);
    } catch (error) {
      console.error('Error fetching tier requirements:', error);
      toast({
        title: "Error",
        description: "Failed to load tier information",
        variant: "destructive",
      });
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard 
            user={user} 
            tierRequirements={tierRequirements}
            onUserUpdate={handleUserUpdate}
          />
        );
      case "free-preview":
        return <FreePreview />;
      default:
        if (currentView.startsWith("tier-")) {
          const tierNumber = parseInt(currentView.split("-")[1]);
          const tierInfo = tierRequirements.find(t => t.tier === tierNumber);
          return (
            <TierContent 
              tier={tierNumber} 
              user={user} 
              tierInfo={tierInfo}
            />
          );
        }
        return (
          <Dashboard 
            user={user} 
            tierRequirements={tierRequirements}
            onUserUpdate={handleUserUpdate}
          />
        );
    }
  };

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} inviteCode={inviteCode} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <div className="flex">
        <Sidebar 
          user={user}
          tierRequirements={tierRequirements}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <main className="flex-1 lg:ml-80 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
