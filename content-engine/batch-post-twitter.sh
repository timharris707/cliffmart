#!/bin/bash
# Batch post existing blog articles to Twitter with duplicate protection
# Usage: content-engine/batch-post-twitter.sh

HISTORY_FILE="$HOME/.openclaw/workspace/cliffmart/content-engine/post-history.json"
POST_INTERVAL=300   # 5 minutes = 300 seconds

# Ensure history file exists
if [ ! -f "$HISTORY_FILE" ]; then
  echo "[]" > "$HISTORY_FILE"
fi

# Function to check if slug was posted recently
was_posted_recently() {
  local slug="$1"
  jq -e --arg slug "$slug" '.[] | select(.slug == $slug)' "$HISTORY_FILE" > /dev/null
}

# Function to record slug and tweet ID
record_post() {
  local slug="$1"
  local tweetId="$2"
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  tmp=$(mktemp)
  jq --arg slug "$slug" --arg tweetId "$tweetId" --arg ts "$timestamp" '. += [{"slug":$slug,"tweetId":$tweetId,"timestamp":$ts}]' "$HISTORY_FILE" > "$tmp" && mv "$tmp" "$HISTORY_FILE"
}

# Tweets to send (slug|text)
TWEETS=(
  "memory-systems|How we built a 3-layer memory system for AI assistants that keeps context across sessions without breaking the bank:\n\nhttps://shopcliffmart.com/blog/memory-systems.html\n\n#OpenClaw #AI #MemorySystems"
  "x-automation|Automating X without getting banned — browser automation vs API vs hybrid. What actually works:\n\nhttps://shopcliffmart.com/blog/x-automation.html\n\n#XAutomation #TwitterAPI #OpenClaw"
  "video-transcription|Building a video transcription skill — why we chose Supadata over Whisper API and how we handle rate limits:\n\nhttps://shopcliffmart.com/blog/video-transcription.html\n\n#VideoTranscription #Supadata #OpenClaw"
  "monetization|How we're thinking about monetizing AI tools — playbooks vs skills vs consulting. The models we're testing:\n\nhttps://shopcliffmart.com/blog/monetization.html\n\n#Monetization #AISkills #OpenClaw"
)

# Start posting
for entry in "${TWEETS[@]}"; do
  slug="${entry%%|*}"
  tweet="${entry#*|}"

  if was_posted_recently "$slug"; then
    echo "⏭️  Skipping $slug (already posted recently)"
    continue
  fi

  echo "🐦 Posting article: $slug"
  output=$(node ~/.openclaw/bin/post-to-cliffcircuit.js "$tweet" 2>&1)
  status=$?

  if [ $status -eq 0 ]; then
    tweetId=$(echo "$output" | grep -o 'Tweet ID: [0-9]*' | awk '{print $3}')
    echo "✅ ${slug} posted (Tweet ID: $tweetId)"
    record_post "$slug" "$tweetId"
  else
    echo "❌ Failed to post $slug" && echo "$output"
  fi

  echo ""  # spacing
  echo "⏳ Waiting $(($POST_INTERVAL/60)) minutes before next post..."
  sleep $POST_INTERVAL
  echo ""
done

echo "🎉 Batch posting complete"