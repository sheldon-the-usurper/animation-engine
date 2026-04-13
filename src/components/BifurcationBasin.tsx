import React, { useMemo } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { JitterGroup } from './JitterGroup';

interface BifurcationBasinProps {
  mode?: 'light' | 'dark';
  stability: number; // 0 to 1, where 1 is healthy and 0 is critical
  delay?: number;
}

export const BifurcationBasin: React.FC<BifurcationBasinProps> = ({
  mode = 'light',
  stability = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;

  const t = frame - delay;
  
  // Basin shape animation
  const depth = interpolate(stability, [0, 1], [50, 200]);
  const widthFactor = interpolate(stability, [0, 1], [1.5, 0.8]);

  // Ball animation (physics-like oscillation)
  const frequency = interpolate(stability, [0, 1], [0.05, 0.2]);
  const amplitude = interpolate(stability, [0, 1], [150, 40]);
  const ballX = Math.sin(t * frequency) * amplitude;
  
  // Calculate Y position based on a parabola: y = (x^2) / depth
  const ballY = (ballX * ballX) / (depth * widthFactor);

  const points = useMemo(() => {
    const p = [];
    for (let x = -300; x <= 300; x += 10) {
      p.push([x, (x * x) / (depth * widthFactor)]);
    }
    return p;
  }, [depth, widthFactor]);

  const path = useMemo(() => {
    return points.reduce((acc, curr, i) => 
      i === 0 ? `M ${curr[0]},${curr[1]}` : `${acc} L ${curr[0]},${curr[1]}`, 
    '');
  }, [points]);

  const ballProgress = spring({
    fps,
    frame: t,
    config: { damping: 10 }
  });

  return (
    <div style={{ position: 'relative', width: 600, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <JitterGroup amount={1}>
        <svg width="600" height="400" style={{ overflow: 'visible' }}>
          {/* The Basin */}
          <path 
            d={path} 
            stroke={theme.text} 
            strokeWidth={4} 
            fill="none" 
            transform="translate(300, 100)"
            strokeLinecap="round"
          />
          
          {/* Ground indicator */}
          <line x1="0" y1="100" x2="600" y2="100" stroke={theme.neutral} strokeWidth={2} strokeDasharray="10 10" opacity={0.3} />

          {/* The System Ball */}
          <circle 
            cx={300 + ballX} 
            cy={100 + ballY} 
            r={20} 
            fill={stability < 0.3 ? kColors.red : theme.accent} 
            opacity={ballProgress}
            style={{ filter: stability < 0.3 ? `drop-shadow(0 0 15px ${kColors.red})` : 'none' }}
          />

          {/* Label */}
          <text 
            x="300" 
            y={100 + depth + 60} 
            textAnchor="middle" 
            fill={theme.neutral}
            style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Architects Daughter' }}
          >
            {stability > 0.7 ? "Resilient State" : stability > 0.3 ? "Critical Slowing Down" : "Tipping Point Imminent"}
          </text>
        </svg>
      </JitterGroup>
    </div>
  );
};
