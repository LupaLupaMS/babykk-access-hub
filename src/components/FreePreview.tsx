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
            {["IMG_3122.MOV", "IMG_3123.MOV", "IMG_3124.MOV", "IMG_3125.MOV", "IMG_3126.MOV", "IMG_3127.MOV"].map((videoName, index) => (
              <Card key={index} className="border-border/30 hover:border-border/60 transition-colors">
                <CardContent className="p-4">
                  <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden mb-3">
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                      src={`https://jpooiunzmnwywnqnfisy.supabase.co/storage/v1/object/public/videos/${videoName}`}
                    >
                      Seu navegador não suporta vídeos.
                    </video>
                  </div>
                  <h3 className="font-medium mb-2">Preview Video {index + 1}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conteúdo premium - faça upgrade para acesso completo
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open('https://t.me/babykk001', '_blank')}
                  >
                    Ver Mais no Telegram
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