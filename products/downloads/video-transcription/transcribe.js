#!/usr/bin/env node
/**
 * Video Transcription Skill for OpenClaw
 * Extract transcripts from YouTube, TikTok, Instagram, Facebook, X
 * 
 * Usage: ./transcribe.js <video-url>
 * Example: ./transcribe.js https://youtube.com/watch?v=...
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  transcriptsDir: process.env.TRANSCRIPTS_DIR || `${require('os').homedir()}/transcripts`,
  apiKey: process.env.SUPADATA_API_KEY,
};

// Supported platforms
const PLATFORMS = {
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'tiktok.com': 'tiktok',
  'instagram.com': 'instagram',
  'facebook.com': 'facebook',
  'fb.watch': 'facebook',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
};

function detectPlatform(url) {
  const domain = Object.keys(PLATFORMS).find(d => url.includes(d));
  return domain ? PLATFORMS[domain] : null;
}

function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
}

async function extractVideoId(url, platform) {
  // Extract video ID based on platform
  const patterns = {
    youtube: /(?:v=|\/)([a-zA-Z0-9_-]{11})/,
    tiktok: /\/video\/(\d+)/,
    instagram: /\/p\/([a-zA-Z0-9_-]+)/,
    facebook: /\/videos\/(\d+)/,
    twitter: /\/status\/(\d+)/,
  };
  
  const match = url.match(patterns[platform]);
  return match ? match[1] : null;
}

async function fetchTranscript(url) {
  if (!CONFIG.apiKey) {
    throw new Error('SUPADATA_API_KEY not set. See SETUP.md');
  }
  
  const platform = detectPlatform(url);
  if (!platform) {
    throw new Error(`Unsupported platform. Supported: ${Object.values(PLATFORMS).join(', ')}`);
  }
  
  console.log(`🔍 Detected platform: ${platform}`);
  console.log(`📡 Fetching transcript...`);
  
  // Call Supadata API
  const apiUrl = `https://api.supadata.ai/v1/youtube/transcript?videoId=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }
    
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch transcript: ${err.message}`);
  }
}

async function saveTranscript(url, data) {
  const platform = detectPlatform(url);
  const videoId = await extractVideoId(url, platform);
  const timestamp = getTimestamp();
  
  // Create transcripts directory
  if (!fs.existsSync(CONFIG.transcriptsDir)) {
    fs.mkdirSync(CONFIG.transcriptsDir, { recursive: true });
  }
  
  // Build filename
  const filename = `${timestamp}-${platform}-${videoId}.txt`;
  const filepath = path.join(CONFIG.transcriptsDir, filename);
  
  // Format content
  const content = `
# Video Transcript
# Source: ${url}
# Platform: ${platform}
# Video ID: ${videoId}
# Extracted: ${new Date().toISOString()}
# Language: ${data.language || 'unknown'}

${data.content || data.transcript || JSON.stringify(data, null, 2)}

---
# Metadata
# Duration: ${data.duration || 'unknown'}
# Title: ${data.title || 'unknown'}
# Channel: ${data.channel || 'unknown'}
`;
  
  fs.writeFileSync(filepath, content.trim());
  console.log(`✅ Saved to: ${filepath}`);
  
  return filepath;
}

// Main execution
async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.log('Video Transcription Skill v1.0');
    console.log('');
    console.log('Usage: ./transcribe.js <video-url>');
    console.log('');
    console.log('Examples:');
    console.log('  ./transcribe.js https://youtube.com/watch?v=...');
    console.log('  ./transcribe.js https://tiktok.com/@user/video/...');
    console.log('  ./transcribe.js https://x.com/user/status/...');
    process.exit(1);
  }
  
  try {
    console.log(`🎬 Processing: ${url}`);
    const data = await fetchTranscript(url);
    const filepath = await saveTranscript(url, data);
    console.log('');
    console.log('✨ Done!');
    console.log(`📄 File: ${filepath}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();