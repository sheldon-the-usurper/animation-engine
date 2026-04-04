import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';

interface PathRevealProps {
  d: string;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  length?: number; // Optional: provide exact length for precision
  style?: React.CSSProperties;
}

export const PathReveal: React.FC<PathRevealProps> = ({
  d,
  duration = 30,
  color = Theme.colors.teal,
  strokeWidth = 3,
  delay = 0,
  length = 2000, // Default large enough for most paths
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${length} ${length}`}
      strokeDashoffset={length - progress * length}
      style={{
        ...style,
        filter: 'url(#sketchy-displace)', // Reuse filter if defined globally, or inline it
      }}
    />
  );
};
