import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant: 'teen' | 'parent';
  onClick: () => void;
}

export function RoleCard({ title, description, icon, variant, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "premium-card p-8 w-full max-w-xs flex flex-col items-center gap-5 transition-all duration-500 group relative overflow-hidden",
        "hover:scale-[1.02] active:scale-[0.98]",
        variant === 'teen' && "hover:shadow-glow-accent",
        variant === 'parent' && "hover:shadow-glow-primary"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        variant === 'teen' && "bg-gradient-to-br from-accent/10 via-transparent to-transparent",
        variant === 'parent' && "bg-gradient-to-br from-primary/10 via-transparent to-transparent"
      )} />
      
      <div className={cn(
        "relative w-24 h-24 rounded-[1.75rem] flex items-center justify-center text-5xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
        variant === 'teen' && "bg-gradient-to-br from-accent/30 to-accent/10",
        variant === 'parent' && "bg-gradient-to-br from-primary/30 to-primary/10"
      )}>
        {icon}
      </div>
      
      <div className="text-center space-y-2 relative">
        <h3 className={cn(
          "font-display text-2xl font-bold tracking-tight",
          variant === 'teen' && "gradient-text-accent",
          variant === 'parent' && "gradient-text-primary"
        )}>
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className={cn(
        "flex items-center gap-2 text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0",
        variant === 'teen' && "text-accent",
        variant === 'parent' && "text-primary"
      )}>
        <span>Get started</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
