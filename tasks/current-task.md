# Current Task

## 当前任务

- 名称：要素式示范文本静态文件管理端入口
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话示范文本下载与 `static.cekaitech.cn` 静态文件闭环讨论
- 本地台账：无
- 当前状态：已实现并完成定向页面/API 测试、全量质量验证和空白检查，待本地提交和用户手动推送。

## 当前状态

- 法律工具中心新增“示范文本文件”页签。
- 管理端可查看后端清单、发布前校验结果和校验问题。
- 管理端可粘贴结构化 JSON 执行导入预检，具备管理权限时可确认导入。
- 本仓继续只通过 `miniapp-backend` 受控 API 管理数据，不直连数据库，不下发任意小程序代码。

## 已完成

- 新增示范文本文件清单、校验、导入预检、确认导入 API 封装。
- 页面新增清单摘要、文件表格、导入 JSON 编辑区和导入结果展示。
- 页面测试覆盖挂载加载、清单/校验展示、导入预检和确认导入调用。

## 未完成

- 本地提交后由用户通过 GitHub Desktop 推送。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于示范文本文件接口未被页面调用。
- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，1 个测试文件、13 项 Vitest。
- API 定向：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 通过，1 个测试文件、8 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、151 项 Vitest，类型检查和构建通过。
- 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 本地提交，等待用户手动推送。
2. 继续推进静态文件上传目录/生产域名配置或下一批工具完整度复核。
