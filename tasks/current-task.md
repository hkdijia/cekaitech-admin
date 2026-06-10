# Current Task

## 当前任务

- 名称：admin 生产巡检要素式示范文本健康摘要增强
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / Docimax 要素式示范文本上线后数据治理巡检增强
- 本地台账：无
- 当前状态：已实现待收口验证。

## 当前状态

- admin 数据同步/发布页已有生产巡检卡片，通过 `miniapp-backend` 只读接口获取数据。
- backend 已新增 `elementTemplate` 来源级健康字段，用于展示 Docimax 226 份文本完整度。
- 本仓继续只通过 `miniapp-backend` 受控 API 管理数据，不直连数据库，不控制 crawler。

## 已完成

- `ProductionStatus.elementTemplate` 类型补充来源、版本、期望数量、文件路径数量和就绪状态字段。
- 数据同步/发布页“示范文本”巡检卡片改为展示 `226 / 226` 数量进度、文件元数据完整度、来源名称、来源版本和核验日期。
- 页面保留旧接口字段兜底，不直连数据库、不触发静态文件 HEAD、不写生产数据。

## 未完成

- 本地提交后由用户通过 GitHub Desktop 推送。
- 如需线上可见，再执行 admin 静态资源构建与服务器同步。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 失败于页面仍展示旧“示范文本 226 份”摘要。
- GREEN：同命令通过，2 个测试文件、12 项 Vitest。

## 下一步

1. 运行 admin 构建/质量检查和空白检查。
2. 本地提交，等待用户通过 GitHub Desktop 推送。
