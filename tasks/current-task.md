# Current Task

## 当前任务

- 名称：服务请求支付报价与退款运营入口
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 阳律通支付验收后的 admin 订单与退款处理问题
- 本地台账：无
- 当前状态：服务请求报价下单、退款入口和业务状态语义修正已重新发布到生产测试 admin 静态站，待线上人工验收。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 管理订单和退款，不直连数据库。
- 服务请求页已优先展示后端 `userCode`，用于显示 `lma-xxxxxxxx` 用户编号；`userId/identityId` 继续作为排障字段。
- 服务请求详情已具备创建待支付订单入口，符合“用户提交需求 -> 企业微信沟通报价 -> admin 创建待支付订单 -> 用户回小程序支付”的业务流程。
- 服务请求详情已具备已支付订单的退款首片操作：创建退款申请、审核通过、发起退款、单笔同步。
- 服务请求列表已改为展示融合支付/退款事实的业务状态，避免已支付或已退款订单仍被显示成服务处理状态“待处理”。
- 生产测试 admin 静态资源已同步到 `/data/cekaitech-admin/`，未登录访问仍由 Basic Auth 拦截。

## 已完成

- [反馈编号：无] `src/api/legalServiceRequests.ts` 增加 `userCode/orderId/orderNo/amountTotal/orderStatus/paymentStatus` 类型字段，并封装 `createLegalServicePaymentOrder`。
- [反馈编号：无] 新增 `src/api/adminOrders.ts`，封装退款分页、创建、状态更新和单笔同步接口。
- [反馈编号：无] `LegalServiceRequestsPage.vue` 表格和详情改为优先显示用户编号，详情中新增订单与退款区域。
- [反馈编号：无] 退款首片支持从服务请求详情内完成全额退款申请、审核、发起微信退款和主动同步。
- [反馈编号：无] 服务请求列表状态列调整为“业务状态”，按 `orderStatus/paymentStatus` 优先显示 `待支付/已支付待服务/部分退款/已退款`；详情中新增“业务状态”，保留“处理状态”。
- [反馈编号：无] 业务状态语义修正已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-DAL64dLG.js` 和 `LegalServiceRequestsPage-DSHAgg2m.css`。
- [反馈编号：无] 已发布到 `admin.cekaitech.cn`，上线资源包含 `LegalServiceRequestsPage-Dasyl5-0.js` 和 `LegalServiceRequestsPage-BAGzzeWv.css`。

## 最近验证

- `npm.cmd test -- LegalServiceRequestsPage.test.ts legalServiceRequests.test.ts adminOrders.test.ts` 通过 25 项。
- RED/GREEN：`npm.cmd test -- LegalServiceRequestsPage.test.ts` 先失败于已支付/已退款记录仍显示“待处理”，实现业务状态映射后 19 项通过。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、176 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；服务器 active dist 包含 `业务状态`、`已支付待服务` 和 `已退款`。
- `npm.cmd run quality` 通过：Vitest 34 个测试文件、175 项测试通过；`vue-tsc --noEmit` 和 `vite build` 通过，仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 发布验证：`scripts\deploy-admin-static.ps1` 生产构建和上传成功；`https://admin.cekaitech.cn` 未认证返回 401；服务器 active dist 包含 `创建待支付订单`、`创建退款申请` 和 `用户编号`。

## 未完成

- 当前仍是服务请求详情内的最小退款操作入口，尚未建设独立的跨小程序订单/退款总览页面。

## 下一步

1. 线上验收：服务请求页显示 `lma-xxxxxxxx`，业务状态显示 `已支付待服务/已退款`，详情可创建待支付订单，已支付订单可创建和推进退款。
2. 后续建设独立的跨小程序订单/退款总览页面。
