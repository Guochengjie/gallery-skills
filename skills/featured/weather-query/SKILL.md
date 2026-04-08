---
name: weather-query
description: Query weather from wttr.in with compact output. Put your default city name in skill secret.
metadata:
  require-secret: true
  require-secret-description: put default city in secret, e.g. London
  homepage: https://clawhub.ai/steipete/weather
---

# Weather Query

Get current weather quickly using wttr.in style formatting.

## Prompts / Triggers

- "What's the weather in London?"
- "Weather in New York now"
- "Show current weather for Tokyo"



## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with fields:
  - `location`: Optional. City/location, e.g. `London`, `New York`, `JFK`.
  - `format`: Optional. wttr format string. Default: `%l:+%c+%t+%h+%w`

Secret usage:
- Use the skill secret as default city name (for example `London`).
- If `location` is provided in data, it overrides the secret city.
- Weather host is fixed to `https://wttr.in`.

Output requirements:
- Return concise weather text first.
- Include source URL used for fetching.

## Citation

- Reference skill: https://clawhub.ai/steipete/weather
- wttr usage pattern: `curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"`
