import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Sparkles, Image as ImageIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  product_image_url: string;
  tagline: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-glass-border bg-gradient-glass backdrop-blur-glass">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              AdGen AI
            </span>
          </div>
          <GlassButton variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </GlassButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Projects</h1>
              <p className="text-muted-foreground">
                Create and manage your ad creative projects
              </p>
            </div>
            <GlassButton
              variant="hero"
              size="lg"
              onClick={() => navigate("/generate")}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </GlassButton>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="h-64 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first ad creative project
              </p>
              <GlassButton variant="hero" onClick={() => navigate("/generate")}>
                <Plus className="w-5 h-5 mr-2" />
                Create First Project
              </GlassButton>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <GlassCard
                  key={project.id}
                  hover
                  className="overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={project.product_image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{project.name}</h3>
                    {project.tagline && (
                      <p className="text-sm text-muted-foreground truncate">
                        {project.tagline}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
