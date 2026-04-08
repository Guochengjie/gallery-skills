const API_BASE = 'https://open.bigmodel.cn/api';
const API_PATH = '/paas/v4/web_search';

function normalizeEngine(engine) {
  const allowed = new Set([
    'search_std',
    'search_pro',
    'search_pro_sogou',
    'search_pro_quark'
  ]);
  return allowed.has(engine) ? engine : 'search_pro_quark';
}

function clampCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n)) return 10;
  return Math.min(50, Math.max(1, Math.floor(n)));
}

window['ai_edge_gallery_get_result'] = async (dataStr, secret) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const apiKey = (secret || data.api_key || '').trim();
    const searchQuery = (data.search_query || '').trim();

    if (!apiKey) {
      return JSON.stringify({
        error:
          'Missing API key. Provide data.api_key (can come from system prompt) or skill secret.'
      });
    }
    if (!searchQuery) {
      return JSON.stringify({error: 'Missing required field: search_query'});
    }

    const payload = {
      search_query: searchQuery,
      search_engine: normalizeEngine(data.search_engine),
      search_intent: Boolean(data.search_intent),
      count: clampCount(data.count)
    };

    if (data.search_domain_filter) {
      payload.search_domain_filter = String(data.search_domain_filter);
    }
    if (data.search_recency_filter) {
      payload.search_recency_filter = String(data.search_recency_filter);
    }
    if (data.content_size) {
      payload.content_size = String(data.content_size);
    }
    if (data.request_id) {
      payload.request_id = String(data.request_id);
    }
    if (data.user_id) {
      payload.user_id = String(data.user_id);
    }

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
        error: `BigModel web_search failed (${response.status}): ${message}`
      });
    }

    const results = Array.isArray(json.search_result) ? json.search_result : [];
    const citations = results
      .map((item, idx) => {
        const n = idx + 1;
        const title = item?.title || `Result ${n}`;
        const link = item?.link || '';
        const content = (item?.content || '').replace(/\s+/g, ' ').trim();
        return {
          index: n,
          title,
          link,
          snippet: content
        };
      })
      .filter((item) => item.link);

    const lines = [];
    lines.push(`query: ${searchQuery}`);
    lines.push(`engine: ${payload.search_engine}`);
    lines.push(`total_results: ${results.length}`);
    lines.push('');

    if (!results.length) {
      lines.push('未检索到结果，请尝试更具体关键词或切换搜索引擎。');
    } else {
      lines.push('Citations:');
      citations.forEach((c) => {
        lines.push(`[${c.index}] ${c.title}`);
        lines.push(c.link);
        if (c.snippet) lines.push(`摘要: ${c.snippet}`);
        lines.push('');
      });
      lines.push('请在最终回答中按 [n](URL) 形式引用来源。');
    }

    return JSON.stringify({
      result: lines.join('\n'),
      citations,
      raw: json
    });
  } catch (e) {
    console.error(e);
    return JSON.stringify({error: `Failed to call web_search: ${e.message}`});
  }
};
