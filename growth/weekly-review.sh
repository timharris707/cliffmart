#!/bin/bash
# Weekly Twitter analytics summary
# Usage: growth/weekly-review.sh > growth/reports/weekly-$(date +%F).md

REPORT_DIR="$HOME/.openclaw/workspace/cliffmart/growth/reports"
POST_HISTORY="$HOME/.openclaw/workspace/cliffmart/content-engine/post-history.json"
TWITTER_METRICS="$HOME/.openclaw/bin/twitter-metrics.json"  # placeholder

mkdir -p "$REPORT_DIR"
REPORT_FILE="$REPORT_DIR/weekly-$(date +%F).md"

cat <<'EOF' > "$REPORT_FILE"
# Weekly Growth Report

## Highlights
- Top tweets:
  - (populate via Twitter analytics)
- Follower change: TBD
- Profile visits: TBD

## Content Performance
- [ ] Paste top 3 tweets + stats
- [ ] Note threads that hit >5% engagement

## Experiments & Learnings
- What worked:
- What flopped:

## Next Week Focus
- Thread topics:
- Accounts to engage:
- Experiments to run:
EOF

echo "✅ Created report template: $REPORT_FILE"
