import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { PathReveal } from './PathReveal';

interface StepArrowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  curve?: 'straight' | 'soft' | 'loop';
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
}

export const StepArrow: React.FC<StepArrowProps> = ({
  from,
  to,
  curve = 'straight',
  color = Theme.colors.teal,
  strokeWidth = 3,
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrowPath = useMemo(() => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    if (curve === 'straight') {
      return `M ${from.x},${from.y} L ${to.x},${to.y}`;
    }
    
    if (curve === 'soft') {
      // Create a gentle quadratic curve
      const cx = (from.x + to.x) / 2 + dy * 0.2;
      const cy = (from.y + to.y) / 2 - dx * 0.2;
      return `M ${from.x},${from.y} Q ${cx},${cy} ${to.x},${to.y}`;
    }
    
    // Default or 'loop' logic could be added here
    return `M ${from.x},${from.y} L ${to.x},${to.y}`;
  }, [from, to, curve]);

  // Head logic: two small strokes at the end
  const headProgress = interpolate(
    frame,
    [delay + duration * 0.8, delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const headPaths = useMemo(() => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 15;
    const headAngle = Math.PI / 6; // 30 degrees

    const x1 = to.x - headLen * Math.cos(angle - headAngle);
    const y1 = to.y - headLen * Math.sin(angle - headAngle);
    const x2 = to.x - headLen * Math.cos(angle + headAngle);
    const y2 = to.y - headLen * Math.sin(angle + headAngle);

    return [
      `M ${x1},${y1} L ${to.x},${to.y}`,
      `M ${x2},${y2} L ${to.x},${to.y}`,
    ];
  }, [from, to]);

  return (
    <g>
      <PathReveal d={arrowPath} color={color} strokeWidth={strokeWidth} delay={delay} duration={duration * 0.8} />
      {headPaths.map((h, i) => (
        <PathReveal 
          key={i} 
          d={h} 
          color={color} 
          strokeWidth={strokeWidth} 
          delay={delay + duration * 0.8 + i * 2} 
          duration={duration * 0.2} 
        />
      ))}
    </g>
  );
};
