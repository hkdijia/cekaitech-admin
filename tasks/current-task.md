# Current Task

## 当前任务

- 名称：LMA-FB-041-C 年度常用数据 admin 核验发布切片
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-041`
- 来源文档：当前会话数据治理闭环规划 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：实施中，管理端定向验证通过，待全量 quality、提交、推送和回写

## 当前状态

- 数据同步/发布页已从 LPR 专用扩展到年度常用数据同步治理。
- 管理端可查看年度数据同步批次、revision，并粘贴结构化年度数据 JSON 通过 `miniapp-backend` 受控同步 API 导入。
- 管理端继续只通过 `miniapp-backend` API 管理结构化字段，不直连数据库，不控制 crawler 进程，不下发任意小程序代码。

## 已完成

- [反馈编号：LMA-FB-041] `src/api/dataGovernance.ts` 新增年度数据同步批次、revision 和同步导入 API 封装。
- [反馈编号：LMA-FB-041] `DataGovernancePage.vue` 新增“年度数据同步批次”“年度数据修订记录”“年度数据 JSON 导入”三个 tab。
- [反馈编号：LMA-FB-041] 页面导入年度 JSON 时会前端校验 `items` 数组存在，再交给后端受控同步。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 失败于年度 API 函数不存在、页面年度 JSON 编辑器不存在。
- GREEN：同一命令通过，2 个测试文件、11 项 Vitest。

## 下一步

1. 运行 `npm.cmd run quality` 和 `git diff --check`。
2. 同步小程序总台账。
3. 提交推送并回写企业微信智能表格 `LMA-FB-041`。
