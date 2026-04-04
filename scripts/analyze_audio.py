import json
import os
import subprocess
import math
import sys

def get_audio_duration(file_path):
    command = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file_path
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())

def main():
    if len(sys.argv) < 2:
        print("Usage: python analyze_audio.py <video_dir>")
        sys.exit(1)
    
    video_dir = sys.argv[1]
    script_path = os.path.join(video_dir, 'script.json')
    audio_dir = os.path.join(video_dir, 'audio')
    timing_path = os.path.join(video_dir, 'timing.json')

    if not os.path.exists(script_path):
        print(f"Error: {script_path} not found")
        sys.exit(1)

    with open(script_path, 'r') as f:
        script = json.load(f)
    
    timing_data = []
    current_offset = 0
    fps = 30

    for i, segment in enumerate(script):
        audio_path = os.path.join(audio_dir, f"{segment['id']}.mp3")
        if not os.path.exists(audio_path):
            print(f"Warning: Audio for {segment['id']} not found in {audio_dir}, skipping.")
            continue
            
        duration = get_audio_duration(audio_path)
        
        # Audio frames: convert to int immediately
        frames = math.ceil(duration * fps)
        
        # Add 2.0s hold frame ONLY for the outro segment
        is_last = (i == len(script) - 1)
        if is_last:
            frames += 60
            print(f"Adding 2s hold to {segment['id']}")
        
        timing_data.append({
            "id": segment['id'],
            "heading": segment.get('heading', ''),
            "text": segment['text'],
            "audio_path": f"videos/{os.path.basename(video_dir)}/audio/{segment['id']}.mp3",
            "duration": duration,
            "frames": frames,
            "start_frame": current_offset,
            "mode": segment['mode'],
            "font": segment['font']
        })
        current_offset += frames

    with open(timing_path, 'w') as f:
        json.dump(timing_data, f, indent=2)
    
    print(f"Generated timing for {len(timing_data)} segments in {timing_path}.")

if __name__ == "__main__":
    main()
