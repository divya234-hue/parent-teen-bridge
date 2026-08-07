/**
 * Insight Generator Service
 * Uses AI to generate empathetic and supportive responses
 */

import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import type { EmotionAnalysis } from './emotionAnalyzer.js';

export interface InsightResponse {
  for_receiver: string;
  context_note: string;
  suggested_response: string;
  empathy_tip: string;
  should_escalate: boolean;
}

const aiProvider = process.env.AI_PROVIDER || 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * Generate AI insight based on emotion analysis
 */
export async function generateInsightWithAI(
  message: string,
  emotionAnalysis: EmotionAnalysis,
  role: 'parent' | 'teen'
): Promise<InsightResponse> {
  const otherRole = role === 'parent' ? 'teen' : 'parent';
  const prompt = `You are an empathetic family communication expert. A ${role} said: "${message}"

Emotional Analysis:
- Primary emotion: ${emotionAnalysis.primary_emotion}
- Intensity: ${emotionAnalysis.intensity}
- Requires support: ${emotionAnalysis.requires_support}

Provide guidance for the ${otherRole}. Respond with ONLY a valid JSON object:
{
  "for_receiver": "Brief description of what the ${otherRole} should understand",
  "context_note": "Context and validation for the ${otherRole}",
  "suggested_response": "A specific, empathetic response the ${otherRole} can use",
  "empathy_tip": "Actionable advice for better communication",
  "should_escalate": false
}

Make responses warm, non-judgmental, and focused on building understanding.`;

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
        temperature: 0.8,
      });

      const content = response.choices[0].message.content;
      if (content) {
        return JSON.parse(content);
      }
    }

    throw new Error('No AI provider configured');
  } catch (error) {
    console.error('Error generating insight:', error);
    throw error;
  }
}

/**
 * Generate crisis support response
 */
export function generateCrisisSupportResponse(): InsightResponse {
  return {
    for_receiver: '🚨 CRISIS SUPPORT NEEDED',
    context_note:
      'This message indicates someone may be in crisis. Immediate action is needed.',
    suggested_response:
      'I care about you deeply. I want to help you through this. Let\'s reach out to someone who can provide professional support right now.',
    empathy_tip:
      '988 Suicide & Crisis Lifeline (call or text), Crisis Text Line (text HOME to 741741)',
    should_escalate: true,
  };
}
