import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { Theme } from '../styles/theme';
import { JitterGroup } from './JitterGroup';

interface SketchImageProps {
  src: string;
  width?: number;
  height?: number;
  mode?: 'light' | 'dark';
  delay?: number;
  label?: string;
}

export const SketchImage: React.FC<SketchImageProps> = ({
  src,
  width = 400,
  height = 300,
  mode = 'light',
  delay = 0,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;

  const s = spring({
    fps,
    frame: frame - delay,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.8, 1]);

  return (
    <div style={{ 
      width, 
      height: height + (label ? 40 : 0), 
      position: 'relative',
      opacity,
      transform: `scale(${scale})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <JitterGroup amount={2}>
        <div style={{
          width,
          height,
          border: `4px solid ${theme.accent}`,
          borderRadius: 8,
          overflow: 'hidden',
          background: theme.paper,
          boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 20px rgba(0,0,0,0.1)',
          position: 'relative',
        }}>
          {/* Fallback pattern if image is missing */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${theme.accent}11 10px, ${theme.accent}11 20px)`,
            zIndex: -1,
          }} />
          
          <img 
            src={staticFile(src)} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: mode === 'dark' ? 'brightness(0.9) contrast(1.1)' : 'none',
            }} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            alt={label || "Visual aid"}
          />
        </div>
      </JitterGroup>

      {label && (
        <div style={{ 
          marginTop: 15, 
          fontSize: 24, 
          fontWeight: 800, 
          color: theme.accent,
          fontFamily: 'Architects Daughter',
        }}>
          {label}
        </div>
      )}
    </div>
  );
};
