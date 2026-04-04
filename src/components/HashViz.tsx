import React, { useMemo, useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface HashVizProps {
  width?: number;
  height?: number;
  delay?: number;
  mode?: 'light' | 'dark';
}

export const HashViz: React.FC<HashVizProps> = ({
  width = 400,
  height = 200,
  delay = 0,
  mode = 'dark'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const t = Math.max(0, (frame - delay) * 0.4);

  const fakeHash = (val: number) => {
    return Math.abs(Math.sin(val) * 1e9).toString(16).slice(0, 12);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // flowing bits
    ctx.font = "14px monospace";
    for (let i = 0; i < 20; i++) {
      const x = (i * 25 + (t * 80) % (width * 0.4)) - 40;
      const y = height / 2 + Math.sin(i + t * 0.2) * 15;
      const val = (i + Math.floor(t * 0.5)) % 2;

      if (x < width * 0.35) {
        ctx.fillStyle = mode === 'dark' ? "#2dd4bf" : "#0F766E";
        ctx.fillText(val.toString(), x, y);
      }
    }

    // hash box
    const boxW = width * 0.25;
    const boxH = height * 0.6;
    const boxX = width * 0.35;
    const boxY = (height - boxH) / 2;

    const grad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
    grad.addColorStop(0, mode === 'dark' ? "#1f2937" : "#f1f5f9");
    grad.addColorStop(1, mode === 'dark' ? "#111827" : "#e2e8f0");

    ctx.fillStyle = grad;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = mode === 'dark' ? "#2dd4bf" : "#0F766E";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = mode === 'dark' ? "#2dd4bf" : "#0F766E";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("HASH", boxX + boxW / 2, boxY + boxH / 2 + 6);

    // output stream
    const hash = fakeHash(Math.floor(t / 4));
    ctx.fillStyle = "#fb923c"; // Orange for hash output
    ctx.textAlign = "left";
    for (let i = 0; i < hash.length; i++) {
      ctx.fillText(hash[i], boxX + boxW + 20 + i * 10, height / 2 + Math.sin(i + t * 0.3) * 5);
    }

    // flow particles
    const px = boxX - 30 + ((t * 50) % 30);
    ctx.fillStyle = mode === 'dark' ? "#2dd4bf" : "#0F766E";
    ctx.fillRect(px, height / 2 - 2, 4, 4);

    const px2 = boxX + boxW + 5 + ((t * 50) % 30);
    ctx.fillStyle = "#fb923c";
    ctx.fillRect(px2, height / 2 - 2, 4, 4);

  }, [t, mode, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
