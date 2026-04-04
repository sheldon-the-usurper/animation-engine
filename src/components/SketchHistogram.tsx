import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface SketchHistogramProps {
  data?: number[];
  bins?: number;
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SketchHistogram: React.FC<SketchHistogramProps> = ({ 
  data = [12, 15, 14, 10, 18, 22, 25, 19, 17, 16, 13, 21, 23, 24, 15, 18, 20, 22, 14, 16],
  bins = 6,
  title = "Distribution Analysis",
  width = 800,
  height = 600,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 90,
  xAxisLabel = "Value Range",
  yAxisLabel = "Frequency"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pad = 80;
  const chartW = width - 2 * pad;
  const chartH = height - 2 * pad;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;

  const counts = new Array(bins).fill(0);
  data.forEach(v => {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });

  const maxCount = Math.max(...counts);

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

    // Grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - pad - (i / 5) * chartH;
      rc.line(pad, y, width - pad, y, { stroke: '#e2e8f0', strokeWidth: 1, roughness: 0.5, seed: 1 });
    }

    // Axes
    rc.line(pad, pad/2, pad, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });
    rc.line(pad, height - pad, width - pad/2, height - pad, { stroke: Theme.colors.light.text, strokeWidth: 2, seed: 1 });

    // Bars
    const barW = chartW / bins;

    counts.forEach((count, i) => {
      const barDelay = delay + (i * (duration / bins) * 0.5);
      const s = spring({ fps, frame: frame - barDelay, config: { damping: 12 } });
      
      if (s > 0) {
        const x = pad + i * barW;
        const h = (count / maxCount) * chartH * s;
        const y = height - pad - h;
        
        // Sketchy bar
        rc.rectangle(x + 5, y, barW - 10, h, {
          fill: color,
          fillOpacity: 0.2,
          fillStyle: 'hachure',
          hachureAngle: 60,
          hachureGap: 4,
          stroke: color,
          strokeWidth: 2,
          roughness: 1.5,
          seed: 1
        });
      }
    });

  }, [counts, width, height, color, frame, fps, delay, duration, maxCount, bins, chartH, chartW]);

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
