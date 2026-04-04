import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface DataPoint {
  label: string;
  value: number;
}

interface SketchPieProps {
  data?: DataPoint[];
  title?: string;
  width?: number;
  height?: number;
  delay?: number;
  duration?: number;
}

export const SketchPie: React.FC<SketchPieProps> = ({ 
  data = [
    { label: "Design", value: 35 },
    { label: "Code", value: 45 },
    { label: "Testing", value: 15 },
    { label: "Launch", value: 5 }
  ],
  title = "Resource Allocation",
  width = 800,
  height = 600,
  delay = 0,
  duration = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = [
    Theme.colors.light.accent,
    '#0D9488', // Teal 600
    '#4B5563', // Gray 600
    '#94A3B8', // Slate 400
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);
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

    const cx = width / 2 - 100;
    const cy = height / 2;
    const radius = 150;

    let startAngle = -Math.PI / 2; // Start from top

    data.forEach((d, i) => {
      const targetSliceAngle = (d.value / total) * 2 * Math.PI;
      
      // Calculate individual slice progress
      const sliceDelay = delay + (i * 10);
      const sliceProgress = spring({ 
        fps, 
        frame: frame - sliceDelay, 
        config: { damping: 15, stiffness: 100 } 
      });

      if (sliceProgress > 0) {
        const currentSliceAngle = targetSliceAngle * sliceProgress;
        
        rc.arc(cx, cy, radius * 2, radius * 2, startAngle, startAngle + currentSliceAngle, true, {
          fill: colors[i % colors.length],
          fillOpacity: 0.3,
          fillStyle: 'hachure',
          hachureAngle: i * 45,
          hachureGap: 6,
          stroke: colors[i % colors.length],
          strokeWidth: 2,
          roughness: 1.5,
          seed: 1
        });

        startAngle += currentSliceAngle;
      }
    });

  }, [data, width, height, progress, frame, fps, delay, duration, total]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', top: -40, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={32} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      
      {/* Legend */}
      <div style={{ 
        position: 'absolute', 
        right: 40, 
        top: '50%', 
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {data.map((d, i) => {
          const s = spring({ fps, frame: frame - (delay + i * 15), config: { damping: 12 } });
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 15, opacity: s, transform: `translateX(${(1-s)*20}px)` }}>
              <div style={{ 
                width: 24, 
                height: 24, 
                backgroundColor: colors[i % colors.length],
                borderRadius: 4,
                border: `2px solid ${Theme.colors.light.text}`
              }} />
              <span style={{ fontFamily: 'sans-serif', fontSize: 20, fontWeight: 600, color: Theme.colors.light.text }}>
                {d.label} ({(d.value / total * 100).toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
