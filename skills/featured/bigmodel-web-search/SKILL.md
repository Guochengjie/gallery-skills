---
name: bigmodel-web-search
description: 使用 BigModel Web Search API 进行联网搜索，并返回可引用的来源链接。
metadata:
  require-secret: true
  require-secret-description: 可在 BigModel 控制台获取 API Key，也可在提示词里通过 data.api_key 传入。
  homepage: https://docs.bigmodel.cn/api-reference/工具-api/网络搜索
---

# BigModel Web Search

使用智谱 BigModel 的 `Web Search API` 做联网检索，适合需要真实网页来源的问答。

## Prompts / Triggers

- "帮我联网搜索这个问题"
- "查一下最近关于 X 的信息并给出处"
- "用 BigModel 搜索并列出引用"

## Instructions

调用 `run_js` 工具，参数如下：
- script name: `index.html`
- data: JSON 字符串，字段包括：
  - `search_query`: 必填。搜索词，建议 <= 70 字符。
  - `api_key`: 选填。BigModel API Key。若用户已在 system prompt 提供 key，请提取并传入此字段。
  - `search_engine`: 选填。默认 `search_pro_quark`。可选：`search_std`、`search_pro`、`search_pro_sogou`、`search_pro_quark`。
  - `search_intent`: 选填。布尔值，默认 `false`。
  - `count`: 选填。1-50，默认 10。

输出要求：
- 总是优先使用工具返回中的来源链接。
- 回答中必须带 citation，格式建议为 `[n](URL)`。
- 当工具返回 `search_result` 为空时，先告知未检索到结果，再建议用户改写关键词。

## Citation

- 文档索引: https://docs.bigmodel.cn/llms.txt
- API 文档: https://docs.bigmodel.cn/api-reference/工具-api/网络搜索
- OpenAPI: https://docs.bigmodel.cn/openapi/openapi.json
