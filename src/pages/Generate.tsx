import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlassButton } from "@/components/GlassButton";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Sparkles, Wand2, ArrowLeft, Loader2 } from "lucide-react";

const Generate = () => {
  const [projectName, setProjectName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [tagline, setTagline] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [productCategory, setProductCategory] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingTaglines, setGeneratingTaglines] = useState(false);
  const [suggestedTaglines, setSuggestedTaglines] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTaglines = async () => {
    if (!imagePreview) {
      toast({ title: "Please upload an image first", variant: "destructive" });
      return;
    }

    setGeneratingTaglines(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-taglines", {
        body: { imageBase64: imagePreview },
      });

      if (error) throw error;
      setSuggestedTaglines(data.taglines || []);
      setProductCategory(data.category || "");
      toast({ title: `Taglines generated! Product detected: ${data.category || 'Unknown'}` });
    } catch (error: any) {
      toast({
        title: "Error generating taglines",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingTaglines(false);
    }
  };

  const handleGenerate = async () => {
    console.log("Generate button clicked", { projectName, image: !!image, tagline, brandName });
    
    if (!projectName) {
      toast({ title: "Please enter a project name", variant: "destructive" });
      return;
    }
    if (!image) {
      toast({ title: "Please upload a product image", variant: "destructive" });
      return;
    }
    if (!tagline) {
      toast({ title: "Please enter or generate a tagline", variant: "destructive" });
      return;
    }
    if (!brandName) {
      toast({ title: "Please enter your brand name", variant: "destructive" });
      return;
    }

    setGenerating(true);
    console.log("Starting generation process...");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload image to storage
      console.log("Uploading image to storage...");
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      console.log("Image uploaded successfully");

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      // Create project
      console.log("Creating project in database...");
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          product_image_url: publicUrl,
          tagline,
          custom_prompt: customPrompt || null,
        })
        .select()
        .single();

      if (projectError) {
        console.error("Project creation error:", projectError);
        throw projectError;
      }
      console.log("Project created:", project.id);

      // Generate ad creatives
      console.log("Calling generate-ads function with:", {
        projectId: project.id,
        brandName,
        brandColor,
        ctaText,
        productCategory
      });

      toast({ 
        title: "Generating 6 ad variations...", 
        description: "This may take 1-2 minutes" 
      });

      const { data: generatedData, error: genError } = await supabase.functions.invoke(
        "generate-ads",
        {
          body: {
            projectId: project.id,
            imageUrl: publicUrl,
            tagline,
            customPrompt: customPrompt || null,
            brandName,
            brandColor,
            ctaText,
            productCategory: productCategory || 'general',
          },
        }
      );

      if (genError) {
        console.error("Generation error:", genError);
        throw genError;
      }

      console.log("Generation completed:", generatedData);
      toast({ title: `Successfully generated ${generatedData?.generated || 6} ad creatives!` });
      navigate(`/project/${project.id}`);
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Error generating ads",
        description: error.message || "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      console.log("Generation process ended");
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-neon bg-clip-text text-transparent">
              Create Your Ad Campaign
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload your product image and let AI generate 6 stunning ad variations with your brand
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Auto-detect product</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>6 unique styles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Brand customization</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      placeholder="e.g., Summer Campaign 2024"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-muted/50 border-glass-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name *</Label>
                    <Input
                      id="brandName"
                      placeholder="e.g., Your Brand"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="bg-muted/50 border-glass-border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandColor">Brand Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="brandColor"
                          type="color"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="w-16 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          className="bg-muted/50 border-glass-border"
                          placeholder="#6366f1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ctaText">CTA Button</Label>
                      <Input
                        id="ctaText"
                        placeholder="Shop Now"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="bg-muted/50 border-glass-border"
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['Shop Now', 'Buy Now', 'Limited Offer', 'Get Yours', 'Order Today', 'Claim Deal'].map((cta) => (
                          <button
                            key={cta}
                            onClick={() => setCtaText(cta)}
                            className="text-xs px-2 py-1 rounded-md bg-glass border border-glass-border hover:border-primary/50 transition-all"
                          >
                            {cta}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image *</Label>
                    <div className="relative">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="image">
                        <div className="cursor-pointer p-8 border-2 border-dashed border-glass-border rounded-xl bg-muted/30 hover:border-primary/50 transition-all text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {image ? image.name : "Click to upload image"}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="tagline">Tagline *</Label>
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={generateTaglines}
                        disabled={generatingTaglines || !image}
                      >
                        {generatingTaglines ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        AI Generate
                      </GlassButton>
                    </div>
                    <Input
                      id="tagline"
                      placeholder="e.g., Elevate Your Style"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="bg-muted/50 border-glass-border"
                    />
                    {suggestedTaglines.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-xs text-muted-foreground">Suggested taglines:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedTaglines.map((suggested, idx) => (
                            <button
                              key={idx}
                              onClick={() => setTagline(suggested)}
                              className="text-xs px-3 py-1 rounded-full bg-glass border border-glass-border hover:border-primary/50 transition-all"
                            >
                              {suggested}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {productCategory && (
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-xs text-primary font-medium mb-1">Detected Category:</p>
                      <p className="text-sm font-semibold capitalize">{productCategory}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="customPrompt">Additional Style Instructions (Optional)</Label>
                    <Textarea
                      id="customPrompt"
                      placeholder="e.g., Make it look premium with golden lighting and bold typography, add particle effects, use cinematic depth of field"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="bg-muted/50 border-glass-border min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Customize the visual style, lighting, effects, and composition
                    </p>
                  </div>

                  <GlassButton
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={generating || !projectName || !image || !tagline || !brandName}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating 6 Ad Variations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate 6 Ad Creatives
                      </>
                    )}
                  </GlassButton>
                  {(!projectName || !image || !tagline || !brandName) && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Fill all required fields (*) to generate ads
                    </p>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Preview */}
            <div>
              <GlassCard className="p-6 sticky top-6">
                <h3 className="font-semibold mb-4">Preview</h3>
                {imagePreview ? (
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-muted/30 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No image uploaded</p>
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  {brandName && (
                    <div className="p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Brand:</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-glass-border" 
                          style={{ backgroundColor: brandColor }}
                        />
                        <p className="font-semibold">{brandName}</p>
                      </div>
                    </div>
                  )}
                  {tagline && (
                    <div className="p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Tagline:</p>
                      <p className="font-semibold">{tagline}</p>
                    </div>
                  )}
                  {ctaText && (
                    <div className="p-3 rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">CTA:</p>
                      <p className="font-semibold">{ctaText}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
