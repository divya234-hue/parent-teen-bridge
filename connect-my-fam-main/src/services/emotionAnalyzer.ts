/**
 * Emotion Analyzer Service
 * Detects and analyzes emotions from text messages
 */

export interface EmotionAnalysis {
  primary_emotion: string;
  secondary_emotions: string[];
  sentiment_score: number; // -1 (very negative) to 1 (very positive)
  intensity: 'low' | 'medium' | 'high';
  requires_support: boolean;
  key_phrases: string[];
}

const EMOTION_KEYWORDS: Record<string, string[]> = {
  anger: ['hate', 'angry', 'furious', 'mad', 'disgusted', 'irritated', 'frustrated'],
  sadness: ['sad', 'depressed', 'unhappy', 'miserable', 'heartbroken', 'lonely', 'upset'],
  anxiety: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'stressed', 'terrified'],
  joy: ['happy', 'excited', 'thrilled', 'delighted', 'joyful', 'amazing', 'wonderful'],
  confusion: ['confused', 'lost', 'uncertain', 'bewildered', 'puzzled', 'unsure'],
  overwhelm: ['overwhelmed', 'stressed', 'exhausted', 'burnt out', 'drowning', 'swamped'],
};

/**
 * Analyze emotions in a message
 */
export async function analyzeEmotions(message: string): Promise<EmotionAnalysis> {
  const lowerMessage = message.toLowerCase();
  const detectedEmotions: Record<string, number> = {};
  const keyPhrases: string[] = [];

  // Keyword-based emotion detection
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        detectedEmotions[emotion] = (detectedEmotions[emotion] || 0) + 1;
        keyPhrases.push(keyword);
      }
    }
  }

  const sortedEmotions = Object.entries(detectedEmotions)
    .sort(([, a], [, b]) => b - a)
    .map(([emotion]) => emotion);

  const primaryEmotion = sortedEmotions[0] || 'neutral';
  const secondaryEmotions = sortedEmotions.slice(1, 3);

  // Calculate sentiment score (simplified)
  const positiveScore = ['joy', 'excitement'].some(e => sortedEmotions.includes(e)) ? 0.5 : 0;
  const negativeScore = ['anger', 'sadness', 'anxiety'].some(e => sortedEmotions.includes(e)) ? -0.5 : 0;
  const sentimentScore = positiveScore + negativeScore;

  // Determine intensity
  const intensity = detectedEmotions[primaryEmotion] >= 3 ? 'high' : detectedEmotions[primaryEmotion] >= 2 ? 'medium' : 'low';

  return {
    primary_emotion: primaryEmotion,
    secondary_emotions: secondaryEmotions,
    sentiment_score: sentimentScore,
    intensity,
    requires_support: ['anger', 'sadness', 'anxiety', 'overwhelm'].includes(primaryEmotion) && intensity === 'high',
    key_phrases: [...new Set(keyPhrases)],
  };
}

/**
 * Get emotion color for UI display
 */
export function getEmotionColor(emotion: string): string {
  const colorMap: Record<string, string> = {
    anger: '#ef4444',
    sadness: '#3b82f6',
    anxiety: '#f59e0b',
    joy: '#22c55e',
    confusion: '#8b5cf6',
    overwhelm: '#ec4899',
    neutral: '#6b7280',
  };
  return colorMap[emotion] || '#6b7280';
}

/**
 * Get emotion icon
 */
export function getEmotionIcon(emotion: string): string {
  const iconMap: Record<string, string> = {
    anger: '😠',
    sadness: '😢',
    anxiety: '😰',
    joy: '😊',
    confusion: '😕',
    overwhelm: '😫',
    neutral: '😐',
  };
  return iconMap[emotion] || '😐';
}
