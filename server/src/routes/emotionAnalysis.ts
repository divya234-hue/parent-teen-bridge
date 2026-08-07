import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  analyzeEmotionsWithAI,
  detectCrisis,
  type EmotionAnalysis,
} from '../services/emotionAnalyzer.js';
import {
  generateInsightWithAI,
  generateCrisisSupportResponse,
  type InsightResponse,
} from '../services/insightGenerator.js';

export const emotionAnalysisRouter = Router();

const analyzeRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  role: z.enum(['parent', 'teen']),
});

/**
 * POST /api/analyze
 * Analyze a message for emotions and generate insights
 */
emotionAnalysisRouter.post(
  '/analyze',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, role } = analyzeRequestSchema.parse(req.body);

      // Check for crisis
      if (detectCrisis(message)) {
        return res.json({
          analysis: {
            primary_emotion: 'crisis',
            secondary_emotions: [],
            sentiment_score: -1,
            intensity: 'high',
            requires_support: true,
            key_phrases: [],
            confidence: 1,
          } as EmotionAnalysis,
          insight: generateCrisisSupportResponse(),
        });
      }

      // Analyze emotions
      const analysis = await analyzeEmotionsWithAI(message, role);

      // Generate insight
      const insight = await generateInsightWithAI(message, analysis, role);

      res.json({ analysis, insight });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors });
      }
      next(error);
    }
  }
);

/**
 * POST /api/stream-insight
 * Stream real-time insight generation
 */
emotionAnalysisRouter.post(
  '/stream-insight',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, role } = analyzeRequestSchema.parse(req.body);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Check for crisis
      if (detectCrisis(message)) {
        const crisisResponse = generateCrisisSupportResponse();
        res.write(`data: ${JSON.stringify(crisisResponse)}\n\n`);
        res.end();
        return;
      }

      // Analyze emotions
      const analysis = await analyzeEmotionsWithAI(message, role);
      res.write(`data: ${JSON.stringify({ type: 'analysis', data: analysis })}\n\n`);

      // Generate insight (would be streamed from AI in real implementation)
      const insight = await generateInsightWithAI(message, analysis, role);
      res.write(`data: ${JSON.stringify({ type: 'insight', data: insight })}\n\n`);

      res.end();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.write(`data: ${JSON.stringify({ error: 'Invalid request' })}\n\n`);
      }
      res.end();
    }
  }
);
