const WEATHER_BASE_URL = 'https://wttr.in';

window['ai_edge_gallery_get_result'] = async (dataStr, secret) => {
  try {
    const data = JSON.parse(dataStr || '{}');
    const location = String(data.location || secret || '').trim();
    const format = String(data.format || '%l:+%c+%t+%h+%w');

    if (!location) {
      return JSON.stringify({
        error: 'Missing location. Provide data.location or set a default city in skill secret.'
      });
    }

    const locationPath = encodeURIComponent(location).replace(/%20/g, '+');
    const url = `${WEATHER_BASE_URL}/${locationPath}?format=${encodeURIComponent(format)}`;

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
