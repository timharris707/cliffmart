const fs = require('fs');
const path = require('path');

const blogDir = '/Users/openclaw/.openclaw/workspace/cliffmart/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

async function fix() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Look for content section
    const startTag = '<div class="post-content-v2">';
    const findTag = html.indexOf(startTag);
    if (findTag === -1) continue;

    let after = html.substring(findTag + startTag.length);
    const endTag = '</div>';
    const endIndex = after.indexOf(endTag);
    let body = after.substring(0, endIndex).trim();

    // 1. Extract first subtitle candidate
    // Usually it was being stripped by previous logic or left in <p>
    // We'll look for the first <p> which often contained the subtitle 
    // OR we will create one from the topic.
    let subtitle = "Understanding AI-Powered Strategic Workflows";
    
    // Cleanup body: remove existing attribution and redundant titles
    body = body.replace(/<p class="post-attribution-v2">.*?<\/p>/gi, '');
    
    // Find the first paragraph
    const pMatch = body.match(/<p>(.*?)<\/p>/i);
    if (pMatch && pMatch[1].length < 120 && !pMatch[1].includes('##')) {
        subtitle = pMatch[1];
        body = body.replace(pMatch[0], ''); // Remove subtitle from body
    }

    // Reconstruction
    const newContent = `
                <p class="post-subtitle-v2">${subtitle}</p>
                <p class="post-attribution-v2">By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></p>
                ${body.trim()}`;
    
    const newHtml = html.substring(0, findTag + startTag.length) + newContent + "\n            " + after.substring(endIndex);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Finalized structure for: ${file}`);
  }
}

fix();
