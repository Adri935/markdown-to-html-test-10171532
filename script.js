// Helper function to parse data URLs
function parseDataUrl(url) {
  if (!url.startsWith('data:')) {
    throw new Error('Invalid data URL');
  }

  const commaIndex = url.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid data URL format');
  }

  const header = url.substring(5, commaIndex); // Remove 'data:' prefix
  const payload = url.substring(commaIndex + 1);
  
  const parts = header.split(';');
  const mime = parts[0] || 'text/plain';
  const isBase64 = parts.includes('base64');
  
  return { mime, isBase64, payload };
}

// Helper function to decode base64 to text
function decodeBase64ToText(b64) {
  try {
    // For browser environments
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error('Base64 decoding failed:', e);
    return '';
  }
}

// Function to get markdown content from attachments
async function getMarkdownContent(attachments) {
  const urlParam = new URLSearchParams(window.location.search).get('url');
  const source = urlParam ? 
    attachments.find(att => att.url === urlParam) : 
    attachments[0];
  
  if (!source) {
    throw new Error('No valid markdown source found');
  }
  
  const url = source.url;
  
  if (url.startsWith('data:')) {
    const { mime, isBase64, payload } = parseDataUrl(url);
    
    if (!mime.includes('markdown') && !mime.includes('text')) {
      throw new Error('Invalid MIME type for markdown');
    }
    
    if (isBase64) {
      return decodeBase64ToText(payload);
    } else {
      return decodeURIComponent(payload);
    }
  } else {
    // For HTTP URLs, fetch the content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.status}`);
    }
    return await response.text();
  }
}

// Main function to process and render markdown
async function renderMarkdown() {
  const outputElement = document.getElementById('markdown-output');
  
  if (!outputElement) {
    console.error('Output element #markdown-output not found');
    return;
  }
  
  try {
    // Show loading state
    outputElement.innerHTML = '<p>Loading markdown content...</p>';
    
    // Get markdown content from attachments
    const markdownText = await getMarkdownContent(window.attachments || [
      { name: "input.md", url: "data:text/markdown;base64,aGVsbG8KIyBUaXRsZQ==" }
    ]);
    
    // Convert markdown to HTML using marked
    if (typeof marked === 'undefined') {
      throw new Error('Marked library not loaded');
    }
    
    const htmlContent = marked.parse(markdownText);
    
    // Render HTML in the output element
    outputElement.innerHTML = htmlContent;
  } catch (error) {
    console.error('Error processing markdown:', error);
    outputElement.innerHTML = `<p>Error loading content: ${error.message}</p>`;
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMarkdown);
} else {
  renderMarkdown();
}