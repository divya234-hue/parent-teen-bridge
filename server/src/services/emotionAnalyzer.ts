/**
 * Server-side Emotion Analyzer
 * Uses AI to provide more sophisticated emotion detection
 */

import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

export interface EmotionAnalysis {
  primary_emotion: string;
  secondary_emotions: string[];
  sentiment_score: number;
  intensity: 'low' | 'medium' | 'high';
  requires_support: boolean;
  key_phrases: string[];
  confidence: number;
}

const aiProvider = process.env.AI_PROVIDER || 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * Analyze emotions using AI
 */
export async function analyzeEmotionsWithAI(
  message: string,
  role: 'parent' | 'teen'
): Promise<EmotionAnalysis> {
  const prompt = `Analyze the following ${role}'s message and extract emotional information.

Message: "${message}"

Respond with a JSON object containing:
{
  "primary_emotion": "the main emotion (anger, sadness, anxiety, joy, confusion, overwhelm, or neutral)",
  "secondary_emotions": ["array of up to 2 secondary emotions"],
  "sentiment_score": number between -1 (very negative) and 1 (very positive),
  "intensity": "low", "medium", or "high",
  "requires_support": boolean - true if this person needs emotional support,
  "key_phrases": ["important phrases that show emotion"],
  "confidence": number between 0 and 1
}

Respond ONLY with valid JSON.`;

  try {
    if (aiProvider === 'anthropic' && anthropic) {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return JSON.parse(content.text);
      }
    } else if (openai) {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (content) {
        return JSON.parse(content);
      }
    }

    throw new Error('No AI provider configured');
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    throw error;
  }
}

/**
 * Detect crisis keywords
 */
export function detectCrisis(message: string): boolean {
  const crisisKeywords = [
    'suicide',
    'kill myself',
    'hurt myself',
    'self harm',
    'ending it',
    'not worth living',
    'no point',
  ];

  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}
