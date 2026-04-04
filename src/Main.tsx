import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useVideoConfig, spring, staticFile, Audio, useCurrentFrame, interpolate, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import rough from 'roughjs/bin/rough';
import { Theme } from './styles/theme';
import { Info, DollarSign, Repeat, ShieldCheck, User, Wallet, Footprints, TrendingUp, AlertCircle, Clock } from 'lucide-react';

// Import all available components
import { DrawnIcon } from './components/DrawnIcon';
import { SketchyBox } from './components/SketchyBox';
import { MarkerHighlight } from './components/MarkerHighlight';
import { ScribbleText } from './components/ScribbleText';
import { SketchChart } from './components/SketchChart';
import { StaggeredText } from './components/StaggeredText';
import { JitterGroup } from './components/JitterGroup';
import { SketchBubblePlot } from './components/SketchBubblePlot';

// Import dynamic timing data
import timingData from './data/active_video.json';

const PADDING = 80;
const TRANSITION_DURATION = 20; // Increased for smoother feel
const SCENE_START_DELAY = TRANSITION_DURATION + 5; // Buffer to start AFTER transition

const SketchbookPaper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();

  useEffect(() => {
    if (canvasRef.current) {
      const rc = rough.canvas(canvasRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = Theme.colors.light.paper;
        ctx.fillRect(0, 0, width, height);
        rc.rectangle(40, 40, width - 80, height - 80, {
          roughness: 1.5,
          bowing: 2,
          stroke: Theme.colors.light.accent,
          strokeWidth: 4,
          fill: Theme.colors.light.paper,
          fillStyle: 'solid',
          seed: 1
        });
      }
    }
  }, [width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', zIndex: -10 }} />;
};

const Watermark: React.FC = () => {
  return (
    <div style={{ position: 'absolute', top: 100, right: 100, opacity: 0.4 }}>
        <img src={staticFile('logo.svg')} style={{ width: 140, height: 140 }} alt="EulerFold Logo" />
    </div>
  );
};

const BootStack: React.FC<{ count: number; delay: number; size?: number; gap?: number }> = ({ count, delay, size = 60, gap = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <div style={{ display: 'flex', gap, flexWrap: 'wrap', justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => {
        const itemDelay = delay + i * 8;
        const springVal = spring({ frame, fps, delay: itemDelay, config: { damping: 12, stiffness: 100 } });
        const opacity = interpolate(frame, [itemDelay, itemDelay + 10], [0, 1], { extrapolateRight: 'clamp' });
        
        return (
          <div key={i} style={{ 
            fontSize: size, 
            opacity,
            transform: `scale(${springVal}) rotate(${interpolate(springVal, [0, 1], [15, 0])}deg)`,
            filter: 'grayscale(0.2) contrast(1.1)',
          }}>
            🥾
          </div>
        );
      })}
    </div>
  );
};

const Title: React.FC<{ text: string; fontFamily: string; subtitle?: string }> = ({ text, fontFamily, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, delay: SCENE_START_DELAY, config: { damping: 15, stiffness: 100 } });
  const opacity = interpolate(frame, [SCENE_START_DELAY, SCENE_START_DELAY + 10], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 80, marginTop: 150 }}>
      <ScribbleText text={text} fontFamily={fontFamily} fontSize={96} color={Theme.colors.light.text} delay={SCENE_START_DELAY} duration={30} />
      {subtitle && (
        <div style={{ marginTop: 24 }}>
           <MarkerHighlight color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 30} duration={30} opacity={0.2}>
              <span style={{ fontFamily, fontSize: 44, color: Theme.colors.light.neutral, fontWeight: 500 }}>{subtitle}</span>
           </MarkerHighlight>
        </div>
      )}
    </div>
  );
};

const Scene1: React.FC<{ fontFamily: string }> = ({ fontFamily }) => (
  <AbsoluteFill style={{ padding: PADDING }}>
    <Title text="Sam vs. Alex" fontFamily={fontFamily} subtitle="A Tale of Two Budgets" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 80, width: '100%' }}>
        <SketchyBox width={420} height={480} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 20}>
           <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <DrawnIcon icon={User} size={100} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 40} />
              <ScribbleText text="Sam" fontSize={48} delay={SCENE_START_DELAY + 60} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                 <DrawnIcon icon={Wallet} size={50} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 80} />
                 <StaggeredText text="$10" fontSize={70} fontWeight={900} delay={SCENE_START_DELAY + 100} />
              </div>
              <div style={{ marginTop: 10 }}>
                <BootStack count={1} delay={SCENE_START_DELAY + 120} size={80} />
              </div>
           </div>
        </SketchyBox>
        <SketchyBox width={420} height={480} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 70}>
           <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <DrawnIcon icon={User} size={100} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 90} />
              <ScribbleText text="Alex" fontSize={48} delay={SCENE_START_DELAY + 110} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                 <DrawnIcon icon={Wallet} size={50} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 130} />
                 <StaggeredText text="$50" fontSize={70} fontWeight={900} delay={SCENE_START_DELAY + 150} />
              </div>
              <div style={{ marginTop: 10 }}>
                <BootStack count={1} delay={SCENE_START_DELAY + 170} size={80} />
              </div>
           </div>
        </SketchyBox>
      </div>
    </div>
  </AbsoluteFill>
);

const Scene2: React.FC<{ fontFamily: string }> = ({ fontFamily }) => (
  <AbsoluteFill style={{ padding: PADDING }}>
    <Title text="The Price of Quality" fontFamily={fontFamily} subtitle="Durability vs. Disposability" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 80, alignItems: 'center' }}>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
          <SketchyBox width={850} height={280} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 20}>
             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', padding: '0 60px', gap: 60 }}>
                <BootStack count={1} delay={SCENE_START_DELAY + 40} size={110} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                   <StaggeredText text="Cheap Boots" fontSize={40} delay={SCENE_START_DELAY + 60} />
                   <ScribbleText text="6 Month Life" fontSize={50} color={Theme.colors.light.neutral} fontWeight={700} delay={SCENE_START_DELAY + 80} />
                </div>
             </div>
          </SketchyBox>
          <SketchyBox width={850} height={280} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 100}>
             <div style={{ width: '100%', height: '100', display: 'flex', alignItems: 'center', padding: '0 60px', gap: 60 }}>
                <div style={{ border: `4px solid ${Theme.colors.light.accent}`, borderRadius: 20, padding: 10 }}>
                    <BootStack count={1} delay={SCENE_START_DELAY + 120} size={110} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                   <StaggeredText text="Quality Boots" fontSize={40} delay={SCENE_START_DELAY + 140} />
                   <ScribbleText text="10 Year Life" fontSize={50} color={Theme.colors.light.accent} fontWeight={700} delay={SCENE_START_DELAY + 160} />
                </div>
             </div>
          </SketchyBox>
       </div>
    </div>
  </AbsoluteFill>
);

const Scene3: React.FC<{ fontFamily: string }> = ({ fontFamily }) => (
  <AbsoluteFill style={{ padding: PADDING }}>
    <Title text="Six Months Later" fontFamily={fontFamily} subtitle="Sam's Cycle Begins" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
          <div style={{ textAlign: 'center', minWidth: 350 }}>
             <ScribbleText text="SAM" fontSize={36} color={Theme.colors.light.neutral} fontWeight={700} delay={SCENE_START_DELAY + 20} />
             <div style={{ margin: '30px 0' }}>
               <BootStack count={2} delay={SCENE_START_DELAY + 40} size={100} />
             </div>
             <StaggeredText text="$10 + $10" fontSize={60} fontWeight={900} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 60} />
          </div>
          <DrawnIcon icon={TrendingUp} size={100} color={Theme.colors.light.neutral} delay={SCENE_START_DELAY + 100} />
          <div style={{ textAlign: 'center', minWidth: 350 }}>
             <ScribbleText text="ALEX" fontSize={36} color={Theme.colors.light.accent} fontWeight={700} delay={SCENE_START_DELAY + 120} />
             <div style={{ margin: '30px 0' }}>
               <BootStack count={1} delay={SCENE_START_DELAY + 140} size={100} />
             </div>
             <StaggeredText text="$50" fontSize={60} fontWeight={900} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 160} />
          </div>
       </div>
       <div style={{ marginTop: 40 }}>
          <MarkerHighlight color="#ff4444" opacity={0.15} delay={SCENE_START_DELAY + 180}>
             <span style={{fontSize: 44, fontWeight: 700, color: '#cc0000'}}>Sam already needs a second pair.</span>
          </MarkerHighlight>
       </div>
    </div>
  </AbsoluteFill>
);

const Scene4: React.FC<{ fontFamily: string }> = ({ fontFamily }) => (
  <AbsoluteFill style={{ padding: PADDING }}>
    <Title text="Two Years In" fontFamily={fontFamily} subtitle="The Gap is Closing" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
       <SketchyBox width={950} height={550} color={Theme.colors.light.text} strokeWidth={4} delay={SCENE_START_DELAY + 20}>
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'flex-start' }}>
                    <StaggeredText text="Sam (4 Pairs):" fontSize={44} delay={SCENE_START_DELAY + 40} />
                    <BootStack count={4} delay={SCENE_START_DELAY + 60} size={60} />
                </div>
                <ScribbleText text="$40 Spent" fontSize={72} color="#ff4444" fontWeight={900} delay={SCENE_START_DELAY + 100} />
             </div>
             <div style={{ height: 2, width: '85%', background: Theme.colors.light.neutral, opacity: 0.2 }} />
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '85%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'flex-start' }}>
                    <StaggeredText text="Alex (1 Pair):" fontSize={44} delay={SCENE_START_DELAY + 120} />
                    <BootStack count={1} delay={SCENE_START_DELAY + 140} size={60} />
                </div>
                <ScribbleText text="$50 Spent" fontSize={72} color={Theme.colors.light.accent} fontWeight={900} delay={SCENE_START_DELAY + 160} />
             </div>
          </div>
       </SketchyBox>
    </div>
  </AbsoluteFill>
);

const Scene5: React.FC<{ fontFamily: string }> = ({ fontFamily }) => (
  <AbsoluteFill style={{ padding: PADDING }}>
    <Title text="The Crossover" fontFamily={fontFamily} subtitle="Where Sam Starts Losing" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
       <div style={{ position: 'relative', width: 900, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: 0, width: '100%', height: 4, background: Theme.colors.light.neutral, opacity: 0.3 }} />
          <div style={{ zIndex: 1, background: Theme.colors.light.paper, padding: '0 60px', border: `3px dashed ${Theme.colors.light.accent}`, borderRadius: 100 }}>
             <StaggeredText text="BOTH SPENT $50" fontSize={80} fontWeight={900} color={Theme.colors.light.text} delay={SCENE_START_DELAY + 40} />
          </div>
       </div>
       <div style={{ display: 'flex', gap: 60 }}>
          <SketchyBox width={450} height={440} color="#ff4444" delay={SCENE_START_DELAY + 80}>
             <div style={{ padding: 30, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20 }}>
                <ScribbleText text="SAM" fontSize={44} color="#cc0000" fontWeight={800} delay={SCENE_START_DELAY + 100} />
                <div style={{ margin: '10px 0' }}>
                    <BootStack count={5} delay={SCENE_START_DELAY + 120} size={65} />
                </div>
                <StaggeredText text="Needs 6th pair" fontSize={36} fontWeight={600} delay={SCENE_START_DELAY + 180} />
             </div>
          </SketchyBox>
          <SketchyBox width={450} height={440} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 160}>
             <div style={{ padding: 30, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20 }}>
                <ScribbleText text="ALEX" fontSize={44} color={Theme.colors.light.accent} fontWeight={800} delay={SCENE_START_DELAY + 200} />
                <div style={{ margin: '10px 0' }}>
                    <BootStack count={1} delay={SCENE_START_DELAY + 220} size={65} />
                </div>
                <StaggeredText text="7.5 years left" fontSize={36} fontWeight={600} delay={SCENE_START_DELAY + 240} />
             </div>
          </SketchyBox>
       </div>
    </div>
  </AbsoluteFill>
);

const Scene6: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const data = [
    { label: 'Alex (Quality)', value: 50 },
    { label: 'Sam (Cheap)', value: 200 }
  ];
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <Title text="The 10-Year Result" fontFamily={fontFamily} subtitle="The Wealth Gap Visualized" />
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
         <SketchChart data={data} type="bar" width={950} height={650} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 20} duration={80} />
         <div style={{ marginTop: 60, width: '90%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '30px', borderRadius: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                <BootStack count={1} delay={SCENE_START_DELAY + 100} size={70} />
                <ScribbleText text="1 Pair" fontSize={36} fontWeight={700} delay={SCENE_START_DELAY + 120} />
            </div>
            <div style={{ fontSize: 60, color: Theme.colors.light.neutral, fontWeight: 300 }}>vs</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, maxWidth: 500 }}>
                <BootStack count={20} delay={SCENE_START_DELAY + 140} size={35} gap={6} />
                <ScribbleText text="20 Pairs" fontSize={36} fontWeight={700} delay={SCENE_START_DELAY + 260} />
            </div>
         </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene7: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const bubbleData = [
    { x: 10, y: 4, r: 65, label: "Shoes (4x)" },
    { x: 15, y: 3, r: 55, label: "Loans (3x)" },
    { x: 50, y: 1.75, r: 75, label: "Housing (1.75x)" },
    { x: 5, y: 1.18, r: 45, label: "Food (1.18x)" },
    { x: 30, y: 1.08, r: 40, label: "Energy (1.08x)" }
  ];
  
  return (
    <AbsoluteFill style={{ padding: PADDING }}>
      <Title text="The Poverty Premium" fontFamily={fontFamily} subtitle="A Systemic Mathematical Trap" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
         <SketchBubblePlot 
           data={bubbleData} 
           width={950} 
           height={850} 
           color={Theme.colors.light.accent} 
           delay={SCENE_START_DELAY + 20} 
           duration={100} 
           xAxisLabel="Upfront Cost Impact"
           yAxisLabel="Penalty Multiplier"
           title="Relative Cost Burden"
         />
      </div>
    </AbsoluteFill>
  );
};

const Scene8: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoSpring = spring({ fps, frame, delay: SCENE_START_DELAY + 30, config: { damping: 15, stiffness: 100 } });
  
  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
        <JitterGroup>
            <SketchyBox width={900} height={1100} color={Theme.colors.light.accent} strokeWidth={8} delay={SCENE_START_DELAY + 10}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
                    <div style={{ transform: `scale(${logoSpring})`, marginBottom: 30, width: 450, height: 450, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={staticFile('logo.svg')} style={{ width: '100%', height: '100%' }} alt="EulerFold Logo" />
                    </div>
                    
                    <ScribbleText text="EulerFold" fontFamily={fontFamily} fontSize={140} fontWeight={900} color={Theme.colors.light.text} delay={SCENE_START_DELAY + 60} duration={50} />
                    
                    <div style={{ marginTop: 60 }}>
                        <MarkerHighlight color={Theme.colors.light.accent} opacity={0.1} delay={SCENE_START_DELAY + 120}>
                           <div style={{ padding: '10px 30px' }}>
                              <StaggeredText text="www.eulerfold.com" fontFamily={fontFamily} fontSize={56} fontWeight={700} color={Theme.colors.light.accent} delay={SCENE_START_DELAY + 140} />
                           </div>
                        </MarkerHighlight>
                    </div>
                </div>
            </SketchyBox>
        </JitterGroup>
    </AbsoluteFill>
  );
};

export const Main: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const components = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];
  
  return (
    <AbsoluteFill style={{ backgroundColor: Theme.colors.light.paper }}>
      <SketchbookPaper />
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sketchy-displace">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      {/* Audio segments - Sequential */}
      {timingData.map((segment: any) => (
        <Sequence key={`audio-${segment.id}`} from={segment.start_frame} durationInFrames={segment.frames}>
          <Audio src={staticFile(segment.audio_path)} />
        </Sequence>
      ))}

      <TransitionSeries>
        {timingData.map((segment: any, i: number) => {
          const SceneComponent = components[i];
          const isLast = i === timingData.length - 1;
          
          const visualDuration = isLast 
            ? segment.frames + (timingData.length - 1) * TRANSITION_DURATION
            : segment.frames;

          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={visualDuration}>
                <SceneComponent fontFamily={fontFamily} />
                {!isLast && <Watermark />}
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
