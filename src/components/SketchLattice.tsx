import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface SketchLatticeProps {
  width?: number;
  height?: number;
  delay?: number;
  duration?: number;
}

export const SketchLattice: React.FC<SketchLatticeProps> = ({
  width = 800,
  height = 800,
  delay = 0,
  duration = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame: frame - delay, config: { damping: 20 } });

  const spacing = 150;
  const offsetX = (width - 3 * spacing) / 2;
  const offsetY = (height - 3 * spacing) / 2;

  const atoms = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        arr.push({ x: offsetX + i * spacing, y: offsetY + j * spacing });
      }
    }
    return arr;
  }, [offsetX, offsetY, spacing]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    if (progress <= 0) return;

    // Bonds
    atoms.forEach((a, i) => {
      atoms.forEach((b, j) => {
        if (i < j) {
           const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
           if (Math.abs(dist - spacing) < 1) {
              rc.line(a.x, a.y, b.x, b.y, {
                stroke: '#cbd5e1',
                strokeWidth: 2,
                roughness: 1.5,
                opacity: 0.4 * progress,
                seed: 1
              });
           }
        }
      });
    });

    // Atoms
    atoms.forEach(a => {
      rc.circle(a.x, a.y, 20 * progress, {
        fill: Theme.colors.light.text,
        fillStyle: 'solid',
        stroke: Theme.colors.light.text,
        strokeWidth: 1,
        roughness: 1.2,
        seed: 1
      });
    });

    // Moving Electron
    const t = (frame - delay) * 0.1;
    const startIdx = 5;
    const endIdx = 6;
    const start = atoms[startIdx];
    const end = atoms[endIdx];

    const electronX = start.x + (end.x - start.x) * ((Math.sin(t) + 1) / 2);
    const electronY = start.y;

    rc.circle(electronX, electronY, 14 * progress, {
      fill: Theme.colors.light.accent,
      fillStyle: 'solid',
      stroke: Theme.colors.light.accent,
      strokeWidth: 1,
      roughness: 1.5,
      seed: 1
    });

  }, [frame, delay, width, height, progress, atoms, spacing]);

  return (
    <div style={{ position: 'relative', width, height }}>
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
