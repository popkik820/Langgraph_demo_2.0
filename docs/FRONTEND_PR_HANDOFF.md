# 知链前端 PR 交接说明

## 目录职责

- `web/`：知链前端、前端 API 代理、页面组件与前端测试。
- `agent/`：现有 LangGraph 后端。此次整理没有用本机运行数据覆盖后端源码。
- `agent/rag/storage/local_kb/source/`：仓库内提供的知识库原始资料，属于后端运行所需内容，应保留。
- `web/.openai/hosting.json`：前端构建配置，不是 Codex 缓存，应保留。
- `web/build/`：构建插件源码，不是构建产物，应保留。

## 本次未纳入 PR 的内容

- `web/runtime/`：用户画像、问答、讲义、Quiz、上传图片、SQLite 数据库等本机运行数据。
- `agent/storage/`、`agent/rag/storage/local_kb/indexes/`：可重建的后端运行数据和 RAG 索引。
- `node_modules/`、`dist/`、`.next/`、`.vinext/`、`.wrangler/`：依赖和构建产物。
- `.codex/`、`.agents/`、`.cache/`、`.runtime/`：Codex/Agent/工具缓存。
- `.env`、`.env.local` 等真实环境变量文件、日志和临时文件。

上述内容已加入 `.gitignore`。用户运行数据应由程序首次运行时按需创建，不应随 PR 提交。

## 前后端连接

1. 在仓库根目录复制 `.env.example` 为 `.env`，填写模型服务密钥。
2. 在 `web/` 下复制 `.env.example` 为 `.env.local`。默认连接本机后端：

   ```env
   AGENT_API_URL=http://127.0.0.1:8000/agent/generate-learning-material
   AGENT_API_BASE_URL=http://127.0.0.1:8000
   QUIZ_GRADE_API_URL=http://127.0.0.1:8000/agent/quiz/grade
   ```

3. 启动后端：

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn agent.api:app --host 127.0.0.1 --port 8000
   ```

4. 启动前端：

   ```powershell
   cd web
   npm ci
   npm run dev
   ```

前端通过自身的 `app/api/` 代理访问后端。后端同学只需保证 `AGENT_API_BASE_URL` 指向可访问的后端，并提供仓库中既有的学习资料生成、Graph Run、用户画像、知识漏洞、学习路径、Quiz 评分等接口，无需在浏览器中直接配置后端地址。

## 提交前检查

```powershell
cd web
npm ci
npm run build
npm run lint
node --test tests/rendered-html.test.mjs
```

提交时不要执行 `git add -f` 强行加入被忽略的运行数据或缓存。建议先运行 `git status --short`，确认没有 `.env`、`runtime`、数据库、用户资料或依赖目录。
