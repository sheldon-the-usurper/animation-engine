import React, { useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, interpolate } from 'remotion';
import { Theme } from '../styles/theme';

interface Equation {
  fn: string;
  color: string;
  label: string;
}

interface SketchGraphProps {
  equations: Equation[];
  width?: number;
  height?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  mode?: 'light' | 'dark';
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SketchGraph: React.FC<SketchGraphProps> = ({ 
  equations = [],
  width = 600,
  height = 400,
  scale = 40,
  delay = 0,
  duration = 60,
  mode = 'light',
  xAxisLabel = "n (Input Size)",
  yAxisLabel = "Time"
}) => {
  const frame = useCurrentFrame();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const axisColor = mode === 'dark' ? '#ffffff' : theme.neutral;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;

  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const generator = useMemo(() => rough.generator(), []);

  const axesAndPoints = useMemo(() => {
    // Axes
    const xAxis = generator.line(50, height - 50, width - 20, height - 50, { 
        stroke: axisColor, strokeWidth: 2, roughness: 1, seed: 1
    });
    const yAxis = generator.line(50, 20, 50, height - 50, { 
        stroke: axisColor, strokeWidth: 2, roughness: 1, seed: 1
    });

    const allPoints = (equations || []).map(eq => {
        const points: [number, number][] = [];
        const resolution = 4;
        // Start from x=0 at the left axis (50px offset)
        for (let px = 50; px <= width - 20; px += resolution) {
            const x = (px - 50) / scale;
            let y;
            try {
                y = eval(eq.fn.replace(/x/g, `(${x})`));
            } catch { continue; }
            
            const py = (height - 50) - y * scale;
            if (py > -height && py < height * 2) {
                points.push([px, py]);
            }
        }
        return points;
    });

    return { xAxis, yAxis, allPoints };
  }, [equations, width, height, scale, axisColor, generator]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* Legend */}
      <div style={{ position: 'absolute', top: 20, left: 70, display: 'flex', flexDirection: 'column', gap: 10, background: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 8 }}>
         {(equations || []).map((eq, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <div style={{ width: 20, height: 4, background: eq.color }} />
                 <span style={{ color: textColor, fontSize: 18, fontWeight: 'bold', fontFamily: 'Architects Daughter' }}>{eq.label}</span>
             </div>
         ))}
      </div>

      {/* Axis Labels */}
      <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', color: axisColor, fontFamily: 'Architects Daughter', fontSize: 20 }}>
        {xAxisLabel}
      </div>
      <div style={{ position: 'absolute', top: height/2, left: -60, transform: 'rotate(-90deg)', color: axisColor, fontFamily: 'Architects Daughter', fontSize: 20 }}>
        {yAxisLabel}
      </div>

      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <path d={generator.toPaths(axesAndPoints.xAxis)[0].d} stroke={axisColor} fill="none" strokeWidth={2} />
        <path d={generator.toPaths(axesAndPoints.yAxis)[0].d} stroke={axisColor} fill="none" strokeWidth={2} />
        
        {axesAndPoints.allPoints.map((pts, i) => {
            const visibleCount = Math.floor(pts.length * progress);
            const visiblePts = pts.slice(0, visibleCount);
            if (visiblePts.length < 2) return null;
            
            const curve = generator.curve(visiblePts, { 
                stroke: equations[i].color, strokeWidth: 4, roughness: 1.2, seed: 1
            });
            return generator.toPaths(curve).map((p, pi) => (
                <path key={`${i}-${pi}`} d={p.d} stroke={equations[i].color} strokeWidth={4} fill="none" />
            ));
        })}
      </svg>
    </div>
  );
}
