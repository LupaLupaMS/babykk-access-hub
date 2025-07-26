
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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  console.log("Index component rendering...");

  useEffect(() => {
    console.log("Index useEffect running...");
    
    const initializeApp = async () => {
      try {
        // Check for invite code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const invite = urlParams.get('invite');
        if (invite) {
          console.log("Invite code found:", invite);
          setInviteCode(invite);
        }

        // Fetch tier requirements
        await fetchTierRequirements();
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const fetchTierRequirements = async () => {
    try {
      console.log("Fetching tier requirements...");
      const { data, error } = await supabase
        .from('tier_requirements')
        .select('*')
        .order('tier');

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Tier requirements fetched:", data);
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
    console.log("Auth success:", userData);
    setUser(userData);
  };

  const handleUserUpdate = (updatedUser: any) => {
    console.log("User updated:", updatedUser);
    setUser(updatedUser);
  };

  const renderContent = () => {
    console.log("Rendering content for view:", currentView);
    
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

  if (isLoading) {
    console.log("App is loading...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/95">
        <div className="text-center">
          <div className="animate-pulse text-xl font-semibold">Loading BabyKK...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("No user, showing auth form");
    return <AuthForm onAuthSuccess={handleAuthSuccess} inviteCode={inviteCode} />;
  }

  console.log("Rendering main app with user:", user);
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
