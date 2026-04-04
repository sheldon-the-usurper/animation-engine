import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchGraphProps {
  equation?: string;
  width?: number;
  height?: number;
  scale?: number;
  color?: string;
  delay?: number;
  duration?: number;
}

export const SketchGraph: React.FC<SketchGraphProps> = ({ 
  equation = "Math.sin(x)",
  width = 600,
  height = 400,
  scale = 40,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw axes with Rough.js
    rc.line(0, height / 2, width, height / 2, { 
        stroke: Theme.colors.light.neutral, 
        strokeWidth: 1, 
        roughness: 1,
        opacity: 0.5,
        seed: 1
    });
    rc.line(width / 2, 0, width / 2, height, { 
        stroke: Theme.colors.light.neutral, 
        strokeWidth: 1, 
        roughness: 1,
        opacity: 0.5,
        seed: 1
    });

    // Plot graph
    const points: [number, number][] = [];
    const resolution = 2; // Pixel step
    const limit = Math.floor(width * progress);

    for (let px = 0; px <= limit; px += resolution) {
      const x = (px - width / 2) / scale;
      let y;
      try {
        // Safe evaluation context for x
        y = eval(equation.replace(/x/g, `(${x})`));
      } catch {
        continue;
      }
      const py = height / 2 - y * scale;
      
      // Keep points within bounds to avoid chaotic lines
      if (py > -height && py < height * 2) {
        points.push([px, py]);
      }
    }

    if (points.length > 1) {
      rc.curve(points, { 
        stroke: color, 
        strokeWidth: 3, 
        roughness: 1.2, 
        bowing: 1.5,
        seed: 1
      });
    }
  }, [equation, width, height, scale, progress, color]);

  return (
    <div style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.05))' }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}
