---
name: x-search
description: Search X (Twitter) posts via xAI Responses API with x_search tool.
metadata:
  require-secret: true
  require-secret-description: you can get api key from https://console.x.ai
  homepage: https://clawhub.ai/jaaneek/x-search
---

# X Search

Search X posts and return summarized findings with citations to original post URLs.

## Prompts / Triggers

- "Search X for latest AI trends"
- "What are people saying on X about <topic>?"
- "Find recent X posts about <keyword>"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with fields:
  - `query`: Required. Search intent text.
  - `model`: Optional. xAI model name. Default: `grok-3-latest`.

Secret usage:
- Use skill secret as `XAI_API_KEY`.

Output requirements:
- Provide a concise summary.
- Include citations with direct URLs when available.
- If API fails, return the exact error reason.

## Citation

- Reference skill: https://clawhub.ai/jaaneek/x-search
- Setup reference: https://console.x.ai
