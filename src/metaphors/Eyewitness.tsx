import React, { useEffect, useRef } from 'react';
import { AbsoluteFill, useVideoConfig, spring, staticFile, Audio, useCurrentFrame, interpolate, Sequence } from 'remotion';
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import rough from 'roughjs/bin/rough';
import { Theme } from '../styles/theme';
import { 
  Gavel, Scale, Fingerprint, Dna, AlertTriangle, Camera, 
  FileText, ArrowRight, Brain, ShieldAlert, History, 
  Car, ShoppingBag, UserCircle, Search, Eye, CheckCircle2, 
  UserX, MessageSquare, ClipboardCheck, Info
} from 'lucide-react';

import { DrawnIcon } from '../components/DrawnIcon';
import { SketchyBox } from '../components/SketchyBox';
import { MarkerHighlight } from '../components/MarkerHighlight';
import { ScribbleText } from '../components/ScribbleText';
import { SketchChart } from '../components/SketchChart';
import { StaggeredText } from '../components/StaggeredText';
import { JitterGroup } from '../components/JitterGroup';
import { SketchFlowchart } from '../components/SketchFlowchart';
import { SketchCar } from '../components/SketchCar';
import { SketchScatter } from '../components/SketchScatter';
import { EraseReveal } from '../components/EraseReveal';

import { SketchFilterImage } from '../components/SketchFilterImage';

const PADDING = 80;
const TRANSITION_DURATION = 15;
const SCENE_START_DELAY = 10;

const getEyewitnessTheme = (mode: 'light' | 'dark') => {
  return {
    ...Theme.colors.light,
    paper: '#4a4a44',   // KAN Dark gray-brown
    text: '#ffffff',    // White text
    accent: '#fde047',  // Yellow accent
    border: '#fde047',  // Yellow border
    neutral: '#cbd5e1', // Light gray
  };
};

const theme = getEyewitnessTheme('light');

const SketchbookPaper: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
      backgroundColor: theme.paper, 
      zIndex: -10 
    }} />
  );
};

const SceneTitle: React.FC<{ text: string; subtitle?: string; color?: string; accent?: string }> = ({ text, subtitle, color = theme.text, accent = theme.accent }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      marginBottom: 60, 
      marginTop: 40,
      width: '100%'
    }}>
      <ScribbleText
        text={text}
        fontSize={80}
        color={color}
        delay={SCENE_START_DELAY}
        duration={30}
        style={{ justifyContent: 'center' }}
      />
      {subtitle && (
        <div style={{ marginTop: 20 }}>
           <MarkerHighlight color={accent} delay={SCENE_START_DELAY + 30} duration={30} opacity={0.3}>
              <span style={{ fontSize: 36, color: theme.neutral, fontWeight: 500, padding: '0 20px' }}>{subtitle}</span>
           </MarkerHighlight>
        </div>
      )}
    </div>
  );
};

// --- Scene Components ---

const HookIntro: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
      <SceneTitle text="Eyewitness Testimony" subtitle="The Power of Absolute Certainty" />
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 80, width: '100%', maxWidth: 1600 }}>
         <div style={{ position: 'relative', width: 900, height: 600 }}>
            {/* Show Jury first */}
            <Sequence from={0} durationInFrames={200}>
               <SketchFilterImage src="jury.jpg" width={900} height={600} delay={20} />
            </Sequence>
            
            {/* Show Courtroom/Stand next */}
            <Sequence from={200} durationInFrames={250}>
               <SketchFilterImage src="courtroom.jpg" width={900} height={600} delay={0} />
            </Sequence>

            {/* Show Judge for the William Brennan quote */}
            <Sequence from={450}>
               <SketchFilterImage src="judge.jpg" width={900} height={600} delay={0} />
            </Sequence>
         </div>

         <div style={{ width: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Sequence from={0} durationInFrames={200}>
               <ScribbleText text="Imagine you&apos;re on a jury." fontSize={60} color={theme.text} delay={40} />
            </Sequence>
            <Sequence from={200} durationInFrames={250}>
               <ScribbleText text='"That&apos;s him. I will never forget that face."' fontSize={60} color={theme.accent} delay={20} />
            </Sequence>
            <Sequence from={450}>
               <div style={{ borderLeft: `10px solid ${theme.accent}`, paddingLeft: 40 }}>
                  <StaggeredText text='"There is almost nothing more convincing than a live human being..."' fontSize={36} color={theme.neutral} delay={30} />
                  <div style={{ marginTop: 30, textAlign: 'right' }}>
                     <span style={{ color: theme.accent, fontSize: 28, fontWeight: 800 }}>— Justice William Brennan</span>
                  </div>
               </div>
            </Sequence>
         </div>
      </div>
    </AbsoluteFill>
  );
};

const HookProblem: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="The Reconstruction Problem" subtitle="Statistically Unreliable" color="#f87171" accent="#f87171" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 1400 }}>
       <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <ScribbleText text="Memory is NOT a Recording." fontSize={100} color={theme.text} delay={SCENE_START_DELAY + 20} style={{ justifyContent: 'center' }} />
          <div style={{ height: 8, width: 400, background: '#ef4444', margin: '40px auto' }} />
          <ScribbleText text="It is a Reconstruction." fontSize={100} color={theme.accent} delay={SCENE_START_DELAY + 60} style={{ justifyContent: 'center' }} />
       </div>
       <div style={{ width: 1000, textAlign: 'center' }}>
          <StaggeredText text="Every time you remember, you are rebuilding the past from fragments. And fragments can be wrong." fontSize={48} color={theme.neutral} delay={SCENE_START_DELAY + 100} />
       </div>
    </div>
  </AbsoluteFill>
);

const NumbersIntro: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="The Scale of Error" subtitle="Data from the Innocence Project" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', maxWidth: 1400 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, marginTop: 40 }}>
         <div style={{ borderLeft: `12px solid #ef4444`, paddingLeft: 50 }}>
               <ScribbleText text="70%" fontSize={140} color="#ef4444" delay={SCENE_START_DELAY + 20} />
               <StaggeredText text="of DNA exonerations involved eyewitness misidentification" fontSize={40} delay={SCENE_START_DELAY + 50} />
         </div>
         <div style={{ borderLeft: `12px solid ${theme.text}`, paddingLeft: 50 }}>
               <ScribbleText text="375+" fontSize={140} color={theme.text} delay={SCENE_START_DELAY + 40} />
               <StaggeredText text="People exonerated by DNA evidence in the US" fontSize={40} delay={SCENE_START_DELAY + 70} />
         </div>
      </div>
      <div style={{ marginTop: 100, borderTop: `2px solid ${theme.neutral}`, paddingTop: 80, textAlign: 'center' }}>
            <ScribbleText text="14 Years" fontSize={140} color={theme.accent} delay={SCENE_START_DELAY + 60} style={{ justifyContent: 'center' }} />
            <StaggeredText text="Average time wrongfully imprisoned before exoneration" fontSize={40} delay={SCENE_START_DELAY + 90} />
      </div>
    </div>
  </AbsoluteFill>
);

const NumbersLineups: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="A Coin Flip with Failure" subtitle="Real-world Lineup Errors" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120, width: '100%', maxWidth: 1600 }}>
       <div style={{ textAlign: 'center' }}>
          <DrawnIcon icon={UserX} size={350} color="#ef4444" delay={SCENE_START_DELAY} />
          <ScribbleText text="1 in 3" fontSize={120} color="#ef4444" delay={SCENE_START_DELAY + 40} style={{ justifyContent: 'center' }} />
       </div>
       <div style={{ width: 800 }}>
          <StaggeredText text="In real police lineups, one in three identifications are wrong." fontSize={54} fontWeight={700} delay={SCENE_START_DELAY + 60} />
          <div style={{ marginTop: 60 }}>
            <MarkerHighlight color="#ef4444" delay={SCENE_START_DELAY + 100} opacity={0.3}>
               <span style={{ fontSize: 48, color: theme.text, padding: '15px 30px', fontWeight: 800 }}>Certainty != Accuracy</span>
            </MarkerHighlight>
          </div>
       </div>
    </div>
  </AbsoluteFill>
);

const NumbersEvidenceChart: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="Evidence Reliability" subtitle="False Positive Rates (Higher is worse)" />
    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SketchChart 
         type="bar"
         data={[
           { label: 'DNA', value: 0.1 },
           { label: 'Fingerprint', value: 1 },
           { label: 'Surveillance', value: 7 },
           { label: 'Eyewitness (Lineup)', value: 33 }
         ]}
         width={1500}
         height={700}
         color={theme.accent}
         maxValue={40}
         yAxisLabel="False Positive Rate (%)"
         delay={SCENE_START_DELAY + 20}
         mode="dark"
      />
    </div>
  </AbsoluteFill>
);

const MemoryCamera: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <DrawnIcon icon={Camera} size={500} color={theme.neutral} delay={SCENE_START_DELAY} />
        <EraseReveal delay={SCENE_START_DELAY + 60} color="#ef4444" strokeWidth={40}>
           <div style={{ width: 500, height: 500 }} />
        </EraseReveal>
      </div>
      <div style={{ marginTop: 60 }}>
        <ScribbleText text="Memory is NOT a Camera" fontSize={120} color="#f87171" delay={SCENE_START_DELAY + 80} style={{ justifyContent: 'center' }} />
        <StaggeredText text="It is a reconstructive process." fontSize={60} color={theme.neutral} delay={SCENE_START_DELAY + 120} />
      </div>
    </div>
  </AbsoluteFill>
);

const MemoryWiki: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="The Wikipedia Metaphor" />
    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 1200, padding: 80, border: `4px solid ${theme.neutral}`, borderRadius: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 60 }}>
             <DrawnIcon icon={FileText} size={100} color={theme.accent} delay={SCENE_START_DELAY + 20} />
             <ScribbleText text="Article: My Memory" fontSize={80} delay={SCENE_START_DELAY + 40} />
          </div>
          <div style={{ height: 2, background: theme.neutral, opacity: 0.3, marginBottom: 60 }} />
          <StaggeredText text="Original Event: [Locked 1984]" fontSize={48} color={theme.neutral} delay={SCENE_START_DELAY + 60} />
          
          <div style={{ marginTop: 80, paddingLeft: 50, borderLeft: `15px solid ${theme.accent}` }}>
             <ScribbleText text="Latest Revision: Just Now" fontSize={60} color={theme.accent} delay={SCENE_START_DELAY + 90} />
             <StaggeredText text="Integrated details from news, police, and other witnesses." fontSize={40} delay={SCENE_START_DELAY + 120} />
          </div>
          <div style={{ marginTop: 80, textAlign: 'right' }}>
             <MarkerHighlight color={theme.accent} opacity={0.3} delay={SCENE_START_DELAY + 150}>
                <span style={{ fontSize: 44, fontStyle: 'italic', padding: '15px 30px', fontWeight: 500 }}>"The updated version just feels like the truth."</span>
             </MarkerHighlight>
          </div>
      </div>
    </div>
  </AbsoluteFill>
);

const MemoryStages: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="3 Stages of Memory" subtitle="Where things go wrong" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -40 }}>
      <SketchFlowchart 
        nodes={[
          { id: '1', x: 200, y: 300, text: 'Acquisition', type: 'rect' },
          { id: '2', x: 750, y: 300, text: 'Storage', type: 'rect' },
          { id: '3', x: 1300, y: 300, text: 'Retrieval', type: 'rect' }
        ]}
        edges={[
          { from: '1', to: '2' },
          { from: '2', to: '3' }
        ]}
        width={1500}
        height={600}
        color={theme.accent}
        delay={SCENE_START_DELAY}
        mode="dark"
      />
    </div>
    <div style={{ position: 'absolute', bottom: 150, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '0 100px' }}>
       <div style={{ width: 450, textAlign: 'center' }}>
          <ScribbleText text="Weapon Focus" fontSize={44} color="#f87171" delay={SCENE_START_DELAY + 40} style={{ justifyContent: 'center' }} />
          <StaggeredText text="Stress narrows attention" fontSize={32} color={theme.neutral} delay={SCENE_START_DELAY + 50} />
       </div>
       <div style={{ width: 450, textAlign: 'center' }}>
          <ScribbleText text="Contamination" fontSize={44} color="#f87171" delay={SCENE_START_DELAY + 60} style={{ justifyContent: 'center' }} />
          <StaggeredText text="News, photos, talking" fontSize={32} color={theme.neutral} delay={SCENE_START_DELAY + 70} />
       </div>
       <div style={{ width: 450, textAlign: 'center' }}>
          <ScribbleText text="Lineup Pressure" fontSize={44} color="#f87171" delay={SCENE_START_DELAY + 80} style={{ justifyContent: 'center' }} />
          <StaggeredText text="Suggestive questions" fontSize={32} color={theme.neutral} delay={SCENE_START_DELAY + 90} />
       </div>
    </div>
  </AbsoluteFill>
);

const MemoryStorageRetrieval: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', gap: 120, alignItems: 'center', justifyContent: 'center', maxWidth: 1600 }}>
       <DrawnIcon icon={ShieldAlert} size={400} color={theme.accent} delay={SCENE_START_DELAY} />
       <div style={{ width: 850 }}>
          <ScribbleText text="Memory Contamination" fontSize={90} color={theme.text} delay={SCENE_START_DELAY + 40} />
          <div style={{ height: 6, width: 300, background: theme.accent, margin: '40px 0' }} />
          <StaggeredText text="External information gets woven into the original memory until you can't tell the difference." fontSize={48} color={theme.neutral} delay={SCENE_START_DELAY + 80} />
       </div>
    </div>
  </AbsoluteFill>
);

const LoftusIntro: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="Elizabeth Loftus" subtitle="The Researcher Who Proved Memory Is Malleable" />
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 150, maxWidth: 1600 }}>
       <DrawnIcon icon={UserCircle} size={400} color={theme.accent} delay={SCENE_START_DELAY} />
       <div style={{ width: 800 }}>
             <ScribbleText text="50 Years of Research" fontSize={80} color={theme.text} delay={SCENE_START_DELAY + 40} />
             <div style={{ height: 6, width: 250, background: theme.accent, margin: '40px 0' }} />
             <StaggeredText text="Proved that false memories can be implanted through simple suggestion." fontSize={44} delay={SCENE_START_DELAY + 80} />
       </div>
    </div>
  </AbsoluteFill>
);

const LoftusHitSmash: React.FC = () => {
  const frame = useCurrentFrame();
  const carProgress = spring({ frame: frame - SCENE_START_DELAY, fps: 30, config: { damping: 12 } });
  
  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
      <SceneTitle text='"Hit" vs "Smashed"' subtitle="One word changes the memory" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: -60, width: '100%' }}>
         <div style={{ width: 1400, height: 500, position: 'relative' }}>
            <div style={{ position: 'absolute', left: interpolate(carProgress, [0, 1], [0, 520]) }}>
               <SketchCar color={theme.neutral} delay={SCENE_START_DELAY} />
            </div>
            <div style={{ position: 'absolute', right: interpolate(carProgress, [0, 1], [0, 520]), transform: 'scaleX(-1)' }}>
               <SketchCar color={theme.accent} delay={SCENE_START_DELAY} />
            </div>
         </div>
         
         <div style={{ display: 'flex', gap: 150, marginTop: 60 }}>
            <div style={{ textAlign: 'center', borderBottom: `10px solid ${theme.neutral}`, padding: '0 60px 30px 60px' }}>
                  <ScribbleText text='"Hit"' fontSize={100} color={theme.text} delay={SCENE_START_DELAY + 60} />
                  <StaggeredText text="31.8 mph" fontSize={64} color={theme.neutral} delay={SCENE_START_DELAY + 90} />
            </div>
            <div style={{ textAlign: 'center', borderBottom: `10px solid ${theme.accent}`, padding: '0 60px 30px 60px' }}>
                  <ScribbleText text='"Smashed"' fontSize={100} color={theme.accent} delay={SCENE_START_DELAY + 80} />
                  <StaggeredText text="40.8 mph" fontSize={64} color={theme.accent} delay={SCENE_START_DELAY + 110} />
            </div>
         </div>
      </div>
    </AbsoluteFill>
  );
};

const LoftusMall: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text='"Lost in the Mall"' subtitle="Implanting Whole Events" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120, maxWidth: 1600 }}>
       <DrawnIcon icon={ShoppingBag} size={400} color={theme.accent} delay={SCENE_START_DELAY} />
       <div style={{ width: 900 }}>
                <ScribbleText text="25% of Participants" fontSize={110} color={theme.accent} delay={SCENE_START_DELAY + 40} />
                <div style={{ height: 6, width: 300, background: theme.accent, margin: '40px 0' }} />
                <StaggeredText text="...believed they were lost as children even though it never happened." fontSize={44} delay={SCENE_START_DELAY + 80} />
          <div style={{ marginTop: 60 }}>
             <MarkerHighlight color={theme.accent} opacity={0.3} delay={SCENE_START_DELAY + 120}>
                <span style={{ fontSize: 38, padding: '15px 30px', fontWeight: 500 }}>They even added their own false sensory details.</span>
             </MarkerHighlight>
          </div>
       </div>
    </div>
  </AbsoluteFill>
);

const CottonIntro: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="Ronald Cotton Case" subtitle="The Ideal Eyewitness Error" />
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 150, maxWidth: 1600 }}>
       <DrawnIcon icon={History} size={400} color={theme.text} delay={SCENE_START_DELAY} />
       <div style={{ width: 900 }}>
          <ScribbleText text="Jennifer Thompson" fontSize={100} color={theme.accent} delay={SCENE_START_DELAY + 40} />
          <div style={{ height: 6, width: 200, background: theme.accent, margin: '40px 0' }} />
          <StaggeredText text="She did everything right. She was motivated, attentive, and certain." fontSize={48} delay={SCENE_START_DELAY + 80} />
          <div style={{ marginTop: 60, borderLeft: `10px solid ${theme.neutral}`, paddingLeft: 40 }}>
             <span style={{ fontStyle: 'italic', fontSize: 40, color: theme.neutral }}>"I will never forget that face."</span>
          </div>
       </div>
    </div>
  </AbsoluteFill>
);

const CottonID: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="The Identification" subtitle="Photo and Physical Lineups" />
    <div style={{ display: 'flex', gap: 60, marginTop: 60 }}>
       {[1, 2, 3, 4, 5, 6].map(i => (
         <div key={i} style={{ width: 240, height: 360, border: `4px solid ${i === 4 ? theme.accent : theme.neutral}`, position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <UserCircle size={200} color={i === 4 ? theme.accent : theme.neutral} opacity={0.3} />
               {i === 4 && (
                 <div style={{ position: 'absolute', top: 20, right: 20 }}>
                    <CheckCircle2 color={theme.accent} size={60} />
                 </div>
               )}
            </div>
         </div>
       ))}
    </div>
    <div style={{ marginTop: 120, textAlign: 'center' }}>
       <ScribbleText text="Complete Certainty." fontSize={120} color={theme.accent} delay={SCENE_START_DELAY + 100} style={{ justifyContent: 'center' }} />
       <StaggeredText text="Sentenced to life + 54 years." fontSize={60} color={theme.neutral} delay={SCENE_START_DELAY + 140} />
    </div>
  </AbsoluteFill>
);

const CottonExoneration: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', gap: 150, alignItems: 'center', justifyContent: 'center', maxWidth: 1600 }}>
       <DrawnIcon icon={Dna} size={450} color={theme.accent} delay={SCENE_START_DELAY} />
       <div style={{ width: 950 }}>
          <ScribbleText text="11 Years Later" fontSize={120} color={theme.accent} delay={SCENE_START_DELAY + 40} />
          <ScribbleText text="DNA Proves Innocence" fontSize={80} delay={SCENE_START_DELAY + 80} />
          <div style={{ height: 6, width: 250, background: theme.accent, margin: '40px 0' }} />
          <StaggeredText text="The actual perpetrator was Bobby Poole, who wasn't even in the original lineup." fontSize={44} color={theme.neutral} delay={SCENE_START_DELAY + 120} />
       </div>
    </div>
  </AbsoluteFill>
);

const CottonFactors: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="Why was she wrong?" subtitle="The Perfect Storm of Errors" />
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 120, marginTop: 40, padding: '0 100px', width: '100%', maxWidth: 1600 }}>
       <div style={{ borderLeft: `10px solid ${theme.accent}`, paddingLeft: 40 }}>
             <ScribbleText text="Cross-Race Effect" fontSize={60} color={theme.accent} delay={SCENE_START_DELAY + 20} />
             <StaggeredText text="Accuracy drops identifying other racial groups." fontSize={36} delay={SCENE_START_DELAY + 50} />
       </div>
       <div style={{ borderLeft: `10px solid ${theme.accent}`, paddingLeft: 40 }}>
             <ScribbleText text="Stress & Trauma" fontSize={60} color={theme.accent} delay={SCENE_START_DELAY + 40} />
             <StaggeredText text="High stress narrows attention (Weapon Focus)." fontSize={36} delay={SCENE_START_DELAY + 70} />
       </div>
       <div style={{ borderLeft: `10px solid ${theme.accent}`, paddingLeft: 40 }}>
             <ScribbleText text="Repeated Recall" fontSize={60} color={theme.accent} delay={SCENE_START_DELAY + 60} />
             <StaggeredText text="Each ID reinforced the reconstruction." fontSize={36} delay={SCENE_START_DELAY + 90} />
       </div>
       <div style={{ borderLeft: `10px solid ${theme.accent}`, paddingLeft: 40 }}>
             <ScribbleText text="Relative Judgment" fontSize={60} color={theme.accent} delay={SCENE_START_DELAY + 80} />
             <StaggeredText text="Picking who looks 'most like' the suspect." fontSize={36} delay={SCENE_START_DELAY + 110} />
       </div>
    </div>
  </AbsoluteFill>
);

const LineupsFailure: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="The Lineup Problem" subtitle="How Systems Induce Error" />
    <div style={{ flex: 1, display: 'flex', gap: 120, marginTop: 60, justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 1600 }}>
       <div style={{ width: 700, borderTop: `8px solid #f87171`, paddingTop: 50 }}>
                <DrawnIcon icon={UserX} size={120} color="#f87171" delay={SCENE_START_DELAY} />
                <ScribbleText text="Relative Judgment" fontSize={64} color="#f87171" delay={SCENE_START_DELAY + 40} />
                <StaggeredText text="Choosing the best match rather than an absolute match." fontSize={40} delay={SCENE_START_DELAY + 80} />
       </div>
       <div style={{ width: 700, borderTop: `8px solid ${theme.accent}`, paddingTop: 50 }}>
                <DrawnIcon icon={Eye} size={120} color={theme.accent} delay={SCENE_START_DELAY} />
                <ScribbleText text="Admin Influence" fontSize={64} color={theme.accent} delay={SCENE_START_DELAY + 60} />
                <StaggeredText text="Subtle cues from detectives who know the suspect." fontSize={40} delay={SCENE_START_DELAY + 100} />
       </div>
    </div>
  </AbsoluteFill>
);

const LineupsConfidence: React.FC = () => {
  const points = [
    { x: 20, y: 30, color: '#f87171' },
    { x: 30, y: 45, color: '#f87171' },
    { x: 45, y: 40, color: '#f87171' },
    { x: 60, y: 70, color: theme.accent },
    { x: 70, y: 55, color: '#f87171' },
    { x: 85, y: 90, color: theme.accent },
    { x: 90, y: 60, color: '#f87171' },
    { x: 95, y: 95, color: theme.accent },
    { x: 98, y: 40, color: '#f87171' },
  ];

  return (
    <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
      <SceneTitle text="Confidence != Accuracy" subtitle="The Weak Correlation" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <SketchScatter 
          data={points}
          width={1200}
          height={700}
          xAxisLabel="Witness Confidence at Trial"
          yAxisLabel="Accuracy"
          delay={SCENE_START_DELAY}
          mode="dark"
        />
        <div style={{ position: 'absolute', right: 100, bottom: 200, width: 550 }}>
           <MarkerHighlight color="#f87171" opacity={0.3} delay={SCENE_START_DELAY + 100}>
              <div style={{ padding: 30, fontSize: 44, fontWeight: 'bold', color: theme.text, lineHeight: 1.4 }}>Confidence Inflates Over Time. Accuracy Does Not.</div>
           </MarkerHighlight>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NuanceReforms: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
    <SceneTitle text="Evidence-Based Reforms" subtitle="Bridging the Gap" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 50, marginTop: 20, padding: '0 100px', width: '100%', maxWidth: 1600, justifyContent: 'center' }}>
       {[
         { icon: Eye, title: "Double-Blind Lineups", desc: "Administrator doesn't know who the suspect is." },
         { icon: List, title: "Sequential Presentation", desc: "One photo at a time, not all at once." },
         { icon: MessageSquare, title: "Confidence Statements", desc: "Recorded immediately at the moment of ID." },
         { icon: Info, title: "Pre-Lineup Instruction", desc: "Told clearly: 'The suspect may not be present'." }
       ].map((item, i) => (
         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 60, borderLeft: `10px solid ${theme.accent}`, paddingLeft: 50 }}>
               <DrawnIcon icon={item.icon} size={100} color={theme.accent} delay={SCENE_START_DELAY + i * 20 + 20} />
               <div>
                  <ScribbleText text={item.title} fontSize={60} color={theme.text} delay={SCENE_START_DELAY + i * 20 + 40} />
                  <StaggeredText text={item.desc} fontSize={40} color={theme.neutral} delay={SCENE_START_DELAY + i * 20 + 60} />
               </div>
         </div>
       ))}
    </div>
  </AbsoluteFill>
);

const OutroFragile: React.FC = () => (
  <AbsoluteFill style={{ padding: PADDING, alignItems: 'center', justifyContent: 'center' }}>
     <JitterGroup amount={2}>
        <div style={{ width: 1200, height: 900, border: `8px solid ${theme.accent}`, borderRadius: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 100, padding: 100 }}>
              <DrawnIcon icon={Brain} size={300} color={theme.accent} delay={SCENE_START_DELAY + 20} />
              <div style={{ textAlign: 'center' }}>
                  <ScribbleText text='"Memory, like liberty, is a fragile thing."' fontSize={100} fontWeight={900} color={theme.text} delay={SCENE_START_DELAY + 40} style={{ justifyContent: 'center' }} />
                  <div style={{ height: 6, width: 600, background: theme.accent, margin: '50px auto' }} />
                  <StaggeredText text="Elizabeth Loftus" fontSize={60} color={theme.neutral} delay={SCENE_START_DELAY + 70} />
              </div>
              <div style={{ marginTop: 40 }}>
                  <StaggeredText text="www.eulerfold.com" fontSize={80} fontWeight={700} color={theme.accent} delay={SCENE_START_DELAY + 120} />
              </div>
        </div>
     </JitterGroup>
  </AbsoluteFill>
);


// Helper for Lucide icon List since it conflicts with global List
const List = ClipboardCheck;

export const Eyewitness: React.FC<{ timingData: any[] }> = ({ timingData }) => {
  const scenes = [
    HookIntro, HookProblem, NumbersIntro, NumbersLineups, NumbersEvidenceChart,
    MemoryCamera, MemoryWiki, MemoryStages, MemoryStorageRetrieval,
    LoftusIntro, LoftusHitSmash, LoftusMall,
    CottonIntro, CottonID, CottonExoneration, CottonFactors,
    LineupsFailure, LineupsConfidence, NuanceReforms, OutroFragile
  ];
  
  return (
    <AbsoluteFill>
      <SketchbookPaper />

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
          const visualDuration = isLast ? (segment.frames || 0) + 60 : (segment.frames || 0);

          return (
            <React.Fragment key={segment.id}>
              <TransitionSeries.Sequence durationInFrames={visualDuration}>
                <SceneComponent />
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
