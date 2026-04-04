import React, { useMemo } from "react";
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
  mode?: 'light' | 'dark';
}

export const SketchFlowchart: React.FC<SketchFlowchartProps> = ({
  nodes = [],
  edges = [],
  width = 800,
  height = 600,
  color,
  delay = 0,
  duration = 120,
  title = "Flow Logic",
  fontFamily = "sans-serif",
  mode = 'light'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const accentColor = color || theme.accent;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  const edgeColor = mode === 'dark' ? '#d1d5db' : theme.neutral;

  const t = frame - delay;

  const generator = useMemo(() => rough.generator(), []);

  const nodeW = 140;
  const nodeH = 60;

  const renderedNodes = useMemo(() => {
    return nodes.map((n, i) => {
      const options = {
        seed: 1,
        stroke: textColor,
        strokeWidth: 2,
        roughness: 1.5,
        fill: accentColor,
        fillOpacity: 0.2,
        fillStyle: 'hachure'
      };

      let shape;
      if (n.type === 'rect') {
        shape = generator.rectangle(-nodeW/2, -nodeH/2, nodeW, nodeH, options);
      } else if (n.type === 'oval') {
        shape = generator.ellipse(0, 0, nodeW, nodeH, options);
      } else {
        shape = generator.polygon([
          [0, -nodeH/2],
          [nodeW/2, 0],
          [0, nodeH/2],
          [-nodeW/2, 0]
        ], options);
      }
      return { ...n, shape, delay: i * 15 };
    });
  }, [nodes, theme, accentColor, generator, textColor]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', top: -60, width: '100%', textAlign: 'center' }}>
         <StaggeredText text={title} fontSize={36} color={textColor} delay={delay} />
      </div>
      
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Draw Edges */}
        {edges.map((e, i) => {
          const n1 = nodes.find(n => n.id === e.from);
          const n2 = nodes.find(n => n.id === e.to);
          if (!n1 || !n2) return null;

          const edgeDelay = nodes.length * 15 + i * 20;
          const progress = interpolate(t, [edgeDelay, edgeDelay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          if (progress <= 0) return null;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offset = 40;
          const x1 = n1.x + (dx / dist) * offset;
          const y1 = n1.y + (dy / dist) * offset;
          const x2 = n2.x - (dx / dist) * offset;
          const y2 = n2.y - (dy / dist) * offset;

          const targetX = x1 + (x2 - x1) * progress;
          const targetY = y1 + (y2 - y1) * progress;

          const line = generator.line(x1, y1, targetX, targetY, { stroke: edgeColor, strokeWidth: 2, roughness: 1, seed: i });
          
          return (
            <g key={`edge-${i}`}>
              {generator.toPaths(line).map((p, pi) => <path key={pi} d={p.d} stroke={edgeColor} fill="none" />)}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {renderedNodes.map((n, i) => {
          const s = spring({ fps, frame: t - n.delay, config: { damping: 12 } });
          if (s <= 0) return null;

          return (
            <g key={n.id} transform={`translate(${n.x}, ${n.y}) scale(${s})`}>
              {generator.toPaths(n.shape).map((p, pi) => (
                <path key={pi} d={p.d} stroke={textColor} fill={p.fill || 'none'} strokeWidth={2} />
              ))}
              <text 
                textAnchor="middle" 
                dominantBaseline="auto" 
                fill={textColor} 
                y={-nodeH/2 - 12}
                style={{ fontFamily, fontSize: 24, fontWeight: 900, pointerEvents: 'none' }}
              >
                {n.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
