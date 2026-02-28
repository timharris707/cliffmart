#!/usr/bin/env node
/**
 * Blog-to-X Auto-Poster for CliffMart
 * 
 * Scans blog directory for new posts and auto-tweets them to @CliffCircuit
 * Tracks posted blogs in blog-post-tracker.json to avoid duplicates
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const TRACKER_FILE = path.join(__dirname, '..', 'blog-post-tracker.json');
const SITE_URL = 'https://shopcliffmart.com';

// Load tracker (or create empty)
function loadTracker() {
  try {
    return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch {
    return { posted: [], lastCheck: null };
  }
}

// Save tracker
function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2));
}

// Extract blog post data from HTML file
function extractPostData(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Extract title from <h1>
  const titleMatch = html.match(/<h1>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
  
  // Extract excerpt from <p class="post-subtitle-v2">
  const excerptMatch = html.match(/<p class="post-subtitle-v2">([^<]+)<\/p>/);
  const excerpt = excerptMatch ? excerptMatch[1].trim() : '';
  
  // Extract date from <time>
  const dateMatch = html.match(/<time>([^<]+)<\/time>/);
  const date = dateMatch ? dateMatch[1].trim() : '';
  
  // Get relative URL
  const fileName = path.basename(filePath);
  const url = `${SITE_URL}/blog/${fileName}`;
  
  return { title, excerpt, date, url, file: fileName };
}

// Generate engaging tweet with hook
function generateTweet(post) {
  // Use excerpt as the hook - it's already written in Cliff's voice (40-60 words)
  // Take first sentence or two for punchiness
  const sentences = post.excerpt.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const hook = sentences.slice(0, 2).join('. ') + '.';
  
  // Format: Hook + Link (Cliff's conversational voice)
  const tweet = `${hook}\n\n${post.url}`;
  
  return tweet;
}

// Post to X using the existing script
function postToX(tweet) {
  const { execSync } = require('child_process');
  const postScript = path.join(process.env.HOME, '.openclaw', 'bin', 'post-to-cliffcircuit.js');
  
  try {
    execSync(`node "${postScript}" "${tweet.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error('Failed to post to X:', e.message);
    return false;
  }
}

// Main function
function main() {
  const tracker = loadTracker();
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
  
  let newPosts = 0;
  
  for (const file of files) {
    if (tracker.posted.includes(file)) {
      continue; // Already posted
    }
    
    const filePath = path.join(BLOG_DIR, file);
    const post = extractPostData(filePath);
    const tweet = generateTweet(post);
    
    console.log(`\n📝 New blog post found: ${post.title}`);
    console.log(`🐦 Generated tweet (${tweet.length} chars):\n${tweet}\n`);
    
    // Post to X
    if (postToX(tweet)) {
      tracker.posted.push(file);
      tracker.lastCheck = new Date().toISOString();
      newPosts++;
      console.log(`✅ Posted to @CliffCircuit`);
    } else {
      console.error(`❌ Failed to post: ${post.title}`);
    }
  }
  
  saveTracker(tracker);
  
  if (newPosts === 0) {
    console.log('📭 No new blog posts to share.');
  } else {
    console.log(`\n🎉 Posted ${newPosts} new blog post(s) to X`);
  }
}

main();
