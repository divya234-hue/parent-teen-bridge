import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InsightCard } from "@/components/InsightCard";
import { getTranslatedInsight, MoodData, moodConfig } from "@/lib/emotionAnalysis";
import { ArrowLeft, Bell, RefreshCw, Heart, Sparkles, Lightbulb } from "lucide-react";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [loading, setLoading] = useState(false);

  const checkForUpdates = () => {
    setLoading(true);
    setTimeout(() => {
      const stored = localStorage.getItem('teenMood');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMoodData({
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        });
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="page-container min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-12 h-12 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-card transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold gradient-text-primary">
                Parent Insights
              </h1>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" />
                Understanding your teen better
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={checkForUpdates}
            className={`rounded-xl w-11 h-11 ${loading ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {moodData ? (
          <div className="space-y-6">
            {/* Notification Banner */}
            <div className="premium-card p-5 flex items-center gap-5 border-l-4 border-primary animate-fade-in relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-7 h-7 text-primary" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
              </div>
              <div className="relative">
                <p className="font-bold text-foreground text-lg">
                  Your teen shared their feelings
                </p>
                <p className="text-muted-foreground">
                  {formatTime(moodData.timestamp)} · Feeling {moodConfig[moodData.mood].emoji} {moodConfig[moodData.mood].label}
                </p>
              </div>
            </div>

            {/* Insight Card */}
            <InsightCard
              insight={getTranslatedInsight(moodData.mood, moodData.message)}
              message={moodData.message}
            />

            {/* Encouragement */}
            <div className="premium-card p-8 text-center space-y-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                  Remember: Your presence matters more than perfect words.
                  Just showing up is already a big step. 💙
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-card p-14 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-muted/30" />
            <div className="relative">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center animate-pulse-soft mb-6">
                <Bell className="w-14 h-14 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                No updates yet
              </h3>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                When your teen shares how they're feeling, you'll see helpful insights here.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={checkForUpdates}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Check for updates
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-10 premium-card p-8 space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Daily Tip for Parents
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Instead of asking "How was school?", try asking "What made you smile today?" 
                or "Was there anything that felt unfair today?" — these open-ended questions 
                create space for real conversations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
