# Current Task

## 当前任务

- 名称：服务请求支付报价与跨小程序订单退款运营入口
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 阳律通支付验收后的 admin 订单与退款处理问题
- 本地台账：无
- 当前状态：服务请求报价下单、退款入口、业务状态语义修正、已退款详情退款处理文案、详情刷新交互和独立跨小程序“订单与退款”运营页均已发布到生产测试 admin 静态站；订单运营页浏览器数据 smoke 待补充有效后台应用 token 后复核。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 管理订单和退款，不直连数据库。
- 服务请求页已优先展示后端 `userCode`，用于显示 `lma-xxxxxxxx` 用户编号；`userId/identityId` 继续作为排障字段。
- 服务请求详情已具备创建待支付订单入口，符合“用户提交需求 -> 企业微信沟通报价 -> admin 创建待支付订单 -> 用户回小程序支付”的业务流程。
- 服务请求详情已具备已支付订单的退款首片操作：创建退款申请、审核通过、发起退款、单笔同步。
- 服务请求列表已改为展示融合支付/退款事实的业务状态，避免已支付或已退款订单仍被显示成服务处理状态“待处理”。
- 服务请求详情的退款处理说明已按订单状态动态展示，已退款订单不再提示可创建退款申请。
- 服务请求详情抽屉右上角已新增刷新按钮，支付或退款状态变化后可直接刷新详情；退款创建、审核、发起和同步成功后也会自动刷新完整详情。
- 全局后台已新增 `/order-operations` “订单与退款”运营页，支持订单汇总/列表、退款列表、退款通知和退款同步异常看板，作为后续跨小程序运营总览入口。
- 生产测试 admin 静态资源已同步到 `/data/cekaitech-admin/`，未登录访问仍由 Basic Auth 拦截。

## 已完成

- [反馈编号：无] `src/api/legalServiceRequests.ts` 增加 `userCode/orderId/orderNo/amountTotal/orderStatus/paymentStatus` 类型字段，并封装 `createLegalServicePaymentOrder`。
- [反馈编号：无] 新增 `src/api/adminOrders.ts`，封装退款分页、创建、状态更新和单笔同步接口。
- [反馈编号：无] `LegalServiceRequestsPage.vue` 表格和详情改为优先显示用户编号，详情中新增订单与退款区域。
- [反馈编号：无] 退款首片支持从服务请求详情内完成全额退款申请、审核、发起微信退款和主动同步。
- [反馈编号：无] 服务请求列表状态列调整为“业务状态”，按 `orderStatus/paymentStatus` 优先显示 `待支付/已支付待服务/部分退款/已退款`；详情中新增“业务状态”，保留“处理状态”。
- [反馈编号：无] 服务请求详情退款处理文案按订单状态动态展示，已退款订单显示已完成退款和无剩余可退金额。
- [反馈编号：无] 服务请求详情新增“刷新”按钮，刷新时同步拉取详情、订单退款记录和外层列表；退款操作成功后自动刷新详情，减少支付/退款回调后的状态滞后感。
- [反馈编号：无] 新增全局“订单与退款”运营页 `/order-operations`，封装并使用订单分页/汇总/同步支付、退款汇总、退款通知观测和退款同步异常看板接口。
- [反馈编号：无] “订单与退款”运营页已发布到 `admin.cekaitech.cn`，上线资源包含 `OrderOperationsPage-CIlMXRzE.js`；静态资源和 Basic Auth 保护已复核。
- [反馈编号：无] 服务请求详情刷新交互已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-oV1z-yx9.js` 和 `LegalServiceRequestsPage-CWBmEXM9.css`。
- [反馈编号：无] 业务状态语义修正已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-DAL64dLG.js` 和 `LegalServiceRequestsPage-DSHAgg2m.css`。
- [反馈编号：无] 已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-Dasyl5-0.js` 和 `LegalServiceRequestsPage-BAGzzeWv.css`。
- [反馈编号：无] 退款处理文案修复已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-CWmvjZwR.js`。

## 最近验证

- RED/GREEN：`npm.cmd test -- router.test.ts adminOrders.test.ts OrderOperationsPage.test.ts` 先分别失败于缺少订单运营路由、API 封装和页面数据加载；实现后 3 个测试文件 27 项通过。
- `npm.cmd run quality` 通过：Vitest 35 个测试文件、183 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；服务器 active dist 包含“订单与退款”；`admin.cekaitech.cn` 未认证返回 401；浏览器访问 `/order-operations` 时旧 admin token 已过期并回到登录页，`admin/234588` 仅为 Basic Auth 非应用登录密码。
- RED/GREEN：`npm.cmd test -- LegalServiceRequestsPage.test.ts` 先失败于详情页缺少“刷新”操作、退款同步后详情状态未更新；实现后 21 项通过。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、178 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；服务器 active dist 包含“刷新”；`admin.cekaitech.cn` 未认证返回 401；浏览器打开请求 `8` 详情后点击“刷新”，详情接口和列表接口均返回 200。
- RED/GREEN：`npm.cmd test -- LegalServiceRequestsPage.test.ts` 先失败于已退款详情仍展示可创建退款申请文案，实现动态退款处理文案后 20 项通过。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、177 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；服务器 active dist 包含“已完成退款，当前订单无剩余可退金额”；浏览器复核请求 `6` 详情已显示新文案且无“创建退款申请”按钮。
- `npm.cmd test -- LegalServiceRequestsPage.test.ts legalServiceRequests.test.ts adminOrders.test.ts` 通过 25 项。
- RED/GREEN：`npm.cmd test -- LegalServiceRequestsPage.test.ts` 先失败于已支付/已退款记录仍显示“待处理”，实现业务状态映射后 19 项通过。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、176 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；服务器 active dist 包含 `业务状态`、`已支付待服务` 和 `已退款`。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、175 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；`https://admin.cekaitech.cn` 未认证返回 401；服务器 active dist 包含 `创建待支付订单`、`创建退款申请` 和 `用户编号`。

## 未完成

- 独立跨小程序订单/退款总览页面已完成本地实现、质量检查和静态发布，待有效后台应用 token 做浏览器数据页 smoke。
- 后续仍需补齐统一支付接入指南，便于其他小程序复用。

## 下一步

1. 获取有效后台应用 token 后线上 smoke `/order-operations`。
2. 补齐统一支付接入指南。
