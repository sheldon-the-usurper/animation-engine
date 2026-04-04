import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface JitterGroupProps {
  children: React.ReactNode;
  seed?: string;
  amount?: number;
  rotation?: number;
  frequency?: number;
}

export const JitterGroup: React.FC<JitterGroupProps> = ({
  children,
  seed = 'jitter',
  amount = 0,
  rotation = 0,
  frequency = 4, // Changes every 4 frames
}) => {
  const frame = useCurrentFrame();
  
  // Create a pseudo-random jitter that changes at a lower frequency for a "hand-drawn" look
  const jitterFrame = Math.floor(frame / frequency);
  
  // Use a simple hash for pseudo-randomness based on seed and jitterFrame
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h;
  };

  const randX = (hash(`${seed}-x-${jitterFrame}`) % 100) / 100 * amount;
  const randY = (hash(`${seed}-y-${jitterFrame}`) % 100) / 100 * amount;
  const randR = (hash(`${seed}-r-${jitterFrame}`) % 100) / 100 * rotation;

  return (
    <div
      style={{
        transform: `translate(${randX}px, ${randY}px) rotate(${randR}deg)`,
        transition: 'none',
      }}
    >
      {children}
    </div>
  );
};
