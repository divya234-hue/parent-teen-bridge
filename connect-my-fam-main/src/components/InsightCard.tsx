/**
 * Insight Card Component
 * Displays AI-generated insights and suggestions
 */

import React from 'react';
import { AlertCircle, Lightbulb, MessageCircle } from 'lucide-react';
import type { InsightResponse } from '../services/aiInsights';

interface InsightCardProps {
  insight: InsightResponse;
  onCopy?: (text: string) => void;
}

export function InsightCard({ insight, onCopy }: InsightCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopy?.(text);
  };

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Insight
        </h3>
      </div>

      {/* Crisis Alert */}
      {insight.should_escalate && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{insight.for_receiver}</p>
              <p className="text-sm text-red-700 mt-1">{insight.context_note}</p>
            </div>
          </div>
        </div>
      )}

      {/* Context Note */}
      <div className="mb-3">
        <p className="text-sm text-gray-700">{insight.context_note}</p>
      </div>

      {/* Suggested Response */}
      <div className="mb-3 p-3 bg-white rounded border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Try saying:
        </p>
        <p className="text-gray-800 italic mb-2">"​{insight.suggested_response}"</p>
        <button
          onClick={() => handleCopy(insight.suggested_response)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          📋 Copy
        </button>
      </div>

      {/* Empathy Tip */}
      <div className="p-3 bg-green-50 rounded border border-green-200">
        <p className="text-xs font-semibold text-green-900 mb-1">💡 Tip:</p>
        <p className="text-sm text-green-800">{insight.empathy_tip}</p>
      </div>
    </div>
  );
}
