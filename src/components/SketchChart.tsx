import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Theme } from '../styles/theme';
import { PathReveal } from './PathReveal';
import { JitterGroup } from './JitterGroup';
import { StaggeredText } from './StaggeredText';

interface DataPoint {
  label: string;
  value: number;
}

interface SketchChartProps {
  data: DataPoint[];
  type: 'line' | 'bar';
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
  duration?: number;
  title?: string;
  maxValue?: number;
  showAxes?: boolean;
}

export const SketchChart: React.FC<SketchChartProps> = ({
  data,
  type,
  width = 600,
  height = 400,
  color = Theme.colors.teal,
  delay = 0,
  duration = 60,
  title,
  maxValue,
  showAxes = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const effectiveMaxValue = maxValue || Math.max(...data.map(d => d.value)) * 1.1;
  const yScale = chartHeight / effectiveMaxValue;
  const xScale = chartWidth / (data.length - (type === 'line' ? 1 : 0));

  const points = useMemo(() => {
    return data.map((d, i) => ({
      x: padding + (type === 'line' ? i * xScale : (i + 0.5) * (chartWidth / data.length)),
      y: height - padding - d.value * yScale,
    }));
  }, [data, type, xScale, yScale, width, height, chartWidth]);

  // Generate path for line chart
  const linePath = useMemo(() => {
    if (type !== 'line') return '';
    return points.reduce((path, p, i) => 
      i === 0 ? `M ${p.x},${p.y}` : `${path} L ${p.x},${p.y}`, 
    '');
  }, [points, type]);

  // Animation progress
  const progress = interpolate(
    frame,
    [delay, delay + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{ width, height, position: 'relative' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sketchy-displace-chart">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {title && (
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <StaggeredText text={title} color={Theme.colors.light.text} fontSize={24} fontWeight={800} delay={delay} />
        </div>
      )}

      <JitterGroup seed="chart-jitter" amount={1} rotation={0.2}>
        <svg width={width} height={height} style={{ overflow: 'visible', filter: 'url(#sketchy-displace-chart)' }}>
          {/* Axes */}
          {showAxes && (
            <g opacity={0.6}>
              {/* Y Axis */}
              <PathReveal 
                d={`M ${padding},${padding/2} L ${padding},${height - padding + 10}`} 
                color={Theme.colors.light.neutral} 
                strokeWidth={2} 
                delay={delay} 
                duration={duration * 0.3} 
              />
              {/* X Axis */}
              <PathReveal 
                d={`M ${padding - 10},${height - padding} L ${width - padding/2},${height - padding}`} 
                color={Theme.colors.light.neutral} 
                strokeWidth={2} 
                delay={delay + duration * 0.1} 
                duration={duration * 0.3} 
              />
            </g>
          )}

          {/* Line Chart */}
          {type === 'line' && (
            <PathReveal 
              d={linePath} 
              color={color} 
              strokeWidth={4} 
              delay={delay + duration * 0.3} 
              duration={duration * 0.7} 
            />
          )}

          {/* Bar Chart */}
          {type === 'bar' && data.map((d, i) => {
            const barWidth = (chartWidth / data.length) * 0.7;
            const barX = points[i].x - barWidth / 2;
            const barY = points[i].y;
            const barH = height - padding - barY;
            
            // Hand-drawn bar path
            const barProgress = interpolate(
              frame,
              [delay + duration * 0.3 + (i * duration * 0.1), delay + duration * 0.6 + (i * duration * 0.1)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const h = barH * barProgress;
            const y = height - padding - h;
            
            const p = `M ${barX},${height - padding} 
                       L ${barX + 2},${y} 
                       L ${barX + barWidth - 2},${y + 1} 
                       L ${barX + barWidth},${height - padding} Z`;

            return (
              <path 
                key={i}
                d={p}
                fill={color}
                fillOpacity={0.2}
                stroke={color}
                strokeWidth={3}
                opacity={barProgress}
              />
            );
          })}

          {/* Data Points (Dots) for Line Chart */}
          {type === 'line' && points.map((p, i) => {
            const pointProgress = interpolate(
              frame,
              [delay + duration * 0.3 + (i * duration * 0.1), delay + duration * 0.4 + (i * duration * 0.1)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <circle 
                key={i}
                cx={p.x}
                cy={p.y}
                r={6}
                fill={color}
                opacity={pointProgress}
              />
            );
          })}
        </svg>
      </JitterGroup>

      {/* X-Axis Labels */}
      <div style={{ 
        position: 'absolute', 
        bottom: padding / 2, 
        left: padding, 
        width: chartWidth, 
        display: 'flex', 
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {data.map((d, i) => (
          <div key={i} style={{ width: chartWidth / data.length, textAlign: 'center' }}>
            <StaggeredText 
              text={d.label} 
              color={Theme.colors.light.neutral} 
              fontSize={14} 
              delay={delay + duration * 0.5 + i * 5} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
