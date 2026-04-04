import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PvSNP } from './metaphors/PvSNP';
import timingData from './data/active_video.json';

interface MainProps {
  fontFamily: string;
}

// Simple router to switch between metaphors based on the active video data
export const Main: React.FC<MainProps> = ({ fontFamily }) => {
  // We can detect the video type from the IDs in timingData or by looking at the directory structure
  // For now, let's look at the first ID to decide which metaphor to use
  const firstId = timingData[0]?.id;
  
  if (firstId === 'hook' && timingData.some(d => d.id === 'np_def')) {
    return <PvSNP timingData={timingData} />;
  }

  // Fallback or default to original Main logic if needed, 
  // but since we are refactoring, let's assume we use metaphors now.
  return (
    <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
       <h1 style={{ color: 'black', fontFamily }}>Unknown Video Metaphor</h1>
    </AbsoluteFill>
  );
};
