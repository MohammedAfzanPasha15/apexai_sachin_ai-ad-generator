import { useNavigate } from "react-router-dom";
import { GlassButton } from "@/components/GlassButton";
import { Sparkles, Wand2, Zap, Image as ImageIcon } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-background" />
          </div>
          <span className="text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            AdGen AI
          </span>
        </div>
        <div className="flex gap-3">
          <GlassButton variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </GlassButton>
          <GlassButton variant="hero" onClick={() => navigate('/auth')}>
            Get Started
          </GlassButton>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-glass">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Ad Creative Generator</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Transform Your Product Images Into
            <span className="block bg-gradient-neon bg-clip-text text-transparent mt-2">
              Stunning Ad Creatives
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload any product image, enter a tagline, and let our multimodal AI generate unique, 
            high-quality ad variations in multiple styles. No design skills needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <GlassButton 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/auth')}
              className="group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Start Creating Now
            </GlassButton>
            <GlassButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              View Examples
            </GlassButton>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="group p-6 rounded-2xl border border-glass-border bg-gradient-glass backdrop-blur-glass hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-sm text-muted-foreground">
                Advanced multimodal AI analyzes your product and generates creative variations automatically
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-glass-border bg-gradient-glass backdrop-blur-glass hover:border-secondary/30 transition-all duration-300 hover:shadow-[0_0_40px_hsl(280_70%_60%/0.3)]">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Style Variations</h3>
              <p className="text-sm text-muted-foreground">
                Generate ads in modern, neon, minimal, luxury, and cinematic styles with one click
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-glass-border bg-gradient-glass backdrop-blur-glass hover:border-accent/30 transition-all duration-300 hover:shadow-[0_0_40px_hsl(330_80%_65%/0.3)]">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Auto-Taglines</h3>
              <p className="text-sm text-muted-foreground">
                AI detects your product type and suggests compelling taglines automatically
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
