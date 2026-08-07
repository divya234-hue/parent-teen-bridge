/**
 * Message Analyzer Component
 * Analyzes messages and displays emotion + insights
 */

import React, { useState } from 'react';
import { useEmotionAnalysis } from '../hooks/useEmotionAnalysis';
import { EmotionBadge } from './EmotionBadge';
import { InsightCard } from './InsightCard';
import { Loader } from 'lucide-react';

interface MessageAnalyzerProps {
  message: string;
  role: 'parent' | 'teen';
  onAnalysisComplete?: (emotion: string) => void;
}

export function MessageAnalyzer({ message, role, onAnalysisComplete }: MessageAnalyzerProps) {
  const { analysis, insight, loading, error, analyzeMessage } = useEmotionAnalysis();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  React.useEffect(() => {
    if (message && !hasAnalyzed) {
      analyzeMessage(message, role);
      setHasAnalyzed(true);
    }
  }, [message]);

  React.useEffect(() => {
    if (analysis && onAnalysisComplete) {
      onAnalysisComplete(analysis.primary_emotion);
    }
  }, [analysis]);

  if (!message) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <Loader className="w-5 h-5 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-gray-600">Analyzing message...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <>
          {/* Emotion Badge */}
          <div className="flex flex-wrap gap-2">
            <EmotionBadge
              emotion={analysis.primary_emotion}
              intensity={analysis.intensity}
            />
            {analysis.secondary_emotions.map(emotion => (
              <EmotionBadge
                key={emotion}
                emotion={emotion}
                intensity="low"
              />
            ))}
          </div>

          {/* Key Phrases */}
          {analysis.key_phrases.length > 0 && (
            <div className="text-xs text-gray-600">
              <span className="font-semibold">Detected:</span> {analysis.key_phrases.join(', ')}
            </div>
          )}

          {/* Insight Card */}
          {insight && <InsightCard insight={insight} />}
        </>
      )}
    </div>
  );
}
