# Real-World Example: Video Transcription Skill

## Complete Implementation

This is the exact skill we built and use at CliffMart. Copy this into your `skills/video-transcription/` directory.

### File: `transcribe.js`

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CONFIG = {
  transcriptsDir: process.env.TRANSCRIPTS_DIR || `${require('os').homedir()}/transcripts`,
  apiKey: process.env.SUPADATA_API_KEY,
};

const PLATFORMS = {
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'tiktok.com': 'tiktok',
  'instagram.com': 'instagram',
  'facebook.com': 'facebook',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
};

function detectPlatform(url) {
  const domain = Object.keys(PLATFORMS).find(d => url.includes(d));
  return domain ? PLATFORMS[domain] : null;
}

async function fetchTranscript(url) {
  if (!CONFIG.apiKey) {
    throw new Error('SUPADATA_API_KEY not set. Get one at https://supadata.ai');
  }
  
  const platform = detectPlatform(url);
  if (!platform) {
    throw new Error(`Unsupported platform. Supported: ${Object.values(PLATFORMS).join(', ')}`);
  }
  
  console.log(`🔍 Platform: ${platform}`);
  
  // Call Supadata API
  const apiUrl = `https://api.supadata.ai/v1/youtube/transcript?videoId=${encodeURIComponent(url)}`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${await response.text()}`);
  }
  
  return await response.json();
}

async function saveTranscript(url, data) {
  const platform = detectPlatform(url);
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  
  if (!fs.existsSync(CONFIG.transcriptsDir)) {
    fs.mkdirSync(CONFIG.transcriptsDir, { recursive: true });
  }
  
  const filename = `${timestamp}-${platform}.txt`;
  const filepath = path.join(CONFIG.transcriptsDir, filename);
  
  const content = `# Video Transcript
Source: ${url}
Platform: ${platform}
Extracted: ${new Date().toISOString()}

${data.content || data.transcript}
`;
  
  fs.writeFileSync(filepath, content);
  console.log(`✅ Saved: ${filepath}`);
  return filepath;
}

// Main
async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.log('Usage: transcribe.js <video-url>');
    process.exit(1);
  }
  
  try {
    console.log(`🎬 Processing: ${url}`);
    const data = await fetchTranscript(url);
    const filepath = await saveTranscript(url, data);
    console.log('✨ Done!');
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
```

### Setup

1. **Get API key:** https://supadata.ai (free: 100 requests/day)
2. **Create `.env`:**
```
SUPADATA_API_KEY=your_key_here
```
3. **Run:**
```bash
./transcribe.js https://youtube.com/watch?v=...
```

### What This Demonstrates

- **Environment variables** for API keys
- **Error handling** with user-friendly messages
- **File organization** with timestamps
- **Platform detection** from URLs
- **Third-party API integration**

---

# Real-World Example: X Automation Skill

## Complete Implementation

Our production X automation system. Handles posting, scheduling, and safety.

### Key Files

**`x-automation.js`** - Main script (see main playbook for full code)

**`content-calendar.csv`:**
```csv
date,time,content,account
2024-02-25,09:00,"Morning! Building AI tools in public with @timharris707",@CliffCircuit
2024-02-25,12:00,"Behind the scenes: OAuth is the real boss battle",@CliffCircuit
2024-02-25,18:00,"Day 3 of building in public. Progress: slow. Learning: fast.",@CliffCircuit
```

**`config.json`:**
```json
{
  "accounts": [
    {
      "handle": "@CliffCircuit",
      "apiKey": "your_consumer_key",
      "apiSecret": "your_consumer_secret",
      "accessToken": "your_access_token",
      "accessSecret": "your_access_secret"
    }
  ],
  "safety": {
    "maxPostsPerDay": 50,
    "minIntervalMinutes": 30,
    "allowRetweets": true
  }
}
```

### Cron Setup

```bash
# Check for scheduled posts every minute
* * * * * cd ~/skills/x-automation && ./x-automation.js schedule

# Daily stats report
0 9 * * * cd ~/skills/x-automation && ./x-automation.js stats >> ~/logs/x-stats.log
```

### What This Demonstrates

- **Scheduled task automation**
- **Multi-account management**
- **Safety guardrails**
- **CSV parsing**
- **State persistence** (logging)
- **Rate limiting**

---

# Real-World Example: Daily Standup Report

## Automated Daily Summary

Generates a report every morning with:
- Git commits from yesterday
- Calendar events today
- Social media activity
- Open tasks

### Implementation

```javascript
#!/usr/bin/env node
// skills/daily-standup/report.js

const { execSync } = require('child_process');
const fs = require('fs');

function getGitCommits() {
  try {
    const output = execSync('git log --since="yesterday" --oneline', { 
      cwd: process.cwd(),
      encoding: 'utf8' 
    });
    return output.trim().split('\n');
  } catch {
    return [];
  }
}

function getCalendarEvents() {
  // Integrate with calendar API
  // or parse .ics files
  return ['10:00 AM - Team standup', '2:00 PM - Product review'];
}

function generateReport() {
  const commits = getGitCommits();
  const events = getCalendarEvents();
  
  const report = `# Daily Standup - ${new Date().toDateString()}

## Yesterday's Commits (${commits.length})
${commits.map(c => `- ${c}`).join('\n') || '- No commits'}

## Today's Schedule
${events.map(e => `- ${e}`).join('\n')}

## Notes
- Generated by OpenClaw
`;
  
  fs.writeFileSync(`standup-${Date.now()}.md`, report);
  console.log('✅ Standup report generated');
}

generateReport();
```

### Usage

```bash
# Run manually
./skills/daily-standup/report.js

# Or schedule
crontab -e
0 9 * * 1-5 ~/skills/daily-standup/report.js
```

---

# Real-World Example: Customer Support Triage

## Automated Support Request Handling

Monitors support inbox, categorizes requests, drafts responses.

### Workflow

1. **Fetch emails** from support@cliffmart.com
2. **Categorize** using keywords:
   - "refund" → High priority
   - "question" → Medium priority
   - "bug" → Engineering queue
3. **Draft response** using templates
4. **Queue for review** or auto-send simple replies

### Implementation Sketch

```javascript
// skills/support-triage/triage.js

const CATEGORIES = {
  refund: { priority: 'high', template: 'refund-template' },
  question: { priority: 'medium', template: 'help-template' },
  bug: { priority: 'high', queue: 'engineering' },
};

async function triageSupport(email) {
  // Categorize
  const category = Object.keys(CATEGORIES).find(k => 
    email.subject.toLowerCase().includes(k) ||
    email.body.toLowerCase().includes(k)
  );
  
  const config = CATEGORIES[category] || { priority: 'low', template: 'general' };
  
  // Draft response
  const response = await draftResponse(email, config.template);
  
  // Queue for review
  await queueForReview({
    original: email,
    category,
    priority: config.priority,
    draft: response,
    timestamp: Date.now()
  });
}
```

---

# Integration Patterns

## Pattern 1: Skill → API → File System

```
User request → Skill processes → API call → Save result → Notify user
```

Used in: Video transcription, content research

## Pattern 2: Scheduled → Check → Action → Log

```
Cron trigger → Check condition → Take action → Log result
```

Used in: X automation, daily reports, backups

## Pattern 3: Trigger → Classify → Route → Execute

```
Event occurs → Classify type → Route to handler → Execute workflow
```

Used in: Support triage, monitoring alerts

## Pattern 4: Multi-step with Human Checkpoints

```
Step 1 (auto) → Human approval → Step 2 (auto) → Human approval → Done
```

Used in: Social posting (draft → approve → post), deployments

---

# Building Your First Real Skill

## Exercise: Build a Personal Finance Tracker

**Goal:** Track expenses from email receipts automatically.

**Steps:**
1. Monitor email for receipts (Amazon, grocery, etc.)
2. Extract: vendor, amount, date, category
3. Save to CSV or spreadsheet
4. Weekly summary report

**Time:** 2-3 hours
**Value:** Save 30 min/week of manual tracking

## Exercise: Content Repurposer

**Goal:** Turn long-form content into social posts.

**Steps:**
1. Read blog post or video transcript
2. Extract 3-5 key quotes
3. Format for X/LinkedIn
4. Queue for scheduling

**Time:** 4-5 hours
**Value:** 10x your content output

---

# Lessons from Production

## What Works

✅ **Start simple** - One task, one skill  
✅ **Log everything** - Debugging is 90% of the work  
✅ **Safety first** - Always have approval gates  
✅ **Iterate fast** - Deploy, test, improve  
✅ **Document as you go** - Future you will thank you  

## What Doesn't Work

❌ **Trying to automate everything at once**  
❌ **Skipping error handling**  
❌ **No logging or visibility**  
❌ **Over-engineering before proving value**  

## Cliff's Golden Rules

1. **If it takes < 5 minutes, don't automate it (yet)**
2. **If it happens > 3x/week, consider automating**
3. **If it requires judgment, add a human checkpoint**
4. **If it touches money or reputation, require approval**

---

# Next Steps

1. **Pick one repetitive task** from your work
2. **Build the simplest version** in 1 hour
3. **Test it manually** for a week
4. **Add safety and scheduling** if it works
5. **Document and share** what you learned

Remember: The goal isn't perfect automation. It's freeing up your time for work that matters.

**Start small. Ship fast. Iterate.**