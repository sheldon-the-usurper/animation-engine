# Branded Explainer Video System: Core Mandates

This document serves as the foundational brief and set of instructions for all video generation tasks within this workspace. Adherence to these visual, structural, and technical rules is mandatory to maintain brand consistency.

## 1. Project Identity & Tone
- **Brand Personality:** Calm, precise, slightly warm. Not sterile, not loud. 
- **The Sketchbook Metaphor:** Every video exists inside a sketchbook. Backgrounds are textured paper, and animations appear as if drawn or written in real time.
- **Content Goal:** Transfer a single mental model. Avoid "compressed lectures." Focus on the "so what."
- **The Hook Rule:** Never start with "Today we're talking about..." Open with tension, a surprise, or a question.

## 2. Visual System
### Paper & Color
- **Light Mode (Default):** Mint-tinted paper (`#f0f7f6`), off-white, subtle grain texture. Text: Dark teal-black (`#1a2e2c`).
- **Dark Mode:** Deep charcoal paper (not pure black). Text: Softened gray (`#d1d5db`).
- **Accent Color:** Teal-700 (`#0F766E`) for key lines, underlines, labels, and UI chrome.
- **Neutrals:** Warm grays and slate (avoid cool grays).
- **Rule of Three:** Max three colors on screen at once (Paper, Teal, one Neutral).

### Typography
- **Source:** Always load via Google Fonts at render time.
- **Selection:**
  - **Serif:** Humanistic or historical topics.
  - **Geometric Sans:** Math or systems topics.
  - **Monospace:** Code or data topics.
- **Constraints:** Max two font families per video. No default system fonts.

### Animation Personality
- **Style:** Sharp, intentional, not bouncy or elastic.
- **Easings:** `easeInOut`.
- **Durations:** 150–300ms (UI), 400–600ms (Reveals).
- **Mechanics:** 
  - Lines: SVG `strokeDashoffset` draw-in.
  - Shapes: Fill blooms in *after* outline completes.
  - Text: Word-by-word or character-by-character reveal.
  - Transitions: No slides or zooms. Only drawing or cross-fades for mode switches.

## 3. Technical Implementation
### Audio & Sync
- **VO Generation:** Use `edge-tts` before rendering.
- **Visual-only Segments:** For segments with no VO (e.g., outro), `generate_vo.py` automatically produces a 1s silent MP3 using `ffmpeg`.
- **Timing:** Derived from audio duration via `analyze_audio.py`. Visual reveals for a segment must complete ~0.5s before the audio ends.
- **Process:** Measure audio duration and calculate frame counts *before* writing animation code.

### Visual Components & Performance
- **SVG vs Canvas:** Prefer SVG-based Rough.js components (using `rough.generator()`) over Canvas for Remotion. SVG is more declarative, faster to render, and less CPU-intensive.
- **Responsiveness:** Components must use relative coordinates (based on `width`/`height` props) to scale correctly across different container sizes.
- **3D Elements (Three.js):** Only when spatial understanding is required. Render inside a container; the paper background must remain visible.

### Logo & Watermark
- **Placement:** Top-right corner throughout (Watermark), centered in Outro.
- **Assets:** Use `logo.svg` for light mode and `logo-dark.svg` (lighter text) for dark mode.
- **Opacity:** High visibility (0.7-0.8) for the primary brand mark.

## 4. Execution Workflow (New Video Generation)

To generate a new video from scratch, follow these steps in order:

### Step 1: Create a Video Directory
Create a new folder in `videos/` (e.g., `videos/my-new-topic/`).
Define the script in `videos/my-new-topic/script.json`.
- **id**: Unique identifier.
- **heading**: Heading for the segment.
- **text**: The exact narration script (leave empty/whitespace for visual-only).
- **mode**: "light" or "dark".
- **font**: "serif" or "sans-serif".

### Step 2: Generate Voiceover
Run the VO generation script (handles silent segments automatically):
```bash
python3 scripts/generate_vo.py videos/my-new-topic
```

### Step 3: Analyze Audio Durations
Run the audio analysis script:
```bash
python3 scripts/analyze_audio.py videos/my-new-topic
```

### Step 4: Implement Visual Logic
- Choose or create a metaphor component in `src/metaphors/`.
- Update `src/Main.tsx` router to include the new metaphor.

### Step 5: Execute Render Pipeline
Run the master render script (Locally preferred):
```bash
./render.sh videos/my-new-topic
```

## 5. Directory Structure
- `videos/`: Each subfolder contains video-specific data (script, timing, audio).
- `src/metaphors/`: Metaphor-specific visual components (e.g., `PvSNP.tsx`).
- `src/components/`: Reusable generic components (e.g., `DrawnLine.tsx`, `StaggeredText.tsx`).
- `src/Main.tsx`: Generic video container that consumes segment data.
- `src/data/active_video.json`: Symlink pointing to the current video's timing data.

## 6. Visual Meaning
Visuals must carry meaning independently of narration. If a viewer mutes the video, they should still grasp the core mental model. Decoration without meaning is prohibited.

## 7. Stability & Rendering Notes
- **Fedora/Linux:** Use `--browser-executable` and `CHROMIUM_FLAGS` (`--single-process`, `--no-zygote`) to prevent Xvfb conflicts.
- **GCloud Rendering (Ubuntu 22.04):**
  - Requires Node.js v20+ (for `node:fs` support).
  - Install `google-chrome-stable`, `xvfb`, `ffmpeg`, and `time`.
  - Use `concurrency=2` (or match `nproc`) in `render.sh` for speed.
- **JSON Imports:** Use standard `import x from './file.json'` syntax. Modern `with { type: 'json' }` syntax may crash the `esbuild` loader in Remotion 4.0.
