# 门店预约配置审计记录列表后端契约设计

## 目标

本文档只定义门店预约配置审计记录列表的后端契约设计，用于后续让管理员从已知 `auditLogId` 回滚，升级为先查询、筛选、确认审计记录，再执行受控回滚。

当前状态为设计态。本轮不新增 API client，不新增页面入口，不改变现有回滚组件，不实现后端接口，不写生产数据。

## 设计态接口

未来接口建议：

- `GET /api/admin/store-appointment-config/stores/{storeCode}/audit-logs`

该接口用于读取指定 `storeCode` 下四个中性配置面的审计记录列表。接口上线前，`cekaitech-admin` 仍只能按已知 `auditLogId` 调用既有回滚预览和执行接口。

## 权限和边界

- 所需权限：`admin:store-appointment-config:manage`
- 请求必须限定 `storeCode`，不得跨 storeCode 查询。
- 租户、应用和门店归属由 `miniapp-backend` 鉴权决定，前端筛选不能作为隔离依据。
- 列表只服务配置回滚前的人工核对，不代表自动恢复能力。

## 请求参数草案

路径参数：

- `storeCode`：必填，当前门店配置范围。

查询参数：

- `pageNo`：必填，正整数。
- `pageSize`：必填，最大 100。
- `surface`：可选，仅允许 `store-profile`、`service-catalog`、`staff-roster`、`appointment-rules`。
- `targetCode`：可选，用于筛选项目 code、员工 code 或门店 code。
- `operatorId`：可选，后台管理员标识。
- `operationType`：可选，例如 `create`、`update`、`rollback`。
- `dateFrom` / `dateTo`：可选，按审计创建时间筛选。

## 响应字段草案

分页结构沿用当前 admin 分页口径：

- `dataList`
- `totalCount`

单条审计记录建议字段：

- `auditLogId`
- `storeCode`
- `surface`
- `targetCode`
- `operationType`
- `operatorId`
- `operatorName`
- `summary`
- `changedFields`
- `createdAt`
- `rollbackAvailable`

接口不得暴露 raw payload、内部租户字段、支付字段、会员字段、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款或客户账户策略。

## 配置面范围

审计记录列表仅覆盖四个中性配置面：

- `store-profile`
- `service-catalog`
- `staff-roster`
- `appointment-rules`

这些配置面对应当前基础预约包。商业闭环包和增长运营包的审计记录必须另行设计，不能复用本列表草案直接承载。

## 与现有回滚的关系

现有回滚能力：

- `GET /api/admin/store-appointment-config/stores/{storeCode}/rollback-preview/{auditLogId}`
- `POST /api/admin/store-appointment-config/stores/{storeCode}/rollback/{auditLogId}`

未来审计列表只负责帮助管理员找到候选 `auditLogId`。回滚仍需：

- 先预览。
- 人工核对。
- 显式确认。
- 写请求携带 `X-Request-Id`。
- 后端写入新的 rollback 审计记录。

## 前端接入前置条件

在 `cekaitech-admin` 增加审计记录列表入口前，必须先完成：

- 后端接口实现和契约测试。
- 权限码校验。
- 脱敏和字段白名单确认。
- 分页、筛选和排序口径确认。
- 错误码和空状态口径确认。
- 回滚预览与执行链路回归验证。

本轮不新增 API client，不新增页面入口，也不在当前回滚面板中添加列表按钮。

## 禁止能力

当前设计不覆盖：

- 支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略
- 商户号、真实金额、支付单号、退款单号、会员卡号、客户画像、员工登录账号、私联信息、通知模板
- raw payload、内部租户字段、跨门店查询、跨租户查询

这些能力需要独立后端契约、权限、审计、安全和验收设计。

## 验收命令

本设计资产的最小验收命令：

- `npm.cmd run test -- --run scripts/store-appointment-config-audit-contract-index.test.mjs`
- `npm.cmd run test -- --run scripts/store-appointment-config-audit-contract-index.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `git diff --check`
