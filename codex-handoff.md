# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：MVP 设计完成，待用户复核
- 最近完成：确认后台框架优先、Vue 3 + Vite + TypeScript + Element Plus、首批占位页面范围，并写入 `docs/admin-mvp-design.md`
- 未完成：实现计划、前端工程初始化、页面实现、真实 API 对接

## 关键文件

- `docs/admin-mvp-design.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `docs/变更日志.md`
- `README.md`
- `AGENTS.md`

## 关键命令

- 当前仍为文档阶段，暂无构建命令。

## 最近验证

- 文档阶段，无自动化测试。

## 注意事项

- 首版只搭后台壳和占位页面，不接真实接口。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- `.superpowers/` 是 brainstorming 静态预览目录，已加入 `.gitignore`。

## 下一步建议

1. 等用户复核 `docs/admin-mvp-design.md`。
2. 复核通过后编写实现计划。
3. 再初始化 Vue 3 工程。
