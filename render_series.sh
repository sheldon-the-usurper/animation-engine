#!/bin/bash

# Directories for the 5-part series
VIDEOS=(
  "collapse-ecosystems"
  "collapse-finance"
  "collapse-civilizations"
  "collapse-body"
  "collapse-climate"
)

# Configuration for rendering
export DISPLAY=:99
export CHROMIUM_FLAGS="--single-process --no-zygote --no-sandbox --disable-dev-shm-usage"

mkdir -p out/series

# Total start time
SERIES_START=$(date +%s)

for VIDEO_NAME in "${VIDEOS[@]}"; do
  VIDEO_DIR="videos/$VIDEO_NAME"
  OUTPUT_FILE="out/series/$VIDEO_NAME.mp4"
  
  echo "----------------------------------------"
  echo "RENDERING: $VIDEO_NAME"
  echo "----------------------------------------"

  # Update symlink for active video
  ln -sf ../../$VIDEO_DIR/timing.json src/data/active_video.json
  
  # Start time for this video
  VIDEO_START=$(date +%s)
  
  # Render
  xvfb-run --auto-servernum --server-args="-screen 0 1080x1920x24" \
    npx remotion render src/index.tsx ComponentShowcase "$OUTPUT_FILE" \
    --browser-executable=/usr/bin/google-chrome \
    --concurrency=2 \
    --no-sandbox \
    --disable-dev-shm-usage 2>&1 | tee "render_$VIDEO_NAME.log"
    
  VIDEO_END=$(date +%s)
  ELAPSED=$((VIDEO_END - VIDEO_START))
  echo "Completed $VIDEO_NAME in $ELAPSED seconds ($((ELAPSED/60))m $((ELAPSED%60))s)"
done

SERIES_END=$(date +%s)
TOTAL_ELAPSED=$((SERIES_END - SERIES_START))

echo "----------------------------------------"
echo "SERIES RENDER COMPLETE"
echo "Total Time: $TOTAL_ELAPSED seconds ($((TOTAL_ELAPSED/60))m $((TOTAL_ELAPSED%60))s)"
echo "Videos are available in out/series/"
echo "----------------------------------------"
