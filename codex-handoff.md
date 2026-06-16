# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：年度数据治理覆盖矩阵 admin 接入已完成并部署到生产测试静态站。
- 最近完成：数据同步/发布页新增“年度覆盖矩阵”页签，调用 backend 年度数据覆盖矩阵只读接口并展示年份、地区/指标覆盖、缺失指标和最近同步批次；生产静态资源已发布到 `/data/cekaitech-admin`。
- 未完成：仍建议登录 `admin.cekaitech.cn` 人工复核“数据同步/发布 -> 年度覆盖矩阵”页面级展示。

## 关键文件

- `src/api/dataGovernance.ts`
- `src/api/dataGovernance.test.ts`
- `src/pages/data-governance/DataGovernancePage.vue`
- `src/pages/data-governance/DataGovernancePage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- 定向测试：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts`
- 质量检查：`npm.cmd run quality`
- 空白检查：`git diff --check`
- 生产静态发布：`powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1`

## 最近验证

- [反馈编号：无] RED/GREEN：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 先失败于缺少覆盖矩阵 API 封装和页面加载，GREEN 后通过 2 个测试文件、15 项。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，Vitest 35 个测试文件、184 项测试通过，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 `@vueuse/core` PURE 注释 warning 和 chunk size warning。
- [反馈编号：无] 生产静态部署：`powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1` 通过，构建生成 `DataGovernancePage-qqL96yll.js` 并上传到 `/data/cekaitech-admin/assets/`；公网 `https://admin.cekaitech.cn` 未登录返回 `401`，服务器静态资源包含 `annual-common-data/coverage-matrix`。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 年度数据治理主线
- 本地台账：无
- 当前状态：已完成本地实现、验证和生产测试静态资源发布

## 注意事项

- 本仓不直连数据库，只通过 `miniapp-backend` 编排接口读写。
- 本轮 admin 依赖 backend 新接口 `POST /api/admin/data-governance/annual-common-data/coverage-matrix`；backend 已发布到生产测试环境，未登录访问该接口返回 `401` 为正常鉴权表现。
- 用户偏好：Codex 可本地提交，远程 GitHub 推送由用户执行。

## 下一步建议

1. 登录 `admin.cekaitech.cn` 人工复核“数据同步/发布 -> 年度覆盖矩阵”。
2. 继续年度数据治理：按覆盖矩阵确认最新有效数据范围并推进缺口补齐。
