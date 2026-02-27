const fs = require('fs');
const path = require('path');

const blogDir = '/Users/openclaw/.openclaw/workspace/cliffmart/blog';

// Process all HTML files in the blog directory
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

function markdownToHtmlHealed(content) {
  let lines = content.trim().split('\n');
  
  // Skip lines until we find the real body text
  let startIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.startsWith('#') || 
        /^(HOOK|1\. HOOK|1\. THE PROBLEM|THE PROBLEM|INTRODUCTION|SUBTITLE):?$/i.test(line) ||
        line === "") {
      startIndex = i + 1;
    } else {
      break;
    }
  }
  
  let cleanContent = lines.slice(startIndex).join('\n').trim();

  // Convert "ALL CAPS" lines into proper headers
  const linesAfterCleanup = cleanContent.split('\n');
  const processedLines = linesAfterCleanup.map(line => {
      const trimmed = line.trim();
      // If line is ALL CAPS and reasonably short, treat it as a header
      if (trimmed.length > 5 && trimmed.length < 65 && /^[A-Z0-9\s\W]+$/.test(trimmed) && !trimmed.startsWith('<')) {
          return `## ${trimmed}`;
      }
      return line;
  });
  cleanContent = processedLines.join('\n');

  return cleanContent
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^(?!<[hlu])(.*$)/gim, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

async function heal() {
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Extract the raw text from the current paragraphs to "re-generate" clean HTML
    const startTag = '<div class="post-content-v2">';
    const findTag = html.indexOf(startTag);
    if (findTag === -1) continue;

    const contentSection = html.substring(findTag + startTag.length);
    const endTag = '</div>';
    const contentEnd = contentSection.indexOf(endTag);
    let originalHtml = contentSection.substring(0, contentEnd).trim();

    // Convert existing <p> tags back to "near markdown" line breaks to re-process headers
    let rawText = originalHtml
        .replace(/<p class="post-attribution-v2">.*?<\/p>/gi, '') // Remove existing attribution
        .replace(/<\/p><p>/gi, '\n\n')
        .replace(/<\/?p>/gi, '')
        .replace(/<\/?strong>/gi, '**')
        .replace(/<\/?em>/gi, '*')
        .replace(/<\/?h[23]>/gi, '\n\n') // Flatten existing wrong headers
        .trim();

    const healedHtmlContent = markdownToHtmlHealed(rawText);
    
    // Re-assembly with Correct Attribution placement
    const newHtml = html.substring(0, findTag + startTag.length) + 
                    '\n                <p class="post-attribution-v2"><em>By <a href="https://x.com/CliffCircuit" target="_blank">@CliffCircuit</a></em></p>\n                ' + 
                    healedHtmlContent + 
                    '\n            ' + html.substring(findTag + startTag.length + contentEnd);
    
    fs.writeFileSync(filePath, newHtml);
    console.log(`✅ Healed & added attribution to: ${file}`);
  }
}

heal();
