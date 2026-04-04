import json
import os
import subprocess
import sys

# Voice options for EulerFold brand (Calm, precise, warm)
VOICE = "en-US-SteffanNeural"

def generate_vo_segment(id, text, output_path):
    print(f"Generating VO for {id}...")
    command = [
        "edge-tts",
        "--voice", VOICE,
        "--text", text,
        "--write-media", output_path
    ]
    subprocess.run(command, check=True)

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_vo.py <video_dir>")
        sys.exit(1)
    
    video_dir = sys.argv[1]
    script_path = os.path.join(video_dir, 'script.json')
    audio_dir = os.path.join(video_dir, 'audio')
    
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)

    with open(script_path, 'r') as f:
        script = json.load(f)

    for segment in script:
        output_path = os.path.join(audio_dir, f"{segment['id']}.mp3")
        generate_vo_segment(segment['id'], segment['text'], output_path)
    
    print(f"All VO segments generated for {video_dir}.")

if __name__ == "__main__":
    main()
