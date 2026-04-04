import { registerRoot, Composition } from 'remotion';
import { Main } from './Main';
import { loadFont } from "@remotion/google-fonts/ArchitectsDaughter";
import timingData from './data/active_video.json';

// Load high-quality handwritten/hand-drawn style font
const { fontFamily } = loadFont('normal', {
  weights: ["400"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true
});

// Calculate total frames from timing data - purely based on sequential audio lengths
const totalFrames = timingData.reduce((acc: number, segment: any) => acc + segment.frames, 0);

registerRoot(() => {
  return (
    <Composition
      id="ComponentShowcase"
      component={Main}
      durationInFrames={totalFrames}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        fontFamily,
      }}
    />
  );
});
