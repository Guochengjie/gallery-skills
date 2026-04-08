function normalizeBaseUrl(secret) {
  const s = (secret || '').trim();
  if (!s) return 'https://wttr.in';
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

window['ai_edge_gallery_get_result'] = async (dataStr, secret) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const location = String(data.location || '').trim();
    const format = String(data.format || '%l:+%c+%t+%h+%w');

    if (!location) {
      return JSON.stringify({error: 'Missing required field: location'});
    }

    const baseUrl = normalizeBaseUrl(secret);
    const locationPath = encodeURIComponent(location).replace(/%20/g, '+');
    const url = `${baseUrl}/${locationPath}?format=${encodeURIComponent(format)}`;

    const response = await fetch(url);
    const text = (await response.text()).trim();

    if (!response.ok) {
      return JSON.stringify({error: `Weather API failed (${response.status}): ${text}`});
    }

    return JSON.stringify({
      result: text,
      source_url: url
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to query weather: ${e.message}`});
  }
};
