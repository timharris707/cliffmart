const fs = require('fs');
const path = require('path');

const blogDir = '/Users/openclaw/.openclaw/workspace/cliffmart/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

async function fix() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    const startTag = '<div class="post-content-v2">';
    const findTag = html.indexOf(startTag);
    if (findTag === -1) continue;

    let after = html.substring(findTag + startTag.length);
    const endTag = '</div>';
    const endIndex = after.indexOf(endTag);
    let body = after.substring(0, endIndex).trim();

    // Remove existing subtitle and attribution from body
    body = body.replace(/<p class="post-subtitle-v2">.*?<\/p>/gi, '');
    body = body.replace(/<p class="post-attribution-v2">.*?<\/p>/gi, '');
    
    // Find the subtitle: it's the first paragraph that looks like a subtitle (starts with "Understanding", "A Strategic", "The", etc.)
    let subtitle = "AI-Driven Strategic Insights";
    const pMatches = body.match(/<p>(.*?)<\/p>/gi);
    if (pMatches) {
        for (const p of pMatches) {
            const text = p.replace(/<\/?p>/g, '').trim();
            // Look for subtitle-like patterns
            if (text.match(/^(Understanding|A Strategic|The Future|Exploring|How|The Complete|Transforming|Maximizing)/i) && text.length < 100) {
                subtitle = text;
                body = body.replace(p, ''); // Remove from body
                break;
            }
        }
    }

    // Reconstruct with correct order: Subtitle THEN Attribution
    const newContent = `
                <p class="post-subtitle-v2">${subtitle}</p>
                <p class="post-attribution-v2"><em>By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></em></p>
                ${body.trim()}`;
    
    const newHtml = html.substring(0, findTag + startTag.length) + newContent + "\n            " + after.substring(endIndex);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Fixed subtitle for: ${file}`);
  }
}

fix();
