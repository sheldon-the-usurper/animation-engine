export const Theme = {
  colors: {
    kurzgesagt: {
      yellow: '#fde047',
      orange: '#fb923c',
      pink: '#f472b6',
      cyan: '#22d3ee',
      lime: '#a3e635',
      red: '#f87171',
      blue: '#60a5fa',
      purple: '#c084fc',
    },
    teal: '#0F766E',
    light: {
      paper: '#f0f7f6',   // Mint-tinted paper
      text: '#1a2e2c',    // Dark teal-black
      neutral: '#4b5563', // Slate-600
      accent: '#0F766E',  // Teal-700
      border: '#0F766E',
    },
    dark: {
      paper: '#1a1a1a',   // Deeper Charcoal
      text: '#f9fafb',    // Off-white
      neutral: '#d1d5db', // Bright gray
      accent: '#fde047',  // Vibrant Yellow-400 as default accent
      border: '#fef08a',  // Yellow-300 for outlines
    }
  },
  animation: {
    ui: { duration: 0.3, ease: [0.42, 0, 0.58, 1] },
    reveal: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};
