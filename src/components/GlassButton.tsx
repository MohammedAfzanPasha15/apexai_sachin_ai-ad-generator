import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "hero" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Glass base styles
          "backdrop-blur-glass border",
          {
            // Default variant - frosted glass with neon glow
            "bg-glass border-glass-border hover:border-primary/50 hover:shadow-glow text-foreground": 
              variant === "default",
            // Hero variant - neon gradient
            "bg-gradient-neon text-background hover:shadow-glow hover:scale-105 border-transparent font-semibold": 
              variant === "hero",
            // Secondary variant - purple glass
            "bg-secondary/20 border-secondary/30 hover:border-secondary hover:shadow-[0_0_40px_hsl(280_70%_60%/0.3)] text-secondary-foreground": 
              variant === "secondary",
            // Outline variant
            "bg-transparent border-primary/50 hover:bg-primary/10 text-primary hover:shadow-glow": 
              variant === "outline",
            // Ghost variant
            "bg-transparent border-transparent hover:bg-glass text-foreground": 
              variant === "ghost",
          },
          {
            "h-10 px-6 py-2 text-sm": size === "default",
            "h-9 px-4 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
