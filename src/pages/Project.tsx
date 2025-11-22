import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Heart, Sparkles } from "lucide-react";

interface Project {
  id: string;
  name: string;
  product_image_url: string;
  tagline: string | null;
  custom_prompt: string | null;
  created_at: string;
}

interface AdCreative {
  id: string;
  style_name: string;
  image_url: string;
  is_favorite: boolean;
}

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      const { data: creativesData, error: creativesError } = await supabase
        .from("ad_creatives")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (creativesError) throw creativesError;
      setCreatives(creativesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (creativeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("ad_creatives")
        .update({ is_favorite: !currentStatus })
        .eq("id", creativeId);

      if (error) throw error;

      setCreatives((prev) =>
        prev.map((c) =>
          c.id === creativeId ? { ...c, is_favorite: !currentStatus } : c
        )
      );
    } catch (error: any) {
      toast({
        title: "Error updating favorite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadCreative = async (imageUrl: string, styleName: string) => {
    try {
      toast({ title: "Downloading...", description: "Please wait" });
      
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project?.name || 'ad'}-${styleName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({ title: "Downloaded successfully!" });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Please try right-clicking the image and selecting 'Save image as'",
        variant: "destructive",
      });
    }
  };

  const downloadAllCreatives = async () => {
    toast({ 
      title: "Downloading all creatives...", 
      description: `Downloading ${creatives.length} images` 
    });

    for (let i = 0; i < creatives.length; i++) {
      const creative = creatives[i];
      setTimeout(() => {
        downloadCreative(creative.image_url, creative.style_name);
      }, i * 500); // Stagger downloads by 500ms
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <GlassButton variant="hero" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </GlassButton>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <GlassButton variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </GlassButton>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-background" />
              </div>
              <span className="text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                AdGen AI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Project Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground">{project.tagline}</p>
            {project.custom_prompt && (
              <p className="text-sm text-muted-foreground mt-2">
                Custom prompt: {project.custom_prompt}
              </p>
            )}
          </div>

          {/* Original Image */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Original Product Image</h2>
            <GlassCard className="overflow-hidden max-w-md">
              <img
                src={project.product_image_url}
                alt={project.name}
                className="w-full aspect-square object-cover"
              />
            </GlassCard>
          </div>

          {/* Generated Creatives */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Generated Ad Creatives ({creatives.length})
              </h2>
              {creatives.length > 0 && (
                <GlassButton
                  variant="hero"
                  onClick={downloadAllCreatives}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </GlassButton>
              )}
            </div>
            {creatives.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-muted-foreground">
                  No ad creatives generated yet. This may take a few moments.
                </p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatives.map((creative) => (
                  <GlassCard
                    key={creative.id}
                    className="overflow-hidden group"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={creative.image_url}
                        alt={creative.style_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="flex gap-2 w-full">
                          <GlassButton
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              toggleFavorite(creative.id, creative.is_favorite)
                            }
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                creative.is_favorite
                                  ? "fill-accent text-accent"
                                  : ""
                              }`}
                            />
                          </GlassButton>
                           <GlassButton
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              downloadCreative(
                                creative.image_url,
                                creative.style_name
                              )
                            }
                            title="Download to PC"
                          >
                            <Download className="w-5 h-5" />
                          </GlassButton>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold capitalize">
                        {creative.style_name}
                      </h3>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Project;
