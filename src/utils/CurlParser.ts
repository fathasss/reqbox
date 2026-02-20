/**
 * Simple cURL parser to extract URL, method, headers, and body.
 * This is a basic implementation and might not cover all edge cases,
 * but satisfies the requirement of being "fault-tolerant".
 */
export const parseCurl = (curlString: string) => {
  if (!curlString || !curlString.trim().startsWith('curl')) {
    return null;
  }

  const result: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
  } = {
    method: 'GET',
    url: '',
    headers: {},
    body: '',
  };

  // Regex to match parts of the curl command
  // This is a simplified approach using string splitting and basic flag detection
  const lines = curlString.split(/\\\n|\n/).join(' ').split(' ');
  
  for (let i = 0; i < lines.length; i++) {
    const part = lines[i].trim();

    if (part === '-X' || part === '--request') {
      result.method = lines[++i].replace(/['"]/g, '').toUpperCase();
    } else if (part === '-H' || part === '--header') {
      const headerLine = lines[++i].replace(/['"]/g, '');
      const [key, ...valueParts] = headerLine.split(':');
      if (key && valueParts.length > 0) {
        result.headers[key.trim()] = valueParts.join(':').trim();
      }
    } else if (part === '-d' || part === '--data' || part === '--data-raw' || part === '--data-binary') {
      // Find the start and end of the body content
      // Often bodies are quoted. This is a naive attempt.
      let bodyContent = lines[++i];
      if (bodyContent.startsWith("'") || bodyContent.startsWith('"')) {
        const quote = bodyContent[0];
        if (!bodyContent.endsWith(quote)) {
           // Continue consuming parts until closing quote
           while (i + 1 < lines.length && !bodyContent.endsWith(quote)) {
             bodyContent += ' ' + lines[++i];
           }
        }
        result.body = bodyContent.slice(1, -1);
      } else {
        result.body = bodyContent;
      }
      if (result.method === 'GET') result.method = 'POST'; // Default to POST if data is provided
    } else if (part.startsWith('http') || (part.includes('/') && part.includes('.'))) {
      // Basic URL detection if not explicitly flagged
      if (!result.url) {
        result.url = part.replace(/['"]/g, '');
      }
    }
  }

  return result;
};
