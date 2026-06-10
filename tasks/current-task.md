# Current Task

## 当前任务

- 名称：admin 数据治理 LPR 只读预览接入
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / LPR 数据治理采集预览与只读差异链路
- 本地台账：无
- 当前状态：已实现并通过收口验证。

## 当前状态

- admin 数据同步/发布页已有 LPR JSON 发布入口、生产巡检卡片和年度数据导入入口。
- backend 已新增 `POST /api/admin/data-governance/lpr-rates/preview` 只读接口，用于返回 LPR JSON 与当前库差异摘要。
- 本仓继续只通过 `miniapp-backend` 受控 API 管理数据，不直连数据库，不控制 crawler。

## 已完成

- `dataGovernance` API 封装新增 `previewLprRates`，调用 `/api/admin/data-governance/lpr-rates/preview`。
- 数据同步/发布页 LPR JSON tab 新增 “预览 LPR JSON” 按钮，展示新增、跳过、更新、冲突摘要和明细。
- LPR JSON 解析保留 `requestId/sourceKey/sourceVersion/sourceClient/collectedAt/lastCheckedDate/mode/payloadHash` 等治理字段，发布和预览都传完整 payload。
- 预览动作不刷新批次、不提示已发布，只展示差异结果。

## 未完成

- 本地提交后由用户通过 GitHub Desktop 推送。
- 如需线上可见，需要先部署包含 backend preview 接口的新镜像，再执行 admin 静态资源构建与服务器同步。

## 最近验证

- API RED：`npm.cmd run test -- --run src/api/dataGovernance.test.ts` 失败于 `previewLprRates is not a function`。
- API GREEN：同命令通过，1 个测试文件、8 项 Vitest。
- 页面 RED：`npm.cmd run test -- --run src/pages/data-governance/DataGovernancePage.test.ts` 失败于页面丢失 LPR payload 元字段且缺少预览按钮。
- 页面 GREEN：同命令通过，1 个测试文件、6 项 Vitest。
- 定向回归：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 通过，2 个测试文件、14 项 Vitest。
- 质量检查：`npm.cmd run quality` 通过，33 个测试文件、160 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和大 chunk warning。
- 空白检查：`git diff --check` 通过，仅 Windows 换行提示。

## 下一步

1. 本地提交，等待用户通过 GitHub Desktop 推送。
2. 如需线上可见，先部署 backend 新镜像，再发布 admin 静态资源。
