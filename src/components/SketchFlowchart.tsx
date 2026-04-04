import React, { useRef, useEffect } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Theme } from '../styles/theme';
import { StaggeredText } from './StaggeredText';

interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'rect' | 'oval' | 'diamond';
}

interface Edge {
  from: string;
  to: string;
}

interface SketchFlowchartProps {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  title?: string;
  fontFamily?: string;
}

export const SketchFlowchart: React.FC<SketchFlowchartProps> = ({
  nodes = [
    { id: "start", x: 150, y: 100, text: "Start", type: "oval" },
    { id: "process", x: 150, y: 250, text: "Process", type: "rect" },
    { id: "decision", x: 450, y: 250, text: "Decision", type: "diamond" },
    { id: "end", x: 450, y: 450, text: "End", type: "oval" }
  ],
  edges = [
    { from: "start", to: "process" },
    { from: "process", to: "decision" },
    { from: "decision", to: "end" }
  ],
  width = 800,
  height = 600,
  color = Theme.colors.light.accent,
  delay = 0,
  duration = 120,
  title = "Flow Logic",
  fontFamily = "sans-serif"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const t = frame - delay;
    if (t < 0) return;

    const nodeW = 140;
    const nodeH = 60;

    const options = {
      seed: 1,
      stroke: Theme.colors.light.text,
      strokeWidth: 2,
      roughness: 1.5,
    };

    const accentOptions = {
        ...options,
        stroke: color,
        fill: color,
        fillOpacity: 0.1,
        fillStyle: 'hachure'
    };

    // Draw nodes
    nodes.forEach((n, i) => {
        const nodeDelay = i * 15;
        const s = spring({ fps, frame: t - nodeDelay, config: { damping: 12 } });
        if (s <= 0) return;

        const x = n.x;
        const y = n.y;
        const w = nodeW * s;
        const h = nodeH * s;

        if (n.type === 'rect') {
            rc.rectangle(x - w/2, y - h/2, w, h, accentOptions);
        } else if (n.type === 'oval') {
            rc.ellipse(x, y, w, h, accentOptions);
        } else if (n.type === 'diamond') {
            rc.polygon([
                [x, y - h/2],
                [x + w/2, y],
                [x, y + h/2],
                [x - w/2, y]
            ], accentOptions);
        }

        // Text
        ctx.save();
        ctx.font = `600 ${20 * s}px ${fontFamily}`;
        ctx.fillStyle = Theme.colors.light.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = s;
        ctx.fillText(n.text, x, y);
        ctx.restore();
    });

    // Draw edges
    edges.forEach((e, i) => {
        const n1 = nodes.find(n => n.id === e.from);
        const n2 = nodes.find(n => n.id === e.to);
        if (!n1 || !n2) return;

        const edgeDelay = nodes.length * 15 + i * 20;
        const progress = interpolate(t, [edgeDelay, edgeDelay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        
        if (progress <= 0) return;

        // Start from node boundaries (approx)
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Offset start/end to not overlap center
        const offset = 40;
        const x1 = n1.x + (dx / dist) * offset;
        const y1 = n1.y + (dy / dist) * offset;
        const x2 = n2.x - (dx / dist) * offset;
        const y2 = n2.y - (dy / dist) * offset;

        const targetX = x1 + (x2 - x1) * progress;
        const targetY = y1 + (y2 - y1) * progress;

        rc.line(x1, y1, targetX, targetY, { ...options, stroke: Theme.colors.light.neutral });

        // Arrowhead
        if (progress >= 1) {
            const angle = Math.atan2(y2 - y1, x2 - x1);
            const headLen = 15;
            rc.line(x2, y2, x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4), options);
            rc.line(x2, y2, x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4), options);
        }
    });

  }, [frame, delay, nodes, edges, width, height, color, fps, fontFamily]);

  return (
    <div style={{ position: 'relative', width, height, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}>
      <div style={{ position: 'absolute', top: -60, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={36} color={Theme.colors.light.text} delay={delay} />
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
