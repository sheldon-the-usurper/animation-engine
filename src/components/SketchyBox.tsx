import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchyBoxProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  children?: React.ReactNode;
}

export const SketchyBox: React.FC<SketchyBoxProps> = ({
  width,
  height,
  color = Theme.colors.teal,
  strokeWidth = 2,
  delay = 0,
  duration = 30,
  children,
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

  // Wobbly points for a hand-drawn look
  const padding = 10;
  const w = width - padding * 2;
  const h = height - padding * 2;

  // Path 1 (First stroke)
  const p1 = `M ${padding},${padding} 
              L ${width-padding},${padding+2} 
              L ${width-padding-2},${height-padding} 
              L ${padding+3},${height-padding+1} 
              Z`;

  // Path 2 (Second slightly offset stroke for that "sketched" feel)
  const p2 = `M ${padding-2},${padding+3} 
              L ${width-padding+1},${padding-1} 
              L ${width-padding+3},${height-padding+2} 
              L ${padding-1},${height-padding-2} 
              Z`;

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <path
          d={p1}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray="2000 2000"
          strokeDashoffset={2000 - progress * 2000}
          opacity={0.8}
        />
        <path
          d={p2}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeDasharray="2000 2000"
          strokeDashoffset={2000 - progress * 2000}
          opacity={0.4}
        />
      </svg>
      <div style={{ position: 'relative', padding: padding * 2, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};
