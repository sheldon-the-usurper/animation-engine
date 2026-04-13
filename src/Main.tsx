import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PvSNP } from './metaphors/PvSNP';
import { Collapse } from './metaphors/Collapse';
import { KAN } from './metaphors/KAN';
import { Eyewitness } from './metaphors/Eyewitness';
import timingData from './data/active_video.json';

interface MainProps {
  fontFamily: string;
}

// Simple router to switch between metaphors based on the active video data
export const Main: React.FC<MainProps> = ({ fontFamily }) => {
  // We can detect the video type from the IDs in timingData or by looking at the directory structure
  // For now, let's look at the first ID to decide which metaphor to use
  const firstId = timingData[0]?.id;
  
  // P=NP check
  if (firstId === 'hook' && timingData.some(d => d.id === 'np_def')) {
    return <PvSNP timingData={timingData} />;
  }

  // KAN check
  if (timingData.some(d => d.id === 'mlp_background' || d.id === 'core_idea')) {
    return <KAN timingData={timingData} />;
  }

  // Eyewitness check
  if (timingData.some(d => d.id === 'hook_intro' || d.id === 'memory_camera')) {
    return <Eyewitness timingData={timingData} />;
  }

  // Collapse check (Hidden Mathematics of Collapse series)
  if (timingData.some(d => d.heading && d.heading.toLowerCase().includes('collapse') || d.id === 'hook')) {
    return <Collapse timingData={timingData} />;
  }

  // Fallback or default to original Main logic if needed, 
  // but since we are refactoring, let's assume we use metaphors now.
  return (
    <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
       <h1 style={{ color: 'black', fontFamily }}>Unknown Video Metaphor: {firstId}</h1>
    </AbsoluteFill>
  );
};
