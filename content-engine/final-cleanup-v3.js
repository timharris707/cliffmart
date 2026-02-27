const fs = require('fs');
const path = require('path');

const blogDir = '/Users/openclaw/.openclaw/workspace/cliffmart/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

async function fix() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // 1. Remove the By @CliffCircuit from the header section (it's redundant)
    // Matches the p tag with class post-subtitle-v2 inside the post-header-v2 block
    html = html.replace(/<p class="post-subtitle-v2">.*?<\/p>/gi, '');

    // 2. Ensure headings in content are clean
    const startTag = '<div class="post-content-v2">';
    const contentIndex = html.indexOf(startTag);
    if (contentIndex !== -1) {
        let after = html.substring(contentIndex + startTag.length);
        const endTag = '</div>';
        const endIndex = after.indexOf(endTag);
        let contentBody = after.substring(0, endIndex).trim();

        // Remove redundant repetitions of the title at the top of the body
        // These often appear as <p>Title</p> or <p><strong>Title</strong></p>
        contentBody = contentBody.replace(/^\s*<p>(<strong>)?.*?(<\/strong>)?<\/p>\s*/i, '');
        // Remove empty paragraphs
        contentBody = contentBody.replace(/<p><\/p>/g, '');

        html = html.substring(0, contentIndex + startTag.length) + "\n                " + contentBody + "\n            " + after.substring(endIndex);
    }
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Fixed: ${file}`);
  }
}

fix();
