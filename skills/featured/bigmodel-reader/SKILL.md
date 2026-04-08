---
name: bigmodel-reader
description: 使用 BigModel 网页阅读 API 抓取并解析网页正文，返回可引用内容。
metadata:
  require-secret: true
  require-secret-description: you can get api key from https://bigmodel.cn/usercenter/proj-mgmt/apikeys
  homepage: https://docs.bigmodel.cn/api-reference/工具-api/网页阅读
---

# BigModel Reader

调用 BigModel `POST /paas/v4/reader` 抓取指定 URL，并返回结构化网页内容。

## Prompts / Triggers

- "抓取这个网页并总结"
- "读取这个链接正文"
- "提取这个页面的核心内容并给出处"

## Instructions

调用 `run_js` 工具，参数如下：
- script name: `index.html`
- data: JSON 字符串，字段包括：
  - `url`: 必填。要抓取的 URL。
  - `api_key`: 选填。BigModel API Key。优先使用 skill secret；仅在 secret 未配置时才使用该字段。
  - `timeout`: 选填。默认 20。
  - `no_cache`: 选填。默认 false。
  - `return_format`: 选填。默认 `markdown`。
  - `retain_images`: 选填。默认 true。
  - `no_gfm`: 选填。默认 false。
  - `keep_img_data_url`: 选填。默认 false。
  - `with_images_summary`: 选填。默认 false。
  - `with_links_summary`: 选填。默认 false。

输出要求：
- 回答中应包含来源 URL。
- 引用网页事实时，优先引用 `reader_result.url`。
- 若抓取失败，展示错误并建议用户检查 URL 可访问性或重试。

## Citation

- 文档索引: https://docs.bigmodel.cn/llms.txt
- API 文档: https://docs.bigmodel.cn/api-reference/工具-api/网页阅读
- OpenAPI: https://docs.bigmodel.cn/openapi/openapi.json
