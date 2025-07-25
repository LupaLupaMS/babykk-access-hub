import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

export const FreePreview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Free Preview</h1>
        <Button 
          onClick={() => window.open('https://t.me/babykk001', '_blank')}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Get More on Telegram
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Sample Content</CardTitle>
          <p className="text-sm text-muted-foreground">
            Preview our premium content before purchasing or inviting friends
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index} className="border-border/30 hover:border-border/60 transition-colors">
                <CardContent className="p-4">
                  <div className="aspect-video bg-secondary/50 rounded-lg flex items-center justify-center mb-3">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">Preview Video {index}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sample content preview - upgrade for full access
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Want More Previews?</h3>
          <p className="text-muted-foreground mb-4">
            Join our Telegram channel for exclusive content and instant access to thousands of videos
          </p>
          <Button 
            onClick={() => window.open('https://t.me/babykk001', '_blank')}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Join Telegram Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};