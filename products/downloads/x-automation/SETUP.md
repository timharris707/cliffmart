# X Automation Skill - Setup Guide

## What This Skill Does

Complete X/Twitter automation setup with:
- Scheduled posting from content calendar
- Multiple account support
- Safety guardrails (rate limiting, duplicate detection)
- Growth analytics and tracking
- Manual and automated posting modes

## Prerequisites

- Node.js 18+
- OpenClaw setup
- X API credentials (OAuth 1.0a with Read+Write)

## Installation

1. **Copy skill to your OpenClaw workspace:**
```bash
cp -r x-automation/ skills/
cd skills/x-automation
npm install
```

2. **Initialize the skill:**
```bash
./x-automation.js init
```

3. **Configure X API credentials:**
```bash
# Edit the config file
nano ~/.x-automation/config.json
```

Add your X API credentials:
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
  "defaultAccount": "@CliffCircuit"
}
```

## Getting X API Credentials

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app
3. Generate API keys with **Read and Write** permissions
4. Copy keys to config file

## Usage

### Post immediately
```bash
./x-automation.js post "Your tweet here"
```

### Post to specific account
```bash
./x-automation.js post "Hello!" --account @timharris707
```

### Schedule posts
1. Edit content calendar:
```bash
nano ~/.x-automation/content-calendar.csv
```

Format:
```
date,time,content,type,account
2024-02-25,09:00,"Good morning! ☀️","post",@CliffCircuit
2024-02-25,12:00,"Lunch break thoughts...","post",@CliffCircuit
```

2. Run scheduler (add to cron):
```bash
./x-automation.js schedule
```

### View scheduled posts
```bash
./x-automation.js queue
```

### Check stats
```bash
./x-automation.js stats
```

## Setting up Cron Jobs

Run scheduler every minute:
```bash
# Add to crontab
crontab -e

# Add this line:
* * * * * cd ~/.openclaw/workspace/skills/x-automation && ./x-automation.js schedule >> ~/.x-automation/cron.log 2>&1
```

Or use OpenClaw's built-in cron:
```
openclaw cron add "x-automation schedule" --every 1m
```

## Safety Features

- **Rate limiting**: Max 50 posts/day (configurable)
- **Duplicate detection**: Won't post same content twice
- **Min interval**: 30 minutes between posts (configurable)
- **Activity logging**: All posts tracked with timestamps

## Safety Settings

Edit `~/.x-automation/config.json`:
```json
{
  "safety": {
    "maxPostsPerDay": 50,
    "minIntervalMinutes": 30,
    "allowRetweets": true,
    "allowReplies": false
  }
}
```

## Troubleshooting

**Error: "No account specified"**
- Set `defaultAccount` in config, or use `--account @handle`

**Error: "Daily post limit reached"**
- Check `x-automation stats`
- Adjust `maxPostsPerDay` if needed

**Posts not sending**
- Verify X API credentials
- Check OAuth permissions (need Read+Write)
- Review `~/.x-automation/cron.log`

## API Limits (X Free Tier)

- Posting: 50 tweets per 24 hours
- Reading: 100 requests per 15 minutes

## Support

Questions? Visit https://shopcliffmart.com/products/x-automation.html