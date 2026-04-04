import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface BubbleData {
  x: number;
  y: number;
  r: number;
  label?: string;
}

interface SketchBubblePlotProps {
  data?: BubbleData[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SketchBubblePlot: React.FC<SketchBubblePlotProps> = ({ 
  data = [
    { x: 10, y: 20, r: 25 },
    { x: 20, y: 35, r: 45 },
    { x: 30, y: 25, r: 35 },
    { x: 40, y: 50, r: 60 },
    { x: 50, y: 30, r: 40 }
  ],
  title = "Bubble Analysis",
  width = 800,
  height = 600,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 90,
  xAxisLabel = "Impact Factor",
  yAxisLabel = "Efficiency %"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pad = 120; // Increased padding
  
  const stats = useMemo(() => {
    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);
    return {
      minX: Math.min(...xs) * 0.7,
      maxX: Math.max(...xs) * 1.3,
      minY: Math.min(...ys) * 0.7,
      maxY: Math.max(...ys) * 1.3,
    };
  }, [data]);

  const mapX = (x: number) => pad + ((x - stats.minX) / (stats.maxX - stats.minX)) * (width - 2 * pad);
  const mapY = (y: number) => height - pad - ((y - stats.minY) / (stats.maxY - stats.minY)) * (height - 2 * pad);

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
    rc.line(pad, pad/2, pad, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 3, seed: 1 });
    rc.line(pad, height - pad, width - pad/2, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 3, seed: 1 });

    // Bubbles
    data.forEach((d, i) => {
      const bubbleDelay = delay + (i * (duration / data.length));
      const s = spring({ fps, frame: frame - bubbleDelay, config: { damping: 15 } });
      
      if (s > 0) {
        const px = mapX(d.x);
        const py = mapY(d.y);
        
        rc.circle(px, py, d.r * 2 * s, {
          fill: color,
          fillOpacity: 0.25,
          fillStyle: 'solid',
          stroke: color,
          strokeWidth: 2,
          roughness: 1,
          seed: 1
        });

        // Add label if provided
        if (d.label && s > 0.8) {
          ctx.font = `italic 600 ${Math.max(16, d.r * 0.4)}px sans-serif`;
          ctx.fillStyle = Theme.colors.light.text;
          ctx.textAlign = 'center';
          // Smarter label positioning: above if near bottom, below if near top
          const labelY = py > height - pad - 40 ? py - d.r * 1.5 : py + d.r * 1.5;
          ctx.fillText(d.label, px, labelY);
        }

        // Inner highlight for a "bubble" effect
        if (s > 0.8) {
           rc.arc(px - d.r * 0.3 * s, py - d.r * 0.3 * s, d.r * 0.4 * s, d.r * 0.4 * s, Math.PI, 1.5 * Math.PI, false, {
             stroke: '#fff',
             strokeWidth: 2,
             roughness: 0.5,
             seed: 1
           });
        }
      }
    });

  }, [data, width, height, progress, color, frame, fps, delay, duration, stats]);

  return (
    <div style={{ position: 'relative', width, height, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}>
      <div style={{ position: 'absolute', top: -50, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={36} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 600, color: Theme.colors.light.neutral, opacity: progress }}>{xAxisLabel}</span>
      </div>
      <div style={{ 
          position: 'absolute', 
          left: 30, 
          top: height / 2, 
          transform: 'rotate(-90deg) translate(-50%, 0)',
          transformOrigin: 'left',
          opacity: progress
      }}>
         <span style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 600, color: Theme.colors.light.neutral }}>{yAxisLabel}</span>
      </div>
    </div>
  );
}
