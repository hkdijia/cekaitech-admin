# Current Task

## 当前任务

- 名称：劳动争议结果模板配置二期
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 起诉文书生成模块劳动争议二期讨论
- 本地台账：无
- 当前状态：已发布生产测试环境，待用户线上验收

## 当前状态

- 结果模板配置页按 backend 通用 options 接口读取 `private_lending/divorce/labor` 的生成配置状态。
- 本轮将 `labor` 样例数据扩展到二期字段，backend V138 返回扩展模板后可用同一页面预览工资、解除补偿、二倍工资和仲裁状态内容。
- 本轮已发布 admin 静态资源到生产测试环境。

## 已完成

- [反馈编号：无] `PrivateLendingResultTemplatePage` 增加劳动争议样例数据。
- [反馈编号：无] 页面测试覆盖切换 `labor` 后加载劳动模板，并以 `employeeName/employerName/laborClaim` 预览。
- [反馈编号：无] 测试 mock 中劳动争议 options 改为可编辑，匹配 backend V137 后状态。
- [反馈编号：无] 劳动争议样例数据补齐 `monthlyWage/unpaidWagePeriod/unpaidWageAmount/terminationReason/compensationAmount/doubleWagePeriod/doubleWageAmount/arbitrationStatus`，匹配 backend V138。

## 未完成

- 尚未完成用户线上验收。
- 页面目录项仍沿用兼容路由 `/private-lending-result-template` 和旧权限码。

## 最近验证

- RED：`npm.cmd test -- PrivateLendingResultTemplatePage.test.ts` 失败于切换 `labor` 后仍提交民间借贷样例字段。
- GREEN：同命令通过 8 项。
- 收口：`npm.cmd run quality` 通过 35 个测试文件、172 项并完成生产构建；`git diff --check` 无空白错误，仅 Windows 换行提示。
- 二期 RED：`npm.cmd run test -- --run src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 失败于缺少劳动争议二期样例字段。
- 二期 GREEN：同命令通过 8 项。
- 线上发布：`scripts\deploy-admin-static.ps1` 完成生产构建并同步 `/data/cekaitech-admin/`，上线资源包含 `PrivateLendingResultTemplatePage-CoMBmt9Y.js`。
- 发布校验：服务器静态资源包含 `monthlyWage/arbitrationStatus` 二期样例字段，公网 smoke 通过，admin Basic Auth 未登录返回 401。

## 下一步

1. 用户线上验收 admin“结果模板配置 -> 劳动争议”预览结果。
2. 配合小程序真机验收劳动争议生成链路。
