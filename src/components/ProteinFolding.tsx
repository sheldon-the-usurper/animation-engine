import React, { useMemo, useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface ProteinFoldingProps {
  width?: number;
  height?: number;
  delay?: number;
  mode?: 'light' | 'dark';
}

export const ProteinFolding: React.FC<ProteinFoldingProps> = ({
  width = 400,
  height = 300,
  delay = 0,
  mode = 'dark'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  
  const t = Math.max(0, frame - delay);

  // Deterministic simulation for frame 't'
  const points = useMemo(() => {
    const N = 70; 
    const amino = ["A","V","L","I","G","S","T","D","E","K","R","F","Y","W"];
    const pts = Array.from({ length: N }, (_, i) => ({
      x: width / 2 + (i - N/2) * 4,
      y: height / 2,
      vx: 0,
      vy: 0,
      type: amino[i % amino.length]
    }));

    const restLen = 7;
    
    // Simulate steps up to current frame t
    // To avoid O(T^2) across the whole video, we limit total simulation steps
    // or just accept it for short durations.
    for (let step = 0; step < t; step++) {
       for (let i = 0; i < N; i++) {
         const p = pts[i];
         // Deterministic jitter
         const angle = (i * 1.37 + step * 0.15) % (Math.PI * 2);
         p.vx += Math.cos(angle) * 0.2;
         p.vy += Math.sin(angle) * 0.2;

         const cx = width / 2;
         const cy = height / 2;
         p.vx += (cx - p.x) * 0.0003;
         p.vy += (cy - p.y) * 0.0003;
       }

       for (let i = 0; i < N - 1; i++) {
         const a = pts[i];
         const b = pts[i + 1];
         const dx = b.x - a.x;
         const dy = b.y - a.y;
         const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
         const force = (dist - restLen) * 0.25;
         const fx = (dx / dist) * force;
         const fy = (dy / dist) * force;
         a.vx += fx; a.vy += fy;
         b.vx -= fx; b.vy -= fy;
       }

       for (let i = 1; i < N - 1; i++) {
         const prev = pts[i - 1];
         const curr = pts[i];
         const next = pts[i + 1];
         const midX = (prev.x + next.x) / 2;
         const midY = (prev.y + next.y) / 2;
         curr.vx += (midX - curr.x) * 0.03;
         curr.vy += (midY - curr.y) * 0.03;
       }

       for (let i = 0; i < N; i++) {
         for (let j = i + 2; j < N; j++) {
           const a = pts[i];
           const b = pts[j];
           const dx = b.x - a.x;
           const dy = b.y - a.y;
           const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
           if (dist < 12) {
             const repel = (12 - dist) * 0.08;
             const fx = (dx / dist) * repel;
             const fy = (dy / dist) * repel;
             a.vx -= fx; a.vy -= fy;
             b.vx += fx; b.vy += fy;
           }
         }
       }

       for (let p of pts) {
         p.vx *= 0.91;
         p.vy *= 0.91;
         p.x += p.vx;
         p.y += p.vy;
       }
    }
    return pts;
  }, [t, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // backbone
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = mode === 'dark' ? "#2dd4bf" : "#0F766E";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // residues
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = mode === 'dark' ? "#5eead4" : "#14b8a6";
      ctx.fill();

      if (i % 6 === 0) {
        ctx.fillStyle = mode === 'dark' ? "#ffffff" : "#1a2e2c";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.type, p.x, p.y - 10);
      }
    }
  }, [points, mode, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ filter: 'drop-shadow(0 0 10px rgba(45, 212, 191, 0.2))' }} />;
};
