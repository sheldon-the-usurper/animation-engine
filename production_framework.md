# EulerFold Video Production Framework
### The Rulebook for Explainer Shorts

---

## The One Rule That Overrides Everything

A short video is not a compressed lecture.

A lecture tries to be complete. A short video tries to do **one thing** — transfer a single mental model from your head to the viewer's. Every creative decision in this document exists to serve that one transfer. If something doesn't serve it, cut it.

---

## Phase 1: Source Material → Core Idea

### If your source is an academic paper:
Papers are structured for credibility, not comprehension. They will mislead you if you follow their structure.

- Read the abstract and the discussion/conclusion only on the first pass
- Find the **one result or mechanism** that would make a curious non-expert say "wait, really?"
- Ignore the methodology section entirely for the purposes of the video
- Build your script **backward from the "so what"** — what changes in how someone thinks about the world after watching this?

### If your source is a concept or idea:
- Write one sentence: *"Most people think X, but actually Y."* That tension is your video.
- If you can't write that sentence, you don't have a video yet — you have a topic.

### The core idea test:
Can you explain the core idea in one sentence to someone on the street? If yes, proceed. If no, keep reducing.

---

## Phase 2: The 5-Segment Script Structure

Every video in this pipeline uses exactly 5 segments. Do not add or remove segments — the timing system, audio sync, and animation transitions are all built around this structure.

| Segment | Name | Purpose | Target Duration |
|---|---|---|---|
| 1 | Hook | Create a reason to keep watching | 6–9s |
| 2 | Discovery | Introduce the finding/concept | 7–9s |
| 3 | Mechanism | Explain *how* it works | 7–9s |
| 4 | So What | Stakes, implications, why it matters | 7–9s |
| 5 | Outro | Brand close + CTA | 5–7s |

**Total target: 34–40 seconds.** The system adds a 2-second CTA hold frame at the end automatically.

### Writing each segment:

**Segment 1 — Hook**
- Never open with "Today we're going to talk about X." That is an automatic audience loss.
- Open with a tension, a surprising fact, or a question the viewer didn't know they had.
- The first sentence must create a reason to keep watching. If it doesn't, rewrite it.
- Good hook structures:
  - *"How does [X] do [surprising thing]? For decades, we thought [wrong assumption] — but we missed something."*
  - *"[Counterintuitive fact]. Here's what's actually happening."*
  - *"[Familiar thing] doesn't work the way you think it does."*

**Segment 2 — Discovery**
- One finding. One sentence of context. No more.
- Name the source if credibility matters (institution, paper, researcher).
- Do not explain the mechanism yet — just state what was found.

**Segment 3 — Mechanism**
- This is the only segment where you explain *how*.
- Use one concrete analogy. The analogy must be visual — something that can be animated.
- The animation in this segment should carry the explanation. If you're explaining it entirely through narration, the visual isn't doing its job.

**Segment 4 — So What**
- Connect the mechanism to a real-world implication (disease, technology, behavior, etc.)
- Make the stakes personal or tangible if possible.
- This segment should make the viewer feel the discovery was worth their 30 seconds.

**Segment 5 — Outro**
- One distillation sentence that names the concept.
- Brand name + URL.
- No new information. No summarizing what they just watched.

---

## Phase 3: Visual Design Rules

### The mute test (non-negotiable):
Mute the video and watch it. If the core idea is not communicated by the visuals alone, the visuals are decoration. Redo them.

### Color and mode:
- **Light mode** (mint-tinted paper background): use for foundational, neutral, or discovery segments
- **Dark mode** (deep charcoal background): use for mechanism reveal and high-stakes segments
- Mode switches signal a shift in tone — use them intentionally, not decoratively

### Animation principles:
- Every moving element must represent something real. No motion for motion's sake.
- **Component Architecture:** Prefer SVG-based components (using `Rough.js` generator) over Canvas. This ensures high-fidelity rendering, better CPU performance, and easier styling in Remotion.
- **Responsiveness:** Ensure custom components (Cars, Monitors, etc.) use relative sizing to fit inside any `SketchyBox`.
- The central visual metaphor should be established in Segment 1 and *evolved* across segments — not replaced.

### Text rules:
- Heading: 72–80px, weight 800, letter-spacing -0.02em
- Subtitle: weight 400, line-height 1.6
- Font: Plus Jakarta Sans (loaded via Google Fonts in the bundle)
- No more than one heading and one subtitle block visible at once
- Text reveals: word-by-word spring animation, 6-frame delay per word

### Particle and cell guidelines:
- Baseline particle count: 80 (foreground + background depth layers)
- Smooth orbits = healthy/normal state (light mode segments)
- Erratic drift = diseased/disrupted state (dark mode, cancer/disorder segments)
- Pseudopod extension: use strokeDashoffset animation, extend then retract within segment
- Follower cell: 0.8x scale, 45-frame trail delay

---

## Phase 4: Audio and Timing

### Voiceover style:
- Conversational, not academic. 
- **Visual-Only Segments:** For segments without VO, the system automatically generates a 1s silent baseline baseline to maintain pipeline integrity.
- Each segment's VO should be speakable in the target duration at a natural pace (~140 words per minute).

### Timing system:
- The `analyze_audio.py` script auto-generates `timing.json` from actual VO audio durations.
- It handles zero-byte files by defaulting to a 1s duration.
- The system automatically adds a 2-second hold to the outro segment for the CTA frame.
- Do not manually edit `timing.json` — always regenerate it from audio.

---

## Phase 5: Rendering

### Compute Paths:
- **Local (Preferred):** Use `render.sh` with Chrome and Xvfb. This is currently the most stable and tested path.
- **GCloud (Compute Engine):** Supported path on Ubuntu 22.04. Requires Node v20+, Chrome, and FFmpeg. Use `concurrency` matching `nproc` for optimized throughput.

### Audio sync rule:
Total video duration = sum of all VO segment durations + 2s CTA hold. Verify with:
```
ffprobe out/video.mp4 2>&1 | grep Duration
```

---

## Adapting This to a New Topic

To make a new video, you only need to change four things:

1. **`scripts/generate_vo.py`** — replace the 5 voiceover scripts with your new topic's scripts, following the segment structure above
2. **The central visual metaphor** — what biological/physical process does your topic map to? Update the cell animation behavior in `src/Main.tsx` to reflect the new metaphor
3. **Headings** — update the 5 segment headings in the composition props
4. **Color/mode logic** — decide which segments are light vs dark based on tone.

Everything else — timing, audio sync, render pipeline, text animation, CTA frame, particle system, depth layering — stays exactly the same.

---

## What Not to Change Between Videos

- Segment count (always 5)
- Font (Plus Jakarta Sans)
- CTA hold duration (2 seconds)
- Render command and browser executable
- Text animation style (word-by-word spring reveal)
- Composition IDs (`Main` and `MainVertical`)
- Output format (h264, 30fps, AAC stereo)

---

*EulerFold — Structured learning content for free*
*www.eulerfold.com*
