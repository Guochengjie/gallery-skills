const API_BASE = 'https://open.bigmodel.cn/api';
const API_PATH = '/paas/v4/reader';

function asBoolean(value, fallback) {
  if (value === undefined || value === null) return fallback;
  return Boolean(value);
}

function asInteger(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
}

window['ai_edge_gallery_get_result'] = async (dataStr, secret) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const apiKey = (secret || data.api_key || '').trim();
    const url = (data.url || '').trim();

    if (!apiKey) {
      return JSON.stringify({
        error:
          'Missing API key. Provide data.api_key (can come from system prompt) or skill secret.'
      });
    }
    if (!url) {
      return JSON.stringify({error: 'Missing required field: url'});
    }

    const payload = {
      url,
      timeout: asInteger(data.timeout, 20),
      no_cache: asBoolean(data.no_cache, false),
      return_format: data.return_format ? String(data.return_format) : 'markdown',
      retain_images: asBoolean(data.retain_images, true),
      no_gfm: asBoolean(data.no_gfm, false),
      keep_img_data_url: asBoolean(data.keep_img_data_url, false),
      with_images_summary: asBoolean(data.with_images_summary, false),
      with_links_summary: asBoolean(data.with_links_summary, false)
    };

    const response = await fetch(`${API_BASE}${API_PATH}`, {
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
        error: `BigModel reader failed (${response.status}): ${message}`
      });
    }

    const rr = json.reader_result || {};
    const output = [];
    output.push(`title: ${rr.title || ''}`);
    output.push(`source: ${rr.url || url}`);
    if (rr.description) output.push(`description: ${rr.description}`);
    output.push('');
    output.push('content:');
    output.push(rr.content || '');
    output.push('');
    output.push('请在回答中引用 source 链接。');

    return JSON.stringify({
      result: output.join('\n'),
      source_url: rr.url || url,
      raw: json
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to call reader: ${e.message}`});
  }
};
