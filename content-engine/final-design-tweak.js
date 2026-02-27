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

async function finalCleanup() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // 1. Italicize Attribution
    html = html.replace(
      '<p class="post-attribution-v2">By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></p>',
      '<p class="post-attribution-v2"><em>By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></em></p>'
    );

    // 2. Remove Redundant Title
    // In the screenshot, it looks like an H2 or a bold paragraph.
    // Let's identify the content section
    const startTag = '<p class="post-attribution-v2">';
    const tagEnd = html.indexOf('</p>', html.indexOf(startTag)) + 4;
    
    if (tagEnd > 4) {
        let contentAfter = html.substring(tagEnd).trim();
        
        // Remove redundant title if it's the first thing after attribution
        // Matches <h2>Title</h2>, <h1>Title</h1>, or <p><strong>Title</strong></p>
        contentAfter = contentAfter.replace(/^<(h[12]|p)>(<strong>)?.*?(<\/strong>)?<\/\1>/i, '');
        
        html = html.substring(0, tagEnd) + "\n                " + contentAfter.trim();
    }
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Finalized: ${file}`);
  }
}

finalCleanup();
