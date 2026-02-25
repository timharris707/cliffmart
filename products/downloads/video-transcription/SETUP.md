# Video Transcription Skill - Setup Guide

## What This Skill Does

Extract transcripts from YouTube, TikTok, Instagram, Facebook, and X (Twitter) videos. Automatically saves to organized folders with metadata and timestamps.

## Supported Platforms

- ✅ YouTube (including Shorts)
- ✅ TikTok
- ✅ Instagram Reels/Posts
- ✅ Facebook Videos
- ✅ X (Twitter) Videos

## Prerequisites

- Node.js 18+
- OpenClaw setup
- Supadata API key (free tier available)

## Installation

1. **Navigate to your OpenClaw workspace:**
```bash
cd ~/.openclaw/workspace
```

2. **Copy the skill files:**
```bash
cp -r video-transcription/ skills/
```

3. **Install dependencies:**
```bash
cd skills/video-transcription
npm install
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your Supadata API key
```

5. **Get your Supadata API key:**
   - Go to https://supadata.ai
   - Sign up (free tier: 100 requests/day)
   - Copy your API key
   - Paste into `.env` file

## Usage

### Basic Usage
```bash
./transcribe.js <video-url>
```

### Examples
```bash
# YouTube
./transcribe.js https://youtube.com/watch?v=dQw4w9WgXcQ

# TikTok
./transcribe.js https://tiktok.com/@user/video/1234567890

# Instagram
./transcribe.js https://instagram.com/p/ABC123DEF/

# X (Twitter)
./transcribe.js https://x.com/user/status/1234567890
```

## Output

Transcripts are saved to `~/transcripts/` with this format:
```
20240225-143052-youtube-dQw4w9WgXcQ.txt
```

Each file includes:
- Full transcript text
- Source URL
- Platform
- Extraction timestamp
- Language (if detected)

## Advanced Usage

### Custom output directory
```bash
TRANSCRIPTS_DIR=/path/to/folder ./transcribe.js <url>
```

### Using with OpenClaw
The skill is automatically available as:
```bash
video-transcription <url>
```

## Troubleshooting

**Error: "SUPADATA_API_KEY not set"**
- Check your `.env` file exists
- Verify the API key is correct

**Error: "Unsupported platform"**
- Make sure the URL is from a supported platform
- Check the URL format (some shortened URLs may not work)

**Error: "API Error"**
- Check your Supadata API quota
- Verify the video is public and has captions/transcript available

## API Limits (Supadata Free Tier)

- 100 requests/day
- Rate limit: 1 request/second

## Support

Questions? Contact support or check the documentation at:
https://shopcliffmart.com/products/video-transcription.html