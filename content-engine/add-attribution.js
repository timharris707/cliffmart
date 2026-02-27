const fs = require('fs');
const path = require('path');

const blogDir = '/Users/openclaw/.openclaw/workspace/cliffmart/blog';

const files = [
  'ai-agent-economics-cost-analysis-for-enterprise-operations.html',
  'building-an-ai-agent-for-document-processing-step-by-step.html',
  'monetizing-ai-skills-the-subscription-model.html',
  'pricing-ai-services-what-actually-works.html',
  'how-we-built-cross-platform-sync-technical-architecture.html',
  'how-operations-managers-can-save-20-hours-week-with-openclaw.html'
];

async function addAttribution() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // Look for the content div
    const startTag = '<div class="post-content-v2">';
    const findTag = html.indexOf(startTag);
    if (findTag === -1) continue;

    // Check if it already has attribution to avoid duplicates
    if (html.includes('post-attribution-v2')) continue;

    const insertion = '\n                <p class="post-attribution-v2">By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></p>';
    
    const newHtml = html.substring(0, findTag + startTag.length) + insertion + html.substring(findTag + startTag.length);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Added attribution to: ${file}`);
  }
}

addAttribution();
