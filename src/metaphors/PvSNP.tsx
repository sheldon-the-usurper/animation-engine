import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useVideoConfig, spring, staticFile, Audio, useCurrentFrame, interpolate, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import rough from 'roughjs/bin/rough';
import { Theme } from '../styles/theme';
import { Lock, Key, Zap, ShieldAlert, Cpu, Lightbulb, TrendingUp, History, Globe, Brain } from 'lucide-react';

import { DrawnIcon } from '../components/DrawnIcon';
import { SketchyBox } from '../components/SketchyBox';
import { MarkerHighlight } from '../components/MarkerHighlight';
import { ScribbleText } from '../components/ScribbleText';
import { SketchChart } from '../components/SketchChart';
import { StaggeredText } from '../components/StaggeredText';
import { JitterGroup } from '../components/JitterGroup';
import { SketchFlowchart } from '../components/SketchFlowchart';
import { SketchGraph } from '../components/SketchGraph';
import { SketchMonitor } from '../components/SketchMonitor';
import { ProteinFolding } from '../components/ProteinFolding';
import { HashViz } from '../components/HashViz';
import { SketchCar } from '../components/SketchCar';

const PADDING = 80;
const TRANSITION_DURATION = 20;
const SCENE_START_DELAY = 10;

const SketchbookPaper: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;

  useEffect(() => {
    if (canvasRef.current) {
      const rc = rough.canvas(canvasRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = theme.paper;
        ctx.fillRect(0, 0, width, height);
        rc.rectangle(40, 40, width - 80, height - 80, {
          roughness: 1.5,
          bowing: 2,
          stroke: theme.accent,
          strokeWidth: 4,
          fill: theme.paper,
          fillStyle: 'solid',
          seed: 1
        });
      }
    }
  }, [width, height, theme]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', zIndex: -10 }} />;
};

const Watermark: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const opacity = mode === 'dark' ? 0.8 : 0.7;
  const logo = mode === 'dark' ? 'logo-dark.svg' : 'logo.svg';
  return (
    <div style={{ position: 'absolute', top: 60, right: 60, opacity, zIndex: 100 }}>
        <img src={staticFile(logo)} style={{ width: 100, height: 100 }} alt="EulerFold Logo" />
    </div>
  );
};

const SceneTitle: React.FC<{ text: string; mode: 'light' | 'dark'; subtitle?: string }> = ({ text, mode, subtitle }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 60, marginTop: 100 }}>
      <ScribbleText text={text} fontSize={80} color={textColor} delay={SCENE_START_DELAY} duration={30} />
      {subtitle && (
        <div style={{ marginTop: 20 }}>
           <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 30} duration={30} opacity={0.2}>
              <span style={{ fontSize: 36, color: theme.neutral, fontWeight: 500 }}>{subtitle}</span>
           </MarkerHighlight>
        </div>
      )}
    </div>
  );
};

// Scene 1: Hook
const HookScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The $1 Million Mystery" mode={mode} subtitle="Complexity, Solved?" />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        {/* Simpsons Image Box */}
        <SketchyBox width={600} height={350} mode={mode} delay={SCENE_START_DELAY + 10} color={theme.neutral}>
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img 
                src={staticFile('simpsons.png')} 
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
                alt="Simpsons" 
              />
           </div>
        </SketchyBox>

        {/* Main P=NP Box */}
        <SketchyBox width={700} height={550} mode={mode} delay={SCENE_START_DELAY + 40}>
           <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
              <StaggeredText text="P = NP" fontSize={120} fontWeight={900} color={theme.accent} delay={SCENE_START_DELAY + 60} />
              <SketchMonitor delay={SCENE_START_DELAY + 80} mode={mode} />
           </div>
        </SketchyBox>

        {/* Hook Text */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
           <ScribbleText text="One Equation." fontSize={54} color={mode === 'dark' ? '#ffffff' : theme.text} delay={SCENE_START_DELAY + 140} />
           <ScribbleText text="Everything Changes." fontSize={54} color={theme.accent} delay={SCENE_START_DELAY + 170} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: P Definition
const PScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="P: The Solvable" mode={mode} subtitle="Efficiency and Polynomial Time" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
         <SketchyBox width={800} height={450} mode={mode} delay={SCENE_START_DELAY + 20}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 40, gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                    <DrawnIcon icon={TrendingUp} size={60} color={theme.accent} delay={SCENE_START_DELAY + 40} />
                    <StaggeredText text="Manageable Growth" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 60} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                    <DrawnIcon icon={Cpu} size={60} color={theme.accent} delay={SCENE_START_DELAY + 80} />
                    <StaggeredText text="Practical Computation" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 100} />
                </div>
                <div style={{ height: 2, width: '100%', background: theme.accent, opacity: 0.3 }} />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                   <ScribbleText text="Sorting" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 120} />
                   <ScribbleText text="Multiplication" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 140} />
                   <ScribbleText text="Shortest Path" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 160} />
                </div>
            </div>
         </SketchyBox>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: NP Definition
const NPScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="NP: The Verifiable" mode={mode} subtitle="The Asymmetry of Information" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
            <SketchyBox width={360} height={480} mode={mode} delay={SCENE_START_DELAY + 20} color={theme.neutral}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
                    <DrawnIcon icon={Lock} size={120} color={theme.neutral} delay={SCENE_START_DELAY + 40} />
                    <ScribbleText text="SOLVING" fontSize={36} color={theme.neutral} delay={SCENE_START_DELAY + 60} />
                    <StaggeredText text="Hard" fontSize={44} fontWeight={900} color={theme.neutral} delay={SCENE_START_DELAY + 80} />
                </div>
            </SketchyBox>
            <DrawnIcon icon={Zap} size={80} color={theme.accent} delay={SCENE_START_DELAY + 100} />
            <SketchyBox width={360} height={480} mode={mode} delay={SCENE_START_DELAY + 120}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
                    <DrawnIcon icon={Key} size={120} color={theme.accent} delay={SCENE_START_DELAY + 140} />
                    <ScribbleText text="VERIFYING" fontSize={36} color={textColor} delay={SCENE_START_DELAY + 160} />
                    <StaggeredText text="Instant" fontSize={44} fontWeight={900} color={theme.accent} delay={SCENE_START_DELAY + 180} />
                </div>
            </SketchyBox>
        </div>
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 200} opacity={0.1}>
                <span style={{ fontSize: 28, color: theme.neutral, padding: '5px 15px' }}>Sudoku</span>
            </MarkerHighlight>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 220} opacity={0.1}>
                <span style={{ fontSize: 28, color: theme.neutral, padding: '5px 15px' }}>Protein Folding</span>
            </MarkerHighlight>
            <MarkerHighlight color={theme.accent} delay={SCENE_START_DELAY + 240} opacity={0.1}>
                <span style={{ fontSize: 28, color: theme.neutral, padding: '5px 15px' }}>Traveling Salesman</span>
            </MarkerHighlight>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Asymmetry (The Wall)
const AsymmetryScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The Exponential Wall" mode={mode} subtitle="Polynomial vs Exponential Growth" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
         <div style={{ flex: 1 }}>
            <SketchGraph 
                equations={[
                    { fn: "Math.pow(x, 2)", color: theme.accent, label: "P: Polynomial (n²)" },
                    { fn: "Math.pow(2, x)", color: "#f87171", label: "NP: Exponential (2ⁿ)" }
                ]}
                width={600} 
                height={500} 
                scale={30}
                delay={SCENE_START_DELAY + 20}
                mode={mode}
                xAxisLabel="Problem Size (n)"
                yAxisLabel="Time Required"
            />
         </div>
         <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 30 }}>
            <div style={{ padding: 20, borderLeft: `4px solid ${theme.accent}`, background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
               <ScribbleText text="Polynomial (P)" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 50} />
               <StaggeredText text="Scales with your hardware." fontSize={24} color={textColor} delay={SCENE_START_DELAY + 70} />
            </div>
            <div style={{ padding: 20, borderLeft: `4px solid #f87171`, background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
               <ScribbleText text="Exponential (NP)" fontSize={32} color="#f87171" delay={SCENE_START_DELAY + 90} />
               <StaggeredText text="Defies even supercomputers." fontSize={24} color={textColor} delay={SCENE_START_DELAY + 110} />
            </div>
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: NP-Complete
const NPCompleteScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The Magic Link" mode={mode} subtitle="All Paths Lead to One" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <SketchFlowchart 
            nodes={[
                { id: 'sat', x: 450, y: 300, text: 'SAT', type: 'diamond' },
                { id: 'tsp', x: 200, y: 150, text: 'TSP', type: 'rect' },
                { id: 'fold', x: 700, y: 150, text: 'Folding', type: 'rect' },
                { id: 'sudoku', x: 200, y: 450, text: 'Sudoku', type: 'rect' },
                { id: 'crypto', x: 700, y: 450, text: 'Crypto', type: 'rect' }
            ]}
            edges={[
                { from: 'tsp', to: 'sat' },
                { from: 'fold', to: 'sat' },
                { from: 'sudoku', to: 'sat' },
                { from: 'crypto', to: 'sat' }
            ]}
            width={900}
            height={600}
            color={mode === 'dark' ? '#fb923c' : theme.accent} // Orange for nodes in dark mode
            delay={SCENE_START_DELAY + 20}
            title=""
            mode={mode}
         />
         <div style={{ position: 'absolute', bottom: 100, maxWidth: 600, textAlign: 'center', background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', padding: 20, borderRadius: 12, border: `2px dashed ${theme.accent}` }}>
            <ScribbleText text="SAT: The Master Problem" fontSize={32} color={theme.accent} delay={SCENE_START_DELAY + 150} />
            <StaggeredText 
                text="The first NP-Complete problem. If you solve SAT, you solve everything else in this web." 
                fontSize={24} 
                color={mode === 'dark' ? '#ffffff' : theme.text} 
                delay={SCENE_START_DELAY + 180} 
            />
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Impact
const ImpactScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="If P = NP..." mode={mode} subtitle="The Great Rebuilding" />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center', maxWidth: 1100 }}>
            {[
                { custom: <HashViz width={220} height={150} mode={mode} delay={SCENE_START_DELAY + 20} />, text: "Security Falls", color: "#f87171" },
                { custom: <SketchCar width={220} height={150} color={mode === 'dark' ? '#60a5fa' : theme.accent} delay={SCENE_START_DELAY + 40} />, text: "Instant Logistics", color: mode === 'dark' ? '#60a5fa' : theme.accent },
                { icon: Brain, text: "Perfect AI", color: mode === 'dark' ? '#c084fc' : theme.accent },
                { custom: <ProteinFolding width={220} height={150} mode={mode} delay={SCENE_START_DELAY + 80} />, text: "Cured Diseases", color: mode === 'dark' ? '#4ade80' : theme.accent }
            ].map((item, i) => (
                <SketchyBox key={i} width={500} height={250} mode={mode} delay={SCENE_START_DELAY + 20 + i * 20} color={item.color}>
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 20, paddingLeft: 10 }}>
                        <div style={{ width: 220, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {item.custom ? item.custom : (
                                <DrawnIcon icon={(item as any).icon} size={100} color={item.color} delay={SCENE_START_DELAY + 40 + i * 20} />
                            )}
                        </div>
                        <StaggeredText text={item.text} fontSize={38} fontWeight={900} color={textColor} delay={SCENE_START_DELAY + 60 + i * 20} />
                    </div>
                </SketchyBox>
            ))}
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 7: Consensus
const ConsensusScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <SceneTitle text="The Expert Consensus" mode={mode} subtitle="Is Human Insight Computation?" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
         <SketchyBox width={800} height={300} mode={mode} delay={SCENE_START_DELAY + 20}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                <StaggeredText text="99% BELIEVE P ≠ NP" fontSize={64} fontWeight={900} color={theme.accent} delay={SCENE_START_DELAY + 40} />
                <ScribbleText text="Creativity is more than brute force." fontSize={32} color={theme.neutral} delay={SCENE_START_DELAY + 80} />
            </div>
         </SketchyBox>
         <div style={{ display: 'flex', gap: 40 }}>
            <DrawnIcon icon={Lightbulb} size={120} color={theme.accent} delay={SCENE_START_DELAY + 100} />
            <DrawnIcon icon={Brain} size={120} color={theme.accent} delay={SCENE_START_DELAY + 130} />
         </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 8: Outro
const OutroScene: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const textColor = mode === 'dark' ? '#ffffff' : theme.text;
  const logo = mode === 'dark' ? 'logo-dark.svg' : 'logo.svg';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSpring = spring({ fps, frame, delay: SCENE_START_DELAY + 20, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
       <JitterGroup>
          <SketchyBox width={800} height={1000} mode={mode} strokeWidth={8} delay={SCENE_START_DELAY + 10}>
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
                <div style={{ transform: `scale(${logoSpring})`, width: 300, height: 300 }}>
                    <img src={staticFile(logo)} style={{ width: '100%', height: '100%' }} alt="Logo" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <ScribbleText text="EulerFold" fontSize={120} fontWeight={900} color={textColor} delay={SCENE_START_DELAY + 40} />
                    <div style={{ height: 6, width: 400, background: theme.accent, margin: '20px auto' }} />
                    <StaggeredText text="Visualizing Complexity" fontSize={44} color={theme.neutral} delay={SCENE_START_DELAY + 70} />
                </div>
                <MarkerHighlight color={theme.accent} opacity={0.15} delay={SCENE_START_DELAY + 100}>
                    <div style={{ padding: '10px 40px' }}>
                        <StaggeredText text="www.eulerfold.com" fontSize={48} fontWeight={700} color={theme.accent} delay={SCENE_START_DELAY + 120} />
                    </div>
                </MarkerHighlight>
             </div>
          </SketchyBox>
       </JitterGroup>
    </AbsoluteFill>
  );
};

export const PvSNP: React.FC<{ timingData: any[] }> = ({ timingData }) => {
  const scenes = [HookScene, PScene, NPScene, AsymmetryScene, NPCompleteScene, ImpactScene, ConsensusScene, OutroScene];
  
  return (
    <AbsoluteFill>
      {/* Background paper based on the first segment's mode */}
      <SketchbookPaper mode={timingData[0].mode} />
      
      {/* Watermark across all scenes */}
      <Watermark mode={timingData[0].mode} />

      {/* Audio segments */}
      {timingData.map((segment: any) => (
        <Sequence key={`audio-${segment.id}`} from={segment.start_frame} durationInFrames={segment.frames}>
          <Audio src={staticFile(segment.audio_path)} />
        </Sequence>
      ))}

      <TransitionSeries>
        {timingData.map((segment: any, i: number) => {
          const SceneComponent = scenes[i];
          const isLast = i === timingData.length - 1;
          const visualDuration = isLast ? segment.frames + 60 : segment.frames;

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
