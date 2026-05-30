# Current Task

## 当前任务

- 名称：LMA-FB-019 数据同步/发布管理端
- OpenSpec 变更：无；延续法律助手数据驱动治理切片，当前 worker 仅实现 cekaitech-admin 管理台部分。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-019`
- 来源文档：当前会话规划 / LMA 产品反馈台账
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（当前 worker 仅改 admin worktree，暂不提交、不推送，等待主线程整合）

## 当前状态

- 在隔离 worktree `test-results/subagent-worktrees/cekaitech-admin-lma-fb-019` 内实施。
- 新增 `/data-governance` 页面作为 LMA-FB-019 管理端入口。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库，不控制 crawler 进程。
- 页面只查询同步批次、修订记录并发布受控 LPR JSON，不提供任意数据库连接或 crawler 控制能力。

## 已完成

- [反馈编号：LMA-FB-019] 已补充数据治理 API、页面和路由测试红灯。
- [反馈编号：LMA-FB-019] 已新增 `src/api/dataGovernance.ts`，封装同步批次、修订记录和 LPR JSON 发布 API。
- [反馈编号：LMA-FB-019] 已新增 `DataGovernancePage.vue`，包含“同步批次 / 修订记录 / LPR JSON 发布”三个标签页和 `items` 数组 guard。
- [反馈编号：LMA-FB-019] 已新增 `/data-governance` 菜单与路由，权限码 `admin:data-governance:view`。

## 未完成

- [反馈编号：LMA-FB-019] 当前 worker 不提交、不推送；后续由主线程整合多仓改动与提交 footer `Refs: LMA-FB-019`。

## 最近验证

- RED：首次 `npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts src/router/router.test.ts` 因隔离 worktree 未安装依赖失败于 `vitest is not recognized`；执行 `npm.cmd install` 后重跑进入测试红灯。
- RED：依赖安装后重跑同一命令，失败于 `src/api/dataGovernance.ts` 缺失、`DataGovernancePage.vue` 依赖模块缺失和 `/data-governance` 菜单/路由未声明，符合预期。
- GREEN：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts src/router/router.test.ts` 通过，3 个测试文件、21 项 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，30 个测试文件、127 项 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 差异检查：`git diff --check` 退出 0，仅提示 Windows 换行转换 warning。

## 下一步

1. 主线程整合 LMA-FB-019 多仓改动。
2. 后续联调确认 `miniapp-backend` 三个 `/api/admin/data-governance/*` 接口真实响应字段。
