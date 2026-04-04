import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchSurfaceProps {
  equation?: string;
  width?: number;
  height?: number;
  scale?: number;
  color?: string;
  delay?: number;
  duration?: number;
}

export const SketchSurface: React.FC<SketchSurfaceProps> = ({ 
  equation = "Math.sin(Math.sqrt(x*x + y*y))",
  width = 800,
  height = 600,
  scale = 40,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 90
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

    const step = 0.5;
    const range = 5;

    function project(x: number, y: number, z: number): [number, number] {
      const px = width / 2 + (x - y) * scale;
      const py = height / 2 + (x + y) * scale * 0.5 - z * scale;
      return [px, py];
    }

    const options = {
      stroke: color,
      strokeWidth: 1.5,
      roughness: 1,
      bowing: 1,
      opacity: 0.7,
      seed: 1
    };

    // Evaluate function
    const f = (x: number, y: number) => {
      try {
        // Simple substitution for eval
        return eval(equation.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`));
      } catch {
        return 0;
      }
    };

    // Draw lines along X
    const xLimit = -range + (range * 2 * progress);
    
    for (let x = -range; x <= xLimit; x += step) {
      const points: [number, number][] = [];
      for (let y = -range; y <= range; y += step) {
        const z = f(x, y);
        points.push(project(x, y, z));
      }
      if (points.length > 1) {
        rc.curve(points, options);
      }
    }

    // Draw lines along Y (only if progress is significant to show "building" effect)
    if (progress > 0.2) {
        const yProgress = interpolate(progress, [0.2, 1], [0, 1]);
        const yLimit = -range + (range * 2 * yProgress);
        
        for (let y = -range; y <= yLimit; y += step) {
            const points: [number, number][] = [];
            for (let x = -range; x <= range; x += step) {
                const z = f(x, y);
                points.push(project(x, y, z));
            }
            if (points.length > 1) {
                rc.curve(points, options);
            }
        }
    }

  }, [equation, width, height, scale, progress, color]);

  return (
    <div style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}
