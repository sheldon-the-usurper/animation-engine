import React, { useMemo } from 'react';
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
  mode?: 'light' | 'dark';
}

export const SketchyBox: React.FC<SketchyBoxProps> = ({
  width,
  height,
  color,
  strokeWidth = 2.5,
  delay = 0,
  duration = 45,
  children,
  mode = 'light',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Use theme color if not provided
  const borderColor = color || (mode === 'dark' ? Theme.colors.dark.border : Theme.colors.light.border);

  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Generate sketchy paths once
  const paths = useMemo(() => {
    const pad = 5;
    const w = width;
    const h = height;
    
    // Each side will have two slightly different strokes
    const getStroke = (x1: number, y1: number, x2: number, y2: number, jitter: number) => {
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * jitter;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * jitter;
      return `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;
    };

    const jitter = 3;
    const corners = [
        { x: pad, y: pad },
        { x: w - pad, y: pad },
        { x: w - pad, y: h - pad },
        { x: pad, y: h - pad }
    ];

    // Primary paths (4 sides)
    const primary = [
        getStroke(corners[0].x, corners[0].y, corners[1].x, corners[1].y, jitter),
        getStroke(corners[1].x, corners[1].y, corners[2].x, corners[2].y, jitter),
        getStroke(corners[2].x, corners[2].y, corners[3].x, corners[3].y, jitter),
        getStroke(corners[3].x, corners[3].y, corners[0].x, corners[0].y, jitter),
    ];

    // Secondary paths (offset slightly for sketch effect)
    const secondary = [
        getStroke(corners[0].x - 1, corners[0].y + 1, corners[1].x + 1, corners[1].y - 1, jitter),
        getStroke(corners[1].x - 1, corners[1].y - 1, corners[2].x + 1, corners[2].y + 1, jitter),
        getStroke(corners[2].x + 1, corners[2].y - 1, corners[3].x - 1, corners[3].y + 1, jitter),
        getStroke(corners[3].x + 1, corners[3].y + 1, corners[0].x - 1, corners[0].y - 1, jitter),
    ];

    return { primary, secondary };
  }, [width, height]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        {paths.primary.map((d, i) => {
            const start = delay + (i * duration) / 4;
            const end = delay + ((i + 1) * duration) / 4;
            const p = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
                <path
                    key={`p-${i}`}
                    d={d}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray="1000 1000"
                    strokeDashoffset={1000 - p * 1000}
                />
            );
        })}
        {paths.secondary.map((d, i) => {
            const start = delay + (i * duration) / 4 + 5;
            const end = delay + ((i + 1) * duration) / 4 + 5;
            const p = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
                <path
                    key={`s-${i}`}
                    d={d}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth={strokeWidth * 0.4}
                    strokeLinecap="round"
                    strokeDasharray="1000 1000"
                    strokeDashoffset={1000 - p * 1000}
                    opacity={0.5}
                />
            );
        })}
      </svg>
      <div style={{ position: 'relative', zIndex: 1, padding: 15, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};
