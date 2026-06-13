# Current Task

## 当前任务

- 名称：文书入口配置事实源统一治理
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 起诉文书生成入口配置治理讨论
- 本地台账：无
- 当前状态：实施中，已完成 admin 旧文书目录入口移除，待全量验证与本地提交

## 当前状态

- 起诉文书入口的配置事实源统一为“小程序编排 / 页面菜单管理”。
- 旧“文书目录配置”页面和 `/miniapp-document-catalog` 路由已移除，避免和页面菜单管理形成两套配置入口。
- “结果模板配置”继续按 backend 通用 options 接口读取案件类型；backend 本轮会从页面菜单派生 options。

## 已完成

- [反馈编号：无] 删除 `src/api/miniappDocumentCatalog.ts` 和对应 API 测试。
- [反馈编号：无] 删除 `src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.vue` 和页面测试。
- [反馈编号：无] 移除 `/miniapp-document-catalog` 路由、侧边栏菜单和联调准备脚本检查项。
- [反馈编号：无] “结果模板配置”页文案从“文书目录”改为“页面菜单中的文书入口”。

## 历史已完成

- [反馈编号：无] `PrivateLendingResultTemplatePage` 增加劳动争议样例数据。
- [反馈编号：无] 页面测试覆盖切换 `labor` 后加载劳动模板，并以 `employeeName/employerName/laborClaim` 预览。
- [反馈编号：无] 测试 mock 中劳动争议 options 改为可编辑，匹配 backend V137 后状态。
- [反馈编号：无] 劳动争议样例数据补齐 `monthlyWage/unpaidWagePeriod/unpaidWageAmount/terminationReason/compensationAmount/doubleWagePeriod/doubleWageAmount/arbitrationStatus`，匹配 backend V138。

## 未完成

- 尚未执行 admin 全量质量检查和空白检查。
- 尚未发布本轮 admin 静态资源到生产测试环境。

## 最近验证

- RED：`npm.cmd run test -- --run src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs` 失败 4 项，旧 `/miniapp-document-catalog` 仍在路由、菜单和联调检查项中。
- GREEN：同命令通过 2 个测试文件、23 项。

## 历史最近验证

- RED：`npm.cmd test -- PrivateLendingResultTemplatePage.test.ts` 失败于切换 `labor` 后仍提交民间借贷样例字段。
- GREEN：同命令通过 8 项。
- 收口：`npm.cmd run quality` 通过 35 个测试文件、172 项并完成生产构建；`git diff --check` 无空白错误，仅 Windows 换行提示。
- 二期 RED：`npm.cmd run test -- --run src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 失败于缺少劳动争议二期样例字段。
- 二期 GREEN：同命令通过 8 项。
- 线上发布：`scripts\deploy-admin-static.ps1` 完成生产构建并同步 `/data/cekaitech-admin/`，上线资源包含 `PrivateLendingResultTemplatePage-CoMBmt9Y.js`。
- 发布校验：服务器静态资源包含 `monthlyWage/arbitrationStatus` 二期样例字段，公网 smoke 通过，admin Basic Auth 未登录返回 401。

## 下一步

1. 跑 `npm.cmd run quality` 和空白检查。
2. 本地提交后由用户推送远程。
3. 后续如需要上线 admin 静态资源，再执行部署脚本并 smoke。
