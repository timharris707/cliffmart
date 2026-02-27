const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = path.join(__dirname, '..', 'blog', 'images');

const missingPosts = [
  { slug: 'ai-agent-economics-cost-analysis-for-enterprise-operations', query: 'enterprise ai cost automation' },
  { slug: 'monetizing-ai-skills-the-subscription-model', query: 'ai subscription money revenue' },
  { slug: 'building-an-ai-agent-for-document-processing-step-by-step', query: 'document scanning ai paperwork' }
];

async function fixImages() {
  for (const post of missingPosts) {
    const imagePath = path.join(imagesDir, `${post.slug}.png`);
    const searchUrl = `https://source.unsplash.com/1200x630/?ai,tech,automation,robot,${encodeURIComponent(post.query)}`;
    
    try {
      console.log(`📸 Fetching image for: ${post.slug}...`);
      execSync(`curl -sL "${searchUrl}" -o "${imagePath}"`);
      console.log(`✅ Success: ${post.slug}.png`);
    } catch (error) {
      console.error(`❌ Failed for ${post.slug}:`, error.message);
    }
  }
}

fixImages();
