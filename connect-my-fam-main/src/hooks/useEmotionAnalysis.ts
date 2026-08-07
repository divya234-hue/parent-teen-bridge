/**
 * Custom Hook: Emotion Analysis
 * Provides emotion analysis and AI insights in React components
 */

import { useState, useCallback } from 'react';
import { analyzeEmotions } from '../services/emotionAnalyzer';
import { generateInsight, generateCrisisSupport } from '../services/aiInsights';
import { analyzeMessageWithAI } from '../services/api';
import type { EmotionAnalysis } from '../services/emotionAnalyzer';
import type { InsightResponse } from '../services/aiInsights';

interface UseEmotionAnalysisReturn {
  analysis: EmotionAnalysis | null;
  insight: InsightResponse | null;
  loading: boolean;
  error: string | null;
  analyzeMessage: (message: string, role: 'parent' | 'teen') => Promise<void>;
  reset: () => void;
}

export function useEmotionAnalysis(): UseEmotionAnalysisReturn {
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMessage = useCallback(
    async (message: string, role: 'parent' | 'teen') => {
      try {
        setLoading(true);
        setError(null);

        // Check for crisis keywords
        const crisisKeywords = ['suicide', 'hurt myself', 'self harm', 'kill myself'];
        if (crisisKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
          setInsight(generateCrisisSupport());
          return;
        }

        // Analyze emotions
        const emotionAnalysis = await analyzeEmotions(message);
        setAnalysis(emotionAnalysis);

        // Generate insight
        const aiInsight = await generateInsight(message, emotionAnalysis, role);
        setInsight(aiInsight);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze message');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setAnalysis(null);
    setInsight(null);
    setError(null);
  }, []);

  return {
    analysis,
    insight,
    loading,
    error,
    analyzeMessage,
    reset,
  };
}
