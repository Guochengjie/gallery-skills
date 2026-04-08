---
name: python-pyodide
description: Run small Python snippets in-browser using Pyodide and return execution output.
metadata:
  homepage: https://pyodide.org/en/stable/
---

# Python via Pyodide

Run lightweight Python code inside a JavaScript skill through Pyodide (WebAssembly-based Python runtime).

## Prompts / Triggers

- "Run this Python code"
- "Use Python to transform this JSON"
- "Quickly compute this with Python"

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with fields:
  - `code`: Required. Python code to execute.
  - `variables`: Optional. JSON object. Key-value pairs to preload into Python globals.

Constraints:
- Keep code short and deterministic.
- Ask for confirmation before running code that is very long or may be expensive.
- Require the Python snippet to set a `result` variable, then return it.

## Citation

Runtime: Pyodide
- https://pyodide.org/en/stable/
- https://github.com/pyodide/pyodide
