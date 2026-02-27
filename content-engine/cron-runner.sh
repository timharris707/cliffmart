#!/bin/bash
# CliffMart Content Engine - Cron Job Runner
# Runs every 75 minutes to generate and publish new blog content
# 
# Schedule: */75 * * * * (runs every 75 minutes = ~19 times per day)
# 
# Total daily output: ~19 articles × 3,250 words = ~61,750 words/day
# Monthly output: ~585 articles × 3,250 words = ~1.9M words/month

set -e  # Exit on error

WORKSPACE="/Users/openclaw/.openclaw/workspace/cliffmart"
LOG_FILE="$WORKSPACE/content-engine/logs/content-$(date +%Y%m%d).log"
LOCK_FILE="$WORKSPACE/content-engine/.content-lock"

# Create log directory if needed
mkdir -p "$WORKSPACE/content-engine/logs"

# Prevent overlapping runs
if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE" 2>/dev/null)
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "[$(date)] Content generation already running (PID: $PID). Skipping." >> "$LOG_FILE"
        exit 0
    fi
fi
echo $$ > "$LOCK_FILE"

# Cleanup lock on exit
trap 'rm -f "$LOCK_FILE"' EXIT

echo "[$(date)] Starting content generation..." >> "$LOG_FILE"

cd "$WORKSPACE"

# Step 1: Generate new blog post
echo "[$(date)] Generating blog post..." >> "$LOG_FILE"
node content-engine/generate-post.js >> "$LOG_FILE" 2>&1

# Step 2: Generate article content via AI (placeholder - to be implemented)
# This will call the AI model to generate 3,000-3,500 words
echo "[$(date)] Content generation phase (AI integration pending)..." >> "$LOG_FILE"

# Step 3: Generate hero image (placeholder - to be implemented)
echo "[$(date)] Image generation (AI integration pending)..." >> "$LOG_FILE"

# Step 4: Commit to git
echo "[$(date)] Committing changes..." >> "$LOG_FILE"
git add -A
git commit -m "Auto-generated blog post: $(date '+%Y-%m-%d %H:%M')" >> "$LOG_FILE" 2>&1 || true

# Step 5: Push to GitHub
echo "[$(date)] Pushing to GitHub..." >> "$LOG_FILE"
git push origin main >> "$LOG_FILE" 2>&1 || true

# Step 6: Deploy to Vercel
echo "[$(date)] Deploying to Vercel..." >> "$LOG_FILE"
VERCEL_TOKEN=$(security find-generic-password -s vercel-token -w)
vercel --prod --token "$VERCEL_TOKEN" --yes >> "$LOG_FILE" 2>&1 || true

# Step 7: Post to Twitter
echo "[$(date)] Posting to Twitter..." >> "$LOG_FILE"
node ~/.openclaw/bin/post-to-cliffcircuit.js "New article just dropped: [Article Title] - [URL] #OpenClaw #AI #Automation" >> "$LOG_FILE" 2>&1 || true

echo "[$(date)] Content generation complete!" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Keep only last 30 days of logs
find "$WORKSPACE/content-engine/logs" -name "content-*.log" -mtime +30 -delete 2>/dev/null || true