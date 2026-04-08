---
name: ip-query
description: Query public IP and geo info from two providers in parallel with 3-second timeout.
metadata:
  homepage: https://myip.ipip.net/json
---

# IP Query

Query the machine's public IP information from two APIs in parallel.

## Prompts / Triggers

- "What's my public IP?"
- "Query this device IP location"
- "Show my external IP and geo"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: `{}` (empty JSON object)

Execution requirements:
- MUST call both endpoints in parallel:
  - `https://myip.ipip.net/json`
  - `https://api.ip2location.io/`
- MUST enforce a 3-second timeout per endpoint.
- Return both endpoint results (or per-endpoint timeout/error).

Output requirements:
- Provide a short summary of detected IP/location.
- Include source endpoint labels for each result.

## Citation

- https://myip.ipip.net/json
- https://api.ip2location.io/
