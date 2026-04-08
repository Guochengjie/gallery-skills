---
name: arithmetic-calculator
description: Evaluate arithmetic expressions reliably and return exact numeric results.
metadata:
  homepage: https://github.com/google-ai-edge/gallery/tree/main/skills/featured/arithmetic-calculator
---

# Arithmetic Calculator

Use this skill for arithmetic evaluation to avoid mental-math mistakes.

## Prompts / Triggers

- "Calculate (5 * 10) / 2"
- "What is 37.5 * 18 - 12?"
- "Compute ((120 - 20) / 4) + 3"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with fields:
  - `expression`: Required. A math expression string.

Supported syntax:
- Numbers (integers/decimals)
- Operators: `+`, `-`, `*`, `/`, `%`
- Parentheses: `(`, `)`
- Power: `^`, `**`, or `power(a, b)`
- Square root: `sqrt(x)`
- Absolute value: `abs(x)`
- Rounding: `floor(x)`, `ceil(x)`, `round(x)`
- Alias: `mod` (same as `%`)

Behavior requirements:
- For all arithmetic or numeric calculations, you MUST invoke this skill first.
- Do NOT perform arithmetic mentally when this skill is available.
- After tool returns, use the returned numeric value in your final answer.
