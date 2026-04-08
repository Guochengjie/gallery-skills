const XAI_API_URL = 'https://api.x.ai/v1/responses';

function extractText(output) {
  if (!Array.isArray(output)) return '';
  const chunks = [];
  for (const item of output) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const c of item.content) {
      if (c?.type === 'output_text' && typeof c.text === 'string') {
        chunks.push(c.text);
      }
    }
  }
  return chunks.join('\n').trim();
}

function extractCitations(output) {
  const citations = [];
  if (!Array.isArray(output)) return citations;

  const urlRegex = /(https?:\/\/x\.com\/[^\s)]+|https?:\/\/twitter\.com\/[^\s)]+)/gi;
  for (const item of output) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const c of item.content) {
      const text = typeof c?.text === 'string' ? c.text : '';
      if (!text) continue;
      const matched = text.match(urlRegex) || [];
      for (const url of matched) {
        if (!citations.includes(url)) citations.push(url);
      }
    }
  }
  return citations;
}

window['ai_edge_gallery_get_result'] = async (dataStr, secret) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const apiKey = (secret || '').trim();
    const query = String(data.query || '').trim();
    const model = String(data.model || 'grok-3-latest').trim();

    if (!apiKey) {
      return JSON.stringify({error: 'Missing XAI API key in skill secret.'});
    }
    if (!query) {
      return JSON.stringify({error: 'Missing required field: query'});
    }

    const payload = {
      model,
      input: query,
      tools: [{type: 'x_search'}]
    };

    const response = await fetch(XAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = {raw: text};
    }

    if (!response.ok) {
      const message = json?.error?.message || json?.message || text;
      return JSON.stringify({
        error: `xAI API failed (${response.status}): ${message}`
      });
    }

    const summary = extractText(json.output || []);
    const citations = extractCitations(json.output || []);
    const lines = [];

    lines.push(summary || 'No summary text returned.');
    lines.push('');
    if (citations.length) {
      lines.push('Citations:');
      citations.forEach((url, idx) => lines.push(`[${idx + 1}] ${url}`));
    } else {
      lines.push('No X post URL citations detected in response.');
    }

    return JSON.stringify({
      result: lines.join('\n'),
      citations,
      raw: json
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to search X: ${e.message}`});
  }
};
