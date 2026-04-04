import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';

interface DrawnLineProps {
  path: string;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export const DrawnLine: React.FC<DrawnLineProps> = ({
  path,
  duration = 20, // Frames
  color = Theme.colors.teal,
  strokeWidth = 2,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate progress based on frame, delay, and duration
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(
    frame,
    [delay, delay + 5],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray="1000 1000" // Sufficiently large for most lines
      strokeDashoffset={1000 - progress * 1000}
      opacity={opacity}
    />
  );
};
