#!/usr/bin/env node
/**
 * CliffMart Content Engine - Blog Post Generator with GPT-4
 * Generates 3,000-3,500 word SEO-optimized blog posts every 48 minutes
 * 
 * Usage: node content-engine/generate-post.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  targetWordCount: { min: 3000, max: 3500 },
  blogDir: path.join(__dirname, '..', 'blog'),
  imagesDir: path.join(__dirname, '..', 'blog', 'images'),
  sitemapPath: path.join(__dirname, '..', 'sitemap.xml'),
  postsJsonPath: path.join(__dirname, '..', 'blog', 'posts.json'),
  openRouterApiKey: process.env.OPENROUTER_API_KEY || null
};

async function generateHeroImage(post) {
  const imagePath = path.join(CONFIG.imagesDir, `${post.slug}.png`);
  
  try {
    console.log(`🎨 Generating ISOMETRIC 3D image for: ${post.title}...`);
    
    // Get OpenAI API key from keychain
    let apiKey;
    try {
      apiKey = execSync('security find-generic-password -s openai-api-key -w', { encoding: 'utf8' }).trim();
    } catch (e) {
      console.error('❌ OpenAI API key not found in keychain.');
      return null;
    }

    const stylePrompt = `Clean minimalist isometric 3D digital illustration of ${post.title}. Central visual metaphor on a soft glowing floating platform. Use a primary palette of high-tech blues, deep purples, and vibrant teals with soft gradients. Modern tech aesthetic, high-end professional render style, light pastel gradient background. No text, no words, no letters.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: stylePrompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        style: "vivid"
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the generated image
    execSync(`curl -sL "${imageUrl}" -o "${imagePath}"`);
    console.log(`✅ Success: Generated and saved hero image.`);
    return imagePath;

  } catch (error) {
    console.error('❌ Failed to generate hero image:', error.message);
    // Fallback to mascot
    try {
      if (!fs.existsSync(imagePath)) {
        fs.copyFileSync(path.join(CONFIG.imagesDir, 'openclaw-mascot.png'), imagePath);
      }
    } catch(e) {}
    return null;
  }
}

// Topic pool for AI/OpenClaw content
const TOPIC_TEMPLATES = [
  {
    category: "Use Cases",
    topics: [
      "OpenClaw for {industry}: Complete Automation Guide",
      "How {profession}s Can Save 20 Hours/Week with OpenClaw",
      "Building an AI Agent for {task}: Step-by-Step",
      "OpenClaw vs Traditional Automation Tools: A {industry} Comparison",
      "The Complete Guide to AI-Powered {process}"
    ],
    industries: ["E-commerce", "Consulting", "Real Estate", "Healthcare", "Marketing Agencies", "Law Firms", "Accounting", "Photography", "Event Planning", "Fitness Coaching", "Dentistry", "Chiropractic", "Financial Planning"],
    professions: ["Consultant", "Agency Owner", "Coach", "Freelancer", "Creator", "Developer", "Designer", "Marketer", "Sales Rep", "Operations Manager"],
    tasks: ["Lead Generation", "Client Onboarding", "Content Scheduling", "Email Management", "Document Processing", "Meeting Scheduling", "Follow-up Sequences", "Data Entry", "Social Media Management", "Customer Support"],
    tools: ["Zapier", "Make", "Manual Processes", "Spreadsheets", "Generic Chatbots"],
    processes: ["Client Communication", "Project Management", "Invoicing", "Scheduling", "Data Entry", "Quality Assurance", "Reporting", "Onboarding"]
  },
  {
    category: "Technical Deep Dives",
    topics: [
      "How We Built {feature}: Technical Architecture",
      "OpenClaw Memory Systems: {approach} Approach",
      "Securing Your AI Assistant: A Practical Guide",
      "Scaling OpenClaw: Lessons from {number} Deployments",
      "The Psychology of AI-Human Collaboration"
    ],
    features: ["Multi-Agent Workflows", "Real-Time Voice Integration", "Autonomous Error Recovery", "Cross-Platform Sync", "Memory Systems", "Safety Guardrails"],
    approaches: ["Knowledge Graph", "Vector Database", "Hybrid", "Federated"],
    numbers: ["10", "50", "100", "1,000", "10,000"]
  },
  {
    category: "Business Strategy",
    topics: [
      "Monetizing AI Skills: The {model} Model",
      "Building in Public: Month {number} Results",
      "From Zero to Revenue: Our First ${amount} Journey",
      "The Business Case for AI Assistants in {year}",
      "Pricing AI Services: What Actually Works"
    ],
    models: ["SaaS", "Marketplace", "Consulting", "Hybrid", "Subscription", "Usage-Based"],
    amounts: ["1,000", "10,000", "100,000", "1,000,000"],
    years: ["2026", "2027", "2028"]
  },
  {
    category: "Trends & Analysis",
    topics: [
      "The State of AI Assistants: {month} {year} Update",
      "Why {approach} Is Replacing Traditional Workflows",
      "AI Agent Economics: Cost Analysis for {scale} Operations",
      "The Future of Work: Predictions from the Trenches",
      "Emerging Use Cases: What's Working in {industry}"
    ],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    scales: ["Small Business", "Enterprise", "Solo", "Team", "Agency", "Startup"]
  }
];

// Generate a random topic
function generateTopic() {
  const category = TOPIC_TEMPLATES[Math.floor(Math.random() * TOPIC_TEMPLATES.length)];
  const template = category.topics[Math.floor(Math.random() * category.topics.length)];
  
  let title = template;
  
  // Replace placeholders
  if (title.includes('{industry}') && category.industries) {
    title = title.replace('{industry}', category.industries[Math.floor(Math.random() * category.industries.length)]);
  }
  if (title.includes('{profession}') && category.professions) {
    title = title.replace('{profession}', category.professions[Math.floor(Math.random() * category.professions.length)]);
  }
  if (title.includes('{task}') && category.tasks) {
    title = title.replace('{task}', category.tasks[Math.floor(Math.random() * category.tasks.length)]);
  }
  if (title.includes('{process}') && category.processes) {
    title = title.replace('{process}', category.processes[Math.floor(Math.random() * category.processes.length)]);
  }
  if (title.includes('{feature}') && category.features) {
    title = title.replace('{feature}', category.features[Math.floor(Math.random() * category.features.length)]);
  }
  if (title.includes('{approach}') && category.approaches) {
    title = title.replace('{approach}', category.approaches[Math.floor(Math.random() * category.approaches.length)]);
  }
  if (title.includes('{number}') && category.numbers) {
    title = title.replace('{number}', category.numbers[Math.floor(Math.random() * category.numbers.length)]);
  }
  if (title.includes('{model}') && category.models) {
    title = title.replace('{model}', category.models[Math.floor(Math.random() * category.models.length)]);
  }
  if (title.includes('{amount}') && category.amounts) {
    title = title.replace('{amount}', category.amounts[Math.floor(Math.random() * category.amounts.length)]);
  }
  if (title.includes('{year}') && category.years) {
    title = title.replace('{year}', category.years[Math.floor(Math.random() * category.years.length)]);
  }
  if (title.includes('{month}') && category.months) {
    title = title.replace('{month}', category.months[Math.floor(Math.random() * category.months.length)]);
  }
  if (title.includes('{scale}') && category.scales) {
    title = title.replace('{scale}', category.scales[Math.floor(Math.random() * category.scales.length)]);
  }
  
  return { title, category: category.category };
}

// Generate slug from title
function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

// Generate article content via GPT-4 through OpenRouter
async function generateArticleContent(topic) {
  console.log(`🤖 Generating content for: ${topic.title}`);
  
  try {
    // Get API key from keychain
    let apiKey;
    try {
      apiKey = execSync('security find-generic-password -s openrouter-api-key -w', { encoding: 'utf8' }).trim();
    } catch (e) {
      console.error('❌ OpenRouter API key not found in keychain.');
      return null;
    }
    
    const prompt = `Write a comprehensive, engaging, and highly readable blog post about "${topic.title}".

TARGET: 3,000-3,500 words of compelling narrative that explains the possibilities of AI and OpenClaw.

CONTENT GUIDELINES (CRITICAL):
- NO CODE BLOCKS: Focus on the logic, strategy, and outcomes. Do not include technical code snippets or programming lines.
- HUMAN-CENTRIC: Write for business owners, project managers, and AI enthusiasts. Make it accessible and "attractive" to humans, not just developers.
- STRATEGIC DEPTH: Focus on the "What" and the "Why." Explain how these tools change workflows, save time, and generate revenue.
- SEO OPTIMIZED: Use natural language and headings that perform well in search engines.

STRUCTURE (follow exactly):
1. HOOK (250-350 words): Relatable problem or pain point. Use real-world scenarios to build empathy.
2. SOLUTION OVERVIEW (300-400 words): How OpenClaw/AI fixes the issue from a strategic level. 
3. USE CASES & POSSIBILITIES (1,800-2,200 words): Provide 4-6 detailed sections exploring different applications. Focus on the workflow, the user experience, and the business impact.
4. ROI & STRATEGY (250-350 words): Break down the time savings, efficiency gains, and revenue potential. Use clear, non-technical logic.
5. THE FUTURE / CTA (150-200 words): How to get started and what to look forward to.

WRITING STYLE:
- Expert yet conversational. Like a high-level strategist talking to a peer.
- Narrative-driven. Tell stories of how this changes a day-in-the-life.
- Avoid tech-jargon and filler. Every section must be interesting and valuable.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://shopcliffmart.com',
        'X-Title': 'CliffMart Content Engine'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: 'You are an expert technical writer specializing in AI automation, business workflows, and practical implementation guides. You write in a clear, engaging style that balances technical depth with accessibility. Your content is always specific, actionable, and grounded in real-world scenarios.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Count words
    const wordCount = content.split(/\\s+/).length;
    console.log(`✅ Generated ${wordCount} words`);
    
    return content;
    
  } catch (error) {
    console.error('❌ Error generating content:', error.message);
    return null;
  }
}

// Convert markdown-style content to HTML
function markdownToHtml(content) {
  let lines = content.trim().split('\n');
  let startIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || /^(HOOK|1\. HOOK|1\. THE PROBLEM|THE PROBLEM|INTRODUCTION|SUBTITLE):?$/i.test(line) || line === "") {
      startIndex = i + 1;
    } else {
      break;
    }
  }
  let cleanContent = lines.slice(startIndex).join('\n').trim();
  const linesAfterCleanup = cleanContent.split('\n');
  const processedLines = linesAfterCleanup.map(line => {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 65 && /^[A-Z0-9\\s\\W]+$/.test(trimmed) && !trimmed.startsWith('<')) {
          return `## ${trimmed}`;
      }
      return line;
  });
  cleanContent = processedLines.join('\n');
  return cleanContent
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/^(?!<[hlu])(.*$)/gim, '<p>$1</p>')
    .replace(/<p><\/p>/g, "");
}

async function generateBlogPost(topic) {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const isoDate = date.toISOString();
  const slug = generateSlug(topic.title);
  
  const articleContent = await generateArticleContent(topic);
  
  if (!articleContent) {
    return null;
  }
  
  const wordCount = articleContent.split(/\\s+/).length;
  const readTime = `${Math.ceil(wordCount / 200)} min read`;
  
  return {
    title: topic.title,
    slug,
    date: dateStr,
    isoDate,
    readTime,
    wordCount,
    excerpt: `A comprehensive guide to ${topic.title.toLowerCase()}. Real strategies, working code, and lessons learned from production deployments.`,
    category: topic.category,
    content: articleContent
  };
}

// Create HTML file for the blog post
function createBlogHtml(post) {
  const htmlContent = markdownToHtml(post.content);
  // Separate potential subtitle from start of content
  const lines = post.content.split('\n');
  let subtitle = "AI-Powered Strategy & Insights";
  if (lines[0] && lines[0].length < 100 && !lines[0].includes('##')) {
      subtitle = lines[0].trim();
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-K0H1T0ETDY"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-K0H1T0ETDY');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | CliffMart Blog</title>
    <meta name="description" content="${post.excerpt}">
    <link rel="canonical" href="https://shopcliffmart.com/blog/${post.slug}.html">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧗</text></svg>">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="https://shopcliffmart.com/blog/images/${post.slug}.png">
    <meta property="og:url" content="https://shopcliffmart.com/blog/${post.slug}.html">
    <meta property="article:published_time" content="${post.isoDate}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="https://shopcliffmart.com/blog/images/${post.slug}.png">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <a href="/" class="logo">🧗 CliffMart</a>
            <div class="nav-links">
                <a href="/products/">Products</a>
                <a href="/about.html">About</a>
                <a href="/blog/">Blog</a>
                <a href="/login.html" class="btn-secondary">Login / Sign Up</a>
            </div>
        </div>
    </nav>
    <article class="blog-post-v2">
        <div class="container">
            <nav class="post-back-nav">
                <a href="/blog/" class="back-link">← Back to Blog</a>
            </nav>
            <header class="post-header-v2">
                <div class="post-meta-v2">
                    <time>${post.date}</time>
                    <span class="separator">·</span>
                    <span class="read-time">${post.readTime}</span>
                    <span class="separator">·</span>
                    <span class="author">CliffMart Team</span>
                </div>
                <h1>${post.title}</h1>
            </header>
            <div class="post-hero-image">
                <img src="/blog/images/${post.slug}.png" alt="${post.title}">
            </div>
            <div class="post-content-v2">
                <p class="post-attribution-v2"><em>By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></em></p>
                <p class="post-subtitle-v2">${subtitle}</p>
                ${htmlContent}
            </div>
        </div>
    </article>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 CliffMart. Built in public by <a href="https://twitter.com/CliffCircuit">@CliffCircuit</a> and <a href="https://twitter.com/timharris707">@timharris707</a>.</p>
        </div>
    </footer>
</body>
</html>`;
return html;
}

// Update posts.json
function updatePostsJson(post) {
  const postsPath = CONFIG.postsJsonPath;
  let posts = [];
  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  }
  posts.unshift({
    title: post.title,
    date: post.date,
    readTime: post.readTime,
    excerpt: post.excerpt,
    url: `/blog/${post.slug}.html`,
    image: `/blog/images/${post.slug}.png`,
    tags: [post.category.toLowerCase(), "OpenClaw", "AI automation"],
    content: post.content.substring(0, 500) + "..."
  });
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
}

// Update sitemap.xml
function updateSitemap(post) {
  const sitemapPath = CONFIG.sitemapPath;
  const today = new Date().toISOString().split('T')[0];
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const newEntry = `  <url>
    <loc>https://shopcliffmart.com/blog/${post.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  sitemap = sitemap.replace('</urlset>', newEntry + '</urlset>');
  fs.writeFileSync(sitemapPath, sitemap);
}

// Deploy and verify
function deployToVercel() {
  console.log('🚀 Deploying to Vercel and waiting for propagation...');
  try {
    const VERCEL_TOKEN = execSync('security find-generic-password -s vercel-token -w', { encoding: 'utf8' }).trim();
    execSync('git add -A && git commit -m "Auto-generated blog content" && git push origin main', { stdio: 'inherit' });
    execSync(`vercel --prod --token ${VERCEL_TOKEN} --yes`, { stdio: 'inherit' });
    console.log('⏳ Waiting 45 seconds for CDN propagation...');
    execSync('sleep 45');
    return true;
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return false;
  }
}

// Post to Twitter
async function postToTwitter(post) {
  console.log(`🐦 Posting to Twitter...`);
  try {
    const tweetText = `New on the blog: ${post.title}\
\
${post.excerpt.substring(0, 140)}...\
\
https://shopcliffmart.com/blog/${post.slug}.html`;
    execSync(`node ~/.openclaw/bin/post-to-cliffcircuit.js "${tweetText}"`, { encoding: 'utf8' });
    console.log(`✅ Posted to @CliffCircuit`);
  } catch (error) {
    console.error('❌ Twitter post failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 CliffMart Content Engine Starting...');
  try {
    const topic = generateTopic();
    const post = await generateBlogPost(topic);
    if (!post) process.exit(1);
    
    // 1. Create file and update data
    const html = createBlogHtml(post);
    fs.writeFileSync(path.join(CONFIG.blogDir, `${post.slug}.html`), html);
    updatePostsJson(post);
    updateSitemap(post);
    await generateHeroImage(post);
    
    // 2. Deploy First
    const deployed = deployToVercel();
    
    // 3. Post to Twitter only if deploy succeeded
    if (deployed) {
      await postToTwitter(post);
    } else {
      console.error('❌ Skipping Twitter post due to deploy failure');
    }
    
    console.log('\
🎉 Content generation complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
