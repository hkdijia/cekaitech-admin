# Current Task

## 当前任务

- 名称：LMA-FB-018 法律工具中心管理页
- OpenSpec 变更：无；延续法律助手竞品工具全盘吸收和后台曝光控制切片。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-018`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`HaYpcv`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（管理端定向汇总、全量质量和 diff 检查通过，等待提交、推送和企业微信回写）

## 当前状态

- 新增 `/legal-tool-center` 菜单和路由。
- 新增 `src/api/legalToolCenter.ts`，只调用 `miniapp-backend` 受控后台 API。
- 新增 `LegalToolCenterPage`，按“能力库 / 展示分组 / 曝光入口”维护法律工具中心配置。
- 能力库和曝光入口图标选择复用共享 `MiniappIconPicker` 开源图标目录。
- 页面只编辑结构化字段，不支持任意 WXML/HTML/CSS/JS。

## 已完成

- TDD RED：API 测试失败于 `legalToolCenter` 模块缺失。
- TDD GREEN：API 封装测试通过，1 个测试文件、3 个 Vitest 测试通过。
- TDD RED：页面测试失败于 `LegalToolCenterPage.vue` 缺失。
- TDD GREEN：页面测试通过，1 个测试文件、6 个 Vitest 测试通过。
- TDD RED：路由测试失败于 `/legal-tool-center` 菜单和路由缺失。
- TDD GREEN：路由测试通过，1 个测试文件、14 个 Vitest 测试通过。
- 定向汇总验证通过：3 个测试文件、23 个 Vitest 测试通过。
- 全量质量验证通过：28 个测试文件、116 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过。
- `git diff --check` 通过，仅提示 Windows 换行转换 warning。

## 未完成

- 提交并推送 `cekaitech-admin`。
- 回写企业微信智能表格 record_id=`HaYpcv`。

## 最近验证

- `npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 通过，3 个 Vitest 测试通过。
- `npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，6 个 Vitest 测试通过。
- `npm.cmd run test -- --run src/router/router.test.ts` 通过，14 个 Vitest 测试通过。
- `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/router/router.test.ts` 通过，3 个测试文件、23 个 Vitest 测试通过。
- `npm.cmd run quality` 通过，28 个测试文件、116 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- `git diff --check` 通过，仅提示 Windows 换行转换 warning。

## 下一步

1. 提交并推送 `cekaitech-admin`。
2. 回写 `LMA-FB-018` 阶段状态。
