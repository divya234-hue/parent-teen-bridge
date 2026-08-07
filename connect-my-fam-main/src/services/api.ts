/**
 * API Service
 * Handles communication with backend AI services
 */

import type { EmotionAnalysis } from './emotionAnalyzer';
import type { InsightResponse } from './aiInsights';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Send message for AI analysis
 */
export async function analyzeMessageWithAI(
  message: string,
  role: 'parent' | 'teen'
): Promise<{
  analysis: EmotionAnalysis;
  insight: InsightResponse;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, role }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to analyze message:', error);
    throw error;
  }
}

/**
 * Stream AI response (for real-time insights)
 */
export async function* streamAIInsight(
  message: string,
  role: 'parent' | 'teen'
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stream-insight`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, role }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Failed to stream insight:', error);
    throw error;
  }
}

/**
 * Get conversation history analysis
 */
export async function analyzeConversation(
  messages: Array<{ sender: 'parent' | 'teen'; content: string }>
): Promise<{
  summary: string;
  patterns: string[];
  recommendations: string[];
  connection_score: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to analyze conversation:', error);
    throw error;
  }
}
