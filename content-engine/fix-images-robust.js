const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = path.join(__dirname, '..', 'blog', 'images');

// Real, high-quality Unsplash image IDs for the specific topics
const configs = [
  { 
    slug: 'ai-agent-economics-cost-analysis-for-enterprise-operations', 
    id: '1551288049-bbdac8928a1e' // Data/Charts
  },
  { 
    slug: 'monetizing-ai-skills-the-subscription-model', 
    id: '1556742049-0cfed4f6a45d' // Payments/Cards
  },
  { 
    slug: 'building-an-ai-agent-for-document-processing-step-by-step', 
    id: '1586769852044-693d3937965d' // Documents
  }
];

async function fix() {
  for (const item of configs) {
    const filePath = path.join(imagesDir, `${item.slug}.png`);
    const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=1200&h=630&q=80`;
    
    console.log(`📸 Hard-fixing image for: ${item.slug}...`);
    try {
      execSync(`curl -sL "${url}" -o "${filePath}"`);
      const stats = fs.statSync(filePath);
      if (stats.size < 5000) {
        throw new Error(`Downloaded file is too small (${stats.size} bytes). Likely an error page.`);
      }
      console.log(`✅ Success: ${item.slug}.png (${stats.size} bytes)`);
    } catch (e) {
      console.error(`❌ Failed for ${item.slug}:`, e.message);
      // Fallback to a generic tech image if the specific ID fails
      const fallbackUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=630&q=80';
      execSync(`curl -sL "${fallbackUrl}" -o "${filePath}"`);
    }
  }
}

fix();
