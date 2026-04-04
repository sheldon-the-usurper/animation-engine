import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Theme } from '../styles/theme';

interface ScribbleTextProps {
  text: string;
  delay?: number;
  duration?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export const ScribbleText: React.FC<ScribbleTextProps> = ({
  text,
  delay = 0,
  duration = 60,
  color = Theme.colors.teal,
  fontSize = 48,
  fontFamily = 'cursive', // Recommended to use a real handwritten font
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = text.split('');
  const charDuration = duration / chars.length;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      color,
      fontSize,
      fontFamily,
      ...style,
    }}>
      {chars.map((char, i) => {
        const charDelay = delay + i * charDuration;
        const s = spring({ 
          fps, 
          frame: frame - charDelay, 
          config: { damping: 10, stiffness: 100 } 
        });

        // Add a slight "scribble" jitter to each character as it appears
        const jitter = interpolate(s, [0, 0.5, 1], [0, 2, 0]);
        const rotate = interpolate(s, [0, 0.5, 1], [0, -5, 0]);

        return (
          <span 
            key={i} 
            style={{ 
              opacity: s, 
              display: 'inline-block',
              transform: `translateY(${jitter}px) rotate(${rotate}deg)`,
              whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
