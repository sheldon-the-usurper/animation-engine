import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface DataPoint {
  x: number;
  y: number;
}

interface SketchScatterProps {
  data?: DataPoint[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SketchScatter: React.FC<SketchScatterProps> = ({ 
  data = [
    { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 3 }, 
    { x: 4, y: 6 }, { x: 5, y: 5 }, { x: 6, y: 8 }, 
    { x: 7, y: 7 }, { x: 8, y: 10 }
  ],
  title = "Correlation Analysis",
  width = 800,
  height = 600,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 90,
  xAxisLabel = "Variable X",
  yAxisLabel = "Variable Y"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pad = 80;
  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);

  const minX = Math.min(...xs) * 0.9;
  const maxX = Math.max(...xs) * 1.1;
  const minY = Math.min(...ys) * 0.9;
  const maxY = Math.max(...ys) * 1.1;

  const mapX = (x: number) => pad + ((x - minX) / (maxX - minX)) * (width - 2 * pad);
  const mapY = (y: number) => height - pad - ((y - minY) / (maxY - minY)) * (height - 2 * pad);

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

    // Grid lines (subtle)
    for (let i = 0; i <= 4; i++) {
      const x = pad + (i / 4) * (width - 2 * pad);
      const y = pad + (i / 4) * (height - 2 * pad);

      rc.line(x, pad, x, height - pad, { stroke: '#e2e8f0', strokeWidth: 1, roughness: 0.5, seed: 1 });
      rc.line(pad, y, width - pad, y, { stroke: '#e2e8f0', strokeWidth: 1, roughness: 0.5, seed: 1 });
    }

    // Axes
    rc.line(pad, pad/2, pad, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });
    rc.line(pad, height - pad, width - pad/2, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });

    // Points
    data.forEach((p, i) => {
      const pointDelay = delay + (i * (duration / data.length));
      const s = spring({ fps, frame: frame - pointDelay, config: { damping: 12 } });
      
      if (s > 0) {
        const px = mapX(p.x);
        const py = mapY(p.y);
        rc.circle(px, py, 12 * s, {
          fill: color,
          fillStyle: 'solid',
          stroke: color,
          strokeWidth: 1,
          roughness: 1.5,
          seed: 1
        });
      }
    });

  }, [data, width, height, progress, color, frame, fps, delay, duration]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', top: -40, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={32} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center' }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 18, color: Theme.colors.light.neutral, opacity: progress }}>{xAxisLabel}</span>
      </div>
      <div style={{ 
          position: 'absolute', 
          left: -40, 
          top: height / 2, 
          transform: 'rotate(-90deg)',
          opacity: progress
      }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 18, color: Theme.colors.light.neutral }}>{yAxisLabel}</span>
      </div>
    </div>
  );
}
