import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchAtomProps {
  size?: number;
  color?: string;
  delay?: number;
  duration?: number;
}

export const SketchAtom: React.FC<SketchAtomProps> = ({ 
  size = 600, 
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame: frame - delay, config: { damping: 20 } });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    
    if (progress <= 0) return;

    const cx = size / 2;
    const cy = size / 2;
    const t = (frame - delay) * 0.08;

    // Nucleus (Protons/Neutrons clump)
    rc.circle(cx, cy, 40 * progress, {
      fill: '#ef4444',
      fillStyle: 'hachure',
      hachureAngle: 45,
      hachureGap: 3,
      stroke: '#b91c1c',
      strokeWidth: 2,
      roughness: 2,
      seed: 1
    });

    // Orbits
    const orbits = [100, 170, 240];
    orbits.forEach((r, i) => {
      // Draw orbit as an ellipse for a 3D feel
      const rotation = (i * Math.PI) / 3;
      
      // Rough.js doesn't have a direct rotated ellipse with easy API for "path" movement, 
      // but we can draw the orbit and calculate electron position.
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      
      rc.ellipse(0, 0, r * 2 * progress, r * 0.8 * progress, {
        stroke: '#cbd5e1',
        strokeWidth: 1,
        roughness: 1.2,
        opacity: 0.4,
        seed: 1
      });
      
      ctx.restore();

      // Electrons
      const speed = 0.6 + (2 - i) * 0.3;
      const angle = t * speed + i;
      
      // Rotate the point manually for the electron
      const rx = Math.cos(angle) * r * progress;
      const ry = Math.sin(angle) * r * 0.4 * progress;
      
      const ex = cx + (rx * Math.cos(rotation) - ry * Math.sin(rotation));
      const ey = cy + (rx * Math.sin(rotation) + ry * Math.cos(rotation));

      rc.circle(ex, ey, 14 * progress, {
        fill: color,
        fillStyle: 'solid',
        stroke: color,
        strokeWidth: 1,
        roughness: 1.5,
        seed: 1
      });
    });

  }, [frame, delay, size, color, progress, fps]);

  return (
    <div style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }}>
        <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
};
