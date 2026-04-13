import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, Audio, staticFile, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Theme } from '../styles/theme';
import { ProfessionalOutro } from '../components/ProfessionalOutro';
import { ScribbleText } from '../components/ScribbleText';
import { StaggeredText } from '../components/StaggeredText';
import { SketchyBox } from '../components/SketchyBox';
import { JitterGroup } from '../components/JitterGroup';
import { DrawnIcon } from '../components/DrawnIcon';
import { SketchChart } from '../components/SketchChart';
import { SketchGraph } from '../components/SketchGraph';
import { SketchMonitor } from '../components/SketchMonitor';
import { SketchFlowchart } from '../components/SketchFlowchart';
import { SketchImage } from '../components/SketchImage';
import { BifurcationBasin } from '../components/BifurcationBasin';
import { Activity, AlertTriangle, TrendingDown, RefreshCcw, Waves, Zap, ShieldAlert, Cpu, Heart, Brain, Globe, History, AlertCircle, TrendingUp } from 'lucide-react';

const TRANSITION_DURATION = 15;
const SCENE_DELAY = 15; 

// A subtle flicker for critical systems
const Flicker: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active = false }) => {
  const frame = useCurrentFrame();
  if (!active) return <>{children}</>;
  const opacity = Math.random() > 0.95 ? 0.3 : 1;
  const offset = Math.random() > 0.95 ? (Math.random() - 0.5) * 5 : 0;
  return (
    <div style={{ opacity, transform: `translateX(${offset}px)` }}>
      {children}
    </div>
  );
};

// Standardized Slide Components
const SceneHeader: React.FC<{ heading: string; subheading: string; color: string; mode: 'light' | 'dark' }> = ({ heading, subheading, color, mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  return (
    <div style={{ position: 'absolute', top: 100, left: 100, width: '80%', textAlign: 'left', zIndex: 10 }}>
        <div style={{ height: 4, width: 60, background: color, marginBottom: 20, borderRadius: 2 }} />
        <ScribbleText text={heading} fontSize={90} color={theme.text} fontWeight={900} delay={SCENE_DELAY} style={{ textAlign: 'left' }} />
        {subheading && (
            <div style={{ marginTop: 10 }}>
                <StaggeredText text={subheading} fontSize={36} color={color} fontWeight={700} delay={SCENE_DELAY + 20} style={{ textAlign: 'left', justifyContent: 'flex-start' }} />
            </div>
        )}
    </div>
  );
};

const DataCallout: React.FC<{ info: string; color: string; mode: 'light' | 'dark' }> = ({ info, color, mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  if (!info) return null;
  const frame = useCurrentFrame();
  const lineSpring = spring({ frame: frame - (SCENE_DELAY + 40), fps: 30, config: { damping: 15 } });

  return (
    <div style={{ position: 'absolute', bottom: 100, left: 100, zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        <div style={{ width: 6, height: lineSpring * 80, backgroundColor: color, borderRadius: 3, boxShadow: `0 0 15px ${color}44` }} />
        <div style={{ maxWidth: 600 }}>
            <div style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.25em', color: color, fontWeight: 900, opacity: lineSpring, marginBottom: 8 }}>Key Insight</div>
            <StaggeredText text={info} fontSize={24} color={theme.text} fontWeight={600} delay={SCENE_DELAY + 50} style={{ textAlign: 'left', justifyContent: 'flex-start' }} />
        </div>
    </div>
  );
};

// --- Specialized Scene Components ---

const UniversalMechanism: React.FC<{ segment: any }> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { mode } = segment;
  const stability = interpolate(frame, [SCENE_DELAY, segment.frames], [0.9, 0.1]);
  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 280, alignItems: 'center', justifyContent: 'center' }}>
        <BifurcationBasin mode={mode} stability={stability} delay={SCENE_DELAY} />
    </AbsoluteFill>
  );
};

const EcosystemScene: React.FC<{ segment: any }> = ({ segment }) => {
  const { mode, heading, subheading, info, id } = segment;
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;
  const accent = kColors.orange;

  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 320 }}>
      <SceneHeader heading={heading} subheading={subheading} color={accent} mode={mode} />
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {id === 'mechanism' ? <UniversalMechanism segment={segment} /> : 
           id === 'discovery' ? (
              <SketchChart data={[
                { label: 'Lake', value: 85 }, { label: 'Forest', value: 92 }, { label: 'Coral', value: 78 }, { label: 'Soil', value: 88 }, { label: 'Tundra', value: 74 }
              ]} type="bar" width={900} height={450} color={accent} title="Signal Presence in Nature" mode={mode} delay={SCENE_DELAY + 40} />
          ) : id === 'sowhat' ? (
              <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                  <SketchImage src="amazon.jpg" width={600} height={400} mode={mode} delay={SCENE_DELAY + 40} label="Amazon Basin" />
                  <div style={{ maxWidth: 400 }}>
                      <StaggeredText text="25% Dieback" fontSize={44} fontWeight={800} color={kColors.lime} delay={SCENE_DELAY + 60} />
                      <StaggeredText text="Rainforest → Savanna" fontSize={28} color={theme.neutral} delay={SCENE_DELAY + 80} />
                  </div>
              </div>
          ) : <Flicker active={id === 'hook'}><DrawnIcon icon={Waves} size={250} color={kColors.cyan} delay={SCENE_DELAY + 40} /></Flicker>}
      </div>
      <DataCallout info={info} color={accent} mode={mode} />
    </AbsoluteFill>
  );
};

const FinanceScene: React.FC<{ segment: any }> = ({ segment }) => {
  const { mode, heading, subheading, info, id } = segment;
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;
  const accent = kColors.cyan;

  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 320 }}>
      <SceneHeader heading={heading} subheading={subheading} color={accent} mode={mode} />
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {id === 'mechanism' ? <UniversalMechanism segment={segment} /> :
           id === 'hook' ? (
              <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                  <SketchImage src="black_monday.jpg" width={600} height={400} mode={mode} delay={SCENE_DELAY + 40} label="Wall Street" />
                  <div style={{ maxWidth: 400 }}>
                      <StaggeredText text="22.6% Crash" fontSize={44} fontWeight={800} color={accent} delay={SCENE_DELAY + 60} />
                      <StaggeredText text="One day drop." fontSize={28} color={theme.neutral} delay={SCENE_DELAY + 80} />
                  </div>
              </div>
          ) : id === 'discovery' ? (
              <SketchChart data={[
                { label: 'Normal', value: 10 }, { label: 'Warning', value: 30 }, { label: 'Peak Variance', value: 90 }
              ]} type="bar" width={800} height={400} color={accent} title="Signal Variance Rise" mode={mode} delay={SCENE_DELAY + 40} />
          ) : <DrawnIcon icon={TrendingDown} size={250} color={kColors.orange} delay={SCENE_DELAY + 40} />}
      </div>
      <DataCallout info={info} color={accent} mode={mode} />
    </AbsoluteFill>
  );
};

const CivilizationScene: React.FC<{ segment: any }> = ({ segment }) => {
  const { mode, heading, subheading, info, id } = segment;
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;
  const accent = kColors.purple;

  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 320 }}>
      <SceneHeader heading={heading} subheading={subheading} color={accent} mode={mode} />
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {id === 'mechanism' ? <UniversalMechanism segment={segment} /> :
           id === 'discovery' ? (
              <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                  <SketchImage src="roman_ruins.jpg" width={600} height={400} mode={mode} delay={SCENE_DELAY + 40} label="Imperial Cost" />
                  <div style={{ maxWidth: 400 }}>
                      <StaggeredText text="Army vs Plunder" fontSize={44} fontWeight={800} color={accent} delay={SCENE_DELAY + 60} />
                      <StaggeredText text="Negative ROI." fontSize={28} color={theme.neutral} delay={SCENE_DELAY + 80} />
                  </div>
              </div>
          ) : id === 'hook' ? (
              <SketchGraph 
                equations={[{ fn: "x * Math.exp(-0.2 * x)", color: accent, label: "Return on Complexity" }]}
                width={800} height={450} scale={40} mode={mode} xAxisLabel="Complexity Level" yAxisLabel="Benefit" delay={SCENE_DELAY + 40} />
          ) : <DrawnIcon icon={History} size={250} color={kColors.pink} delay={SCENE_DELAY + 40} />}
      </div>
      <DataCallout info={info} color={accent} mode={mode} />
    </AbsoluteFill>
  );
};

const BodyScene: React.FC<{ segment: any }> = ({ segment }) => {
  const { mode, heading, subheading, info, id } = segment;
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;
  const accent = kColors.lime;

  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 320 }}>
      <SceneHeader heading={heading} subheading={subheading} color={accent} mode={mode} />
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {id === 'mechanism' ? <UniversalMechanism segment={segment} /> :
           id === 'discovery' ? (
              <SketchChart data={[
                { label: '-4h', value: 20 }, { label: '-2h', value: 25 }, { label: '-1h', value: 45 }, { label: '-30m', value: 85 }
              ]} type="line" width={900} height={450} color={accent} title="Pre-Seizure Signal Variance" mode={mode} delay={SCENE_DELAY + 40} />
          ) : id === 'sowhat' ? (
              <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                  <SketchImage src="brain_scan.jpg" width={500} height={500} mode={mode} delay={SCENE_DELAY + 40} label="Patient Monitoring" />
                  <div style={{ maxWidth: 500 }}>
                      <StaggeredText text="Early Warning" fontSize={38} fontWeight={800} color={kColors.blue} delay={SCENE_DELAY + 60} />
                      <StaggeredText text="Neural flickers detected." fontSize={28} color={theme.neutral} delay={SCENE_DELAY + 80} />
                  </div>
              </div>
          ) : <Flicker active={id === 'hook'}><div style={{ display: 'flex', gap: 40 }}><DrawnIcon icon={Brain} size={200} color={kColors.pink} delay={SCENE_DELAY + 40} /><DrawnIcon icon={Heart} size={200} color={kColors.red} delay={SCENE_DELAY + 60} /></div></Flicker>}
      </div>
      <DataCallout info={info} color={accent} mode={mode} />
    </AbsoluteFill>
  );
};

const ClimateScene: React.FC<{ segment: any }> = ({ segment }) => {
  const { mode, heading, subheading, info, id } = segment;
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  const kColors = Theme.colors.kurzgesagt;
  const accent = kColors.cyan;

  return (
    <AbsoluteFill style={{ padding: 100, paddingTop: 320 }}>
      <SceneHeader heading={heading} subheading={subheading} color={accent} mode={mode} />
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {id === 'mechanism' ? <UniversalMechanism segment={segment} /> :
           id === 'hook' ? (
              <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                  <SketchImage src="ice_cores.jpg" width={600} height={400} mode={mode} delay={SCENE_DELAY + 40} label="Greenland Ice" />
                  <div style={{ maxWidth: 400 }}>
                      <StaggeredText text="Ancient Proxy" fontSize={44} fontWeight={800} color={accent} delay={SCENE_DELAY + 60} />
                      <StaggeredText text="Climate memory." fontSize={28} color={theme.neutral} delay={SCENE_DELAY + 80} />
                  </div>
              </div>
          ) : id === 'discovery' ? (
              <SketchFlowchart 
                  width={1000} height={550} mode={mode}
                  nodes={[
                      { id: 'ice', x: 200, y: 250, text: 'Greenland Ice', type: 'rect' },
                      { id: 'amoc', x: 500, y: 250, text: 'AMOC', type: 'diamond' },
                      { id: 'amazon', x: 800, y: 250, text: 'Amazon', type: 'rect' }
                  ]}
                  edges={[{ from: 'ice', to: 'amoc' }, { from: 'amoc', to: 'amazon' }]}
                  color={accent} title="Planetary Dominoes" delay={SCENE_DELAY + 40}
              />
          ) : <DrawnIcon icon={AlertCircle} size={250} color={kColors.red} delay={SCENE_DELAY + 40} />}
      </div>
      <DataCallout info={info} color={accent} mode={mode} />
    </AbsoluteFill>
  );
};

// --- Main Metaphor Component ---

const PolishedPaper: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const theme = mode === 'dark' ? Theme.colors.dark : Theme.colors.light;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper, zIndex: -10, overflow: 'hidden' }}>
      <img src={staticFile('paper-texture.svg')} style={{ position: 'absolute', width: '100%', height: '100%', opacity: mode === 'dark' ? 0.05 : 0.1, mixBlendMode: 'multiply' }} alt="" />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: mode === 'dark' ? 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.5) 100%)' : 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.08) 100%)' }} />
    </AbsoluteFill>
  );
};

const Watermark: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => {
  const logo = mode === 'dark' ? 'logo-dark.svg' : 'logo.svg';
  return (
    <div style={{ position: 'absolute', top: 60, right: 60, opacity: 0.8, zIndex: 100 }}>
        <img src={staticFile(logo)} style={{ width: 100, height: 100 }} alt="EulerFold Logo" />
    </div>
  );
};

export const Collapse: React.FC<{ timingData: any[] }> = ({ timingData }) => {
  const videoName = timingData[0].audio_path.split('/')[1];

  const SceneRouter: React.FC<{ segment: any }> = ({ segment }) => {
    if (videoName.includes('ecosystems')) return <EcosystemScene segment={segment} />;
    if (videoName.includes('finance')) return <FinanceScene segment={segment} />;
    if (videoName.includes('civilizations')) return <CivilizationScene segment={segment} />;
    if (videoName.includes('body')) return <BodyScene segment={segment} />;
    if (videoName.includes('climate')) return <ClimateScene segment={segment} />;
    return null;
  };

  return (
    <AbsoluteFill>
      <PolishedPaper mode={timingData[0].mode} />
      <Watermark mode={timingData[0].mode} />
      {timingData.map((segment: any) => (
        <Sequence key={`audio-${segment.id}`} from={segment.start_frame} durationInFrames={segment.frames}>
          <Audio src={staticFile(segment.audio_path)} />
        </Sequence>
      ))}
      <TransitionSeries>
        {timingData.map((segment: any, i: number) => {
          const isLast = i === timingData.length - 1;
          if (isLast) {
            return (
               <TransitionSeries.Sequence key={segment.id} durationInFrames={segment.frames}>
                  <ProfessionalOutro mode={segment.mode as 'dark'} />
               </TransitionSeries.Sequence>
            );
          }
          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={segment.frames}>
                <SceneRouter segment={segment} />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_DURATION })} />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
