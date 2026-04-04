import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface StaggeredTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  delay?: number;
  stagger?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
  yOffset?: number;
  letterSpacing?: string;
  lineHeight?: number | string;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  fontSize = 32,
  fontWeight = 600,
  color = '#000',
  delay = 0,
  stagger = 3,
  fontFamily,
  style = {},
  yOffset = 20,
  letterSpacing = 'normal',
  lineHeight = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.25em',
        fontSize,
        fontWeight,
        color,
        fontFamily,
        letterSpacing,
        lineHeight,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const s = spring({
          fps,
          frame: frame - wordDelay,
          config: {
            damping: 12,
            stiffness: 100,
          },
        });

        const y = interpolate(s, [0, 1], [yOffset, 0]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: s,
              transform: `translateY(${y}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
