#!/bin/bash

# Default video dir if not provided
VIDEO_DIR=${1:-"videos/cellular-winds"}

# Update symlink for the active video
ln -sf ../../$VIDEO_DIR/timing.json src/data/active_video.json

# Remotion Render configuration for Fedora/Linux
export DISPLAY=:99
# Optimized flags for local Fedora rendering (SwiftShader workaround)
export CHROMIUM_FLAGS="--single-process --no-zygote --no-sandbox --disable-dev-shm-usage"

echo "Rendering VERTICAL demo video..."

# Capture the current timestamp
START_TIME=$(date +%s)

# Render ComponentShowcase (9:16)
# Using GNU /usr/bin/time --verbose for compute metrics
/usr/bin/time --verbose xvfb-run --auto-servernum --server-args="-screen 0 1080x1920x24" \
  npx remotion render src/index.tsx ComponentShowcase out/demo_vertical.mp4 \
  --browser-executable=/usr/bin/google-chrome \
  --no-sandbox \
  --disable-dev-shm-usage 2>&1 | tee render.log

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

echo "----------------------------------------"
echo "Render Process Complete"
echo "Total Wall Clock Time: $ELAPSED seconds ($((ELAPSED/60))m $((ELAPSED%60))s)"
echo "Detailed resource metrics logged at the end of render.log"
echo "----------------------------------------"
