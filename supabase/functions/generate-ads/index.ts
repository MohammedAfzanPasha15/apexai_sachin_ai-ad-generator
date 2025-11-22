import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { projectId, imageUrl, tagline, customPrompt, brandName, brandColor, ctaText, productCategory } = await req.json();

        if (!projectId || !imageUrl || !tagline || !brandName) {
            throw new Error("Missing required fields");
        }

        console.log(`Generating ads for project ${projectId}...`);

        // Removed LOVABLE API completely
        const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing environment variables");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const categoryThemes: Record<string, string> = {
            'electronics': 'sleek tech aesthetics with neon accents and metallic surfaces',
            'fashion': 'elegant studio lighting with soft shadows and premium textures',
            'food': 'warm, appetizing lighting with rich colors and inviting atmosphere',
            'beauty': 'soft pastel gradients with dreamy bokeh and aesthetic glow',
            'sports': 'high-energy composition with bold contrast and dynamic angles',
            'home': 'cozy, warm ambiance with natural lighting and comfortable feel',
            'default': 'professional commercial photography with balanced lighting'
        };

        const categoryTheme = categoryThemes[productCategory?.toLowerCase()] || categoryThemes['default'];

        const timestamp = Date.now();
        const randomSeed = Math.floor(Math.random() * 10000);
        const variations = [
            'with dramatic shadows and depth',
            'with soft diffused lighting',
            'with high contrast and vivid colors',
            'with subtle gradient overlays',
            'with elegant minimalist composition',
            'with dynamic angular composition'
        ];
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];

        const styles = [
            {
                name: 'modern-minimal',
                prompt: `Create a modern, minimalist ad... ${categoryTheme} ${randomVariation}`
            },
            {
                name: 'neon-tech',
                prompt: `Create a futuristic neon ad... ${categoryTheme} ${randomVariation}`
            },
            {
                name: 'luxury-gold',
                prompt: `Create a luxury gold accented ad... ${categoryTheme} ${randomVariation}`
            },
            {
                name: 'vibrant-colorful',
                prompt: `Create a colorful vibrant ad... ${categoryTheme} ${randomVariation}`
            },
            {
                name: 'cinematic-dark',
                prompt: `Create a cinematic dark ad... ${categoryTheme} ${randomVariation}`
            },
            {
                name: 'promo-limited',
                prompt: `Create a limited time promo ad... ${categoryTheme} ${randomVariation}`
            }
        ];

        // Convert original image to base64
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const baseImage = `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))}`;

        const generatedCreatives = [];

        // Loop through all style prompts
        for (const style of styles) {
            try {
                console.log(`Generating ${style.name}...`);

                const finalPrompt = customPrompt
                    ? `${style.prompt}\n\nExtra instructions: ${customPrompt}`
                    : style.prompt;

                // -------------------------------------------
                // ❗ PLACEHOLDER IMAGE GENERATION (No Lovable)
                // -------------------------------------------
                // Replace this section with:
                // - OpenAI Images
                // - Google Gemini Image API
                // - Stability AI
                // - Replicate
                // - Cloudflare Images
                //
                // For now: placeholder blank image
                // -------------------------------------------

                const generatedImageUrl =
                    "https://dummyimage.com/1024x1024/000/fff.png&text=Replace+with+Image+Generator";

                // -------------------------------------------

                // Convert placeholder to blob
                const generatedFetch = await fetch(generatedImageUrl);
                const genBlob = await generatedFetch.blob();

                const fileName = `${projectId}/${style.name}-${Date.now()}.png`;
                const { error: uploadError } = await supabase.storage
                    .from('ad-creatives')
                    .upload(fileName, genBlob, {
                        contentType: 'image/png',
                        upsert: false
                    });

                if (uploadError) {
                    console.error(`Upload error:`, uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('ad-creatives')
                    .getPublicUrl(fileName);

                await supabase
                    .from('ad_creatives')
                    .insert({
                        project_id: projectId,
                        style_name: style.name,
                        image_url: publicUrl,
                    });

                generatedCreatives.push({
                    style: style.name,
                    url: publicUrl,
                });

                console.log(`Generated ${style.name}`);

            } catch (err) {
                console.error(`Error generating ${style.name}`, err);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            generated: generatedCreatives.length,
            creatives: generatedCreatives
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
