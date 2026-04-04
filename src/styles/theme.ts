export const Theme = {
  colors: {
    light: {
      paper: '#f0f7f6',   // Mint-tinted paper
      text: '#1a2e2c',    // Dark teal-black
      neutral: '#4b5563', // Slate-600
      accent: '#0F766E',  // Teal-700
      border: '#0F766E',
    },
    dark: {
      paper: '#2A2A28',   // Requested Warmer Charcoal
      text: '#ffffff',    // Pure white for maximum contrast
      neutral: '#d1d5db', // Bright gray for subtext
      accent: '#2dd4bf',  // Vibrant Teal-400
      border: '#5eead4',  // Teal-300 for outlines
    }
  },
  animation: {
    ui: { duration: 0.3, ease: [0.42, 0, 0.58, 1] },
    reveal: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
  },
};
