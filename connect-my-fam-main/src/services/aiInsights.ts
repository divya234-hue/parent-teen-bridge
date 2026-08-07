/**
 * AI Insights Service
 * Generates empathetic responses and supportive insights
 */

import type { EmotionAnalysis } from './emotionAnalyzer';

export interface InsightResponse {
  for_receiver: string; // What to send to the recipient
  context_note: string; // Context for the sender
  suggested_response: string; // Suggested way to respond
  empathy_tip: string; // A supportive tip
  should_escalate: boolean; // Whether professional help might be needed
}

const EMPATHY_FRAMEWORKS: Record<string, Record<string, string>> = {
  anger: {
    opener: "They're feeling frustrated or upset. This might help:",
    template: "I hear that you're {{emotion}}. That sounds really difficult. What would help you feel better?",
    tip: "Give them space first, then listen without judgment.",
  },
  sadness: {
    opener: "They're going through a tough time. Consider saying:",
    template: "I notice you're {{emotion}}. I'm here for you. Want to talk about it?",
    tip: "Sometimes just knowing someone cares can make a difference.",
  },
  anxiety: {
    opener: "They're feeling worried or stressed. Try this approach:",
    template: "I can see you're {{emotion}}. Let's talk about what's worrying you. We can figure this out together.",
    tip: "Help them break down the problem into smaller, manageable pieces.",
  },
  overwhelm: {
    opener: "They're feeling swamped. This gentle approach works well:",
    template: "You seem really {{emotion}}. Let's take a break and talk about what's most pressing right now.",
    tip: "Help prioritize one thing at a time instead of everything at once.",
  },
  joy: {
    opener: "They're excited! Share in their happiness:",
    template: "That's amazing! Tell me more—I want to hear what's got you so {{emotion}}!",
    tip: "Celebrate with them. Shared joy strengthens your bond.",
  },
  confusion: {
    opener: "They're feeling lost or uncertain. Offer clarity:",
    template: "I can see you're {{emotion}} about this. Let's break it down together so it makes more sense.",
    tip: "Ask clarifying questions and help them think through options.",
  },
};

/**
 * Generate AI insight based on emotional analysis
 */
export async function generateInsight(message: string, emotionAnalysis: EmotionAnalysis, role: 'parent' | 'teen'): Promise<InsightResponse> {
  const emotion = emotionAnalysis.primary_emotion;
  const framework = EMPATHY_FRAMEWORKS[emotion] || EMPATHY_FRAMEWORKS.neutral;

  // Determine if escalation is needed
  const escalationKeywords = ['suicide', 'hurt myself', 'self harm', 'kill myself', 'ending it'];
  const shouldEscalate = escalationKeywords.some(keyword => message.toLowerCase().includes(keyword));

  // Generate suggested response
  const emotionWord = emotion.replace('_', ' ');
  const suggestedResponse = framework.template.replace('{{emotion}}', emotionWord);

  // Context note based on role
  let contextNote = framework.opener;
  if (role === 'parent' && emotionAnalysis.requires_support) {
    contextNote += ' Your teen might benefit from extra support right now.';
  } else if (role === 'teen' && emotionAnalysis.requires_support) {
    contextNote += ' Remember, it's okay to share how you really feel.';
  }

  return {
    for_receiver: `${getEmotionEmoji(emotion)} ${emotion.toUpperCase()}: ${framework.opener}`,
    context_note: contextNote,
    suggested_response: suggestedResponse,
    empathy_tip: framework.tip,
    should_escalate: shouldEscalate,
  };
}

/**
 * Generate crisis support message if needed
 */
export function generateCrisisSupport(): InsightResponse {
  return {
    for_receiver: '🆘 CRISIS SUPPORT',
    context_note: 'This message indicates someone may be in crisis. Please reach out to a professional.',
    suggested_response: 'I care about you, and I want to help. Can we talk to someone who can really support you with this?',
    empathy_tip: 'Crisis support hotlines: 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line)',
    should_escalate: true,
  };
}

/**
 * Get emotion emoji for display
 */
function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    anger: '😠',
    sadness: '😢',
    anxiety: '😰',
    joy: '😊',
    confusion: '😕',
    overwhelm: '😫',
    neutral: '😐',
  };
  return emojiMap[emotion] || '😐';
}

/**
 * Translate teen message for parent understanding
 */
export function translateForParent(message: string, emotion: string): string {
  const translations: Record<string, string> = {
    'I hate school': 'School is really frustrating me right now',
    'everyone is against me': 'I feel like nobody understands me',
    'nobody cares': 'I feel really alone and unsupported',
    'this is impossible': 'I\'m struggling with this challenge',
  };

  for (const [pattern, translation] of Object.entries(translations)) {
    if (message.toLowerCase().includes(pattern.toLowerCase())) {
      return translation;
    }
  }

  return message;
}
