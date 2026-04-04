import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface SketchHeatmapProps {
  equation?: string;
  title?: string;
  width?: number;
  height?: number;
  delay?: number;
  duration?: number;
  resolution?: number;
}

export const SketchHeatmap: React.FC<SketchHeatmapProps> = ({ 
  equation = "Math.sin(x) * Math.cos(y)",
  title = "Heatmap (z = f(x,y))",
  width = 800,
  height = 800,
  delay = 0,
  duration = 90,
  resolution = 25 // Lower resolution for sketchy feel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pad = 100;
  const xMin = -5, xMax = 5;
  const yMin = -5, yMax = 5;

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

    if (progress <= 0) return;

    // Helper to evaluate function
    const f = (x: number, y: number) => {
        try {
            return eval(equation.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`));
        } catch {
            return 0;
        }
    };

    // Pre-compute grid to find min/max
    let zMin = Infinity;
    let zMax = -Infinity;
    const grid: number[][] = [];

    for (let i = 0; i < resolution; i++) {
        grid[i] = [];
        for (let j = 0; j < resolution; j++) {
            const x = xMin + (i / resolution) * (xMax - xMin);
            const y = yMin + (j / resolution) * (yMax - yMin);
            const z = f(x, y);
            grid[i][j] = z;
            if (z < zMin) zMin = z;
            if (z > zMax) zMax = z;
        }
    }

    const color = (v: number) => {
        const t = (v - zMin) / (zMax - zMin || 1);
        // Teal to accent colormap
        const r = Math.floor(15 + t * 200); // from #1a to something warmer
        const g = Math.floor(46 + t * 100);
        const b = Math.floor(44 + t * 50);
        return `rgb(${r},${g},${b})`;
    };

    const cellW = (width - 2 * pad) / resolution;
    const cellH = (height - 2 * pad) / resolution;

    // Draw cells
    const drawLimit = Math.floor(resolution * resolution * progress);
    let count = 0;

    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            if (count > drawLimit) break;
            
            const x = pad + i * cellW;
            const y = height - pad - (j + 1) * cellH;

            rc.rectangle(x, y, cellW, cellH, {
                fill: color(grid[i][j]),
                fillStyle: 'solid',
                stroke: 'none',
                roughness: 0.5,
                seed: 1
            });
            count++;
        }
    }

    // Axes
    rc.line(pad, pad, pad, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });
    rc.line(pad, height - pad, width - pad, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });

  }, [equation, width, height, progress, resolution]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', top: -60, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={32} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 600, color: Theme.colors.light.neutral }}>X Axis</span>
      </div>
      <div style={{ 
          position: 'absolute', 
          left: 20, 
          top: height / 2, 
          transform: 'rotate(-90deg) translate(-50%, 0)',
          transformOrigin: 'left'
      }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 600, color: Theme.colors.light.neutral }}>Y Axis</span>
      </div>
    </div>
  );
}
