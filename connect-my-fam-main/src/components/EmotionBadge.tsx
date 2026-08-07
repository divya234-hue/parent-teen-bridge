/**
 * Emotion Badge Component
 * Displays detected emotion with color and icon
 */

import React from 'react';
import { getEmotionColor, getEmotionIcon } from '../services/emotionAnalyzer';

interface EmotionBadgeProps {
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  className?: string;
}

export function EmotionBadge({ emotion, intensity, className = '' }: EmotionBadgeProps) {
  const color = getEmotionColor(emotion);
  const icon = getEmotionIcon(emotion);
  const intensityText = intensity === 'high' ? '●●●' : intensity === 'medium' ? '●●' : '●';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${className}`}
      style={{ backgroundColor: color }}
      title={`${emotion} (${intensity} intensity)`}
    >
      <span>{icon}</span>
      <span className="capitalize">{emotion}</span>
      <span className="text-xs opacity-75">{intensityText}</span>
    </div>
  );
}
