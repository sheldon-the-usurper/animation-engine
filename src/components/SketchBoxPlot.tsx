import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface SketchBoxPlotProps {
  data?: number[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
}

export const SketchBoxPlot: React.FC<SketchBoxPlotProps> = ({ 
  data = [5, 7, 8, 9, 10, 12, 13, 15, 18, 20, 22, 25, 30],
  title = "Statistical Distribution",
  width = 600,
  height = 800,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = useMemo(() => {
    const sorted = [...data].sort((a, b) => a - b);
    const q = (p: number) => {
      const pos = (sorted.length - 1) * p;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (base + 1 < sorted.length) {
        return sorted[base] + (sorted[base + 1] - sorted[base]) * rest;
      }
      return sorted[base];
    };

    return {
      min: sorted[0],
      q1: q(0.25),
      median: q(0.5),
      q3: q(0.75),
      max: sorted[sorted.length - 1]
    };
  }, [data]);

  const pad = 120;
  const minVal = stats.min * 0.8;
  const maxVal = stats.max * 1.1;

  const mapY = (v: number) => height - pad - ((v - minVal) / (maxVal - minVal)) * (height - 2 * pad);
  const centerX = width / 2;
  const boxWidth = 150;

  const progress = spring({ fps, frame: frame - delay, config: { damping: 15 } });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (progress <= 0) return;

    const options = {
      stroke: Theme.colors.light.text,
      strokeWidth: 2,
      roughness: 1.5,
      seed: 1,
    };

    const accentOptions = {
      ...options,
      stroke: color,
      fill: color,
      fillOpacity: 0.2,
      fillStyle: 'hachure',
      hachureAngle: 60,
      hachureGap: 5,
      seed: 1,
    };

    // Main Vertical Axis (Whiskers)
    const yMin = mapY(stats.min);
    const yMax = mapY(stats.max);
    const yQ1 = mapY(stats.q1);
    const yQ3 = mapY(stats.q3);
    const yMedian = mapY(stats.median);

    // Draw whisker lines (bottom to Q1, top to Q3)
    rc.line(centerX, yMin, centerX, yQ1, options);
    rc.line(centerX, yQ3, centerX, yMax, options);

    // Draw Caps
    rc.line(centerX - 40, yMin, centerX + 40, yMin, options);
    rc.line(centerX - 40, yMax, centerX + 40, yMax, options);

    // Draw Box (Q1 to Q3)
    const boxH = (yQ1 - yQ3) * progress;
    rc.rectangle(centerX - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3, accentOptions);

    // Median Line
    rc.line(centerX - boxWidth / 2 - 10, yMedian, centerX + boxWidth / 2 + 10, yMedian, {
        ...options,
        strokeWidth: 4,
        stroke: Theme.colors.light.accent
    });

  }, [stats, width, height, color, progress, centerX, boxWidth]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', top: -60, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={32} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      
      {/* Value Labels */}
      {progress > 0.5 && (
        <div style={{ position: 'absolute', right: 20, height: '100%', top: 0, display: 'flex', flexDirection: 'column' }}>
          {[
            { label: 'Max', val: stats.max },
            { label: 'Q3', val: stats.q3 },
            { label: 'Median', val: stats.median },
            { label: 'Q1', val: stats.q1 },
            { label: 'Min', val: stats.min }
          ].map((item, i) => (
            <div key={i} style={{ 
                position: 'absolute', 
                top: mapY(item.val) - 15,
                opacity: interpolate(progress, [0.5, 1], [0, 1]),
                fontFamily: 'sans-serif',
                fontSize: 20,
                fontWeight: 600,
                color: item.label === 'Median' ? Theme.colors.light.accent : Theme.colors.light.neutral,
                whiteSpace: 'nowrap'
            }}>
                {item.label}: {item.val.toFixed(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
