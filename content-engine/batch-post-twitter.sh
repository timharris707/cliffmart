#!/bin/bash
# Batch post existing blog articles to Twitter
# Posts 5 articles, 5 minutes apart

TWEETS=(
  "From zero to live in 48 hours — how we built CliffMart, the mistakes we made, and what we'd do differently:\n\nhttps://shopcliffmart.com/blog/building-in-public.html\n\n#BuildingInPublic #OpenClaw #AI"
  
  "How we built a 3-layer memory system for AI assistants that keeps context across sessions without breaking the bank:\n\nhttps://shopcliffmart.com/blog/memory-systems.html\n\n#OpenClaw #AI #MemorySystems"
  
  "Automating X without getting banned — browser automation vs API vs hybrid. What actually works:\n\nhttps://shopcliffmart.com/blog/x-automation.html\n\n#XAutomation #TwitterAPI #OpenClaw"
  
  "Building a video transcription skill — why we chose Supadata over Whisper API and how we handle rate limits:\n\nhttps://shopcliffmart.com/blog/video-transcription.html\n\n#VideoTranscription #Supadata #OpenClaw"
  
  "How we're thinking about monetizing AI tools — playbooks vs skills vs consulting. The models we're testing:\n\nhttps://shopcliffmart.com/blog/monetization.html\n\n#Monetization #AISkills #OpenClaw"
)

echo "🐦 Starting batch Twitter posting..."
echo "⏰ Posting 5 tweets, 5 minutes apart"
echo ""

for i in "${!TWEETS[@]}"; do
  echo "[$((i+1))/5] Posting tweet $((i+1))..."
  
  # Post to Twitter
  node ~/.openclaw/bin/post-to-cliffcircuit.js "${TWEETS[$i]}"
  
  if [ $? -eq 0 ]; then
    echo "✅ Tweet $((i+1)) posted successfully"
  else
    echo "❌ Tweet $((i+1)) failed"
  fi
  
  # Wait 5 minutes before next tweet (unless it's the last one)
  if [ $i -lt $((${#TWEETS[@]}-1)) ]; then
    echo "⏳ Waiting 5 minutes before next post..."
    echo "Next post at: $(date -v+5M '+%I:%M %p')"
    echo ""
    sleep 300  # 300 seconds = 5 minutes
  fi
done

echo ""
echo "🎉 Batch posting complete! All 5 articles posted to Twitter."