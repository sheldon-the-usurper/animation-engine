import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface EraseRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  width?: number;
  height?: number;
  direction?: 'ltr' | 'rtl' | 'top-down';
}

export const EraseReveal: React.FC<EraseRevealProps> = ({
  children,
  delay = 0,
  duration = 30,
  width = 500,
  height = 300,
  direction = 'ltr',
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

  // Create a zig-zag "erase" path that covers the area
  const erasePath = useMemo(() => {
    const steps = 10;
    const stepHeight = height / steps;
    let path = `M 0,0`;

    if (direction === 'ltr' || direction === 'rtl') {
      for (let i = 0; i <= steps; i++) {
        const y = i * stepHeight;
        const x = (i % 2 === 0) ? width : 0;
        path += ` L ${x},${y}`;
      }
    } else {
        // Top-down zig-zag
        const stepWidth = width / steps;
        for (let i = 0; i <= steps; i++) {
            const x = i * stepWidth;
            const y = (i % 2 === 0) ? height : 0;
            path += ` L ${x},${y}`;
        }
    }
    return path;
  }, [width, height, direction]);

  const maskId = useMemo(() => `erase-mask-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg width="0" height="0">
        <defs>
          <mask id={maskId}>
            <path
              d={erasePath}
              fill="none"
              stroke="white"
              strokeWidth={height / 5} // Thick eraser stroke
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5000 5000"
              strokeDashoffset={5000 - progress * 5000}
            />
          </mask>
          
          <filter id="rough-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>
      </svg>

      <div style={{ 
        mask: `url(#${maskId})`, 
        WebkitMask: `url(#${maskId})`,
        filter: 'url(#rough-edge)'
      }}>
        {children}
      </div>
    </div>
  );
};
