const ENDPOINTS = [
  {name: 'ipip', url: 'https://myip.ipip.net/json'},
  {name: 'ipsb', url: 'https://api.ip.sb/geoip/'}
];

async function fetchWithTimeout(endpoint, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint.url, {
      method: 'GET',
      signal: controller.signal
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = {raw: text};
    }

    if (!response.ok) {
      return {
        source: endpoint.name,
        url: endpoint.url,
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}`,
        raw: json
      };
    }

    return {
      source: endpoint.name,
      url: endpoint.url,
      ok: true,
      status: response.status,
      data: json
    };
  } catch (e) {
    const isTimeout = e?.name === 'AbortError';
    return {
      source: endpoint.name,
      url: endpoint.url,
      ok: false,
      error: isTimeout ? `Timeout after ${timeoutMs}ms` : e.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

function summarize(results) {
  const lines = [];
  lines.push('IP query results:');
  lines.push('');

  for (const item of results) {
    lines.push(`- source: ${item.source}`);
    lines.push(`  url: ${item.url}`);
    if (!item.ok) {
      lines.push(`  status: failed (${item.error || 'unknown error'})`);
      continue;
    }

    if (item.source === 'ipip') {
      const ip = item.data?.data?.ip || item.data?.ip || 'unknown';
      const location = Array.isArray(item.data?.data?.location)
        ? item.data.data.location.filter(Boolean).join(' ')
        : 'unknown';
      lines.push(`  ip: ${ip}`);
      lines.push(`  location: ${location}`);
      continue;
    }

    if (item.source === 'ipsb') {
      const ip = item.data?.ip || 'unknown';
      const location = [
        item.data?.country,
        item.data?.region,
        item.data?.city
      ]
        .filter(Boolean)
        .join(' ');
      lines.push(`  ip: ${ip}`);
      lines.push(`  location: ${location || 'unknown'}`);
      continue;
    }
  }

  return lines.join('\n');
}

window['ai_edge_gallery_get_result'] = async () => {
  try {
    const timeoutMs = 3000;
    const tasks = ENDPOINTS.map((ep) => fetchWithTimeout(ep, timeoutMs));
    const results = await Promise.all(tasks);

    return JSON.stringify({
      result: summarize(results),
      results
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to query IP: ${e.message}`});
  }
};
