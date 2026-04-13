import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Theme } from '../styles/theme';

export const ProfessionalOutro: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  
  // High-end logo animation only
  const logoEntry = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 1 },
  });

  const logoScale = interpolate(logoEntry, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoEntry, [0, 1], [0, 1]);

  const logoFile = mode === 'dark' ? 'logo-dark.svg' : 'logo.svg';

  return (
    <AbsoluteFill style={{ 
      backgroundColor: theme.paper, 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <div style={{ 
        width: 300, 
        height: 300, 
        transform: `scale(${logoScale})`,
        opacity: logoOpacity,
        filter: mode === 'dark' ? 'drop-shadow(0 0 30px rgba(255,255,255,0.15))' : 'none'
      }}>
        <img 
          src={staticFile(logoFile)} 
          style={{ width: '100%', height: '100%' }} 
          alt="EulerFold" 
        />
      </div>
      
      {/* Minimalist signature line that grows */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        height: 2,
        width: interpolate(logoEntry, [0.5, 1], [0, 100]),
        background: theme.accent,
        opacity: 0.5,
        borderRadius: 1
      }} />
    </AbsoluteFill>
  );
};
