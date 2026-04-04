import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchCarProps {
  width?: number;
  height?: number;
  color?: string;
  speed?: number;
  delay?: number;
}

export const SketchCar: React.FC<SketchCarProps> = ({ 
  width = 800, 
  height = 400, 
  color = Theme.colors.light.accent,
  speed = 4,
  delay = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Animation logic
    const t = Math.max(0, frame - delay);
    const carWidth = 180;
    // Calculate X position with looping logic
    let x = (t * speed) % (width + carWidth) - carWidth;

    const options = {
      seed: 1,
      roughness: 1.5,
      stroke: Theme.colors.light.text,
      strokeWidth: 2,
    };

    // Draw Road
    rc.line(0, 240, width, 242, {
      ...options,
      stroke: Theme.colors.light.neutral,
      opacity: 0.4
    });

    // 1. Body
    rc.rectangle(x, 180, 160, 45, {
      ...options,
      fill: color,
      fillStyle: 'hachure',
      hachureAngle: 60,
      hachureGap: 4
    });

    // 2. Top
    rc.rectangle(x + 35, 140, 90, 40, {
      ...options,
      fill: color,
      fillStyle: 'hachure',
      hachureAngle: 60,
      hachureGap: 4
    });

    // 3. Windows
    const windowOptions = {
        ...options,
        fill: '#93c5fd',
        fillOpacity: 0.3,
        fillStyle: 'solid',
        strokeWidth: 1
    };
    rc.rectangle(x + 40, 145, 35, 30, windowOptions);
    rc.rectangle(x + 85, 145, 30, 30, windowOptions);

    // 4. Wheels
    const wheelY = 225;
    [x + 35, x + 125].forEach(wx => {
      // Outer tire
      rc.circle(wx, wheelY, 35, {
        ...options,
        fill: Theme.colors.light.text,
        fillStyle: 'solid'
      });
      // Inner rim
      rc.circle(wx, wheelY, 15, {
        ...options,
        fill: Theme.colors.light.neutral,
        fillStyle: 'solid',
        stroke: '#fff'
      });
      
      // Hubcap detail (spinning effect)
      const rotation = t * 0.2;
      rc.line(
          wx + Math.cos(rotation) * 10, 
          wheelY + Math.sin(rotation) * 10,
          wx - Math.cos(rotation) * 10,
          wheelY - Math.sin(rotation) * 10,
          { ...options, stroke: '#fff', strokeWidth: 1 }
      );
    });

  }, [frame, delay, width, height, color, speed]);

  return (
    <div style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.1))' }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
