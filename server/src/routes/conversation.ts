import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  analyzeEmotionsWithAI,
  detectCrisis,
} from '../services/emotionAnalyzer.js';
import { generateInsightWithAI } from '../services/insightGenerator.js';

export const conversationRouter = Router();

const messageSchema = z.object({
  sender: z.enum(['parent', 'teen']),
  content: z.string().min(1),
});

const conversationAnalysisSchema = z.object({
  messages: z.array(messageSchema),
});

/**
 * POST /api/analyze-conversation
 * Analyze a full conversation for patterns and connection
 */
conversationRouter.post(
  '/analyze-conversation',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messages } = conversationAnalysisSchema.parse(req.body);

      if (messages.length === 0) {
        return res.status(400).json({ error: 'No messages provided' });
      }

      // Analyze each message
      const analyses = await Promise.all(
        messages.map(msg =>
          analyzeEmotionsWithAI(msg.content, msg.sender).catch(err => {
            console.error('Failed to analyze message:', err);
            return null;
          })
        )
      );

      // Filter out failed analyses
      const validAnalyses = analyses.filter(a => a !== null);

      if (validAnalyses.length === 0) {
        return res.status(500).json({ error: 'Failed to analyze conversation' });
      }

      // Calculate patterns
      const emotionFrequency: Record<string, number> = {};
      let totalSentiment = 0;
      let crisisDetected = false;

      for (const analysis of validAnalyses) {
        emotionFrequency[analysis.primary_emotion] =
          (emotionFrequency[analysis.primary_emotion] || 0) + 1;
        totalSentiment += analysis.sentiment_score;
      }

      for (const msg of messages) {
        if (detectCrisis(msg.content)) {
          crisisDetected = true;
          break;
        }
      }

      // Generate insights
      const avgSentiment = totalSentiment / validAnalyses.length;
      const dominantEmotion = Object.entries(emotionFrequency).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] || 'neutral';

      const summary = generateConversationSummary(
        messages.length,
        dominantEmotion,
        avgSentiment,
        crisisDetected
      );

      const patterns = extractPatterns(messages, validAnalyses);
      const recommendations = generateRecommendations(
        dominantEmotion,
        avgSentiment,
        messages
      );

      // Calculate connection score (0-100)
      const connectionScore = calculateConnectionScore(
        messages,
        validAnalyses,
        avgSentiment
      );

      res.json({
        summary,
        patterns,
        recommendations,
        connection_score: connectionScore,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors });
      }
      next(error);
    }
  }
);

function generateConversationSummary(
  messageCount: number,
  dominantEmotion: string,
  avgSentiment: number,
  crisisDetected: boolean
): string {
  if (crisisDetected) {
    return 'This conversation contains concerning content. Professional support may be needed.';
  }

  const sentimentDesc =
    avgSentiment > 0.3 ? 'positive' : avgSentiment < -0.3 ? 'negative' : 'mixed';
  return `${messageCount} messages exchanged with ${sentimentDesc} tone. Primary emotion: ${dominantEmotion}.`;
}

function extractPatterns(
  messages: Array<{ sender: 'parent' | 'teen'; content: string }>,
  analyses: any[]
): string[] {
  const patterns: string[] = [];

  // Check for response patterns
  for (let i = 1; i < messages.length; i++) {
    const prevAnalysis = analyses[i - 1];
    const currentAnalysis = analyses[i];

    if (
      prevAnalysis &&
      currentAnalysis &&
      prevAnalysis.primary_emotion !== currentAnalysis.primary_emotion
    ) {
      patterns.push(
        `Emotional shift from ${prevAnalysis.primary_emotion} to ${currentAnalysis.primary_emotion}`
      );
    }
  }

  // Check for teen expressing emotions
  const teenMessages = messages
    .filter(m => m.sender === 'teen')
    .map((m, i) => analyses[messages.indexOf(m)]);
  const avgTeenSentiment =
    teenMessages.reduce((sum, a) => sum + (a?.sentiment_score || 0), 0) / teenMessages.length;
  if (avgTeenSentiment < -0.2) {
    patterns.push('Teen expressing concerns or negative feelings');
  }

  return patterns.length > 0 ? patterns : ['Normal conversation flow'];
}

function generateRecommendations(
  dominantEmotion: string,
  avgSentiment: number,
  messages: Array<{ sender: 'parent' | 'teen'; content: string }>
): string[] {
  const recommendations: string[] = [];

  if (dominantEmotion === 'anger' || dominantEmotion === 'overwhelm') {
    recommendations.push('Consider taking a break and revisiting this conversation later.');
  }

  if (dominantEmotion === 'anxiety') {
    recommendations.push(
      'Offer reassurance and help break down concerns into manageable pieces.'
    );
  }

  if (avgSentiment < -0.3) {
    recommendations.push('Focus on validating feelings before offering solutions.');
  }

  const parentMessages = messages.filter(m => m.sender === 'parent').length;
  const teenMessages = messages.filter(m => m.sender === 'teen').length;
  if (parentMessages === 0 || teenMessages === 0) {
    recommendations.push('Encourage more balanced participation from both sides.');
  } else if (Math.abs(parentMessages - teenMessages) > 3) {
    recommendations.push(
      'Try to balance the conversation—listen more to the quieter participant.'
    );
  }

  return recommendations.length > 0
    ? recommendations
    : ['Keep up the positive communication!'];
}

function calculateConnectionScore(
  messages: Array<{ sender: 'parent' | 'teen'; content: string }>,
  analyses: any[],
  avgSentiment: number
): number {
  let score = 50; // Start at 50

  // Balance contribution
  const parentCount = messages.filter(m => m.sender === 'parent').length;
  const teenCount = messages.filter(m => m.sender === 'teen').length;
  const balance = Math.abs(parentCount - teenCount);
  score += Math.max(0, 25 - balance * 5);

  // Positive sentiment
  score += avgSentiment * 15;

  // Message count
  score += Math.min(25, messages.length * 2);

  return Math.min(100, Math.max(0, Math.round(score)));
}
