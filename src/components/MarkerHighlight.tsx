import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';

interface MarkerHighlightProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  duration?: number;
  padding?: number;
  opacity?: number;
}

export const MarkerHighlight: React.FC<MarkerHighlightProps> = ({
  children,
  color = Theme.colors.teal,
  delay = 10,
  duration = 20,
  padding = 4,
  opacity = 0.2,
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
    <span style={{ position: 'relative', display: 'inline-block', padding: `0 ${padding}px` }}>
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '80%',
          width: `${progress * 100}%`,
          backgroundColor: color,
          opacity: opacity,
          zIndex: -1,
          borderRadius: '2px',
          transform: 'rotate(-1deg)',
          // Rough marker edges
          clipPath: 'polygon(0% 10%, 100% 0%, 98% 90%, 2% 100%)',
        }}
      />
      {children}
    </span>
  );
};
