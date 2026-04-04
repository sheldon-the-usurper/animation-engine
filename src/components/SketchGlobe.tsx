import React, { useRef, useEffect, useMemo } from "react";
import rough from 'roughjs/bin/rough';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { Theme } from '../styles/theme';
import worldData from '../data/world.json';

interface SketchGlobeProps {
  size?: number;
  delay?: number;
  duration?: number;
}

export const SketchGlobe: React.FC<SketchGlobeProps> = ({ 
  size = 600, 
  delay = 0,
  duration = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame: frame - delay, config: { damping: 20 } });
  const R = (size / 2) * 0.8;
  const rot = (frame - delay) * 0.5; // Rotation speed

  const features = useMemo(() => (worldData as any).features, []);

  function project(lat: number, lon: number, rotation: number) {
    const phi = lat * Math.PI / 180;
    const lambda = (lon + rotation) * Math.PI / 180;

    const x = Math.cos(phi) * Math.sin(lambda);
    const y = Math.sin(phi);
    const z = Math.cos(phi) * Math.cos(lambda);

    return { x, y, visible: z > 0 };
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    if (progress <= 0) return;

    const cx = size / 2;
    const cy = size / 2;

    // 1. Draw Ocean (Sphere base)
    rc.circle(cx, cy, R * 2 * progress, {
      fill: '#f0f9ff',
      fillStyle: 'solid',
      stroke: Theme.colors.light.accent,
      strokeWidth: 2,
      roughness: 1.5,
      seed: 1
    });

    // 2. Draw Land Polygons
    ctx.save();
    // Clip land to the sphere
    ctx.beginPath();
    ctx.arc(cx, cy, R * progress, 0, Math.PI * 2);
    ctx.clip();

    const landOptions = {
      fill: Theme.colors.light.accent,
      fillOpacity: 0.4,
      fillStyle: 'hachure',
      hachureAngle: 60,
      hachureGap: 4,
      stroke: Theme.colors.light.accent,
      strokeWidth: 1,
      roughness: 1,
      seed: 1
    };

    features.forEach((f: any) => {
      const geom = f.geometry;
      const drawCoords = (coords: number[][]) => {
        const points: [number, number][] = [];
        coords.forEach(([lon, lat]) => {
          const p = project(lat, lon, rot);
          if (p.visible) {
            points.push([cx + p.x * R * progress, cy - p.y * R * progress]);
          } else {
            // If part of the polygon is hidden, we should ideally clip it,
            // but for a sketchy look, just breaking the path works okay-ish
            if (points.length > 1) {
                rc.polygon(points as any, landOptions);
                points.length = 0;
            }
          }
        });
        if (points.length > 2) {
          rc.polygon(points as any, landOptions);
        }
      };

      if (geom.type === "Polygon") {
        geom.coordinates.forEach((ring: number[][]) => drawCoords(ring));
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => drawCoords(ring));
        });
      }
    });

    ctx.restore();

    // 3. Draw Graticules (Lat/Lon lines)
    for (let i = -90; i <= 90; i += 30) {
        // Draw some simple arcs or circles would be complex, 
        // let's just stick to the sketchy land for now to keep performance high at 60fps
    }

  }, [frame, progress, rot, size, features, R]);

  return (
    <div style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}>
        <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
};
