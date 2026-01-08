export type Mood = 'sad' | 'angry' | 'stressed' | 'happy' | 'anxious' | 'tired';

export interface MoodData {
  mood: Mood;
  message?: string;
  timestamp: Date;
}

export interface TranslatedInsight {
  title: string;
  explanation: string;
  tips: string[];
  emoji: string;
}

const keywordMap: Record<string, Mood> = {
  // Stress keywords
  'exam': 'stressed',
  'test': 'stressed',
  'pressure': 'stressed',
  'deadline': 'stressed',
  'fail': 'stressed',
  'marks': 'stressed',
  'result': 'stressed',
  'homework': 'stressed',
  'study': 'stressed',
  'school': 'stressed',
  
  // Sad keywords
  'alone': 'sad',
  'lonely': 'sad',
  'nobody': 'sad',
  'ignore': 'sad',
  'miss': 'sad',
  'cry': 'sad',
  'hurt': 'sad',
  'sad': 'sad',
  'left out': 'sad',
  
  // Angry keywords
  'unfair': 'angry',
  'hate': 'angry',
  'annoyed': 'angry',
  'frustrat': 'angry',
  'mad': 'angry',
  'fight': 'angry',
  'yell': 'angry',
  'angry': 'angry',
  'angery': 'angry',
  'scold': 'angry',
  'shout': 'angry',
  
  // Anxious keywords
  'worried': 'anxious',
  'scared': 'anxious',
  'nervous': 'anxious',
  'panic': 'anxious',
  'fear': 'anxious',
  'anxiety': 'anxious',
  'cant sleep': 'anxious',
  
  // Tired keywords
  'exhausted': 'tired',
  'tired': 'tired',
  'drained': 'tired',
  'no energy': 'tired',
  'sleepy': 'tired',
  
  // Happy keywords
  'good': 'happy',
  'great': 'happy',
  'happy': 'happy',
  'excited': 'happy',
  'love': 'happy',
  'fun': 'happy',
  'awesome': 'happy',
};

export function analyzeMessage(message: string, selectedMood: Mood): Mood {
  if (!message) return selectedMood;
  
  const lowerMessage = message.toLowerCase();
  
  for (const [keyword, mood] of Object.entries(keywordMap)) {
    if (lowerMessage.includes(keyword)) {
      return mood;
    }
  }
  
  return selectedMood;
}

export function getTranslatedInsight(mood: Mood, message?: string): TranslatedInsight {
  const insights: Record<Mood, TranslatedInsight> = {
    sad: {
      title: "Your child needs emotional support",
      explanation: "They might be feeling left out or misunderstood. This isn't about being weak — it's a call for connection and understanding from you.",
      tips: [
        "Sit with them without asking too many questions",
        "Avoid comparisons with others",
        "Simply say: 'I'm here for you, no matter what'",
        "Offer a warm hug or comforting gesture"
      ],
      emoji: "💙"
    },
    angry: {
      title: "Your child is frustrated, not disrespectful",
      explanation: "Anger often masks deeper feelings of not being heard. They're not trying to hurt you — they're struggling to express something important.",
      tips: [
        "Don't react with anger back — stay calm",
        "Listen first, advise later",
        "Ask: 'What happened that made you feel this way?'",
        "Give them space if they need it"
      ],
      emoji: "🧡"
    },
    stressed: {
      title: "Your child is feeling academic pressure",
      explanation: "This isn't about laziness or lack of effort. They're carrying a heavy mental load and need encouragement, not more expectations.",
      tips: [
        "Praise effort, not just results",
        "Help them break tasks into smaller steps",
        "Reduce extra pressure from activities",
        "Remind them: 'Your worth isn't your grades'"
      ],
      emoji: "💛"
    },
    happy: {
      title: "Your child is feeling positive today! 🎉",
      explanation: "This is wonderful! They're in a good mental space. Use this opportunity to strengthen your bond.",
      tips: [
        "Share in their joy — ask about their day",
        "Plan something fun together",
        "Express how happy you are to see them happy",
        "This is a great time for open conversations"
      ],
      emoji: "💚"
    },
    anxious: {
      title: "Your child is experiencing worry or fear",
      explanation: "Anxiety can feel overwhelming for teens. They need reassurance that they're safe and capable of handling challenges.",
      tips: [
        "Help them breathe and stay present",
        "Don't dismiss their fears as 'nothing'",
        "Share a time you felt anxious and overcame it",
        "Consider if they need professional support"
      ],
      emoji: "💜"
    },
    tired: {
      title: "Your child is mentally or physically exhausted",
      explanation: "Burnout is real for teenagers too. They might be overwhelmed by school, social life, and expectations.",
      tips: [
        "Let them rest without guilt",
        "Check if their schedule is too packed",
        "Ensure they're getting enough sleep",
        "Lighten responsibilities temporarily"
      ],
      emoji: "🩵"
    }
  };
  
  return insights[mood];
}

export const moodConfig: Record<Mood, { label: string; emoji: string; color: string }> = {
  sad: { label: 'Sad', emoji: '😢', color: 'bg-mood-sad' },
  angry: { label: 'Angry', emoji: '😤', color: 'bg-mood-angry' },
  stressed: { label: 'Stressed', emoji: '😰', color: 'bg-mood-stressed' },
  happy: { label: 'Happy', emoji: '😊', color: 'bg-mood-happy' },
  anxious: { label: 'Anxious', emoji: '😟', color: 'bg-mood-anxious' },
  tired: { label: 'Tired', emoji: '😴', color: 'bg-mood-tired' },
};
