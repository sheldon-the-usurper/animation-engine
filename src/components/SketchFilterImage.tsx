import React, { useEffect, useRef, useState } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { JitterGroup } from './JitterGroup';

interface SketchFilterImageProps {
  src: string;
  width?: number;
  height?: number;
  delay?: number;
  edgeStrength?: number; // Adjusts the "pencil" darkness
}

export const SketchFilterImage: React.FC<SketchFilterImageProps> = ({
  src,
  width = 800,
  height = 600,
  delay = 0,
  edgeStrength = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const s = spring({
    fps,
    frame: frame - delay,
    config: { damping: 14, stiffness: 100 },
  });

  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.95, 1]);

  useEffect(() => {
    const img = new Image();
    img.src = staticFile(src);
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
  }, [src]);

  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = imgRef.current;
    
    // Cover fit logic
    const scaleFactor = Math.max(width / img.width, height / img.height);
    const w = img.width * scaleFactor;
    const h = img.height * scaleFactor;
    const x = (width - w) / 2;
    const y = (height - h) / 2;

    // Draw original image to canvas first to get data
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, x, y, w, h);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Grayscale
    const gray = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // 2. Invert
    const inverted = gray.map(v => 255 - v);

    // 3. Simple Box Blur
    const blur = (src: Uint8ClampedArray) => {
      const out = new Uint8ClampedArray(src.length);
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              sum += src[(y + ky) * width + (x + kx)];
            }
          }
          out[y * width + x] = sum / 9;
        }
      }
      return out;
    };

    const blurred = blur(inverted);

    // 4. Color Dodge Blend
    const sketch = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      // dodge = (base * 255) / (255 - blend)
      sketch[i] = Math.min(255, (gray[i] * 255) / (255 - blurred[i] + 1));
    }

    // 5. Combine with color
    const out = ctx.createImageData(width, height);
    for (let i = 0; i < sketch.length; i++) {
      const idx = i * 4;
      const factor = (sketch[i] / 255) * edgeStrength;
      
      out.data[idx] = data[idx] * factor;
      out.data[idx + 1] = data[idx + 1] * factor;
      out.data[idx + 2] = data[idx + 2] * factor;
      out.data[idx + 3] = 255;
    }

    ctx.putImageData(out, 0, 0);
  }, [imageLoaded, width, height, edgeStrength]);

  return (
    <div style={{ 
      width, 
      height, 
      opacity, 
      transform: `scale(${scale})`,
      position: 'relative' 
    }}>
      <JitterGroup amount={1.5}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width,
            height,
            borderRadius: 12,
            border: '4px solid #fde047',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            background: '#4a4a44'
          }}
        />
      </JitterGroup>
    </div>
  );
};
