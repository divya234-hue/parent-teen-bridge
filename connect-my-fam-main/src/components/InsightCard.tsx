import { TranslatedInsight } from "@/lib/emotionAnalysis";
import { Check, Heart, MessageCircle } from "lucide-react";

interface InsightCardProps {
  insight: TranslatedInsight;
  message?: string;
}

export function InsightCard({ insight, message }: InsightCardProps) {
  return (
    <div className="premium-card p-8 space-y-7 animate-slide-up relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative flex items-start gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
          <span className="text-5xl">{insight.emoji}</span>
        </div>
        <div className="flex-1 pt-1">
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            {insight.title}
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {insight.explanation}
          </p>
        </div>
      </div>

      {message && (
        <div className="relative bg-gradient-to-r from-muted/60 to-muted/30 rounded-2xl p-5 border border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MessageCircle className="w-4 h-4" />
            <span>Optional message shared:</span>
          </div>
          <p className="text-foreground text-lg italic">"{message}"</p>
        </div>
      )}

      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-display font-bold text-foreground text-lg">How you can help:</h4>
        </div>
        <ul className="space-y-3 pl-1">
          {insight.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-4 text-muted-foreground group">
              <span className="w-6 h-6 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-secondary transition-colors">
                <Check className="w-4 h-4 text-secondary-foreground" />
              </span>
              <span className="text-lg leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
