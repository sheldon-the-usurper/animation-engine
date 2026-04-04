import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface SketchMonitorProps {
  delay?: number;
  mode?: 'light' | 'dark';
}

export const SketchMonitor: React.FC<SketchMonitorProps> = ({ delay = 0, mode = 'dark' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const t = frame - delay;
  const scale = spring({ fps, frame: t, config: { damping: 12 } });

  // Staggered text reveal logic
  const text1 = t > 20 ? "> booting..." : "";
  const text2 = t > 40 ? "> loading..." : "";
  const text3 = t > 60 ? "> ready" : "";

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${scale})`,
    },
    monitor: {
      padding: "12px",
      borderRadius: "16px",
      background: mode === 'dark' ? "#333" : "#cbd5e1",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    screen: {
      width: "360px",
      height: "240px",
      background: "#000",
      color: "#00ff88",
      fontFamily: "monospace",
      fontSize: "18px",
      padding: "20px",
      borderRadius: "4px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      overflow: "hidden",
    },
    stand: {
      width: "70px",
      height: "10px",
      background: mode === 'dark' ? "#444" : "#94a3b8",
      marginTop: "4px",
    },
    base: {
      width: "120px",
      height: "10px",
      background: mode === 'dark' ? "#222" : "#64748b",
      borderRadius: "4px",
    },
  };

  if (scale <= 0) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.monitor}>
        <div style={styles.screen}>
          <p style={{ margin: 0 }}>{text1}</p>
          <p style={{ margin: 0 }}>{text2}</p>
          <p style={{ margin: 0 }}>{text3}</p>
        </div>
      </div>
      <div style={styles.stand} />
      <div style={styles.base} />
    </div>
  );
};
