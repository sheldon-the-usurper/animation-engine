import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { LucideIcon } from 'lucide-react';

interface DrawnIconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const DrawnIcon: React.FC<DrawnIconProps> = ({
  icon: Icon,
  size = 48,
  color = Theme.colors.teal,
  strokeWidth = 2,
  delay = 0,
  duration = 30,
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

  // We use a CSS filter to give it a slightly wobbly/hand-drawn feel
  // by displacing the strokes slightly.
  const wobblyFilter = `url(#sketchy-displace)`;

  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sketchy-displace">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      <Icon
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        style={{
          filter: wobblyFilter,
          strokeDasharray: '100 100',
          strokeDashoffset: 100 - progress * 100,
          transition: 'none',
        }}
      />
    </div>
  );
};
