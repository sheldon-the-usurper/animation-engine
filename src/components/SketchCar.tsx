import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchCarProps {
  width?: number;
  height?: number;
  color?: string;
  speed?: number;
  delay?: number;
}

export const SketchCar: React.FC<SketchCarProps> = ({ 
  width = 400, 
  height = 200, 
  color = Theme.colors.light.accent,
  speed = 4,
  delay = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Animation logic
    const t = Math.max(0, frame - delay);
    
    // Scale factor for car elements
    const scale = width / 400;
    const carWidth = 160 * scale;
    const carHeight = 100 * scale;
    
    // Calculate X position with looping logic
    let x = (t * speed) % (width + carWidth) - carWidth;
    let groundY = height * 0.8;

    const options = {
      seed: 1,
      roughness: 1.5,
      stroke: Theme.colors.light.text,
      strokeWidth: 2 * scale,
    };

    // Draw Road
    rc.line(0, groundY + 5, width, groundY + 7, {
      ...options,
      stroke: Theme.colors.light.neutral,
      opacity: 0.4
    });

    // 1. Body
    const bodyY = groundY - 40 * scale;
    rc.rectangle(x, bodyY, 160 * scale, 40 * scale, {
      ...options,
      fill: color,
      fillStyle: 'hachure',
      hachureAngle: 60,
      hachureGap: 4
    });

    // 2. Top
    const topY = bodyY - 35 * scale;
    rc.rectangle(x + 35 * scale, topY, 90 * scale, 35 * scale, {
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
        strokeWidth: 1 * scale
    };
    rc.rectangle(x + 40 * scale, topY + 5 * scale, 35 * scale, 25 * scale, windowOptions);
    rc.rectangle(x + 85 * scale, topY + 5 * scale, 30 * scale, 25 * scale, windowOptions);

    // 4. Wheels
    const wheelY = groundY - 10 * scale;
    const wheelRadius = 30 * scale;
    [x + 35 * scale, x + 125 * scale].forEach(wx => {
      // Outer tire
      rc.circle(wx, wheelY, wheelRadius, {
        ...options,
        fill: Theme.colors.light.text,
        fillStyle: 'solid'
      });
      // Inner rim
      rc.circle(wx, wheelY, 12 * scale, {
        ...options,
        fill: Theme.colors.light.neutral,
        fillStyle: 'solid',
        stroke: '#fff'
      });
      
      // Hubcap detail (spinning effect)
      const rotation = t * 0.2;
      rc.line(
          wx + Math.cos(rotation) * 8 * scale, 
          wheelY + Math.sin(rotation) * 8 * scale,
          wx - Math.cos(rotation) * 8 * scale,
          wheelY - Math.sin(rotation) * 8 * scale,
          { ...options, stroke: '#fff', strokeWidth: 1 * scale }
      );
    });

  }, [frame, delay, width, height, color, speed]);

  return (
    <div style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
