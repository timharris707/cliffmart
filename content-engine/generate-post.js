#!/usr/bin/env node
/**
 * CliffMart Content Engine - Blog Post Generator
 * Generates 3,000-3,500 word SEO-optimized blog posts every 75 minutes
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
  postsJsonPath: path.join(__dirname, '..', 'blog', 'posts.json')
};

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
    industries: ["E-commerce", "Consulting", "Real Estate", "Healthcare", "Marketing Agencies", "Law Firms", "Accounting", "Photography", "Event Planning", "Fitness Coaching"],
    professions: ["Consultant", "Agency Owner", "Coach", "Freelancer", "Creator", "Developer", "Designer"],
    tasks: ["Lead Generation", "Client Onboarding", "Content Scheduling", "Email Management", "Document Processing"],
    processes: ["Client Communication", "Project Management", "Invoicing", "Scheduling", "Data Entry"]
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
    features: ["Multi-Agent Workflows", "Real-Time Voice Integration", "Autonomous Error Recovery", "Cross-Platform Sync"],
    approaches: ["Knowledge Graph", "Vector Database", "Hybrid", "Federated"],
    numbers: ["10", "50", "100", "1,000"]
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
    models: ["SaaS", "Marketplace", "Consulting", "Hybrid", "Subscription"],
    amounts: ["1,000", "10,000", "100,000"],
    years: ["2026", "2027"]
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
    months: ["January", "February", "March", "April", "May", "June"],
    scales: ["Small Business", "Enterprise", "Solo", "Team", "Agency"]
  }
];

// Generate a random topic
function generateTopic() {
  const category = TOPIC_TEMPLATES[Math.floor(Math.random() * TOPIC_TEMPLATES.length)];
  const template = category.topics[Math.floor(Math.random() * category.topics.length)];
  
  let title = template;
  
  // Replace placeholders
  if (title.includes('{industry}')) {
    title = title.replace('{industry}', category.industries[Math.floor(Math.random() * category.industries.length)]);
  }
  if (title.includes('{profession}')) {
    title = title.replace('{profession}', category.professions[Math.floor(Math.random() * category.professions.length)]);
  }
  if (title.includes('{task}')) {
    title = title.replace('{task}', category.tasks[Math.floor(Math.random() * category.tasks.length)]);
  }
  if (title.includes('{process}')) {
    title = title.replace('{process}', category.processes[Math.floor(Math.random() * category.processes.length)]);
  }
  if (title.includes('{feature}')) {
    title = title.replace('{feature}', category.features[Math.floor(Math.random() * category.features.length)]);
  }
  if (title.includes('{approach}')) {
    title = title.replace('{approach}', category.approaches[Math.floor(Math.random() * category.approaches.length)]);
  }
  if (title.includes('{number}')) {
    title = title.replace('{number}', category.numbers[Math.floor(Math.random() * category.numbers.length)]);
  }
  if (title.includes('{model}')) {
    title = title.replace('{model}', category.models[Math.floor(Math.random() * category.models.length)]);
  }
  if (title.includes('{amount}')) {
    title = title.replace('{amount}', category.amounts[Math.floor(Math.random() * category.amounts.length)]);
  }
  if (title.includes('{year}')) {
    title = title.replace('{year}', category.years[Math.floor(Math.random() * category.years.length)]);
  }
  if (title.includes('{month}')) {
    title = title.replace('{month}', category.months[Math.floor(Math.random() * category.months.length)]);
  }
  if (title.includes('{scale}')) {
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

// Generate the blog post content (this will be replaced with actual AI generation)
async function generateBlogPost(topic) {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const isoDate = date.toISOString();
  const slug = generateSlug(topic.title);
  
  // Generate reading time (3000-3500 words / 200 wpm = 15-18 min)
  const wordCount = Math.floor(Math.random() * (CONFIG.targetWordCount.max - CONFIG.targetWordCount.min) + CONFIG.targetWordCount.min);
  const readTime = `${Math.ceil(wordCount / 200)} min read`;
  
  return {
    title: topic.title,
    slug,
    date: dateStr,
    isoDate,
    readTime,
    wordCount,
    excerpt: `A comprehensive guide to ${topic.title.toLowerCase()}. Real strategies, working code, and lessons learned from production deployments.`,
    category: topic.category
  };
}

// Create HTML file for the blog post
function createBlogHtml(post) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
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
    <meta name="keywords" content="OpenClaw, AI automation, ${post.category.toLowerCase()}, AI assistant, workflow automation">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://shopcliffmart.com/blog/${post.slug}.html">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧗</text></svg>">
    
    <!-- Open Graph / Twitter Card -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="https://shopcliffmart.com/blog/images/${post.slug}.png">
    <meta property="og:url" content="https://shopcliffmart.com/blog/${post.slug}.html">
    <meta property="og:site_name" content="CliffMart">
    <meta property="article:published_time" content="${post.isoDate}">
    <meta property="article:author" content="https://twitter.com/CliffCircuit">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@CliffCircuit">
    <meta name="twitter:creator" content="@CliffCircuit">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="https://shopcliffmart.com/blog/images/${post.slug}.png">
    
    <!-- JSON-LD Article Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${post.title}",
        "description": "${post.excerpt}",
        "image": "https://shopcliffmart.com/blog/images/${post.slug}.png",
        "datePublished": "${post.isoDate}",
        "author": {
            "@type": "Person",
            "name": "Cliff",
            "url": "https://twitter.com/CliffCircuit"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CliffMart",
            "logo": {
                "@type": "ImageObject",
                "url": "https://shopcliffmart.com/blog/images/openclaw-mascot.svg"
            }
        },
        "url": "https://shopcliffmart.com/blog/${post.slug}.html",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://shopcliffmart.com/blog/${post.slug}.html"
        }
    }
    </script>
    
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <a href="/" class="logo">🧗 CliffMart</a>
            <div class="nav-links">
                <a href="/">Products</a>
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
                <p class="post-subtitle-v2">${post.excerpt}</p>
            </header>

            <div class="post-hero-image">
                <img src="/blog/images/${post.slug}.png" alt="${post.title}">
            </div>

            <button class="btn-copy-markdown" onclick="copyAsMarkdown()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy as Markdown for Your Agent
            </button>

            <div class="post-content-v2">
                <p class="lead">Content placeholder - AI generation to be implemented. Target: ${post.wordCount} words on ${post.category}.</p>
                
                <h2>Coming Soon</h2>
                <p>This article is being generated by our content engine. Check back shortly for the full ${post.wordCount}-word guide.</p>
                
                <h2>The Key Topics We'll Cover</h2>
                <ul>
                    <li>Practical implementation strategies</li>
                    <li>Real-world examples and case studies</li>
                    <li>Step-by-step configuration guides</li>
                    <li>ROI calculations and business impact</li>
                    <li>Common pitfalls and how to avoid them</li>
                </ul>
            </div>
        </div>
    </article>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 CliffMart. Built in public by <a href="https://twitter.com/CliffCircuit">@CliffCircuit</a> and <a href="https://twitter.com/timharris707">@timharris707</a>.</p>
        </div>
    </footer>

    <script>
        function copyAsMarkdown() {
            // Markdown copy functionality to be implemented
            alert('Markdown copy feature coming soon!');
        }
    </script>
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
    content: "Full article content to be generated..."
  });
  
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`✅ Updated posts.json with: ${post.title}`);
}

// Update sitemap.xml
function updateSitemap(post) {
  const sitemapPath = CONFIG.sitemapPath;
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Add new URL entry
  const newEntry = `  <url>
    <loc>https://shopcliffmart.com/blog/${post.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  
  // Insert before closing </urlset>
  sitemap = sitemap.replace('</urlset>', newEntry + '</urlset>');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Updated sitemap.xml with: ${post.slug}`);
}

// Create placeholder image reference
function createImagePlaceholder(post) {
  const imagePath = path.join(CONFIG.imagesDir, `${post.slug}.png`);
  
  // Create a text file noting the image needs to be generated
  const notePath = path.join(CONFIG.imagesDir, `${post.slug}.txt`);
  fs.writeFileSync(notePath, `Image needed for: ${post.title}\nTopic: ${post.category}\nGenerated: ${new Date().toISOString()}`);
  
  console.log(`📝 Image placeholder created: ${post.slug}.png`);
}

// Post to Twitter
async function postToTwitter(post) {
  console.log(`🐦 Would post to Twitter: "${post.title}" - https://shopcliffmart.com/blog/${post.slug}.html`);
  // Twitter posting to be implemented
}

// Main execution
async function main() {
  console.log('🚀 CliffMart Content Engine Starting...');
  console.log(`⏰ ${new Date().toLocaleString()}`);
  
  try {
    // Generate topic
    const topic = generateTopic();
    console.log(`\n📝 Topic: ${topic.title}`);
    console.log(`📁 Category: ${topic.category}`);
    
    // Generate post metadata
    const post = await generateBlogPost(topic);
    console.log(`🎯 Target: ${post.wordCount} words`);
    console.log(`🔗 Slug: ${post.slug}`);
    
    // Create HTML file
    const html = createBlogHtml(post);
    const filePath = path.join(CONFIG.blogDir, `${post.slug}.html`);
    fs.writeFileSync(filePath, html);
    console.log(`✅ Created: ${filePath}`);
    
    // Update posts.json
    updatePostsJson(post);
    
    // Update sitemap
    updateSitemap(post);
    
    // Create image placeholder
    createImagePlaceholder(post);
    
    // Post to Twitter
    await postToTwitter(post);
    
    console.log('\n🎉 Content generation complete!');
    console.log(`\nNext steps:`);
    console.log(`1. Review: ${filePath}`);
    console.log(`2. Generate image: blog/images/${post.slug}.png`);
    console.log(`3. Commit and deploy`);
    
  } catch (error) {
    console.error('❌ Error generating content:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateTopic, generateBlogPost, createBlogHtml };