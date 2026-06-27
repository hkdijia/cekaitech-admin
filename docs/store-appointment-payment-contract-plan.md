# 门店预约支付商业闭环包契约规划

## 目标

本文档定义门店预约支付商业闭环包的产品和后端契约规划，用于承接“支付能力最终需要实现”的商业化目标。

当前状态为规划态。本轮不新增 API client，不新增页面入口，不调用真实支付，不创建订单，不写生产数据，不改变基础预约包页面能力。

## 当前边界

支付商业闭环包最终需要实现，但不能混入当前基础预约包。

基础预约包继续负责：

- 预约列表
- 预约详情
- 状态日志
- 门店资料
- 项目目录
- 员工名册
- 预约规则
- 配置快照
- 配置回滚

基础预约包不得出现半成品支付入口，不得用 `priceText` 伪装真实金额。`priceText` 只能作为展示文案，不能作为支付金额、定金、退款金额或对账金额。

## 产品范围

支付商业闭环包至少覆盖：

- 支付产品设计：免费预约、定金、全款、到店付和组合策略。
- 订单生成：从预约或服务项目生成后端订单。
- 微信支付或服务商模式：支持客户自有商户号、服务商子商户和平台代运营三类交付模式。
- 支付状态同步：支付成功、支付失败、关闭、超时和异常补偿。
- 退款规则：取消退款、部分退款、违约扣款和人工退款审核。
- 到店核销：核销权限、核销记录和反核销边界。
- 对账：支付单、退款单、订单和预约之间的核对口径。
- 风控与确认：敏感操作二次确认、权限校验和审计。

## 后端订单模型

后端订单模型应独立于基础预约配置模型，建议至少包含：

- `paymentOrderId`
- `appointmentId`
- `storeCode`
- `subject`
- `amountCent`
- `currency`
- `paymentMode`
- `paymentChannel`
- `merchantMode`
- `merchantNo`
- `outTradeNo`
- `transactionId`
- `paymentStatus`
- `orderStatus`
- `paidAt`
- `closedAt`
- `refundableAmountCent`
- `createdAt`
- `updatedAt`

金额必须使用后端正式字段，例如 `amountCent` 和 `currency`。前端展示字段不得反推真实支付金额。

## 后端契约方向

正式实现前，需要由 `miniapp-backend` 提供受控 API。候选契约方向如下：

- `POST /api/admin/store-appointment-payments/orders`
- `GET /api/admin/store-appointment-payments/orders/{paymentOrderId}`
- `POST /api/admin/store-appointment-payments/orders/{paymentOrderId}/close`
- `POST /api/admin/store-appointment-payments/orders/{paymentOrderId}/refunds`
- `GET /api/admin/store-appointment-payments/refunds`
- `POST /api/admin/store-appointment-payments/writeoffs`
- `GET /api/admin/store-appointment-payments/reconciliation`

这些路径仅为规划态。后端接口、权限、错误码、幂等、审计和字段白名单未完成前，`cekaitech-admin` 不得接入这些路径。

## 权限码

支付商业闭环包需要独立权限码，不能复用基础预约配置权限直接放行：

- `admin:store-appointment-payment:view`
- `admin:store-appointment-payment:manage`
- `admin:store-appointment-refund:manage`
- `admin:store-appointment-writeoff:manage`
- `admin:store-appointment-reconciliation:view`

具体命名以后端正式契约为准。客户交付时可以映射到客户自身角色体系，但模块内部不得绑定内部角色名。

## 审计和安全

所有写入操作都必须具备：

- 后端鉴权和租户隔离。
- `storeCode` 范围校验。
- 幂等请求标识。
- 操作人、操作时间、操作来源和操作结果审计。
- 真实金额、商户号、支付单号和退款单号脱敏展示。
- 敏感动作二次确认。
- 失败原因、异常补偿和人工处理路径。

不得把商户密钥、证书、客户 secret、支付回调密钥或服务商敏感配置写入前端构建产物。

## 异常补偿

支付商业闭环包必须设计异常补偿：

- 下单成功但拉起支付失败。
- 用户支付成功但回调延迟。
- 后端查单状态与本地订单状态不一致。
- 退款申请成功但退款回调延迟。
- 取消预约与支付订单关闭状态不一致。
- 核销后发生退款申请。
- 对账发现支付单、退款单和预约记录不一致。

异常补偿必须由后端提供受控接口，前端只展示状态和触发受权限保护的操作。

## Admin 接入前置条件

在 `cekaitech-admin` 增加支付入口前，必须先完成：

- 支付产品设计。
- 后端订单模型。
- 后端 API 契约和契约测试。
- 权限码和角色映射。
- 审计、幂等和风控设计。
- 微信支付或服务商模式接入方案。
- 支付状态同步和异常补偿设计。
- 退款、取消、超时、违约和核销规则。
- 对账和导出设计。
- 灰度、回滚和人工验收路径。

本轮不新增 API client，不新增页面入口，不在当前门店预约页面添加支付按钮、支付配置、创建支付订单、退款或核销入口。

## 验收门禁

支付商业闭环包进入实现阶段前，至少需要以下门禁：

- 后端契约测试覆盖下单、查单、关单、退款、核销和对账。
- 前端契约测试确认只调用后端正式路径，不直连微信支付或数据库。
- 权限测试确认无权限用户不可创建订单、退款、核销或查看对账。
- 审计测试确认每个写动作都有审计记录。
- 幂等测试确认重复请求不会重复扣款、退款或核销。
- 生产配置检查确认构建产物不包含商户密钥、证书或客户 secret。
- 人工验收覆盖免费预约、定金、全款、到店付、取消退款、超时关闭和异常补偿。

## 禁止能力

当前规划不实现：

- 支付配置页面
- 支付订单创建
- 微信支付拉起
- 退款处理
- 到店核销
- 对账导出
- 商户号配置
- 支付回调处理
- 服务商子商户配置
- 客户账户余额、会员卡、积分或优惠券

这些能力需要独立需求、后端契约、权限、审计、安全和验收设计后再进入实现。

## 验收命令

本规划资产的最小验收命令：

- `npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs`
- `npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `git diff --check`
