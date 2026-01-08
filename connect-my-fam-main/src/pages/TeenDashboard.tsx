import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mood, analyzeMessage } from "@/lib/emotionAnalysis";
import { ArrowLeft, Send, Sparkles, Check, Heart } from "lucide-react";
import { toast } from "sonner";

interface MoodOption {
  id: Mood;
  emoji: string;
  label: string;
  gradient: string;
  selectedGradient: string;
}

const moodOptions: MoodOption[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', gradient: 'from-green-100 to-green-50 hover:from-green-200 hover:to-green-100', selectedGradient: 'from-green-500 to-green-400' },
  { id: 'sad', emoji: '😢', label: 'Sad', gradient: 'from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100', selectedGradient: 'from-blue-500 to-blue-400' },
  { id: 'stressed', emoji: '😰', label: 'Stressed', gradient: 'from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100', selectedGradient: 'from-orange-500 to-orange-400' },
  { id: 'angry', emoji: '😤', label: 'Angry', gradient: 'from-red-100 to-red-50 hover:from-red-200 hover:to-red-100', selectedGradient: 'from-red-500 to-red-400' },
  { id: 'anxious', emoji: '😟', label: 'Anxious', gradient: 'from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100', selectedGradient: 'from-purple-500 to-purple-400' },
  { id: 'tired', emoji: '😴', label: 'Tired', gradient: 'from-indigo-100 to-indigo-50 hover:from-indigo-200 hover:to-indigo-100', selectedGradient: 'from-indigo-500 to-indigo-400' },
];

export default function TeenDashboard() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    toast.success(`${moodOptions.find(m => m.id === mood)?.emoji} ${mood} selected!`);
  };

  const handleSubmit = () => {
    if (!selectedMood) {
      toast.error("Please select how you're feeling first");
      return;
    }

    const analyzedMood = analyzeMessage(message, selectedMood);
    
    const moodData = {
      mood: analyzedMood,
      message: message || undefined,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('teenMood', JSON.stringify(moodData));
    setSubmitted(true);
    toast.success("Your feelings have been shared 💙");
  };

  if (submitted) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center p-6">
        <div className="premium-card p-10 max-w-md text-center space-y-8 animate-scale-in">
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <Check className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-green-400 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Thank you for sharing 💙
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your parent will receive a gentle notification with helpful insights.
              Remember: It's okay to feel however you're feeling.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-6"
              onClick={() => {
                setSubmitted(false);
                setSelectedMood(null);
                setMessage("");
              }}
            >
              Share again
            </Button>
            <Button 
              size="lg" 
              className="rounded-xl px-6 bg-gradient-to-r from-primary to-primary/80"
              onClick={() => navigate("/parent")}
            >
              View as Parent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-12 h-12 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-card transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              How are you feeling?
            </h1>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary" />
              No judgment, just support
            </p>
          </div>
        </div>

        {/* Step 1: Mood Selection */}
        <div className="premium-card p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/70 text-accent-foreground flex items-center justify-center text-sm font-bold shadow-sm">1</span>
            <h2 className="font-display font-bold text-foreground text-lg">Tap your mood</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleMoodSelect(mood.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl 
                  transition-all duration-300 border-2 cursor-pointer overflow-hidden
                  ${selectedMood === mood.id 
                    ? `bg-gradient-to-br ${mood.selectedGradient} text-white border-transparent scale-105 shadow-xl` 
                    : `bg-gradient-to-br ${mood.gradient} border-transparent hover:scale-[1.02]`
                  }
                `}
              >
                <span className={`text-4xl transition-transform duration-300 ${selectedMood === mood.id ? 'scale-110' : ''}`}>
                  {mood.emoji}
                </span>
                <span className="text-xs font-semibold">{mood.label}</span>
                {selectedMood === mood.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Optional Message */}
        <div className="premium-card p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">2</span>
            <h2 className="font-display font-bold text-foreground text-lg">Add a note <span className="font-normal text-muted-foreground">(optional)</span></h2>
          </div>
          <Textarea
            placeholder="What happened? e.g., 'Teacher scolded me today...'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-muted/30 border-border/50 rounded-xl resize-none text-base focus:ring-2 focus:ring-accent/30 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className={`
            w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
            transition-all duration-400 relative overflow-hidden group
            ${selectedMood 
              ? "bg-gradient-to-r from-accent via-accent to-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          {selectedMood && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          <Send className={`w-5 h-5 transition-transform ${selectedMood ? 'group-hover:translate-x-1' : ''}`} />
          <span>{selectedMood ? "Share with Parent" : "👆 Select a mood first"}</span>
          {selectedMood && <ArrowLeft className="w-5 h-5 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>

        {/* Privacy note */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-full border border-border/50">
            <span>🔒</span>
            <p className="text-muted-foreground text-xs">
              Your exact words stay private — parents only see a gentle summary
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
