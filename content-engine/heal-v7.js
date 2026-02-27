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

    let subtitle = "AI-Driven Strategic Insights";
    
    const subtitleMatch = body.match(/<p class="post-subtitle-v2">(.*?)<\/p>/i);
    const attrMatch = body.match(/<p class="post-attribution-v2">.*?<\/p>/i);

    if (subtitleMatch) {
       subtitle = subtitleMatch[1];
       body = body.replace(subtitleMatch[0], '');
    }
    if (attrMatch) {
       body = body.replace(attrMatch[0], '');
    }

    // Final Order: Subtitle THEN Attribution
    const newContent = `
                <p class="post-subtitle-v2">${subtitle}</p>
                <p class="post-attribution-v2"><em>By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></em></p>
                ${body.trim()}`;
    
    const newHtml = html.substring(0, findTag + startTag.length) + newContent + "\n            " + after.substring(endIndex);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Fixed Order for: ${file}`);
  }
}

fix();
