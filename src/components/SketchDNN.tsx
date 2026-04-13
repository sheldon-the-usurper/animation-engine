import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchDNNProps {
  width?: number;
  height?: number;
  delay?: number;
  duration?: number;
  layers?: number[];
  mode?: 'light' | 'dark';
}

export const SketchDNN: React.FC<SketchDNNProps> = ({
  width = 900,
  height = 600,
  delay = 0,
  duration = 180,
  layers = [3, 4, 4, 2],
  mode = 'light'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;

  const progress = spring({ fps, frame: frame - delay, config: { damping: 20 } });

  const layerGap = width / (layers.length + 1);
  const positions = useMemo(() => {
    return layers.map((count, i) => {
      const x = (i + 1) * layerGap;
      const gapY = height / (count + 1);
      return Array.from({ length: count }, (_, j) => ({
        x,
        y: (j + 1) * gapY
      }));
    });
  }, [layers, width, height, layerGap]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    if (progress <= 0) return;

    // 1. Draw Connections (Weights)
    positions.forEach((layer, i) => {
      if (i === positions.length - 1) return;
      layer.forEach(a => {
        positions[i + 1].forEach(b => {
          rc.line(a.x, a.y, b.x, b.y, {
            stroke: theme.neutral,
            strokeWidth: 1,
            roughness: 1,
            opacity: 0.3 * progress,
            seed: 1
          });
        });
      });
    });

    // 2. Draw Nodes (Neurons)
    positions.forEach((layer, i) => {
      const isOutput = i === layers.length - 1;
      layer.forEach(node => {
        rc.circle(node.x, node.y, 18 * progress, {
          fill: isOutput ? theme.accent : theme.text,
          fillStyle: 'solid',
          stroke: theme.text,
          strokeWidth: 1.5,
          roughness: 1.5,
          seed: 1
        });
      });
    });

    // 3. Draw Signal Flow (Pulses)
    const t = (frame - delay) % 60;
    const pulseProgress = t / 60;

    positions.forEach((layer, i) => {
      if (i === positions.length - 1) return;
      
      // Animate a few signals per layer for visual density
      const pathIndices = [[0, 0], [1, 2], [2, 1]]; 
      pathIndices.forEach(([startIdx, endIdx]) => {
          const a = layer[startIdx % layer.length];
          const b = positions[i + 1][endIdx % positions[i+1].length];
          
          const px = a.x + (b.x - a.x) * pulseProgress;
          const py = a.y + (b.y - a.y) * pulseProgress;

          rc.circle(px, py, 10 * progress, {
            fill: theme.accent,
            fillStyle: 'solid',
            stroke: theme.accent,
            strokeWidth: 1,
            roughness: 1,
            opacity: interpolate(pulseProgress, [0, 0.8, 1], [0, 1, 0]),
            seed: 1
          });
      });
    });

  }, [frame, delay, width, height, progress, positions, layers, theme]);

  return (
    <div style={{ position: 'relative', width, height }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
