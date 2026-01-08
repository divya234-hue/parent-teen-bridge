import { useNavigate } from "react-router-dom";
import { RoleCard } from "@/components/RoleCard";
import { Heart, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container min-h-screen flex flex-col items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Logo & Title */}
      <div className="text-center mb-14 animate-fade-in relative z-10">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary rounded-[2rem] animate-pulse-soft opacity-50 blur-xl" />
          <div className="relative w-full h-full bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center shadow-xl floating-element">
            <Heart className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
          Parent–Teen <span className="gradient-text-primary">Bridge</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
          Building understanding, one feeling at a time
        </p>
      </div>

      {/* Role Selection */}
      <div className="flex flex-col sm:flex-row gap-8 mb-14 relative z-10">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <RoleCard
            title="I'm a Teen"
            description="Share how you're feeling in a safe, private way"
            icon="🧑‍🎓"
            variant="teen"
            onClick={() => navigate("/teen")}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <RoleCard
            title="I'm a Parent"
            description="Understand your teen with gentle, translated insights"
            icon="👨‍👩‍👧"
            variant="parent"
            onClick={() => navigate("/parent")}
          />
        </div>
      </div>

      {/* Tagline */}
      <div className="text-center animate-fade-in relative z-10" style={{ animationDelay: '0.4s' }}>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-card/60 backdrop-blur-sm rounded-full border border-border/50 shadow-sm">
          <span className="text-lg">🔒</span>
          <p className="text-muted-foreground text-sm font-medium">
            No spying. No lecturing. Just empathy.
          </p>
        </div>
      </div>

      {/* Features preview */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-slide-up relative z-10" style={{ animationDelay: '0.5s' }}>
        <FeatureItem
          emoji="😊"
          title="Easy Mood Sharing"
          description="Teens express feelings with simple taps"
          gradient="from-mood-happy/20 to-mood-happy/5"
        />
        <FeatureItem
          emoji="🔄"
          title="Translated Insights"
          description="Parents receive gentle, judgment-free summaries"
          gradient="from-accent/20 to-accent/5"
        />
        <FeatureItem
          emoji="💡"
          title="Actionable Tips"
          description="Real suggestions to bridge the gap"
          gradient="from-primary/20 to-primary/5"
        />
      </div>
    </div>
  );
};

function FeatureItem({ 
  emoji, 
  title, 
  description, 
  gradient 
}: { 
  emoji: string; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="premium-card p-6 text-center group cursor-default">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="font-display font-bold text-foreground mb-2 text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default Index;
