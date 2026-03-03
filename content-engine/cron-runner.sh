#!/bin/bash
# RETIRED 2026-02-28 — Content generation now handled by Samantha via OpenClaw cron
# samantha-draft (every 2h) and samantha-publish (every 15min) replace this script
echo "$(date): cron-runner.sh is retired. Content now managed by Samantha agent." >> /Users/openclaw/.openclaw/workspace/cliffmart/content-engine/logs/cron.log
exit 0
