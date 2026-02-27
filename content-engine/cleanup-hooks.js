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

async function cleanup() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // Look for the content div
    const startTag = '<div class="post-content-v2">';
    const contentStart = html.indexOf(startTag);
    if (contentStart === -1) continue;

    let contentSection = html.substring(contentStart + startTag.length);
    const endTag = '</div>';
    const contentEnd = contentSection.indexOf(endTag);
    let originalContent = contentSection.substring(0, contentEnd);

    // Clean up <p>Header</p> or <p>HOOK:</p> patterns
    let cleaned = originalContent.trim();
    
    // Remove if first paragraph is basically the title
    cleaned = cleaned.replace(/^<p><strong>.*?<\/strong><\/p>/i, '');
    cleaned = cleaned.replace(/^<p># .*?<\/p>/i, '');
    
    // Remove "HOOK:" or "THE PROBLEM:" labels
    cleaned = cleaned.replace(/<p>HOOK:<\/p>/gi, '');
    cleaned = cleaned.replace(/<p>1\. HOOK<\/p>/gi, '');
    cleaned = cleaned.replace(/<p>1\. THE PROBLEM<\/p>/gi, '');
    cleaned = cleaned.replace(/<p>THE PROBLEM:?<\/p>/gi, '');
    
    // If it starts with an empty paragraph or newline, trim it
    cleaned = cleaned.trim();

    const newHtml = html.substring(0, contentStart + startTag.length) + "\n                " + cleaned + "\n            " + html.substring(contentStart + startTag.length + contentEnd);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Cleaned up: ${file}`);
  }
}

cleanup();
