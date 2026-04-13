import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useVideoConfig, spring, staticFile, Audio, useCurrentFrame, interpolate, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import rough from 'roughjs/bin/rough';
import { Theme } from '../styles/theme';
import { Brain, Cpu, Database, Network, TrendingUp, History, Lightbulb, Beaker, ShieldAlert, Layers, GitBranch, Target, Search, Eye } from 'lucide-react';

import { DrawnIcon } from '../components/DrawnIcon';
import { SketchyBox } from '../components/SketchyBox';
import { MarkerHighlight } from '../components/MarkerHighlight';
import { ScribbleText } from '../components/ScribbleText';
import { SketchChart } from '../components/SketchChart';
import { StaggeredText } from '../components/StaggeredText';
import { JitterGroup } from '../components/JitterGroup';
import { SketchDNN } from '../components/SketchDNN';
import { SketchGraph } from '../components/SketchGraph';
import { SketchMonitor } from '../components/SketchMonitor';
import { SketchFlowchart } from '../components/SketchFlowchart';
import { SketchImage } from '../components/SketchImage';

const PADDING = 80;
const TRANSITION_DURATION = 20;
const SCENE_START_DELAY = 10;

const getKANTheme = (mode: 'light' | 'dark') => {
  if (mode === 'dark') return Theme.colors.dark;
  return {
    ...Theme.colors.light,
    paper: '#4a4a44',   // Dark gray-brown background
    text: '#ffffff',    // White text
    accent: '#fde047',  // Yellow accent
    border: '#fde047',  // Yellow border
    neutral: '#cbd5e1', // Light gray
  };
};

const SketchbookPaper: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  const theme = getKANTheme(mode);

  useEffect(() => {
    if (canvasRef.current) {
      const rc = rough.canvas(canvasRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = theme.paper;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [width, height, theme]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', zIndex: -10 }} />;
};

const Watermark: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const opacity = mode === 'dark' ? 0.8 : 0.7;
  // KAN always uses a dark-ish background (even in its 'light' mode), so we always use logo-dark.svg
  const logo = 'logo-dark.svg';
  return (
    <div style={{ position: 'absolute', top: 60, right: 60, opacity, zIndex: 100 }}>
        <img src={staticFile(logo)} style={{ width: 100, height: 100 }} alt="EulerFold Logo" />
    </div>
  );
};

const SceneTitle: React.FC<{ text: string; mode: 'light' | 'dark'; subtitle?: string; fontSize?: number; marginTop?: number; nowrap?: boolean }> = ({ text, mode, subtitle, fontSize = 70, marginTop = 60, nowrap = false }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40, marginTop }}>
      <ScribbleText
        text={text}
        fontSize={fontSize}
        color={textColor}
        delay={SCENE_START_DELAY}
        duration={30}
        style={nowrap ? { flexWrap: 'nowrap', whiteSpace: 'nowrap' } : {}}
      />
      {subtitle && (
        <div style={{ marginTop: 10 }}>
           <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 30} duration={30} opacity={0.2}>
              <span style={{ fontSize: 32, color: theme.neutral, fontWeight: 500 }}>{subtitle}</span>
           </MarkerHighlight>
        </div>
      )}
    </div>
  );
};

const SplineVisualizer: React.FC<{ width: number; height: number; mode: 'light' | 'dark'; delay: number }> = ({ width, height, mode, delay }) => {
  const frame = useCurrentFrame();
  const theme = getKANTheme(mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const rc = rough.canvas(canvasRef.current);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    const t = frame - delay;
    if (t < 0) return;
    
    const progress = interpolate(t, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
    
    // Control points
    const pts: [number, number][] = [
      [50, height - 50],
      [width * 0.25, height * 0.2],
      [width * 0.5, height * 0.8],
      [width * 0.75, height * 0.1],
      [width - 50, height - 50]
    ];
    
    // Draw grid/segments
    for (let i = 0; i < 5; i++) {
      const x = 50 + (width - 100) * (i / 4);
      rc.line(x, 20, x, height - 20, { stroke: theme.neutral, strokeWidth: 1, opacity: 0.1, seed: i });
    }

    // Draw Spline Curve
    const curvePoints = pts.slice(0, Math.max(2, Math.floor(pts.length * progress)));
    if (curvePoints.length >= 2) {
      rc.curve(curvePoints, { stroke: theme.accent, strokeWidth: 5, roughness: 1.2, seed: 1 });
    }
    
    // Draw Control Points (Knots)
    pts.forEach((p, i) => {
      const s = spring({ frame: t - i * 10, fps: 30, config: { damping: 12 } });
      if (s > 0) {
        rc.circle(p[0], p[1], 15 * s, { fill: theme.accent, fillStyle: 'solid', seed: i });
        if (i < pts.length - 1) {
            ctx.font = '20px Architects Daughter';
            ctx.fillStyle = theme.neutral;
            ctx.fillText(`Knot ${i}`, p[0] - 20, p[1] + 35);
        }
      }
    });
    
  }, [frame, delay, width, height, theme]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

// Scene 1: Hook
const HookScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="Kolmogorov–Arnold Networks" mode={mode} subtitle="The Question Nobody Was Asking" fontSize={60} marginTop={40} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: -40 }}>
        <div style={{ width: 1200, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img 
            src={staticFile('kan_intro.png')} 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            alt="KAN Intro" 
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 10 }}>
           <ScribbleText text="A New Architecture." fontSize={54} color={textColor} delay={SCENE_START_DELAY + 140} />
           <ScribbleText text="A 70-Year-Old Theorem." fontSize={54} color={theme.accent} delay={SCENE_START_DELAY + 170} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: MLP Background
const MLPBackgroundScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  const boxBg = 'rgba(255,255,255,0.05)';
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="What Even Is an MLP?" mode={mode} subtitle="Multi-Layer Perceptrons (The Default)" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
         <SketchDNN layers={[3, 5, 5, 2]} width={850} height={550} delay={SCENE_START_DELAY + 20} mode="dark" />
         <div style={{ width: 450, display: 'flex', flexDirection: 'column', gap: 30 }}>
            <div style={{ padding: 25, borderLeft: `6px solid ${theme.accent}`, background: boxBg }}>
               <ScribbleText text="Weights on Edges" fontSize={36} color={theme.accent} delay={SCENE_START_DELAY + 50} />
               <StaggeredText text="Learned scalars that scale the signal." fontSize={26} color={textColor} delay={SCENE_START_DELAY + 70} />
            </div>
            <div style={{ padding: 25, borderLeft: `6px solid ${theme.neutral}`, background: boxBg }}>
               <ScribbleText text="Activations on Nodes" fontSize={36} color={theme.neutral} delay={SCENE_START_DELAY + 90} />
               <StaggeredText text="Fixed functions (ReLU) that never change." fontSize={26} color={textColor} delay={SCENE_START_DELAY + 110} />
            </div>
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Math Origin
const MathOriginScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The 70-Year-Old Theorem" mode={mode} subtitle="Kolmogorov-Arnold Representation Theorem" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <SketchyBox width={300} height={400} mode="dark" delay={SCENE_START_DELAY + 20}>
               <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                   <DrawnIcon icon={History} size={100} color={theme.accent} delay={SCENE_START_DELAY + 40} />
                   <ScribbleText text="1950s" fontSize={44} color={textColor} delay={SCENE_START_DELAY + 60} />
               </div>
            </SketchyBox>
            <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GitBranch color={theme.accent} size={80} />
            </div>
            <SketchyBox width={850} height={400} mode="dark" delay={SCENE_START_DELAY + 100}>
               <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 30, gap: 15 }}>
                  <StaggeredText text="f(x₁, ..., xₙ) = Σ φ(Σ ψ(xᵢ))" fontSize={54} fontWeight={900} color={theme.accent} delay={SCENE_START_DELAY + 120} />
                  <StaggeredText text="Any multivariate function can be decomposed into 1D functions." fontSize={32} color={textColor} delay={SCENE_START_DELAY + 150} />
               </div>
            </SketchyBox>
        </div>
        <MarkerHighlight color="#f87171" delay={SCENE_START_DELAY + 200} opacity={0.3}>
            <span style={{ fontSize: 32, color: "#ffffff", fontWeight: 'bold' }}>Fractal Nightmare vs. Physical Smoothness</span>
        </MarkerHighlight>
      </div>
    </AbsoluteFill>
  );
};

const ArchitectureSVG: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  return (
    <svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', fontFamily: 'Architects Daughter, cursive' }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={theme.neutral}/>
        </marker>
        <mask id="imagine-text-gaps-i8o3r0" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="760" height="380" fill="white"/>
          <rect x="171.6" y="13.8" width="36.8" height="19.5" fill="black" rx="2"/>
          <rect x="120" y="33.2" width="140" height="17.5" fill="black" rx="2"/>
          <rect x="43.2" y="113.9" width="33.6" height="14.8" fill="black" rx="2"/>
          <rect x="43.2" y="193.9" width="33.6" height="14.8" fill="black" rx="2"/>
          <rect x="43.2" y="273.9" width="33.6" height="14.8" fill="black" rx="2"/>
          <rect x="173.2" y="143.9" width="33.6" height="14.8" fill="black" rx="2"/>
          <rect x="173.2" y="243.9" width="33.6" height="14.8" fill="black" rx="2"/>
          <rect x="125.3" y="154.9" width="16.1" height="14.8" fill="black" rx="2"/>
          <rect x="255.3" y="174.9" width="16.1" height="14.8" fill="black" rx="2"/>
          <rect x="550.6" y="12.5" width="38.8" height="20.9" fill="black" rx="2"/>
          <rect x="488" y="33.2" width="164" height="17.5" fill="black" rx="2"/>
          <rect x="432" y="111.2" width="16.1" height="18.2" fill="black" rx="2"/>
          <rect x="432" y="191.2" width="16.1" height="18.2" fill="black" rx="2"/>
          <rect x="432" y="271.2" width="16.1" height="18.2" fill="black" rx="2"/>
          <rect x="562" y="141.2" width="16.1" height="18.2" fill="black" rx="2"/>
          <rect x="562" y="241.2" width="16.1" height="18.2" fill="black" rx="2"/>
          <rect x="497.8" y="122.9" width="24.3" height="14.1" fill="black" rx="2"/>
          <rect x="497.8" y="220.9" width="24.3" height="14.1" fill="black" rx="2"/>
          <rect x="632.8" y="190.9" width="24.3" height="14.1" fill="black" rx="2"/>
          <rect x="432" y="313.5" width="66.4" height="16.2" fill="black" rx="2"/>
          <rect x="542" y="313.5" width="108" height="16.2" fill="black" rx="2"/>
          <rect x="18" y="112.5" width="17.5" height="16.2" fill="black" rx="2"/>
          <rect x="18" y="192.5" width="17.8" height="16.2" fill="black" rx="2"/>
          <rect x="18" y="272.5" width="18" height="16.2" fill="black" rx="2"/>
          <rect x="396" y="112.5" width="17.5" height="16.2" fill="black" rx="2"/>
          <rect x="396" y="192.5" width="17.8" height="16.2" fill="black" rx="2"/>
          <rect x="396" y="272.5" width="18" height="16.2" fill="black" rx="2"/>
          <rect x="328" y="192.5" width="14.1" height="16.2" fill="black" rx="2"/>
          <rect x="708" y="192.5" width="14.1" height="16.2" fill="black" rx="2"/>
        </mask>
      </defs>

      {/* MLP side */}
      <text x="190" y="28" textAnchor="middle" fontSize="15" fontWeight="500" fill={theme.text}>MLP</text>
      <text x="190" y="46" textAnchor="middle" fontSize="12" fill={theme.neutral}>fixed activation on nodes</text>

      {/* MLP nodes layer 1 */}
      <g>
        <ellipse cx="60" cy="120" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>
        <ellipse cx="60" cy="200" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>
        <ellipse cx="60" cy="280" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>
      </g>
      {/* MLP nodes layer 2 */}
      <g>
        <ellipse cx="190" cy="150" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>
        <ellipse cx="190" cy="250" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>
      </g>
      {/* MLP output node */}
      <ellipse cx="320" cy="200" rx="22" ry="22" fill="transparent" stroke={theme.neutral} strokeWidth="2"/>

      {/* MLP activation labels on nodes */}
      <text x="60" y="124" textAnchor="middle" fontSize="10" fill={theme.text}>ReLU</text>
      <text x="60" y="204" textAnchor="middle" fontSize="10" fill={theme.text}>ReLU</text>
      <text x="60" y="284" textAnchor="middle" fontSize="10" fill={theme.text}>ReLU</text>
      <text x="190" y="154" textAnchor="middle" fontSize="10" fill={theme.text}>ReLU</text>
      <text x="190" y="254" textAnchor="middle" fontSize="10" fill={theme.text}>ReLU</text>

      {/* MLP edges (plain lines) */}
      <g stroke={theme.neutral} strokeWidth="1.2" opacity="0.6">
        <line x1="82" y1="120" x2="168" y2="150" />
        <line x1="82" y1="120" x2="168" y2="250" />
        <line x1="82" y1="200" x2="168" y2="150" mask="url(#imagine-text-gaps-i8o3r0)" />
        <line x1="82" y1="200" x2="168" y2="250" />
        <line x1="82" y1="280" x2="168" y2="150" />
        <line x1="82" y1="280" x2="168" y2="250" />
        <line x1="212" y1="150" x2="298" y2="200" mask="url(#imagine-text-gaps-i8o3r0)" />
        <line x1="212" y1="250" x2="298" y2="200" />
      </g>

      {/* MLP weight label */}
      <text x="130" y="165" fontSize="10" fill={theme.neutral} transform="rotate(-20,130,165)">w</text>
      <text x="260" y="185" fontSize="10" fill={theme.neutral}>w</text>

      {/* Divider */}
      <line x1="390" y1="50" x2="390" y2="340" stroke={theme.neutral} strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>

      {/* KAN side */}
      <text x="570" y="28" textAnchor="middle" fontSize="15" fontWeight="500" fill={theme.accent}>KAN</text>
      <text x="570" y="46" textAnchor="middle" fontSize="12" fill={theme.neutral}>learnable activation on edges</text>

      {/* KAN nodes layer 1 (plain sums) */}
      <g stroke={theme.accent} strokeWidth="2" fill="transparent">
        <ellipse cx="440" cy="120" rx="22" ry="22" />
        <ellipse cx="440" cy="200" rx="22" ry="22" />
        <ellipse cx="440" cy="280" rx="22" ry="22" />
        <ellipse cx="570" cy="150" rx="22" ry="22" />
        <ellipse cx="570" cy="250" rx="22" ry="22" />
        <ellipse cx="700" cy="200" rx="22" ry="22" />
      </g>

      {/* Node label: sum */}
      <g fontSize="13" fill={theme.accent} textAnchor="middle">
        <text x="440" y="124">Σ</text>
        <text x="440" y="204">Σ</text>
        <text x="440" y="284">Σ</text>
        <text x="570" y="154">Σ</text>
        <text x="570" y="254">Σ</text>
      </g>

      {/* KAN edges with spline labels */}
      <g stroke={theme.accent} strokeWidth="1.5">
        <line x1="462" y1="120" x2="548" y2="150" mask="url(#imagine-text-gaps-i8o3r0)"/>
        <line x1="462" y1="120" x2="548" y2="250" />
        <line x1="462" y1="200" x2="548" y2="150" />
        <line x1="462" y1="200" x2="548" y2="250" mask="url(#imagine-text-gaps-i8o3r0)"/>
        <line x1="462" y1="280" x2="548" y2="150" mask="url(#imagine-text-gaps-i8o3r0)"/>
        <line x1="462" y1="280" x2="548" y2="250" />
        <line x1="592" y1="150" x2="678" y2="200" />
        <line x1="592" y1="250" x2="678" y2="200" />
      </g>

      {/* Spline icons on edges */}
      <g>
        {[
          { x: 495, y: 122 },
          { x: 495, y: 220 },
          { x: 630, y: 190 }
        ].map((pos, i) => (
          <React.Fragment key={i}>
            <rect x={pos.x} y={pos.y} width="30" height="14" rx="3" fill={theme.accent} opacity="0.2" />
            <text x={pos.x + 15} y={pos.y + 11} textAnchor="middle" fontSize="9" fill={theme.accent}>φ(x)</text>
          </React.Fragment>
        ))}
      </g>

      {/* Legend */}
      <g fontSize="11" fill={theme.neutral}>
        <rect x="420" y="315" width="12" height="12" rx="2" fill="transparent" stroke={theme.neutral} />
        <text x="436" y="325">fixed weight</text>
        <rect x="530" y="315" width="12" height="12" rx="2" fill={theme.accent} opacity="0.3" />
        <text x="546" y="325">learnable spline φ(x)</text>
      </g>

      {/* Input labels */}
      <g fontSize="11" fill={theme.neutral}>
        <text x="22" y="124">x₁</text>
        <text x="22" y="204">x₂</text>
        <text x="22" y="284">x₃</text>
        <text x="400" y="124">x₁</text>
        <text x="400" y="204">x₂</text>
        <text x="400" y="284">x₃</text>
        <text x="332" y="204">y</text>
        <text x="712" y="204">y</text>
      </g>
    </svg>
  );
};

// Scene 4: Core Idea Architecture
const CoreIdeaArchScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="Flipping the Architecture" mode={mode} subtitle="MLP vs KAN Structure" fontSize={60} marginTop={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: -40 }}>
         <div style={{ width: 1400, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <ArchitectureSVG mode={mode} />
         </div>
         <div style={{ display: 'flex', gap: 60, marginTop: 10 }}>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 60} opacity={0.2}>
                <span style={{ fontSize: 28, color: textColor, padding: '5px 20px', fontWeight: 'bold' }}>MLP: Fixed Activation on Nodes</span>
            </MarkerHighlight>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 80} opacity={0.2}>
                <span style={{ fontSize: 28, color: theme.accent, padding: '5px 20px', fontWeight: 'bold' }}>KAN: Learnable Activation on Edges</span>
            </MarkerHighlight>
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Core Idea Splines
const CoreIdeaSplinesScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  const boxBg = 'rgba(255,255,255,0.05)';
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The Power of Splines" mode={mode} subtitle="Local Control and Precision" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
         <div style={{ width: 500, display: 'flex', flexDirection: 'column', gap: 30 }}>
            <div style={{ padding: 25, borderLeft: `6px solid ${theme.accent}`, background: boxBg }}>
               <ScribbleText text="Learnable Splines" fontSize={36} color={theme.accent} delay={SCENE_START_DELAY + 50} />
               <StaggeredText text="Piecewise functions with local control knots." fontSize={26} color={textColor} delay={SCENE_START_DELAY + 70} />
            </div>
            <div style={{ padding: 25, borderLeft: `6px solid ${theme.neutral}`, background: boxBg }}>
               <ScribbleText text="Compositional Learning" fontSize={36} color={theme.neutral} delay={SCENE_START_DELAY + 90} />
               <StaggeredText text="Inherits MLP benefits with spline precision." fontSize={26} color={textColor} delay={SCENE_START_DELAY + 110} />
            </div>
         </div>
         <SketchyBox width={900} height={600} mode="dark" delay={SCENE_START_DELAY + 120} color={theme.accent}>
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SplineVisualizer width={800} height={500} mode={mode} delay={SCENE_START_DELAY + 150} />
            </div>
         </SketchyBox>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Core Idea Interpretability
const CoreIdeaInterpretabilityScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="Seeing the Logic" mode={mode} subtitle="Visualizing Every Connection" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
         <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <DrawnIcon icon={Eye} size={140} color={theme.accent} delay={SCENE_START_DELAY + 20} />
            <SketchyBox width={900} height={600} mode="dark" delay={SCENE_START_DELAY + 40} color={theme.accent}>
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <SketchDNN layers={[2, 3, 2]} width={800} height={500} delay={SCENE_START_DELAY + 60} mode="dark" />
                </div>
            </SketchyBox>
         </div>
         <StaggeredText text="Literally look at the network and see what relationship each connection learned." fontSize={38} color={textColor} delay={SCENE_START_DELAY + 120} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Numbers
const NumbersScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const frame = useCurrentFrame();
  
  // Audio segment 'numbers' is 2348 frames.
  const midPoint = 1174;
  const isSecondHalf = frame > midPoint;
  
  const chartW = 650;
  const chartH = 340;

  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      {!isSecondHalf ? (
        <Sequence from={0} durationInFrames={midPoint + 10}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 100, padding: '0 60px' }}>
               {/* 1. PDE solving accuracy */}
               <div style={{ display: 'flex', flexDirection: 'column', width: chartW }}>
                  <ScribbleText text="PDE solving accuracy" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 10} />
                <SketchChart 
                   type="bar"
                   data={[
                     { label: 'MLP (10K)', value: 1e-5 },
                     { label: 'KAN (100)', value: 1e-7 }
                   ]}
                   width={chartW}
                   height={chartH}
                   color={theme.accent}
                   delay={SCENE_START_DELAY + 30}
                   mode="dark"
                   maxValue={0.000011}
                   yAxisLabel="MSE"
                   xAxisLabel="Model & parameter count"
                />
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                   <StaggeredText text="100× lower error with 100× fewer parameters" fontSize={24} color={theme.accent} fontWeight="bold" delay={SCENE_START_DELAY + 60} />
                </div>
             </div>

             {/* 2. Parameter efficiency */}
             <div style={{ display: 'flex', flexDirection: 'column', width: chartW }}>
                <ScribbleText text="Parameter efficiency" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 20} />
                <SketchChart 
                   type="bar"
                   data={[
                     { label: 'MLP', value: 10000 },
                     { label: 'KAN', value: 100 }
                   ]}
                   width={chartW}
                   height={chartH}
                   color={theme.accent}
                   delay={SCENE_START_DELAY + 40}
                   mode="dark"
                   maxValue={11000}
                   yAxisLabel="Parameters"
                   xAxisLabel="Architecture"
                />
             </div>
            </div>
            <SceneTitle text="Data & Plots" mode={mode} subtitle="KAN vs. MLP — Accuracy & Efficiency" fontSize={70} marginTop={60} nowrap />
          </div>
        </Sequence>
      ) : (
        <Sequence from={0}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 100, padding: '0 60px' }}>
               {/* 3. Scaling laws */}
             <div style={{ display: 'flex', flexDirection: 'column', width: chartW }}>
                <ScribbleText text="Scaling laws (test loss)" fontSize={32} color={theme.accent} delay={10} />
                <div style={{ position: 'relative', height: chartH }}>
                   <SketchChart 
                      type="line"
                      data={[
                        { label: '100', value: 0.8 },
                        { label: '500', value: 0.55 },
                        { label: '1K', value: 0.42 },
                        { label: '5K', value: 0.30 },
                        { label: '10K', value: 0.24 }
                      ]}
                      width={chartW}
                      height={chartH}
                      color={theme.neutral}
                      delay={SCENE_START_DELAY + 20}
                      mode="dark"
                      maxValue={0.85}
                      yAxisLabel="Test loss"
                      xAxisLabel="Parameters (N)"
                   />
                   <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                      <SketchChart 
                         type="line"
                         data={[
                           { label: '100', value: 0.65 },
                           { label: '500', value: 0.38 },
                           { label: '1K', value: 0.22 },
                           { label: '5K', value: 0.10 },
                           { label: '10K', value: 0.06 }
                         ]}
                         width={chartW}
                         height={chartH}
                         color={theme.accent}
                         delay={SCENE_START_DELAY + 40}
                         mode="dark"
                         maxValue={0.85}
                         showAxes={false}
                      />
                   </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 2, background: theme.neutral }} />
                      <span style={{ fontSize: 14, color: theme.neutral }}>MLP</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 2, background: theme.accent }} />
                      <span style={{ fontSize: 14, color: theme.accent }}>KAN</span>
                   </div>
                </div>
             </div>

             {/* 4. Training speed */}
             <div style={{ display: 'flex', flexDirection: 'column', width: chartW }}>
                <ScribbleText text="Training speed" fontSize={32} color={theme.accent} delay={20} />
                <SketchChart 
                   type="bar"
                   data={[
                     { label: 'MLP', value: 1 },
                     { label: 'KAN (original)', value: 10 },
                     { label: 'FastKAN', value: 2 }
                   ]}
                   width={chartW}
                   height={chartH}
                   color={theme.accent}
                   delay={SCENE_START_DELAY + 40}
                   mode="dark"
                   maxValue={11}
                   yAxisLabel="Relative time"
                   xAxisLabel="Implementation"
                />
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                   <MarkerHighlight color={theme.accent} opacity={0.2} delay={SCENE_START_DELAY + 70}>
                      <span style={{ fontSize: 26, color: theme.accent, fontWeight: 'bold', padding: '0 10px' }}>FastKAN solves the bottleneck</span>
                   </MarkerHighlight>
                </div>
             </div>
            </div>
            <SceneTitle text="Data & Plots" mode={mode} subtitle="KAN vs. MLP — Scaling & Training Speed" fontSize={70} marginTop={60} nowrap />
          </div>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// Scene 8: Discovery Tool
const DiscoveryToolScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="A Scientific Discovery Tool" mode={mode} subtitle="KAN as a Collaborator" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
         <SketchFlowchart 
            nodes={[
                { id: 'data', x: 180, y: 200, text: 'Raw Data', type: 'rect' },
                { id: 'kan', x: 450, y: 200, text: 'KAN', type: 'diamond' },
                { id: 'formula', x: 720, y: 200, text: 'Formula', type: 'rect' }
            ]}
            edges={[
                { from: 'data', to: 'kan' },
                { from: 'kan', to: 'formula' }
            ]}
            width={1000}
            height={500}
            color={theme.accent}
            delay={SCENE_START_DELAY + 20}
            mode="dark"
            title=""
         />
         <div style={{ position: 'absolute', bottom: 100, display: 'flex', gap: 30 }}>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 150} opacity={0.2}>
                <div style={{ padding: '10px 20px', textAlign: 'center' }}>
                   <ScribbleText text="Knot Theory" fontSize={32} color={textColor} delay={SCENE_START_DELAY + 170} />
                   <span style={{ fontSize: 18, color: theme.neutral, fontWeight: 'bold' }}>Rediscovering Invariants</span>
                </div>
            </MarkerHighlight>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 190} opacity={0.2}>
                <div style={{ padding: '10px 20px', textAlign: 'center' }}>
                   <ScribbleText text="Anderson Localization" fontSize={32} color={textColor} delay={SCENE_START_DELAY + 210} />
                   <span style={{ fontSize: 18, color: theme.neutral, fontWeight: 'bold' }}>Quantum Physics Insights</span>
                </div>
            </MarkerHighlight>
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 9: Limitations
const LimitationsScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="Where KAN Falls Short" mode={mode} subtitle="The Reality Check" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
         <SketchyBox width={1200} height={500} mode="dark" delay={SCENE_START_DELAY + 20} color={theme.accent}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 40, gap: 30 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <DrawnIcon icon={ShieldAlert} size={70} color="#fca5a5" delay={SCENE_START_DELAY + 40} />
                    <StaggeredText text="Struggles with Noisy Data" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 60} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <DrawnIcon icon={Target} size={70} color="#fca5a5" delay={SCENE_START_DELAY + 80} />
                    <StaggeredText text="Only beats MLP on symbolic tasks" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 100} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <DrawnIcon icon={Cpu} size={70} color="#fca5a5" delay={SCENE_START_DELAY + 120} />
                    <StaggeredText text="Training is slower and memory-intensive" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 140} />
                </div>
            </div>
         </SketchyBox>
      </div>
    </AbsoluteFill>
  );
};

// Scene 10: Outro Text
const OutroTextScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  const textColor = theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="What Comes Next" mode={mode} subtitle="The KAN Ecosystem" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'center', maxWidth: 1300 }}>
            {["FastKAN", "ChebyKAN", "GraphKAN", "Vision-KAN", "WavKAN"].map((item, i) => (
                <MarkerHighlight key={i} color={theme.accent} delay={SCENE_START_DELAY + 20 + i * 20} opacity={0.3}>
                    <div style={{ padding: '20px 40px' }}>
                        <StaggeredText text={item} fontSize={44} fontWeight={900} color={theme.accent} delay={SCENE_START_DELAY + 40 + i * 20} />
                    </div>
                </MarkerHighlight>
            ))}
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 11: Outro
const OutroScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = getKANTheme(mode);
  // KAN always uses dark backgrounds, so we use logo-dark.svg
  const logo = 'logo-dark.svg';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSpring = spring({ fps, frame, delay: SCENE_START_DELAY + 20, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
       <JitterGroup>
          <SketchyBox width={700} height={700} mode={mode} strokeWidth={6} delay={SCENE_START_DELAY + 10}>
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
                <div style={{ transform: `scale(${logoSpring})`, width: 300, height: 300 }}>
                    <img src={staticFile(logo)} style={{ width: '100%', height: '100%' }} alt="Logo" />
                </div>
                
                <MarkerHighlight color={theme.accent} opacity={0.15} delay={SCENE_START_DELAY + 100}>
                    <div style={{ padding: '8px 30px' }}>
                        <StaggeredText text="www.eulerfold.com" fontSize={48} fontWeight={700} color={theme.accent} delay={SCENE_START_DELAY + 120} />
                    </div>
                </MarkerHighlight>
             </div>
          </SketchyBox>
       </JitterGroup>
    </AbsoluteFill>
  );
};

export const KAN: React.FC<{ timingData: any[] }> = ({ timingData }) => {
  const scenes = [
    HookScene, 
    MLPBackgroundScene, 
    MathOriginScene, 
    CoreIdeaArchScene, 
    CoreIdeaSplinesScene,
    CoreIdeaInterpretabilityScene,
    NumbersScene, 
    DiscoveryToolScene, 
    LimitationsScene, 
    OutroTextScene, 
    OutroScene
  ];
  
  return (
    <AbsoluteFill>
      <SketchbookPaper mode={timingData[0].mode} />
      <Watermark mode={timingData[0].mode} />

      {timingData.map((segment: any) => (
        <Sequence key={`audio-${segment.id}`} from={segment.start_frame} durationInFrames={segment.frames}>
          <Audio src={staticFile(segment.audio_path)} />
        </Sequence>
      ))}

      <TransitionSeries>
        {timingData.map((segment: any, i: number) => {
          const SceneComponent = scenes[i];
          if (!SceneComponent) return null;
          
          const isLast = i === timingData.length - 1;
          // For the last segment, we add the 60-frame visual-only buffer we defined in index.tsx
          const visualDuration = isLast ? (segment.frames || 0) + 60 : (segment.frames || 0);

          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={visualDuration}>
                <SceneComponent mode={segment.mode as 'light' | 'dark'} />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
