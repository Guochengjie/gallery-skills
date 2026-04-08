---
name: weather-query
description: Query weather from wttr.in with compact output. Put the weather host URL in skill secret.
metadata:
  require-secret: true
  require-secret-description: put weather host in secret, e.g. https://wttr.in
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
  - `location`: Required. City/location, e.g. `London`, `New York`, `JFK`.
  - `format`: Optional. wttr format string. Default: `%l:+%c+%t+%h+%w`

Secret usage:
- Use the skill secret as weather host URL (for example `https://wttr.in`).
- If secret is not provided, fallback to `https://wttr.in`.

Output requirements:
- Return concise weather text first.
- Include source URL used for fetching.

## Citation

- Reference skill: https://clawhub.ai/steipete/weather
- wttr usage pattern: `curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"`
