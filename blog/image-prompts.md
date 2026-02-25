# Blog Image Generation Prompts

## Standard Blog Post Image Prompt

Used for generating consistent blog post thumbnail images:

```
Clean minimalist digital illustration of [TOPIC], soft blue and purple/teal gradients, modern tech aesthetic, professional illustration style, light background
```

## Specific Post Prompts Used

### 1. Building in Public
```
Clean minimalist digital illustration of a construction crane building a rocket on a laptop screen, soft blue and purple gradients, modern tech startup aesthetic, professional illustration, light background
```

### 2. Memory Systems
```
Abstract digital illustration of layered memory storage, three concentric circles representing short and long term memory, glowing neural pathways, soft teal and blue gradients, modern minimalist tech aesthetic, clean background
```

### 3. X Automation
```
Minimalist illustration of a friendly robot managing social media posts, bird icons flying from a laptop screen, soft blue and orange gradients, modern tech aesthetic, clean professional style
```

### 4. Video Transcription
```
Clean illustration of video content being converted to text, film reel icons transforming into document pages, soft purple and blue gradients, modern tech aesthetic, professional minimalist style
```

### 5. Monetization
```
Minimalist illustration of AI tools generating revenue, digital coins flowing from a laptop into a growth chart, soft green and blue gradients, modern fintech aesthetic, clean professional style
```

### 6. OpenClaw Setup
```
Clean illustration of a Mac Mini computer with configuration tools and settings gears floating around it, soft blue and teal gradients, modern tech setup aesthetic, professional minimalist style
```

## Key Visual Elements for Consistency

- **Color Palette:** Soft blue, purple, teal gradients
- **Style:** Clean, minimalist, modern tech aesthetic
- **Composition:** Simple, focused imagery with light backgrounds
- **Model:** DALL-E 3 with "vivid" style
- **Size:** 1024x1024

## Generation Command

```bash
curl -s https://api.openai.com/v1/images/generations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "YOUR_PROMPT_HERE",
    "n": 1,
    "size": "1024x1024",
    "style": "vivid"
  }'
```

## Future Blog Post Image Formula

For new blog posts, use this template:

```
Clean minimalist digital illustration of [CONCEPT RELATED TO POST TOPIC], [RELEVANT VISUAL METAPHORS], soft [BLUE/PURPLE/TEAL] gradients, modern tech aesthetic, professional illustration style, light background
```

## Storage Location

Generated images saved to:
`/Users/openclaw/.openclaw/workspace/cliffmart/blog/images/`

Naming convention:
`[post-slug].png`
